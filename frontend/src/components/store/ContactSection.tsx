import { useState } from "react";
import { Mail, MapPin, Phone, Send, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactDetails = [
  {
    icon: Phone,
    label: "Call / WhatsApp",
    value: "+91 88599 58061",
    href: "tel:+918859958061",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "shrishtikakkar3@gmail.com",
    href: "mailto:shrishtikakkar3@gmail.com",
  },
  {
    icon: MapPin,
    label: "Our Address",
    value: "HIG 27, MDDA Colony, Balliwala Chowk, Dehradun",
    href: "https://maps.google.com/?q=Balliwala+Chowk+Dehradun",
  },
];

export function ContactSection() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const whatsappNumber = "918859958061";
    const text = `*New Contact Form Submission*%0A%0A*Name:* ${form.name}%0A*Email:* ${form.email}%0A*Subject:* ${form.subject}%0A*Message:* ${form.message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;

    setTimeout(() => {
      setSending(false);
      window.open(whatsappUrl, "_blank");
      toast({
        title: "Redirecting to WhatsApp... 🚀",
        description: "Please complete the message in the WhatsApp window.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 800);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <section id="contact" className="py-20 md:py-28 bg-secondary/20">
      <div className="container">
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Get in Touch
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            We'd Love to Hear from You ✨
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Questions about an order, a custom piece, or just want to say hello?
            Drop us a note — we reply within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Contact details sidebar */}
          <div className="lg:col-span-2 space-y-7">
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    {label}
                  </p>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-primary transition-colors leading-relaxed"
                  >
                    {value}
                  </a>
                </div>
              </div>
            ))}

            {/* Social handles */}
            <div className="pt-5 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Follow Along
              </p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/918859958061"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-semibold shadow hover:opacity-90 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-4 rounded-2xl bg-card border border-border p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">Your Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="" disabled>Select a topic…</option>
                <option>Order Enquiry</option>
                <option>Custom / Personalized Item</option>
                <option>Gift Hampers</option>
                <option>Wholesale / Bulk Order</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us how we can help…"
                className={inputClass + " resize-none"}
              />
            </div>

            <Button type="submit" disabled={sending} className="w-full rounded-full gap-2">
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
