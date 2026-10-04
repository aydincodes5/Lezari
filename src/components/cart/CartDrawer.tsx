"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, X, Minus, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-[#e7e5e4]">
          <h2 className="text-lg font-serif text-[#1c1917] uppercase tracking-widest flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 text-[#78716c] hover:text-[#1c1917] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#78716c]">
              <ShoppingBag className="w-12 h-12 text-[#eaddd7]" />
              <p>Your cart is currently empty.</p>
              <button 
                onClick={() => { onClose(); router.push("/shop"); }}
                className="btn-secondary mt-4 text-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 border-b border-[#f5f5f4] pb-6 last:border-0 last:pb-0">
                <div className="relative w-20 h-24 bg-[#f5f5f4] flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <Link href={`/product/${item.slug}`} onClick={onClose} className="text-sm font-medium text-[#1c1917] hover:text-[#a37c6b] truncate pr-2">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id)} className="text-[#78716c] hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-[#3d2b1f] font-medium mt-1">₹{item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center mt-auto border border-[#e7e5e4] w-fit">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-[#78716c] hover:bg-[#f5f5f4]">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-xs font-medium border-x border-[#e7e5e4]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-[#78716c] hover:bg-[#f5f5f4]">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-[#e7e5e4] bg-[#fdf8f6]">
            <div className="flex justify-between items-center mb-4 text-sm font-medium text-[#1c1917]">
              <span>Subtotal</span>
              <span className="text-lg">₹{getTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-[#78716c] mb-4 text-center">Shipping & taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/cart" 
                onClick={onClose}
                className="btn-secondary w-full text-center py-3 text-[10px]"
              >
                View Full Cart
              </Link>
              <Link 
                href="/checkout" 
                onClick={onClose}
                className="btn-primary w-full text-center py-3 text-[10px] flex items-center justify-center"
              >
                Checkout <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
