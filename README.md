# Anonymous Bullying Reporting Platform

A production-grade, anonymous bullying reporting and case management system built for Indian educational institutions.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Vanilla CSS, Canvas API
- **Backend:** Next.js API Routes, Supabase (PostgreSQL, Auth, Storage)
- **Auth:** Google OAuth via Supabase
- **Email:** Resend
- **Deployment:** Vercel
- **Fonts:** Inter, JetBrains Mono, Caveat

## Getting Started

### 1. Clone and install
```bash
git clone <repo-url>
cd bullying
npm install
```

### 2. Set up Supabase
- Create a project at [supabase.com](https://supabase.com)
- Run all migrations in `supabase/migrations/` in order
- Enable Google OAuth in Authentication settings
- Create an `evidence` storage bucket (public: false)

### 3. Configure environment
```bash
cp .env.example .env.local
```
Fill in all values:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (optional, for email notifications)
- `CRON_SECRET` (generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git add -A && git commit -m "Initial deployment" && git push
```

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com) and import the repo
- Add all environment variables from `.env.local`
- Set `NEXT_PUBLIC_SITE_URL` to your production domain
- Deploy

### 3. CRON jobs
CRON schedules are in `vercel.json`. They require Vercel Pro plan.

| Job | Schedule | Purpose |
|-----|----------|---------|
| auto-archive | Daily 1AM UTC | Archive resolved cases after 7 days |
| purge-evidence | Daily 2AM UTC | Delete evidence files after 30 days |
| cleanup | Weekly Sun 3AM UTC | Permanently delete soft-deleted reports |
| log-rotation | Monthly 1st 4AM UTC | Rotate admin logs older than 6 months |
| daily-digest | Daily 6AM UTC | Email summary to super admins |

### 4. Post-deployment
- Set up Google OAuth redirect URL: `https://your-domain.com/auth/callback`
- Update Supabase Auth settings with the production URL
- Test admin login with a whitelisted email

## Project Structure

```
src/
  app/
    (pages)      - Public pages (/, /report, /track, /resources, etc.)
    admin/       - Admin panel (dashboard, reports, messages, analytics, etc.)
    api/         - API routes (reports, track, messages, feedback, contact, cron)
    dashboard/   - User dashboard
  components/
    home/        - Homepage sections (11 components)
    layout/      - Navbar, Footer
  lib/
    constants/   - Categories, statuses, status transitions
    supabase/    - Client, server, admin Supabase clients
    utils/       - Validators, ID generation, passphrase hashing
    email.js     - Resend email notifications
  proxy.js       - Middleware (auth guard, admin check, CRON auth)
supabase/
  migrations/    - SQL schema migrations (run in order)
```

## Admin Access

Admin access is controlled by a hardcoded email whitelist checked server-side. Only these Google accounts can access `/admin`:

| Name | Role |
|------|------|
| Shreya Aggarwal | Admin |
| Poorvi Aggarwal | Super Admin |
| Rituraj Sharma | Admin |
| Utkarsh Lohan | Admin |
| Tejasvi Sharma | Super Admin (testing) |

## Routes (32 total)

**Public:** `/`, `/about`, `/report`, `/track`, `/resources`, `/contact`, `/feedback`, `/login`, `/promise`, `/dashboard`

**Admin:** `/admin`, `/admin/reports`, `/admin/messages`, `/admin/users`, `/admin/feedback`, `/admin/analytics`, `/admin/logs`, `/admin/settings`

**API:** `/api/reports`, `/api/track`, `/api/messages`, `/api/feedback`, `/api/contact`, `/api/cron/*` (5 jobs), `/auth/callback`
