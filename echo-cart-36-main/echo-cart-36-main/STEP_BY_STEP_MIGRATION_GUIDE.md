# 📖 Step-by-Step Guide: Run Migrations in Supabase

## 🎯 Goal: Make all products appear on your website

---

## 📋 PREPARATION

### What You Need:
- ✅ Access to your Supabase account
- ✅ Your Supabase project URL
- ✅ The 4 migration SQL files from your project

### Migration Files Location:
```
echo-cart-36-main/
└── supabase/
    └── migrations/
        ├── 20251109000000_update_categories_structure.sql
        ├── 20251109030000_enhanced_detailed_products.sql
        ├── 20251109040000_enhanced_detailed_products_part2.sql
        └── 20251109050000_enhanced_detailed_products_part3.sql
```

---

## 🚀 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: Open Supabase Dashboard**

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **https://supabase.com/dashboard**
3. **Log in** with your Supabase account credentials
   - If you don't have an account, create one first
4. You'll see a list of your projects

---

### **STEP 2: Select Your Project**

1. **Click on your project name** from the list
   - This will open your project dashboard
2. You should now see the project overview page

---

### **STEP 3: Open SQL Editor**

1. Look at the **LEFT SIDEBAR** (menu on the left side)
2. Find and **click on "SQL Editor"**
   - It has a database icon 📊 next to it
   - It's usually in the middle of the sidebar menu
3. The SQL Editor page will open
4. You'll see a text area where you can type SQL

---

### **STEP 4: Run Migration #1 - Categories**

#### 4.1: Open the First Migration File

1. On your computer, navigate to your project folder
2. Go to: `echo-cart-36-main/supabase/migrations/`
3. **Open** the file: `20251109000000_update_categories_structure.sql`
   - You can open it with:
     - Notepad (Windows)
     - TextEdit (Mac)
     - VS Code
     - Any text editor

#### 4.2: Copy the SQL Code

1. **Select ALL the text** in the file:
   - Press `Ctrl+A` (Windows) or `Cmd+A` (Mac)
   - Or click and drag to select everything
2. **Copy the text**:
   - Press `Ctrl+C` (Windows) or `Cmd+C` (Mac)
   - Or right-click → Copy

#### 4.3: Paste into Supabase SQL Editor

1. Go back to your browser (Supabase SQL Editor)
2. **Click inside the SQL Editor text area** (the big white box)
3. **Paste the SQL code**:
   - Press `Ctrl+V` (Windows) or `Cmd+V` (Mac)
   - Or right-click → Paste
4. You should now see all the SQL code in the editor

#### 4.4: Run the SQL

1. **Click the "Run" button** (usually green, at the bottom right)
   - Or press `Ctrl+Enter` (Windows) or `Cmd+Enter` (Mac)
2. **Wait for the result** (usually takes 1-3 seconds)
3. ✅ **You should see**: "Success. No rows returned" or similar success message
4. ❌ **If you see an error**: 
   - Make sure you copied the ENTIRE file
   - Check that you're in the correct project
   - Try again

#### 4.5: Clear the Editor

1. **Click "New Query"** button (top right)
   - This clears the editor for the next migration
   - Or manually delete the text

---

### **STEP 5: Run Migration #2 - Products Part 1**

#### 5.1: Open the Second Migration File

1. On your computer, open: `20251109030000_enhanced_detailed_products.sql`
2. **Select ALL** (Ctrl+A or Cmd+A)
3. **Copy** (Ctrl+C or Cmd+C)

#### 5.2: Paste and Run

1. Go back to Supabase SQL Editor
2. **Paste** the code (Ctrl+V or Cmd+V)
3. **Click "Run"** (or Ctrl+Enter)
4. ✅ Wait for "Success" message
5. **Click "New Query"** to clear

---

### **STEP 6: Run Migration #3 - Products Part 2**

#### 6.1: Open the Third Migration File

1. Open: `20251109040000_enhanced_detailed_products_part2.sql`
2. **Select ALL** and **Copy**

#### 6.2: Paste and Run

1. In Supabase SQL Editor, **Paste** the code
2. **Click "Run"**
3. ✅ Wait for success message
4. **Click "New Query"** to clear

---

### **STEP 7: Run Migration #4 - Products Part 3**

#### 7.1: Open the Fourth Migration File

1. Open: `20251109050000_enhanced_detailed_products_part3.sql`
2. **Select ALL** and **Copy**

#### 7.2: Paste and Run

