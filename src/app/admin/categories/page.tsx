import prisma from "@/lib/prisma";
import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-foreground">Categories</h1>
        <button className="bg-primary-900 text-white px-4 py-2 text-sm uppercase tracking-widest font-medium hover:bg-primary-800 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Image</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Slug</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length > 0 ? categories.map(cat => (
              <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-10 w-10 flex-shrink-0 bg-muted relative rounded overflow-hidden">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">Img</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-sm">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    cat.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cat.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button className="text-primary-600 hover:text-primary-900 inline-flex items-center p-2">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 inline-flex items-center p-2 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
