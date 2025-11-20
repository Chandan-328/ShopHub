import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatPriceSimple } from "@/lib/currency";

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  paymentMethod: z.enum(["credit_card", "paypal", "bank_transfer", "cash_on_delivery"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine((data) => {
  if (data.paymentMethod === "credit_card") {
    return data.cardNumber && data.cardName && data.expiryDate && data.cvv;
  }
  return true;
}, {
  message: "Credit card details are required",
  path: ["cardNumber"],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "credit_card",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchCartItems(session.user.id);
    });
  }, [navigate]);

  const fetchCartItems = async (userId: string) => {
    const { data } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", userId);
    
    if (data) {
      setCartItems(data as any);
      if (data.length === 0) {
        navigate("/cart");
      }
    }
  };

  const validateStock = () => {
    const stockErrors: string[] = [];
    cartItems.forEach((item) => {
      if (item.products.stock < item.quantity) {
        stockErrors.push(
          `${item.products.name} only has ${item.products.stock} items in stock`
        );
      }
    });
    return stockErrors;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    setErrors([]);

    // Validate stock
    const stockErrors = validateStock();
    if (stockErrors.length > 0) {
      setErrors(stockErrors);
      setLoading(false);
      return;
    }

    try {
      // Calculate total with tax (prices are already in INR)
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.products.price * item.quantity,
        0
      );
      const tax = Math.round(subtotal * 0.18); // 18% GST
      const finalTotal = subtotal + tax;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: finalTotal,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw orderError;
      }

      // Create order items - ensure we're using the correct order_id
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price: item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        // If order items fail, try to delete the order to maintain consistency
        await supabase.from("orders").delete().eq("id", order.id);
        
        // Provide helpful error message for RLS policy errors
        if (itemsError.message?.includes("row-level security policy") || itemsError.message?.includes("RLS")) {
          throw new Error(
            "Database security policy error. You MUST run SQL in Supabase to fix this. " +
            "Open SIMPLE_FIX.sql file, copy the SQL, paste it in Supabase SQL Editor, and click Run. " +
            "See STEP_BY_STEP_FIX.md for detailed instructions."
          );
        }
        throw itemsError;
      }

      // Store shipping and payment info (you might want to add these fields to orders table)
      const orderDetails = {
        orderId: order.id,
        shipping: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        payment: {
          method: data.paymentMethod,
          cardNumber: data.cardNumber ? data.cardNumber.replace(/\s/g, "").slice(-4) : undefined,
        },
      };

      // Store in localStorage temporarily (in production, store in database)
      localStorage.setItem(`order_${order.id}`, JSON.stringify(orderDetails));

      // Clear cart
      for (const item of cartItems) {
        await supabase.from("cart_items").delete().eq("id", item.id);
      }

      // Navigate to confirmation page
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrors([error.message || "Failed to process order. Please try again."]);
      toast({
        title: "Error",
        description: error.message || "Failed to process order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );

  const subtotal = total;
  const shipping = 0; // Free shipping
  const tax = Math.round(total * 0.18); // 18% GST
  const finalTotal = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
                {errors.some(e => e.includes("RLS policy") || e.includes("row-level security")) && (
                  <div className="mt-4 p-4 bg-destructive/10 rounded border border-destructive/20">
                    <p className="font-semibold mb-2">How to Fix This Error:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Go to <strong>Supabase Dashboard</strong> → <strong>SQL Editor</strong></li>
                      <li>Open the file <strong>SIMPLE_FIX.sql</strong> in this project</li>
                      <li>Copy ALL the SQL code</li>
                      <li>Paste it into Supabase SQL Editor</li>
                      <li>Click <strong>"Run"</strong> button</li>
                      <li>Refresh this page and try again</li>
                    </ol>
                    <p className="text-xs mt-2 text-muted-foreground">
                      This is a one-time database setup that must be done in Supabase.
                    </p>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="John"
                      />
                      {formErrors.firstName && (
                        <p className="text-sm text-destructive">
                          {formErrors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Doe"
                      />
                      {formErrors.lastName && (
                        <p className="text-sm text-destructive">
                          {formErrors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive">
                        {formErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+1 (555) 123-4567"
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-destructive">
                        {formErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="123 Main St"
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive">
                        {formErrors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="New York"
                      />
                      {formErrors.city && (
                        <p className="text-sm text-destructive">
                          {formErrors.city.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="NY"
                      />
                      {formErrors.state && (
                        <p className="text-sm text-destructive">
                          {formErrors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        {...register("zipCode")}
                        placeholder="10001"
                      />
                      {formErrors.zipCode && (
                        <p className="text-sm text-destructive">
                          {formErrors.zipCode.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        placeholder="United States"
                      />
                      {formErrors.country && (
                        <p className="text-sm text-destructive">
                          {formErrors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => {
                      setValue("paymentMethod", value as "credit_card" | "paypal" | "bank_transfer" | "cash_on_delivery");
                    }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        Credit Card
                      </Label>
                    </div>

                    {paymentMethod === "credit_card" && (
                      <div className="ml-6 space-y-4 border-l-2 pl-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            {...register("cardNumber")}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {formErrors.cardNumber && (
                            <p className="text-sm text-destructive">
                              {formErrors.cardNumber.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name *</Label>
                          <Input
                            id="cardName"
                            {...register("cardName")}
                            placeholder="John Doe"
                          />
                          {formErrors.cardName && (
                            <p className="text-sm text-destructive">
                              {formErrors.cardName.message}
                            </p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              {...register("expiryDate")}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {formErrors.expiryDate && (
                              <p className="text-sm text-destructive">
                                {formErrors.expiryDate.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              {...register("cvv")}
                              placeholder="123"
                              maxLength={4}
                              type="password"
                            />
                            {formErrors.cvv && (
                              <p className="text-sm text-destructive">
                                {formErrors.cvv.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        PayPal
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-5 w-5" />
                        Bank Transfer
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                      <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-5 w-5" />
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                  {formErrors.paymentMethod && (
                    <p className="text-sm text-destructive mt-2">
                      {formErrors.paymentMethod.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.products.name} × {item.quantity}
                        </span>
                        <span>{formatPriceSimple(item.products.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPriceSimple(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPriceSimple(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPriceSimple(finalTotal)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/cart")}
                  >
                    Back to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

