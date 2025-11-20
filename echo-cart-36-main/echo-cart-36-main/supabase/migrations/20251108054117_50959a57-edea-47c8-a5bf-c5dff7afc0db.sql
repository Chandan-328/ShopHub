-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  subcategory TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist_items table
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT
USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for wishlist_items
CREATE POLICY "Users can view their own wishlist items"
ON public.wishlist_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
ON public.wishlist_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
ON public.wishlist_items FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Insert sample categories
INSERT INTO public.categories (name, slug) VALUES
  ('Beauty', 'beauty'),
  ('Men''s Fashion', 'mens-fashion'),
  ('Women''s Fashion', 'womens-fashion'),
  ('Jewelry', 'jewelry'),
  ('Shoes', 'shoes');

-- Insert sample products
INSERT INTO public.products (name, description, price, category_id, subcategory, image_url, stock) VALUES
  -- Beauty products
  ('Luxury Face Cream', 'Premium anti-aging face cream with natural ingredients', 49.99, (SELECT id FROM categories WHERE slug = 'beauty'), 'Skincare', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571', 50),
  ('Natural Lipstick Set', 'Set of 5 natural, long-lasting lipsticks', 29.99, (SELECT id FROM categories WHERE slug = 'beauty'), 'Makeup', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa', 100),
  ('Organic Hair Serum', 'Nourishing hair serum for all hair types', 24.99, (SELECT id FROM categories WHERE slug = 'beauty'), 'Hair Care', 'https://images.unsplash.com/photo-1571875257727-256c39da42af', 75),
  
  -- Men's Fashion
  ('Classic Cotton Shirt', 'Premium cotton dress shirt, perfect for any occasion', 59.99, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Shirts', 'https://images.unsplash.com/photo-1602810318660-d2c46b750f88', 80),
  ('Slim Fit Jeans', 'Comfortable slim fit denim jeans', 79.99, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d', 60),
  ('Leather Jacket', 'Genuine leather jacket with modern design', 199.99, (SELECT id FROM categories WHERE slug = 'mens-fashion'), 'Outerwear', 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 30),
  
  -- Women's Fashion
  ('Elegant Evening Dress', 'Stunning evening dress for special occasions', 149.99, (SELECT id FROM categories WHERE slug = 'womens-fashion'), 'Dresses', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae', 45),
  ('Casual Summer Top', 'Light and breezy summer top', 34.99, (SELECT id FROM categories WHERE slug = 'womens-fashion'), 'Tops', 'https://images.unsplash.com/photo-1564859228273-274232fdb516', 90),
  ('Designer Handbag', 'Luxury leather handbag with gold hardware', 299.99, (SELECT id FROM categories WHERE slug = 'womens-fashion'), 'Accessories', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3', 25),
  
  -- Jewelry
  ('Diamond Necklace', 'Elegant diamond pendant necklace', 899.99, (SELECT id FROM categories WHERE slug = 'jewelry'), 'Necklaces', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', 15),
  ('Gold Earrings', 'Classic 18k gold hoop earrings', 249.99, (SELECT id FROM categories WHERE slug = 'jewelry'), 'Earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908', 40),
  ('Silver Chain', 'Sterling silver chain bracelet', 89.99, (SELECT id FROM categories WHERE slug = 'jewelry'), 'Chains', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a', 55),
  
  -- Shoes
  ('Running Sneakers', 'High-performance running shoes with cushioned sole', 119.99, (SELECT id FROM categories WHERE slug = 'shoes'), 'Athletic', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 70),
  ('Leather Boots', 'Premium leather ankle boots', 159.99, (SELECT id FROM categories WHERE slug = 'shoes'), 'Boots', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f', 35),
  ('Casual Loafers', 'Comfortable everyday loafers', 79.99, (SELECT id FROM categories WHERE slug = 'shoes'), 'Casual', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509', 50);