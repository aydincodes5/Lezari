import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function Home() {
  const slides = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" }
  });

  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { order: "asc" },
    take: 6
  });

  const featuredProducts = await prisma.product.findMany({
    where: { available: true, featured: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 4
  });

  const newArrivals = await prisma.product.findMany({
    where: { available: true, new_arrival: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    take: 4
  });

  const hero = slides[0];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[500px] bg-[#f2e8e5] flex items-center overflow-hidden">
        {hero?.image && hero.image.startsWith('/') && hero.image !== '/hero-bg.jpg' ? (
          <Image src={hero.image} alt={hero.heading || "Lezari Jewels"} fill className="object-cover" priority />
        ) : (
          /* Elegant gradient background when no real image is uploaded */
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #fdf8f6 0%, #f2e8e5 40%, #eaddd7 70%, #d2bab0 100%)'
            }}
          />
        )}

        {/* Overlay for text readability */}
        <div className="absolute inset-0" style={{ background: 'rgba(29,20,14,0.18)' }} />

        {/* Text Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-xl">
            {hero ? (
              <>
                <p className="text-[#fdf8f6]/80 text-xs uppercase tracking-[0.3em] mb-4">New Collection</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                  {hero.heading || "Elegance in Every Detail"}
                </h1>
                {hero.description && (
                  <p className="text-white/80 text-lg mb-10 max-w-md leading-relaxed">
                    {hero.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-[#3d2b1f]/70 text-xs uppercase tracking-[0.3em] mb-4">Premium Collection</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#3d2b1f] leading-[1.1] mb-6">
                  Elegance in<br />Every Detail
                </h1>
                <p className="text-[#3d2b1f]/70 text-lg mb-10 max-w-md leading-relaxed">
                  Discover premium anti-tarnish jewellery designed for the modern woman.
                </p>
              </>
            )}
            <Link href="/shop" className="btn-primary text-sm tracking-[0.2em]">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-3">Collections</p>
          <h2 className="text-3xl font-serif text-[#1c1917]">Shop by Category</h2>
          <div className="h-px w-16 bg-[#a37c6b] mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.length > 0 ? categories.map(cat => (
            <Link href={`/shop?category=${cat.slug}`} key={cat.id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden bg-[#f5f5f4] mb-4">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-4xl"
                    style={{ background: 'linear-gradient(135deg, #fdf8f6, #eaddd7)' }}
                  >
                    💎
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
              <h3 className="text-center font-medium uppercase tracking-widest text-xs text-[#1c1917] group-hover:text-[#a37c6b] transition-colors">
                {cat.name}
              </h3>
            </Link>
          )) : (
            ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Combos'].map(name => (
              <div key={name} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden mb-4" style={{ background: 'linear-gradient(135deg, #fdf8f6, #eaddd7)' }}>
                  <div className="w-full h-full flex items-center justify-center text-4xl">💎</div>
                </div>
                <h3 className="text-center font-medium uppercase tracking-widest text-xs text-[#78716c]">{name}</h3>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-[#fdf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-14">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-3">Handpicked</p>
              <h2 className="text-3xl font-serif text-[#1c1917]">Featured Collection</h2>
            </div>
            <Link
              href="/shop?featured=true"
              className="hidden md:inline-block text-xs uppercase tracking-widest font-medium text-[#3d2b1f] hover:text-[#a37c6b] transition-colors border-b border-[#3d2b1f] hover:border-[#a37c6b] pb-0.5"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f4] mb-4">
                  {product.images[0] ? (
                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #fdf8f6, #eaddd7)' }}>💍</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                    <span className="bg-white text-[#3d2b1f] px-5 py-2 text-[10px] uppercase tracking-widest font-medium hover:bg-[#3d2b1f] hover:text-white transition-colors">
                      View Product
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-sm mb-1.5 line-clamp-1 text-[#1c1917] group-hover:text-[#a37c6b] transition-colors">{product.name}</h3>
                <div className="flex items-center space-x-2 mt-auto">
                  <span className="text-sm font-medium text-[#3d2b1f]">₹{product.price.toFixed(2)}</span>
                  {product.original_price && (
                    <span className="text-xs text-[#78716c] line-through">₹{product.original_price.toFixed(2)}</span>
                  )}
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-20 text-[#78716c]">
                <p className="mb-4">Products will appear here once added by the admin.</p>
                <Link href="/shop" className="btn-primary text-xs">Browse Shop</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newArrivals.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-3">Just In</p>
              <h2 className="text-3xl font-serif text-[#1c1917]">New Arrivals</h2>
              <div className="h-px w-16 bg-[#a37c6b] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
              {newArrivals.map(product => (
                <Link href={`/product/${product.slug}`} key={product.id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f4] mb-4">
                    {product.images[0] ? (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #fdf8f6, #eaddd7)' }}>💍</div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#3d2b1f] text-white text-[9px] uppercase tracking-widest px-2 py-1">New</div>
                  </div>
                  <h3 className="font-medium text-sm mb-1.5 line-clamp-1 text-[#1c1917] group-hover:text-[#a37c6b] transition-colors">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-[#3d2b1f]">₹{product.price.toFixed(2)}</span>
                    {product.original_price && (
                      <span className="text-xs text-[#78716c] line-through">₹{product.original_price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EDITORIAL / BRAND STORY ── */}
      <section className="py-20 bg-[#3d2b1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] bg-[#5c4437] flex items-center justify-center overflow-hidden">
              <p className="text-[#d2bab0] text-sm tracking-widest uppercase">Editorial Image</p>
            </div>
            <div className="flex flex-col text-center md:text-left items-center md:items-start">
              <span className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-6">Our Philosophy</span>
              <h2 className="text-4xl font-serif text-white leading-snug mb-8">
                Designed for the<br />Modern Minimalist
              </h2>
              <p className="text-[#d2bab0] leading-relaxed mb-10 max-w-md">
                Every piece in the Lezari Jewels collection is chosen for its elegance, durability, and timeless appeal.
                Our premium anti-tarnish and stainless-steel jewellery stays as radiant as the day you received it.
              </p>
              <Link href="/contact" className="border border-[#d2bab0] text-[#d2bab0] px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-[#d2bab0] hover:text-[#3d2b1f] transition-colors inline-block">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
