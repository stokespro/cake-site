import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Strains from './pages/Strains'
import StrainDetail from './pages/StrainDetail'
import Locator from './pages/Locator'
import Partners from './pages/Partners'
import Cultivation from './pages/Cultivation'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/strains" element={<Strains />} />
        <Route path="/strains/:slug" element={<StrainDetail />} />
        <Route path="/locator" element={<Locator />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/cultivation" element={<Cultivation />} />
      </Routes>
      <Footer />
    </>
  )
}
