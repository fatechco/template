"use client";
// @ts-nocheck
import { useState } from "react";
import { Plus, Megaphone, Trash2, ToggleLeft, ToggleRight, X, Calendar, Tag } from "lucide-react";

const INITIAL_PROMOS = [
  { id: 1, title: "Ramadan Mega Sale", type: "Banner", seller: "All Sellers", discount: "20%", startDate: "2025-03-01", endDate: "2025-04-01", active: true, impressions: 18400, clicks: 2100 },
  { id: 2, title: "BuildRight Flash Deal", type: "Flash Deal", seller: "BuildRight Materials", discount: "15%", startDate: "2025-03-10", endDate: "2025-03-20", active: true, impressions: 5200, clicks: 870 },
  { id: 3, title: "New Sellers Spotlight", type: "Featured", seller: "Multiple Sellers", discount: "—", startDate: "2025-03-01", endDate: "2025-03-31", active: false, impressions: 3100, clicks: 420 },
  { id: 4, title: "Tiles & Flooring Week", type: "Category Banner", seller: "Tile Experts Co.", discount: "10%", startDate: "2025-03-15", endDate: "2025-03-22", active: true, impressions: 9800, clicks: 1340 },
  { id: 5, title: "Free Shipping Weekend", type: "Site-wide", seller: "All Sellers", discount: "Free Ship", startDate: "2025-03-08", endDate: "2025-03-09", active: false, impressions: 22000, clicks: 4500 },
];

const PROMO_TYPES = ["Banner", "Flash Deal", "Featured", "Category Banner", "Site-wide", "Pop-up"];
const EMPTY_FORM = { title: "", type: "Banner", seller: "All Sellers", discount: "", startDate: "", endDate: "" };

const TYPE_COLORS = {
  Banner: "bg-blue-100 text-blue-700",
  "Flash Deal": "bg-red-100 text-red-700",
  Featured: "bg-purple-100 text-purple-700",
  "Category Banner": "bg-teal-100 text-teal-700",
  "Site-wide": "bg-orange-100 text-orange-700",
  "Pop-up": "bg-pink-100 text-pink-700",
};

export default function KemetroAdminPromotions() {
  const [promos, setPromos] = useState(INITIAL_PROMOS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.title) return;
    setPromos([...promos, { id: Date.now(), ...form, active: true, impressions: 0, clicks: 0 }]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const toggleActive = (id) => setPromos(promos.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const deletePromo = (id) => setPromos(promos.filter((p) => p.id !== id));

  const stats = [
    { label: "Active Promotions", value: promos.filter((p) => p.active).length, color: "text-green-700", bg: "bg-green-50" },
    { label: "Total Impressions", value: promos.reduce((s, p) => s + p.impressions, 0).toLocaleString(), color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Total Clicks", value: promos.reduce((s, p) => s + p.clicks, 0).toLocaleString(), color: "text-purple-700", bg: "bg-purple-50" },
    { label: "Avg CTR", value: (promos.reduce((s, p) => s + (p.impressions ? p.clicks / p.impressions : 0), 0) / promos.length * 100).toFixed(1) + "%", color: "text-orange-700", bg: "bg-orange-50" },
  ];

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Promotions & Banners</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> New Promotion
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border border-gray-200 p-4 ${s.bg}`}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {promos.map((promo) => (
          <div key={promo.id} className={`bg-white rounded-xl border p-5 transition-all ${promo.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone size={18} className="text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-black text-gray-900">{promo.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[promo.type] || "bg-gray-100 text-gray-600"}`}>{promo.type}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${promo.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{promo.active ? "Active" : "Paused"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Tag size={11} /> {promo.seller}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {promo.startDate} → {promo.endDate}</span>
                    {promo.discount !== "—" && <span className="font-bold text-orange-600">Discount: {promo.discount}</span>}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span><span className="font-bold text-gray-900">{promo.impressions.toLocaleString()}</span> impressions</span>
                    <span><span className="font-bold text-gray-900">{promo.clicks.toLocaleString()}</span> clicks</span>
                    <span>CTR: <span className="font-bold text-blue-600">{promo.impressions ? ((promo.clicks / promo.impressions) * 100).toFixed(1) : 0}%</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(promo.id)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  {promo.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
                </button>
                <button onClick={() => deletePromo(promo.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900">New Promotion</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="e.g. Ramadan Mega Sale" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    {PROMO_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount / Offer</label>
                  <input value={form.discount} onChange={(e) => set("discount", e.target.value)} className={inputClass} placeholder="e.g. 20%" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Target Seller</label>
                <input value={form.seller} onChange={(e) => set("seller", e.target.value)} className={inputClass} placeholder="All Sellers or specific seller name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleCreate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Create</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}