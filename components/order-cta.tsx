'use client'

import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FlameGrid } from './flame-grid'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Closing hero + wholesale conversion.
 *
 * TODO(wiring): `/order` should hit the existing CRM. Suggested flow for
 * Claude Code — POST to a route handler that upserts into `public.customers`
 * (license number as the natural key), then creates a row in `public.orders`
 * with status 'draft'. Sales rep picks it up in the CRM. The license field is
 * required for OMMA compliance; do not let it submit blank.
 */
export function OrderCta() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? '0%' : '-10%', reduce ? '0%' : '10%'])

  return (
    <section id="order" ref={ref} className="relative overflow-hidden bg-ink">
      <motion.div aria-hidden style={{ y }} className="absolute inset-[-12%]">
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(90% 70% at 22% 30%, #3A1230 0%, #150C1C 48%, #08080A 100%)',
          }}
        />
      </motion.div>
      <FlameGrid cols={18} opacity={0.85} />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="micro holo-text">WHOLESALE ORDERING</span>
          <h2 className="display display-tight mt-6 max-w-[14ch] text-[clamp(2.8rem,9vw,8rem)] text-white">
            Put CAKE
            <br />
            On Your Shelf.
          </h2>
          <p className="mt-7 max-w-[52ch] text-base leading-relaxed text-white/70 md:text-lg">
            Eight indoor strains, two formats, cases ready to move. Send us your
            license and we&apos;ll open an account, share current availability, and
            get a rep on your store.
          </p>

          <div className="mt-11 flex flex-wrap items-center gap-4">
            <div className="holo-border">
              <Link
                href="/request-samples"
                className="micro group inline-flex items-center gap-3 px-9 py-5 text-white transition-colors duration-300 hover:!bg-transparent hover:text-ink"
              >
                PLACE AN ORDER
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <Link
              href="/contact"
              className="micro inline-flex items-center gap-3 border border-white/35 px-9 py-5 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              OPEN A WHOLESALE ACCOUNT
            </Link>
          </div>

          <div className="holo-rule mt-16 h-px w-full max-w-[900px]" style={{ opacity: 0.5 }} />
          <dl className="grid max-w-[900px] grid-cols-2 gap-x-8 gap-y-9 pt-10 md:grid-cols-4">
            {[
              { v: '8', l: 'STRAINS' },
              { v: '2', l: 'FORMATS' },
              { v: '32', l: 'UNITS / CASE' },
              { v: 'OK', l: 'LICENSED' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="display text-[clamp(1.9rem,3.4vw,3rem)] text-white">{s.v}</dt>
                <dd className="micro mt-2 text-white/50">{s.l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  )
}
