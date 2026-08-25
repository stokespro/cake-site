/**
 * CAKE strain catalog.
 *
 * SOURCE OF TRUTH: CAKEMENU2026.html (wholesale menu master) — crosses, types,
 * and effects are copied verbatim from it. Logo art was originally extracted
 * from that same file into /public/strains/; Biscotti, Cereal Milk and Aloha
 * Sugar have since been replaced with higher-resolution supplied draws.
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
 *  - Aloha Sugar IS in the strains table now, and is the only row populated:
 *    thc_min/max, terpene_min/max, flavor_notes, effects, lineage, logo_url
 *    and background_url are filled for it and null for the other seven. Its
 *    values here were copied from there.
 *  - DO NOT swap this file for a live query yet. Seven rows are empty, seven
 *    are typed 'hybrid' (wrong for the five indicas), all eight share
 *    sort_order 0 so the ordering above would be lost, and there is no column
 *    for the indica/sativa RATIO at all — `split` exists only here.
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
 *  - `wash` is the same idea with nothing on it: a bare radial gradient, for
 *    artwork that is only a colour falloff.
 *
 * Artwork arriving as a 1920x1080 JPEG says nothing about which one it is —
 * all three did. Measure it before choosing.
 */
/** A radial gradient, brightest at the centre and falling to the edges. */
export type RadialWash = { centre: string; edge: string }

