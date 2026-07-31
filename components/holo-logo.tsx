'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

/**
 * Pokémon-card holographic foil, clipped to a logo's silhouette.
 *
 * Adapted from simeydotme's "Pokemon Card Holo Effect"
 * (https://codepen.io/simeydotme/pen/PrQKgo). Same three ingredients:
 *
 *   1. pointer-tracked 3D tilt (rotateX / rotateY),
 *   2. a repeating rainbow gradient blended with `color-dodge`, its
 *      background-position driven by the pointer,
 *   3. a sparkle texture, also color-dodged, moving on a different axis so the
 *      two layers separate as you move — that parallax is what sells "foil"
 *      rather than "gradient".
 *
 * The difference from the original: there's no card face here. Both effect
 * layers are masked with the logo PNG itself (`mask-image`), so the foil plays
 * only inside the artwork and the panel behind stays clean.
 *
 * `isolation: isolate` on the root is load-bearing — without it `color-dodge`
 * blends through to the strain panel and blows out the whole background.
 *
 * With no pointer (touch, or cursor away) it runs a slow idle sweep so the
 * effect is never invisible on mobile.
 */
export function HoloLogo({
  src,
  alt,
  priority = false,
  sizes = '(max-width: 768px) 66vw, 34vw',
  className = '',
}: {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [p, setP] = useState({ x: 0.5, y: 0.5 })
  // framer-motion's hook rather than a matchMedia effect: React 19 flags
  // setState called synchronously in an effect body as a cascading render, and
  // this subscribes without one. Matches how feature-rotator reads the setting.
  const reduce = useReducedMotion() ?? false

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setP({
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    })
  }, [])

  // Pointer -> transform + gradient offsets. Numbers tuned to the original pen.
  const rx = (0.5 - p.y) * 22
  const ry = (p.x - 0.5) * 22
  const bgX = 40 + p.x * 20 // rainbow band travel
  const bgY = 40 + p.y * 20
  const spX = 20 + p.x * 60 // sparkles travel further -> parallax
  const spY = 20 + p.y * 60

  const mask = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  } as const

  const idle = !active && !reduce

  return (
    <div
      ref={ref}
      onPointerMove={reduce ? undefined : onMove}
      onPointerEnter={() => !reduce && setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={`relative h-full w-full ${className}`}
      style={{ perspective: '900px' }}
    >
      <div
        className="relative h-full w-full"
        style={{
          isolation: 'isolate',
          transformStyle: 'preserve-3d',
          transform: active ? `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)` : undefined,
          transition: active
            ? 'transform 90ms ease-out'
            : 'transform 900ms cubic-bezier(0.16,1,0.3,1)',
          animation: idle ? 'holo-idle-tilt 14s ease-in-out infinite' : undefined,
        }}
      >
        {/* the artwork */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain drop-shadow-[0_20px_38px_rgba(0,0,0,0.42)]"
        />

        {/* layer 1 — rainbow foil bands */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            ...mask,
            mixBlendMode: 'color-dodge',
            opacity: active ? 0.56 : 0.48,
            transition: 'opacity 300ms ease',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgb(255,119,115) 5%, rgba(255,237,95,1) 10%, rgba(168,255,95,1) 15%, rgba(131,255,247,1) 20%, rgba(120,148,255,1) 25%, rgb(216,117,255) 30%, rgb(255,119,115) 35%),' +
              'repeating-linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.55) 12%, transparent 24%)',
            backgroundBlendMode: 'screen',
            backgroundSize: '190% 190%, 220% 220%',
            backgroundPosition: `${bgX}% ${bgY}%, ${100 - bgX}% ${bgY}%`,
            // Brightness is the throttle. color-dodge over mid-tone art blows
            // straight to white above ~0.7 and the strain logo disappears.
            filter: `brightness(${active ? 0.66 : 0.7}) contrast(1.55) saturate(1.15)`,
            animation: idle ? 'holo-idle-bands 14s ease-in-out infinite' : undefined,
          }}
        />

        {/* layer 2 — sparkle/glitter, parallaxed against the bands */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            ...mask,
            mixBlendMode: 'color-dodge',
            opacity: active ? 0.6 : 0.42,
            transition: 'opacity 300ms ease',
            backgroundImage: 'url(/brand/sparkle.webp)',
            backgroundSize: '38% auto',
            backgroundPosition: `${spX}% ${spY}%`,
            filter: `brightness(${active ? 1.0 : 0.9}) contrast(1.45)`,
            animation: idle ? 'holo-idle-sparkle 14s ease-in-out infinite' : undefined,
          }}
        />
      </div>
    </div>
  )
}
