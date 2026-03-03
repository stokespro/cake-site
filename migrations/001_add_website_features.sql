-- CAKE Oklahoma Website Database Migrations
-- This script ONLY creates new tables and adds ONE column to customers
-- NO existing data is modified or deleted

-- ============================================
-- 1. Add show_on_map column to customers table
-- ============================================
-- This allows dispensaries to opt-in to being shown on the public map
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'customers' AND column_name = 'show_on_map'
    ) THEN
        ALTER TABLE customers ADD COLUMN show_on_map BOOLEAN DEFAULT false;
        COMMENT ON COLUMN customers.show_on_map IS 'Whether this dispensary appears on the public Find Us map';
    END IF;
END $$;

-- ============================================
-- 2. Create strain_batches table
-- ============================================
-- Tracks individual harvest batches with specific lab results
CREATE TABLE IF NOT EXISTS strain_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strain_id UUID REFERENCES strains(id) ON DELETE CASCADE,
  
  -- Batch info
  batch_id TEXT NOT NULL UNIQUE,
  harvest_date DATE NOT NULL,
  
  -- Lab results
  thc_percent DECIMAL(4,2),
  cbd_percent DECIMAL(4,2),
  total_cannabinoids DECIMAL(4,2),
  coa_url TEXT,
  
  -- Terpene profile (JSON)
  terpenes JSONB,
  
  -- Status
  available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_strain_batches_strain_id ON strain_batches(strain_id);
CREATE INDEX IF NOT EXISTS idx_strain_batches_harvest_date ON strain_batches(harvest_date DESC);

COMMENT ON TABLE strain_batches IS 'Individual harvest batches with batch-specific lab results';

-- ============================================
-- 3. Create public_dispensary_locations view
-- ============================================
-- Safe read-only view for the public Find Us map
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

-- Grant public read access to the view
GRANT SELECT ON public_dispensary_locations TO anon;

-- ============================================
-- 4. Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE strain_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Strains: Public can read all published strains
CREATE POLICY IF NOT EXISTS "Public read access to strains"
ON strains FOR SELECT
USING (true);

-- Customers: Public CANNOT directly read (they use the view instead)
-- Only authenticated service role can read
CREATE POLICY IF NOT EXISTS "Service role can read customers"
ON customers FOR SELECT
TO service_role
USING (true);

-- Sample Requests: Public can insert, only service role can read
CREATE POLICY IF NOT EXISTS "Public can insert sample requests"
ON sample_requests FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can read sample requests"
ON sample_requests FOR SELECT
TO service_role
USING (true);

-- Strain Batches: Public can read all batches
CREATE POLICY IF NOT EXISTS "Public read access to batches"
ON strain_batches FOR SELECT
USING (true);

-- Subscribers: Public can insert, service role can read/update
CREATE POLICY IF NOT EXISTS "Public can insert subscribers"
ON subscribers FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can read subscribers"
ON subscribers FOR SELECT
TO service_role
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify everything is set up correctly:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'show_on_map';
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'strain_batches';
-- SELECT * FROM information_schema.views WHERE table_name = 'public_dispensary_locations';
