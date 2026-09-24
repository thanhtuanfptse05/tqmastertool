-- ==========================================================
-- Migration: 005_security_deliverables_and_hardening.sql
-- Description: Column-level security hardening for products deliverables
--              and strictly isolating sensitive digital links (Anti-Data-Exfiltration).
-- Spec: SPEC-032
-- ==========================================================

-- 1. COLUMN-LEVEL SELECT ACCESS CONTROL ON PRODUCTS TABLE
-- Prevents anonymous users (role: anon) from extracting git_repo_url,
-- storage_file_path, and access_instructions directly via the Supabase client SDK.

DO $$
BEGIN
  -- Revoke broad select from anon
  REVOKE SELECT ON public.products FROM anon;

  -- Grant select only on public catalog columns to anon
  GRANT SELECT (
    id,
    category,
    title,
    slug,
    short_description,
    detailed_description,
    price,
    original_price,
    thumbnail_url,
    status,
    deliverable_type,
    created_at,
    updated_at,
    deleted_at
  ) ON public.products TO anon;

  -- Service role and admin retain full table access
  GRANT ALL ON public.products TO service_role;
END $$;


-- 2. SECURE FUNCTION TO RETRIEVE PROTECTED DELIVERABLES
-- Only returns git_repo_url and access_instructions if the requesting user
-- owns a completed order for that product (or is an Admin).

CREATE OR REPLACE FUNCTION public.get_order_deliverables(p_order_id UUID)
RETURNS TABLE (
  product_id UUID,
  product_title TEXT,
  category TEXT,
  git_repo_url TEXT,
  access_instructions TEXT,
  license_key TEXT
) AS $$
BEGIN
  -- Verify caller ownership and completed order status
  IF NOT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = p_order_id
      AND status = 'completed'
      AND (user_id = auth.uid() OR public.is_admin())
  ) THEN
    RAISE EXCEPTION 'Access Denied: Order is not completed or unauthorized.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id AS product_id,
    p.title AS product_title,
    p.category,
    p.git_repo_url,
    p.access_instructions,
    o.admin_notes AS license_key
  FROM public.order_items oi
  JOIN public.products p ON p.id = oi.product_id
  JOIN public.orders o ON o.id = oi.order_id
  WHERE oi.order_id = p_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
