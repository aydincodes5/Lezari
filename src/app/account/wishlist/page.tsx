import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { order: "asc" }, take: 1 }
            }
          }
        },
        orderBy: { created_at: "desc" }
      }
    }
  });

  return (
    <div>
      <h2 className="text-xl font-serif text-foreground mb-6 pb-2 border-b border-border">My Wishlist</h2>
      
      {!wishlist || wishlist.items.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 border border-border">
          <p className="text-muted-foreground mb-6">Your wishlist is currently empty.</p>
          <Link href="/shop" className="btn-secondary">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map(({ product, id }) => (
            <div key={id} className="group relative border border-border bg-white flex flex-col">
              <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-muted overflow-hidden block">
                {product.images[0] ? (
                  <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                )}
              </Link>
              <div className="p-4 flex-grow flex flex-col">
                <Link href={`/product/${product.slug}`} className="font-medium text-sm mb-1 hover:text-primary-600 transition-colors line-clamp-1">
                  {product.name}
                </Link>
                <div className="text-sm font-medium mt-auto">₹{product.price.toFixed(2)}</div>
              </div>
              <div className="border-t border-border p-3 flex justify-between items-center bg-muted/10">
                <button className="text-xs uppercase tracking-widest font-medium text-primary-900 hover:text-primary-600 transition-colors flex items-center">
                  <ShoppingBag className="w-3 h-3 mr-2" /> Add to Cart
                </button>
                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
