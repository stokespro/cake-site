'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRef, useState } from 'react'
import { strains } from '@/lib/strains'
import { StrainArt } from './strain-art'
import { StrainBackdrop } from './strain-backdrop'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The pinned strain browser — the Zero "bike to bike" scroll, one strain per
 * viewport-height of scroll. The section sticks while the background color,
 * the art, the name stack, and the stat trio all swap.
 *
 * Height math: outer container is strains.length * 100svh tall; the inner
 * panel is position:sticky at h-100svh. Scroll progress 0..1 maps to index.
 */
export function StrainScroller() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(strains.length - 1, Math.max(0, Math.floor(p * strains.length)))
    setIndex((cur) => (cur === next ? cur : next))
  })

  const active = strains[index]
  const { theme } = active

  // Chrome pinned to the foot of the panel sits on the horizon backdrop's dark
  // ground band, where theme.fg (chosen against the sky) is unreadable.
  const barFg = active.backdrop?.kind === 'horizon' ? active.backdrop.groundFg : theme.fg

  return (
    <section
      id="strains"
      ref={containerRef}
      style={{ height: `${strains.length * 100}svh` }}
      className="relative"
      aria-label="Strain lineup"
    >
      <div
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          backgroundColor: theme.bg,
          color: theme.fg,
          transition: 'background-color 700ms cubic-bezier(0.16,1,0.3,1), color 700ms ease',
        }}
      >
        {/* ---------- backdrop motif (only strains that carry one) ----------
            Keyed on slug inside AnimatePresence so swapping strains cross-fades
            the pattern instead of hard-cutting the mask. */}
        <AnimatePresence>
          <motion.div
            key={active.slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0 z-0"
          >
            <StrainBackdrop strain={active} />
          </motion.div>
        </AnimatePresence>

        {/* ---------- left rail: product lines + counter ---------- */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-[86px] flex-col items-center justify-center gap-10 border-r md:flex"
             style={{ borderColor: `${theme.fg}1F` }}>
          <span className="micro vertical-rl tracking-[0.3em]" style={{ color: `${theme.fg}70` }}>
            PREMIUM&nbsp;&nbsp;/&nbsp;&nbsp;CAKE BITES
          </span>
        </div>

        {/* ---------- counter ---------- */}
        <div className="absolute right-5 top-[92px] z-20 md:right-10">
          <div className="flex items-baseline gap-1.5">
            <span className="display text-2xl" style={{ color: theme.fg }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="micro" style={{ color: `${theme.fg}60` }}>
              / {String(strains.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ---------- main grid ---------- */}
        {/* `relative z-10` is load-bearing: the backdrop is absolutely
            positioned, and a positioned element paints above a static one
            regardless of source order. Without it the motif covers the copy. */}
        <div className="relative z-10 mx-auto grid h-full max-w-[1600px] grid-cols-1 grid-rows-[minmax(0,1fr)_auto_auto] content-center items-center gap-5 px-5 pb-28 pt-[80px] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)_minmax(310px,370px)] md:grid-rows-1 md:gap-8 md:px-10 md:pb-16 md:pt-[88px] md:pl-[126px] lg:gap-12">
          {/* --- art --- */}
          <div className="relative flex min-h-0 items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, x: -40, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.94 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="w-[62vw] max-w-[290px] md:w-full md:max-w-[520px]"
              >
                <StrainArt strain={active} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* --- name ---
              Mobile: just the active name. Desktop: the full stack, absolutely
              positioned at 50% and translated by -(index + 0.5) line heights so
              the active name sits dead-center regardless of strain count.

              SIZING: type is measured in `cqw` against this column, not `vw`.
              Strain names must NEVER truncate — "BACIO GELATO" is the longest at
              ~7.6em of advance width, so the cap is set from that. A viewport
              unit can't know how wide this column ended up (it depends on the
              stats column and the gaps), which is exactly how the earlier
              mid-width clipping happened. If a longer strain name is ever added,
              lower `--name-fit`. See LONGEST_NAME below. */}
          <div className="min-w-0 [container-type:inline-size]">
            <div className="md:hidden">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={active.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="display whitespace-nowrap text-[clamp(1.5rem,var(--name-fit),3.2rem)] leading-[1.06]"
                  style={{ color: theme.fg }}
                >
                  {active.name}
                </motion.h2>
              </AnimatePresence>
            </div>

            <div className="relative hidden h-[68svh] overflow-hidden md:block">
              <motion.ul
                animate={{ y: `-${(index + 0.5) * 1.18}em` }}
                transition={{ duration: 0.7, ease: EASE }}
                className="display absolute left-0 top-1/2 w-full text-[clamp(1.4rem,var(--name-fit),3.6rem)] leading-[1.18]"
              >
                {strains.map((s, i) => (
                  <li
                    key={s.slug}
                    aria-current={i === index ? 'true' : undefined}
                    style={{
                      color: i === index ? theme.fg : theme.muted,
                      transition: 'color 600ms ease',
                    }}
                    className="whitespace-nowrap"
                  >
                    {s.name}
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* --- stats --- */}
          <div className="relative min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {active.badge && (
                  <span
                    className="micro mb-4 inline-block rounded-full px-3.5 py-1.5 md:mb-5"
                    style={{ backgroundColor: theme.fg, color: theme.bg }}
                  >
                    {active.badge}
                  </span>
                )}

                {/* The trio describes the STRAIN, not the packaging. "3.5 G
                    PREMIUM" and "32 CT PER CASE" used to sit here and said
                    nothing about what is in the jar. The label under the ratio
                    is derived from `type` so the two can never disagree. */}
                <div className="grid grid-cols-3 gap-4 md:gap-5">
                  <Stat value={active.split} label={active.type.toUpperCase()} theme={theme} />
                  <Stat value={active.thcRange ?? '—'} label="THC" theme={theme} />
                  <Stat value={active.terpRange ?? '—'} label="TERPS" theme={theme} />
                </div>

                <dl className="mt-6 space-y-2.5 md:mt-8 md:space-y-3.5">
                  <Row label="CROSS" value={active.cross} theme={theme} />
                  <Row label="EFFECTS" value={active.effects.join(', ')} theme={theme} />
                  <Row
                    label="FLAVOR"
                    value={active.flavors.length ? active.flavors.join(', ') : '—'}
                    theme={theme}
                    className="hidden md:flex"
                  />
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- bottom bar ----------
            Colour comes from `barFg`, not `theme.fg`. On a horizon backdrop the
            foot of the panel is the dark ground band, and theme.fg is picked
            against the sky — for Biscotti that is 15.8:1 on the sky but 1.27:1
            here, i.e. the nav reads as blank. See `groundFg` in lib/strains.ts. */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          {/* progress ticks */}
          <div className="mx-auto flex max-w-[1600px] gap-1.5 px-5 pb-5 md:px-10">
            {strains.map((s, i) => (
              <span
                key={s.slug}
                className={`h-[3px] flex-1 rounded-full ${i <= index ? 'holo-rule' : ''}`}
                style={
                  i <= index
                    ? undefined
                    : { backgroundColor: `${barFg}26`, transition: 'background-color 500ms ease' }
                }
              />
            ))}
          </div>
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 pb-6 md:px-10 md:pb-8">
            <span className="micro" style={{ color: `${barFg}A6`, transition: 'color 600ms ease' }}>
              SCROLL
            </span>
            <Link
              href="/strains"
              className="micro group inline-flex items-center gap-3"
              style={{ color: barFg, transition: 'color 600ms ease' }}
            >
              COMPARE ALL STRAINS
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One of the three strain figures.
 *
 * SIZED FOR THE LONGEST RANGE, not the shortest. The old values here were
 * packaging ("3.5", "32") and fit anything; a range like "24.5-28.2%" is ten
 * characters, and at the previous clamp it overran its column and collided
 * with the next figure — verified, not theorised.
 *
 * The column is ~96px at the widest desktop layout and Archivo 900 at 118%
 * width runs about 0.62em per digit, so ten characters need roughly 6.2em and
 * the ceiling has to sit near 1rem. That makes the short values ("70/30")
 * smaller than they strictly need to be, which is the right trade: a stat row
 * wants one consistent size, and the alternative is a figure that breaks the
 * moment a two-decimal COA arrives.
 *
 * Deliberately NOT truncated. These are potency figures — a clipped "24.5-2…"
 * is worse than small type.
 */
function Stat({
  value,
  label,
  theme,
}: {
  value: string
  label: string
  theme: { fg: string; muted: string }
}) {
  return (
    <div className="min-w-0 [container-type:inline-size]">
      <div className="flex items-start gap-1">
        <span className="display whitespace-nowrap text-[min(1.3rem,13.5cqw)] leading-none">
          {value}
        </span>
      </div>
      <div className="mt-2 h-px w-full" style={{ backgroundColor: `${theme.fg}33` }} />
      <div className="micro mt-2 text-[8.5px]" style={{ color: `${theme.fg}80` }}>
        {label}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  theme,
  className = '',
}: {
  label: string
  value: string
  theme: { fg: string }
  className?: string
}) {
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <dt className="micro w-[64px] shrink-0 text-[8.5px]" style={{ color: `${theme.fg}70` }}>
        {label}
      </dt>
      <dd className="text-sm leading-snug" style={{ color: `${theme.fg}E6` }}>
        {value}
      </dd>
    </div>
  )
}
