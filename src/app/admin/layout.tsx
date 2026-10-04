import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LayoutDashboard, Package, Image as ImageIcon, ShoppingCart, Users, Settings } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-serif text-primary-900 mb-1">Admin Panel</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Lezari Jewels</p>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <LayoutDashboard className="h-5 w-5 mr-3 text-primary-600" />
              Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <Package className="h-5 w-5 mr-3 text-primary-600" />
              Products
            </Link>
            <Link href="/admin/categories" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <ImageIcon className="h-5 w-5 mr-3 text-primary-600" />
              Categories
            </Link>
            <Link href="/admin/hero" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <ImageIcon className="h-5 w-5 mr-3 text-primary-600" />
              Hero Slider
            </Link>
            <Link href="/admin/orders" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <ShoppingCart className="h-5 w-5 mr-3 text-primary-600" />
              Orders
            </Link>
            <Link href="/admin/customers" className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-primary-50 text-foreground transition-colors">
              <Users className="h-5 w-5 mr-3 text-primary-600" />
              Customers
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
