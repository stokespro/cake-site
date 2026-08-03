import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="relative h-9 w-[84px]">
              <Image
                src="/brand/cake-white.webp"
                alt="CAKE"
                fill
                sizes="84px"
                className="object-contain object-left"
              />
            </div>
            <p className="micro mt-5 text-white/45">GROWN IN OKLAHOMA</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {[
              // Landing-page sections are "/#anchor", not "#anchor" — the footer
              // renders on every route, and a bare anchor is a no-op off the
              // homepage.
              { label: 'STRAINS', href: '/strains' },
              { label: 'PRODUCTS', href: '/#products' },
              { label: 'WHOLESALE', href: '/#order' },
              { label: 'LABS / COAs', href: '/labs' },
              { label: 'FIND US', href: '/find-us' },
              { label: 'ABOUT', href: '/about' },
              { label: 'H&G NUTRIENTS', href: '/partners' },
              { label: 'CONTACT', href: '/contact' },
              { label: 'INSTAGRAM', href: 'https://instagram.com/cakeoklahoma' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="micro text-white/60 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] leading-relaxed text-white/35">
              JTS Manufacturing LLC d/b/a CAKE. For licensed Oklahoma medical marijuana
              businesses and patients 18+. Keep out of reach of children.
            </p>
            {/* Map attribution. The on-map controls are suppressed on Find Us, so
                the credit is carried here. The OpenStreetMap link is required by
                ODbL, which governs the underlying data independently of the
                Mapbox terms — do not remove it. */}
            <p className="mt-2 text-[11px] text-white/25">
              Map data{' '}
              <a
                href="https://www.mapbox.com/about/maps/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-white/50"
              >
                © Mapbox
              </a>{' '}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-white/50"
              >
                © OpenStreetMap
              </a>
            </p>
          </div>
          <div className="flex gap-7">
            <span className="micro text-white/45">cakeoklahoma.com</span>
            <span className="micro text-white/45">@cakeoklahoma</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
