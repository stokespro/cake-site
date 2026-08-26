/**
 * Which strains are "active" — i.e. actually reach the public site.
 *
 * `strains.availability` is a free-text column (`string | null` in the
 * generated types), and the values in use are 'available', 'limited',
 * 'sold_out' and 'coming_soon'.
 *
 * THIS LIST IS THE WHOLE POLICY. Change it here and every surface follows;
 * there is deliberately no second copy in a page component. A strain that is
 * not active is absent from the listing AND 404s on its detail page, rather
 * than being listed-but-greyed — "lands on the site" is treated as binary.
 *
 * 'coming_soon' is excluded on the grounds that a strain nobody can buy yet is
 * not active. That is the one judgement call in here: if a pre-announcement
 * should be visible (Aloha Sugar carries a "NEW 2026 RELEASE" badge, which is
 * exactly that kind of thing), add it to this array and both surfaces update.
 *
 * A null/empty availability is treated as NOT active, so a half-entered row
 * cannot leak onto the site by omission.
 */
export const ACTIVE_AVAILABILITY = ['available', 'limited'] as const

export function isActive(availability: string | null | undefined): boolean {
  if (!availability) return false
  return (ACTIVE_AVAILABILITY as readonly string[]).includes(availability.trim().toLowerCase())
}
