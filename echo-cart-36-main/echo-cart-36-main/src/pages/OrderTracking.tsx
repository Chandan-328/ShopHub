import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  ArrowLeft,
} from "lucide-react";
import { formatPriceSimple } from "@/lib/currency";

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

interface TrackingStep {
  status: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  date?: string;
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchOrderId, setSearchOrderId] = useState(orderId || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error: fetchError } = await supabase
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
        .eq("id", id)
        .eq("user_id", session.user.id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setOrder(data as any);
      } else {
        setError("Order not found");
      }
    } catch (err: any) {
      console.error("Error fetching order:", err);
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchOrderId) {
      navigate(`/order-tracking/${searchOrderId}`);
      fetchOrder(searchOrderId);
    }
  };

  const getTrackingSteps = (status: string, createdDate: string): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        status: "pending",
        label: "Order Placed",
        description: "Your order has been received",
        icon: <Package className="h-5 w-5" />,
        completed: true,
        date: createdDate,
      },
      {
        status: "processing",
        label: "Processing",
        description: "We're preparing your order",
        icon: <Clock className="h-5 w-5" />,
        completed: ["processing", "shipped", "completed"].includes(status),
        date: ["processing", "shipped", "completed"].includes(status)
          ? new Date(createdDate).toLocaleDateString()
          : undefined,
      },
      {
        status: "shipped",
        label: "Shipped",
        description: "Your order is on the way",
        icon: <Truck className="h-5 w-5" />,
        completed: ["shipped", "completed"].includes(status),
        date: ["shipped", "completed"].includes(status)
          ? new Date(createdDate).toLocaleDateString()
          : undefined,
      },
      {
        status: "completed",
        label: "Delivered",
        description: "Your order has been delivered",
        icon: <CheckCircle className="h-5 w-5" />,
        completed: status === "completed",
        date: status === "completed" ? new Date(createdDate).toLocaleDateString() : undefined,
      },
    ];

    if (status === "cancelled") {
      steps.push({
        status: "cancelled",
        label: "Cancelled",
        description: "Your order has been cancelled",
        icon: <XCircle className="h-5 w-5" />,
        completed: true,
        date: new Date(createdDate).toLocaleDateString(),
      });
    }

    return steps;
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

  if (!orderId && !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Order</CardTitle>
              <CardDescription>Enter your order number to track your order status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="orderId"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    placeholder="Enter order ID"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/account")}>
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">
                {error || "Order not found"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/account")}>
                  View All Orders
                </Button>
                <Button onClick={() => navigate("/")}>Go Home</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status, order.created_at);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/account")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

        {/* Order Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
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
        </Card>

        {/* Tracking Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Track your order progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trackingSteps.map((step, index) => (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-3 ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.icon}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.completed ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-semibold ${step.completed ? "" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                      {step.date && (
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
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
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  {formatPriceSimple(order.total_amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;

