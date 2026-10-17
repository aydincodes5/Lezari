import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminProducts() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
          take: 1
        }
      },
      orderBy: { created_at: "desc" }
    });
  } catch (e) {
    console.warn("Prisma products read skipped:", e);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-foreground">Products</h1>
        <Link href="/admin/products/new" className="bg-primary-900 text-white px-4 py-2 text-sm uppercase tracking-widest font-medium hover:bg-primary-800 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length > 0 ? products.map((product: any) => (
                <tr key={product.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-muted relative rounded overflow-hidden mr-4">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">💎</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.category?.name || <span className="text-muted-foreground italic">None</span>}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">₹{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.available ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-primary-600 hover:text-primary-900 inline-flex items-center p-2">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="text-red-500 hover:text-red-700 inline-flex items-center p-2 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found. <Link href="/admin/products/new" className="text-primary-600 hover:underline">Create one</Link>.
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
