import { useState, useMemo } from "react";
import { X, ShoppingBag, Heart, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from "@/data/products";

// ─── The 8 display "super-categories" with their subcategories ────────────────
// Sub-categories here are informational labels — actual filtering is done by
// real product categories from the store (admin can add anything).
const DISPLAY_GROUPS = [
  { id: "all",         emoji: "🛍️",  label: "All Products",        subs: [] },
  { id: "jewellery",   emoji: "✨",   label: "Jewellery",           color: "from-rose-100 to-pink-200",    subs: ["Necklaces","Earrings","Bracelets & Kadas","Rings","Anti-Tarnish Jewellery","Daily Wear Jewellery"] },
  { id: "hair",        emoji: "🎀",   label: "Hair Accessories",    color: "from-purple-100 to-pink-100",  subs: ["Scrunchies","Claw Clips","Hair Bands","Hair Bows"] },
  { id: "hampers",     emoji: "🎁",   label: "Gift Hampers",        color: "from-amber-100 to-orange-100", subs: ["Women's Day Hampers","Birthday Hampers","Custom Gift Hampers","Budget Hampers","Couple Hampers"] },
  { id: "posters",     emoji: "🖼️",  label: "Posters & Wall Decor",color: "from-teal-100 to-cyan-100",    subs: ["Motivational Posters","Anime Posters","Aesthetic Posters","Celebrity Posters","Car & Bike Posters"] },
  { id: "custom",      emoji: "🎨",   label: "Customized Gifts",    color: "from-violet-100 to-purple-100",subs: ["Customized Hampers","Personalized Jewellery","Name Gifts","Photo Gifts"] },
  { id: "combos",      emoji: "💝",   label: "Combos & Offers",     color: "from-red-100 to-rose-100",     subs: ["Buy 2 Deals","Bundle Offers","Limited Time Offers","Festival Combos"] },
  { id: "new",         emoji: "🔥",   label: "New Arrivals",        color: "from-orange-100 to-red-100",   subs: [] },
  { id: "bestsellers", emoji: "⭐",   label: "Best Sellers",        color: "from-yellow-100 to-amber-100", subs: [] },
];

interface CategoryShopModalProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryShopModal({ open, onClose }: CategoryShopModalProps) {
  const { products, categories, addToCart, toggleFavorite, isFavorite } = useStore();

  const [activeGroupId, setActiveGroupId] = useState("all");
  const [activeCat, setActiveCat]         = useState<string | null>(null); // real store category filter
  const [activeSub, setActiveSub]         = useState<string | null>(null); // display sub-label
  const [search, setSearch]               = useState("");

  const activeGroup = DISPLAY_GROUPS.find(g => g.id === activeGroupId)!;

  // Build a mapping: group-id → which real store categories belong to it.
  // We do a loose keyword match so admin categories like "Jewelry" or "Earrings" fall under ✨ Jewellery.
  const GROUP_KEYWORDS: Record<string, string[]> = {
    jewellery:   ["jewel", "jewelry", "jewellery", "necklace", "earring", "bracelet", "kada", "ring", "pendant", "tarnish"],
    hair:        ["hair", "scrunchie", "claw", "clip", "band", "bow"],
    hampers:     ["hamper", "gift", "basket"],
    posters:     ["poster", "wall", "decor", "print", "art"],
    custom:      ["custom", "personaliz", "name gift", "photo"],
    combos:      ["combo", "bundle", "deal", "offer", "set"],
    new:         [],   // show all (newest logic — just show everything)
    bestsellers: [],   // show all
  };

  // Which real store categories map to the active group
  const groupStoreCats = useMemo(() => {
    if (activeGroupId === "all" || activeGroupId === "new" || activeGroupId === "bestsellers") {
      return categories; // show all
    }
    const keywords = GROUP_KEYWORDS[activeGroupId] ?? [];
    if (keywords.length === 0) return categories;
    return categories.filter(c =>
      keywords.some(kw => c.toLowerCase().includes(kw))
    );
  }, [activeGroupId, categories]);

  // Final filtered products
  const filtered = useMemo(() => {
    return products.filter(p => {
      // Group filter
      const groupMatch = groupStoreCats.includes(p.category);
      // Specific store-category filter (sidebar real-category pill)
      const catMatch = activeCat ? p.category === activeCat : true;
      // Search
      const searchMatch = search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return groupMatch && catMatch && searchMatch;
    });
  }, [products, groupStoreCats, activeCat, search]);

  if (!open) return null;

  const gradientColor = ("color" in activeGroup ? (activeGroup as { color?: string }).color : undefined) ?? "from-pink-50 to-rose-100";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl w-full mx-auto my-0 md:my-6 md:rounded-2xl bg-background shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card flex-shrink-0">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Shop by Category</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Browse all categories · Add directly to cart</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCat(null); }}
                className="pl-9 pr-4 py-2 text-sm rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary w-52"
              />
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-full flex items-center justify-center border hover:bg-accent transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left sidebar ── */}
          <aside className="w-56 flex-shrink-0 border-r bg-card/50 overflow-y-auto hidden sm:flex flex-col">
            {/* Display groups */}
            <div className="py-2">
              <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Browse</p>
              {DISPLAY_GROUPS.map(group => (
                <button
                  key={group.id}
                  onClick={() => { setActiveGroupId(group.id); setActiveCat(null); setActiveSub(null); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2.5",
                    activeGroupId === group.id
                      ? "bg-primary/10 text-primary border-l-2 border-l-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <span className="text-base leading-none">{group.emoji}</span>
                  <span className="leading-tight truncate">{group.label}</span>
                  {activeGroupId === group.id && <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Real store categories (dynamic from admin) */}
            {categories.length > 0 && (
              <div className="border-t py-2 mt-1">
                <p className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Store Categories</p>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCat(activeCat === cat ? null : cat); setActiveGroupId("all"); setActiveSub(null); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2",
                      activeCat === cat
                        ? "bg-primary/10 text-primary font-medium border-l-2 border-l-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <span className="text-sm">{CATEGORY_ICONS[cat] ?? "🏷️"}</span>
                    <span className="truncate">{cat}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {products.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 overflow-y-auto">

            {/* Category banner */}
            <div className={cn("px-6 py-5 bg-gradient-to-r", gradientColor)}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{activeGroup.emoji}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {activeCat ?? activeGroup.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Mobile: group switcher */}
              <div className="flex gap-2 overflow-x-auto sm:hidden pb-1 mb-2">
                {DISPLAY_GROUPS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { setActiveGroupId(g.id); setActiveCat(null); setActiveSub(null); }}
                    className={cn(
                      "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      activeGroupId === g.id ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                    )}
                  >
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>

              {/* Subcategory pills (display labels, not real filter — just UX decoration) */}
              {activeGroup.subs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveSub(null)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      activeSub === null ? "bg-primary text-primary-foreground shadow-sm" : "bg-card/80 text-muted-foreground hover:bg-card"
                    )}
                  >All</button>
                  {activeGroup.subs.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setActiveSub(activeSub === sub ? null : sub)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        activeSub === sub ? "bg-primary text-primary-foreground shadow-sm" : "bg-card/80 text-muted-foreground hover:bg-card"
                      )}
                    >{sub}</button>
                  ))}
                </div>
              )}

              {/* Real store category pills (shown when "All Products" or group selected) */}
              {groupStoreCats.length > 0 && activeGroup.subs.length === 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    onClick={() => setActiveCat(null)}
                    className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                      activeCat === null ? "bg-primary text-primary-foreground shadow-sm" : "bg-card/80 text-muted-foreground hover:bg-card"
                    )}
                  >All</button>
                  {groupStoreCats.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(activeCat === cat ? null : cat)}
                      className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        activeCat === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-card/80 text-muted-foreground hover:bg-card"
                      )}
                    >
                      {CATEGORY_ICONS[cat] ?? "🏷️"} {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Grid ── */}
            <div className="p-6">
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🛍️</div>
                  <p className="text-sm font-medium">No products found</p>
                  <p className="text-xs mt-1 text-muted-foreground/70">
                    Try a different category or clear your search.
                  </p>
                  {search && (
                    <button onClick={() => setSearch("")} className="mt-3 text-xs text-primary underline">
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((product, i) => {
                    const fav = isFavorite(product.id);
                    const gradient = CATEGORY_GRADIENTS[product.category] ?? "from-muted to-secondary";
                    const icon     = CATEGORY_ICONS[product.category]     ?? "✨";
                    return (
                      <div key={product.id} className="group animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="relative overflow-hidden rounded-xl bg-card shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5">
                          {/* Image */}
                          <div className={cn("relative aspect-square bg-gradient-to-br flex items-center justify-center", gradient)}>
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-5xl">{icon}</span>
                            )}
                            {/* Favourite */}
                            <button
                              onClick={() => toggleFavorite(product.id)}
                              className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                            >
                              <Heart className={cn("h-4 w-4 transition-colors", fav ? "fill-primary text-primary" : "text-muted-foreground")} />
                            </button>
                            {/* Out of stock */}
                            {!product.inStock && (
                              <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                                <span className="rounded-full bg-card px-3 py-1 text-xs font-medium">Out of Stock</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-3.5 space-y-1.5">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{product.category}</span>
                            <h3 className="font-display text-sm font-medium leading-snug text-foreground">{product.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between pt-1.5">
                              <span className="font-display text-base font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
                              <Button
                                size="sm"
                                disabled={!product.inStock}
                                onClick={() => addToCart(product)}
                                className="rounded-full gap-1.5 text-xs h-8"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
