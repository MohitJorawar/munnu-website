import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, Order } from "@/types/store";
import { defaultProducts, DEFAULT_CATEGORIES } from "@/data/products";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Helper: Get cart key for a specific user
const getCartKey = (u: any) => u && u.email ? `bloom-cart-${u.email}` : "bloom-cart-guest";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

// Migration: if stored version doesn't match, reset categories & products
const STORE_VERSION = "v2.1";
function migrateStorage() {
  try {
    if (localStorage.getItem("bloom-version") !== STORE_VERSION) {
      localStorage.setItem("bloom-categories", JSON.stringify([...DEFAULT_CATEGORIES]));
      localStorage.setItem("bloom-products", JSON.stringify(defaultProducts));
      localStorage.setItem("bloom-version", STORE_VERSION);
    }
  } catch (e) {
    console.error("Migration failed", e);
  }
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  categories: string[];
  user: { name: string; email: string } | null;
  addProduct: (product: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addOrder: (order: Omit<Order, "id" | "date">) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  addCategory: (cat: string) => Promise<boolean>;
  deleteCategory: (cat: string) => Promise<boolean>;
  login: (userData: { name: string; email: string }, token: string) => void;
  logout: () => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. All State Definitions
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => loadFromStorage("user", null));
  
  // Use a safer initialization for cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const currentUser = loadFromStorage("user", null);
    return loadFromStorage(getCartKey(currentUser), []);
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => loadFromStorage("bloom-favorites", []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage("bloom-orders", []));
  const [categories, setCategories] = useState<string[]>([]);

  // 2. All Data Fetching Functions
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { 
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, []);

  // 3. All Data Modifying Functions
  const addProduct = useCallback(async (productData: Omit<Product, "id">) => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return false;

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts(prev => [newProduct, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add product:", error);
      return false;
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return false;

    try {
      const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update product:", error);
      return false;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return false;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        },
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setCart(prev => prev.filter(item => item.product.id !== id));
        setFavorites(prev => prev.filter(fId => fId !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete product:", error);
      return false;
    }
  }, []);

  const addCategory = useCallback(async (cat: string) => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return false;

    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        },
        body: JSON.stringify({ name: cat }),
      });

      if (response.ok) {
        setCategories(prev => [...prev, cat]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add category:", error);
      return false;
    }
  }, []);

  const deleteCategory = useCallback(async (cat: string) => {
    const token = localStorage.getItem("token");
    const adminPin = localStorage.getItem("admin-pin");
    if (!token && !adminPin) return false;

    try {
      const response = await fetch(`${API_URL}/api/categories/${encodeURIComponent(cat)}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "x-admin-pin": adminPin || ""
        },
      });

      if (response.ok) {
        setCategories(prev => prev.filter(c => c !== cat));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete category:", error);
      return false;
    }
  }, []);

  // 4. Cart and Other Utility Functions
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) { setCart(prev => prev.filter(item => item.product.id !== productId)); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const isFavorite = useCallback((productId: string) => favorites.includes(productId), [favorites]);

  const addOrder = useCallback(async (orderData: Omit<Order, "id" | "date">) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        const newOrder = { ...orderData, id: data.orderId, date: new Date().toISOString() };
        setOrders(prev => [newOrder as Order, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to place order:", error);
      return false;
    }
  }, []);

  const login = useCallback((userData: { name: string; email: string }, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setCart(loadFromStorage(`bloom-cart-${userData.email}`, []));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin-pin");
    setUser(null);
    setOrders([]);
    setCart(loadFromStorage("bloom-cart-guest", []));
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 5. All Side Effects (Bottom)
  useEffect(() => {
    migrateStorage(); // Run migration once on mount
    console.log("🚀 StoreContext using API_URL:", API_URL);
    fetchProducts();
    fetchCategories();
    fetchOrders(); 
  }, [fetchProducts, fetchCategories, fetchOrders]);

  useEffect(() => { localStorage.setItem(getCartKey(user), JSON.stringify(cart)); }, [cart, user]);
  useEffect(() => { localStorage.setItem("bloom-favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("bloom-orders", JSON.stringify(orders)); }, [orders]);

  return (
    <StoreContext.Provider value={{
      products, cart, favorites, orders, categories, user,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      toggleFavorite, isFavorite, addOrder, fetchOrders,
      addCategory, deleteCategory, login, logout,
      cartTotal, cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
