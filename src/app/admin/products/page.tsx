"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff, Star } from "lucide-react";
import { Product } from "@/lib/catalog";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    price: 299,
    original_price: 599,
    discount: 50,
    category: "Necklaces",
    categorySlug: "necklaces",
    description: "",
    images: [""],
    stock: 50,
    available: true,
    best_seller: false,
    new_arrival: false,
  });

  useEffect(() => {
    fetch("/api/admin/products").then((r) => r.json()).then(setProducts);
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingProduct.id, ...form }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
      setEditingProduct(null);
      showMessage("Product updated successfully.");
    }
    setSaving(false);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Name and Price are required.");
      return;
    }
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categorySlug = (form.category || "Necklaces").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const images = (form.images || []).filter(Boolean);
    if (images.length === 0) {
      images.push("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop");
    }

    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug,
        categorySlug,
        images,
        available: true,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setIsAdding(false);
      showMessage("Product created successfully.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showMessage("Product deleted.");
    }
  }

  async function toggleAvailability(id: string, current: boolean) {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, available: !current }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showMessage("Product visibility updated.");
    }
  }

  function startEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      discount: product.discount,
      category: product.category,
      categorySlug: product.categorySlug,
      description: product.description,
      images: product.images && product.images.length > 0 ? product.images : [""],
      stock: product.stock,
      available: product.available,
      best_seller: product.best_seller,
      new_arrival: product.new_arrival,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">Products</h1>
          <p className="text-xs text-[#78716c] mt-1">Manage shop jewellery, photos, pricing, and inventory</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingProduct(null);
            setForm({
              name: "",
              slug: "",
              price: 299,
              original_price: 599,
              discount: 50,
              category: "Necklaces",
              categorySlug: "necklaces",
              description: "Crafted in surgical-grade stainless steel with gold-toned finish.",
              images: [""],
              stock: 50,
              available: true,
              best_seller: false,
              new_arrival: true,
            });
          }}
          className="bg-[#3d2b1f] text-white px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-[#a37c6b] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2.5 text-xs">
          {message}
        </div>
      )}

      {/* Product Modal / Form (Add or Edit) */}
      {(isAdding || editingProduct) && (
        <div className="bg-white border border-[#e7e5e4] p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#e7e5e4] pb-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1c1917]">
              {isAdding ? "Add New Product" : `Edit Product: ${editingProduct?.name}`}
            </h2>
            <button
              onClick={() => { setIsAdding(false); setEditingProduct(null); }}
              className="text-[#78716c] hover:text-[#1c1917]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={isAdding ? handleAddProduct : handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#78716c] block mb-1">Product Name *</label>
                <input
                  required
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                  value={form.name || ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-[#78716c] block mb-1">Category</label>
                <select
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none bg-white"
                  value={form.category || "Necklaces"}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const catSlug = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    setForm((f) => ({ ...f, category: cat, categorySlug: catSlug }));
                  }}
                >
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Rings">Rings</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Anklets">Anklets</option>
                  <option value="Combos & Sets">Combos & Sets</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#78716c] block mb-1">Sale Price (Rs.) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                  value={form.price || ""}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label className="text-xs text-[#78716c] block mb-1">Original Price (Rs.)</label>
                <input
                  type="number"
                  step="1"
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                  value={form.original_price || ""}
                  onChange={(e) => setForm((f) => ({ ...f, original_price: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label className="text-xs text-[#78716c] block mb-1">Stock Count</label>
                <input
                  type="number"
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                  value={form.stock || 0}
                  onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                />
              </div>

              <div>
                <label className="text-xs text-[#78716c] block mb-1">Slug</label>
                <input
                  className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                  placeholder="auto-generated-if-empty"
                  value={form.slug || ""}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                />
              </div>
            </div>

            {/* Images section */}
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Primary Image URL *</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="https://images.unsplash.com/... or image link"
                value={(form.images && form.images[0]) || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((f) => {
                    const imgs = [...(f.images || [""])];
                    imgs[0] = val;
                    return { ...f, images: imgs };
                  });
                }}
              />
              {form.images && form.images[0] && (
                <div className="mt-2 h-24 w-24 relative border border-[#e7e5e4] overflow-hidden bg-gray-50">
                  <Image src={form.images[0]} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-[#78716c] block mb-1">Secondary Hover Image URL (optional)</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="https://images.unsplash.com/..."
                value={(form.images && form.images[1]) || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((f) => {
                    const imgs = [...(f.images || [""])];
                    imgs[1] = val;
                    return { ...f, images: imgs };
                  });
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#78716c] block mb-1">Description</label>
              <textarea
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none min-h-[70px]"
                value={form.description || ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-[#1c1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.best_seller || false}
                  onChange={(e) => setForm((f) => ({ ...f, best_seller: e.target.checked }))}
                />
                Mark as Bestseller
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#1c1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.new_arrival || false}
                  onChange={(e) => setForm((f) => ({ ...f, new_arrival: e.target.checked }))}
                />
                Mark as New In
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-[#1c1917] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.available !== false}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                />
                Active (In Stock / Visible)
              </label>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-[#3d2b1f] text-white text-xs uppercase tracking-wider hover:bg-[#a37c6b] transition-colors"
              >
                {saving ? "Saving..." : isAdding ? "Create Product" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                className="px-4 py-2.5 border border-[#e7e5e4] text-xs text-[#78716c] hover:border-[#3d2b1f] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-[#e7e5e4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fdf8f6] border-b border-[#e7e5e4]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Badges</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e5e4]">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 relative flex-shrink-0 bg-gray-100 border border-[#e7e5e4] overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">💎</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1c1917] truncate max-w-xs">{product.name}</p>
                        <p className="text-[11px] text-[#78716c] truncate">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-[#78716c]">{product.category}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-[#1c1917]">
                    ₹{product.price}
                    {product.original_price && (
                      <span className="text-[#a8a29e] line-through font-normal ml-1.5 text-[11px]">
                        ₹{product.original_price}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-[#78716c]">{product.stock}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {product.best_seller && (
                        <span className="bg-[#3d2b1f] text-white text-[9px] uppercase px-1.5 py-0.5 font-medium">Bestseller</span>
                      )}
                      {product.new_arrival && (
                        <span className="bg-[#a37c6b] text-white text-[9px] uppercase px-1.5 py-0.5 font-medium">New In</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleAvailability(product.id, product.available)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium border ${
                        product.available
                          ? "bg-green-50 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {product.available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {product.available ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-1.5 text-[#78716c] hover:text-[#1c1917] hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
