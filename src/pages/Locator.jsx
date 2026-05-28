import React, { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { useRetailers, useStrains } from '../lib/data'
import './Locator.css'

// Custom Cake pin
const cakeIcon = L.divIcon({
  className: 'cake-pin',
  html: `<div class="cake-pin-inner"><div class="cake-pin-dot"></div><div class="cake-pin-pulse"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export default function Locator() {
  const { retailers, loading } = useRetailers()
  const { strains } = useStrains()
  const [selectedStrain, setSelectedStrain] = useState('all')
  const [selectedRetailer, setSelectedRetailer] = useState(null)

  const filtered = useMemo(() => {
    if (selectedStrain === 'all') return retailers
    return retailers.filter((r) => r.carries_strains.includes(selectedStrain))
  }, [retailers, selectedStrain])

  return (
    <main className="loc-page">
      <section className="loc-hero">
        <div className="container">
          <div className="mono loc-eyebrow">№ 03 · Find Cake</div>
          <h1 className="display loc-title">
            Select Oklahoma <br />
            <span className="display-italic">dispensaries.</span>
          </h1>
          <p className="loc-sub">
            Cake is not in every store. These are the partners who carry our line the
            way it deserves to be carried.
          </p>
        </div>
      </section>

      <section className="loc-tool">
        <div className="container loc-tool-inner">
          <div className="loc-controls">
            <div className="loc-control-label mono">Filter by strain</div>
            <div className="loc-filters">
              <button
                className={`loc-filter ${selectedStrain === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedStrain('all')}
              >
                All
              </button>
              {strains.map((s) => (
                <button
                  key={s.slug}
                  className={`loc-filter ${selectedStrain === s.slug ? 'is-active' : ''}`}
                  onClick={() => setSelectedStrain(s.slug)}
                  style={{ '--accent': s.accent_color }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="loc-grid">
            <div className="loc-map-wrap">
              {loading ? (
                <div className="loc-map-skel skeleton" />
              ) : (
                <MapContainer
                  center={[35.5, -97.5]}
                  zoom={7}
                  className="loc-map"
                  scrollWheelZoom={false}
                  attributionControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  {filtered.map((r) => (
                    <Marker
                      key={r.id}
                      position={[r.lat, r.lng]}
                      icon={cakeIcon}
                      eventHandlers={{
                        click: () => setSelectedRetailer(r),
                      }}
                    >
                      <Popup className="loc-popup">
                        <div className="loc-popup-name">{r.name}</div>
                        <div className="loc-popup-addr">
                          {r.address}<br />
                          {r.city}, {r.state} {r.zip}
                        </div>
                        <div className="loc-popup-phone">{r.phone}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>

            <div className="loc-list">
              <div className="loc-list-head mono">
                {loading ? '— locations' : `${filtered.length} location${filtered.length === 1 ? '' : 's'}`}
              </div>
              <div className="loc-list-scroll">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="loc-list-skel skeleton" />
                  ))
                ) : (
                  filtered.map((r) => (
                    <button
                      key={r.id}
                      className={`loc-list-item ${selectedRetailer?.id === r.id ? 'is-active' : ''}`}
                      onClick={() => setSelectedRetailer(r)}
                    >
                      <div className="loc-list-name display">{r.name}</div>
                      <div className="loc-list-addr">{r.address}, {r.city}</div>
                      <div className="loc-list-carries mono">
                        Carries {r.carries_strains.length} strain{r.carries_strains.length === 1 ? '' : 's'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
