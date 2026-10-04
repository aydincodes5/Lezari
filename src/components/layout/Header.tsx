"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore(state => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#3d2b1f] text-[#fdf8f6] text-[10px] sm:text-xs text-center py-2 px-4 tracking-[0.2em] uppercase font-medium">
        Free Shipping on all orders above ₹999
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-[#e7e5e4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* LEFT: Logo & Brand */}
            <div className="flex-shrink-0 z-50">
              <Link href="/" className="flex items-center gap-3 group relative cursor-pointer block p-2 -ml-2">
                <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                  <Image
                    src="/logo.png"
                    alt="Lezari Jewels Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <div className="hidden sm:block mt-1">
                  <span className="font-serif text-lg sm:text-xl tracking-widest text-[#3d2b1f] group-hover:text-[#5c4437] transition-colors leading-none block">
                    LEZARI
                  </span>
                  <span className="text-[9px] tracking-[0.3em] text-[#a37c6b] uppercase block -mt-0.5 font-medium">
                    Jewels
                  </span>
                </div>
              </Link>
            </div>

            {/* RIGHT: Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-xs font-medium tracking-widest text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase">
                Home
              </Link>
              <Link href="/shop" className="text-xs font-medium tracking-widest text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase">
                Shop
              </Link>
              <Link href="/account" className="text-xs font-medium tracking-widest text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase">
                Account
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-medium tracking-widest text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase flex items-center gap-1.5"
              >
                Cart <ShoppingBag className="w-4 h-4 mb-0.5" />
                {mounted && itemCount > 0 && (
                  <span className="bg-[#a37c6b] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    {itemCount}
                  </span>
                )}
              </button>
            </nav>

            {/* RIGHT: Mobile Actions */}
            <div className="flex md:hidden items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#1c1917] relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#a37c6b] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-[#1c1917]">
                <Menu className="h-6 w-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-64 bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b border-[#e7e5e4] flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium tracking-widest uppercase py-2 border-b border-[#f5f5f4]">Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium tracking-widest uppercase py-2 border-b border-[#f5f5f4]">Shop</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium tracking-widest uppercase py-2 border-b border-[#f5f5f4]">Account</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
