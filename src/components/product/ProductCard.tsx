"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/catalog";

export default function ProductCard({
  product,
  onOpenCart,
}: {
  product: Product;
  onOpenCart?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
      category: product.category,
      quantity: 1,
    });
    if (onOpenCart) onOpenCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <div
      className="group flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-[#f5f5f4] overflow-hidden mb-3">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#fdf8f6] text-3xl">💎</div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.best_seller && (
            <span className="bg-[#3d2b1f] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
              Bestseller
            </span>
          )}
          {product.new_arrival && (
            <span className="bg-[#a37c6b] text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-medium">
              New In
            </span>
          )}
          <span className="bg-white/95 text-[#3d2b1f] text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-[#e7e5e4] font-semibold">
            Anti-Tarnish
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#1c1917] transition-all shadow-xs"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-[#78716c]"
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-white text-[#1c1917] hover:bg-[#3d2b1f] hover:text-white py-2.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <div className="flex text-[#d4af37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#d4af37]" />
            ))}
          </div>
          <span className="text-[10px] text-[#78716c]">({product.reviewCount || 48})</span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="text-xs font-medium text-[#1c1917] hover:text-[#a37c6b] transition-colors line-clamp-1 mb-1.5"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xs font-semibold text-[#1c1917]">
            ₹{product.price.toFixed(2)}
          </span>
          {product.original_price && (
            <span className="text-[11px] text-[#a8a29e] line-through">
              ₹{product.original_price.toFixed(2)}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-medium text-green-700">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
