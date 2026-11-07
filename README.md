# Intelligent Community Development Platform using Generative AI (Gramavance)

An accessible, human-centered community development platform engineered for rural women, Self-Help Groups (SHGs), elderly farmers, village artisans, and rural micro-entrepreneurs across India.

The platform helps citizens discover verified government development schemes, understand their eligibility in everyday language, organize mandatory bank documents, improve financial readiness, and connect with local business opportunities.

---

## 🌟 Key Capabilities & Core Modules

1. **Find Government Schemes (`/schemes`):**
   - Searchable, verified directory of Central and State schemes (PMEGP, PMFME, MUDRA, DAY-NRLM, Tamil Nadu NEEDS, PM-KISAN, Stand-Up India).
   - Filter by Central vs State level, beneficiary type (SHG, farmer, artisan, entrepreneur), and funding type.
   - Side-by-side 3-scheme comparison matrix.

2. **AI Eligibility Checker (`/eligibility`):**
   - 5-step guided questionnaire in plain language (Location, Age Group, Beneficiary Category, Enterprise Activity, Financial Assistance Needed).
   - Intelligent rule-matching engine providing personalized "Why You May Qualify" breakdowns, missing documents checklist, and clear disclaimers distinguishing potential eligibility from legal sanction.

3. **Multiple Scheme Compatibility Intelligence (`/compatibility`):**
   - Anti-conflict intelligence that checks overlapping benefits and legal subsidy restrictions.
   - Flags restrictions such as PMEGP Clause 3.2 (dual capital subsidy barred on same unit) and highlights official convergence frameworks (e.g., DAY-NRLM + PMFME).

4. **Community Network (`/community`):**
   - Verified directories for Self-Help Groups, rural entrepreneurs, artisans, and cooperatives.
   - Collaboration postings for shared machinery and raw material sorting.
   - Free mentorship requests with retired agriculture and rural banking advisors.
   - Official district camps, training notices, and privacy-protected connection requests with safety reporting.

5. **Local Marketplace (`/marketplace`):**
   - Direct wholesale product catalog connecting rural producers with wholesale buyers.
   - "Add My Product" submission form with photo upload simulation.
   - Purchase enquiry modal with real-time "My Enquiries" status tracking.

6. **Document Management & OCR (`/documents`):**
   - Upload and organize identity documents, land records (Patta), bank passbooks, and machinery quotations.
   - Simulated local OCR extraction preview and scan blurriness quality warnings.

7. **Financial Readiness Tracker (`/financial-readiness`):**
   - User-recorded income and expense bookkeeping.
   - Existing bank loan tracking with monthly EMI records.
   - Net cash surplus calculation demonstrating bank debt servicing capacity.
   - 5-Pillar Bank Loan Readiness Checklist with zero fabricated credit bureau ratings.

8. **Community Assistant (`/assistant`):**
   - Real-time conversational AI powered by **Google Gemini 3.5 Flash** (with fallback to `gemini-3.5-flash-lite`).
   - Hands-free voice recognition (Speech-to-Text) and calm spoken voice responses (Text-to-Speech at 0.85x speed).
   - Multilingual reasoning in English, Tamil, and Hindi.
   - Cites verified government guidelines and never makes false approval promises.

---

## 🎨 Human-Centered Design & Accessibility (WCAG 2.1 AA)

- **Calm Public Service Aesthetic:** Clean white / warm off-white backgrounds (`#F4F9F6`), deep navy headers (`#102D46`), restrained green actions (`#159B68`), subtle light grey borders, and zero glassmorphism or floating decorative elements.
- **Large Touch Targets:** Minimum 44–48px buttons and input heights.
- **Text Sizing & High Contrast:** Interactive `-A / +A` font size scaling and 125% high-contrast mode built into the top navigation bar.
- **OS Reduced Motion:** Respects `prefers-reduced-motion` media queries globally.
- **Question-First Framing:** Every major page explicitly answers three human questions:
  1. *What is this page for?*
  2. *What can I do here?*
  3. *What should I do next?*

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript 5.8 / 7.0, Vite 8.3, Tailwind CSS v4, Lucide React, Recharts.
- **AI Integration:** Google Gemini REST API (`v1beta/models/gemini-3.5-flash:generateContent`).
- **Database / Backend:** Supabase PostgreSQL with Row Level Security (RLS) policies and complete local demo storage fallback.
- **Linting & Code Quality:** Oxlint (0 warnings, 0 errors).

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 2. Environment Setup
The project includes a pre-configured `.env` file:
```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Backend Configuration (optional)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 3. Installation & Execution
```bash
# Install dependencies (already installed in workspace)
npm install

# Start Vite Development Server
npm run dev
```

### 4. Build & Lint Verification
```bash
# Verify TypeScript build and production bundle
npm run build

# Run Oxlint
npm run lint
```

### 5. Access the Platform
Open your browser at:
👉 **http://localhost:5173/**
