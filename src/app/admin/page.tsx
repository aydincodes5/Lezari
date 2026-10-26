import prisma from "@/lib/prisma";
import { getProducts } from "@/lib/catalog";
import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign, Star, Image as ImageIcon } from "lucide-react";

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let userCount = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];

  try {
    productCount = await prisma.product.count();
    orderCount = await prisma.order.count();
    userCount = await prisma.user.count({ where: { role: "CUSTOMER" } });
    const paidOrders = await prisma.order.findMany({
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }
    });
    totalRevenue = paidOrders.reduce((sum: number, order: any) => sum + order.total, 0);
    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { user: true }
    });
  } catch (e) {
    console.warn("Prisma admin dashboard query skipped:", e);
  }

  if (productCount === 0) {
    productCount = getProducts().length;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-[#1c1917]">Dashboard Overview</h1>
        <p className="text-xs text-[#78716c] mt-1">Store health, quick management shortcuts, and metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 shadow-xs border border-[#e7e5e4] flex items-center">
          <div className="p-3 rounded-full bg-[#fdf8f6] text-[#3d2b1f] mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716c] uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-serif font-medium text-[#1c1917]">₹{totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-xs border border-[#e7e5e4] flex items-center">
          <div className="p-3 rounded-full bg-[#fdf8f6] text-[#3d2b1f] mr-4">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716c] uppercase tracking-wider mb-1">Total Orders</p>
            <h3 className="text-2xl font-serif font-medium text-[#1c1917]">{orderCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-xs border border-[#e7e5e4] flex items-center">
          <div className="p-3 rounded-full bg-[#fdf8f6] text-[#3d2b1f] mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716c] uppercase tracking-wider mb-1">Products</p>
            <h3 className="text-2xl font-serif font-medium text-[#1c1917]">{productCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-xs border border-[#e7e5e4] flex items-center">
          <div className="p-3 rounded-full bg-[#fdf8f6] text-[#3d2b1f] mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-[#78716c] uppercase tracking-wider mb-1">Customers</p>
            <h3 className="text-2xl font-serif font-medium text-[#1c1917]">{userCount}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/products"
          className="p-5 bg-white border border-[#e7e5e4] hover:border-[#3d2b1f] transition-colors group flex flex-col justify-between"
        >
          <div>
            <Package className="w-5 h-5 text-[#3d2b1f] mb-2" />
            <h3 className="font-serif text-sm text-[#1c1917] group-hover:text-[#a37c6b] transition-colors font-semibold">
              Manage Products
            </h3>
            <p className="text-xs text-[#78716c] mt-1">Change prices, photos, stock, and product details</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#a37c6b] font-medium mt-4 block">Edit Products &rarr;</span>
        </Link>

        <Link
          href="/admin/categories"
          className="p-5 bg-white border border-[#e7e5e4] hover:border-[#3d2b1f] transition-colors group flex flex-col justify-between"
        >
          <div>
            <ImageIcon className="w-5 h-5 text-[#3d2b1f] mb-2" />
            <h3 className="font-serif text-sm text-[#1c1917] group-hover:text-[#a37c6b] transition-colors font-semibold">
              Category Circles
            </h3>
            <p className="text-xs text-[#78716c] mt-1">Change photos and names for category circles</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#a37c6b] font-medium mt-4 block">Edit Categories &rarr;</span>
        </Link>

        <Link
          href="/admin/hero"
          className="p-5 bg-white border border-[#e7e5e4] hover:border-[#3d2b1f] transition-colors group flex flex-col justify-between"
        >
          <div>
            <ImageIcon className="w-5 h-5 text-[#3d2b1f] mb-2" />
            <h3 className="font-serif text-sm text-[#1c1917] group-hover:text-[#a37c6b] transition-colors font-semibold">
              Hero Slider
            </h3>
            <p className="text-xs text-[#78716c] mt-1">Change homepage banner slider images</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#a37c6b] font-medium mt-4 block">Edit Slider &rarr;</span>
        </Link>

        <Link
          href="/admin/reviews"
          className="p-5 bg-white border border-[#e7e5e4] hover:border-[#3d2b1f] transition-colors group flex flex-col justify-between"
        >
          <div>
            <Star className="w-5 h-5 text-[#3d2b1f] mb-2" />
            <h3 className="font-serif text-sm text-[#1c1917] group-hover:text-[#a37c6b] transition-colors font-semibold">
              Reviews & Visibility
            </h3>
            <p className="text-xs text-[#78716c] mt-1">Show/hide reviews section on homepage & edit text</p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#a37c6b] font-medium mt-4 block">Manage Reviews &rarr;</span>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow-xs border border-[#e7e5e4] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e7e5e4] flex justify-between items-center bg-[#fdf8f6]">
          <h2 className="font-serif text-base text-[#1c1917]">Recent Orders</h2>
          <span className="text-xs text-[#78716c]">Automated confirmation emails sent via Gmail</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e7e5e4]">
                <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e5e4]">
              {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-[#1c1917]">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-xs text-[#1c1917]">{order.user?.name || order.user?.email || "Customer"}</td>
                  <td className="px-6 py-4 text-xs text-[#78716c]">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-800 border border-green-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-right font-medium text-[#1c1917]">₹{order.total.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-xs text-[#78716c]">
                    New orders placed via checkout will appear here. Order alerts are emailed directly to admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
