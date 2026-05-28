import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CakeMark from './CakeMark'
import './Header.css'

const NAV = [
  { label: 'The Collection', to: '/strains' },
  { label: 'Cultivation', to: '/cultivation' },
  { label: 'Find Cake', to: '/locator' },
  { label: 'Partners', to: '/partners' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`hdr ${scrolled ? 'hdr-scrolled' : ''} ${open ? 'hdr-open' : ''}`}>
      <div className="hdr-inner">
        <Link to="/" className="hdr-mark" aria-label="Cake home">
          <CakeMark size={32} id="hdr" />
        </Link>

        <nav className="hdr-nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`hdr-link ${pathname.startsWith(item.to) ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-aside">
          <span className="hdr-meta mono">OK · Est. 2020</span>
        </div>

        <button
          className="hdr-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className="hdr-mobile" role="dialog" aria-hidden={!open}>
        <nav className="hdr-mobile-nav">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="hdr-mobile-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-mobile-foot mono">
          Oklahoma · Limited Trees Genetics
        </div>
      </div>
    </header>
  )
}
