import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogOut, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCounts(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchCounts(session.user.id);
      } else {
        setCartCount(0);
        setWishlistCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCounts = async (userId: string) => {
    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("*", { count: "exact" })
      .eq("user_id", userId);
    
    const { data: wishlistItems } = await supabase
      .from("wishlist_items")
      .select("*", { count: "exact" })
      .eq("user_id", userId);
    
    setCartCount(cartItems?.length || 0);
    setWishlistCount(wishlistItems?.length || 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/favicon.png"
              alt="ShopHub logo"
              className="h-10 w-10 rounded-md object-cover"
            />
            <div className="leading-tight">
              <span className="block text-xl font-semibold tracking-wide">ShopHub</span>
              <span className="block text-xs text-muted-foreground uppercase tracking-[0.2em]">
                Easy Shop
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/search")}
            >
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
