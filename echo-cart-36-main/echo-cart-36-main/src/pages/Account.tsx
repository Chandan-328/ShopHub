import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Mail,
  Calendar,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { formatPriceSimple } from "@/lib/currency";

type AccountSection = "profile" | "orders" | "wishlist" | "settings";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string | null;
    };
  }[];
}

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

const Account = () => {
  const [activeSection, setActiveSection] = useState<AccountSection>("profile");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Settings state
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("INR");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
      fetchOrders(session.user.id);
      fetchWishlistItems(session.user.id);
      loadSettings();
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (data) setProfile(data);
  };

  const fetchOrders = async (userId: string) => {
    const { data } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) setOrders(data as any);
  };

  const fetchWishlistItems = async (userId: string) => {
    const { data } = await supabase
      .from("wishlist_items")
      .select("*, products(*, categories(name))")
      .eq("user_id", userId);
    
    if (data) setWishlistItems(data as any);
  };

  const loadSettings = () => {
    const savedLanguage = localStorage.getItem("account_language") || "en";
    const savedCurrency = localStorage.getItem("account_currency") || "INR";
    const savedEmailNotifications = localStorage.getItem("account_email_notifications") !== "false";
    const savedMarketingEmails = localStorage.getItem("account_marketing_emails") === "true";
    
    setLanguage(savedLanguage);
    setCurrency(savedCurrency);
    setEmailNotifications(savedEmailNotifications);
    setMarketingEmails(savedMarketingEmails);
  };

  const saveSettings = () => {
    localStorage.setItem("account_language", language);
    localStorage.setItem("account_currency", currency);
    localStorage.setItem("account_email_notifications", emailNotifications.toString());
    localStorage.setItem("account_marketing_emails", marketingEmails.toString());
    toast({ title: "Settings saved successfully!" });
  };

  const updateProfile = async () => {
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
        })
        .eq("user_id", user.id);
      
      if (error) throw error;
      toast({ title: "Profile updated successfully!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast({ title: "Logged out successfully" });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const sidebarItems = [
    { id: "profile" as AccountSection, label: "Profile", icon: User },
    { id: "orders" as AccountSection, label: "Orders", icon: Package },
    { id: "wishlist" as AccountSection, label: "Wishlist", icon: Heart },
    { id: "settings" as AccountSection, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64">
            <Card>
              <CardHeader>
                <CardTitle>My Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <Separator />
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-3 px-6 py-3 text-left text-destructive hover:bg-accent transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1">
            {activeSection === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile?.full_name || ""}
                      onChange={(e) =>
                        setProfile(profile ? { ...profile, full_name: e.target.value } : null)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || user?.email || ""}
                      onChange={(e) =>
                        setProfile(profile ? { ...profile, email: e.target.value } : null)
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Member since: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <Button onClick={updateProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeSection === "orders" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View all your past orders</CardDescription>
                  </CardHeader>
                </Card>
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                      <Button onClick={() => navigate("/")}>Start Shopping</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                              <CardDescription>
                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                                <img
                                  src={item.products.image_url || "/placeholder.svg"}
                                  alt={item.products.name}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.products.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × {formatPriceSimple(item.price)}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  {formatPriceSimple(item.quantity * item.price)}
                                </p>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t">
                              <span className="font-semibold">Total Amount</span>
                              <span className="text-xl font-bold text-primary">
                                {formatPriceSimple(order.total_amount)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "wishlist" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>Products you've saved for later</CardDescription>
                  </CardHeader>
                </Card>
                {wishlistItems.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
            )}

            {activeSection === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your orders
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive promotional emails and special offers
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                  </div>

                  <Button onClick={saveSettings} className="w-full">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Account;

