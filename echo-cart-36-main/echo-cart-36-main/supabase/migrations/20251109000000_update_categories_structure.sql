-- Migration: Update Categories Structure
-- This migration updates the categories to match the new comprehensive category structure
-- All prices are in Indian Rupees (INR)

-- First, delete existing products (to avoid foreign key issues)
DELETE FROM public.products;

-- Delete existing categories
DELETE FROM public.categories;

-- Insert new categories matching the required structure
INSERT INTO public.categories (name, slug) VALUES
  ('Kurtis, Sarees & Lehengas', 'kurtis-sarees-lehengas'),
  ('Men''s Fashion', 'mens-fashion'),
  ('Kids & Toys', 'kids-toys'),
  ('Home & Kitchen', 'home-kitchen'),
  ('Beauty & Personal Care', 'beauty-personal-care'),
  ('Bags & Footwear', 'bags-footwear'),
  ('Watches & Accessories', 'watches-accessories'),
  ('Sports & Fitness', 'sports-fitness'),
  ('Stationery & Office', 'stationery-office');

-- Note: Subcategories are stored in the products.subcategory field
-- The subcategories for each main category are:
-- 1. Kurtis, Sarees & Lehengas: Kurtis, Sarees, Lehengas, Blouses, Dupattas
-- 2. Men's Fashion: Shirts, T-shirts, Pants, Belts, Watches, Footwear, Accessories
-- 3. Kids & Toys: Kids Clothing, Toys, School Supplies, Games
-- 4. Home & Kitchen: Kitchenware, Home Decor, Furniture, Appliances, Bedding
-- 5. Beauty & Personal Care: Skincare, Makeup, Haircare, Fragrances, Personal Care
-- 6. Bags & Footwear: Handbags, Backpacks, Wallets, Shoes, Sandals
-- 7. Watches & Accessories: Watches, Jewelry, Sunglasses, Belts
-- 8. Sports & Fitness: Sportswear, Equipment, Fitness Accessories, Sports Shoes
-- 9. Stationery & Office: Notebooks, Pens, Office Supplies, Art Materials

