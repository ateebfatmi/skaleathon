# SKALEATHON 2027 — National Online Hackathon Platform

Presented by **SkaleKraft** (`https://skalekraft.in`)  
**Tagline:** *Build. Innovate. Scale.*

Skaleathon 2027 is a standalone, full-stack, production-ready national online hackathon platform built with Next.js App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, Clerk authentication, Razorpay payments, and automated verifiable certificate generation.

---

## 1. Confirmed Event Specifications

- **Organizer:** SkaleKraft
- **Format:** National online hackathon open across India
- **Tracks:**
  - AI & Machine Learning (`track-ai-ml`)
  - Web Development (`track-web-dev`)
  - App Development (`track-app-dev`)
- **Team Size:** 1 to 6 members (Individual builder participation fully supported)
- **Registration Fee:** ₹99.00 flat per team
- **Total Prize Pool:** ₹35,000.00
  - 1st Prize: ₹20,000
  - 2nd Prize: ₹10,000
  - 3rd Prize: ₹5,000
- **Merit Certificates:** Awarded to eligible members of the Top 25 finalist teams
- **Internship Opportunity:** Internship opportunities are available for selected candidates to interview for internships at SkaleKraft. *(Official Notice: This is not a guarantee of an internship or employment).*
- **Event Lifecycle:** Controlled dynamically by administrators without code changes. Displays *"To be announced"* where dates are not yet finalized.

---

## 2. Architecture & Technology Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | High-performance React server components & API route handlers |
| **Language** | TypeScript (Strict mode) | Type safety across database schemas, APIs, and forms |
| **Styling** | Tailwind CSS | Custom dark-mode luxury theme (`#060911`, `#0c1220`, cyan & brand violet) |
| **Database** | PostgreSQL (Supabase / Local) | Relational integrity, foreign keys, unique constraints, audit logs |
| **Auth** | Clerk / Signed Session Guard | Role-based authorization (`participant`, `team_leader`, `judge`, `admin`) |
| **Payments** | Razorpay (₹99 INR) | Server-created orders, HMAC SHA-256 signature checks, idempotent webhooks |
| **Certificates** | jsPDF & QRCode | High-resolution PDF generation with public tamper-evident QR verification |
| **Validation** | Zod & React Hook Form | Full client & server-side validation schemas |
| **Testing** | Vitest | Automated unit and integration testing suite |

---

## 3. Key Feature Walkthrough

### 3.1. Public Website
- **`/`**: Responsive navigation, hero with real-time status, statistics, about narrative, track previews, prize podium, participation process, dynamic timeline, rules summary, interactive FAQ, organizer spotlight, and comprehensive footer.
- **`/tracks`**: Detailed breakdown of deliverables and recommended tech stacks for AI/ML, Web, and App tracks.
- **`/prizes`**: Complete prize breakdown, merit certificates, and clear internship opportunity disclaimer.
- **`/rules`**: Official eligibility criteria, 1–6 team restrictions, code originality, and AI disclosure rules.
- **`/faq`**: Interactive accordion answering common participant queries.
- **`/privacy`**, **`/terms`**, **`/refund-policy`**, **`/code-of-conduct`**: Legally compliant policies with data minimization principles.

### 3.2. Team Registration & Payment
- **`/register`**: 5-step registration workflow:
  1. *Team Information:* Name, track, location, organization, description.
  2. *Team Members:* 1–6 members, duplicate email validation across the event.
  3. *Review & Consent:* Detailed summary, ₹99 fee review, mandatory policy consent.
  4. *Payment:* Razorpay order generation and HMAC SHA-256 signature verification.
  5. *Confirmation:* Registration ID, printable receipt, and transition to dashboard.

