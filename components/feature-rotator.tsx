'use client'

import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { features } from '@/lib/features'
import { FlameGrid } from './flame-grid'

/**
 * Pinned pillars section. The CAKE medallion stays dead-center and rotates as
 * you scroll; the 01/02/03/04 feature blocks scroll up past it, alternating
 * sides on desktop.
 *
 * Swap-in note: if a 3D product render sequence is ever shot (e.g. 36 frames
 * of a jar turning), replace <Medallion /> with a frame-indexed <Image> driven
 * by the same `progress` motion value — the layout does not change.
 */
export function FeatureRotator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 })

  // Sweep rather than a full 360: a flat mark rotated past ~60deg reads as a
  // broken sliver, not a turning object. -46..46 keeps the face always legible.
  const rotateY = useTransform(progress, [0, 1], reduce ? [0, 0] : [-46, 46])
  const rotateZ = useTransform(progress, [0, 1], reduce ? [0, 0] : [-5, 5])
  const scale = useTransform(progress, [0, 0.5, 1], [0.94, 1.05, 0.94])
  const ringRotate = useTransform(progress, [0, 1], [0, reduce ? 0 : 300])

  return (
    <section
      id="products"
      ref={containerRef}
      style={{ height: `${features.length * 100}svh` }}
      className="relative bg-ink"
      aria-label="Why CAKE"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        {/* --- the bag: matte black + spot-gloss flame grid --- */}
        <FlameGrid cols={18} />

        {/* faint centre lift so the mark doesn't sit on dead-flat black */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 44% at 50% 50%, rgba(207,216,247,0.06) 0%, rgba(10,10,11,0) 72%)',
          }}
        />

        {/* ---------- centered rotating holo mark ---------- */}
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          <div className="relative h-[46vmin] w-[46vmin] md:h-[34vmin] md:w-[34vmin]">
            {/* orbit ring, iridescent, outside the 3D transform so it stays round */}
            <motion.div
              aria-hidden
              className="absolute inset-[-9%] rounded-full"
              style={{ rotate: ringRotate }}
            >
              <div
                className="holo-rule h-full w-full rounded-full"
                style={{
                  opacity: 0.4,
                  WebkitMask:
                    'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
                }}
              />
              <span
                className="holo-rule absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ boxShadow: '0 0 14px rgba(207,216,247,0.65)' }}
              />
            </motion.div>

            {/* The holo mark as it appears on the bag: black letterforms with an
                iridescent border, sitting directly on the black. No disc. */}
            <motion.div
              style={{ rotateY, rotateZ, scale, transformStyle: 'preserve-3d' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative h-[62%] w-[86%]">
                <Image
                  src="/brand/cake-holo.webp"
                  alt=""
                  fill
                  sizes="46vmin"
                  className="object-contain drop-shadow-[0_0_46px_rgba(207,216,247,0.30)]"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ---------- feature blocks ---------- */}
        <div className="relative z-10 mx-auto h-full max-w-[1600px] px-5 md:px-10">
          {features.map((f, i) => (
            <FeatureBlock key={f.index} feature={f} i={i} total={features.length} progress={progress} />
          ))}
        </div>

        {/* section label */}
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
          <span className="micro text-white/40">WHY CAKE</span>
        </div>
      </div>
    </section>
  )
}

function FeatureBlock({
  feature,
  i,
  total,
  progress,
}: {
  feature: (typeof features)[number]
  i: number
  total: number
  progress: ReturnType<typeof useSpring>
}) {
  const start = i / total
  const end = (i + 1) / total

  // Fade in as this feature's slice arrives, out as it leaves. The in/out
  // windows are kept inside the slice so two pillars are never legible at once.
  const fade = (end - start) * 0.28
  const opacity = useTransform(
    progress,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
  )
  const y = useTransform(progress, [start, end], [56, -56])

  const left = i % 2 === 0

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute top-1/2 w-full max-w-[420px] -translate-y-1/2 ${
        left ? 'left-5 md:left-10' : 'right-5 md:right-10'
      }`}
      aria-hidden={undefined}
    >
      <div className={left ? 'text-left' : 'text-left md:text-right'}>
        <span className="micro holo-text block">{feature.index}</span>
        <h3 className="display mt-4 whitespace-pre-line text-[clamp(1.8rem,3.4vw,3.1rem)] text-white">
          {feature.title}
        </h3>
        <p className="mt-5 text-sm leading-relaxed text-white/70">{feature.body}</p>
        {feature.stat && (
          <div
            className={`mt-7 inline-flex items-baseline gap-2.5 border-t border-white/20 pt-4 ${
              left ? '' : 'md:flex-row-reverse'
            }`}
          >
            <span className="display text-3xl text-white">{feature.stat.value}</span>
            <span className="micro text-white/50">{feature.stat.label}</span>
          </div>
        )}
      </div>
      <span className="sr-only">{`Pillar ${i + 1} of ${total}`}</span>
    </motion.div>
  )
}
