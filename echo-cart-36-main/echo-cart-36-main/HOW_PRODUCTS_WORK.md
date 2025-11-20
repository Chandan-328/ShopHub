# How Products Appear on Your Website

## Product Flow

1. **Database (Supabase)** - Products are stored in the `products` table
2. **Index.tsx** - Fetches products from database when page loads
3. **ProductCard.tsx** - Displays each product in a card format

## How Products Are Fetched

In `src/pages/Index.tsx`, products are fetched using:

```typescript
const fetchProducts = async () => {
  const { data } = await supabase
    .from("products")
    .select("*, categories(name)");
  if (data) setProducts(data as any);
};
```

This query:
- Gets all products from the `products` table
- Joins with `categories` table to get category names
- Displays them in a grid on the homepage

## To Make Products Appear

You need to **run the database migrations** to insert products into your Supabase database.

### Step 1: Apply Category Migration First
```sql
-- Run this migration first:
supabase/migrations/20251109000000_update_categories_structure.sql
```

### Step 2: Apply Product Migrations
Run these migrations in order:

1. **Main Product Data:**
   ```
   supabase/migrations/20251109030000_enhanced_detailed_products.sql
   ```

2. **Part 2 (Kids, Home, Beauty, Bags):**
   ```
   supabase/migrations/20251109040000_enhanced_detailed_products_part2.sql
   ```

3. **Part 3 (Watches, Sports, Stationery):**
   ```
   supabase/migrations/20251109050000_enhanced_detailed_products_part3.sql
   ```

### How to Apply Migrations

#### Option 1: Using Supabase CLI (Recommended)
```bash
# Make sure you're in the project directory
cd echo-cart-36-main

# Apply all migrations
supabase db push

# Or apply specific migration
supabase migration up
```

#### Option 2: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL from each migration file
4. Run them in order

#### Option 3: Using Supabase Studio
1. Open Supabase Studio
2. Go to SQL Editor
3. Run each migration file in sequence

## Verify Products Are in Database

### Check in Supabase Dashboard:
1. Go to **Table Editor** in Supabase
2. Select `products` table
3. You should see all your products listed

### Check in Code:
Add this to your browser console on the homepage:
```javascript
// This will show all products fetched
console.log('Products:', window.products);
```

## Product Display Locations

Products appear in:
1. **Homepage (`/`)** - `Index.tsx` - Main product listing
2. **Search Page (`/search`)** - `Search.tsx` - Search results
3. **Product Detail Page (`/product/:id`)** - `ProductDetail.tsx` - Individual product
4. **Category Filter** - When you click a category tab, products filter by category

## Troubleshooting

### If products don't appear:

1. **Check if migrations ran:**
   - Go to Supabase Dashboard → Database → Migrations
   - Verify migrations are applied

2. **Check database connection:**
   - Verify Supabase credentials in `.env` file
   - Check if `supabase` client is properly configured

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

4. **Verify products exist:**
   - Run this query in Supabase SQL Editor:
   ```sql
   SELECT COUNT(*) FROM products;
   ```
   - Should return a number > 0

5. **Check category matching:**
   - Products are filtered by category name
   - Make sure category names match exactly (case-sensitive)

## Product Structure

Each product has:
- `id` - Unique identifier
- `name` - Product name
- `price` - Price in INR
- `image_url` - Product image URL
- `category_id` - Links to categories table
- `subcategory` - Subcategory name (e.g., "Kurtis", "Sarees")
- `stock` - Available quantity
- `description` - Product description

## Category Filtering

When you click a category tab:
- `Index.tsx` filters products by category name
- Only products matching that category are shown
- "All" shows all products

The filtering happens in:
```typescript
if (selectedCategory !== "all") {
  filtered = filtered.filter(
    (p) => p.categories?.name.toLowerCase().replace("'s", "s") === 
           selectedCategory.toLowerCase().replace("'s", "s")
  );
}
```

