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
  /** Rules, stat underlines, accents. Also tints the backdrop motif. */
  accent: string
}

/**
 * What sits behind a strain panel instead of a flat `theme.bg`.
 *
 * The kinds are not variations on a theme — they behave differently enough that
 * collapsing them into one "background image" field would hide the thing that
 * actually matters about each:
 *
 *  - `tile` is a PATTERN. It has no composition, so it is never scaled to the
 *    screen; it repeats at a fixed size and a bigger display simply gets more
 *    repeats. Nothing can be cropped because there is nothing to crop.
 *  - `scene` is a PICTURE. It has a horizon and a subject, so it must be
 *    scaled to cover and therefore WILL crop — severely in portrait, where a
 *    16:9 scene shows about a quarter of its width. Art direction (which part
 *    survives the crop) is the whole problem, and `position` is the control.
 *  - `horizon` is a DRAWING, reproduced in CSS from measurements rather than
 *    shipped at all. It neither tiles nor crops: it is re-solved to whatever
 *    box it lands in, so it is exact on every viewport.
 *
 * Artwork arriving as a 1920x1080 JPEG says nothing about which one it is —
 * all three did. Measure it before choosing.
 */
export type StrainBackdrop =
  | {
      kind: 'tile'
      /** Seamless repeating unit — white silhouette whose alpha carries the shape. */
      src: string
      /**
       * Tint strength. Keep it low: this sits behind the strain name and stats,
       * and the logo's holo layer blends with `color-dodge`, so a loud backdrop
       * both hurts text contrast and blows out the foil.
       */
      opacity: number
    }
  | {
      kind: 'scene'
      /** Full-bleed artwork, rendered through next/image so it gets a srcset. */
      src: string
      /** Dimmed toward `theme.bg` — full-strength illustration eats the type. */
      opacity: number
      /** object-position. Decides what survives the crop on tall viewports. */
      position: string
    }
  | {
      /**
       * Two-tone sky over a curved horizon, drawn in CSS rather than shipped as
       * a bitmap. Biscotti's artwork arrived as a 1920x1080 JPEG, but measuring
       * it showed a design, not an illustration: the horizon sits within 2.27px
       * of a perfect circular arc across the full width, and the sky is a plain
       * horizontal gradient. Rasterising that is strictly worse — the supplied
       * file already bands badly (16 distinct values across the sky, in flat
       * runs averaging 12px, and only 3 vertically), which a browser-rendered
       * gradient does not do, and the hard arc picked up JPEG ringing. Drawn in
       * CSS it is exact at any size, costs no request, and lets the horizon be
       * placed against the layout instead of baked to the artwork's aspect.
       */
      kind: 'horizon'
      /** Sky gradient, brightest at centre falling to the edges. */
      skyCentre: string
      skyEdge: string
      /** Flat colour below the horizon. */
      ground: string
      /**
       * Text colour for chrome that sits on the ground band. `theme.fg` is
       * chosen against the sky, and on a two-tone backdrop one colour cannot
       * serve both: Biscotti's #131316 scores 15.8:1 on the sky and 1.27:1 on
       * the ground, i.e. invisible. The scroller's bottom bar is always at the
       * foot of the panel and therefore always on the ground, so it takes this.
       */
      groundFg: string
      /**
       * Horizon height as a percentage of panel height, at the arc's centre and
       * where it meets the left/right edges. The component solves the ellipse
       * from these two numbers, so the arc keeps its shape at any aspect ratio.
       */
      horizonCentre: number
      horizonEdge: number
      /**
       * The same pair for the stacked mobile layout. Required, not optional,
       * because the desktop values are actively wrong below `md` and a silent
       * fallback would ship that: the grid reflows to art-over-copy, so a
       * horizon at 64.7% lands squarely through the strain name and stats and
       * leaves dark type on the dark band. Dropping the arc to the foot of the
       * panel keeps all copy on the sky and one text colour honest throughout.
       */
      horizonCentreSm: number
      horizonEdgeSm: number
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
  /** Backdrop art, or null for a flat `theme.bg` panel. */
  backdrop: StrainBackdrop | null
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
    backdrop: null,
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
    backdrop: null,
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
    // -v2 rather than overwriting biscotti.webp. <HoloLogo> loads the artwork
    // TWICE by different routes — once through next/image (optimised, cached
    // under .next/cache/images) and once as a raw CSS mask URL (browser cache).
    // Replacing bytes at a fixed path lets those two caches disagree, and the
    // logo then renders as a ghosted double image: the old silhouette masked
    // over the new draw. That is not a dev-only hazard; Vercel restores
    // .next/cache between builds. A new filename retires both copies at once.
    image_url: '/strains/biscotti-v2.webp',
    // Re-derived when the lockup was replaced with the higher-res draw: the new
    // file is 1.61:1 where the old was 2.03:1, and since object-contain is
    // width-limited in this 3:2 box, the same scale would have rendered it ~28%
    // larger in area than its neighbours. 1.06 * sqrt(1.609/2.027).
    artScale: 0.944,
    featured: false,
    sort_order: 3,
    theme: {
      bg: '#F6D97C',
      fg: '#131316',
      muted: 'rgba(19,19,22,0.16)',
      accent: '#7A4A22',
    },
    backdrop: {
      kind: 'horizon',
      skyCentre: '#FDEF8E',
      skyEdge: '#F1B44E',
      ground: '#24292F',
      // The sky's own centre colour rather than plain white — 12.5:1 on the
      // ground, and it belongs to this palette where white would not.
      groundFg: '#FDEF8E',
      // Measured off the supplied artwork: 64.7% at centre, 68.1% at the edges.
      horizonCentre: 64.7,
      horizonEdge: 68.1,
      // Phone: the copy fills the lower half, so the arc drops beneath it.
      horizonCentreSm: 88,
      horizonEdgeSm: 91.4,
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
    backdrop: null,
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
    backdrop: null,
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
    backdrop: null,
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
      // Sampled from the backdrop artwork's shadows so the scrim reads as the
      // scene receding rather than as a coloured veil over it. Was #5A2D82.
      bg: '#0A2C3C',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.16)',
      accent: '#9BE84A',
    },
    backdrop: {
      kind: 'scene',
      src: '/strains/mac1-scene.webp',
      opacity: 0.62,
      // Biased left of centre and below the horizon: keeps the rock formation
      // and skyline in frame when a 16:9 scene is cropped to a phone's 0.46:1.
      position: '38% 58%',
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
    backdrop: { kind: 'tile', src: '/brand/medusa-tile.png', opacity: 0.34 },
  },
]

/** Product lines — sourced from `public.product_types`. Drives the left rail. */
export const productLines = [
  { label: 'PREMIUM', slug: 'premium' },
  { label: 'CAKE BITES', slug: 'bites' },
] as const
