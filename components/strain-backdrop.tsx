'use client'

import type { Strain } from '@/lib/strains'

/**
 * Per-strain patterned backdrop for the pinned strain scroller.
 *
 * The panel behind each strain used to be one flat `theme.bg` hex. This adds a
 * repeating brand motif over it — VerZace gets the Medusa lattice from the
 * Versace-referencing packaging.
 *
 * WHY A TILE AND NOT THE SUPPLIED ARTWORK: the motif was delivered as a
 * 1920x1080 render of the finished pattern. That can't be used with
 * `repeat` — the lattice is 200px across and 1920/200 = 9.6, so the artwork's
 * own edges land mid-motif and every repeat shows a seam. /public/brand/
 * medusa-tile.png is instead the minimal repeating unit rebuilt from a single
 * extracted motif: 200x489, which is three rows of the 1/3-drop lattice
 * (row offsets cycle 15 -> 148 -> 81 -> 15, i.e. +200/3 each row). Being an
 * exact multiple of the lattice in both axes, it tiles with no seam at any
 * size. If you regenerate it, keep both dimensions on the lattice or the
 * seam comes back.
 *
 * The tile is a white silhouette whose ALPHA carries the shape, used as a CSS
 * mask rather than drawn directly. That's what lets one grayscale asset be
 * tinted per strain from `theme.accent` — same trick as <FlameGrid> and
 * <HoloLogo>. Add a motif for another strain by dropping its tile in
 * /public/brand/ and setting `pattern` in lib/strains.ts.
 *
 * SIZING: the tile width is a clamp, not a fixed px, so the motif keeps a
 * sane physical size from a 375px phone up. Height is derived from it to hold
 * the 200:489 aspect — set them independently and the lattice skews.
 */

/** Aspect of medusa-tile.png (489 / 200). Height is always derived from width. */
const TILE_ASPECT = 2.445

export function StrainBackdrop({ strain }: { strain: Strain }) {
  const { pattern, theme } = strain
  if (!pattern) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          // Motif scales gently with the viewport so a phone doesn't show two
          // giant heads, but it never tracks the screen 1:1 — it's a texture,
          // so the tile count is meant to grow on a bigger display.
          ['--tile-w' as string]: 'clamp(104px, 13vw, 200px)',
          backgroundColor: theme.accent,
          opacity: pattern.opacity,
          WebkitMaskImage: `url(${pattern.src})`,
          maskImage: `url(${pattern.src})`,
          WebkitMaskSize: `var(--tile-w) calc(var(--tile-w) * ${TILE_ASPECT})`,
          maskSize: `var(--tile-w) calc(var(--tile-w) * ${TILE_ASPECT})`,
          WebkitMaskRepeat: 'repeat',
          maskRepeat: 'repeat',
        }}
      />

      {/* Scrim. The motif runs edge to edge, but the name stack and stats sit
          in the right two-thirds and the inactive names are only 13% opacity —
          over bare pattern they turn to mud. This pulls `theme.bg` back over
          the middle and right so type has a calm bed, and leaves the pattern
          reading at full strength along the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(115% 78% at 68% 50%, ${theme.bg} 0%, ${theme.bg}E6 34%, ${theme.bg}00 78%)`,
        }}
      />
    </div>
  )
}
