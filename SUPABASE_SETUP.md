# Gramavance — Supabase Backend & Database Setup Guide

This document describes how to connect **Gramavance** to a live Supabase project, or continue running in **Demonstration Mode (Local Offline Storage)**.

---

## 1. Demonstration Mode (Current Default)

If no external credentials are configured:
- Gramavance automatically operates in **Demonstration Mode**.
- Profiles, documents, applications, and business listings are stored safely in your browser's local storage.
- No network requests are sent to third parties.
- Realistic rural personas (Women SHG, Farmer Producer, Artisan, Cooperative) can be switched seamlessly via the profile dropdown in the top navbar.

---

## 2. Connecting to Supabase (Production Mode)

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an organization and a new project.
2. Under **Project Settings → API**, copy your:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **anon / public key** (`eyJhbGciOi...`)

### Step 2: Configure Environment Variables
Create a file named `.env` in the root of the project:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> [!CAUTION]
> Never put your `service_role` secret key in the frontend `.env` file. The frontend must only ever use the `anon` public key, protected by Row Level Security (RLS).

### Step 3: Run Database Schema Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open the file `supabase/schema.sql` located in this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This will create:
   - `profiles` table with foreign keys to `auth.users`
   - `schemes` table for central and state public schemes
   - `applications` table with milestone progress tracking
   - `documents` table with encrypted metadata
   - `products` table for direct fair-trade discovery
   - Strict **Row Level Security (RLS)** policies ensuring users can never view or modify another user's documents or applications.

### Step 4: Storage Bucket Setup
1. In Supabase, go to **Storage** and create a new bucket named: `vault-documents`.
2. Toggle **Public Bucket** to **OFF** (Private).
3. Apply the provided storage RLS policy to ensure documents are isolated in folders named after each user's `auth.uid()`.

---

## 3. Security & Privacy Safeguards
- **Zero API Key Leakage**: Keys are referenced strictly via `import.meta.env` and validated by `src/lib/supabase.ts`.
- **Row-Level Security**: Every table enforces `auth.uid() = user_id`.
- **PII Protection**: Personal identity numbers (such as Aadhaar) are stored in masked format (`XXXX-XXXX-8421`).

