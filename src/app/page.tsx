import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Droplets, Sparkles, Truck, Star, Quote } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import HeroSlider from "@/components/home/HeroSlider";
import ProductCard from "@/components/product/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";

export default function Home() {
  const bestSellers = PRODUCTS.filter((p) => p.best_seller);
  const newArrivals = PRODUCTS.filter((p) => p.new_arrival);

  // Instagram showcase images
  const instaImages = [
    { id: 1, src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", tag: "@ananya_s in Tulip Necklace" },
    { id: 2, src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop", tag: "@priya_k wearing Nale Huggies" },
    { id: 3, src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop", tag: "@tanya.v with Aura Ring" },
    { id: 4, src: "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=600&auto=format&fit=crop", tag: "@diya_m in Charm Band" },
    { id: 5, src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop", tag: "@meera.style in Clover Set" },
    { id: 6, src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", tag: "@isha_j in Pearl Studs" },
  ];

  const testimonials = [
    {
      id: 1,
      quote: "The anti-tarnish promise is 100% genuine! I wear my Tulip necklace in the shower every single day and it still shines exactly like solid gold.",
      author: "Pooja Mehta",
      verified: true,
      product: "Tulip Salene Necklace",
      rating: 5,
    },
    {
      id: 2,
      quote: "Finally jewellery that doesn't irritate my sensitive ears. The Nale Huggies are featherlight and so luxurious. Highly recommended!",
      author: "Rhea Sharma",
      verified: true,
      product: "Nale White Stone Huggies",
      rating: 5,
    },
    {
      id: 3,
      quote: "The packaging, the weight, the gold finish — everything feels like high-end designer pieces without breaking the bank.",
      author: "Sneha Nair",
      verified: true,
      product: "Heart Tale Charm Band",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf6]">
      
      {/* ── 1. HERO SLIDER (Pure imagery, no text overlay) ── */}
      <section className="w-full">
        <HeroSlider />
      </section>

      {/* ── 2. SHOP BY CATEGORY (Directly under slider, as in reference) ── */}
      <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#a37c6b] font-medium block mb-2">
            Explore Collections
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917] tracking-wide">
            Shop by Category
          </h2>
          <div className="h-0.5 w-12 bg-[#3d2b1f] mx-auto mt-3" />
        </div>

        {/* Circular / Rounded Category Row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#f5f5f4] mb-3 border-2 border-[#eaddd7] group-hover:border-[#3d2b1f] transition-all duration-300 shadow-xs group-hover:shadow-md">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 80px, 128px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-[#1c1917] group-hover:text-[#a37c6b] transition-colors uppercase tracking-wider">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. VALUE PROPOSITION STRIP ── */}
      <section className="border-y border-[#e7e5e4] bg-[#fdf8f6] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-2">
              <ShieldCheck className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1917]">18K Gold Plated</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">Won't fade, rust, or tarnish</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Droplets className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1917]">100% Waterproof</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">Shower, sweat & swim proof</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Sparkles className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1917]">Hypoallergenic</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">Safe for sensitive skin</p>
            </div>
            <div className="flex flex-col items-center p-2">
              <Truck className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1917]">Free Shipping</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">On all orders above ₹999</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BEST SELLERS ── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#a37c6b] font-medium block mb-1.5">
              Loved by Thousands
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917] tracking-wide">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#3d2b1f] hover:text-[#a37c6b] transition-colors border-b border-[#3d2b1f] pb-1 flex items-center gap-1.5"
          >
            View All Jewellery <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {bestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 5. EDITORIAL LUXURY BANNER ── */}
      <section className="py-16 bg-[#3d2b1f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#5c4437] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
                alt="Lezari Jewels Craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#d2bab0] font-medium block">
                The Lezari Promise
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif leading-tight">
                Luxury That Never Tarnishes
              </h2>
              <p className="text-xs sm:text-sm text-[#d2bab0] leading-relaxed max-w-md">
                We believe you shouldn't have to take your favourite jewellery off before jumping into the pool, 
                working out, or washing hands. Every Lezari piece is forged from high-durability surgical steel 
                bonded with real 18K gold.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block bg-[#fdf8f6] text-[#3d2b1f] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#d2bab0] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. NEW ARRIVALS ── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#a37c6b] font-medium block mb-1.5">
            Fresh Drops
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917] tracking-wide">
            New Arrivals
          </h2>
          <div className="h-0.5 w-12 bg-[#3d2b1f] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {newArrivals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 7. REVIEWS & TESTIMONIALS (Like Judge.me in the reference) ── */}
      <section className="py-16 bg-[#fdf8f6] border-y border-[#eaddd7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1.5 text-[#d4af37] mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#d4af37]" />
              ))}
              <span className="text-xs font-bold text-[#1c1917] ml-2">4.9 / 5.0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917]">
              Loved by Over 10,000+ Women
            </h2>
            <p className="text-xs text-[#78716c] mt-1.5">Real reviews from verified buyers across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 sm:p-7 border border-[#e7e5e4] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex text-[#d4af37] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#1c1917] leading-relaxed mb-4 italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f5f5f4] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#1c1917]">{t.author}</p>
                    <p className="text-[10px] text-[#78716c]">{t.product}</p>
                  </div>
                  <span className="text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                    Verified Buyer ✓
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. INSTAGRAM SECTION (Requested by User) ── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#a37c6b] font-medium block mb-2">
            Social Spotlight
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1917] tracking-wide mb-3">
            Styled with Lezari
          </h2>
          <p className="text-xs text-[#78716c] mb-6">
            Tag <span className="font-semibold text-[#1c1917]">@lezarijewels</span> to be featured on our page
          </p>

          {/* Prominent Instagram Button */}
          <a
            href="https://instagram.com/lezarijewels"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity shadow-md rounded-full"
          >
            <InstagramIcon className="w-4 h-4" />
            Follow on Instagram
          </a>
        </div>

        {/* 6-Image Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {instaImages.map((img) => (
            <a
              key={img.id}
              href="https://instagram.com/lezarijewels"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#f5f5f4] cursor-pointer"
            >
              <Image
                src={img.src}
                alt={img.tag}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <InstagramIcon className="w-6 h-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
