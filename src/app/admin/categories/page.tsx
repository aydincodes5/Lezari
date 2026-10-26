"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
  enabled?: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({
    name: "",
    slug: "",
    image: "",
    enabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      showMessage("Category updated successfully.");
    }
    setSaving(false);
  }

  async function deleteCat(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showMessage("Category deleted.");
    }
  }

  async function toggleStatus(id: string, currentEnabled: boolean) {
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled: !currentEnabled }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showMessage("Status updated.");
    }
  }

  async function addCat() {
    if (!newCat.name || !newCat.image) {
      alert("Please provide both name and image URL.");
      return;
    }
    const slug = newCat.slug || newCat.name.toLowerCase().replace(/\s+/g, "-");
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCat, slug }),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setIsAdding(false);
      setNewCat({ name: "", slug: "", image: "", enabled: true });
      showMessage("Category created.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">Categories</h1>
          <p className="text-xs text-[#78716c] mt-1">Manage shop collections and category circle photos</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#3d2b1f] text-white px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-[#a37c6b] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2.5 text-xs">
          {message}
        </div>
      )}

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-white border border-[#e7e5e4] p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1c1917]">Add New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Category Name *</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="e.g. Brooches & Pins"
                value={newCat.name}
                onChange={(e) => setNewCat((c) => ({ ...c, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Slug (optional)</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="brooches"
                value={newCat.slug}
                onChange={(e) => setNewCat((c) => ({ ...c, slug: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-[#78716c] block mb-1">Image URL *</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="https://images.unsplash.com/... or /path-to-image"
                value={newCat.image}
                onChange={(e) => setNewCat((c) => ({ ...c, image: e.target.value }))}
              />
              {newCat.image && (
                <div className="mt-2 h-20 w-20 rounded-full relative border border-[#e7e5e4] overflow-hidden bg-gray-50">
                  <Image src={newCat.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={addCat}
              disabled={saving}
              className="px-4 py-2 bg-[#3d2b1f] text-white text-xs uppercase tracking-wider hover:bg-[#a37c6b] transition-colors"
            >
              Save Category
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-[#e7e5e4] text-xs text-[#78716c] hover:border-[#3d2b1f] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-[#e7e5e4] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fdf8f6] border-b border-[#e7e5e4]">
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e5e4]">
            {categories.map((cat) => {
              const isEditing = editingId === cat.id;
              return (
                <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-14 w-14 rounded-full relative bg-gray-100 border border-[#e7e5e4] overflow-hidden">
                      {cat.image ? (
                        <Image src={isEditing && editForm.image ? editForm.image : cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-xs text-gray-400">Img</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1c1917]">
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          className="w-full border border-[#e7e5e4] px-2 py-1 text-xs outline-none focus:border-[#3d2b1f]"
                          value={editForm.name ?? cat.name}
                          onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                          placeholder="Category name"
                        />
                        <input
                          className="w-full border border-[#e7e5e4] px-2 py-1 text-xs outline-none focus:border-[#3d2b1f]"
                          value={editForm.image ?? cat.image}
                          onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                          placeholder="Image URL"
                        />
                      </div>
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#78716c]">
                    {isEditing ? (
                      <input
                        className="w-full border border-[#e7e5e4] px-2 py-1 text-xs outline-none focus:border-[#3d2b1f]"
                        value={editForm.slug ?? cat.slug}
                        onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                      />
                    ) : (
                      cat.slug
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(cat.id, cat.enabled ?? true)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        cat.enabled !== false
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {cat.enabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {cat.enabled !== false ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => saveEdit(cat.id)}
                          disabled={saving}
                          className="p-1.5 text-green-700 hover:bg-green-50 rounded"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditForm({ name: cat.name, slug: cat.slug, image: cat.image });
                          }}
                          className="p-1.5 text-[#78716c] hover:text-[#1c1917] hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCat(cat.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="py-12 text-center text-xs text-[#78716c]">No categories found. Click &ldquo;Add Category&rdquo; above.</div>
        )}
      </div>
    </div>
  );
}
