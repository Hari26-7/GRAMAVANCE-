-- ==============================================================================
-- GRAMAVANCE: PRODUCTION SUPABASE SQL SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Phase 6: Full-Stack and Database Validation
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM (
  'individual_entrepreneur',
  'shg',
  'farmer_producer',
  'artisan',
  'cooperative',
  'buyer',
  'mentor',
  'administrator'
);

CREATE TYPE application_status AS ENUM (
  'Draft',
  'Documents Prepared',
  'Submitted',
  'Under Review',
  'Sanctioned',
  'Disbursed',
  'Needs Clarification',
  'Rejected'
);

CREATE TYPE document_category AS ENUM (
  'Identity',
  'Land Record',
  'Bank Proof',
  'Quotations',
  'Registration'
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'shg',
  organization_name TEXT,
  phone TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Tamil Nadu',
  district TEXT NOT NULL DEFAULT 'Thanjavur',
  village_or_town TEXT,
  pincode TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'ta',
  business_category TEXT,
  annual_turnover NUMERIC(12, 2) DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. SCHEMES TABLE (Public Read-Only, Admin Manageable)
CREATE TABLE IF NOT EXISTS public.schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ta TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  department TEXT NOT NULL,
  ministry TEXT NOT NULL,
  funding_type TEXT NOT NULL,
  max_subsidy_amount NUMERIC(12, 2) NOT NULL,
  max_project_cost NUMERIC(12, 2) NOT NULL,
  subsidy_percentage NUMERIC(5, 2) NOT NULL,
  promoter_contribution_min NUMERIC(5, 2) NOT NULL,
  overview_en TEXT NOT NULL,
  overview_ta TEXT NOT NULL,
  overview_hi TEXT NOT NULL,
  official_portal_url TEXT NOT NULL,
  verification_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are publicly viewable by all authenticated users"
  ON public.schemes FOR SELECT
  TO authenticated
  USING (TRUE);

-- 5. APPLICATIONS TABLE (User Specific Isolation)
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheme_slug TEXT NOT NULL REFERENCES public.schemes(slug),
  application_number TEXT UNIQUE NOT NULL,
  status application_status NOT NULL DEFAULT 'Draft',
  requested_amount NUMERIC(12, 2) NOT NULL,
  approved_amount NUMERIC(12, 2),
  progress_percent INTEGER NOT NULL DEFAULT 10,
  nodal_office TEXT NOT NULL,
  nodal_contact_phone TEXT,
  target_deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. VAULT DOCUMENTS TABLE (Strict Encryption & Personal Privacy)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category document_category NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT NOT NULL,
  ocr_status TEXT NOT NULL DEFAULT 'Processed',
  ocr_quality_score INTEGER DEFAULT 90,
  extracted_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view only their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert only their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- 7. PRODUCTS TABLE (B2B Marketplace)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  unit_price TEXT NOT NULL,
  min_order TEXT NOT NULL,
  capacity TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_organic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all authenticated users"
  ON public.products FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users can create their own product listings"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product listings"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- 8. STORAGE BUCKET POLICIES (Private Document Vault Storage)
-- In Supabase Storage, create bucket 'vault-documents' (public = false)
-- Storage policy: Authenticated users can upload and read only their own user_id directory:
-- CREATE POLICY "User Document Isolation" ON storage.objects
--   FOR ALL USING (bucket_id = 'vault-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

