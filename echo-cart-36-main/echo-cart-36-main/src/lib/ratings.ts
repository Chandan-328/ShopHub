/**
 * Rating utility functions
 * Handles rating calculations and operations
 */

import { supabase } from "@/integrations/supabase/client";

export interface ProductRating {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
}

/**
 * Calculate average rating for a product
 */
export async function getAverageRating(productId: string): Promise<number> {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("rating")
    .eq("product_id", productId);

  if (error || !data || data.length === 0) {
    return 0;
  }

  const sum = data.reduce((acc, item) => acc + item.rating, 0);
  return sum / data.length;
}

/**
 * Get rating count for a product
 */
export async function getRatingCount(productId: string): Promise<number> {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (error) {
    return 0;
  }

  return data?.length || 0;
}

/**
 * Get user's rating for a product
 */
export async function getUserRating(
  productId: string,
  userId: string
): Promise<ProductRating | null> {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("*")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ProductRating;
}

/**
 * Get all ratings for a product with user info
 */
export async function getProductRatings(
  productId: string
): Promise<ProductRating[]> {
  const { data, error } = await supabase
    .from("product_ratings")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    // If join fails, try without profiles
    const { data: ratingsData } = await supabase
      .from("product_ratings")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    
    if (ratingsData) {
      return ratingsData as any;
    }
    return [];
  }

  return data as any;
}

/**
 * Submit or update a rating
 */
export async function submitRating(
  productId: string,
  userId: string,
  rating: number,
  review?: string
): Promise<{ success: boolean; error?: string }> {
  // Check if user already rated this product
  const existing = await getUserRating(productId, userId);

  if (existing) {
    // Update existing rating
    const { error } = await supabase
      .from("product_ratings")
      .update({
        rating,
        review: review || null,
      })
      .eq("id", existing.id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Insert new rating
    const { error } = await supabase.from("product_ratings").insert({
      product_id: productId,
      user_id: userId,
      rating,
      review: review || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true };
}

/**
 * Delete a rating
 */
export async function deleteRating(
  productId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("product_ratings")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get rating distribution (how many 1-star, 2-star, etc.)
 */
export async function getRatingDistribution(
  productId: string
): Promise<Record<number, number>> {
  const { data, error } = await supabase
    .from("product_ratings")
    .select("rating")
    .eq("product_id", productId);

  if (error || !data) {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.forEach((item) => {
    distribution[item.rating as keyof typeof distribution]++;
  });

  return distribution;
}

