'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const NAV = [
  { label: 'STRAINS', href: '#strains' },
  { label: 'PRODUCTS', href: '#products' },
  { label: 'LABS', href: '/labs' },
  { label: 'WHOLESALE', href: '#order' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-ink/95 backdrop-blur-sm">
        {/* Iridescent hairline — the holo foil edge from the bag */}
        <div className="holo-rule h-[3px] w-full" />
        <nav className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          <Link href="/" aria-label="CAKE home" className="relative block h-8 w-[74px] shrink-0">
            <Image
              src="/brand/cake-white.webp"
              alt="CAKE"
              fill
              priority
              sizes="74px"
              className="object-contain object-left"
            />
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="micro text-white/85 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <div className="holo-border hidden md:block">
              <Link
                href="#order"
                className="micro flex items-center px-5 py-2.5 text-white transition-colors duration-200 hover:!bg-transparent hover:text-ink"
              >
                PLACE AN ORDER
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-opacity duration-200 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-8">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="display block py-2 text-[13vw] text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-8">
            <Link
              href="#order"
              onClick={() => setOpen(false)}
              className="micro inline-block border border-white px-7 py-4 text-white"
            >
              PLACE AN ORDER
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
