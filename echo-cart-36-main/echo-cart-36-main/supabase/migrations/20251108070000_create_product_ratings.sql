-- Create product_ratings table
CREATE TABLE IF NOT EXISTS public.product_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id ON public.product_ratings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ratings_user_id ON public.product_ratings(user_id);

-- Enable Row Level Security
ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_ratings
-- Everyone can view ratings
CREATE POLICY "Ratings are viewable by everyone"
ON public.product_ratings FOR SELECT
USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert their own ratings"
ON public.product_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
ON public.product_ratings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings"
ON public.product_ratings FOR DELETE
USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_product_ratings_updated_at
  BEFORE UPDATE ON public.product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

