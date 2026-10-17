"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: session.user?.name || prev.fullName,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  if (!mounted) return null;

  const subtotal = getTotal();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.fullName,
            email: formData.email,
          },
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderComplete(data.orderId);
        clearCart();
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#eef7ee] text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#a37c6b] mb-2 font-medium">Order Confirmed</p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1c1917] mb-4">Thank You for Your Order!</h1>
        <p className="text-[#78716c] mb-6 max-w-md mx-auto text-sm leading-relaxed">
          Your order has been placed successfully. A detailed email confirmation has been sent to our dispatch team and your inbox.
        </p>

        <div className="bg-[#fdf8f6] border border-[#eaddd7] p-6 max-w-md mx-auto mb-8 text-left">
          <p className="text-xs uppercase tracking-widest text-[#78716c] mb-1">Order ID</p>
          <p className="font-mono text-lg font-bold text-[#3d2b1f] mb-4">{orderComplete}</p>
          <div className="h-px bg-[#eaddd7] my-3" />
          <p className="text-xs text-[#78716c] mb-1">Deliver To:</p>
          <p className="text-sm font-medium text-[#1c1917]">{formData.fullName}</p>
          <p className="text-sm text-[#78716c]">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
          <p className="text-sm text-[#78716c] mt-1">Phone: {formData.phone}</p>
        </div>

        <Link href="/shop" className="btn-primary inline-flex items-center text-xs tracking-widest py-3 px-8">
          Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-[#eaddd7] mx-auto mb-6" />
        <h1 className="text-2xl font-serif text-[#1c1917] mb-4">Your Cart is Empty</h1>
        <p className="text-[#78716c] text-sm mb-8">Add your favorite jewellery pieces before heading to checkout.</p>
        <Link href="/shop" className="btn-primary text-xs py-3 px-6 inline-block">
          Explore Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fffdf6] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#e7e5e4]">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#a37c6b] font-medium">Checkout</span>
            <h1 className="text-2xl sm:text-3xl font-serif text-[#1c1917]">Delivery & Payment</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#78716c] bg-white px-3 py-1.5 border border-[#e7e5e4]">
            <Lock className="w-3.5 h-3.5 text-[#3d2b1f]" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Shipping Form (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 border border-[#e7e5e4] space-y-6">
              
              <div>
                <h2 className="font-serif text-lg text-[#1c1917] mb-1">Contact Details</h2>
                <p className="text-xs text-[#78716c] mb-4">Order confirmation and tracking details will be sent here.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Shaheen A."
                      className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. shaheen@gmail.com"
                      className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f5f5f4] pt-6">
                <h2 className="font-serif text-lg text-[#1c1917] mb-1">Delivery Address</h2>
                <p className="text-xs text-[#78716c] mb-4">Please provide a complete address for timely delivery.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">Street Address / House No. *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Flat 302, Rose Villa, MG Road"
                      className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">State *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g. Maharashtra"
                        className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g. 400001"
                        className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1.5">Mobile Phone (for Courier OTP) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full border border-[#e7e5e4] px-3 py-2.5 text-sm focus:border-[#3d2b1f] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-[#f5f5f4] pt-6">
                <h2 className="font-serif text-lg text-[#1c1917] mb-3">Payment Option</h2>
                <div className="border border-[#3d2b1f] bg-[#fdf8f6] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="radio" id="cod" name="payment" defaultChecked className="accent-[#3d2b1f]" />
                    <label htmlFor="cod" className="text-sm font-medium text-[#1c1917] cursor-pointer">
                      Cash on Delivery / UPI on Delivery
                    </label>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase bg-[#3d2b1f] text-white px-2 py-0.5">Popular</span>
                </div>
                <p className="text-[11px] text-[#78716c] mt-2">
                  Pay with Cash or scan UPI QR code directly with the courier delivery partner upon doorstep delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 uppercase tracking-[0.2em] text-xs font-medium flex items-center justify-center transition-all disabled:opacity-50"
              >
                {loading ? "Processing Order..." : `Confirm Order • ₹${grandTotal.toFixed(2)}`}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-[#78716c] pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#3d2b1f]" /> 100% Anti-Tarnish</span>
                <span>•</span>
                <span>7-Day Replacement</span>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit space-y-6">
            <div className="bg-white border border-[#e7e5e4] p-6">
              <h2 className="font-serif text-base text-[#1c1917] uppercase tracking-wider pb-4 mb-4 border-b border-[#e7e5e4]">
                Order Items ({items.reduce((c, i) => c + i.quantity, 0)})
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-16 bg-[#f5f5f4] flex-shrink-0 border border-[#f5f5f4]">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-medium text-[#1c1917] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#78716c]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-[#3d2b1f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e7e5e4] mt-6 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-[#78716c]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1c1917]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#78716c]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#1c1917]">
                    {shipping === 0 ? <span className="text-green-700">FREE</span> : `₹${shipping}.00`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#3d2b1f] pt-3 border-t border-[#e7e5e4]">
                  <span>Total Payable</span>
                  <span className="font-bold">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Promise Box */}
            <div className="bg-[#fdf8f6] border border-[#eaddd7] p-5 text-xs space-y-2 text-[#78716c]">
              <p className="font-medium text-[#3d2b1f] uppercase tracking-wider text-[11px]">The Lezari Guarantee</p>
              <p>• Premium 18K gold PVD plating</p>
              <p>• Zero tarnishing or discoloration</p>
              <p>• Discreet luxury jewellery box packaging</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
