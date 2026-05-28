import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStrain, useStrains } from '../lib/data'
import './StrainDetail.css'

export default function StrainDetail() {
  const { slug } = useParams()
  const { strain, loading } = useStrain(slug)
  const { strains } = useStrains()

  if (loading) {
    return (
      <main className="sd-page">
        <div className="container sd-loading">
          <div className="skeleton sd-skel-img" />
          <div className="skeleton sd-skel-text" />
        </div>
      </main>
    )
  }

  if (!strain) {
    return (
      <main className="sd-page">
        <div className="container sd-missing">
          <div className="mono">404</div>
          <h1 className="display">Strain not found.</h1>
          <Link to="/strains" className="btn">Back to the Collection</Link>
        </div>
      </main>
    )
  }

  // Find next/previous strains for navigation
  const idx = strains.findIndex((s) => s.slug === slug)
  const prev = idx > 0 ? strains[idx - 1] : null
  const next = idx < strains.length - 1 ? strains[idx + 1] : null

  return (
    <main
      className="sd-page"
      style={{ '--accent': strain.accent_color }}
    >
      <div className="sd-accent-glow" aria-hidden="true" />

      <section className="sd-hero container">
        <div className="sd-crumb mono">
          <Link to="/strains">The Collection</Link>
          <span>/</span>
          <span>№ {String(strain.sort_order).padStart(2, '0')}</span>
        </div>

        <div className="sd-grid">
          <div className="sd-left">
            {strain.is_current_drop && (
              <div className="mono sd-drop-tag">
                <span className="sd-drop-dot" /> {strain.release_year} · Current Drop
              </div>
            )}

            <h1 className="display sd-name">
              {strain.name}
            </h1>

            <div className="sd-cross display-italic">{strain.cross}</div>

            <div className="sd-quick">
              <div className="sd-quick-row">
                <span className="mono">Type</span>
                <span>{strain.type} · {strain.ratio}</span>
              </div>
              <div className="sd-quick-row">
                <span className="mono">Released</span>
                <span>{strain.release_year}</span>
              </div>
              <div className="sd-quick-row">
                <span className="mono">Effects</span>
                <span>{strain.effects.join(' · ')}</span>
              </div>
            </div>
          </div>

          <div className="sd-right">
            <div className="sd-package">
              <div className="sd-package-glow" />
              {strain.packaging_image_url ? (
                <img src={strain.packaging_image_url} alt={`${strain.name} packaging`} />
              ) : (
                <div className="sd-package-bag">
                  <div className="sd-package-mark">cake</div>
                  <div className="sd-package-name display">{strain.name}</div>
                  <div className="sd-package-foot mono">3.5g · Premium</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section sd-body">
        <div className="container sd-body-inner">
          <div className="sd-body-left">
            <div className="mono sd-section-label">The Profile</div>
            <p className="sd-story">{strain.lineage_story}</p>

            <div className="sd-callouts">
              <div className="sd-callout">
                <div className="mono">Lineage</div>
                <div className="sd-callout-val display-italic">{strain.cross}</div>
              </div>
              <div className="sd-callout">
                <div className="mono">Bred By</div>
                <div className="sd-callout-val display-italic">Limited Trees Genetics</div>
              </div>
              <div className="sd-callout">
                <div className="mono">Cultivated By</div>
                <div className="sd-callout-val display-italic">Cake · Oklahoma</div>
              </div>
            </div>
          </div>

          <aside className="sd-body-right">
            <div className="sd-aside">
              <div className="mono sd-aside-label">Effects Profile</div>
              <div className="sd-effects">
                {strain.effects.map((e) => (
                  <span key={e} className="sd-effect">{e}</span>
                ))}
              </div>
            </div>

            <div className="sd-aside">
              <div className="mono sd-aside-label">Lab Results</div>
              <a href={strain.labs_url} target="_blank" rel="noreferrer" className="btn sd-labs-btn">
                View COA <span className="btn-arrow">→</span>
              </a>
            </div>

            <div className="sd-aside">
              <div className="mono sd-aside-label">Find {strain.name}</div>
              <Link to="/locator" className="btn sd-labs-btn">
                Dispensary Map <span className="btn-arrow">→</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Prev / Next navigation */}
      <section className="sd-nav-section">
        <div className="container sd-nav">
          {prev ? (
            <Link to={`/strains/${prev.slug}`} className="sd-nav-link sd-nav-prev">
              <div className="mono">← Previous Release</div>
              <div className="display sd-nav-name">{prev.name}</div>
              <div className="sd-nav-year mono">{prev.release_year}</div>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/strains/${next.slug}`} className="sd-nav-link sd-nav-next">
              <div className="mono">Next Release →</div>
              <div className="display sd-nav-name">{next.name}</div>
              <div className="sd-nav-year mono">{next.release_year}</div>
            </Link>
          ) : <div />}
        </div>
      </section>
    </main>
  )
}
