import { Product } from "@/types/store";

// ─── The 8 branded categories ────────────────────────────────────────────────
export const DEFAULT_CATEGORIES = [
  "Jewellery",
  "Hair Accessories",
  "Gift Hampers",
  "Posters & Wall Decor",
  "Customized Gifts",
  "Combos & Offers",
  "New Arrivals",
  "Best Sellers",
] as const;

export const CATEGORIES = ["All", ...DEFAULT_CATEGORIES] as const;

// Gradient placeholders for product images
export const CATEGORY_GRADIENTS: Record<string, string> = {
  "Jewellery":            "from-rose-200 to-pink-100",
  "Hair Accessories":     "from-purple-100 to-pink-200",
  "Gift Hampers":         "from-amber-100 to-orange-200",
  "Posters & Wall Decor": "from-teal-100 to-cyan-200",
  "Customized Gifts":     "from-violet-100 to-purple-200",
  "Combos & Offers":      "from-red-100 to-rose-200",
  "New Arrivals":         "from-orange-100 to-red-100",
  "Best Sellers":         "from-yellow-100 to-amber-200",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "Jewellery":            "✨",
  "Hair Accessories":     "🎀",
  "Gift Hampers":         "🎁",
  "Posters & Wall Decor": "🖼️",
  "Customized Gifts":     "🎨",
  "Combos & Offers":      "💝",
  "New Arrivals":         "🔥",
  "Best Sellers":         "⭐",
};

export const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Rose Quartz Pendant",
    price: 1250,
    description: "Handcrafted rose quartz pendant on a delicate gold chain. Each stone is uniquely shaped by nature.",
    category: "Jewellery",
    image: "",
    inStock: true,
  },
  {
    id: "2",
    name: "Scrunchie Set",
    price: 299,
    description: "Set of 5 premium satin scrunchies in assorted colours. Gentle on hair, stylish all day.",
    category: "Hair Accessories",
    image: "",
    inStock: true,
  },
  {
    id: "3",
    name: "Birthday Gift Hamper",
    price: 1499,
    description: "Curated birthday hamper with handmade goodies, candle, and personalised card.",
    category: "Gift Hampers",
    image: "",
    inStock: true,
  },
  {
    id: "4",
    name: "Aesthetic Wall Poster (A3)",
    price: 199,
    description: "High-quality A3 aesthetic poster for bedroom or study room décor.",
    category: "Posters & Wall Decor",
    image: "",
    inStock: true,
  },
  {
    id: "5",
    name: "Personalised Name Keychain",
    price: 349,
    description: "Custom keychain with your name or initials, handcrafted and delivered in a gift box.",
    category: "Customized Gifts",
    image: "",
    inStock: true,
  },
  {
    id: "6",
    name: "Jewellery + Poster Combo",
    price: 999,
    description: "A gorgeous combo of one pendant and one A3 poster at a special bundled price.",
    category: "Combos & Offers",
    image: "",
    inStock: true,
  },
  {
    id: "7",
    name: "Pearl Drop Earrings",
    price: 890,
    description: "Freshwater pearl drop earrings with gold-filled hooks. Elegant and timeless.",
    category: "Jewellery",
    image: "",
    inStock: true,
  },
  {
    id: "8",
    name: "Claw Clip Pack",
    price: 399,
    description: "Set of 3 sturdy claw clips in trending colours — perfect for thick and thin hair.",
    category: "Hair Accessories",
    image: "",
    inStock: true,
  },
];
