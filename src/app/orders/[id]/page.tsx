import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Truck, Clock, AlertCircle, ArrowLeft, Printer, ShieldCheck, MapPin } from "lucide-react";
import { getOrderById } from "@/lib/orders";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

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

  const currentIdx = getStepIndex(order.status);
  const steps = [
    { title: "Order Placed", desc: "Order confirmed & sent to dispatch" },
    { title: "Processing", desc: "Jewellery boxed in luxury velvet pack" },
    { title: "Dispatched", desc: "Handed over to courier express partner" },
    { title: "Delivered", desc: "Doorstep delivery confirmed" },
  ];

  return (
    <div className="bg-[#fffdf6] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e7e5e4]">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#78716c] hover:text-[#1c1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Order Lookup
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              className="text-xs text-[#a37c6b] hover:text-[#3d2b1f] uppercase tracking-wider font-semibold"
            >
              Shop More
            </Link>
          </div>
        </div>

        {/* Invoice / Receipt Card */}
        <div className="bg-white border border-[#e7e5e4] shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#e7e5e4]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-serif text-xl font-bold tracking-widest text-[#1c1917]">LEZARI</span>
                <span className="text-xs tracking-[0.3em] uppercase text-[#a37c6b]">JEWELS</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#78716c] block">Official Order Receipt</span>
              <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#3d2b1f] mt-0.5">
                #{order.id}
              </h1>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <p className="text-[#78716c]">
                Placed:{" "}
                <span className="font-medium text-[#1c1917]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="text-[#78716c]">
                Payment: <span className="font-medium text-[#1c1917]">{order.paymentMethod}</span>
              </p>
              <p className="text-[#78716c]">
                Status:{" "}
                <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 border border-green-200">
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Delivery Progress Bar */}
          <div className="bg-[#fdf8f6] border border-[#eaddd7] p-6 rounded space-y-4">
            <h3 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-semibold">
              Live Shipment Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {steps.map((st, i) => {
                const isComplete = i <= currentIdx && order.status !== "CANCELLED";
                const isCurrent = i === currentIdx && order.status !== "CANCELLED";

                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isCurrent
                          ? "bg-[#3d2b1f] text-white ring-4 ring-[#eaddd7]"
                          : isComplete
                          ? "bg-green-600 text-white"
                          : "bg-white text-[#a8a29e] border border-[#e7e5e4]"
                      }`}
                    >
                      {isComplete && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <p className={`text-xs font-semibold ${isComplete ? "text-[#1c1917]" : "text-[#a8a29e]"}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-[#78716c] mt-0.5">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="pt-3 border-t border-[#eaddd7] flex flex-wrap items-center justify-between text-xs text-[#78716c]">
                <span>
                  Courier: <strong className="text-[#1c1917]">{order.courierPartner || "Express Delivery"}</strong>
                </span>
                <span>
                  AWB / Tracking Number: <strong className="font-mono text-[#3d2b1f]">{order.trackingNumber}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="font-serif text-sm uppercase tracking-wider text-[#1c1917] mb-4">
              Ordered Items ({order.items.length})
            </h3>

            <div className="border border-[#e7e5e4] divide-y divide-[#e7e5e4]">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4">
                  <div className="relative w-16 h-18 bg-[#f5f5f4] flex-shrink-0 border border-[#e7e5e4] overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-semibold text-[#1c1917]">{item.name}</p>
                    <p className="text-xs text-[#78716c] mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#3d2b1f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[11px] text-[#a8a29e]">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="pt-4 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs border-t border-[#e7e5e4] pt-4">
                <div className="flex justify-between text-[#78716c]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1c1917]">₹{order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#78716c]">
                  <span>Shipping</span>
                  <span className="font-medium text-green-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#3d2b1f] pt-2 border-t border-[#e7e5e4] font-bold">
                  <span>Grand Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#e7e5e4]">
            <div className="border border-[#e7e5e4] p-5 space-y-1 bg-[#fdf8f6]">
              <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#3d2b1f]" /> Delivery Address
              </h4>
              <p className="text-xs font-semibold text-[#1c1917]">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-[#78716c]">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p className="text-xs text-[#78716c]">{order.shippingAddress.line2}</p>}
              <p className="text-xs text-[#78716c]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-xs text-[#78716c] pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            <div className="border border-[#e7e5e4] p-5 space-y-2 bg-[#fdf8f6] text-xs text-[#78716c]">
              <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3d2b1f]" /> The Lezari Guarantee
              </h4>
              <p>• 100% Stainless steel fashion jewellery</p>
              <p>• 7-Day easy replacement for damaged or transit issues</p>
              <p>• Questions? Email us at <strong className="text-[#1c1917]">hello@lezarijewels.com</strong></p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[#e7e5e4] gap-4">
            <Link
              href="/shop"
              className="btn-primary text-xs uppercase tracking-widest py-3 px-8"
            >
              Continue Shopping
            </Link>

            <Link
              href="/orders"
              className="text-xs text-[#78716c] hover:text-[#1c1917] uppercase tracking-wider font-medium"
            >
              Track Another Order
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
