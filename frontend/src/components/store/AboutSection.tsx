import { Leaf, Sparkles, Heart } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Handpicked Quality",
    description:
      "Every product at Get Crafted is carefully selected and crafted with attention to detail. We focus on quality materials and finishing so that each piece feels special, durable, and worth keeping.",
  },
  {
    icon: Sparkles,
    title: "Unique & Personal",
    description:
      "No two pieces are exactly the same—because handmade means real. Each item carries its own charm, making it perfect for gifting or adding a personal touch to your style.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Behind every product is time, effort, and passion. We don’t mass-produce—we create with intention, so you receive something meaningful, not just another item.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-secondary/40 py-20 md:py-28">
      <div className="container">
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Our Story
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">
            About Get-Crafted
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Born from a love of slow making and conscious living, Get-Crafted
            was founded to celebrate the art of the human hand in a world of machines.
          </p>
        </div>

        {/* Two-column layout: story + values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          {/* Story text */}
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              At Get Crafted, we believe every piece should tell a story. 
              From thoughtfully designed jewelry to personalized keepsakes, our 
              creations are made to add a touch of meaning and style to your everyday 
              life. We focus on quality, detail, and creativity—bringing you handcrafted
               products that feel as special as the moments they represent. Whether you’re 
               celebrating something big or just want to treat yourself, Get Crafted is all 
               about turning simple ideas into beautifully crafted memories
            </p>
            <p>
              Today, Get-Crafted works with a collective of independent makers
              — potters, jewellers, chandlers, and weavers — united by a single
              philosophy: <em className="text-foreground">beauty through patience</em>.
            </p>
            <p>
              We ship worldwide and partner only with makers who share our commitment
              to fair wages, non-toxic materials, and zero-waste packaging.
            </p>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl bg-card border border-border p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "500+", label: "Unique Products" },
            { stat: "30+", label: "Artisan Makers" },
            { stat: "12k+", label: "Happy Customers" },
            { stat: "100%", label: "Handmade & Ethical" },
          ].map(({ stat, label }) => (
            <div
              key={label}
              className="rounded-2xl bg-card border border-border p-6 shadow-sm"
            >
              <p className="font-display text-3xl font-semibold text-primary mb-1">
                {stat}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
