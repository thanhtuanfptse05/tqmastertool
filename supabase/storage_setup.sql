-- ==========================================================
-- CODEVAULT STUDIO: STORAGE BUCKETS & POLICIES SETUP
-- Chạy script này trong Supabase SQL Editor sau khi đã chạy 001_initial_schema.sql
-- ==========================================================

-- 1. Tạo Bucket "product-assets" (Công khai cho ảnh thumbnail, gallery demo, biên lai thanh toán)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-assets',
  'product-assets',
  true,
  10485760, -- Giới hạn 10MB mỗi file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- 2. Tạo Bucket "digital-deliverables" (BẢO MẬT RIÊNG TƯ - Chỉ tải bằng Signed URL sau khi Admin duyệt)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'digital-deliverables',
  'digital-deliverables',
  false,
  104857600, -- Giới hạn 100MB mỗi file zip
  ARRAY['application/zip', 'application/x-zip-compressed', 'application/octet-stream', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 104857600;

-- ==========================================================
-- STORAGE RLS POLICIES
-- ==========================================================

-- Cho phép mọi người xem/tải ảnh trong product-assets (vì là public)
DROP POLICY IF EXISTS "Public can view product assets" ON storage.objects;
CREATE POLICY "Public can view product assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-assets');

-- Cho phép người dùng đã đăng nhập hoặc Admin upload ảnh biên lai / ảnh sản phẩm
DROP POLICY IF EXISTS "Authenticated users can upload product assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload product assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-assets' 
    AND (auth.role() = 'authenticated' OR public.is_admin())
  );

-- Chỉ Admin mới được upload hoặc quản lý file trong digital-deliverables
DROP POLICY IF EXISTS "Only admin can manage digital deliverables" ON storage.objects;
CREATE POLICY "Only admin can manage digital deliverables" ON storage.objects
  FOR ALL USING (
    bucket_id = 'digital-deliverables' 
    AND public.is_admin()
  );
