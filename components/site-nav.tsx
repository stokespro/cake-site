'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Site-wide header. Used by the landing page AND every content page via the
 * (site) route group, so every href must resolve from any route — a bare
 * "#products" only scrolls when you are already on the landing page, so the
 * landing's own sections are linked as "/#products" (navigate home, then
 * scroll). Do not shorten these back to bare anchors.
 */
const NAV = [
  { label: 'STRAINS', href: '/strains' },
  { label: 'LABS', href: '/labs' },
  { label: 'FIND US', href: '/find-us' },
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
]

const ORDER_HREF = '/request-samples'

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState('')
  const pathname = usePathname()

  // The sheet must close on navigation, including browser back/forward, or it
  // stays pinned over the new page. Derived rather than synced in an effect:
  // React 19 flags a setState in an effect body as a cascading render.
  const isOpen = open && openedAt === pathname

  // Lock body scroll while the mobile sheet is open. This one is a real effect
  // (it drives an external system, document.body).
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggle = () => {
    setOpenedAt(pathname)
    setOpen((v) => !v)
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

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

          <ul className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`micro transition-colors duration-200 hover:text-white ${
                    isActive(item.href) ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <div className="holo-border hidden md:block">
              <Link
                href={ORDER_HREF}
                className="micro flex items-center px-5 py-2.5 text-white transition-colors duration-200 hover:!bg-transparent hover:text-ink"
              >
                PLACE AN ORDER
              </Link>
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
                  isOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-opacity duration-200 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
                  isOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-40 bg-ink transition-opacity duration-300 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-1 px-8">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`display block py-1.5 text-[11vw] ${
                  isActive(item.href) ? 'text-white' : 'text-white/70'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="mt-8">
            <Link
              href={ORDER_HREF}
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
