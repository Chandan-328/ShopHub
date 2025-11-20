import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
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

interface OrderDetails {
  orderId: string;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    method: string;
    cardNumber?: string;
  };
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    fetchOrder();
    loadOrderDetails();
  }, [orderId, navigate]);

  const fetchOrder = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
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
        .eq("id", orderId)
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      if (data) setOrder(data as any);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetails = () => {
    if (!orderId) return;
    const stored = localStorage.getItem(`order_${orderId}`);
    if (stored) {
      setOrderDetails(JSON.parse(stored));
    }
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

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Order not found</p>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We've received your order and will process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg text-primary">
                  {formatPriceSimple(order.total_amount)}
                </p>
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
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {orderDetails.shipping.firstName} {orderDetails.shipping.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.shipping.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.shipping.city}, {orderDetails.shipping.state}{" "}
                    {orderDetails.shipping.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.shipping.country}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Phone: {orderDetails.shipping.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {orderDetails.shipping.email}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Information */}
          {orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    Payment Method: {getPaymentMethodName(orderDetails.payment.method)}
                  </p>
                  {orderDetails.payment.cardNumber && (
                    <p className="text-sm text-muted-foreground">
                      Card ending in: {orderDetails.payment.cardNumber}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
              <CardDescription>Track your order status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">
                      We're preparing your order for shipment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-2">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be shipped once processing is complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link to={`/order-tracking/${order.id}`}>
                Track Order
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate("/account")}>
              View All Orders
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

