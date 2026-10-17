"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, ShieldCheck, Droplets, Sparkles, Truck } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";

export default function Footer() {
  return (
    <footer className="bg-[#fffdf6] border-t border-[#e7e5e4] mt-24">
      {/* Value Proposition Strip */}
      <div className="border-b border-[#e7e5e4] bg-[#fdf8f6] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1c1917]">Anti-Tarnish</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">18K Thick Gold PVD Plating</p>
            </div>
            <div className="flex flex-col items-center">
              <Droplets className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1c1917]">Waterproof</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">Shower, Sweat & Pool Safe</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1c1917]">Hypoallergenic</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">100% Nickel & Lead Free</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-6 h-6 text-[#3d2b1f] mb-2" />
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#1c1917]">Free Shipping</h4>
              <p className="text-[11px] text-[#78716c] mt-0.5">On all orders above ₹999</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Info & Larger Logo */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Lezari Jewels" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] text-[#1c1917] font-semibold block leading-tight">
                  LEZARI
                </span>
                <span className="text-[10px] tracking-[0.4em] text-[#a37c6b] uppercase font-medium block">
                  JEWELS
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#78716c] leading-relaxed max-w-sm">
              Everyday waterproof and anti-tarnish luxury jewellery crafted for the modern muse. 
              Designed to look like real fine gold without the price tag.
            </p>

            {/* Instagram Follow Button */}
            <div className="pt-2">
              <a
                href="https://instagram.com/lezarijewels"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#3d2b1f] text-white text-xs uppercase tracking-widest hover:bg-[#a37c6b] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#eaddd7]" />
                <span>Follow @lezarijewels</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#1c1917] mb-5">Shop</h4>
            <ul className="space-y-3 text-xs text-[#78716c]">
              <li><Link href="/shop?category=necklaces" className="hover:text-[#3d2b1f] transition-colors">Necklaces</Link></li>
              <li><Link href="/shop?category=earrings" className="hover:text-[#3d2b1f] transition-colors">Earrings</Link></li>
              <li><Link href="/shop?category=rings" className="hover:text-[#3d2b1f] transition-colors">Rings</Link></li>
              <li><Link href="/shop?category=bracelets" className="hover:text-[#3d2b1f] transition-colors">Bracelets</Link></li>
              <li><Link href="/shop?category=anklets" className="hover:text-[#3d2b1f] transition-colors">Anklets</Link></li>
              <li><Link href="/shop" className="hover:text-[#3d2b1f] transition-colors font-medium">All Jewellery</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#1c1917] mb-5">Support</h4>
            <ul className="space-y-3 text-xs text-[#78716c]">
              <li><Link href="/contact" className="hover:text-[#3d2b1f] transition-colors">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-[#3d2b1f] transition-colors">My Account</Link></li>
              <li><Link href="/cart" className="hover:text-[#3d2b1f] transition-colors">View Cart</Link></li>
              <li><span className="text-[#a8a29e]">Free Shipping above ₹999</span></li>
              <li><span className="text-[#a8a29e]">Pan-India Delivery</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#1c1917] mb-3">VIP Club</h4>
            <p className="text-xs text-[#78716c] mb-4 leading-relaxed">
              Subscribe to get 10% off your first purchase and VIP access to new drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Lezari Jewels VIP!"); }} className="space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-xs focus:border-[#3d2b1f] outline-none"
                />
                <button type="submit" className="bg-[#3d2b1f] text-white px-4 text-xs uppercase tracking-wider hover:bg-[#a37c6b] transition-colors">
                  Join
                </button>
              </div>
              <p className="text-[10px] text-[#a8a29e]">We respect your privacy. No spam ever.</p>
            </form>
          </div>

        </div>
        
        {/* Bottom Credits */}
        <div className="border-t border-[#e7e5e4] mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#78716c] gap-4">
          <p>&copy; {new Date().getFullYear()} Lezari Jewels. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>18K Gold Plated Jewellery</span>
            <span>•</span>
            <a href="https://instagram.com/lezarijewels" target="_blank" rel="noopener noreferrer" className="hover:text-[#e1306c] flex items-center gap-1">
              <InstagramIcon className="w-3.5 h-3.5" /> @lezarijewels
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
