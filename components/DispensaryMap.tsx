'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  MapRef,
  NavigationControl,
  Popup,
  Source,
  type MapMouseEvent,
} from 'react-map-gl/mapbox';
import type { GeoJSONSource } from 'mapbox-gl';
import type { GeoJSON } from 'geojson';
import Link from 'next/link';
import { DispensaryLocation, RecentStrain } from '@/lib/types';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Clustered store locator.
 *
 * GeoJSON source + circle layers rather than one <Marker> per store: with 85
 * pins and roughly a third of them inside Tulsa, individual markers pile on top
 * of each other at state zoom. Mapbox clusters a GeoJSON source natively, so
 * dense metros collapse into a single count bubble that splits as you zoom.
 *
 * Stores whose address did not geocode are dropped here and still render in the
 * list beneath the map — a missing pin is better than a pin in the wrong town.
 */

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Centre of the geocoded set, wide enough to frame the whole state.
const INITIAL_VIEW = { longitude: -96.15, latitude: 35.85, zoom: 6.3 };

const CAKE = '#E8452F';

type ViewState = { longitude: number; latitude: number; zoom: number };

type Props = {
  locations: DispensaryLocation[];
  /** Override the opening camera. Defaults to a statewide view. */
  initialView?: ViewState;
};

type PopupState = {
  longitude: number;
  latitude: number;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  strains: RecentStrain[] | null;
};

export function DispensaryMap({ locations, initialView }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const pinned = useMemo(
    () => locations.filter((l) => l.latitude != null && l.longitude != null),
    [locations]
  );

  const data = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      type: 'FeatureCollection',
      features: pinned.map((l) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [l.longitude!, l.latitude!] },
        properties: {
          name: l.dispensary_name,
          address: l.address,
          city: l.city,
          phone: l.phone,
          // GeoJSON feature properties must be primitives to survive the
          // Mapbox round-trip, so the strain list travels as a JSON string.
          strains: l.recent_strains ? JSON.stringify(l.recent_strains) : '',
        },
      })),
    }),
    [pinned]
  );

  const onClick = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;

    const map = mapRef.current?.getMap();
    const [longitude, latitude] = (feature.geometry as GeoJSON.Point).coordinates;

    // Cluster: zoom to split it rather than opening a popup for 12 stores.
    if (feature.properties?.cluster) {
      const source = map?.getSource('dispensaries') as GeoJSONSource | undefined;
      source?.getClusterExpansionZoom(
        feature.properties.cluster_id as number,
        (err, zoom) => {
          if (err || zoom == null) return;
          map?.easeTo({ center: [longitude, latitude], zoom, duration: 500 });
        }
      );
      return;
    }

    const raw = feature.properties?.strains;
    setPopup({
      longitude,
      latitude,
      name: feature.properties?.name ?? '',
      address: feature.properties?.address ?? null,
      city: feature.properties?.city ?? null,
      phone: feature.properties?.phone ?? null,
      strains: raw ? (JSON.parse(raw as string) as RecentStrain[]) : null,
    });
  }, []);

  if (!TOKEN) {
    return (
      <div className="flex aspect-video items-center justify-center border border-white/10 bg-smoke">
        <p className="micro text-white/30">MAP UNAVAILABLE — NEXT_PUBLIC_MAPBOX_TOKEN NOT SET</p>
      </div>
    );
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden border border-white/10 md:h-[640px]">
      <Map
        ref={mapRef}
        mapboxAccessToken={TOKEN}
        initialViewState={initialView ?? INITIAL_VIEW}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactiveLayerIds={['clusters', 'unclustered']}
        onClick={onClick}
        onMouseEnter={(e) => {
          const c = e.target.getCanvas();
          if (c) c.style.cursor = 'pointer';
        }}
        onMouseLeave={(e) => {
          const c = e.target.getCanvas();
          if (c) c.style.cursor = '';
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        <Source
          id="dispensaries"
          type="geojson"
          data={data}
          cluster
          clusterMaxZoom={12}
          clusterRadius={45}
        >
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': CAKE,
              'circle-opacity': 0.85,
              'circle-radius': ['step', ['get', 'point_count'], 16, 5, 22, 15, 30],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-opacity': 0.5,
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': ['get', 'point_count_abbreviated'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 13,
            }}
            paint={{ 'text-color': '#ffffff' }}
          />
          <Layer
            id="unclustered"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': CAKE,
              'circle-radius': 7,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-opacity': 0.8,
            }}
          />
        </Source>

        {popup && (
          <Popup
            longitude={popup.longitude}
            latitude={popup.latitude}
            anchor="bottom"
            offset={14}
            closeButton
            closeOnClick={false}
            onClose={() => setPopup(null)}
            maxWidth="300px"
            className="cake-popup"
          >
            <div className="bg-ink p-4">
              <p className="display text-base text-white">{popup.name}</p>
              {popup.address && (
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {popup.address}
                  {popup.city && `, ${popup.city}`}
                </p>
              )}
              {popup.phone && (
                <a
                  href={`tel:${popup.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-2 inline-block text-sm text-white transition-colors hover:text-cake"
                >
                  {popup.phone}
                </a>
              )}
              {popup.strains && popup.strains.length > 0 && (
                <>
                  <p className="micro mt-4 text-white/35">STOCKED IN THE LAST 90 DAYS</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {popup.strains.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/strains/${s.slug}`}
                          className="inline-block border border-white/15 px-2 py-1 text-xs text-white/75 transition-colors hover:border-white/45 hover:text-white"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
