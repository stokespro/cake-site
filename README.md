# CAKE Oklahoma Website

Premium cannabis cultivator website built with Next.js 14 and Supabase.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and backend
- **Framer Motion** - Animations
- **React Hook Form + Zod** - Form handling
- **Vercel** - Deployment

## Features

- ✅ Interactive vertical strain menu with hover effects
- ✅ Individual strain detail pages with batch-specific lab results
- ✅ Sample request form with CRM integration
- ✅ Dispensary locator (reads from CRM database)
- ✅ Lab results archive with COA downloads
- ✅ About, Partners, and Contact pages
- ✅ Fully responsive design
- ✅ SEO optimized

## Prerequisites

Before deploying, run the SQL migration in Supabase:

```sql
-- See MIGRATION_REQUIRED.md for the full SQL script
```

Go to: https://supabase.com/dashboard/project/spkimmrtaxwnysjqkxix/sql

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://spkimmrtaxwnysjqkxix.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deployed on Vercel:

```bash
# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

## Database Schema

### New Tables Created by Website

- `strain_batches` - Individual harvest batches with lab results
- `sample_requests` - Sample request form submissions
- `subscribers` - Email/SMS subscribers (future)

### Existing CRM Tables (Read-Only)

- `strains` - Strain genetics library
- `customers` - Dispensary customer database

### Views

- `public_dispensary_locations` - Public-safe view of dispensary locations

## Key Files

- `/app/page.tsx` - Homepage with strain menu
- `/app/strains/[slug]/page.tsx` - Strain detail pages
- `/app/request-samples/page.tsx` - Sample request form
- `/app/api/sample-request/route.ts` - API endpoint for form submission
- `/components/StrainCard.tsx` - Interactive strain card with hover effects
- `/lib/supabase.ts` - Supabase client configuration

## Brand Guidelines

- **Colors**: Black (#000000), White (#FFFFFF), Red accent (#DC2626)
- **Typography**: Inter font, bold weights (700-900) for headings
- **Photography**: High-contrast macro shots on black backgrounds
- **Tone**: Bold, premium, transparent

## License

Proprietary - CAKE Oklahoma

## Contact

For questions or issues: sales@cakeoklahoma.com
