import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import { CATEGORY_ICONS } from "@/data/products";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, user } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onOpenChange(false);
    if (!user) {
      toast.error("Please login to proceed to checkout");
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 items-start">
                  <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                    {CATEGORY_ICONS[product.category] || "✨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateCartQuantity(product.id, quantity - 1)} className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-secondary">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <button onClick={() => updateCartQuantity(product.id, quantity + 1)} className="h-6 w-6 rounded-full border flex items-center justify-center hover:bg-secondary">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{(product.price * quantity).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(product.id)} className="mt-1 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <Button className="w-full rounded-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
