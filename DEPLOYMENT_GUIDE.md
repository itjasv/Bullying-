# RagRaksha - Complete Deployment Guide

> Step-by-step, screenshot-level instructions. Follow in order. Do NOT skip steps.

---

## PHASE 1: Supabase Setup (Database + Auth)

### Step 1.1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** (top right)
3. Sign in with your **GitHub account** (itjasv)
4. It will ask to authorize Supabase - click **Authorize**

### Step 1.2: Create a New Project
1. Click **New Project**
2. Fill in:
   - **Name:** `ragraksha`
   - **Database Password:** Pick something strong, **SAVE THIS PASSWORD SOMEWHERE**. You won't need it often but don't lose it.
   - **Region:** `South Asia (Mumbai)` - closest to India
3. Click **Create new project**
4. Wait 1-2 minutes while it provisions

### Step 1.3: Get Your API Keys
Once the project is ready:
1. Go to **Settings** (gear icon, left sidebar) → **API**
2. You'll see 3 values. Copy each one and save them in a notepad:

| What | Where to find | Label in Vercel later |
|------|---------------|----------------------|
| **Project URL** | Under "Project URL" | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** | Under "Project API keys" | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** | Under "Project API keys" (click "Reveal") | `SUPABASE_SERVICE_ROLE_KEY` |

> [!CAUTION]
> The `service_role` key is a **GOD KEY**. Never expose it in frontend code. It bypasses all Row Level Security. Treat it like a password.

### Step 1.4: Run the SQL Migrations
This is where you create all the tables, security policies, and triggers.

1. In Supabase, go to **SQL Editor** (left sidebar, looks like a terminal icon)
2. Click **New query**

**Run Migration 1 (Main Schema):**
3. Open this file on your computer: `D:\bullying\supabase\migrations\001_initial_schema.sql`
4. Select ALL the text (Ctrl+A), copy it (Ctrl+C)
5. Paste it into the Supabase SQL Editor
6. Click the green **Run** button (or Ctrl+Enter)
7. You should see: `Success. No rows returned` - this is CORRECT

**Run Migration 2 (Storage Policies):**
8. Click **New query** again (the + tab)
9. Open: `D:\bullying\supabase\migrations\003_storage_policies.sql`
10. Copy ALL, paste, click **Run**
11. Should see: `Success. No rows returned`

**Run Migration 3 (Admin Seed - optional):**
12. Click **New query**
13. Open: `D:\bullying\supabase\migrations\004_seed_admins.sql`
14. Copy ALL, paste, click **Run**
15. This one is mostly comments - it's a safety net, the trigger handles roles automatically

### Step 1.5: Create the Storage Bucket
1. Go to **Storage** (left sidebar, looks like a folder icon)
2. Click **New bucket**
3. Fill in:
   - **Name:** `evidence` (EXACTLY this, lowercase)
   - **Public bucket:** **OFF** (toggle should be grey/disabled)
   - **File size limit:** `25MB` or `26214400` bytes
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif, video/mp4, video/webm, audio/mpeg, audio/wav, audio/ogg`
4. Click **Create bucket**

### Step 1.6: Enable Google OAuth
1. Go to **Authentication** (left sidebar) → **Providers**
2. Find **Google** in the list, click on it
3. Toggle it **ON**
4. You need a Google Client ID and Secret. Here's how:

#### Create Google OAuth Credentials:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing): name it `RagRaksha`
3. Go to **APIs & Services** → **OAuth consent screen**
4. Select **External**, click **Create**
5. Fill in:
   - App name: `RagRaksha`
   - User support email: `itjasv@gmail.com`
   - Developer contact email: `itjasv@gmail.com`
6. Click **Save and Continue** through Scopes (leave defaults)
7. Click **Save and Continue** through Test Users
8. Go to **APIs & Services** → **Credentials**
9. Click **Create Credentials** → **OAuth client ID**
10. Application type: **Web application**
11. Name: `RagRaksha`
12. **Authorized redirect URIs:** Add this URL:
    ```
    https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback
    ```
    (Find your project ref in Supabase → Settings → General → Reference ID)
13. Click **Create**
14. Copy the **Client ID** and **Client Secret**

#### Back in Supabase:
15. Paste the **Client ID** and **Client Secret** into the Google provider fields
16. Click **Save**

### Step 1.7: Set Auth Redirect URL
1. In Supabase, go to **Authentication** → **URL Configuration**
2. **Site URL:** Set to your domain: `https://ragraksha.in` (or whatever your Hostinger domain is)
3. **Redirect URLs:** Add these:
   ```
   https://ragraksha.in/auth/callback
   https://www.ragraksha.in/auth/callback
   http://localhost:3000/auth/callback
   ```
