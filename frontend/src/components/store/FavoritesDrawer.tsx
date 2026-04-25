import { Heart, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { CATEGORY_ICONS } from "@/data/products";

interface FavoritesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesDrawer({ open, onOpenChange }: FavoritesDrawerProps) {
  const { products, favorites, toggleFavorite, addToCart } = useStore();
  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Favorites</SheetTitle>
        </SheetHeader>

        {favProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No favorites yet</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {favProducts.map(product => (
              <div key={product.id} className="flex gap-3 items-center">
                <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
                  {CATEGORY_ICONS[product.category] || "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">₹{product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => { addToCart(product); }} className="h-8 w-8">
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => toggleFavorite(product.id)} className="h-8 w-8 text-primary">
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
