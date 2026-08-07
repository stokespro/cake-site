'use client'

import Image from 'next/image'
import type { Strain } from '@/lib/strains'

/**
 * Renders a strain's logo lockup on its nug bed. Falls back to a typographic
 * placeholder for any strain with no `image_url` yet — all eight have art now,
 * so that branch is dormant until a ninth is added.
 *
 * The lockups vary from 1:1 (MAC1) to 2.9:1 (VerZace), so the box is 3:2 and
 * each strain carries an `artScale` that equalises rendered area — without it
 * VerZace reads as half the size of MAC1 on the same panel.
 *
 * The lockup used to be wrapped in a <HoloLogo> that laid Pokemon-card foil
 * over it — a pointer-tracked 3D tilt plus a color-dodge sparkle masked to the
 * artwork's own silhouette. That is gone; the logo is now drawn plainly. Only
 * the contact shadows remain, and they still need the panel-awareness below.
 *
 * TODO(assets): the nug bed is currently CSS. When tray photography exists,
 * drop it at /public/strains/<slug>-nugs.webp and render it in the marked
 * layer below the logo — the space is already reserved.
 */
/** sRGB relative luminance of a #rrggbb, for telling a light panel from a dark one. */
function luminance(hex: string) {
  const h = hex.replace('#', '')
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

export function StrainArt({ strain }: { strain: Strain }) {
  const { theme } = strain

  /**
   * Both shadows below sit BEHIND the artwork, so anything semi-transparent
   * shows them through and is darkened by them. On a dark panel that costs
   * nothing; on a light one it is obvious. Bacio Gelato's lockup is a quarter
   * cloud at 50% alpha, and at the original fixed values the shadows read as
   * the clouds turning grey against the pink.
   *
   * The threshold is 0.30 and NOT the obvious 0.5, which silently did nothing:
   * Bacio's pink measures 0.495. The panels split into two clusters with a wide
   * gap — six dark ones topping out at 0.156, two light ones at 0.495 and 0.707
   * — so 0.30 sits in the middle of that gap rather than on a cluster edge.
   */
  const light = luminance(theme.bg) > 0.3

  return (
    <div className="relative flex aspect-[3/2] w-full items-center justify-center">
      {/* --- nug bed (CSS stand-in for tray photography) --- */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle at 50% 55%, ${theme.accent}33 0%, transparent 70%)` }}
      />
      {/* Contact shadow under the lockup. Alpha follows the panel for the same
          reason the holo layers do: it sits BEHIND the artwork, so anything
          semi-transparent shows it through, and 34% black under Bacio's 50%
          cloud is a large part of what read as grey. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-2xl"
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,${light ? 0.1 : 0.34}) 0%, transparent 70%)`,
        }}
      />

      {strain.image_url ? (
        <div
          className="relative z-10 h-full w-full"
          style={{ transform: `scale(${strain.artScale})` }}
        >
          <Image
            src={strain.image_url}
            alt={`${strain.name} strain logo`}
            fill
            sizes="(max-width: 768px) 66vw, 34vw"
            priority={strain.sort_order <= 2}
            className="object-contain"
            style={{
              filter: light
                ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.13))'
                : 'drop-shadow(0 20px 38px rgba(0,0,0,0.42))',
            }}
          />
        </div>
      ) : (
        <div
          className="relative z-10 flex aspect-square h-[86%] flex-col items-center justify-center gap-3 rounded-full border-2 border-dashed px-8 text-center"
          style={{ borderColor: `${theme.accent}5C` }}
        >
          <span className="display text-[clamp(1.5rem,3vw,2.6rem)]" style={{ color: theme.accent }}>
            {strain.name}
          </span>
          <span className="micro" style={{ color: `${theme.fg}7A` }}>
            LOGO TO COME
          </span>
        </div>
      )}
    </div>
  )
}
