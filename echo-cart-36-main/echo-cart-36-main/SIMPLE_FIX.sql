-- ============================================
-- SIMPLE FIX - Copy and paste this entire block
-- ============================================

-- Remove old policy if it exists
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

-- Create the policy that allows users to insert order items
CREATE POLICY "Users can insert their own order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- ============================================
-- That's it! You should see "Success" message
-- ============================================

