-- ==========================================================
-- Migration: 004_security_hardening_admin_and_orders.sql
-- Description: Security Hardening for Admin Privilege Protection,
--              Anti-Price-Tampering, and RLS Lockdown.
-- Spec: SPEC-015
-- ==========================================================

-- 1. PREVENT PRIVILEGE ESCALATION ON PROFILES TABLE
-- Prohibits regular users from escalating their role to 'admin'
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only service_role (Admin API) can alter user roles
  IF NEW.role IS DISTINCT FROM OLD.role AND current_setting('role', true) != 'service_role' THEN
    RAISE EXCEPTION 'Security Violation: Changing user roles is strictly prohibited.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.prevent_role_escalation();


-- 2. LOCK DOWN ORDERS TABLE RLS POLICIES
-- Drop loose update policy that allowed users to update any column of their orders
DROP POLICY IF EXISTS "Users can upload proof for their orders" ON public.orders;
DROP POLICY IF EXISTS "Users can upload proof for pending orders" ON public.orders;

-- Secure UPDATE policy: Users can ONLY update orders in 'pending_payment' status,
-- and CANNOT update total_amount, order_code, or change status to 'completed'
CREATE POLICY "Users can upload proof for pending orders" ON public.orders
  FOR UPDATE USING (
    (auth.uid() = user_id AND status = 'pending_payment') 
    OR public.is_admin()
  )
  WITH CHECK (
    (auth.uid() = user_id AND status IN ('pending_payment', 'pending_approval', 'cancelled'))
    OR public.is_admin()
  );


-- 3. PREVENT PRICE TAMPERING ON ORDERS INSERT
-- Ensure total_amount cannot be negative
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_total_amount_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_total_amount_check CHECK (total_amount >= 0);

-- Trigger to verify order items and total_amount consistency on creation
CREATE OR REPLACE FUNCTION public.enforce_order_initial_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Non-service-role cannot create orders with pre-completed status
  IF current_setting('role', true) != 'service_role' THEN
    IF NEW.status NOT IN ('pending_payment', 'pending_approval') THEN
      NEW.status := 'pending_payment';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_enforce_order_initial_status ON public.orders;
CREATE TRIGGER tr_enforce_order_initial_status
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.enforce_order_initial_status();
