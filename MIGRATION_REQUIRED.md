# Required Database Migration

Before deploying the site, run this SQL in Supabase SQL Editor:
https://supabase.com/dashboard/project/spkimmrtaxwnysjqkxix/sql

```sql
-- 1. Add show_on_map column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS show_on_map BOOLEAN DEFAULT false;

-- 2. Create public view for dispensary map
CREATE OR REPLACE VIEW public_dispensary_locations AS
SELECT 
  business_name as dispensary_name,
  address,
  city,
  phone_number as phone,
  email,
  omma_license
FROM customers
WHERE show_on_map = true
ORDER BY city, business_name;

-- 3. Grant public read access
GRANT SELECT ON public_dispensary_locations TO anon;

-- 4. Enable RLS and create policies
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE strain_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Strains: Public read
CREATE POLICY IF NOT EXISTS "Public read access to strains"
ON strains FOR SELECT
USING (true);

-- Sample Requests: Public insert only
CREATE POLICY IF NOT EXISTS "Public can insert sample requests"
ON sample_requests FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can read sample requests"
ON sample_requests FOR SELECT
TO service_role
USING (true);

-- Strain Batches: Public read
CREATE POLICY IF NOT EXISTS "Public read access to batches"
ON strain_batches FOR SELECT
USING (true);

-- Subscribers: Public insert, service role read
CREATE POLICY IF NOT EXISTS "Public can insert subscribers"
ON subscribers FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can read subscribers"
ON subscribers FOR SELECT
TO service_role
USING (true);
```

That's it! Then the site will work perfectly.
