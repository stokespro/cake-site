import React from 'react'
import { Link } from 'react-router-dom'
import './Cultivation.css'

export default function Cultivation() {
  return (
    <main className="cult-page">
      <section className="cult-hero">
        <div className="container">
          <div className="mono cult-eyebrow">№ 02 · Cultivation</div>
          <h1 className="display cult-title">
            We grow <span className="display-italic">to spec.</span> <br />
            Not to market.
          </h1>
          <p className="cult-sub">
            Most grows ask: what's selling? We ask: what's worth keeping in rotation?
            The answer to that question is what becomes a Cake strain.
          </p>
        </div>
      </section>

      <section className="section cult-philosophy" id="philosophy">
        <div className="container cult-philo-grid">
          <div className="cult-philo-left">
            <div className="mono">The Philosophy</div>
            <h2 className="display cult-philo-title">
              Selective <span className="display-italic">genetics.</span>
            </h2>
          </div>
          <div className="cult-philo-right">
            <p>
              Unlike grows that boast dozens of strains, Cake cultivates a select few.
              That concentration lets us put unparalleled attention and resources into
              every plant — and it means every batch you find under the Cake label is
              one we stand behind without reservation.
            </p>
            <p>
              Our signature genetics are bred by Limited Trees Genetics, one of the
              most respected breeding houses working today. We run each cross for
              years before we'll release it. If it doesn't earn its place, it doesn't
              get a release year.
            </p>
          </div>
        </div>
      </section>

      <section className="section cult-process">
        <div className="container">
          <div className="cult-process-head">
            <div className="mono">The Process</div>
            <h2 className="display">
              Nine weeks. <span className="display-italic">Six rooms.</span> <br />
              No shortcuts.
            </h2>
          </div>

          <div className="cult-steps">
            <div className="cult-step">
              <div className="cult-step-num display">01</div>
              <div className="cult-step-body">
                <h3 className="display">Veg Room</h3>
                <p>
                  Mothers maintained from carefully selected cuts. Every clone audited
                  against Metrc records — no untagged plants, no rooms out of step
                  with the state system.
                </p>
              </div>
            </div>

            <div className="cult-step">
              <div className="cult-step-num display">02</div>
              <div className="cult-step-body">
                <h3 className="display">Flower Cycle</h3>
                <p>
                  Six flower rooms on a staggered nine-week cadence. Pairing and
                  harvest timing are tuned so quality stays consistent across every
                  pull — not just the lucky ones.
                </p>
              </div>
            </div>

            <div className="cult-step">
              <div className="cult-step-num display">03</div>
              <div className="cult-step-body">
                <h3 className="display">House &amp; Garden Inputs</h3>
                <p>
                  We feed exclusively with House &amp; Garden — the highest grade
                  available. Most grows cut nutrient cost first. We don't. The plants
                  show it, and so does the finished flower.
                </p>
              </div>
            </div>

            <div className="cult-step">
              <div className="cult-step-num display">04</div>
              <div className="cult-step-body">
                <h3 className="display">Cure &amp; Selection</h3>
                <p>
                  Premium units are hand-selected A-grade buds — not run-of-harvest.
                  Packaged in 3.5g soft-touch mylar with a flower tray insert that
                  protects structure from grow to glass.
                </p>
              </div>
            </div>

            <div className="cult-step">
              <div className="cult-step-num display">05</div>
              <div className="cult-step-body">
                <h3 className="display">Labs &amp; Compliance</h3>
                <p>
                  Every batch is third-party tested and traceable. COAs published
                  publicly. Full Metrc reconciliation on every transfer — the kind of
                  back-of-house most consumers never see, but every regulator does.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section cult-stats">
        <div className="container cult-stats-grid">
          <div className="cult-stat">
            <div className="display cult-stat-num">7</div>
            <div className="mono cult-stat-label">Active Strains</div>
          </div>
          <div className="cult-stat">
            <div className="display cult-stat-num">6</div>
            <div className="mono cult-stat-label">Flower Rooms</div>
          </div>
          <div className="cult-stat">
            <div className="display cult-stat-num">9</div>
            <div className="mono cult-stat-label">Week Cycle</div>
          </div>
          <div className="cult-stat">
            <div className="display cult-stat-num">1</div>
            <div className="mono cult-stat-label">Release / Year</div>
          </div>
        </div>
      </section>

      <section className="section cult-cta">
        <div className="container cult-cta-inner">
          <h2 className="display">
            See the catalog <br />
            <span className="display-italic">behind the process.</span>
          </h2>
          <div className="cult-cta-buttons">
            <Link to="/strains" className="btn btn-solid">
              The Collection <span className="btn-arrow">→</span>
            </Link>
            <Link to="/partners" className="btn">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
