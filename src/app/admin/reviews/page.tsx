"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Edit2, Plus, Check, X, Eye, EyeOff } from "lucide-react";

interface Review {
  id: number;
  quote: string;
  author: string;
  verified: boolean;
  product: string;
  rating: number;
}

interface Settings {
  reviewsVisible: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<Settings>({ reviewsVisible: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Review>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<Review, "id">>({
    quote: "",
    author: "",
    verified: true,
    product: "",
    rating: 5,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reviews").then((r) => r.json()).then(setReviews);
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }

  async function toggleReviewsVisibility() {
    setSaving(true);
    const newVisible = !settings.reviewsVisible;
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewsVisible: newVisible }),
    });
    if (res.ok) {
      setSettings((s) => ({ ...s, reviewsVisible: newVisible }));
      showMessage(newVisible ? "Reviews section shown on homepage." : "Reviews section hidden from homepage.");
    }
    setSaving(false);
  }

  async function saveEdit(id: number) {
    setSaving(true);
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editForm }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditingId(null);
      showMessage("Review updated.");
    }
    setSaving(false);
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showMessage("Review deleted.");
    }
  }

  async function addReview() {
    if (!newForm.quote || !newForm.author) return;
    setSaving(true);
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    if (res.ok) {
      const created = await res.json();
      setReviews((prev) => [...prev, created]);
      setIsAdding(false);
      setNewForm({ quote: "", author: "", verified: true, product: "", rating: 5 });
      showMessage("Review added.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#1c1917]">Customer Reviews</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleReviewsVisibility}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border transition-colors ${
              settings.reviewsVisible
                ? "bg-green-50 border-green-300 text-green-800 hover:bg-green-100"
                : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {settings.reviewsVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Reviews: {settings.reviewsVisible ? "Visible" : "Hidden"}
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3d2b1f] text-white text-sm font-medium hover:bg-[#a37c6b] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Review
          </button>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* Add Review Form */}
      {isAdding && (
        <div className="bg-white border border-[#e7e5e4] p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1c1917]">New Review</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Author Name *</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                value={newForm.author}
                onChange={(e) => setNewForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Priya Sharma"
              />
            </div>
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Product</label>
              <input
                className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                value={newForm.product}
                onChange={(e) => setNewForm((f) => ({ ...f, product: e.target.value }))}
                placeholder="Tulip Necklace"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#78716c] block mb-1">Review Text *</label>
            <textarea
              className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none min-h-[80px]"
              value={newForm.quote}
              onChange={(e) => setNewForm((f) => ({ ...f, quote: e.target.value }))}
              placeholder="Share the customer experience..."
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs text-[#78716c] block mb-1">Rating</label>
              <select
                className="border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none"
                value={newForm.rating}
                onChange={(e) => setNewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                id="verified-new"
                checked={newForm.verified}
                onChange={(e) => setNewForm((f) => ({ ...f, verified: e.target.checked }))}
              />
              <label htmlFor="verified-new" className="text-sm text-[#78716c]">Verified Buyer</label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addReview} disabled={saving} className="px-4 py-2 bg-[#3d2b1f] text-white text-sm hover:bg-[#a37c6b] transition-colors">
              Add Review
            </button>
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 border border-[#e7e5e4] text-sm text-[#78716c] hover:border-[#3d2b1f] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-[#e7e5e4] p-5">
            {editingId === review.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#78716c] block mb-1">Author</label>
                    <input
                      className="w-full border border-[#e7e5e4] px-3 py-1.5 text-sm focus:border-[#3d2b1f] outline-none"
                      value={editForm.author ?? review.author}
                      onChange={(e) => setEditForm((f) => ({ ...f, author: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#78716c] block mb-1">Product</label>
                    <input
                      className="w-full border border-[#e7e5e4] px-3 py-1.5 text-sm focus:border-[#3d2b1f] outline-none"
                      value={editForm.product ?? review.product}
                      onChange={(e) => setEditForm((f) => ({ ...f, product: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#78716c] block mb-1">Review</label>
                  <textarea
                    className="w-full border border-[#e7e5e4] px-3 py-2 text-sm focus:border-[#3d2b1f] outline-none min-h-[70px]"
                    value={editForm.quote ?? review.quote}
                    onChange={(e) => setEditForm((f) => ({ ...f, quote: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    className="border border-[#e7e5e4] px-3 py-1.5 text-sm"
                    value={editForm.rating ?? review.rating}
                    onChange={(e) => setEditForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-[#78716c]">
                    <input
                      type="checkbox"
                      checked={editForm.verified ?? review.verified}
                      onChange={(e) => setEditForm((f) => ({ ...f, verified: e.target.checked }))}
                    />
                    Verified
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(review.id)} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3d2b1f] text-white text-xs hover:bg-[#a37c6b]">
                    <Check className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e7e5e4] text-xs text-[#78716c]">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-[#d4af37]">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />)}
                    </div>
                    {review.verified && (
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5">Verified</span>
                    )}
                  </div>
                  <p className="text-sm text-[#1c1917] italic mb-2">&ldquo;{review.quote}&rdquo;</p>
                  <div className="text-xs text-[#78716c]">
                    <span className="font-semibold text-[#1c1917]">{review.author}</span>
                    {review.product && <span> · {review.product}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditingId(review.id); setEditForm({}); }}
                    className="p-2 text-[#78716c] hover:text-[#1c1917] border border-transparent hover:border-[#e7e5e4] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-[#78716c] hover:text-red-600 border border-transparent hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 text-[#78716c] text-sm">No reviews yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
