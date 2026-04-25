import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { CartDrawer } from "./CartDrawer";
import { FavoritesDrawer } from "./FavoritesDrawer";
import logoImg from "@/assets/logo.jpg";

export function Header() {
  const { cartCount, favorites, user, logout } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md shadow-sm">
        <div className="container flex h-20 items-center justify-between gap-6">

          {/* Logo + Brand name */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src={logoImg}
              alt="Get-Crafted logo"
              className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block leading-tight">
              <p className="font-display text-xl font-bold tracking-tight text-foreground">GET-CRAFTED</p>
              <p className="text-[11px] text-muted-foreground tracking-[0.15em] uppercase">Handmade with Love</p>
            </div>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={() => setFavOpen(true)} className="relative h-10 w-10">
              <Heart className="h-[22px] w-[22px]" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCartOpen(true)} className="relative h-10 w-10">
              <ShoppingBag className="h-[22px] w-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <User className="h-[22px] w-[22px] text-primary" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-10 w-10 hidden md:flex" onClick={handleLogout}>
                  <LogOut className="h-[22px] w-[22px] text-muted-foreground" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <User className="h-[22px] w-[22px]" />
                </Button>
              </Link>
            )}

            <Link to="/admin">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Settings className="h-[22px] w-[22px]" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden h-10 w-10" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t bg-card p-4 space-y-3">
            <Link to="/" className="block text-sm font-medium text-foreground" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="#shop" className="block text-sm font-medium text-foreground" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#about" className="block text-sm font-medium text-foreground" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" className="block text-sm font-medium text-foreground" onClick={() => setMenuOpen(false)}>Contact</a>
            {user ? (
              <>
                <Link to="/profile" className="block text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button className="block w-full text-left text-sm font-medium text-destructive" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="block text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <FavoritesDrawer open={favOpen} onOpenChange={setFavOpen} />
    </>
  );
}
