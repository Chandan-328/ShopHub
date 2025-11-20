import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WishlistItem {
  id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
    categories: { name: string };
  };
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchWishlistItems(session.user.id);
    });
  }, [navigate]);

  const fetchWishlistItems = async (userId: string) => {
    const { data } = await supabase
      .from("wishlist_items")
      .select("*, products(*, categories(name))")
      .eq("user_id", userId);
    
    if (data) setWishlistItems(data as any);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
              <Button onClick={() => navigate("/")}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.products.id}
                name={item.products.name}
                price={item.products.price}
                image={item.products.image_url}
                category={item.products.categories?.name || ""}
                stock={item.products.stock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
