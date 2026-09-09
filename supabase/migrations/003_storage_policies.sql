-- ============================================================
-- 003_storage_policies.sql
-- IDEMPOTENT: Safe to run multiple times
-- Creates the evidence storage bucket and access policies
-- ============================================================

-- Create the evidence bucket (idempotent: Supabase ignores if exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  26214400, -- 25MB in bytes (videos can be up to 25MB)
  ARRAY[
    'image/png', 'image/jpeg', 'image/webp',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for the evidence bucket

-- Anyone (authenticated or anon) can upload evidence via API
-- Uploads go through our API route which uses service_role key,
-- so this policy is for direct client uploads (authenticated users)
DROP POLICY IF EXISTS "Authenticated users can upload evidence" ON storage.objects;
CREATE POLICY "Authenticated users can upload evidence" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'evidence');

-- Also allow anon uploads (reports can be anonymous)
DROP POLICY IF EXISTS "Anonymous users can upload evidence" ON storage.objects;
CREATE POLICY "Anonymous users can upload evidence" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'evidence');

-- Admins can read all evidence
DROP POLICY IF EXISTS "Admins can read evidence files" ON storage.objects;
CREATE POLICY "Admins can read evidence files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'evidence'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT auth.uid()) AND u.role IN ('admin', 'super_admin')
    )
  );

-- Users can read evidence on their own reports
DROP POLICY IF EXISTS "Users can read own evidence" ON storage.objects;
CREATE POLICY "Users can read own evidence" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'evidence'
    AND EXISTS (
      SELECT 1 FROM public.evidence e
      JOIN public.reports r ON r.id = e.report_id
      WHERE e.file_url = name AND r.user_id = (SELECT auth.uid())
    )
  );

-- Admins can delete evidence (for purge CRON)
DROP POLICY IF EXISTS "Admins can delete evidence files" ON storage.objects;
CREATE POLICY "Admins can delete evidence files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'evidence'
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = (SELECT auth.uid()) AND u.role IN ('admin', 'super_admin')
    )
  );

-- ============================================================
-- END OF MIGRATION
-- ============================================================
