"use client";

import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-[#eaddd7] mb-6" />
        <h1 className="text-3xl font-serif text-[#1c1917] mb-4">Your Cart is Empty</h1>
        <p className="text-[#78716c] mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium jewellery collection and find your next favorite piece.
        </p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-serif text-[#1c1917] mb-12 uppercase tracking-widest border-b border-[#e7e5e4] pb-4">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex border border-[#e7e5e4] p-4 bg-white items-center">
              <Link href={`/product/${item.slug}`} className="w-24 h-24 bg-[#f5f5f4] flex-shrink-0 relative overflow-hidden group">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-[#a37c6b]">Img</div>
                )}
              </Link>
              <div className="ml-6 flex-grow">
                <Link href={`/product/${item.slug}`} className="font-medium text-[#1c1917] hover:text-[#a37c6b] transition-colors">{item.name}</Link>
                {item.category && <p className="text-[#78716c] text-xs uppercase tracking-widest mt-1 mb-3">{item.category}</p>}
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-[#e7e5e4]">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1.5 hover:bg-[#f5f5f4] transition-colors text-[#78716c]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1.5 text-sm font-medium border-x border-[#e7e5e4]">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-[#f5f5f4] transition-colors text-[#78716c]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[#78716c] hover:text-red-500 transition-colors p-2 flex items-center text-xs uppercase tracking-widest gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-medium text-[#3d2b1f] w-32">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-[#fdf8f6] p-6 lg:p-8 h-fit border border-[#eaddd7]">
          <h2 className="font-medium uppercase tracking-widest text-[#1c1917] mb-6 border-b border-[#eaddd7] pb-4">Order Summary</h2>
          <div className="space-y-4 mb-8 text-sm">
            <div className="flex justify-between">
              <span className="text-[#78716c]">Subtotal</span>
              <span className="font-medium">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#78716c]">Shipping</span>
              <span className="font-medium">{total > 999 ? 'Free' : '₹99.00'}</span>
            </div>
            <div className="flex justify-between border-t border-[#eaddd7] pt-4 font-medium text-lg text-[#3d2b1f]">
              <span>Total</span>
              <span>₹{(total > 999 ? total : total + 99).toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="w-full btn-primary flex justify-center items-center py-4">
            Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
