import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";
import { useStore } from "@/context/StoreContext";
import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite(product.id);
  const gradient = CATEGORY_GRADIENTS[product.category] || "from-muted to-secondary";
  const icon = CATEGORY_ICONS[product.category] || "✨";

  return (
    <div
      className="group animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl bg-card shadow-sm border transition-shadow hover:shadow-md">
        {/* Image area */}
        <div className={cn("relative aspect-square bg-gradient-to-br", gradient, "flex items-center justify-center")}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-5xl">{icon}</span>
          )}

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
          >
            <Heart className={cn("h-4 w-4 transition-colors", fav ? "fill-primary text-primary" : "text-muted-foreground")} />
          </button>

          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
              <span className="rounded-full bg-card px-4 py-1.5 text-xs font-medium text-foreground">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{product.category}</span>
          <h3 className="font-display text-base font-medium leading-snug text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-lg font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
            <Button
              size="sm"
              disabled={!product.inStock}
              onClick={() => addToCart(product)}
              className="rounded-full gap-1.5 text-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
