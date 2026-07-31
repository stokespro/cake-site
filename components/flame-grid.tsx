'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * The spot-gloss flame grid from the packaging.
 *
 * On the real bag this is glossy black flame varnish printed on matte black —
 * you only see it when it catches the light. Reproduced here as:
 *   1. a staggered grid of flame silhouettes, each slightly rotated,
 *   2. rendered as a near-black sheen (never a visible light-on-dark pattern),
 *   3. under a moving "highlight" band that sweeps across, so flames light up
 *      as it passes — the tilt-the-bag effect.
 *
 * The flame shape comes from /public/brand/flame-mask.png (white silhouette,
 * alpha channel = the shape) used as a CSS mask so it can be tinted freely.
 */
export function FlameGrid({
  cols = 18,
  className = '',
  opacity = 1,
}: {
  cols?: number
  className?: string
  opacity?: number
}) {
  const reduce = useReducedMotion()

  // Deterministic pseudo-random rotations — no Math.random, so SSR and client
  // markup match and there's no hydration mismatch.
  const cells = useMemo(() => {
    const rows = Math.ceil(cols * 1.35)
    const out: { x: number; y: number; rot: number; s: number }[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        const h = (Math.sin(i * 12.9898) * 43758.5453) % 1
        const h2 = (Math.sin(i * 78.233) * 12345.6789) % 1
        out.push({
          x: ((c + (r % 2 ? 0.5 : 0)) / cols) * 100,
          y: (r / rows) * 100,
          rot: h * 62 - 31,
          s: 0.82 + Math.abs(h2) * 0.36,
        })
      }
    }
    return out
  }, [cols])

  const cell = 100 / cols

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* the gloss varnish itself — barely-there sheen on black */}
      <div className="absolute inset-0">
        {cells.map((c, i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${cell * 0.5}%`,
              aspectRatio: '256 / 358',
              transform: `translate(-50%,-50%) rotate(${c.rot}deg) scale(${c.s})`,
              background: 'linear-gradient(150deg, #ffffff 0%, #8f96a8 55%, #ffffff 100%)',
              opacity: 0.038,
              WebkitMaskImage: 'url(/brand/flame-mask.png)',
              maskImage: 'url(/brand/flame-mask.png)',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />
        ))}
      </div>

      {/* sweeping highlight — the "tilt the bag" catch of light */}
      {!reduce && (
        <motion.div
          className="absolute inset-y-[-30%] w-[45%]"
          style={{
            background:
              'linear-gradient(100deg, transparent 0%, rgba(207,216,247,0.10) 30%, rgba(247,217,201,0.13) 50%, rgba(201,237,220,0.10) 70%, transparent 100%)',
            filter: 'blur(26px)',
          }}
          animate={{ left: ['-50%', '110%'] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  )
}
