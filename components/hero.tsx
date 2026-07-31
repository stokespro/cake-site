'use client'

import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FlameGrid } from './flame-grid'

/**
 * Full-bleed opening hero.
 *
 * TODO(assets): drop a looping grow-room / trim-table film at
 * /public/video/hero.mp4 (+ hero-poster.jpg) and the <video> below takes over
 * from the CSS gradient automatically. Keep it muted, ~8-12s, under 4MB.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0])

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        {/* Stand-in backdrop until the film lands — also the poster fallback. */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(120% 90% at 70% 10%, #2B1A4A 0%, #140F22 45%, #08080A 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/60" />
        {/* spot-gloss flame grid, same as the bag */}
        <FlameGrid cols={20} opacity={0.7} />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-[12vh] md:px-10 md:pb-[14vh]"
      >
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="micro holo-text mb-5"
        >
          GROWN IN OKLAHOMA
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="display display-tight max-w-[16ch] text-[clamp(3.4rem,11vw,10.5rem)] text-white"
        >
          Indoor.
          <br />
          Every Batch.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/75 md:text-lg"
        >
          Eight strains. Hand-selected A-grade buds, full-panel tested, packed to
          case and tracked seed to sale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href="#strains"
            className="micro group inline-flex items-center gap-3 bg-white px-8 py-4 text-ink transition-colors duration-300 hover:bg-cake hover:text-white"
          >
            EXPLORE THE STRAINS
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#order"
            className="micro inline-flex items-center gap-3 border border-white/35 px-8 py-4 text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            WHOLESALE PRICING
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="holo-rule h-11 w-px" style={{ opacity: 0.85 }} />
      </motion.div>
    </section>
  )
}
