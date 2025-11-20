================================================================================
                    URGENT: FIX DATABASE ERROR - 5 MINUTES
================================================================================

ERROR: "new row violates row-level security policy for table 'order_items'"

This error happens because your Supabase database is missing a security policy.
You MUST run SQL in Supabase to fix this - it cannot be fixed from code alone.

================================================================================
STEP-BY-STEP FIX (Follow these steps exactly):
================================================================================

STEP 1: Open Supabase Dashboard
   - Go to: https://supabase.com/dashboard
   - Log in with your account
   - Click on your project

STEP 2: Open SQL Editor
   - Look at the LEFT SIDEBAR
   - Click on "SQL Editor" (it has a database icon)
   - Click "New Query" button (top right)

STEP 3: Copy the SQL Below
   - Open the file: APPLY_RLS_FIX.sql
   - Select ALL the text (Ctrl+A)
   - Copy it (Ctrl+C)

STEP 4: Paste and Run
   - Paste into the SQL Editor (Ctrl+V)
   - Click the "Run" button (or press Ctrl+Enter)
   - Wait for "Success" message

STEP 5: Test
   - Go back to your website
   - Try placing an order
   - Error should be GONE!

================================================================================
IF YOU CAN'T ACCESS SUPABASE:
================================================================================

If you don't have access to Supabase Dashboard, you need to:
1. Ask your database administrator to run the SQL
2. Or get Supabase project access from the project owner

The SQL file is: APPLY_RLS_FIX.sql

================================================================================
VERIFICATION:
================================================================================

After running the SQL, you should see:
- "Success. No rows returned" message
- The policy will be created
- Orders will work correctly

================================================================================

