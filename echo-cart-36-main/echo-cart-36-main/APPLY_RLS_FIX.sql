-- ============================================
-- FIX RLS POLICY FOR ORDER_ITEMS TABLE
-- ============================================
-- This SQL fixes the error: "new row violates row-level security policy for table 'order_items'"
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" (or press Ctrl+Enter)
-- 6. You should see "Success. No rows returned"
-- ============================================

-- First, check if the policy already exists and drop it if it does
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

-- Create the INSERT policy for order_items
-- This allows users to insert order items for orders they own
CREATE POLICY "Users can insert their own order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'order_items' AND policyname = 'Users can insert their own order items';

