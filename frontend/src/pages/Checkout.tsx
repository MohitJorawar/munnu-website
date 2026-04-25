import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import { CATEGORY_ICONS } from "@/data/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Credit / Debit Card" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, addOrder } = useStore();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center space-y-4">
        <p className="text-muted-foreground">Your cart is empty</p>
        <Link to="/"><Button variant="outline" className="rounded-full">Back to Shop</Button></Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center space-y-4 px-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="font-display text-2xl font-semibold">Order Placed!</h1>
        <p className="text-muted-foreground text-sm max-w-sm">
          Thank you for your order. We'll notify you once it's on its way.
        </p>
        <Link to="/"><Button className="rounded-full mt-4">Continue Shopping</Button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!name.trim()) { toast.error("Please enter your name"); return; }
    if (!phone.trim() || phone.length < 10) { toast.error("Please enter a valid phone number"); return; }
    if (!address.trim()) { toast.error("Please enter your address"); return; }

    const success = await addOrder({
      items: [...cart],
      total: cartTotal,
      status: "pending",
      paymentMethod: PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || paymentMethod,
      customerName: name,
      customerPhone: phone,
    });

    if (success) {
      clearCart();
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } else {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center gap-3">
          <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="font-display text-xl font-semibold">Checkout</h1>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Left: Form */}
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">Delivery Details</h2>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit phone" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all text-center",
                      paymentMethod === m.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <m.icon className={cn("h-6 w-6", paymentMethod === m.id ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-2">
            <div className="rounded-xl border bg-card p-6 space-y-4 sticky top-24">
              <h2 className="font-display text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-lg shrink-0">
                      {CATEGORY_ICONS[product.category] || "✨"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">×{quantity}</p>
                    </div>
                    <p className="text-sm font-medium">₹{(product.price * quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <Button className="w-full rounded-full" size="lg" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
