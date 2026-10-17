import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";

export default async function WishlistPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) return null;

  let wishlist: any = null;
  try {
    wishlist = await prisma.wishlist.findUnique({
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
  } catch (e) {
    console.warn("Wishlist DB read skipped:", e);
  }

  return (
    <div>
      <h2 className="text-xl font-serif text-[#1c1917] mb-6 pb-2 border-b border-[#e7e5e4]">My Wishlist</h2>
      
      {!wishlist || !wishlist.items || wishlist.items.length === 0 ? (
        <div className="text-center py-16 bg-[#fdf8f6] border border-[#eaddd7]">
          <p className="text-[#78716c] mb-6 text-sm">Your wishlist is currently empty.</p>
          <Link href="/shop" className="btn-primary text-xs uppercase tracking-wider py-2.5 px-6">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map(({ product, id }: { product: any; id: string }) => (
            <div key={id} className="group relative border border-[#e7e5e4] bg-white flex flex-col">
              <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-[#f5f5f4] overflow-hidden block">
                {product.images && product.images[0] ? (
                  <Image src={product.images[0].url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#a37c6b]">💎</div>
                )}
              </Link>
              <div className="p-4 flex-grow flex flex-col">
                <Link href={`/product/${product.slug}`} className="font-medium text-sm mb-1 hover:text-[#a37c6b] transition-colors line-clamp-1 text-[#1c1917]">
                  {product.name}
                </Link>
                <div className="text-sm font-medium mt-auto text-[#3d2b1f]">₹{product.price.toFixed(2)}</div>
              </div>
              <div className="border-t border-[#e7e5e4] p-3 flex justify-between items-center bg-[#fdf8f6]">
                <button className="text-xs uppercase tracking-widest font-medium text-[#3d2b1f] hover:text-[#a37c6b] transition-colors flex items-center">
                  <ShoppingBag className="w-3.5 h-3.5 mr-2" /> Add to Cart
                </button>
                <button className="text-[#78716c] hover:text-red-500 transition-colors">
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
