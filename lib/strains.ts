/**
 * CAKE strain catalog.
 *
 * SOURCE OF TRUTH: CAKEMENU2026.html (wholesale menu master) — crosses, types,
 * and effects are copied verbatim from it. Strain logo art was extracted from
 * that same file into /public/strains/.
 *
 * Shape mirrors `public.strains` in the `cake` Supabase project
 * (ref: spkimmrtaxwnysjqkxix) so this can be swapped for a live query with no
 * component changes:
 *
 *   const { data } = await supabase
 *     .from('strains')
 *     .select('*')
 *     .eq('availability', 'available')
 *     .order('sort_order')
 *
 * NOTE FOR CLAUDE CODE:
 *  - `Aloha Sugar` is NOT yet in the strains table. Insert it before wiring
 *    this page to Supabase, or the section will render 7 of 8.
 *  - `theme` is presentation-only and is not a DB column. Either keep this
 *    file as a theme map keyed by slug, or add a jsonb `theme` column.
 */

export type StrainType = 'indica' | 'sativa' | 'hybrid'

export type StrainTheme = {
  /** Full-bleed section background. */
  bg: string
  /** Primary text color on that background. */
  fg: string
  /** Inactive names in the vertical stack. */
  muted: string
  /** Rules, stat underlines, accents. */
  accent: string
}

export type Strain = {
  id: string | null
  name: string
  slug: string
  type: StrainType
  /** Display string for indica/sativa balance, e.g. "60/40". */
  split: string
  splitLabel: string
  cross: string
  effects: string[]
  grow_method: string
  availability: 'available' | 'limited' | 'sold_out' | 'coming_soon'
  badge: string | null
  /** Logo art. Local today; swap for the Supabase Storage public URL later. */
  image_url: string | null
  /**
   * Visual size correction. The logo lockups range from 1:1 (MAC1) to 2.9:1
   * (VerZace); object-contain alone makes the wide ones read as much smaller.
   * This equalises their rendered AREA rather than their bounding box.
   */
  artScale: number
  featured: boolean
  sort_order: number
  theme: StrainTheme
}

export const strains: Strain[] = [
  {
    id: null, // NOT YET IN SUPABASE — insert before going live
    name: 'Aloha Sugar',
    slug: 'aloha-sugar',
    type: 'sativa',
    split: 'SAT',
    splitLabel: 'DOMINANT',
    cross: 'Truffaloha × Blueberry Sugar',
    effects: ['Uplifted', 'Energetic', 'Focused'],
    grow_method: 'Indoor',
    availability: 'coming_soon',
    badge: 'NEW 2026 RELEASE',
    image_url: null, // logo to come — <StrainArt /> renders the fallback lockup
    artScale: 1.0,
    featured: true,
    sort_order: 1,
    theme: {
      bg: '#0E7C6B',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#8FE8D5',
    },
  },
  {
    id: '2a8be3d3-d928-4775-9bb1-8b3a8ab18727',
    name: 'Cake Runtz',
    slug: 'cake-runtz',
    type: 'hybrid',
    split: '50/50',
    splitLabel: 'HYBRID',
    cross: 'Gelato × Zkittles',
    effects: ['Relaxed', 'Euphoric', 'Joyful'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: 'HOUSE STRAIN',
    image_url: '/strains/cake-runtz.webp',
    artScale: 0.99,
    featured: true,
    sort_order: 2,
    theme: {
      bg: '#1B1464',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.13)',
      accent: '#F5D04E',
    },
  },
  {
    id: 'cf0ffddb-cd35-4b16-8241-780c2c3714b5',
    name: 'Biscotti',
    slug: 'biscotti',
    type: 'indica',
    split: '60/40',
    splitLabel: 'INDICA DOM',
    cross: 'Gelato 25 × South Florida OG',
    effects: ['Relaxed', 'Euphoric', 'Creative'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/biscotti.webp',
    artScale: 1.06,
    featured: false,
    sort_order: 3,
    theme: {
      bg: '#E3D5BC',
      fg: '#131316',
      muted: 'rgba(19,19,22,0.13)',
      accent: '#7A4A22',
    },
  },
  {
    id: '2558796b-3807-429f-9988-6156aca31cc1',
    name: 'Bubble Bath',
    slug: 'bubble-bath',
    type: 'indica',
    split: '60/40',
    splitLabel: 'INDICA DOM',
    cross: 'The Soap × Project 4516',
    effects: ['Relaxed', 'Euphoric', 'Happy'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/bubble-bath.webp',
    artScale: 1.06,
    featured: false,
    sort_order: 4,
    theme: {
      bg: '#10485F',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#5FD3F0',
    },
  },
  {
    id: '30037ef4-cbef-4b08-8d02-9cf916d5cea5',
    name: 'Bacio Gelato',
    slug: 'bacio-gelato',
    type: 'indica',
    split: '80/20',
    splitLabel: 'INDICA DOM',
    cross: 'Sunset Sherbert × Thin Mint GSC',
    effects: ['Relaxing', 'Euphoric', 'Sedative'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/bacio-gelato.webp',
    artScale: 0.94,
    featured: false,
    sort_order: 5,
    theme: {
      bg: '#A03050',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#F7C9D6',
    },
  },
  {
    id: '819e7386-51a8-43c7-bebe-3554a04d2287',
    name: 'Cereal Milk',
    slug: 'cereal-milk',
    type: 'indica',
    split: '60/40',
    splitLabel: 'INDICA DOM',
    cross: 'Thin Mint GSC × Undisclosed',
    effects: ['Joyful', 'Relaxing', 'Euphoric'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/cereal-milk.webp',
    artScale: 1.02,
    featured: false,
    sort_order: 6,
    theme: {
      bg: '#2F6FB0',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#FFE07A',
    },
  },
  {
    id: 'de3537d5-46fc-40c1-9e7d-db98931c26bb',
    name: 'MAC1',
    slug: 'mac1',
    type: 'hybrid',
    split: '50/50',
    splitLabel: 'HYBRID',
    cross: 'Alien Cookies × Miracle 15',
    effects: ['Uplifted', 'Energetic', 'Euphoric'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/mac1.webp',
    artScale: 1.13,
    featured: false,
    sort_order: 7,
    theme: {
      bg: '#5A2D82',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#9BE84A',
    },
  },
  {
    id: '9af05002-ab79-4326-97f7-9ea22b901a01',
    name: 'VerZace',
    slug: 'verzace',
    type: 'indica',
    split: '60/40',
    splitLabel: 'INDICA DOM',
    cross: 'LCG × Zkittlez',
    effects: ['Uplifted', 'Mood Boost', 'Relaxed'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    image_url: '/strains/verzace.webp',
    artScale: 1.28,
    featured: false,
    sort_order: 8,
    theme: {
      bg: '#0A0A0B',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.13)',
      accent: '#D4AF37',
    },
  },
]

/** Product lines — sourced from `public.product_types`. Drives the left rail. */
export const productLines = [
  { label: 'PREMIUM', slug: 'premium' },
  { label: 'CAKE BITES', slug: 'bites' },
] as const
