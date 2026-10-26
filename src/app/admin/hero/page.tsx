"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X, Eye, EyeOff } from "lucide-react";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  active?: boolean;
  order?: number;
}

export default function AdminHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HeroSlide>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newSlide, setNewSlide] = useState({
    image: "",
    title: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/hero").then((r) => r.json()).then(setSlides);
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch("/api/admin/hero", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
      showMessage("Slide updated successfully.");
    }
    setSaving(false);
  }

  async function deleteSlide(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    const res = await fetch("/api/admin/hero", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
      showMessage("Slide deleted.");
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const res = await fetch("/api/admin/hero", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !currentActive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showMessage("Slide status updated.");
    }
  }

  async function addSlide() {
    if (!newSlide.image) {
      alert("Please enter an image URL");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlide),
    });
    if (res.ok) {
      const created = await res.json();
      setSlides((prev) => [...prev, created]);
      setIsAdding(false);
      setNewSlide({ image: "", title: "", active: true });
      showMessage("New slide added.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#1c1917]">Hero Slider</h1>
          <p className="text-xs text-[#78716c] mt-1">Manage banner images on the homepage hero slider</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#3d2b1f] text-white px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-[#a37c6b] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2.5 text-xs">
          {message}
        </div>
      )}

      {/* Add Slide Form */}
      {isAdding && (
        <div className="bg-white border border-[#e7e5e4] p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1c1917]">Add New Hero Slide</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Image URL *</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="https://images.unsplash.com/... or /path-to-image"
                value={newSlide.image}
                onChange={(e) => setNewSlide((s) => ({ ...s, image: e.target.value }))}
              />
              {newSlide.image && (
                <div className="mt-2 h-28 w-56 relative border border-[#e7e5e4] overflow-hidden bg-gray-50">
                  <Image src={newSlide.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Title / Caption</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                placeholder="e.g. Summer Collection"
                value={newSlide.title}
                onChange={(e) => setNewSlide((s) => ({ ...s, title: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={addSlide}
              disabled={saving}
              className="px-4 py-2 bg-[#3d2b1f] text-white text-xs uppercase tracking-wider hover:bg-[#a37c6b] transition-colors"
            >
              Save Slide
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

      {/* Slides Table */}
      <div className="bg-white border border-[#e7e5e4] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fdf8f6] border-b border-[#e7e5e4]">
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Preview</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Image URL</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-[11px] font-semibold text-[#78716c] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e5e4]">
            {slides.map((slide) => {
              const isEditing = editingId === slide.id;
              return (
                <tr key={slide.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-16 w-32 relative bg-gray-100 border border-[#e7e5e4] overflow-hidden">
                      {slide.image ? (
                        <Image src={isEditing && editForm.image ? editForm.image : slide.image} alt={slide.title} fill className="object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-xs text-gray-400">No Image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1c1917]">
                    {isEditing ? (
                      <input
                        className="w-full border border-[#e7e5e4] px-2 py-1 text-xs outline-none focus:border-[#3d2b1f]"
                        value={editForm.title ?? slide.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      />
                    ) : (
                      slide.title || <span className="text-[#a8a29e] italic">No title</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#78716c] max-w-xs truncate">
                    {isEditing ? (
                      <input
                        className="w-full border border-[#e7e5e4] px-2 py-1 text-xs outline-none focus:border-[#3d2b1f]"
                        value={editForm.image ?? slide.image}
                        onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                      />
                    ) : (
                      <span className="truncate block" title={slide.image}>{slide.image}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(slide.id, slide.active ?? true)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        slide.active !== false
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {slide.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {slide.active !== false ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => saveEdit(slide.id)}
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
                            setEditingId(slide.id);
                            setEditForm({ image: slide.image, title: slide.title });
                          }}
                          className="p-1.5 text-[#78716c] hover:text-[#1c1917] hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSlide(slide.id)}
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
        {slides.length === 0 && (
          <div className="py-12 text-center text-xs text-[#78716c]">No slides configured. Click &ldquo;Add Slide&rdquo; above.</div>
        )}
      </div>
    </div>
  );
}
