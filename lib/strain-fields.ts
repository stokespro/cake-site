import type { Strain } from './types'

/**
 * Postgres stores `strains.effects` and `strains.flavor_notes` as TEXT, but
 * lib/types.ts declares both as `string[]` and four call sites consume them
 * that way — `.map()`, `.slice().join()`. Those disagree, and the disagreement
 * is not theoretical: with a populated row both /strains and /strains/[slug]
 * throw "strain.effects.map is not a function" and return 500.
 *
 * It stayed hidden only because every row was null, so the optional chains
 * short-circuited. The first strain to get real data breaks both pages.
 *
 * Rather than rewrite four call sites, the conversion happens once here at the
 * fetch boundary. Everything downstream keeps the array contract it already
 * assumes.
 */

/**
 * Split a delimited text column into a trimmed list.
 *
 * Tolerant on purpose — this is hand-entered data. Accepts an array already
 * (so it is safe to run twice), commas or semicolons as separators, stray
 * whitespace, and trailing delimiters. Returns [] rather than [''] for empty
 * input so `.length` checks in the templates behave.
 */
export function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Bring a raw `strains` row up to the shape the app's types promise. Apply
 * this to anything fetched from the strains table before it reaches a
 * component.
 */
export function normalizeStrain(row: Strain): Strain {
  return {
    ...row,
    effects: toList(row.effects),
    flavor_notes: toList(row.flavor_notes),
  }
}
