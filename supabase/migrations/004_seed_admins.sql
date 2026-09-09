-- ============================================================
-- 004_seed_admins.sql
-- IDEMPOTENT: Safe to run multiple times
-- Seeds admin users after they sign up via Google OAuth
-- 
-- IMPORTANT: Run this AFTER the admin users have logged in
-- at least once via Google OAuth so their auth.users row exists.
-- This script promotes existing users to admin/super_admin.
-- ============================================================

-- Poorvi Aggarwal: Super Admin
-- UPDATE public.users SET role = 'super_admin' WHERE email = 'POORVI_EMAIL_HERE';

-- Shreya Aggarwal: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'SHREYA_EMAIL_HERE';

-- Utkarsh Lohan: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'UTKARSH_EMAIL_HERE';

-- Rituraj Sharma: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'RITURAJ_EMAIL_HERE';

-- ============================================================
-- NOTE: Uncomment and replace the email placeholders with
-- actual Google emails once the admins have signed up.
-- Run this in Supabase SQL Editor after first login.
-- ============================================================
