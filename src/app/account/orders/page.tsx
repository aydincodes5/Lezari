"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock, AlertCircle, ExternalLink, ShoppingBag } from "lucide-react";
import { OrderRecord } from "@/lib/orders";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Order Placed
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e7e5e4]">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">My Orders</h1>
          <p className="text-xs text-[#78716c] mt-0.5">Track and view your jewellery purchases</p>
        </div>
        <Link
          href="/orders"
          className="text-xs text-[#a37c6b] hover:text-[#3d2b1f] font-medium flex items-center gap-1 uppercase tracking-wider"
        >
          Track by ID <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#78716c] text-xs space-y-3">
          <div className="w-8 h-8 border-2 border-[#3d2b1f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-[#fdf8f6] border border-[#eaddd7] px-4">
          <ShoppingBag className="w-12 h-12 text-[#a37c6b] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#1c1917] mb-1">No Orders Yet</h3>
          <p className="text-[#78716c] text-xs max-w-sm mx-auto mb-6">
            You haven't placed any orders yet. Discover our latest collection of waterproof stainless steel jewellery!
          </p>
          <Link
            href="/shop"
            className="btn-primary inline-block text-xs uppercase tracking-widest py-3 px-8"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#e7e5e4] shadow-xs hover:border-[#d6d3d1] transition-all overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-[#fdf8f6] px-5 py-4 border-b border-[#e7e5e4] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#78716c] block">Order ID</span>
                  <span className="font-mono text-sm font-bold text-[#3d2b1f]">{order.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#78716c] block">Date Placed</span>
                  <span className="text-xs text-[#1c1917] font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#78716c] block">Total Amount</span>
                  <span className="text-xs font-bold text-[#1c1917]">₹{order.total.toFixed(2)}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Content */}
              <div className="p-5 space-y-4">
                {/* Items */}
                <div className="divide-y divide-[#f5f5f4]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="relative w-16 h-18 bg-[#f5f5f4] flex-shrink-0 border border-[#e7e5e4] overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-[#1c1917] truncate">{item.name}</p>
                        <p className="text-xs text-[#78716c] mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#3d2b1f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-[10px] text-[#a8a29e]">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer bar with tracking & action */}
                <div className="pt-4 border-t border-[#f5f5f4] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[#78716c]">
                    <span className="font-medium text-[#1c1917]">Delivery to: </span>
                    {order.shippingAddress.fullName}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                  </div>

                  <div className="flex items-center gap-3">
                    {order.trackingNumber && (
                      <span className="text-[11px] bg-[#f5f5f4] text-[#3d2b1f] px-2.5 py-1 font-mono rounded">
                        Track: {order.trackingNumber}
                      </span>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 border border-[#3d2b1f] text-[#3d2b1f] hover:bg-[#3d2b1f] hover:text-white transition-colors uppercase tracking-wider text-[11px] font-medium"
                    >
                      View Receipt & Track
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
