# Category Structure Documentation

This document outlines the complete category structure for the e-commerce website.

## Main Categories

The website uses 9 main categories, each with specific subcategories:

### 1. Kurtis, Sarees & Lehengas
- **Subcategories:**
  - Kurtis
  - Sarees
  - Lehengas
  - Blouses
  - Dupattas

### 2. Men's Fashion
- **Subcategories:**
  - Shirts
  - T-shirts
  - Pants
  - Belts
  - Watches
  - Footwear
  - Accessories

### 3. Kids & Toys
- **Subcategories:**
  - Kids Clothing
  - Toys
  - School Supplies
  - Games

### 4. Home & Kitchen
- **Subcategories:**
  - Kitchenware
  - Home Decor
  - Furniture
  - Appliances
  - Bedding

### 5. Beauty & Personal Care
- **Subcategories:**
  - Skincare
  - Makeup
  - Haircare
  - Fragrances
  - Personal Care

### 6. Bags & Footwear
- **Subcategories:**
  - Handbags
  - Backpacks
  - Wallets
  - Shoes
  - Sandals

### 7. Watches & Accessories
- **Subcategories:**
  - Watches
  - Jewelry
  - Sunglasses
  - Belts

### 8. Sports & Fitness
- **Subcategories:**
  - Sportswear
  - Equipment
  - Fitness Accessories
  - Sports Shoes

### 9. Stationery & Office
- **Subcategories:**
  - Notebooks
  - Pens
  - Office Supplies
  - Art Materials

## Database Structure

- **Categories Table:** Stores main categories with `id`, `name`, and `slug`
- **Products Table:** Has `category_id` (foreign key to categories) and `subcategory` (text field for subcategory name)

## Migration

To apply the new category structure, run the migration file:
```
supabase/migrations/20251109000000_update_categories_structure.sql
```

This migration will:
1. Delete all existing products (to avoid foreign key issues)
2. Delete all existing categories
3. Insert the 9 new main categories

## Adding Products

When adding products, ensure:
- The `category_id` matches one of the main category IDs
- The `subcategory` field contains one of the valid subcategory names listed above
- All prices are in Indian Rupees (INR)

## UI Implementation

The category tabs on the homepage automatically load from the database and display all available categories. The UI has been updated to use a flexible wrap layout to accommodate all 9 categories.