4. Click **Save**

---

## PHASE 2: Deploy to Vercel

### Step 2.1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Sign up with **GitHub** (itjasv)
4. Authorize Vercel to access your GitHub

### Step 2.2: Import the Project
1. On the Vercel dashboard, click **Add New** → **Project**
2. Find `itjasv/Bullying-` in your repo list
3. Click **Import**
4. **Framework Preset:** Should auto-detect **Next.js** (if not, select it)
5. **Root Directory:** Leave as `.` (root)
6. **DO NOT click Deploy yet** - first add environment variables

### Step 2.3: Add Environment Variables
Before deploying, expand the **Environment Variables** section and add these one by one:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (from Step 1.3) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key (from Step 1.3) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service_role key (from Step 1.3) |
| `CRON_SECRET` | Make up a random string, e.g. `ragraksha-cron-secret-2026-xK9mP` |
| `NEXT_PUBLIC_SITE_URL` | `https://ragraksha.in` (your domain) |
| `NEXT_PUBLIC_SITE_NAME` | `RagRaksha` |

> [!TIP]
> For `CRON_SECRET`, just mash your keyboard or use a password generator. It's used to authenticate the CRON jobs. Example: `rr-cron-a8f3k2m9x7`

7. After adding ALL 6 variables, click **Deploy**
8. Wait 2-3 minutes. You should see a green **Ready** status.
9. Vercel gives you a URL like `bullying-xxxxx.vercel.app` - your site is LIVE there

---

## PHASE 3: Link Your Hostinger Domain

### Step 3.1: Add Domain in Vercel
1. In Vercel, go to your project → **Settings** → **Domains**
2. Type your domain: `ragraksha.in` (or whatever you bought)
3. Click **Add**
4. Vercel will show you DNS records to configure. You'll see something like:

| Type | Name | Value |
|------|------|-------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

