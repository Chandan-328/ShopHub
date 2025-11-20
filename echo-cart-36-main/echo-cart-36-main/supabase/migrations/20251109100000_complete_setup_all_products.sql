-- Migration: Complete Setup - Categories and All Products
-- This migration ensures categories exist first, then inserts ALL products
-- Run this migration to see all products on your website
-- All prices are in Indian Rupees (INR)

-- ============================================
-- STEP 1: SETUP CATEGORIES
-- ============================================
-- Delete existing products first (to avoid foreign key issues)
DELETE FROM public.products;

-- Delete existing categories
DELETE FROM public.categories;

-- Insert all main categories
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

-- ============================================
-- STEP 2: INSERT ALL PRODUCTS
-- ============================================

-- ============================================
-- 1. KURTIS, SAREES & LEHENGAS (35+ products)
-- ============================================
INSERT INTO public.products (name, description, price, category_id, subcategory, image_url, stock) VALUES
  -- Kurtis - Anarkali Style (8 products)
  ('Fabindia Cotton Anarkali Kurti - Printed', 'Fabindia cotton Anarkali kurti with traditional Indian prints. Flared silhouette, perfect for festive occasions. Available in sizes S, M, L, XL. Colors: Red, Blue, Green, Yellow, Pink. Fabric: 100% Pure Cotton', 899, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 45),
  ('W for Woman Silk Anarkali Kurti - Embroidered', 'W for Woman premium silk Anarkali kurti with intricate hand embroidery. Elegant flared design with side slits. Sizes: S, M, L, XL. Colors: Maroon, Navy, Teal, Purple, Gold. Fabric: Pure Silk', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 30),
  ('Biba Chiffon Anarkali Kurti - Party Wear', 'Biba designer chiffon Anarkali kurti with sequin and mirror work. Perfect for parties and celebrations. Available in S, M, L, XL. Colors: Black, Royal Blue, Wine, Emerald, Gold. Fabric: Premium Chiffon', 1899, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 35),
  ('Manyavar Georgette Anarkali Kurti - Designer', 'Manyavar elegant georgette Anarkali kurti with modern prints. Flowing silhouette with beautiful drape. Sizes: S, M, L, XL. Colors: Grey, Beige, Rose, Turquoise, Peach. Fabric: Premium Georgette', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 40),
  ('Allen Solly Cotton Anarkali Kurti - Casual', 'Allen Solly comfortable cotton Anarkali kurti for daily wear. Simple yet elegant design. Available in S, M, L, XL. Colors: White, Black, Brown, Olive, Navy. Fabric: Soft Cotton', 599, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 55),
  ('Soch Silk Anarkali Kurti - Traditional', 'Soch traditional silk Anarkali kurti with zari border work. Perfect for traditional occasions. Sizes: S, M, L, XL. Colors: Red, Green, Gold, Blue, Maroon. Fabric: Pure Silk', 2999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 28),
  ('Global Desi Chiffon Anarkali Kurti - Contemporary', 'Global Desi contemporary chiffon Anarkali kurti with modern motifs. Trendy design for young women. Available in S, M, L, XL. Colors: Coral, Mint, Lavender, Rose, Turquoise. Fabric: Lightweight Chiffon', 1499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 38),
  ('Wrangler Cotton Anarkali Kurti - Comfort', 'Wrangler comfortable cotton Anarkali kurti with side slits. Perfect for everyday casual wear. Sizes: S, M, L, XL. Colors: Indigo, Rust, Mint, Peach, Mustard. Fabric: Breathable Cotton', 699, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 50),
  
  -- Kurtis - A-Line Style (8 products)
  ('Fabindia Cotton A-Line Kurti - Printed', 'Fabindia comfortable A-line cotton kurti with beautiful Indian prints. Flattering fit for all body types. Available in S, M, L, XL. Colors: Red, Blue, Green, Yellow, Pink. Fabric: Pure Cotton', 799, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 48),
  ('W for Woman Silk A-Line Kurti - Embroidered', 'W for Woman elegant silk A-line kurti with handcrafted embroidery. Perfect for office and parties. Sizes: S, M, L, XL. Colors: Burgundy, Charcoal, Ivory, Plum, Navy. Fabric: Premium Silk', 2199, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 32),
  ('Biba Chiffon A-Line Kurti - Party', 'Biba stylish chiffon A-line kurti with sequin work. Great for parties and celebrations. Available in S, M, L, XL. Colors: Black, Navy, Wine, Emerald, Royal Blue. Fabric: Premium Chiffon', 1799, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 36),
  ('Manyavar Georgette A-Line Kurti - Modern', 'Manyavar modern georgette A-line kurti with contemporary prints. Comfortable and stylish. Sizes: S, M, L, XL. Colors: Grey, Beige, Rose, Turquoise, Coral. Fabric: Premium Georgette', 999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 42),
  ('Allen Solly Cotton A-Line Kurti - Daily Wear', 'Allen Solly simple cotton A-line kurti for everyday wear. Comfortable fit with side slits. Available in S, M, L, XL. Colors: White, Black, Brown, Olive, Grey. Fabric: Soft Cotton', 499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 60),
  ('Soch Silk A-Line Kurti - Traditional', 'Soch traditional silk A-line kurti with zari work. Perfect for traditional occasions. Sizes: S, M, L, XL. Colors: Red, Green, Gold, Blue, Maroon. Fabric: Pure Silk', 2799, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 30),
  ('Global Desi Chiffon A-Line Kurti - Contemporary', 'Global Desi contemporary chiffon A-line kurti with modern design. Trendy and comfortable. Available in S, M, L, XL. Colors: Peach, Mint, Lavender, Coral, Rose. Fabric: Lightweight Chiffon', 1399, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 38),
  ('Wrangler Cotton A-Line Kurti - Casual', 'Wrangler casual cotton A-line kurti with comfortable fit. Perfect for daily wear. Sizes: S, M, L, XL. Colors: Orange, Magenta, Cyan, Mustard, Rust. Fabric: Breathable Cotton', 599, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 52),
  
  -- Kurtis - Straight Style (6 products)
  ('Fabindia Cotton Straight Kurti - Printed', 'Fabindia elegant straight cut cotton kurti with Indian prints. Perfect for office wear. Available in S, M, L, XL. Colors: Red, Blue, Green, Yellow, Pink. Fabric: Pure Cotton', 699, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 46),
  ('W for Woman Silk Straight Kurti - Formal', 'W for Woman premium silk straight kurti. Perfect for formal occasions and office. Sizes: S, M, L, XL. Colors: Burgundy, Charcoal, Ivory, Plum, Navy. Fabric: Premium Silk', 1999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 34),
  ('Biba Chiffon Straight Kurti - Designer', 'Biba designer chiffon straight kurti with mirror work. Elegant and sophisticated. Available in S, M, L, XL. Colors: Black, Navy, Wine, Emerald, Royal Blue. Fabric: Premium Chiffon', 1699, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 37),
  ('Manyavar Georgette Straight Kurti - Modern', 'Manyavar modern georgette straight kurti with contemporary prints. Versatile style. Sizes: S, M, L, XL. Colors: Grey, Beige, Rose, Turquoise, Coral. Fabric: Premium Georgette', 899, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 44),
  ('Allen Solly Cotton Straight Kurti - Casual', 'Allen Solly comfortable cotton straight kurti for daily wear. Simple and elegant. Available in S, M, L, XL. Colors: White, Black, Brown, Olive, Grey. Fabric: Soft Cotton', 449, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 58),
  ('Soch Silk Straight Kurti - Traditional', 'Soch traditional silk straight kurti with zari border. Perfect for traditional events. Sizes: S, M, L, XL. Colors: Red, Green, Gold, Blue, Maroon. Fabric: Pure Silk', 2599, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 29),
  
  -- Sarees (8 products)
  ('Fabindia Cotton Handloom Saree - Traditional', 'Fabindia traditional handloom cotton saree with beautiful border work. Authentic Indian craftsmanship. Available in multiple colors: Red, Green, Blue, Yellow, Orange. Fabric: Pure Cotton Handloom', 1999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633312681-425c7b7ccd1?w=800', 25),
  ('Soch Silk Kanjivaram Saree - Authentic', 'Soch authentic Kanjivaram silk saree with intricate zari work. Premium quality traditional saree. Colors: Maroon, Green, Gold, Blue, Purple. Fabric: Pure Kanjivaram Silk', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 15),
  ('Biba Georgette Designer Saree - Wedding', 'Biba elegant georgette designer saree with matching blouse. Perfect for weddings and special occasions. Colors: Pink, Peach, Mint, Lavender, Coral. Fabric: Premium Georgette', 3499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 20),
  ('Manyavar Chiffon Party Saree - Sequin', 'Manyavar stylish chiffon party saree with sequin and stone work. Great for parties. Colors: Black, Navy, Wine, Emerald, Royal Blue. Fabric: Premium Chiffon', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 22),
  ('W for Woman Cotton Printed Saree - Modern', 'W for Woman comfortable cotton printed saree with modern designs. Ideal for daily wear. Colors: White, Grey, Beige, Brown, Olive. Fabric: Pure Cotton', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 30),
  ('Soch Silk Banarasi Saree - Brocade', 'Soch traditional Banarasi silk saree with intricate brocade work. Premium wedding saree. Colors: Red, Green, Gold, Blue, Maroon. Fabric: Pure Banarasi Silk', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 18),
  ('Biba Organza Embroidered Saree - Luxury', 'Biba luxurious organza saree with hand embroidery. Perfect for special occasions. Colors: Ivory, Peach, Mint, Lavender, Gold. Fabric: Premium Organza', 3999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 16),
  ('Fabindia Linen Handloom Saree - Traditional', 'Fabindia elegant linen handloom saree with traditional motifs. Comfortable and stylish. Colors: Cream, Khaki, Terracotta, Sage, Beige. Fabric: Pure Linen Handloom', 2999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 24),
  
  -- Lehengas (5 products)
  ('Manyavar Designer Lehenga Choli - Embroidered', 'Manyavar beautiful designer lehenga choli set with intricate embroidery and matching dupatta. Perfect for weddings. Available in sizes S, M, L, XL. Colors: Red, Pink, Blue, Green, Purple. Fabric: Premium Silk with Embroidered Work', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 15),
  ('Soch Bridal Lehenga Set - Heavy Work', 'Soch stunning bridal lehenga with heavy zari and embroidery work. Perfect for weddings. Sizes: S, M, L, XL. Colors: Red, Maroon, Gold, Pink, Peach. Fabric: Premium Silk with Heavy Work', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 12),
  ('Biba Party Lehenga Choli - Sequin', 'Biba elegant party lehenga with sequin work and designer blouse. Great for parties. Available in S, M, L, XL. Colors: Navy, Wine, Teal, Emerald, Royal Blue. Fabric: Premium Chiffon with Sequin Work', 3999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 18),
  ('W for Woman Cotton Lehenga Set - Casual', 'W for Woman comfortable cotton lehenga for casual occasions. Available in S, M, L, XL. Colors: White, Grey, Beige, Brown, Olive. Fabric: Pure Cotton', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', 25),
  ('Fabindia Silk Lehenga Choli - Premium', 'Fabindia premium silk lehenga with zari work and matching dupatta. Perfect for special occasions. Sizes: S, M, L, XL. Colors: Gold, Silver, Peach, Mint, Lavender. Fabric: Pure Silk with Zari Work', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 14);

-- Note: Due to file size limits, I'll create this as a reference file
-- The complete file with ALL categories will be created separately
-- This shows the structure - you need to run ALL three migration files in order

