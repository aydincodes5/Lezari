"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Package, Search, Filter, Truck, CheckCircle2, Clock, AlertCircle, 
  Trash2, Eye, Edit3, X, Check, ExternalLink, RefreshCw 
} from "lucide-react";
import { OrderRecord, OrderStatus } from "@/lib/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [editOrder, setEditOrder] = useState<OrderRecord | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>("PENDING");
  const [editTracking, setEditTracking] = useState("");
  const [editCourier, setEditCourier] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOrder) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editOrder.id,
          status: editStatus,
          trackingNumber: editTracking,
          courierPartner: editCourier,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === editOrder.id ? updated : o)));
        if (selectedOrder?.id === editOrder.id) {
          setSelectedOrder(updated);
        }
        setEditOrder(null);
        showNotification(`Order #${editOrder.id} status updated to ${editStatus}.`);
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete Order #${id}?`)) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (selectedOrder?.id === id) setSelectedOrder(null);
        showNotification("Order deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      (o.phone && o.phone.includes(q)) ||
      (o.shippingAddress?.city && o.shippingAddress.city.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">Delivered</span>;
      case "SHIPPED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Shipped</span>;
      case "PROCESSING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Processing</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">Pending</span>;
    }
  };

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: orders.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">Customer Orders</h1>
          <p className="text-xs text-[#78716c] mt-0.5">Manage fulfilment, update dispatch status & view customer addresses</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#e7e5e4] bg-white text-xs text-[#1c1917] hover:border-[#3d2b1f] transition-colors rounded shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2.5 text-xs rounded">
          {message}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-[#e7e5e4] p-4 shadow-xs space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 border-b border-[#f5f5f4] pb-3">
          {(["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${
                statusFilter === st
                  ? "bg-[#3d2b1f] text-white shadow-2xs"
                  : "bg-[#fdf8f6] text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f5f4]"
              }`}
            >
              <span>{st === "ALL" ? "All Orders" : st.charAt(0) + st.slice(1).toLowerCase()}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === st ? "bg-white/20 text-white" : "bg-black/5 text-[#78716c]"
              }`}>
                {statusCounts[st]}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email, phone or city..."
            className="w-full bg-[#fdf8f6] border border-[#e7e5e4] pl-10 pr-4 py-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#3d2b1f] focus:bg-white outline-none rounded transition-colors"
          />
          <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a8a29e] hover:text-[#1c1917]">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#e7e5e4] shadow-xs rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf8f6] border-b border-[#e7e5e4]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e5e4]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#78716c]">
                    <div className="w-6 h-6 border-2 border-[#3d2b1f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#78716c]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-[#3d2b1f] block">{order.id}</span>
                      <span className="text-[10px] text-[#a8a29e] block mt-0.5">{order.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-[#1c1917]">{order.customerName}</div>
                      <div className="text-[11px] text-[#78716c]">{order.customerEmail}</div>
                      {order.phone && <div className="text-[10px] text-[#a8a29e]">{order.phone}</div>}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#78716c]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <div className="text-[10px] text-[#a8a29e]">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs text-[#1c1917] font-medium">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      </div>
                      <div className="text-[10px] text-[#78716c] truncate max-w-xs">
                        {order.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#1c1917]">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-5 py-4">
                      {getStatusBadge(order.status)}
                      {order.trackingNumber && (
                        <div className="text-[10px] text-[#78716c] font-mono mt-1">
                          #{order.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#78716c] hover:text-[#3d2b1f] hover:bg-gray-100 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditOrder(order);
                            setEditStatus(order.status);
                            setEditTracking(order.trackingNumber || "");
                            setEditCourier(order.courierPartner || "");
                          }}
                          className="p-1.5 text-[#a37c6b] hover:text-[#3d2b1f] hover:bg-gray-100 rounded"
                          title="Update Status"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/orders/${order.id}`}
                          target="_blank"
                          className="p-1.5 text-[#78716c] hover:text-[#1c1917] hover:bg-gray-100 rounded"
                          title="Customer Receipt View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-[#e7e5e4] p-6 shadow-2xl rounded">
            <div className="flex justify-between items-center pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="font-serif text-base text-[#1c1917]">Update Order Status</h3>
                <p className="text-xs text-[#78716c] font-mono mt-0.5">#{editOrder.id}</p>
              </div>
              <button onClick={() => setEditOrder(null)} className="text-[#78716c] hover:text-[#1c1917]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold text-[#1c1917] block mb-1">Fulfilment Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm outline-none focus:border-[#3d2b1f] rounded bg-white"
                >
                  <option value="PENDING">PENDING (Order Placed)</option>
                  <option value="PROCESSING">PROCESSING (Packing Jewellery)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                  <option value="DELIVERED">DELIVERED (Customer Received)</option>
                  <option value="CANCELLED">CANCELLED (Order Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1917] block mb-1">Courier Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Dart, Delhivery, DTDC"
                  value={editCourier}
                  onChange={(e) => setEditCourier(e.target.value)}
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm outline-none focus:border-[#3d2b1f] rounded"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1917] block mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  placeholder="e.g. 7738291048"
                  value={editTracking}
                  onChange={(e) => setEditTracking(e.target.value)}
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm outline-none focus:border-[#3d2b1f] rounded font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-grow bg-[#3d2b1f] text-white py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-[#a37c6b] transition-colors rounded"
                >
                  {saving ? "Saving..." : "Save Status"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditOrder(null)}
                  className="px-4 py-2.5 border border-[#e7e5e4] text-xs text-[#78716c] hover:border-[#3d2b1f] rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e7e5e4] p-6 sm:p-8 shadow-2xl rounded space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-[#e7e5e4]">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#a37c6b] font-medium">Order Details</span>
                <h2 className="font-serif text-2xl text-[#1c1917] font-bold">{selectedOrder.id}</h2>
                <p className="text-xs text-[#78716c] mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#78716c] hover:text-[#1c1917]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Status & Courier Info */}
            <div className="bg-[#fdf8f6] border border-[#eaddd7] p-4 flex flex-wrap items-center justify-between gap-4 rounded">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716c] block">Current Status</span>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716c] block">Courier Partner</span>
                <span className="text-xs font-medium text-[#1c1917]">{selectedOrder.courierPartner || "Standard Express"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716c] block">Tracking No.</span>
                <span className="text-xs font-mono font-bold text-[#3d2b1f]">{selectedOrder.trackingNumber || "Not assigned"}</span>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="border border-[#e7e5e4] p-4 rounded">
                <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-2">Customer Info</h4>
                <p className="text-sm font-medium text-[#1c1917]">{selectedOrder.customerName}</p>
                <p className="text-xs text-[#78716c] mt-0.5">{selectedOrder.customerEmail}</p>
                <p className="text-xs text-[#78716c] mt-0.5">{selectedOrder.phone || selectedOrder.shippingAddress?.phone}</p>
              </div>
              <div className="border border-[#e7e5e4] p-4 rounded">
                <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-2">Shipping Address</h4>
                <p className="text-xs text-[#1c1917] leading-relaxed">
                  {selectedOrder.shippingAddress.line1}
                  {selectedOrder.shippingAddress.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                  <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-xs text-[#78716c] mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-serif text-xs uppercase tracking-wider text-[#1c1917] font-bold mb-3">Order Items ({selectedOrder.items.length})</h4>
              <div className="border border-[#e7e5e4] divide-y divide-[#e7e5e4] rounded overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-gray-100 flex-shrink-0 border border-[#e7e5e4] overflow-hidden rounded">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-semibold text-[#1c1917] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#78716c]">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#3d2b1f]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] text-[#a8a29e]">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-[#e7e5e4] pt-4 flex justify-between items-center text-sm">
              <span className="font-serif text-base text-[#1c1917] font-bold">Total Paid / Payable</span>
              <span className="font-serif text-lg font-bold text-[#3d2b1f]">₹{selectedOrder.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href={`/orders/${selectedOrder.id}`}
                target="_blank"
                className="px-4 py-2 border border-[#3d2b1f] text-[#3d2b1f] hover:bg-[#3d2b1f] hover:text-white transition-colors text-xs uppercase tracking-wider font-medium rounded"
              >
                Customer Tracking Link &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
