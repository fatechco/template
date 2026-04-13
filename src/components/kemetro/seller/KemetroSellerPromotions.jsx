import { useState } from "react";
import { Plus, Megaphone, Eye, Edit, Trash2, TrendingUp, MousePointer, ShoppingCart, Check, X } from "lucide-react";

const MOCK_PROMOTIONS = [
  { id: "promo-1", title: "Cement Flash Sale", type: "Flash Sale", discount: "15%", product: "Premium Cement 50kg", startDate: "2025-03-15", endDate: "2025-03-20", status: "Active", impressions: 1240, clicks: 87, conversions: 14 },
  { id: "promo-2", title: "Buy 10 Get 1 Free – Steel Rods", type: "Bundle Offer", discount: "Free Item", product: "Steel Rods 10mm", startDate: "2025-03-10", endDate: "2025-03-31", status: "Active", impressions: 830, clicks: 45, conversions: 8 },
  { id: "promo-3", title: "Spring Paint Sale", type: "Percentage Off", discount: "20%", product: "All Paint Products", startDate: "2025-03-01", endDate: "2025-03-10", status: "Ended", impressions: 2100, clicks: 198, conversions: 31 },
  { id: "promo-4", title: "Tiles Clearance", type: "Fixed Amount Off", discount: "$5 off", product: "Ceramic Tiles 60×60", startDate: "2025-04-01", endDate: "2025-04-15", status: "Scheduled", impressions: 0, clicks: 0, conversions: 0 },
];

const PROMO_TYPES = ["Flash Sale", "Percentage Off", "Fixed Amount Off", "Bundle Offer", "Free Shipping"];

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Ended: "bg-gray-100 text-gray-500",
  Scheduled: "bg-blue-100 text-blue-700",
  Paused: "bg-yellow-100 text-yellow-700",
};

const EMPTY_FORM = { title: "", type: "Flash Sale", discount: "", product: "", startDate: "", endDate: "", description: "" };

export default function KemetroSellerPromotions() {
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleCreate = (e) => {
    e.preventDefault();
    const newPromo = { ...form, id: `promo-${Date.now()}`, status: "Scheduled", impressions: 0, clicks: 0, conversions: 0 };
    setPromotions([newPromo, ...promotions]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deletePromo = (id) => {
    if (confirm("Delete this promotion?")) setPromotions(promotions.filter((p) => p.id !== id));
  };

  const totalImpressions = promotions.reduce((s, p) => s + p.impressions, 0);
  const totalClicks = promotions.reduce((s, p) => s + p.clicks, 0);
  const totalConversions = promotions.reduce((s, p) => s + p.conversions, 0);

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount campaigns for your products</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors">
          <Plus size={18} /> Create Promotion
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 font-semibold text-sm">
          <Check size={18} /> Promotion created successfully!
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Impressions", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-blue-600 bg-blue-50" },
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointer, color: "text-orange-600 bg-orange-50" },
          { label: "Total Conversions", value: totalConversions.toLocaleString(), icon: ShoppingCart, color: "text-teal-600 bg-teal-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-lg">Create New Promotion</h3>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Promotion Title <span className="text-red-500">*</span></label>
                <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="e.g. Summer Cement Sale" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                    {PROMO_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Value <span className="text-red-500">*</span></label>
                  <input required value={form.discount} onChange={(e) => set("discount", e.target.value)} className={inputClass} placeholder="e.g. 20% or $5 off" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product / Category</label>
                <input value={form.product} onChange={(e) => set("product", e.target.value)} className={inputClass} placeholder="e.g. All Cement Products" />
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none" placeholder="Optional details..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">Create Promotion</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Promotion</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Discount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Duration</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Impressions</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Clicks</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Conv.</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.product}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.type}</td>
                  <td className="px-4 py-3 font-bold text-orange-600">{p.discount}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.startDate}<br />{p.endDate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{p.impressions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{p.clicks}</td>
                  <td className="px-4 py-3 text-right font-bold text-teal-700">{p.conversions}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-teal-600 transition-colors"><Edit size={15} /></button>
                      <button onClick={() => deletePromo(p.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
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