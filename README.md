# Cake Oklahoma — Site Framework

A frontend framework for the Cake Cannabis cultivation site. Built to be handed
to Claude Code for backend integration with the existing Supabase database.

## What's Here

A complete, working React frontend with:

- **Home** — cinematic hero, the collection grid, current drop feature, cultivation strip, locator teaser, partners CTA
- **Strains** (`/strains`) — full collection with type filter
- **Strain Detail** (`/strains/:slug`) — profile-style page, accent-color theming per strain, prev/next navigation
- **Cultivation** (`/cultivation`) — the grow philosophy and process
- **Locator** (`/locator`) — interactive Leaflet map of Oklahoma dispensaries with strain-level filtering
- **Partners** (`/partners`) — lead form with branching fields (dispensary / processor / customer / other), honeypot protection

## Run It

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
```

## Wiring to Supabase

The frontend is fully decoupled from the data layer. All swap points are in **one file**:
`src/lib/data.js`

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the hooks query
Supabase. Until then, they return mock data from `src/data/mockData.js`.

Create `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Expected Supabase Schema

The mock data mirrors the expected table shapes exactly. Claude Code can create
tables to match, or adjust the queries in `data.js` to match existing tables.

### `strains`

| column                | type      | notes                                        |
|-----------------------|-----------|----------------------------------------------|
| id                    | uuid/int  | PK                                           |
| slug                  | text      | unique, URL-safe (e.g. `bacio-gelato`)       |
| name                  | text      | display name                                 |
| cross                 | text      | e.g. `Sunset Sherbert × Thin Mint GSC`       |
| type                  | text      | `Indica Dominant` / `Hybrid` / `Sativa Dominant` |
| ratio                 | text      | e.g. `80/20`                                 |
| effects               | text[]    | `['Relaxing', 'Euphoric', 'Sedative']`       |
| lineage_story         | text      | the profile copy                             |
| packaging_image_url   | text      | swap-in for real bag photos                  |
| accent_color          | text      | hex, used for theming the detail page        |
| release_year          | int       |                                              |
| is_current_drop       | bool      | flags the featured release                   |
| is_active             | bool      | drives public display                        |
| labs_url              | text      | COA link                                     |
| sort_order            | int       | display order                                |

### `retailers`

| column            | type     | notes                                  |
|-------------------|----------|----------------------------------------|
| id                | uuid/int | PK                                     |
| name              | text     |                                        |
| address           | text     |                                        |
| city, state, zip  | text     |                                        |
| lat, lng          | float    | geocode once, store the result         |
| phone             | text     |                                        |
| omma_license      | text     |                                        |
| carries_strains   | text[]   | array of strain slugs                  |
| is_active         | bool     | drives map display                     |
| website_url       | text     | optional                               |

### `leads` (write target for the partners form)

| column           | type      | notes                                  |
|------------------|-----------|----------------------------------------|
| id               | uuid      | PK                                     |
| lead_type        | text      | `dispensary` / `processor` / `customer` / `other` |
| business_name    | text      |                                        |
| contact_name     | text      |                                        |
| email            | text      |                                        |
| phone            | text      |                                        |
| omma_license     | text      |                                        |
| city             | text      |                                        |
| monthly_volume   | text      |                                        |
| current_brands   | text      |                                        |
| message          | text      |                                        |
| source           | text      | `cake-website`                         |
| submitted_at     | timestamp |                                        |

### Row Level Security

**Critical**: this site uses the public anon key. RLS must be set so:

- `strains` — public `SELECT` where `is_active = true`
- `retailers` — public `SELECT` where `is_active = true`, restrict to public-readable columns only
- `leads` — public `INSERT` only, NO `SELECT` (so the form can submit but the public can't read submissions)
- All other tables (customers, orders, internal pricing, etc.) — no public access

### CRM Follow-Up Task

The `submitLead` function in `data.js` inserts to the `leads` table. To kick off
a CRM follow-up task, the recommended approach is a Postgres trigger or Edge
Function on insert — that way the trigger runs regardless of whether the lead
came through the website, the API, or any other source.

Suggested trigger logic:

1. On `INSERT` into `leads`
2. Insert a row into `crm_tasks` with the right assignee based on `lead_type`
3. Optionally send an email notification via Resend / Postmark

## Design Notes

- **Typography**: Fraunces (display) + JetBrains Mono (technical labels). Fraunces is variable, expressive, and reads luxe at large sizes. Mono is used sparingly for eyebrows, labels, prices, and other "technical" copy.
- **Color**: near-black background (`#0a0a0a`), off-white ink (`#f5f5f3`), holographic gradient reserved for the Cake wordmark only. Each strain has its own `accent_color` that subtly tints its detail page.
- **Placeholder Packaging**: until real bag photos are added to `packaging_image_url`, the `StrainCard` renders a generated mylar-bag placeholder using the strain's accent color. When real images go in, the placeholder is automatically replaced.
- **Logo**: inline SVG with animated holographic gradient. Renders crisp at any size.

## Swapping in Real Assets

When real packaging photos are ready:

1. Upload to Supabase Storage (recommended bucket: `strain-packaging`)
2. Set `packaging_image_url` on each strain row to the public URL
3. Photos should be:
   - PNG with transparent background (or shot on pure black `#0a0a0a`)
   - 800×1067px or larger, 3:4 aspect ratio
   - Consistent lighting and angle across all seven

## Routes Summary

- `/` — home
- `/strains` — collection grid
- `/strains/:slug` — individual strain page
- `/cultivation` — grow philosophy
- `/locator` — dispensary map
- `/partners` — lead form

## What's Not Built Yet

These are intentional gaps for Claude Code to wire in:

- Real Supabase env vars + queries (currently mocked but identical shape)
- CRM follow-up task trigger
- Email notifications on lead submission
- Coming-soon teaser for the 8th strain (when ready, just add a row with `is_current_drop = true` and adjust the previous current drop)
- Lab result (COA) PDFs — currently links to `cakeoklahoma.com/labs`
- Age gate / 21+ confirmation modal (recommend before launch)
- SEO meta tags per strain page
- Sitemap.xml + robots.txt
