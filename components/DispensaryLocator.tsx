'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  MapRef,
  Marker,
  NavigationControl,
  Source,
  type MapMouseEvent,
} from 'react-map-gl/mapbox';
import type { GeoJSONSource, LngLatBounds } from 'mapbox-gl';
import type { GeoJSON } from 'geojson';
import { DispensaryLocation } from '@/lib/types';
import { formatStoreAddress } from '@/lib/utils';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * Store locator: a viewport-synced list beside a clustered map.
 *
 * Modelled on Mapbox's own demo (labs.mapbox.com/demo-store-locator) with one
 * deliberate departure. That demo serves its stores from an MTS tileset, so
 * below a zoom threshold there is no data to query and it shows "Zoomed out too
 * far — please search or zoom in". We hold all 85 stores in memory, so the list
 * filters to the viewport at every zoom instead of dead-ending. Their message is
 * a tiling constraint, not a design goal.
 *
 * Clustering rather than a Marker per store: a third of these are in Tulsa and
 * individual pins overlap badly at statewide zoom.
 */

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const INITIAL_VIEW = { longitude: -96.15, latitude: 35.85, zoom: 6.3 };
const CAKE = '#E8452F';

/**
 * Pen the camera regionally, the way the Mapbox demo bounds itself to the
 * continental US: without it a visitor can pan into empty ocean and be told
 * there are no stores nearby, which reads as broken rather than empty.
 *
 * Deliberately much wider than the data (which spans lat 33.99–36.75, lon
 * -99.45 to -94.50). A snug box fights the opening camera: at zoom 6.3 the
 * viewport is about 19 degrees of longitude across, so a 9-degree bound cannot
 * contain it and Mapbox clamps, silently overriding the centroid passed as
 * initialView and dragging the opening view west. These bounds are wide enough
 * to leave the opening framing alone while still stopping a pan to another
 * continent.
 */
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-107, 29.5], // south-west
  [-87, 41.5], // north-east
];

type Coords = { latitude: number; longitude: number };
type GeoStatus = 'idle' | 'locating' | 'ready' | 'denied' | 'unavailable';

type Props = {
  locations: DispensaryLocation[];
};

