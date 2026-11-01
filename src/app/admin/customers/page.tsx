"use client";

import { useEffect, useState } from "react";
import { Users, Search, ShoppingBag, Mail, Phone, MapPin, RefreshCw } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  status: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = () => {
    setLoading(true);
    fetch("/api/admin/customers")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">Customer Accounts</h1>
          <p className="text-xs text-[#78716c] mt-0.5">Directory of registered shoppers and order customers</p>
        </div>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#e7e5e4] bg-white text-xs text-[#1c1917] hover:border-[#3d2b1f] transition-colors rounded shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e7e5e4] p-4 shadow-xs rounded">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, email, phone or city..."
            className="w-full bg-[#fdf8f6] border border-[#e7e5e4] pl-10 pr-4 py-2.5 text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:border-[#3d2b1f] focus:bg-white outline-none rounded transition-colors"
          />
          <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#e7e5e4] shadow-xs rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf8f6] border-b border-[#e7e5e4]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Contact</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-center">Orders</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Total Spent</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e5e4]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#78716c]">
                    <div className="w-6 h-6 border-2 border-[#3d2b1f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading customers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-[#78716c]">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((customer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#fdf8f6] border border-[#eaddd7] text-[#3d2b1f] font-serif font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {customer.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#1c1917]">{customer.name}</p>
                          <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.2 rounded border border-green-200">
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#78716c]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#a8a29e]" />
                        <span className="text-[#1c1917]">{customer.email}</span>
                      </div>
                      {customer.phone && customer.phone !== "Not provided" && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                          <Phone className="w-3 h-3 text-[#a8a29e]" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#78716c]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#a8a29e]" />
                        <span>{customer.city}{customer.state ? `, ${customer.state}` : ""}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-center font-semibold text-[#1c1917]">
                      {customer.orderCount}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-[#3d2b1f]">
                      ₹{customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-xs text-[#78716c]">
                      {new Date(customer.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
