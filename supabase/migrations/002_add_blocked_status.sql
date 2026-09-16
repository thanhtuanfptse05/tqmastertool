-- Migration: 002_add_blocked_status.sql
-- Description: Update orders status check constraint to include 'blocked' for anti-hack admin revocation.

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending_payment', 'pending_approval', 'completed', 'rejected', 'cancelled', 'blocked'));
