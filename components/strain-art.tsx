'use client'

import type { Strain } from '@/lib/strains'
import { HoloLogo } from './holo-logo'

/**
 * Renders a strain's logo lockup on its nug bed. Falls back to a typographic
 * placeholder for strains whose art hasn't been drawn yet (Aloha Sugar).
 *
 * The lockups vary from 1:1 (MAC1) to 2.9:1 (VerZace), so the box is 3:2 and
 * each strain carries an `artScale` that equalises rendered area — without it
 * VerZace reads as half the size of MAC1 on the same panel.
 *
 * The logo itself is wrapped in <HoloLogo>, which lays Pokemon-card foil over
 * the artwork masked to its own silhouette. See that file for the technique.
 *
 * TODO(assets): the nug bed is currently CSS. When tray photography exists,
 * drop it at /public/strains/<slug>-nugs.webp and render it in the marked
 * layer below the logo — the space is already reserved.
 */
export function StrainArt({ strain }: { strain: Strain }) {
  const { theme } = strain

  return (
    <div className="relative flex aspect-[3/2] w-full items-center justify-center">
      {/* --- nug bed (CSS stand-in for tray photography) --- */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle at 50% 55%, ${theme.accent}33 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] h-[46%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.34) 0%, transparent 70%)' }}
      />

      {strain.image_url ? (
        <div
          className="relative z-10 h-full w-full"
          style={{ transform: `scale(${strain.artScale})` }}
        >
          <HoloLogo
            src={strain.image_url}
            alt={`${strain.name} strain logo`}
            priority={strain.sort_order <= 2}
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
