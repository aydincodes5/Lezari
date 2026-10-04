import prisma from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count({ where: { role: "CUSTOMER" } });
  
  // Aggregate total sales from paid orders (assuming "PAID" or "DELIVERED")
  const paidOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }
  });
  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    include: { user: true }
  });

  return (
    <div>
      <h1 className="text-2xl font-serif text-foreground mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex items-center">
          <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-2xl font-medium">₹{totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex items-center">
          <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-2xl font-medium">{orderCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex items-center">
          <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Products</p>
            <h3 className="text-2xl font-medium">{productCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border flex items-center">
          <div className="p-3 rounded-full bg-primary-50 text-primary-600 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Customers</p>
            <h3 className="text-2xl font-medium">{userCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="font-medium text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-800">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length > 0 ? recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm">{order.user.name || order.user.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium">₹{order.total.toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No recent orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
