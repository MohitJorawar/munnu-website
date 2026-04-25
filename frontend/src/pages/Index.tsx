import { useState } from "react";
import { Header } from "@/components/store/Header";
import { HeroSection } from "@/components/store/HeroSection";
import { ProductCard } from "@/components/store/ProductCard";
import { AboutSection } from "@/components/store/AboutSection";
import { ContactSection } from "@/components/store/ContactSection";
import { Footer } from "@/components/store/Footer";
import { CategoryShopModal } from "@/components/store/CategoryShopModal";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

// The 8 branded categories (with emoji + label) shown as filter pills
const SHOP_FILTER_GROUPS = [
  { label: "All",                  emoji: "🛍️", keywords: [] },
  { label: "Jewellery",            emoji: "✨",  keywords: ["jewel","jewelry","jewellery","necklace","earring","bracelet","kada","ring","pendant","tarnish"] },
  { label: "Hair Accessories",     emoji: "🎀",  keywords: ["hair","scrunchie","claw","clip","band","bow"] },
  { label: "Gift Hampers",         emoji: "🎁",  keywords: ["hamper","gift","basket"] },
  { label: "Posters & Wall Decor", emoji: "🖼️", keywords: ["poster","wall","decor","print","art"] },
  { label: "Customized Gifts",     emoji: "🎨",  keywords: ["custom","personaliz","name gift","photo"] },
  { label: "Combos & Offers",      emoji: "💝",  keywords: ["combo","bundle","deal","offer","set"] },
  { label: "New Arrivals",         emoji: "🔥",  keywords: [] },
  { label: "Best Sellers",         emoji: "⭐",  keywords: [] },
];

const Index = () => {
  const { products, categories } = useStore();
  const [activeFilter, setActiveFilter] = useState("All");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Filter products by selected group
  const filtered = (() => {
    if (activeFilter === "All") return products;
    const group = SHOP_FILTER_GROUPS.find(g => g.label === activeFilter);
    if (!group || group.keywords.length === 0) return products; // New Arrivals / Best Sellers → show all
    return products.filter(p =>
      group.keywords.some(kw => p.category.toLowerCase().includes(kw))
    );
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection onOpenCategoryShop={() => setCategoryModalOpen(true)} />

      <section id="shop" className="py-16 md:py-24 bg-background flex-1">
        <div className="container">
          {/* Heading */}
          <div className="text-center space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Our Collections</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Shop by Category</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Each piece is uniquely handcrafted — no two are ever the same.
            </p>
          </div>

          {/* Category filter pills — the 8 branded categories */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            {SHOP_FILTER_GROUPS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => setActiveFilter(label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all border",
                  activeFilter === label
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground hover:bg-accent"
                )}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24 space-y-3 text-muted-foreground">
              <p className="text-4xl">🛍️</p>
              <p className="text-base font-medium">No products in this category yet.</p>
              <p className="text-sm">Check back soon or explore another category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection />
      <ContactSection />
      <Footer />

      <CategoryShopModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
};

export default Index;
