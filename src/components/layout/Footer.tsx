import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary-50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6 relative h-12 w-32">
              <Image 
                src="/logo.png" 
                alt="Lezari Jewels" 
                fill 
                style={{ objectFit: 'contain', objectPosition: 'left' }}
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Premium anti-tarnish and stainless-steel jewellery. Elegant, timeless, and minimal designs for the modern woman.
            </p>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop/necklaces" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Necklaces</Link></li>
              <li><Link href="/shop/earrings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Earrings</Link></li>
              <li><Link href="/shop/rings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rings</Link></li>
              <li><Link href="/shop/bracelets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bracelets</Link></li>
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/care" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Jewellery Care</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-field rounded-none border-r-0 w-full"
                required
              />
              <button type="submit" className="bg-primary-900 text-white px-4 text-sm font-medium tracking-wide uppercase hover:bg-primary-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lezari Jewels. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
