'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

/**
 * Pokémon-card holographic sparkle, clipped to a logo's silhouette.
 *
 * Adapted from simeydotme's "Pokemon Card Holo Effect"
 * (https://codepen.io/simeydotme/pen/PrQKgo), minus its rainbow band layer —
 * `color-dodge`ing a rainbow over the strain lockups shifted their brand
 * colors, so only two ingredients survive:
 *
 *   1. pointer-tracked 3D tilt (rotateX / rotateY),
 *   2. a sparkle texture blended with `color-dodge`, its background-position
 *      driven by the pointer.
 *
 * The difference from the original: there's no card face here. The sparkle
 * layer is masked with the logo PNG itself (`mask-image`), so the foil plays
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
  const spX = 20 + p.x * 60
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

        {/* sparkle/glitter */}
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
