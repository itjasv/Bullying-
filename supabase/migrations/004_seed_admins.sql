-- ============================================================
-- 004_seed_admins.sql
-- IDEMPOTENT: Safe to run multiple times
-- Seeds admin users after they sign up via Google OAuth
-- 
-- IMPORTANT: Run this AFTER the admin users have logged in
-- at least once via Google OAuth so their auth.users row exists.
-- The handle_new_user() trigger auto-assigns roles on first login,
-- so this script is only needed if you need to manually fix roles.
-- ============================================================

-- Shreya Aggarwal: Super Admin (Project Lead)
-- UPDATE public.users SET role = 'super_admin' WHERE email = 'shreya22012006@gmail.com';

-- Poorvi Aggarwal: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'aggarwalpoorvi05@gmail.com';

-- Rituraj Sharma: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'rituraj2004.sharma@gmail.com';

-- Utkarsh Lohan: Admin
-- UPDATE public.users SET role = 'admin' WHERE email = 'lohanutkarsh289@gmail.com';

-- Tejasvi Sharma: Super Admin (Tester)
-- UPDATE public.users SET role = 'super_admin' WHERE email = 'stejasvi817@gmail.com';

-- ============================================================
-- NOTE: The handle_new_user() trigger in 001_initial_schema.sql
-- auto-assigns roles on first Google OAuth login. These UPDATE
-- statements are commented out as a fallback only.
-- Uncomment and run if roles need manual correction.
-- ============================================================
