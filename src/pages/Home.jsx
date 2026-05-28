import React from 'react'
import { Link } from 'react-router-dom'
import { useStrains } from '../lib/data'
import StrainCard from '../components/StrainCard'
import './Home.css'

export default function Home() {
  const { strains, loading } = useStrains()
  const currentDrop = strains.find((s) => s.is_current_drop)

  return (
    <main className="home">
      {/* ---- HERO ---- */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />

        <div className="hero-inner container">
          <div className="hero-eyebrow mono rise rise-1">
            <span className="hero-dot" />
            Cake Cannabis · Oklahoma · Est. 2020
          </div>

          <h1 className="hero-title display rise rise-2">
            Seven strains. <br />
            <span className="display-italic">One release</span> a year.
          </h1>

          <p className="hero-sub rise rise-3">
            We don't grow a hundred strains and see what sticks. Each cultivar in the
            Cake catalog is a signature — bred by Limited Trees Genetics, run for years
            before release, and pulled the moment it stops meeting standard.
          </p>

          <div className="hero-cta rise rise-4">
            <Link to="/strains" className="btn btn-solid">
              The Collection <span className="btn-arrow">→</span>
            </Link>
            <Link to="/cultivation" className="btn">
              Our Cultivation
            </Link>
          </div>

          <div className="hero-foot rise rise-5">
            <div className="hero-foot-col">
              <div className="mono hero-foot-label">Currently Releasing</div>
              <div className="hero-foot-val display">
                {currentDrop ? currentDrop.name : '—'}
              </div>
            </div>
            <div className="hero-foot-col">
              <div className="mono hero-foot-label">Cultivation</div>
              <div className="hero-foot-val display">Six Flower Rooms</div>
            </div>
            <div className="hero-foot-col">
              <div className="mono hero-foot-label">Nutrients</div>
              <div className="hero-foot-val display">House &amp; Garden</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span className="mono">Scroll</span>
          <span className="hero-scroll-line" />
        </div>
      </section>

      {/* ---- PHILOSOPHY STRIP ---- */}
      <section className="strip">
        <div className="container">
          <div className="strip-marquee">
            <div className="strip-track">
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} className="strip-row">
                  <em>Selective Genetics</em>
                  <span>·</span>
                  <em>Consistency Guaranteed</em>
                  <span>·</span>
                  <em>Bred by Limited Trees</em>
                  <span>·</span>
                  <em>One Release a Year</em>
                  <span>·</span>
                  <em>Cultivated in Oklahoma</em>
                  <span>·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- THE COLLECTION ---- */}
      <section className="section collection">
        <div className="container">
          <div className="coll-head">
            <div className="coll-head-left">
              <div className="mono">№ 01 · The Collection</div>
              <h2 className="display coll-title">
                Signature <span className="display-italic">strains.</span>
              </h2>
            </div>
            <p className="coll-intro">
              Every strain Cake has ever released — from the foundational drops to the
              current 2026 release. Each one chosen, run, and refined before it earned
              its place in the catalog.
            </p>
          </div>

          {loading ? (
            <div className="coll-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="coll-skel skeleton" />
              ))}
            </div>
          ) : (
            <div className="coll-grid">
              {strains.map((strain, i) => (
                <StrainCard key={strain.id} strain={strain} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- CURRENT DROP FEATURE ---- */}
      {currentDrop && (
        <section className="section drop">
          <div className="container drop-inner">
            <div className="drop-left">
              <div className="mono drop-eyebrow">
                <span className="drop-dot" />
                The 2026 Release
              </div>
              <h2 className="display drop-title">
                {currentDrop.name.split(' ').map((word, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {i === currentDrop.name.split(' ').length - 1 ? (
                      <span className="display-italic">{word}</span>
                    ) : word}
                  </span>
                ))}
              </h2>
              <div className="drop-cross">{currentDrop.cross}</div>
              <p className="drop-body">{currentDrop.lineage_story}</p>
              <div className="drop-specs">
                <div className="drop-spec">
                  <div className="mono">Type</div>
                  <div>{currentDrop.type}</div>
                </div>
                <div className="drop-spec">
                  <div className="mono">Ratio</div>
                  <div>{currentDrop.ratio}</div>
                </div>
                <div className="drop-spec">
                  <div className="mono">Effects</div>
                  <div>{currentDrop.effects.join(' · ')}</div>
                </div>
              </div>
              <Link to={`/strains/${currentDrop.slug}`} className="btn btn-solid">
                Read the Profile <span className="btn-arrow">→</span>
              </Link>
            </div>
            <div className="drop-right">
              <div
                className="drop-package"
                style={{ '--accent': currentDrop.accent_color }}
              >
                <div className="drop-package-glow" />
                <div className="drop-package-bag">
                  <div className="drop-package-mark">cake</div>
                  <div className="drop-package-name display">
                    {currentDrop.name}
                  </div>
                  <div className="drop-package-foot mono">3.5g · Premium</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---- OUR GROW ---- */}
      <section className="section grow">
        <div className="container">
          <div className="grow-head">
            <div className="mono">№ 02 · Cultivation</div>
            <h2 className="display grow-title">
              Cultivated <span className="display-italic">to spec.</span>
            </h2>
          </div>

          <div className="grow-grid">
            <div className="grow-card">
              <div className="grow-num mono">01</div>
              <h3 className="display">Six flower rooms</h3>
              <p>
                A nine-week flower cycle staggered across six rooms — every harvest
                meets the same standard, the same way, every time.
              </p>
            </div>
            <div className="grow-card">
              <div className="grow-num mono">02</div>
              <h3 className="display">House &amp; Garden nutrients</h3>
              <p>
                The highest grade in the industry. We don't cut input costs to protect
                margin. The plant tells you when you have.
              </p>
            </div>
            <div className="grow-card">
              <div className="grow-num mono">03</div>
              <h3 className="display">Hand-selected A-grade</h3>
              <p>
                Premium units are hand-selected, soft-touch mylar, with a flower tray
                insert. The cure matters as much as the grow.
              </p>
            </div>
          </div>

          <Link to="/cultivation" className="btn grow-cta">
            The Full Process <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* ---- LOCATOR TEASER ---- */}
      <section className="section locator-teaser">
        <div className="container locator-inner">
          <div>
            <div className="mono">№ 03 · Find Cake</div>
            <h2 className="display locator-title">
              At <span className="display-italic">select</span> Oklahoma dispensaries.
            </h2>
            <p className="locator-body">
              Cake is not in every store. We work with dispensary partners who carry
              our line the way it deserves to be carried. Find the one nearest you.
            </p>
            <Link to="/locator" className="btn btn-solid">
              Open the Map <span className="btn-arrow">→</span>
            </Link>
          </div>
          <div className="locator-art" aria-hidden="true">
            <OklahomaSilhouette />
          </div>
        </div>
      </section>

      {/* ---- PARTNERS CTA ---- */}
      <section className="section partners-cta">
        <div className="container partners-inner">
          <div className="mono">№ 04 · Wholesale</div>
          <h2 className="display partners-title">
            For dispensaries <br />
            <span className="display-italic">that carry standard.</span>
          </h2>
          <p className="partners-body">
            If you operate a licensed Oklahoma dispensary and want to discuss carrying
            Cake, we'd like to hear from you. Limited partners, by design.
          </p>
          <Link to="/partners" className="btn">
            Apply to Carry Cake <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}

// Stylized Oklahoma silhouette for the locator teaser
function OklahomaSilhouette() {
  return (
    <svg viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg" className="ok-svg">
      <defs>
        <linearGradient id="ok-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a2a28" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
      </defs>
      {/* Stylized OK shape — panhandle + main body */}
      <path
        d="M 30 80 L 130 80 L 130 110 L 200 110 L 210 90 L 280 90 L 290 100 L 380 100 L 395 115 L 440 120 L 460 135 L 470 180 L 455 220 L 410 235 L 360 240 L 290 245 L 220 240 L 160 235 L 100 225 L 60 200 L 40 160 L 35 120 Z"
        fill="url(#ok-grad)"
        stroke="var(--line-bright)"
        strokeWidth="1"
      />
      {/* Pin markers */}
      <circle cx="260" cy="170" r="4" fill="#f5f5f3" className="ok-pin ok-pin-1" />
      <circle cx="340" cy="180" r="4" fill="#f5f5f3" className="ok-pin ok-pin-2" />
      <circle cx="280" cy="155" r="4" fill="#f5f5f3" className="ok-pin ok-pin-3" />
      <circle cx="195" cy="195" r="4" fill="#f5f5f3" className="ok-pin ok-pin-4" />
      <circle cx="160" cy="170" r="4" fill="#f5f5f3" className="ok-pin ok-pin-5" />
      <circle cx="380" cy="200" r="4" fill="#f5f5f3" className="ok-pin ok-pin-6" />
      <circle cx="240" cy="200" r="4" fill="#f5f5f3" className="ok-pin ok-pin-7" />
    </svg>
  )
}
