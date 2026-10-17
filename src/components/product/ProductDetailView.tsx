"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Truck, RotateCcw, ShieldCheck, Droplets, Sparkles, Star, Check } from "lucide-react";
import { Product } from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetailView({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
      category: product.category,
      quantity,
    });
    setAddedNotice(true);
    setIsCartOpen(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="bg-[#fffdf6] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-[0.2em] text-[#a37c6b] mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#1c1917] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1c1917] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-[#1c1917] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1c1917] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left: Interactive Image Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 sticky top-28">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-20 flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`relative aspect-square w-16 sm:w-full overflow-hidden bg-[#f5f5f4] border-2 transition-all ${
                      selectedImg === idx ? "border-[#3d2b1f] shadow-xs" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image */}
            <div className="relative aspect-[4/5] w-full bg-[#f5f5f4] overflow-hidden border border-[#e7e5e4] shadow-xs">
              <Image
                src={product.images[selectedImg] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#3d2b1f] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                100% Anti-Tarnish
              </div>
            </div>
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="space-y-6">
            
            <div className="border-b border-[#e7e5e4] pb-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex text-[#d4af37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                  ))}
                </div>
                <span className="text-xs text-[#78716c] font-medium">
                  {product.rating || 4.9} ({product.reviewCount || 94} customer reviews)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif text-[#1c1917] tracking-wide">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-serif font-bold text-[#1c1917]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-[#a8a29e] line-through">
                    ₹{product.original_price.toFixed(2)}
                  </span>
                )}
                {product.discount && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#78716c]">Inclusive of all taxes. Free shipping on orders above ₹999.</p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#78716c] leading-relaxed">
              {product.description}
            </p>

            {/* Anti-Tarnish Badges */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#e7e5e4] text-center text-[10px] uppercase tracking-wider text-[#3d2b1f]">
              <div className="flex flex-col items-center p-2 bg-[#fdf8f6]">
                <ShieldCheck className="w-4 h-4 mb-1" />
                <span>18K Gold Plated</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-[#fdf8f6]">
                <Droplets className="w-4 h-4 mb-1" />
                <span>Waterproof</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-[#fdf8f6]">
                <Sparkles className="w-4 h-4 mb-1" />
                <span>Hypoallergenic</span>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#e7e5e4] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-xs font-medium text-[#1c1917] min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-xs text-[#78716c] hover:text-[#1c1917]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-grow btn-primary py-3.5 uppercase tracking-[0.2em] text-xs font-medium flex items-center justify-center gap-2"
                >
                  {addedNotice ? <Check className="w-4 h-4" /> : null}
                  {addedNotice ? "Added to Bag!" : "Add to Cart"}
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist"
                  className="p-3.5 border border-[#e7e5e4] hover:border-[#3d2b1f] bg-white transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-[#78716c]"}`} />
                </button>
              </div>

              <Link
                href="/checkout"
                onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: product.images[0] || "",
                    category: product.category,
                    quantity,
                  });
                }}
                className="w-full block text-center bg-[#1c1917] text-white hover:bg-[#a37c6b] py-3.5 uppercase tracking-[0.2em] text-xs font-medium transition-colors"
              >
                Buy It Now
              </Link>
            </div>

            {/* Shipping & Guarantee Details */}
            <div className="border-t border-[#e7e5e4] pt-6 space-y-4 text-xs text-[#78716c]">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-[#3d2b1f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1c1917] uppercase tracking-wider text-[11px]">Pan-India Shipping</p>
                  <p>Delivered within 3–5 business days. Free shipping on orders over ₹999.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-4 h-4 text-[#3d2b1f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1c1917] uppercase tracking-wider text-[11px]">7-Day Easy Replacement</p>
                  <p>Hassle-free replacement in case of transit damage or fitment issues.</p>
                </div>
              </div>
            </div>

            {/* Material Specifications */}
            <div className="border-t border-[#e7e5e4] pt-6">
              <h3 className="font-serif text-sm uppercase tracking-wider text-[#1c1917] mb-3">Specifications</h3>
              <dl className="grid grid-cols-2 gap-y-2 text-xs">
                <dt className="text-[#78716c]">Base Metal:</dt>
                <dd className="font-medium text-[#1c1917]">{product.material || "316L Surgical Stainless Steel"}</dd>
                <dt className="text-[#78716c]">Plating:</dt>
                <dd className="font-medium text-[#1c1917]">{product.plating || "18K Gold PVD (Anti-Tarnish)"}</dd>
                <dt className="text-[#78716c]">Water Resistance:</dt>
                <dd className="font-medium text-[#1c1917]">100% Waterproof & Sweatproof</dd>
                <dt className="text-[#78716c]">Skin Compatibility:</dt>
                <dd className="font-medium text-[#1c1917]">Nickel & Lead Free</dd>
              </dl>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#e7e5e4]">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a37c6b] font-medium block mb-1">
                You May Also Like
              </span>
              <h2 className="text-2xl font-serif text-[#1c1917]">Related Jewellery</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} onOpenCart={() => setIsCartOpen(true)} />
              ))}
            </div>
          </div>
        )}

      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
