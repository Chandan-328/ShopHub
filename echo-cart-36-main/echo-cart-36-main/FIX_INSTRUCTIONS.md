# 🔧 Fix RLS Policy Error - Step by Step Guide

## Error Message
```
new row violates row-level security policy for table "order_items"
```

## Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click the **"New Query"** button (top right)

### Step 3: Run the Fix
1. Open the file `APPLY_RLS_FIX.sql` in this folder
2. **Copy ALL the SQL code** from that file
3. **Paste it** into the SQL Editor in Supabase
4. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 4: Verify
- You should see: **"Success. No rows returned"**
- If you see an error, make sure you're logged in and have the correct project selected

### Step 5: Test
1. Go back to your website
2. Try placing an order again
3. The error should be gone! ✅

---

## Alternative: If you can't access Supabase Dashboard

If you're using Supabase CLI, you can run:

```bash
supabase db push
```

This will apply all migration files including the RLS policy fix.

---

## What This Fix Does

This SQL creates a Row Level Security (RLS) policy that allows users to insert order items, but only for orders they own. This ensures:
- ✅ Users can create orders with items
- ✅ Users can only add items to their own orders
- ✅ Security is maintained

---

## Still Having Issues?

1. **Check if you're logged in** to Supabase
2. **Verify you selected the correct project**
3. **Make sure the `order_items` table exists**
4. **Check the browser console** for any other errors

