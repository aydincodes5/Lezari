"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm({ label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save address");
      const data = await res.json();
      if (editingId) {
        setAddresses(prev => prev.map(a => a.id === editingId ? data : a));
      } else {
        setAddresses(prev => [...prev, data]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError("Could not save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#e7e5e4]">
        <h2 className="text-xl font-serif text-[#1c1917]">Saved Addresses</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 text-sm border border-[#3d2b1f] text-[#3d2b1f] px-4 py-2 hover:bg-[#3d2b1f] hover:text-white transition-colors uppercase tracking-widest"
        >
          <Plus className="w-3.5 h-3.5" /> Add Address
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-[#fdf8f6] border border-[#eaddd7] p-6">
          <h3 className="font-medium text-[#1c1917] mb-5 uppercase tracking-widest text-sm">
            {editingId ? "Edit Address" : "New Address"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {["Home", "Work", "Other"].map(l => (
                <button
                  key={l} type="button"
                  onClick={() => setForm(f => ({ ...f, label: l }))}
                  className={`py-2 text-xs uppercase tracking-widest border transition-colors ${form.label === l ? 'bg-[#3d2b1f] text-white border-[#3d2b1f]' : 'border-[#e7e5e4] text-[#78716c] hover:border-[#3d2b1f]'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">Full Name *</label>
                <input className="input-field" required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">Phone *</label>
                <input className="input-field" required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">Address Line 1 *</label>
              <input className="input-field" required placeholder="Flat / House no., Street" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">Address Line 2</label>
              <input className="input-field" placeholder="Area, Colony (Optional)" value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">City *</label>
                <input className="input-field" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">State *</label>
                <input className="input-field" required value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#78716c] mb-1.5">Pincode *</label>
                <input className="input-field" required type="text" pattern="[0-9]{6}" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#3d2b1f]" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
              <span className="text-sm text-[#1c1917]">Set as default address</span>
            </label>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary text-xs px-8 py-3 disabled:opacity-60">
                {saving ? "Saving..." : "Save Address"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary text-xs px-8 py-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-[#fdf8f6] border border-[#eaddd7]">
          <MapPin className="w-10 h-10 text-[#d2bab0] mx-auto mb-4" />
          <p className="text-[#78716c] mb-2">No saved addresses yet.</p>
          <p className="text-xs text-[#a37c6b]">Add an address to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`relative border p-5 bg-white ${addr.isDefault ? 'border-[#a37c6b]' : 'border-[#e7e5e4]'}`}>
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest bg-[#3d2b1f] text-white px-2 py-0.5">
                  Default
                </span>
              )}
              <p className="text-[10px] uppercase tracking-widest text-[#a37c6b] mb-2 font-medium">{addr.label}</p>
              <p className="font-medium text-[#1c1917] text-sm">{addr.fullName}</p>
              <p className="text-sm text-[#78716c] mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-sm text-[#78716c]">{addr.city}, {addr.state} – {addr.pincode}</p>
              <p className="text-sm text-[#78716c] mt-0.5">{addr.phone}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-[#f5f5f4]">
                <button onClick={() => handleEdit(addr)} className="text-xs uppercase tracking-widest text-[#3d2b1f] hover:text-[#a37c6b] flex items-center gap-1.5 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
