import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Minus, Plus, Star, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/StarRating";
import {
  getAverageRating,
  getRatingCount,
  getUserRating,
  getProductRatings,
  submitRating,
  deleteRating,
  getRatingDistribution,
  type ProductRating,
} from "@/lib/ratings";
import { formatPriceSimple } from "@/lib/currency";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  categories: { name: string };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState<ProductRating | null>(null);
  const [reviews, setReviews] = useState<ProductRating[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  });
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkWishlist(session.user.id);
          fetchUserRating(session.user.id);
        }
      });
      fetchRatings();
    }
  }, [id]);

  const fetchRatings = async () => {
    if (!id) return;
    const [avgRating, count, allReviews, distribution] = await Promise.all([
      getAverageRating(id),
      getRatingCount(id),
      getProductRatings(id),
      getRatingDistribution(id),
    ]);
    setAverageRating(avgRating);
    setRatingCount(count);
    setReviews(allReviews);
    setRatingDistribution(distribution);
  };

  const fetchUserRating = async (userId: string) => {
    if (!id) return;
    const rating = await getUserRating(id, userId);
    if (rating) {
      setUserRating(rating);
      setSelectedRating(rating.rating);
      setReviewText(rating.review || "");
    }
  };

  const fetchProduct = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, categories(name)")
      .eq("id", id)
      .single();
    
    if (data) setProduct(data as any);
  };

  const checkWishlist = async (userId: string) => {
    const { data } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", id)
      .single();
    
    setIsInWishlist(!!data);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: id,
        quantity
      });
    }

    toast({ title: "Added to cart!" });
    navigate("/cart");
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isInWishlist) {
      await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);
      
      setIsInWishlist(false);
      toast({ title: "Removed from wishlist" });
    } else {
      await supabase.from("wishlist_items").insert({
        user_id: user.id,
        product_id: id
      });
      
      setIsInWishlist(true);
      toast({ title: "Added to wishlist!" });
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!id) return;

    if (selectedRating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await submitRating(id, user.id, selectedRating, reviewText);
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: userRating ? "Review updated!" : "Review submitted!" });
      setShowReviewForm(false);
      await fetchRatings();
      await fetchUserRating(user.id);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async () => {
    if (!user || !id) return;

    const result = await deleteRating(id, user.id);
    if (result.success) {
      toast({ title: "Review deleted" });
      setUserRating(null);
      setSelectedRating(0);
      setReviewText("");
      await fetchRatings();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <Badge className="w-fit mb-2">{product.categories?.name}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating Display */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} size="md" showValue={averageRating > 0} />
                {ratingCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>
            </div>

            <p className="text-4xl font-bold text-primary mb-6">
              {formatPriceSimple(product.price)}
            </p>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            {product.stock < 10 && product.stock > 0 && (
              <p className="text-destructive mb-4">Only {product.stock} left in stock!</p>
            )}
            
            {product.stock === 0 && (
              <Badge variant="destructive" className="w-fit mb-4">Out of Stock</Badge>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
            {user && (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {userRating ? "Edit Review" : "Write a Review"}
              </Button>
            )}
          </div>

          {/* Rating Summary */}
          {ratingCount > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Rating Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                      <StarRating rating={averageRating} size="md" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0;
                      const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-sm w-8">{star} star</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Form */}
          {showReviewForm && user && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{userRating ? "Edit Your Review" : "Write a Review"}</CardTitle>
                <CardDescription>
                  Share your experience with this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Rating *</Label>
                  <StarRating
                    rating={selectedRating}
                    interactive={true}
                    onRatingChange={setSelectedRating}
                    size="lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Tell others about your experience with this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || selectedRating === 0}
                  >
                    {isSubmitting ? "Submitting..." : userRating ? "Update Review" : "Submit Review"}
                  </Button>
                  {userRating && (
                    <Button
                      variant="destructive"
                      onClick={handleDeleteReview}
                    >
                      Delete Review
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      if (userRating) {
                        setSelectedRating(userRating.rating);
                        setReviewText(userRating.review || "");
                      } else {
                        setSelectedRating(0);
                        setReviewText("");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          {review.profiles?.full_name || review.profiles?.email || "Anonymous"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    {review.review && (
                      <p className="text-sm mt-3 text-muted-foreground">{review.review}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No reviews yet</p>
                {user && (
                  <Button onClick={() => setShowReviewForm(true)}>
                    Be the first to review
                  </Button>
                )}
                {!user && (
                  <Button onClick={() => navigate("/auth")}>
                    Sign in to write a review
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