### 3.3. Participant Dashboard
- **`/dashboard`**: Unified overview of team status, payment status, submission state, timeline, and announcements.
- **`/dashboard/team`**: Team roster and member details.
- **`/dashboard/submission`**: Draft and final project submission editor (title, problem statement, solution overview, description, tech stack, GitHub repo URL, live demo, video walkthrough, AI tools disclosure).
- **`/dashboard/submission/status`**: Authoritative submission receipt.
- **`/dashboard/certificates`**: 1-click certificate PDF download and public verification for Top 25 teams.

### 3.4. Technical Judging System
- **`/judge`**: Overview of assigned and pool projects.
- **`/judge/evaluate/[submissionId]`**: Project inspection interface, 5-criterion sliders (weights sum to 100%), live weighted scoring, draft saving, score locking, judge feedback, internal confidential notes, and conflict-of-interest declarations.

### 3.5. Results & Leaderboard
- **`/leaderboard`**: Unannounced state during evaluation; published state displays rankings, track categories, and merit badges.
- **`/verify-certificate/[certificateId]`**: Public verification with privacy protection (masked email, no phone numbers), showing authenticity status and download link.

### 3.6. Administrator Dashboard
- **`/admin`**: Database-backed metrics (verified revenue, total teams, paid registrations, judging progress, certificates issued).
- **`/admin/config`**: Dynamic event lifecycle updates, date cutoffs, registration fee, team sizes.
- **`/admin/registrations`**: Search, filter, and 1-click CSV roster export.
- **`/admin/submissions`**: Review repositories and deliverables across tracks.
- **`/admin/results`**: Private leaderboard preview, publish, and unpublish controls.
- **`/admin/certificates`**: Top 25 certificate bulk generation and revocation.
- **`/admin/audit-logs`**: Immutable chronological audit logs.

---

## 4. Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v25.9.0)
- npm or pnpm

### Installation
```bash
git clone https://github.com/skalekraft/skaleathon-2027.git
cd skaleathon-2027
npm install
```

### Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials as needed:
```env
# Public Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Allowlist (Server-enforced role)
ADMIN_EMAILS=skalekraft@gmail.com

# Supabase (Optional for local eval; file-store handles persistence automatically)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
RAZORPAY_WEBHOOK_SECRET=placeholder_webhook_secret
```

### Running the App
```bash
# Start Next.js development server
npm run dev

# Run automated test suite
npm test

# Run production build
npm run build
```

The application will be live at `http://localhost:3000`.

---

## 5. Security & Data Protection Controls

- **No Secrets in Client Code:** Razorpay secrets, Supabase service keys, and signing keys are isolated to server modules.
- **Server-Side Authorization:** Every mutation strictly verifies session tokens and role privileges.
- **Tamper-Resistant Payments:** Payment status is updated only when the HMAC SHA-256 signature matches `order_id|payment_id`.
- **Idempotent Webhooks:** All webhook events are logged with unique IDs to prevent duplicate processing upon provider retries.
- **Data Minimization:** Participant phone numbers and private emails are excluded from public verification pages and public leaderboards.
- **Security Headers:** Enforces `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- **Search Engine Privacy:** `robots.ts` explicitly disallows crawler indexing of `/admin`, `/dashboard`, `/judge`, and `/api/`.

---

## 6. Pre-Launch Checklist

- [x] Responsive layout tested across mobile, tablet, and desktop viewports.
- [x] Zero hardcoded dates; dynamic "To be announced" fallback active.
- [x] ₹35,000 prize pool, ₹99 registration fee, and 1–6 team sizes configured.
- [x] Multi-step registration and duplicate membership prevention active.
- [x] Razorpay order creation and signature verification implemented.
- [x] Participant project submissions and deadline enforcement active.
- [x] 100% judging criteria weight validation and score locking active.
- [x] Public certificate verification with privacy masking operational.
- [x] Admin console with CSV export, audit logs, and status controls active.
- [x] All 12 automated unit and integration tests passing.
- [x] Production build (`next build`) completed successfully with 0 errors.

---

## 7. License & Rights

Presented by **SkaleKraft** (`https://skalekraft.in`).  
Copyright © 2027 SkaleKraft. All rights reserved.
