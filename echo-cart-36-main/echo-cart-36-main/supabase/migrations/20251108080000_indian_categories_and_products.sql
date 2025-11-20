-- Migration: Indian Categories and Products
-- This migration replaces existing categories and products with Indian-focused categories and products
-- All prices are in Indian Rupees (INR)

-- First, delete existing products (to avoid foreign key issues)
DELETE FROM public.products;

-- Delete existing categories
DELETE FROM public.categories;

-- Insert new categories with Indian context
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

-- Insert products for Kurtis, Sarees & Lehengas (30+ products)
INSERT INTO public.products (name, description, price, category_id, subcategory, image_url, stock) VALUES
  -- Kurtis
  ('Cotton Printed Kurti', 'Comfortable cotton kurti with beautiful Indian prints, perfect for daily wear', 599, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 50),
  ('Designer Anarkali Kurti', 'Elegant anarkali style kurti with intricate embroidery work', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 30),
  ('Silk Embroidered Kurti', 'Premium silk kurti with handcrafted embroidery, ideal for special occasions', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 25),
  ('Rayon Floral Kurti', 'Lightweight rayon kurti with floral patterns, perfect for summer', 799, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 40),
  ('Chiffon Party Kurti', 'Stylish chiffon kurti with sequin work, great for parties and celebrations', 1899, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 35),
  ('Georgette Printed Kurti', 'Elegant georgette kurti with modern prints and comfortable fit', 999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 45),
  ('Cotton Casual Kurti', 'Simple and comfortable cotton kurti for everyday wear', 499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 60),
  ('Linen Embroidered Kurti', 'Premium linen kurti with delicate embroidery, breathable fabric', 1499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Kurtis', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 30),
  
  -- Sarees
  ('Cotton Handloom Saree', 'Traditional handloom cotton saree with beautiful border work', 1999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633312681-425c7b7ccd1', 20),
  ('Silk Kanjivaram Saree', 'Authentic Kanjivaram silk saree with zari work, premium quality', 8999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 10),
  ('Georgette Designer Saree', 'Elegant georgette saree with designer blouse, perfect for weddings', 3499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 15),
  ('Chiffon Party Saree', 'Stylish chiffon saree with sequin and stone work', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 18),
  ('Cotton Printed Saree', 'Comfortable cotton saree with modern prints, ideal for daily wear', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 25),
  ('Silk Banarasi Saree', 'Traditional Banarasi silk saree with intricate brocade work', 6999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 12),
  ('Organza Embroidered Saree', 'Luxurious organza saree with hand embroidery, perfect for special occasions', 4999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 14),
  ('Linen Handloom Saree', 'Elegant linen handloom saree with traditional motifs', 2999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Sarees', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 20),
  
  -- Lehengas
  ('Designer Lehenga Choli', 'Beautiful lehenga choli set with intricate embroidery and dupatta', 5999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 12),
  ('Bridal Lehenga Set', 'Stunning bridal lehenga with heavy work, perfect for weddings', 12999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 8),
  ('Party Lehenga Choli', 'Elegant party lehenga with sequin work and designer blouse', 4499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 15),
  ('Cotton Lehenga Set', 'Comfortable cotton lehenga for casual occasions', 2499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 20),
  ('Silk Lehenga Choli', 'Premium silk lehenga with zari work and matching dupatta', 7999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 10),
  ('Georgette Lehenga Set', 'Stylish georgette lehenga with modern design', 3499, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Lehengas', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 18),
  
  -- Blouses
  ('Designer Blouse', 'Elegant designer blouse with embroidery work', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Blouses', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 30),
  ('Silk Embroidered Blouse', 'Premium silk blouse with handcrafted embroidery', 1999, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Blouses', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 25),
  ('Cotton Casual Blouse', 'Comfortable cotton blouse for daily wear', 599, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Blouses', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1', 40),
  
  -- Dupattas
  ('Printed Dupatta', 'Beautiful printed dupatta with vibrant colors', 399, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Dupattas', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 50),
  ('Embroidered Dupatta', 'Elegant embroidered dupatta with intricate work', 799, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Dupattas', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 35),
  ('Silk Dupatta', 'Premium silk dupatta with zari border', 1299, (SELECT id FROM categories WHERE slug = 'kurtis-sarees-lehengas'), 'Dupattas', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf', 30);

-- Insert products for Men's Fashion (30+ products)
INSERT INTO public.products (name, description, price, category_id, subcategory, image_url, stock) VALUES
  -- Shirts
  ('Formal Cotton Shirt', 'Premium cotton formal shirt, perfect for office wear', 1299, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88', 40),
  ('Casual Checked Shirt', 'Comfortable casual shirt with checkered pattern', 899, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1603252109303-2751441dd157', 50),
  ('Linen Summer Shirt', 'Lightweight linen shirt, ideal for hot weather', 1199, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88', 35),
  ('Designer Printed Shirt', 'Stylish designer shirt with modern prints', 1499, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1603252109303-2751441dd157', 30),
  ('Denim Shirt', 'Classic denim shirt for casual occasions', 999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88', 45),
  ('Striped Formal Shirt', 'Elegant striped formal shirt for business meetings', 1399, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1603252109303-2751441dd157', 38),
  ('Oxford Cotton Shirt', 'Premium Oxford cotton shirt, versatile style', 1599, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88', 32),
  ('Kurta Shirt', 'Traditional kurta style shirt with modern fit', 799, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1603252109303-2751441dd157', 40),
  
  -- T-shirts
  ('Cotton Polo T-Shirt', 'Comfortable cotton polo t-shirt for daily wear', 499, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 60),
  ('Graphic Print T-Shirt', 'Trendy t-shirt with graphic prints and designs', 599, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 55),
  ('V-Neck T-Shirt', 'Classic V-neck t-shirt in multiple colors', 399, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 70),
  ('Round Neck T-Shirt', 'Comfortable round neck t-shirt, perfect for casual wear', 449, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 65),
  ('Slim Fit T-Shirt', 'Modern slim fit t-shirt with premium fabric', 699, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 50),
  ('Oversized T-Shirt', 'Trendy oversized t-shirt for street style', 549, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 45),
  ('Cotton Crew Neck T-Shirt', 'Classic crew neck t-shirt, comfortable fit', 449, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 60),
  ('Premium Cotton T-Shirt', 'High-quality premium cotton t-shirt', 799, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'T-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 40),
  
  -- Pants
  ('Formal Trousers', 'Classic formal trousers for office wear', 1499, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 35),
  ('Slim Fit Jeans', 'Comfortable slim fit denim jeans', 1299, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 40),
  ('Chinos Pants', 'Versatile chinos pants for smart casual look', 1199, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 38),
  ('Cargo Pants', 'Practical cargo pants with multiple pockets', 999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 42),
  ('Straight Fit Jeans', 'Classic straight fit jeans for everyday wear', 1099, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 45),
  ('Cotton Trousers', 'Comfortable cotton trousers for casual occasions', 899, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 40),
  ('Linen Pants', 'Lightweight linen pants for summer', 1299, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 35),
  ('Jogger Pants', 'Comfortable jogger pants for active lifestyle', 799, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 50),
  
  -- Belts
  ('Leather Formal Belt', 'Premium leather belt for formal wear', 699, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Belts', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd', 40),
  ('Casual Canvas Belt', 'Stylish canvas belt for casual outfits', 399, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Belts', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd', 50),
  ('Reversible Belt', 'Versatile reversible belt with two colors', 599, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Belts', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd', 35),
  
  -- Watches
  ('Analog Watch', 'Classic analog watch with leather strap', 1999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 25),
  ('Digital Sports Watch', 'Feature-rich digital sports watch', 2499, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 20),
  ('Smart Watch', 'Modern smartwatch with fitness tracking', 4999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Watches', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 15),
  
  -- Footwear
  ('Formal Leather Shoes', 'Premium leather formal shoes', 2999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Footwear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772', 20),
  ('Casual Sneakers', 'Comfortable casual sneakers for daily wear', 1999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 30),
  ('Sports Shoes', 'High-performance sports shoes', 2499, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 25),
  
  -- Accessories
  ('Leather Wallet', 'Premium leather wallet with multiple card slots', 799, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Accessories', 'https://images.unsplash.com/photo-1627123424574-724758594ecc', 40),
  ('Sunglasses', 'Stylish sunglasses with UV protection', 999, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Accessories', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083', 35),
  ('Tie Set', 'Formal tie set with matching pocket square', 599, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Accessories', 'https://images.unsplash.com/photo-1594938291221-94c5c535d5d2', 30);

-- Continue with remaining categories... (Due to length, I'll create a separate file for the rest)