1. In Supabase SQL Editor, **Paste** the code
2. **Click "Run"**
3. ✅ Wait for success message

---

### **STEP 8: Verify Migrations Worked**

#### 8.1: Check Products Count

1. In SQL Editor, **click "New Query"**
2. **Paste this SQL**:
```sql
SELECT COUNT(*) as total_products FROM products;
```
3. **Click "Run"**
4. ✅ Should show: **315+ products** (or similar number)

#### 8.2: Check Categories

1. **New Query** again
2. **Paste this SQL**:
```sql
SELECT name FROM categories;
```
3. **Click "Run"**
4. ✅ Should show **9 categories**:
   - Kurtis, Sarees & Lehengas
   - Men's Fashion
   - Kids & Toys
   - Home & Kitchen
   - Beauty & Personal Care
   - Bags & Footwear
   - Watches & Accessories
   - Sports & Fitness
   - Stationery & Office

---

### **STEP 9: Refresh Your Website**

1. **Open your website** in a new browser tab
2. **Go to the homepage** (usually `/` or the main page)
3. **Press F5** to refresh
   - Or click the refresh button
   - Or press `Ctrl+R` (Windows) / `Cmd+R` (Mac)

#### What You Should See:

✅ **Category Tabs** at the top:
- "All" tab
- 9 category tabs (Kurtis, Men's Fashion, etc.)

✅ **Product Grid** showing products:
- Product cards with images
- Product names
- Prices in ₹ (Indian Rupees)
- "Add to Cart" buttons

✅ **Products filter** when you click category tabs

---

## 🎯 VISUAL GUIDE

### SQL Editor Location:
```
Supabase Dashboard
├── Left Sidebar
│   ├── Table Editor
│   ├── SQL Editor ← CLICK HERE
│   ├── Database
│   └── ...
└── Main Area (SQL Editor)
    ├── Top: "New Query" button
    ├── Middle: Large text area (paste SQL here)
    └── Bottom: "Run" button (green)
```

### Migration Files Location:
```
Your Computer
└── echo-cart-36-main/
    └── supabase/
        └── migrations/
            ├── 20251109000000_update_categories_structure.sql ← Run 1st
            ├── 20251109030000_enhanced_detailed_products.sql ← Run 2nd
            ├── 20251109040000_enhanced_detailed_products_part2.sql ← Run 3rd
            └── 20251109050000_enhanced_detailed_products_part3.sql ← Run 4th
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue 1: "Permission denied" or "Access denied"
**Fix:** Make sure you're logged into the correct Supabase account and have access to the project

### Issue 2: "Table doesn't exist" error
**Fix:** Make sure you ran Migration #1 (categories) FIRST before running product migrations

### Issue 3: "Foreign key constraint" error
**Fix:** Make sure you're running migrations in the correct order (1, 2, 3, 4)

### Issue 4: Products still not showing on website
**Fix:**
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check browser console (F12) for errors
3. Verify products exist: Run `SELECT COUNT(*) FROM products;` in SQL Editor

### Issue 5: "No rows returned" after running migration
**Fix:** This is NORMAL! It means the migration ran successfully. "No rows returned" is expected for INSERT statements.

---

## ✅ SUCCESS CHECKLIST

After completing all steps, verify:

- [ ] Migration #1 ran successfully (categories)
- [ ] Migration #2 ran successfully (products part 1)
- [ ] Migration #3 ran successfully (products part 2)
- [ ] Migration #4 ran successfully (products part 3)
- [ ] Product count query shows 315+ products
- [ ] Categories query shows 9 categories
- [ ] Website shows category tabs
- [ ] Website shows products in grid
- [ ] Category filtering works (clicking tabs filters products)

---

## 🎉 YOU'RE DONE!

Once all migrations are run, your website will automatically display all products. The code is already set up to fetch and display them from the database!

---

## 📞 Need Help?

If you're stuck:
1. Check the error message in Supabase SQL Editor
2. Make sure you copied the ENTIRE SQL file (not just part of it)
3. Verify you're running migrations in the correct order
4. Check that your Supabase project is active and not paused

---

## 💡 Pro Tips

1. **Keep SQL Editor open** in one tab, and your migration files open in another tab for easy copying
2. **Use "New Query"** button to clear the editor between migrations
3. **Save your progress** - you can run migrations one at a time and take breaks
4. **Test after each migration** - you can check if products are being added after each step

---

**That's it! Follow these steps and your products will appear on your website! 🚀**

