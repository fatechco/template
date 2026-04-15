"use client";
// @ts-nocheck
import { useState } from "react";
import { Plus, Copy, Trash2, Check, X, Ticket, ToggleLeft, ToggleRight } from "lucide-react";

const MOCK_COUPONS = [
  { id: "c1", code: "CEMENT20", type: "Percentage", value: 20, minOrder: 50, maxUses: 100, usedCount: 43, product: "All Products", startDate: "2025-03-01", endDate: "2025-03-31", active: true },
  { id: "c2", code: "STEEL50OFF", type: "Fixed Amount", value: 50, minOrder: 300, maxUses: 30, usedCount: 12, product: "Steel Rods", startDate: "2025-03-10", endDate: "2025-04-10", active: true },
  { id: "c3", code: "FREESHIP", type: "Free Shipping", value: 0, minOrder: 100, maxUses: 200, usedCount: 89, product: "All Products", startDate: "2025-02-01", endDate: "2025-02-28", active: false },
  { id: "c4", code: "VIP15", type: "Percentage", value: 15, minOrder: 0, maxUses: 50, usedCount: 7, product: "All Products", startDate: "2025-04-01", endDate: "2025-04-30", active: true },
];

const COUPON_TYPES = ["Percentage", "Fixed Amount", "Free Shipping"];
const EMPTY_FORM = { code: "", type: "Percentage", value: "", minOrder: "", maxUses: "", product: "All Products", startDate: "", endDate: "" };

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function KemetroSellerCoupons() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = (e) => {
    e.preventDefault();
    const newCoupon = { ...form, id: `c-${Date.now()}`, usedCount: 0, active: true };
    setCoupons([newCoupon, ...coupons]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleCoupon = (id) => setCoupons(coupons.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCoupon = (id) => { if (confirm("Delete this coupon?")) setCoupons(coupons.filter((c) => c.id !== id)); };

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

  const totalSavings = coupons.reduce((s, c) => {
    if (c.type === "Percentage") return s + (c.usedCount * c.minOrder * c.value / 100);
    if (c.type === "Fixed Amount") return s + (c.usedCount * c.value);
    return s;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create discount codes for your customers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
          <Check size={18} /> Coupon created successfully!
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Coupons", value: coupons.length, color: "text-gray-900" },
          { label: "Active", value: coupons.filter((c) => c.active).length, color: "text-green-600" },
          { label: "Total Uses", value: coupons.reduce((s, c) => s + c.usedCount, 0), color: "text-teal-600" },
          { label: "Est. Discounts Given", value: `$${totalSavings.toFixed(0)}`, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-lg">Create New Coupon</h3>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input required value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} className={inputClass} placeholder="e.g. SUMMER20" />
                  <button type="button" onClick={() => set("code", generateCode())} className="whitespace-nowrap border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                    Generate
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    {COUPON_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {form.type !== "Free Shipping" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {form.type === "Percentage" ? "Discount %" : "Amount ($)"} <span className="text-red-500">*</span>
                    </label>
                    <input required type="number" min="0" value={form.value} onChange={(e) => set("value", e.target.value)} className={inputClass} placeholder={form.type === "Percentage" ? "e.g. 20" : "e.g. 50"} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Minimum Order ($)</label>
                  <input type="number" min="0" value={form.minOrder} onChange={(e) => set("minOrder", e.target.value)} className={inputClass} placeholder="0 = no minimum" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Max Uses</label>
                  <input type="number" min="1" value={form.maxUses} onChange={(e) => set("maxUses", e.target.value)} className={inputClass} placeholder="0 = unlimited" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Applicable Products</label>
                <input value={form.product} onChange={(e) => set("product", e.target.value)} className={inputClass} placeholder="e.g. All Products, Cement 50kg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                  <input required type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">Create Coupon</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon) => {
          const usagePercent = coupon.maxUses > 0 ? Math.round((coupon.usedCount / coupon.maxUses) * 100) : 0;
          const isExpired = new Date(coupon.endDate) < new Date();
          return (
            <div key={coupon.id} className={`bg-white rounded-xl border-2 p-5 space-y-3 ${coupon.active && !isExpired ? "border-teal-200" : "border-gray-200 opacity-70"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Ticket size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 font-mono tracking-wider">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.id, coupon.code)} className="text-gray-400 hover:text-teal-600 transition-colors">
                        {copiedId === coupon.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{coupon.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleCoupon(coupon.id)} className="text-gray-400 hover:text-teal-600 transition-colors">
                    {coupon.active ? <ToggleRight size={22} className="text-teal-500" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => deleteCoupon(coupon.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-orange-100 text-orange-700 font-black text-sm px-3 py-1 rounded-lg">
                  {coupon.type === "Free Shipping" ? "Free Shipping" : coupon.type === "Percentage" ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                </span>
                {coupon.minOrder > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">Min. ${coupon.minOrder}</span>
                )}
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isExpired ? "bg-red-100 text-red-600" : coupon.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {isExpired ? "Expired" : coupon.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage: {coupon.usedCount} / {coupon.maxUses > 0 ? coupon.maxUses : "∞"}</span>
                  <span>{coupon.startDate} – {coupon.endDate}</span>
                </div>
                {coupon.maxUses > 0 && (
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${usagePercent}%` }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}