### Step 3.2: Configure DNS in Hostinger
1. Log into [hostinger.com](https://hostinger.com)
2. Go to **Domains** → Click your domain
3. Go to **DNS / Nameservers** → **DNS Records**
4. **Delete** any existing A records pointing to Hostinger's default IP
5. **Add** the records Vercel showed you:

**Record 1 (root domain):**
   - Type: `A`
   - Name: `@`
   - Points to: `76.76.21.21`
   - TTL: `3600` (or Auto)

**Record 2 (www subdomain):**
   - Type: `CNAME`
   - Name: `www`
   - Points to: `cname.vercel-dns.com`
   - TTL: `3600` (or Auto)

6. Click **Save** for each record
7. Wait 5-30 minutes for DNS to propagate

### Step 3.3: Verify in Vercel
1. Go back to Vercel → **Settings** → **Domains**
2. Your domain should show a green checkmark once DNS propagates
3. Vercel automatically provisions an SSL certificate (HTTPS)
4. Visit `https://ragraksha.in` - your site should be live

---

## PHASE 4: Resend Setup (Email Notifications)

> [!NOTE]
> This is optional for launch. The site works fully without email. But admins won't get notified about new reports without it.

### Step 4.1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Go to **API Keys** → **Create API Key**
4. Name: `RagRaksha`
5. Permission: **Full access**
6. Copy the API key

### Step 4.2: Add to Vercel
1. In Vercel, go to **Settings** → **Environment Variables**
2. Add:
   - Key: `RESEND_API_KEY`
   - Value: The API key you just copied
3. Click **Save**
4. Go to **Deployments** → click the three dots on the latest deployment → **Redeploy**

### Step 4.3: Verify Domain in Resend (for custom FROM address)
1. In Resend, go to **Domains** → **Add Domain**
2. Enter `ragraksha.in`
3. Resend will give you DNS records (SPF, DKIM, etc.)
4. Add those DNS records in Hostinger (same place as Step 3.2)
5. Click **Verify** in Resend
6. Once verified, emails will come from `notifications@ragraksha.in`

---

## PHASE 4.5: GitHub Actions Cron & Anti-Sleep Setup (100% Free)

> [!TIP]
> **Why do this instead of Vercel Crons?**
> 1. **Zero limits:** Vercel free plan limits you to only 1-2 crons. GitHub Actions is 100% free with unlimited scheduled runs!
> 2. **Prevents Supabase sleep:** Supabase free tier automatically goes to sleep after 7 days of inactivity. Our keep-alive action pings the database every 6 hours, so Supabase **NEVER goes to sleep!**
> 3. **Manual Trigger:** You get a 1-click "Run workflow" button in GitHub to test any maintenance task anytime.

### Step 4.5.1: Add Secrets in GitHub
1. Go to your GitHub repo: [github.com/itjasv/Bullying-](https://github.com/itjasv/Bullying-)
2. Click **Settings** (tab at the top)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click the green button: **New repository secret**
5. Add Secret #1:
   - **Name:** `SITE_URL`
   - **Secret:** `https://ragraksha.in` (or your `.vercel.app` URL)
   - Click **Add secret**
6. Click **New repository secret** again
7. Add Secret #2:
   - **Name:** `CRON_SECRET`
   - **Secret:** The EXACT same secret value you put in Vercel env vars for `CRON_SECRET`
   - Click **Add secret**

### Step 4.5.2: What runs automatically?
Once those two secrets are saved, GitHub takes care of everything automatically:
- **`Keep Alive & Anti-Sleep Ping`**: Runs every 6 hours. Pings `/api/health` and queries Supabase so it stays awake 24/7 and eliminates cold starts.
- **`Daily Maintenance & Digest`**: Runs daily at 11:30 AM IST (06:00 UTC). Runs auto-archive, evidence purge, database cleanup, log rotation, and emails the daily digest to super admins.

### Step 4.5.3: How to test manually anytime
1. In your GitHub repo, click the **Actions** tab at the top
2. Click **Daily Maintenance & Digest** in the left sidebar
3. Click the **Run workflow** dropdown button on the right → Click **Run workflow**
4. Watch it run! You will see live logs and green checkmarks for every cron job.

---

## PHASE 5: Final Verification Checklist

Open each URL and verify it works:

| URL | What to check |
|-----|---------------|
| `https://ragraksha.in` | Homepage loads, logo shows "RagRaksha", no errors |
| `https://ragraksha.in/report` | Report form shows, "Anonymous Report" label visible |
| `https://ragraksha.in/track` | Track page loads, passphrase input works |
| `https://ragraksha.in/login` | Google sign-in button appears |
| `https://ragraksha.in/about` | About page with team members |
| `https://ragraksha.in/resources` | Helpline numbers visible |
| `https://ragraksha.in/privacy` | Privacy policy page |
| `https://ragraksha.in/terms` | Terms of service page |
| `https://ragraksha.in/feedback` | Feedback form with star ratings |
| `https://ragraksha.in/contact` | Contact form loads |
| `https://ragraksha.in/admin` | Should redirect to login (not accessible without admin auth) |

### Test the Full Flow:
1. Go to `/report`, fill out a test report, submit
2. Copy the Report ID shown after submission
3. Go to `/track`, enter the Report ID + passphrase
4. Verify the status timeline shows "Submitted"
5. Sign in with `stejasvi817@gmail.com` (your tester account)
6. Go to `/admin` - you should see the admin dashboard
7. Find your test report, change its status
8. Go back to `/track` and verify the status updated

---

## Quick Reference: All Environment Variables

```env
# Supabase (from supabase.com → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# CRON authentication (make up your own)
CRON_SECRET=your-random-secret-here

# Site
NEXT_PUBLIC_SITE_URL=https://ragraksha.in
NEXT_PUBLIC_SITE_NAME=RagRaksha

# Email (optional, from resend.com)
RESEND_API_KEY=re_xxxxxxxx
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "No rows returned" after SQL | That's SUCCESS, not an error |
| Admin page shows login screen | Correct behavior. Sign in with a whitelisted Google email |
| Google sign-in fails | Check redirect URI matches exactly in Google Console |
| Domain not working | Wait 30 min for DNS. Check Vercel domains page for green checkmark |
| Evidence upload fails | Check storage bucket name is exactly `evidence` (lowercase) |
| Emails not sending | Add `RESEND_API_KEY` to Vercel env vars and redeploy |
| CRON jobs returning 401 | Check `CRON_SECRET` matches in Vercel env vars and `vercel.json` |

---

> [!IMPORTANT]
> **Order matters.** Do Supabase first (Phase 1), then Vercel (Phase 2), then domain (Phase 3). Email (Phase 4) can be done anytime after Phase 2.
