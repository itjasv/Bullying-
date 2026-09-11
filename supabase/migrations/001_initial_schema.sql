-- ============================================================
-- RagRaksha: Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  submitted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  security_passphrase TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('verbal', 'physical', 'cyber', 'social', 'sexual', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'received', 'under_review', 'investigation', 'action_taken', 'resolved', 'closed', 'dismissed')),
  description TEXT NOT NULL,
  location TEXT,
  involved_parties TEXT,
  witness_info TEXT,
  incident_date TIMESTAMPTZ,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  is_withdrawn BOOLEAN NOT NULL DEFAULT false,
  withdrawal_reason TEXT,
  estimated_resolution TEXT,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  parent_report_id UUID REFERENCES public.reports(id),
  is_archived BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMPTZ,
  evidence_purged_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. EVIDENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'audio')),
  file_size_bytes INTEGER NOT NULL,
  original_file_name TEXT,
  is_purged BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  purged_at TIMESTAMPTZ
);

-- ============================================================
-- 4. MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id),
  sender_role TEXT NOT NULL CHECK (sender_role IN ('reporter', 'admin')),
  sender_name TEXT NOT NULL DEFAULT 'Reporter',
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. STATUS HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.users(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. ADMIN NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'internal' CHECK (visibility IN ('internal', 'public')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. CONTACT SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. ADMIN LOGS TABLE (immutable audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 10. SCHEDULED JOBS LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scheduled_jobs_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
  records_affected INTEGER DEFAULT 0,
  details TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reports_report_id ON public.reports(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_by ON public.reports(submitted_by);
CREATE INDEX IF NOT EXISTS idx_reports_status_active ON public.reports(status, is_deleted, is_archived);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_parent ON public.reports(parent_report_id);
CREATE INDEX IF NOT EXISTS idx_evidence_report ON public.evidence(report_id, is_purged);
CREATE INDEX IF NOT EXISTS idx_messages_report ON public.messages(report_id, created_at);
CREATE INDEX IF NOT EXISTS idx_status_history_report ON public.status_history(report_id, changed_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs_log ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = (SELECT auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT public.get_user_role()) IN ('admin', 'super_admin'), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user super admin?
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT public.get_user_role()) = 'super_admin', false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- USERS ----
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (id = (SELECT auth.uid()));
CREATE POLICY "users_select_admin" ON public.users FOR SELECT USING (public.is_admin());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (id = (SELECT auth.uid()));
CREATE POLICY "users_update_admin" ON public.users FOR UPDATE USING (public.is_super_admin());
CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_delete_own" ON public.users FOR DELETE USING (id = (SELECT auth.uid()));

-- ---- REPORTS ----
CREATE POLICY "reports_insert" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "reports_select_own" ON public.reports FOR SELECT
  USING (user_id = (SELECT auth.uid()) OR submitted_by = (SELECT auth.uid()));
CREATE POLICY "reports_select_admin" ON public.reports FOR SELECT USING (public.is_admin());
CREATE POLICY "reports_update_own" ON public.reports FOR UPDATE
  USING (submitted_by = (SELECT auth.uid()) AND status IN ('submitted', 'received', 'under_review'));
CREATE POLICY "reports_update_admin" ON public.reports FOR UPDATE USING (public.is_admin());
CREATE POLICY "reports_delete_super" ON public.reports FOR DELETE USING (public.is_super_admin());

-- ---- EVIDENCE ----
CREATE POLICY "evidence_insert" ON public.evidence FOR INSERT WITH CHECK (true);
CREATE POLICY "evidence_select_admin" ON public.evidence FOR SELECT USING (public.is_admin());
CREATE POLICY "evidence_select_own" ON public.evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = evidence.report_id AND reports.user_id = (SELECT auth.uid()))
);
CREATE POLICY "evidence_delete_admin" ON public.evidence FOR DELETE USING (public.is_admin());

-- ---- MESSAGES ----
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_select_admin" ON public.messages FOR SELECT USING (public.is_admin());
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = messages.report_id AND reports.user_id = (SELECT auth.uid()))
);
CREATE POLICY "messages_update_admin" ON public.messages FOR UPDATE USING (public.is_admin());

-- ---- STATUS HISTORY ----
CREATE POLICY "status_history_insert" ON public.status_history FOR INSERT WITH CHECK (true);
CREATE POLICY "status_history_select" ON public.status_history FOR SELECT USING (true);

-- ---- ADMIN NOTES ----
CREATE POLICY "admin_notes_insert_admin" ON public.admin_notes FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "admin_notes_select_admin" ON public.admin_notes FOR SELECT USING (public.is_admin());
CREATE POLICY "admin_notes_select_public" ON public.admin_notes FOR SELECT USING (
  visibility = 'public' AND EXISTS (
    SELECT 1 FROM public.reports WHERE reports.id = admin_notes.report_id AND reports.user_id = (SELECT auth.uid())
  )
);

-- ---- FEEDBACK (public insert, admin read) ----
CREATE POLICY "feedback_insert" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "feedback_select_admin" ON public.feedback FOR SELECT USING (public.is_admin());
CREATE POLICY "feedback_delete_super" ON public.feedback FOR DELETE USING (public.is_super_admin());

-- ---- CONTACT SUBMISSIONS (public insert, admin read) ----
CREATE POLICY "contacts_insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_select_admin" ON public.contact_submissions FOR SELECT USING (public.is_admin());
CREATE POLICY "contacts_update_admin" ON public.contact_submissions FOR UPDATE USING (public.is_admin());
CREATE POLICY "contacts_delete_super" ON public.contact_submissions FOR DELETE USING (public.is_super_admin());

-- ---- ADMIN LOGS (admins insert, admins read, no update/delete - immutable) ----
CREATE POLICY "admin_logs_insert" ON public.admin_logs FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "admin_logs_select" ON public.admin_logs FOR SELECT USING (public.is_admin());
-- No UPDATE or DELETE policies - logs are immutable

-- ---- SCHEDULED JOBS LOG (service role only, super admin read) ----
CREATE POLICY "jobs_log_insert" ON public.scheduled_jobs_log FOR INSERT WITH CHECK (true);
CREATE POLICY "jobs_log_select" ON public.scheduled_jobs_log FOR SELECT USING (public.is_super_admin());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_reports BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE USER ON AUTH SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_role TEXT := 'user';
BEGIN
  user_email := NEW.raw_user_meta_data->>'email';

  -- Check admin whitelist
  IF user_email IN (
    'shreya22012006@gmail.com',
    'aggarwalpoorvi05@gmail.com',
    'rituraj2004.sharma@gmail.com',
    'lohanutkarsh289@gmail.com',
    'stejasvi817@gmail.com'
  ) THEN
    -- Shreya and Tejasvi are super admins
    IF user_email IN ('shreya22012006@gmail.com', 'stejasvi817@gmail.com') THEN
      user_role := 'super_admin';
    ELSE
      user_role := 'admin';
    END IF;
  END IF;

  INSERT INTO public.users (id, email, display_name, avatar_url, role, is_anonymous)
  VALUES (
    NEW.id,
    user_email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    user_role,
    CASE WHEN NEW.raw_user_meta_data->>'provider_id' IS NULL THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    role = EXCLUDED.role,
    last_active_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
