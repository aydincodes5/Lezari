"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { OrderRecord } from "@/lib/orders";

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedOrder(data);
      } else {
        setError("No order found with this ID. Please verify the ID from your confirmation email.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve order details. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const steps = [
    { title: "Order Placed", desc: "Received & Confirmed" },
    { title: "Processing", desc: "Inspected & Packed" },
    { title: "In Transit", desc: "Dispatched with Courier" },
    { title: "Delivered", desc: "Package Handed Over" },
  ];

  return (
    <div className="bg-[#fffdf6] min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#a37c6b] font-semibold block mb-2">
            Order Tracking & Fulfilment
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1c1917] mb-3">
            Track Your Jewellery Order
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] leading-relaxed">
            Enter your Lezari Order ID (e.g. <span className="font-mono text-[#3d2b1f]">ORD-LZR-98214</span>) below to check the real-time shipping status and delivery updates.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white border border-[#e7e5e4] p-6 sm:p-8 shadow-xs max-w-2xl mx-auto mb-12">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#78716c] font-semibold mb-2">
                Order ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. ORD-LZR-98214"
                  className="w-full bg-[#fdf8f6] border border-[#e7e5e4] pl-10 pr-4 py-3 text-sm font-mono text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#3d2b1f] focus:bg-white outline-none transition-all uppercase"
                />
                <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Checking Dispatch Status...</span>
              ) : (
                <>
                  <span>Track Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#f5f5f4] flex justify-between items-center text-xs text-[#78716c]">
            <span>Have an account with us?</span>
            <Link href="/account/orders" className="text-[#3d2b1f] font-semibold hover:underline">
              View All Past Orders &rarr;
            </Link>
          </div>
        </div>

        {/* Search Result */}
        {searchedOrder && (
          <div className="bg-white border border-[#e7e5e4] shadow-md p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-[#e7e5e4] gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#a37c6b] font-medium block">
                  Order Details
                </span>
                <h2 className="font-mono text-xl sm:text-2xl font-bold text-[#1c1917]">
                  #{searchedOrder.id}
                </h2>
                <p className="text-xs text-[#78716c] mt-0.5">
                  Ordered on {new Date(searchedOrder.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block">
                  Total Payable
                </span>
                <span className="font-serif text-2xl font-bold text-[#3d2b1f]">
                  ₹{searchedOrder.total.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#a8a29e] block mt-0.5">
                  {searchedOrder.paymentMethod}
                </span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="font-serif text-sm uppercase tracking-wider text-[#1c1917] mb-6">
                Delivery Progress
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                {steps.map((st, i) => {
                  const currentIdx = getStepIndex(searchedOrder.status);
                  const isComplete = i <= currentIdx && searchedOrder.status !== "CANCELLED";
                  const isCurrent = i === currentIdx && searchedOrder.status !== "CANCELLED";

                  return (
                    <div key={i} className="flex flex-col items-center text-center relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          isCurrent
                            ? "bg-[#3d2b1f] text-white ring-4 ring-[#eaddd7]"
                            : isComplete
                            ? "bg-green-600 text-white"
                            : "bg-[#f5f5f4] text-[#a8a29e] border border-[#e7e5e4]"
                        }`}
                      >
                        {isComplete && !isCurrent ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <p className={`text-xs font-semibold ${isComplete ? "text-[#1c1917]" : "text-[#a8a29e]"}`}>
                        {st.title}
                      </p>
                      <p className="text-[10px] text-[#78716c] mt-0.5 max-w-[120px]">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {searchedOrder.trackingNumber && (
                <div className="mt-6 p-4 bg-[#fdf8f6] border border-[#eaddd7] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78716c] block">Courier Partner</span>
                    <span className="font-medium text-[#1c1917]">{searchedOrder.courierPartner || "Express Delivery"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#78716c] block">Tracking / AWB Number</span>
                    <span className="font-mono font-bold text-[#3d2b1f]">{searchedOrder.trackingNumber}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Line items & address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#e7e5e4]">
              {/* Items */}
              <div>
                <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-3">
                  Items in this Shipment ({searchedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {searchedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-[#fdf8f6] border border-[#f5f5f4]">
                      <div className="relative w-12 h-14 bg-white flex-shrink-0 border border-[#e7e5e4] overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-medium text-[#1c1917] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#78716c]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-[#3d2b1f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping to */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-2">
                    Shipping Destination
                  </h4>
                  <div className="p-3 bg-[#fdf8f6] border border-[#f5f5f4] text-xs space-y-1">
                    <p className="font-semibold text-[#1c1917]">{searchedOrder.shippingAddress.fullName}</p>
                    <p className="text-[#78716c]">{searchedOrder.shippingAddress.line1}</p>
                    {searchedOrder.shippingAddress.line2 && <p className="text-[#78716c]">{searchedOrder.shippingAddress.line2}</p>}
                    <p className="text-[#78716c]">
                      {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-[#78716c] pt-1">Phone: {searchedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/orders/${searchedOrder.id}`}
                    className="btn-primary w-full py-2.5 text-center text-xs uppercase tracking-wider block"
                  >
                    Open Full Printable Receipt &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