export type StrainBackdrop =
  | {
      /**
       * Nothing but a radial wash — the simplest kind, for artwork that is a
       * plain gradient with no motif or composition at all. Drawn rather than
       * shipped for the same reason as `horizon`: a browser gradient does not
       * band, costs no request, and restretches to any viewport instead of
       * cropping.
       */
      kind: 'wash'
      wash: RadialWash
    }
  | {
      kind: 'tile'
      /** Seamless repeating unit — white silhouette whose alpha carries the shape. */
      src: string
      /**
       * height / width of that file. The rendered tile is sized from its width
       * alone and the height derived from this, so the lattice cannot be
       * accidentally skewed by setting the two independently.
       */
      aspect: number
      /** Rendered tile width. A texture, so this is a size, not a fraction of the screen. */
      width: string
      /**
       * Colour the mask is filled with. Explicit rather than reaching for
       * `theme.accent`: the accent is a UI colour for rules and underlines, and
       * on Bacio the motif wants to be barely-there texture (1.9:1 against its
       * own wash) while the accent still has to be legible as a rule. Tying
       * them together means one cannot move without wrecking the other.
       */
      color: string
      /**
       * Tint strength. Keep it low — this sits behind the strain name and the
       * stats, and the inactive name stack is only 13-16% opacity, so a loud
       * backdrop costs legibility before it buys anything.
       */
      opacity: number
      /**
       * Optional radial wash painted under the motif, for artwork whose
       * background is a gradient rather than the flat `theme.bg`.
       */
      wash?: RadialWash
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
  /**
   * Indica/sativa balance, e.g. "70/30". The label beneath it is derived from
   * `type` rather than stored, so the ratio and the word can never disagree.
   */
  split: string
  /**
   * Potency and terpene ranges, exactly as they should read on the panel —
   * whole display strings including any % sign, so whatever form the lab
   * results take ("24-28%", "26%") renders literally.
   *
   * NULL UNTIL SUPPLIED, and rendered as an em dash. These are regulated
   * potency claims on a consumer-facing page: they must come from actual COAs.
   * Do not fill them with plausible-looking numbers.
   */
  thcRange: string | null
  terpRange: string | null
  /** Three flavour notes. Empty until supplied; renders as an em dash. */
  flavors: string[]
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
    split: '70/30',
    // From Supabase: thc_min/max 26/29, terpene_min/max 2.6/3.2, flavor_notes
    // "Pineapple, citrus, sweet sugar" (title-cased to match `effects`).
    thcRange: '26-29%',
    terpRange: '2.6-3.2%',
    flavors: ['Pineapple', 'Citrus', 'Sweet Sugar'],
    cross: 'Truffaloha × Blueberry Sugar',
    effects: ['Uplifted', 'Energetic', 'Focused'],
    grow_method: 'Indoor',
    availability: 'coming_soon',
    badge: 'NEW 2026 RELEASE',
    image_url: '/strains/aloha-sugar.webp',
    // Trued by measuring the rendered lockup, not derived alone: this is 0.97:1
    // and sits below the 3:2 box, so object-contain binds on height and area
    // goes as scale^2 x aspect. Calibrated against Cereal Milk (0.947:1 at
    // 1.146 -> 82.8k px^2) to land in the current 83-85k cluster.
    artScale: 1.133,
    featured: true,
    sort_order: 1,
    theme: {
      // Deepened from #0E7C6B so the scrim has something dark enough to rescue
      // white copy with. The backdrop is a bright beach — white scores 5.6:1 on
      // its sky and 5.0:1 on its sea, but only 3.5:1 on the sunset band and
      // 2.3:1 on the sand, so the scrim is load-bearing here rather than
      // cosmetic, and it is drawn in theme.bg.
      bg: '#0A4F52',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.16)',
      accent: '#8FE8D5',
    },
    backdrop: {
      kind: 'scene',
      src: '/strains/aloha-sugar-beach.webp',
      position: '50% 50%',
      // Lower than the other two scenes. This artwork is the brightest of the
      // set and its lower half is sand, which white type cannot sit on at all;
      // muting it toward the teal is what buys that back.
      opacity: 0.72,
    },
  },
  {
    id: '2a8be3d3-d928-4775-9bb1-8b3a8ab18727',
    name: 'Cake Runtz',
    slug: 'cake-runtz',
    type: 'hybrid',
    split: '50/50',
    thcRange: null,
    terpRange: null,
    flavors: [],
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
      // Retimed to the swirl's own dark purple (was #1B1464) so the cross-fade
      // between panels lands on the colour actually on screen, and so the scrim
      // — which is drawn in theme.bg — reads as the swirl receding rather than
      // as a blue haze over a purple backdrop.
      bg: '#180030',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.15)',
      accent: '#F5D04E',
    },
    backdrop: {
      kind: 'scene',
      // Centred, so object-cover's symmetric crop keeps the vortex origin on
      // the panel centre at EVERY aspect ratio with no per-breakpoint anchoring.
      // That only holds because the file was cropped on ingest so the swirl
      // centre is the image centre exactly: it measured (49.38%, 49.44%), and
      // the crop to 1896x1068 removes that 0.6% bias. Re-export it off-centre
      // and the origin drifts as the viewport changes.
      src: '/strains/cake-runtz-swirl.webp',
      position: '50% 50%',
      // Much lower than MAC1's 0.62. White copy scores 19.4:1 on the swirl's
      // dark purple but only 4.6:1 on its magenta bands and 1.1:1 on the white
      // hairlines, so at full strength the name stack sits on stripes it cannot
      // beat. This plus the scrim is what keeps the type readable.
      opacity: 0.38,
    },
  },
  {
    id: 'cf0ffddb-cd35-4b16-8241-780c2c3714b5',
    name: 'Biscotti',
    slug: 'biscotti',
    type: 'indica',
    split: '60/40',
    thcRange: null,
    terpRange: null,
    flavors: [],
    cross: 'Gelato 25 × South Florida OG',
    effects: ['Relaxed', 'Euphoric', 'Creative'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    // -v2 is HISTORICAL. It was needed when <HoloLogo> loaded the artwork twice
    // by different routes — once through next/image and once as a raw CSS mask —
    // because replacing bytes at a fixed path let those two caches disagree into
    // a ghosted double image. HoloLogo is gone and there is now a single load
    // path, so that hazard no longer exists; the name is kept only because
    // renaming back would buy nothing.
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
    thcRange: null,
    terpRange: null,
    flavors: [],
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
      bg: '#043649',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.14)',
      accent: '#5FD3F0',
    },
    backdrop: {
      kind: 'tile',
      // GENERATED, not supplied artwork — no Bubble Bath background exists, so
      // this echoes the motif already in the lockup. Each bubble is a bright
      // rim, a faint interior and one specular highlight, laid out from a fixed
      // list (no RNG, so it is reproducible) and drawn on a 3x canvas that is
      // then folded down, which is what makes it seamless: anything crossing an
      // edge lands on its own wrap partner. Replace freely with real art.
      src: '/brand/bubble-tile.png',
      aspect: 1, // 360 / 360
      // Larger than the Medusa's because these are sparse shapes, not a dense
      // lattice — at the Medusa's size they read as noise rather than bubbles.
      width: 'clamp(150px, 20vw, 300px)',
      color: '#5FD3F0',
      opacity: 0.3,
    },
  },
  {
    id: '30037ef4-cbef-4b08-8d02-9cf916d5cea5',
    name: 'Bacio Gelato',
    slug: 'bacio-gelato',
    type: 'indica',
    split: '80/20',
    thcRange: null,
    terpRange: null,
    flavors: [],
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
      // Rethemed for the supplied backdrop, which is light pink where this
      // panel was deep maroon. White copy on that wash is ~1.6:1, so the whole
      // panel inverts: #3D0A1E clears 4.5:1 on both the wash centre (8.65:1)
      // and its darker corners (5.08:1), and reads as maroon rather than as a
      // neutral black. The old #A03050 background becomes the rule colour.
      bg: '#F1A6BA',
      fg: '#3D0A1E',
      muted: 'rgba(61,10,30,0.16)',
      accent: '#A03050',
    },
    backdrop: {
      kind: 'tile',
      // Built from the supplied sunday-icon.png, not extracted from the
      // background render — the render's motifs are only a few levels off their
      // own background, so a clean icon is a far better source.
      //
      // The mask is weighted by DARKNESS rather than taken straight from alpha:
      // a flat silhouette renders the sundae as a blob, losing the glass
      // strokes, the drips and the scoop/cup boundary that the reference shows.
      src: '/brand/sundae-tile.png',
      aspect: 1.875, // 600 / 320 — two rows of the half-drop lattice
      width: 'clamp(170px, 21vw, 320px)',
      color: '#C4698A',
      opacity: 0.55,
      // The reference background is a radial wash, not a flat fill.
      wash: { centre: '#F1A6BA', edge: '#C97493' },
    },
  },
  {
    id: '819e7386-51a8-43c7-bebe-3554a04d2287',
    name: 'Cereal Milk',
    slug: 'cereal-milk',
    type: 'indica',
    split: '60/40',
    thcRange: null,
    terpRange: null,
    flavors: [],
    cross: 'Thin Mint GSC × Undisclosed',
    effects: ['Joyful', 'Relaxing', 'Euphoric'],
    grow_method: 'Indoor',
    availability: 'available',
    badge: null,
    // -v2 for the same historical reason as biscotti-v2 — see the note there.
    // The double-load hazard died with <HoloLogo>; the name is just kept.
    image_url: '/strains/cereal-milk-v2.webp',
    // The replacement is 0.947:1 where the old was 1.115:1 — portrait now. Both
    // sit BELOW the 3:2 box, so object-contain binds on height and rendered
    // area goes as scale² × aspect, the opposite of Biscotti's width-limited
    // case. Carrying 1.02 across gave 1.107, but that only preserves whatever
    // the old value happened to be; measuring the rendered lockups instead put
    // it at 78.4k px² against a Biscotti/VerZace cluster of 83-85k, so this is
    // trued to the cluster: 1.107 * sqrt(84/78.4).
    artScale: 1.146,
    featured: false,
    sort_order: 6,
    theme: {
      // Retimed from blue to the backdrop's own red. White copy still clears
      // 4.5:1 across the whole wash (5.28:1 at the bright centre, 8.74:1 at the
      // edges), so unlike Biscotti and Bacio this needed no inversion. The
      // yellow accent stays — it is already the colour of the lockup's own
      // "Thin Mint GSC x Undisclosed" ribbon.
      bg: '#C6353C',
      fg: '#FFFFFF',
      muted: 'rgba(255,255,255,0.16)',
      accent: '#FFE07A',
    },
    backdrop: {
      kind: 'wash',
      // Measured off the supplied backdrop: all four corners land on #8A2729
      // and it brightens to #C6353C toward the middle.
      wash: { centre: '#C6353C', edge: '#8A2729' },
    },
  },
  {
    id: 'de3537d5-46fc-40c1-9e7d-db98931c26bb',
    name: 'MAC1',
    slug: 'mac1',
    type: 'hybrid',
    split: '50/50',
    thcRange: null,
    terpRange: null,
    flavors: [],
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
    thcRange: null,
    terpRange: null,
    flavors: [],
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
    backdrop: {
      kind: 'tile',
      src: '/brand/medusa-tile.png',
      aspect: 2.445, // 489 / 200
      width: 'clamp(104px, 13vw, 200px)',
      color: '#D4AF37',
      opacity: 0.34,
    },
  },
]

/** Product lines — sourced from `public.product_types`. Drives the left rail. */
export const productLines = [
  { label: 'PREMIUM', slug: 'premium' },
  { label: 'CAKE BITES', slug: 'bites' },
] as const
