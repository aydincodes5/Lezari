import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-24 flex-shrink-0">
            {product.images.map((img, idx) => (
              <div key={img.id} className="relative aspect-square w-20 lg:w-full bg-muted cursor-pointer border border-transparent hover:border-primary-900 transition-colors">
                <Image src={img.url} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="relative aspect-[4/5] w-full bg-muted flex-grow">
            {product.images[0] ? (
              <Image src={product.images[0].url} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-400 bg-primary-100">No Image</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8 border-b border-border pb-8">
            <h1 className="text-3xl font-serif text-foreground mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-2xl text-primary-900 font-medium">₹{product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-lg text-muted-foreground line-through">₹{product.original_price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {product.short_description || product.description}
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0]?.url || "",
                category: "Jewellery"
              }}
            />
            <button className="w-full border border-[#e7e5e4] text-[#78716c] py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#f5f5f4] hover:text-[#1c1917] transition-colors flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2" /> Add to Wishlist
            </button>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground border-t border-border pt-8">
            <div className="flex items-start">
              <Truck className="w-5 h-5 mr-4 text-primary-900 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground uppercase tracking-widest text-xs mb-1">Free Shipping</p>
                <p>On all orders over ₹999.</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="w-5 h-5 mr-4 text-primary-900 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground uppercase tracking-widest text-xs mb-1">Easy Returns</p>
                <p>7-day return policy for unused items.</p>
              </div>
            </div>
          </div>

          {/* Full description */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-medium uppercase tracking-widest text-sm mb-4">Description</h3>
            <div className="prose prose-sm text-muted-foreground max-w-none">
              {product.description}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
