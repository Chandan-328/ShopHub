import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { getAverageRating, getRatingCount } from "@/lib/ratings";
import { formatPriceSimple } from "@/lib/currency";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductCard = ({ id, name, price, image, category, stock }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkWishlist(session.user.id);
      }
    });
    fetchRatings();
  }, [id]);

  const fetchRatings = async () => {
    const [avgRating, count] = await Promise.all([
      getAverageRating(id),
      getRatingCount(id),
    ]);
    setAverageRating(avgRating);
    setRatingCount(count);
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
        .update({ quantity: existing.quantity + 1 })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: id,
        quantity: 1
      });
    }

    toast({ title: "Added to cart!" });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => navigate(`/product/${id}`)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} />
          </Button>
          {stock < 10 && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              Only {stock} left
            </Badge>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase">{category}</p>
          <h3 className="font-semibold mt-1 line-clamp-2">{name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={averageRating} size="sm" showValue={averageRating > 0} />
            {ratingCount > 0 && (
              <span className="text-xs text-muted-foreground">({ratingCount})</span>
            )}
          </div>
          <p className="text-2xl font-bold text-primary mt-2">{formatPriceSimple(price)}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
