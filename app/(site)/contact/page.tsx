import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | CAKE Oklahoma',
  description: 'Get in touch with CAKE Oklahoma. Sales inquiries, partnership opportunities, and general questions.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink">
      {/* Hero */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <span className="micro holo-text">CONTACT</span>
        <h1 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,8vw,7rem)] text-white">
          Get In Touch
        </h1>
        <p className="mt-8 max-w-[54ch] text-lg leading-relaxed text-white/70 md:text-xl">
          Questions about our products? Interested in carrying CAKE at your
          dispensary? We&apos;re here to help.
        </p>
      </section>

      {/* Contact routes */}
      <section className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="holo-rule h-px w-full" style={{ opacity: 0.5 }} />
        <div className="grid gap-12 py-20 md:grid-cols-2 md:gap-16">
          {/* Sales & Partnerships */}
          <div className="holo-border">
            <div className="p-8 md:p-10">
              <h2 className="display text-2xl text-white">Sales &amp; Partnerships</h2>
              <p className="mt-4 max-w-[42ch] leading-relaxed text-white/65">
                For dispensary buyers interested in carrying CAKE products.
              </p>
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="micro text-white/35">BEST OPTION</dt>
                  <dd className="mt-2">
                    <Link
                      href="/request-samples"
                      className="display group inline-flex items-center gap-2 text-lg text-white transition-colors hover:text-cake"
                    >
                      Request Samples
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="micro text-white/35">EMAIL</dt>
                  <dd className="mt-2">
                    <a
                      href="mailto:sales@cakeoklahoma.com"
                      className="text-lg text-white transition-colors hover:text-cake"
                    >
                      sales@cakeoklahoma.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="micro text-white/35">PHONE</dt>
                  <dd className="mt-2">
                    <a
                      href="tel:+14051234567"
                      className="text-lg text-white transition-colors hover:text-cake"
                    >
                      (405) 123-4567
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* General Inquiries */}
          <div className="border border-white/15 p-8 md:p-10">
            <h2 className="display text-2xl text-white">General Inquiries</h2>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-white/65">
              For all other questions, media requests, or general information.
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="micro text-white/35">EMAIL</dt>
                <dd className="mt-2">
                  <a
                    href="mailto:info@cakeoklahoma.com"
                    className="text-lg text-white transition-colors hover:text-cake"
                  >
                    info@cakeoklahoma.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="micro text-white/35">PHONE</dt>
                <dd className="mt-2">
                  <a
                    href="tel:+14051234567"
                    className="text-lg text-white transition-colors hover:text-cake"
                  >
                    (405) 123-4567
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Social & OMMA */}
      <section className="bg-smoke">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <span className="micro text-white/45">FOLLOW US</span>
              <div className="mt-6 space-y-4">
                <a
                  href="https://instagram.com/cakeoklahoma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-white transition-colors hover:text-cake"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @cakeoklahoma
                </a>
                <a
                  href="https://facebook.com/cakeoklahoma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lg text-white transition-colors hover:text-cake"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </div>
            </div>

            <div>
              <span className="micro text-white/45">LICENSED CULTIVATOR</span>
              <p className="mt-6 max-w-[46ch] leading-relaxed text-white/65">
                CAKE Oklahoma is a licensed medical marijuana cultivator in compliance
                with all Oklahoma Medical Marijuana Authority regulations.
              </p>
              <div className="mt-6 border border-white/10 p-5">
                <p className="micro text-white/35">OMMA CULTIVATOR LICENSE</p>
                <p className="display mt-2 text-2xl text-white">[License Number]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,20ch)_minmax(0,1fr)] md:gap-16">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">Location</h2>
          <div className="max-w-[62ch] space-y-6 text-lg leading-relaxed text-white/70">
            <p>
              Our cultivation facility is located in Oklahoma. We are a wholesale
              cultivator and do not operate a retail storefront.
            </p>
            <p>
              To purchase CAKE products, please visit one of our{' '}
              <Link
                href="/find-us"
                className="text-white underline underline-offset-4 transition-colors hover:text-cake"
              >
                authorized retail partners
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
