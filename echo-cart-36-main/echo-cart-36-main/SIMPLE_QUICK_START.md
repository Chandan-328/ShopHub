# ⚡ Quick Start - 5 Minutes to See Products

## 🎯 Super Simple Steps

### 1️⃣ Go to Supabase
- Visit: **https://supabase.com/dashboard**
- Login → Click your project

### 2️⃣ Open SQL Editor
- Left sidebar → Click **"SQL Editor"**
- Click **"New Query"** button

### 3️⃣ Run These 4 Files (One by One)

#### File 1: Categories
1. Open: `supabase/migrations/20251109000000_update_categories_structure.sql`
2. Copy ALL (Ctrl+A, Ctrl+C)
3. Paste in SQL Editor
4. Click **"Run"** ✅
5. Click **"New Query"**

#### File 2: Products Part 1
1. Open: `supabase/migrations/20251109030000_enhanced_detailed_products.sql`
2. Copy ALL
3. Paste → Run ✅
4. New Query

#### File 3: Products Part 2
1. Open: `supabase/migrations/20251109040000_enhanced_detailed_products_part2.sql`
2. Copy ALL
3. Paste → Run ✅
4. New Query

#### File 4: Products Part 3
1. Open: `supabase/migrations/20251109050000_enhanced_detailed_products_part3.sql`
2. Copy ALL
3. Paste → Run ✅

### 4️⃣ Refresh Website
- Go to your website
- Press **F5** to refresh
- ✅ Products should appear!

---

## ✅ Quick Test

In SQL Editor, run:
```sql
SELECT COUNT(*) FROM products;
```
Should show: **315+**

---

## 🎉 Done!

That's it! Products will now appear on your website.

