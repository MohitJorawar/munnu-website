import { Heart, Phone, Mail, MapPin } from "lucide-react";
import logoImg from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Get-Crafted" className="h-12 w-auto object-contain" />
              <div className="leading-tight">
                <p className="font-display text-base font-bold text-foreground">GET-CRAFTED</p>
                <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">Handmade with Love</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every piece is handcrafted with care and intention. We believe in slow making and the beauty of imperfection.
            </p>
          </div>

          {/* Shop links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Shop</h4>
            <div className="space-y-2">
              {["✨ Jewellery","🎀 Hair Accessories","🎁 Gift Hampers","🖼️ Posters & Wall Decor","🎨 Customized Gifts","💝 Combos & Offers","🔥 New Arrivals","⭐ Best Sellers"].map(cat => (
                <a key={cat} href="#shop" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{cat}</a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h4>
            <div className="space-y-2">
              <a href="#shop" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Shop All</a>
              <a href="#about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About Us</a>
              <a href="#contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
              <a href="https://wa.me/918859958061" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">💬 WhatsApp Us</a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+918859958061" className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                +91 88599 58061
              </a>
              <a href="mailto:shrishtikakkar3@gmail.com" className="flex items-start gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                shrishtikakkar3@gmail.com
              </a>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                HIG 27, MDDA Colony, Balliwala Chowk, Dehradun
              </div>
            </div>
            {/* Social */}
            <div className="flex gap-4 pt-1">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Facebook</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 Get-Crafted. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-primary fill-primary" /> Handmade with Love
          </p>
        </div>
      </div>
    </footer>
  );
}