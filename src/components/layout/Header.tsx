"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#3d2b1f] text-[#fdf8f6] text-[10px] sm:text-[11px] text-center py-2.5 px-4 tracking-[0.25em] uppercase font-medium">
        Free Shipping on all orders above ₹999 • 100% Waterproof & Anti-Tarnish
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e7e5e4] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">

            {/* LEFT: Prominent, Balanced Logo & Brand */}
            <div className="flex-shrink-0 z-50">
              <Link href="/" className="flex items-center gap-3.5 group cursor-pointer py-1">
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 flex-shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Lezari Jewels Official Logo"
                    fill
                    sizes="(max-width: 640px) 56px, 72px"
                    className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-xl sm:text-2xl md:text-[26px] tracking-[0.18em] text-[#1c1917] group-hover:text-[#a37c6b] transition-colors leading-none font-semibold">
                    LEZARI
                  </span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-[#a37c6b] uppercase font-medium mt-1">
                    JEWELS
                  </span>
                </div>
              </Link>
            </div>

            {/* RIGHT: Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              <nav className="flex items-center space-x-7 lg:space-x-9">
                <Link
                  href="/"
                  className="text-xs font-medium tracking-[0.2em] text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase py-1"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="text-xs font-medium tracking-[0.2em] text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase py-1"
                >
                  Shop
                </Link>
                <Link
                  href="/account"
                  className="text-xs font-medium tracking-[0.2em] text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase py-1"
                >
                  Account
                </Link>
              </nav>

              <div className="flex items-center space-x-5 pl-4 border-l border-[#e7e5e4]">
                {/* Instagram Button */}
                <a
                  href="https://instagram.com/lezarijewels"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Lezari Jewels on Instagram"
                  className="p-2 text-[#1c1917] hover:text-[#e1306c] hover:bg-[#fdf8f6] rounded-full transition-colors flex items-center justify-center group"
                  title="Follow us on Instagram"
                >
                  <InstagramIcon className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                </a>

                {/* Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="text-xs font-medium tracking-[0.2em] text-[#1c1917] hover:text-[#a37c6b] transition-colors uppercase flex items-center gap-2 group py-1"
                >
                  <span className="hidden sm:inline">Cart</span>
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4 text-[#1c1917] group-hover:text-[#a37c6b] transition-colors" />
                    {mounted && itemCount > 0 && (
                      <span className="absolute -top-2 -right-2.5 bg-[#3d2b1f] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-3">
              <a
                href="https://instagram.com/lezarijewels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 text-[#1c1917] hover:text-[#e1306c]"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#1c1917] relative"
                aria-label="Open Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#3d2b1f] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -mr-2 text-[#1c1917]"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[#e7e5e4] flex items-center justify-between">
              <span className="font-serif text-sm uppercase tracking-widest text-[#1c1917]">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#78716c] hover:text-[#1c1917]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-6 space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium tracking-[0.2em] uppercase py-3 border-b border-[#f5f5f4] text-[#1c1917] hover:text-[#a37c6b]"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium tracking-[0.2em] uppercase py-3 border-b border-[#f5f5f4] text-[#1c1917] hover:text-[#a37c6b]"
              >
                Shop All Jewellery
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium tracking-[0.2em] uppercase py-3 border-b border-[#f5f5f4] text-[#1c1917] hover:text-[#a37c6b]"
              >
                Account
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-medium tracking-[0.2em] uppercase py-3 border-b border-[#f5f5f4] text-[#1c1917] hover:text-[#a37c6b]"
              >
                Contact Us
              </Link>

              <div className="pt-6">
                <a
                  href="https://instagram.com/lezarijewels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[#e7e5e4] text-xs font-medium tracking-wider uppercase text-[#1c1917] hover:border-[#e1306c] hover:text-[#e1306c] transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" /> Follow on Instagram
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
