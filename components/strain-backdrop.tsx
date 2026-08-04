'use client'

import Image from 'next/image'
import type { Strain } from '@/lib/strains'

/**
 * Per-strain backdrop for the pinned strain scroller — what sits behind the
 * panel instead of a single flat `theme.bg` hex.
 *
 * Two kinds, handled separately because they fail in opposite ways. See the
 * `StrainBackdrop` type in lib/strains.ts for the distinction; the short
 * version is that a tile repeats and cannot crop, while a scene must cover and
 * therefore always crops.
 *
 * ---- kind: 'tile' (VerZace) ----
 * A seamless repeating motif. WHY A TILE AND NOT THE SUPPLIED ARTWORK: the
 * Medusa arrived as a 1920x1080 render of the finished pattern, which can't be
 * used with `repeat` — the lattice is 200px across and 1920/200 = 9.6, so the
 * artwork's own edges land mid-motif and every repeat shows a seam.
 * /public/brand/medusa-tile.png is instead the minimal repeating unit rebuilt
 * from a single extracted motif: 200x489, three rows of the 1/3-drop lattice
 * (row offsets cycle 15 -> 148 -> 81 -> 15). Being an exact multiple of the
 * lattice on both axes it tiles with no seam at any size. If you regenerate it,
 * keep both dimensions on the lattice or the seam comes back.
 *
 * The tile is a white silhouette whose ALPHA carries the shape, used as a CSS
 * mask rather than drawn directly — that's what lets one grayscale asset be
 * tinted per strain from `theme.accent`, the same trick as <FlameGrid> and
 * <HoloLogo>.
 *
 * ---- kind: 'scene' (MAC1) ----
 * Full-bleed illustration through next/image, so it gets a srcset and AVIF/WebP
 * instead of shipping one 1920px JPEG to a phone. `object-cover` means a 16:9
 * scene on a 0.46:1 phone shows only ~26% of its width, so `position` decides
 * what survives — that is art direction, not a default worth guessing at.
 *
 * Both kinds get the scrim below; without it the strain name stack (13-16%
 * opacity) is unreadable over the art.
 */

/** Aspect of medusa-tile.png (489 / 200). Height is always derived from width. */
const TILE_ASPECT = 2.445

export function StrainBackdrop({ strain }: { strain: Strain }) {
  const { backdrop, theme } = strain
  if (!backdrop) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {backdrop.kind === 'tile' ? (
        <div
          className="absolute inset-0"
          style={{
            // Motif scales gently with the viewport so a phone doesn't show two
            // giant heads, but it never tracks the screen 1:1 — it's a texture,
            // so the tile count is meant to grow on a bigger display.
            ['--tile-w' as string]: 'clamp(104px, 13vw, 200px)',
            backgroundColor: theme.accent,
            opacity: backdrop.opacity,
            WebkitMaskImage: `url(${backdrop.src})`,
            maskImage: `url(${backdrop.src})`,
            WebkitMaskSize: `var(--tile-w) calc(var(--tile-w) * ${TILE_ASPECT})`,
            maskSize: `var(--tile-w) calc(var(--tile-w) * ${TILE_ASPECT})`,
            WebkitMaskRepeat: 'repeat',
            maskRepeat: 'repeat',
          }}
        />
      ) : backdrop.kind === 'scene' ? (
        <Image
          src={backdrop.src}
          alt=""
          fill
          // The panel is always full-bleed, so the rendered width is the
          // viewport width at every breakpoint.
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: backdrop.position, opacity: backdrop.opacity }}
        />
      ) : (
        <HorizonBackdrop backdrop={backdrop} />
      )}

      {/* Scrim, for the two art-derived kinds only. It runs edge to edge, but
          the inactive name stack is only 13-16% opacity and turns to mud over
          bare artwork, so this pulls `theme.bg` back where the type sits and
          leaves the art at full strength everywhere else.

          It has to follow the layout, which reflows at `md`, so there are two.
          A single radial tuned for the desktop panel covers almost the whole
          viewport once it's narrow and portrait — 115% x 78% of a 390x844
          panel is nearly all of it — which flattens the art to a wash.

          `horizon` is excluded deliberately: it's a drawing with a deliberate
          light/dark split, and hazing it toward one flat colour would destroy
          exactly the contrast it was designed around. */}
      {backdrop.kind !== 'horizon' && (
        <>
          <div
            // Desktop: art left, names centre, stats right. Bias the scrim right.
            className="absolute inset-0 hidden md:block"
            style={{
              background: `radial-gradient(115% 78% at 68% 50%, ${theme.bg} 0%, ${theme.bg}E6 34%, ${theme.bg}00 78%)`,
            }}
          />
          <div
            // Mobile: the grid stacks — art on top, name and stats beneath. So
            // the scrim runs top-to-bottom and leaves the upper half clear.
            className="absolute inset-0 md:hidden"
            style={{
              background: `linear-gradient(to bottom, ${theme.bg}00 0%, ${theme.bg}40 34%, ${theme.bg}D9 56%, ${theme.bg} 76%)`,
            }}
          />
        </>
      )}
    </div>
  )
}

/**
 * The curved-horizon drawing. Both bands are one element each; the arc is the
 * hard stop of a radial gradient, whose ellipse is solved from the two horizon
 * percentages rather than hard-coded, so the shape survives any aspect ratio.
 *
 * Solving it: put the ellipse centre on the bottom edge (50%, 100%). Its top
 * sits at `100 - ry`, which is the horizon at centre, giving ry directly. At
 * the left/right edge the horizontal offset is 50% of the width, so
 *
 *   dyEdge = ry * sqrt(1 - (50 / rx)^2)
 *
 * and rearranging for rx gives the width radius that lands the arc on
 * `horizonEdge`. For Biscotti's measured 64.7 / 68.1 that is rx ~= 117%.
 */
function HorizonBackdrop({
  backdrop,
}: {
  backdrop: Extract<NonNullable<Strain['backdrop']>, { kind: 'horizon' }>
}) {
  const { skyCentre, skyEdge, ground } = backdrop

  /** Solve the ground ellipse that puts the arc on those two heights. */
  const groundLayer = (centre: number, edge: number) => {
    const ry = 100 - centre
    const dyEdge = 100 - edge
    const rx = 50 / Math.sqrt(Math.max(1 - (dyEdge / ry) ** 2, 0.0001))
    // The 0.4% feather is what keeps the arc from stair-stepping.
    return `radial-gradient(ellipse ${rx.toFixed(2)}% ${ry.toFixed(2)}% at 50% 100%, ${ground} 0 99.6%, transparent 100%)`
  }

  return (
    <>
      {/* sky — measured as horizontal-only, hence the tall vertical radius */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 200% at 50% 40%, ${skyCentre} 0%, ${skyEdge} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: groundLayer(backdrop.horizonCentre, backdrop.horizonEdge) }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: groundLayer(backdrop.horizonCentreSm, backdrop.horizonEdgeSm) }}
      />
    </>
  )
}