/** Great-circle distance in miles. */
function milesBetween(a: Coords, b: Coords): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function DispensaryLocator({ locations }: Props) {
  const mapRef = useRef<MapRef>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const pinned = useMemo(
    () => locations.filter((l) => l.latitude != null && l.longitude != null),
    [locations]
  );

  /**
   * Frame the actual footprint rather than a hand-picked centre.
   *
   * Picking a point meant choosing between defensible answers that disagree by
   * ~80 miles: the geographic centre of Oklahoma (which is essentially OKC) or
   * the mean of the store coordinates (which sits near Tulsa, because 51 of the
   * 85 stores are there — a density artifact, not a sensible camera). fitBounds
   * sidesteps the question, guarantees every pin is on screen, and re-frames
   * itself as the footprint changes.
   *
   * maxZoom stops a single-store or single-city result from slamming to street
   * level.
   */
  const fitBounds = useMemo(() => {
    if (!pinned.length) return null;
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
    for (const l of pinned) {
      minLng = Math.min(minLng, l.longitude!);
      maxLng = Math.max(maxLng, l.longitude!);
      minLat = Math.min(minLat, l.latitude!);
      maxLat = Math.max(maxLat, l.latitude!);
    }
    // Inflate before fitting. Fitting the raw extent puts the viewport edge
    // exactly on the outermost store, and getBounds().contains() is exclusive
    // at the boundary — the northernmost pin was drawn on the map but excluded
    // from the list, out by 2e-13 of a degree. The margin also gives the edge
    // pins visual breathing room. The floor covers a degenerate extent (one
    // store, or several at one address).
    const padLng = Math.max((maxLng - minLng) * 0.06, 0.05);
    const padLat = Math.max((maxLat - minLat) * 0.06, 0.05);
    return [
      [minLng - padLng, minLat - padLat],
      [maxLng + padLng, maxLat + padLat],
    ] as [[number, number], [number, number]];
  }, [pinned]);

  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);
  const [center, setCenter] = useState<Coords | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');

  const data = useMemo<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    () => ({
      type: 'FeatureCollection',
      features: pinned.map((l) => ({
        type: 'Feature',
        id: l.id,
        geometry: { type: 'Point', coordinates: [l.longitude!, l.latitude!] },
        properties: { id: l.id },
      })),
    }),
    [pinned]
  );

  const recomputeVisible = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    const b: LngLatBounds = map.getBounds()!;
    const c = map.getCenter();
    setCenter({ latitude: c.lat, longitude: c.lng });
    setVisibleIds(
      pinned
        .filter((l) => b.contains([l.longitude!, l.latitude!]))
        .map((l) => l.id)
    );
  }, [pinned]);

  /**
   * Always nearest-first, measured from the visitor if they have shared a
   * location and from the centre of the current view otherwise.
   *
   * The server's order (city A-Z, then name) is wrong for this panel: it opens
   * on the whole state and leads with Ardmore, a small town in the far south,
   * while most stores sit around Tulsa and OKC. Sorting from the map centre
   * needs no permission, works on first paint, and re-sorts as the map moves,
   * which makes "Use My Location" an upgrade of the same mechanic rather than a
   * separate mode. The city-grouped list below the map keeps the alphabetical
   * ordering, where it is the point.
   */
  const visible = useMemo(() => {
    const ids = visibleIds;
    const inView = ids === null ? pinned : pinned.filter((l) => ids.includes(l.id));
    const reference = userLoc ?? center;
    if (!reference) return inView;
    return [...inView].sort(
      (a, b) =>
        milesBetween(reference, { latitude: a.latitude!, longitude: a.longitude! }) -
        milesBetween(reference, { latitude: b.latitude!, longitude: b.longitude! })
    );
  }, [visibleIds, pinned, userLoc, center]);

  const flyTo = useCallback((l: DispensaryLocation) => {
    setSelectedId(l.id);
    mapRef.current?.getMap()?.easeTo({
      center: [l.longitude!, l.latitude!],
      zoom: Math.max(mapRef.current.getMap().getZoom(), 13),
      duration: 600,
    });
  }, []);

  const onMapClick = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature) return;
    const map = mapRef.current?.getMap();
    const [longitude, latitude] = (feature.geometry as GeoJSON.Point).coordinates;

    if (feature.properties?.cluster) {
      const source = map?.getSource('dispensaries') as GeoJSONSource | undefined;
      source?.getClusterExpansionZoom(feature.properties.cluster_id as number, (err, zoom) => {
        if (err || zoom == null) return;
        map?.easeTo({ center: [longitude, latitude], zoom, duration: 500 });
      });
      return;
    }

    const id = feature.properties?.id as string | undefined;
    if (!id) return;
    setSelectedId(id);
    // Bring the matching card into view so map and list stay in step.
    listRef.current
      ?.querySelector(`[data-store="${id}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  const locateMe = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLoc(coords);
        setGeoStatus('ready');
        mapRef.current
          ?.getMap()
          ?.easeTo({ center: [coords.longitude, coords.latitude], zoom: 9, duration: 900 });
      },
      (err) => setGeoStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  if (!TOKEN) {
    return (
      <div className="flex aspect-video items-center justify-center border border-white/10 bg-smoke">
        <p className="micro text-white/30">MAP UNAVAILABLE — NEXT_PUBLIC_MAPBOX_TOKEN NOT SET</p>
      </div>
    );
  }

  const geoMessage: Record<GeoStatus, string | null> = {
    idle: null,
    locating: 'FINDING YOU…',
    ready: null,
    denied: 'LOCATION PERMISSION DENIED',
    unavailable: 'LOCATION UNAVAILABLE',
  };

  return (
    <div className="flex h-[760px] w-full flex-col overflow-hidden border border-white/10 md:h-[640px] md:flex-row">
      {/* Sidebar */}
      <aside className="flex min-h-0 shrink-0 flex-col border-white/10 md:w-[340px] md:border-r">
        <div className="border-b border-white/10 p-5">
          <button
            type="button"
            onClick={locateMe}
            disabled={geoStatus === 'locating'}
            className="micro inline-flex w-full items-center justify-center gap-2 border border-white/30 px-4 py-3 text-white transition-colors hover:border-white hover:bg-white/10 disabled:opacity-50"
          >
            {geoStatus === 'locating' ? 'FINDING YOU…' : 'USE MY LOCATION'}
          </button>
          {geoMessage[geoStatus] && geoStatus !== 'locating' && (
            <p className="micro mt-3 text-cake-soft">{geoMessage[geoStatus]}</p>
          )}
          <p className="micro mt-4 text-white/40">
            {visible.length} {visible.length === 1 ? 'STORE' : 'STORES'} IN VIEW
            {/* Only claimed when measured from the visitor. The list is also
                sorted nearest-first from the map centre, but a mileage figure
                relative to an arbitrary viewport centre would mislead, so the
                per-card distances stay gated on a real location too. */}
            {userLoc && ' · NEAREST TO YOU'}
          </p>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="p-5 text-sm leading-relaxed text-white/50">
              No stores in view. Zoom out or pan to find the nearest CAKE stockist.
            </p>
          ) : (
            <ul>
              {visible.map((l) => {
                const active = l.id === selectedId;
                const miles = userLoc
                  ? milesBetween(userLoc, { latitude: l.latitude!, longitude: l.longitude! })
                  : null;
                return (
                  <li key={l.id} data-store={l.id}>
                    <button
                      type="button"
                      onClick={() => flyTo(l)}
                      className={`w-full border-b border-white/10 p-5 text-left transition-colors ${
                        active ? 'bg-white/10' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="display text-sm text-white">{l.dispensary_name}</span>
                        {miles != null && (
                          <span className="micro shrink-0 text-white/40">
                            {miles < 10 ? miles.toFixed(1) : Math.round(miles)} MI
                          </span>
                        )}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-white/60">
                        {formatStoreAddress(l.address, l.city)}
                      </span>
                      {l.phone && (
                        <span className="mt-1 block text-sm text-white/45">{l.phone}</span>
                      )}
                      {l.recent_strains && l.recent_strains.length > 0 && (
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          {l.recent_strains.slice(0, 4).map((s) => (
                            <span
                              key={s.slug}
                              className="border border-white/12 px-2 py-1 text-xs text-white/70"
                            >
                              {s.name}
                            </span>
                          ))}
                          {l.recent_strains.length > 4 && (
                            <span className="px-1 py-1 text-xs text-white/35">
                              +{l.recent_strains.length - 4}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className="min-h-0 flex-1">
        <Map
          ref={mapRef}
          mapboxAccessToken={TOKEN}
          initialViewState={
            fitBounds
              ? { bounds: fitBounds, fitBoundsOptions: { padding: 56, maxZoom: 11 } }
              : INITIAL_VIEW
          }
          maxBounds={MAX_BOUNDS}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          interactiveLayerIds={['clusters', 'unclustered']}
          // react-map-gl's own props rather than map.on(...) in an effect: the
          // ref is still null on first render, so a manual listener never
          // attaches and the list silently stops tracking the camera.
          //
          // onIdle as well as onLoad because initialViewState.bounds is applied
          // as a fitBounds transition. At load the camera has not settled yet,
          // so sampling getBounds() there misses pins near the edge — the north
          // extreme was drawn on the map but absent from the list. idle fires
          // once the camera comes to rest, including after that initial fit.
          onLoad={recomputeVisible}
          onIdle={recomputeVisible}
          onMoveEnd={recomputeVisible}
          onClick={onMapClick}
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

          {userLoc && (
            <Marker longitude={userLoc.longitude} latitude={userLoc.latitude} anchor="center">
              <span className="relative flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-ink" />
              </span>
            </Marker>
          )}

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
                // The selected store reads larger and fully opaque so the link
                // between a tapped card and its pin is obvious.
                'circle-color': CAKE,
                'circle-radius': ['case', ['==', ['get', 'id'], selectedId ?? ''], 11, 7],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': [
                  'case',
                  ['==', ['get', 'id'], selectedId ?? ''],
                  1,
                  0.8,
                ],
              }}
            />
          </Source>
        </Map>
      </div>
    </div>
  );
}
