# Fix RLS Policy for Order Items

## Problem
The error "new row violates row-level security policy for table 'order_items'" occurs because there's no INSERT policy for the `order_items` table.

## Solution
Run the following SQL in your Supabase SQL Editor:

```sql
-- Add INSERT policy for order_items
-- Users can insert order items for orders they own
CREATE POLICY "Users can insert their own order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);
```

## Steps to Apply:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the SQL above
4. Click "Run" to execute the policy

## Verification
After applying the policy, try placing an order again. The error should be resolved.

