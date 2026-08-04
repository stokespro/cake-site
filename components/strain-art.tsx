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
   * Both holo layers darken semi-transparent artwork — the drop-shadow casts
   * black behind it, and `color-dodge` inside an isolated group blends against
   * transparent black. On the dark panels the whole set used to live on, that
   * is invisible. On a light one it is not: Bacio Gelato's lockup is a quarter
   * cloud at 50% alpha, and the two layers together cost it ~27 levels of
   * lightness, which reads as the clouds turning grey against the pink.
   *
   * So the effect is scaled to the panel rather than being fixed. Measured on
   * Bacio: the cloud composites to (234,197,208) with no effects at all, and
   * these values hold it near that instead of dragging it to (197,157,167).
   *
   * The threshold is 0.30 and NOT the obvious 0.5, which silently did nothing:
   * Bacio's pink measures 0.495. The panels actually split into two clusters
   * with a wide gap — the six dark ones top out at 0.156 (Aloha Sugar) while
   * the two light ones are 0.495 and 0.707 (Biscotti) — so 0.30 sits in the
   * middle of that gap rather than on the edge of a cluster.
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
          <HoloLogo
            src={strain.image_url}
            alt={`${strain.name} strain logo`}
            priority={strain.sort_order <= 2}
            shadow={light ? '0 12px 24px rgba(0,0,0,0.13)' : '0 20px 38px rgba(0,0,0,0.42)'}
            sparkle={light ? 0.16 : 0.42}
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
