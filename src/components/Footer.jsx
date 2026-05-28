import React from 'react'
import { Link } from 'react-router-dom'
import CakeMark from './CakeMark'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="ftr-top">
        <div className="ftr-brand">
          <CakeMark size={48} id="ftr" />
          <p className="ftr-tag">
            Selective genetics, cultivated in Oklahoma. <br />
            One release per year. No exceptions.
          </p>
        </div>

        <div className="ftr-cols">
          <div className="ftr-col">
            <h4 className="mono">The House</h4>
            <Link to="/strains">The Collection</Link>
            <Link to="/cultivation">Cultivation</Link>
            <Link to="/cultivation#philosophy">Philosophy</Link>
            <a href="https://cakeoklahoma.com/labs" target="_blank" rel="noreferrer">Lab Results</a>
          </div>

          <div className="ftr-col">
            <h4 className="mono">For Trade</h4>
            <Link to="/partners">Become a Partner</Link>
            <Link to="/locator">Find Cake</Link>
            <Link to="/partners#terms">Wholesale Terms</Link>
          </div>

          <div className="ftr-col">
            <h4 className="mono">Connect</h4>
            <a href="https://instagram.com/cakeoklahoma" target="_blank" rel="noreferrer">Instagram</a>
            <a href="mailto:hello@cakeoklahoma.com">hello@cakeoklahoma.com</a>
          </div>
        </div>
      </div>

      <div className="ftr-bottom">
        <div className="ftr-legal mono">
          <span>© Cake Cannabis Oklahoma</span>
          <span>OMMA License [PLACEHOLDER]</span>
        </div>
        <div className="ftr-warn mono">
          For medical patients 18+ / adults 21+ where applicable. Keep out of reach of children. Cannabis can impair concentration, coordination, and judgment.
        </div>
      </div>
    </footer>
  )
}
