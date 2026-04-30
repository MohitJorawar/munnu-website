import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Lock, BarChart3, Package, Tag, ShoppingCart, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types/store";
import { toast } from "sonner";

const ADMIN_PIN = "0000";

const emptyForm = { name: "", price: 0, description: "", category: "Jewellery", image: "", inStock: true };

const Admin = () => {
  const { products, orders, categories, addProduct, updateProduct, deleteProduct, addCategory, deleteCategory } = useStore();

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  // Product dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Category state
  const [newCategory, setNewCategory] = useState("");
  const [deleteCatName, setDeleteCatName] = useState<string | null>(null);

  // Sales stats
  const salesStats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const topProducts: Record<string, number> = {};
    orders.forEach(o => o.items.forEach(i => {
      topProducts[i.product.name] = (topProducts[i.product.name] || 0) + i.quantity;
    }));
    const topProductsList = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    return { totalRevenue, totalOrders, pendingOrders, completedOrders, topProductsList, recentOrders };
  }, [orders]);

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border bg-card p-8 space-y-6 shadow-lg">
          <div className="text-center space-y-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-semibold">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Enter your PIN to continue</p>
          </div>
          <form onSubmit={e => {
            e.preventDefault();
            if (pin === ADMIN_PIN) {
              setAuthenticated(true);
              localStorage.setItem("admin-pin", pin); // Save for API calls
              toast.success("Welcome, Admin!");
            } else {
              toast.error("Incorrect PIN");
              setPin("");
            }
          }} className="space-y-4">
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter PIN"
                maxLength={10}
                className="text-center text-lg tracking-[0.3em] pr-10"
                autoFocus
              />
              <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full rounded-full">Unlock</Button>
          </form>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, category: categories[0] || "Jewelry" }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, price: p.price, description: p.description, category: p.category, image: p.image, inStock: p.inStock }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (form.price <= 0) { toast.error("Price must be greater than 0"); return; }
    
    let success = false;
    if (editing) {
      success = await updateProduct({ ...editing, ...form });
      if (success) toast.success("Product updated!");
    } else {
      success = await addProduct(form);
      if (success) toast.success("Product added!");
    }
    
    if (success) {
      setDialogOpen(false);
    } else {
      toast.error("Failed to save product. Please check your connection.");
    }
  };

  const handleDelete = async () => {
    if (deleteId) { 
      const success = await deleteProduct(deleteId);
      if (success) {
        toast.success("Product deleted!");
      } else {
        toast.error("Failed to delete product.");
      }
    }
    setDeleteId(null);
  };

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) { toast.error("Category name is required"); return; }
    if (categories.includes(trimmed)) { toast.error("Category already exists"); return; }
    
    const success = await addCategory(trimmed);
    if (success) {
      setNewCategory("");
      toast.success("Category added!");
    } else {
      toast.error("Failed to add category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (deleteCatName) {
      const success = await deleteCategory(deleteCatName);
      if (success) {
        toast.success("Category deleted!");
      } else {
        toast.error("Failed to delete category.");
      }
    }
    setDeleteCatName(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
            <h1 className="font-display text-xl font-semibold">Admin Panel</h1>
          </div>
          <Button onClick={openAdd} className="rounded-full gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="rounded-full bg-secondary/50 p-1">
            <TabsTrigger value="dashboard" className="rounded-full gap-2 data-[state=active]:bg-card"><BarChart3 className="h-4 w-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="products" className="rounded-full gap-2 data-[state=active]:bg-card"><Package className="h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full gap-2 data-[state=active]:bg-card"><Tag className="h-4 w-4" /> Categories</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full gap-2 data-[state=active]:bg-card"><ShoppingCart className="h-4 w-4" /> Orders</TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `₹${salesStats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
                { label: "Total Orders", value: salesStats.totalOrders, icon: ShoppingCart, color: "text-primary" },
                { label: "Pending", value: salesStats.pendingOrders, icon: Package, color: "text-amber-500" },
                { label: "Products", value: products.length, icon: Tag, color: "text-blue-500" },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl border bg-card p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>

            {salesStats.topProductsList.length > 0 && (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <h3 className="font-display text-lg font-semibold">Top Selling Products</h3>
                <div className="space-y-3">
                  {salesStats.topProductsList.map(([name, qty], i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-muted-foreground w-6">#{i + 1}</span>
                      <span className="text-sm flex-1">{name}</span>
                      <Badge variant="secondary">{qty} sold</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {salesStats.totalOrders === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No orders yet. Sales data will appear here once customers place orders.
              </div>
            )}
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Price</th>
                      <th className="text-center p-4 font-medium text-muted-foreground hidden md:table-cell">Stock</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{p.category}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{p.category}</span>
                        </td>
                        <td className="p-4 text-right font-medium">₹{p.price.toLocaleString()}</td>
                        <td className="p-4 text-center hidden md:table-cell">
                          <span className={`inline-block h-2 w-2 rounded-full ${p.inStock ? "bg-green-500" : "bg-destructive"}`} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {products.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">No products yet. Add your first one!</div>
              )}
            </div>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="space-y-6">
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold">Manage Categories</h3>
              <div className="flex gap-3">
                <Input
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  onKeyDown={e => e.key === "Enter" && handleAddCategory()}
                  className="max-w-xs"
                />
                <Button onClick={handleAddCategory} className="rounded-full gap-2">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2">
                    <span className="text-sm font-medium">{cat}</span>
                    <button onClick={() => setDeleteCatName(cat)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories. Add one above.</p>
              )}
            </div>
          </TabsContent>

          {/* ORDERS */}
          <TabsContent value="orders">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden sm:table-cell">Items</th>
                      <th className="text-left p-4 font-medium text-muted-foreground hidden md:table-cell">Payment</th>
                      <th className="text-right p-4 font-medium text-muted-foreground">Total</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <p className="text-xs text-muted-foreground">{order.items.map((i: any) => `${i.name} ×${i.quantity}`).join(", ")}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant="outline">{order.paymentMethod}</Badge>
                        </td>
                        <td className="p-4 text-right font-medium">₹{order.total.toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "secondary" : "destructive"}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">No orders yet.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.inStock} onCheckedChange={v => setForm({ ...form, inStock: v })} />
              <Label>In Stock</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deleteCatName} onOpenChange={() => setDeleteCatName(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteCatName}" category?</AlertDialogTitle>
            <AlertDialogDescription>Products in this category won't be deleted, but they'll lose their category tag.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
