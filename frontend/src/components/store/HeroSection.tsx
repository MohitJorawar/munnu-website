import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onOpenCategoryShop: () => void;
}

export function HeroSection({ onOpenCategoryShop }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Handcrafted goods collection" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
      </div>
      <div className="container relative z-10 py-24 md:py-36">
        <div className="max-w-lg space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
            Handcrafted with Love
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight text-primary-foreground">
            GET {" "}
            <span className="italic">CRAFTED </span>
          </h1>
          <p className="text-base text-primary-foreground/80 max-w-md leading-relaxed">
            Discover unique handmade jewelry, candles, pottery & accessories — each piece tells a story.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#shop"
              className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Explore Collection
            </a>
            <button
              onClick={onOpenCategoryShop}
              className="inline-block rounded-full border-2 border-primary-foreground/70 px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary-foreground/15 transition-all"
            >
              Shop by Category →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
