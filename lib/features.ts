/**
 * The 01 / 02 / 03 pillars for the rotating-mark section.
 *
 * TODO(copy): Joshua said he'd supply the real key headers about CAKE.
 * These are stand-ins written from what's verifiable in the CRM and the
 * wholesale menu — replace the `title`/`body` strings, keep the shape.
 */

export type Feature = {
  index: string
  title: string
  body: string
  /** Big proof point rendered under the copy. Keep it short. */
  stat?: { value: string; label: string }
}

export const features: Feature[] = [
  {
    index: '01',
    title: 'Grown Indoor.\nEvery Batch.',
    body: 'Sealed rooms, controlled cycles, no outdoor variance. Every strain we sell is finished under the same roof to the same standard.',
    stat: { value: '100%', label: 'INDOOR' },
  },
  {
    index: '02',
    title: 'Hand-Selected\nA-Grade Buds',
    body: 'Premium is hand-selected top bud, packed in 3.5g soft-touch mylar with a flower tray insert. Nothing goes in the bag that we would not smoke.',
    stat: { value: '3.5g', label: 'PREMIUM UNIT' },
  },
  {
    index: '03',
    title: 'Full-Panel\nLab Tested',
    body: 'Every harvest is tested and published. Potency, terpenes, pesticides, heavy metals, microbials. COAs live at cakeoklahoma.com/labs.',
    stat: { value: 'COA', label: 'ON EVERY LOT' },
  },
  {
    index: '04',
    title: 'Seed-to-Sale\nTracked',
    body: 'METRC-compliant from clone to case. Ordering, packaging, and fulfillment run on our own system, so your case count is right the first time.',
    stat: { value: '32', label: 'UNITS PER CASE' },
  },
]

/** Wholesale pricing — verbatim from CAKEMENU2026.html. */
export const pricing = [
  {
    name: 'PREMIUM',
    tagline: 'CAKE at its finest',
    desc: 'Hand-selected A-grade buds in a 3.5 gram soft-touch mylar with flower tray insert.',
    caseSize: 'Case of 32 units',
    rows: [
      { tier: '1–4 cases', price: '$10.50' },
      { tier: '5+ cases', price: '$10.00' },
    ],
  },
  {
    name: 'CAKE BITES',
    tagline: 'Full flavor. Bite-sized.',
    desc: 'Same quality, smaller buds, smart price. 14 grams of B+ flower.',
    caseSize: 'Case of 16 units',
    rows: [{ tier: '1+ cases', price: '$30.00' }],
  },
]
