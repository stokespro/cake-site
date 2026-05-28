import React, { useState } from 'react'
import { useStrains } from '../lib/data'
import StrainCard from '../components/StrainCard'
import './Strains.css'

export default function Strains() {
  const { strains, loading } = useStrains()
  const [filter, setFilter] = useState('all')

  const filtered = strains.filter((s) => {
    if (filter === 'all') return true
    if (filter === 'indica') return s.type.toLowerCase().includes('indica')
    if (filter === 'hybrid') return s.type.toLowerCase().includes('hybrid')
    if (filter === 'sativa') return s.type.toLowerCase().includes('sativa')
    return true
  })

  return (
    <main className="strains-page">
      <section className="strains-hero">
        <div className="container">
          <div className="mono strains-hero-eyebrow">The Collection · Est. 2020</div>
          <h1 className="display strains-hero-title">
            Seven strains. <br />
            <span className="display-italic">Every one earned its place.</span>
          </h1>
          <p className="strains-hero-sub">
            Selective genetics, bred by Limited Trees, cultivated to Cake spec. The
            full catalog — past releases and current drop — every cultivar still in
            rotation.
          </p>
        </div>
      </section>

      <section className="strains-filter">
        <div className="container strains-filter-inner">
          <div className="mono strains-count">
            {loading ? '— strains' : `${strains.length} strains in rotation`}
          </div>
          <div className="strains-filters">
            {[
              { id: 'all', label: 'All' },
              { id: 'indica', label: 'Indica' },
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'sativa', label: 'Sativa' },
            ].map((f) => (
              <button
                key={f.id}
                className={`strains-filter-btn ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="strains-grid-wrap">
        <div className="container">
          {loading ? (
            <div className="strains-grid">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="strains-skel skeleton" />
              ))}
            </div>
          ) : (
            <div className="strains-grid">
              {filtered.map((strain, i) => (
                <StrainCard key={strain.id} strain={strain} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
