import React, { useState } from 'react'
import { submitLead } from '../lib/data'
import './Partners.css'

const initial = {
  lead_type: 'dispensary',
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  omma_license: '',
  city: '',
  monthly_volume: '',
  current_brands: '',
  message: '',
  honeypot: '', // bot trap
}

export default function Partners() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.honeypot) return // bot

    if (!form.business_name || !form.contact_name || !form.email) {
      setStatus('error')
      setErrorMsg('Please complete the required fields.')
      return
    }

    setStatus('sending')

    const payload = {
      ...form,
      submitted_at: new Date().toISOString(),
      source: 'cake-website',
    }
    delete payload.honeypot

    const result = await submitLead(payload)
    if (result.ok) {
      setStatus('success')
      setForm(initial)
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <main className="prt-page">
        <div className="container prt-success">
          <div className="mono">Received</div>
          <h1 className="display">Thank you.</h1>
          <p className="prt-success-body">
            Your information is in our system and a member of the Cake team will be in
            touch within two business days. In the meantime, take a look at the
            collection.
          </p>
          <a href="/strains" className="btn">The Collection →</a>
        </div>
      </main>
    )
  }

  return (
    <main className="prt-page">
      <section className="prt-hero">
        <div className="container">
          <div className="mono prt-eyebrow">№ 04 · Wholesale</div>
          <h1 className="display prt-title">
            Apply to carry <br />
            <span className="display-italic">Cake.</span>
          </h1>
          <p className="prt-sub">
            We work with a limited number of Oklahoma dispensary partners. If you'd
            like to discuss carrying the Cake line, tell us about your store and we'll
            be in touch.
          </p>
        </div>
      </section>

      <section className="prt-form-wrap">
        <div className="container prt-form-inner">
          <aside className="prt-aside">
            <div className="mono prt-aside-label">What to Expect</div>
            <ul className="prt-checklist">
              <li><span className="prt-num mono">01</span> Initial reply within two business days.</li>
              <li><span className="prt-num mono">02</span> Brief intro call to align on standards.</li>
              <li><span className="prt-num mono">03</span> First order with 14-day terms after the third order.</li>
            </ul>

            <div className="prt-divider" />

            <div className="mono prt-aside-label">Premium Tier</div>
            <p className="prt-aside-text">
              Hand-selected A-grade buds, packaged in 3.5g soft-touch mylar with a
              flower tray insert. Cases of 32 units.
            </p>

            <div className="prt-pricing">
              <div className="prt-price-row mono">
                <span>1 Case</span><span>$12.50 / unit</span>
              </div>
              <div className="prt-price-row mono">
                <span>4 Cases</span><span>$12.00 / unit</span>
              </div>
              <div className="prt-price-row mono">
                <span>8 Cases</span><span>$11.50 / unit</span>
              </div>
              <div className="prt-price-row mono">
                <span>20 Cases</span><span>$11.00 / unit</span>
              </div>
            </div>
          </aside>

          <form className="prt-form" onSubmit={handleSubmit} noValidate>
            <div className="prt-field-group">
              <label className="mono">I am a</label>
              <div className="prt-radio-row">
                {[
                  { id: 'dispensary', label: 'Dispensary' },
                  { id: 'processor', label: 'Processor' },
                  { id: 'customer', label: 'Patient / Customer' },
                  { id: 'other', label: 'Other' },
                ].map((opt) => (
                  <label key={opt.id} className={`prt-radio ${form.lead_type === opt.id ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name="lead_type"
                      value={opt.id}
                      checked={form.lead_type === opt.id}
                      onChange={update('lead_type')}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="prt-grid">
              <div className="prt-field">
                <label className="mono">
                  {form.lead_type === 'customer' ? 'Your Name *' : 'Business Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={form.business_name}
                  onChange={update('business_name')}
                />
              </div>

              {form.lead_type !== 'customer' && (
                <div className="prt-field">
                  <label className="mono">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contact_name}
                    onChange={update('contact_name')}
                  />
                </div>
              )}

              <div className="prt-field">
                <label className="mono">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                />
              </div>

              <div className="prt-field">
                <label className="mono">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                />
              </div>

              {form.lead_type === 'dispensary' && (
                <>
                  <div className="prt-field">
                    <label className="mono">OMMA License #</label>
                    <input
                      type="text"
                      value={form.omma_license}
                      onChange={update('omma_license')}
                      placeholder="DAAA-XXXX-XXXX"
                    />
                  </div>

                  <div className="prt-field">
                    <label className="mono">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={update('city')}
                    />
                  </div>

                  <div className="prt-field">
                    <label className="mono">Estimated Monthly Volume</label>
                    <select value={form.monthly_volume} onChange={update('monthly_volume')}>
                      <option value="">Select...</option>
                      <option value="1-4">1–4 cases / month</option>
                      <option value="5-8">5–8 cases / month</option>
                      <option value="9-20">9–20 cases / month</option>
                      <option value="20+">20+ cases / month</option>
                    </select>
                  </div>

                  <div className="prt-field">
                    <label className="mono">Current Brands Carried</label>
                    <input
                      type="text"
                      value={form.current_brands}
                      onChange={update('current_brands')}
                      placeholder="Brief list"
                    />
                  </div>
                </>
              )}

              <div className="prt-field prt-field-full">
                <label className="mono">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your store, your customers, or anything else you'd like us to know."
                />
              </div>
            </div>

            {/* honeypot — hidden from real users, bots fill it */}
            <input
              type="text"
              name="website"
              value={form.honeypot}
              onChange={update('honeypot')}
              className="prt-honeypot"
              tabIndex={-1}
              autoComplete="off"
            />

            {status === 'error' && (
              <div className="prt-error mono">{errorMsg}</div>
            )}

            <button
              type="submit"
              className="btn btn-solid prt-submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Submit'}
              <span className="btn-arrow">→</span>
            </button>

            <div className="prt-disclaimer mono">
              By submitting, you consent to be contacted by Cake. We won't share your
              information.
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
