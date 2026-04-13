import { useState } from "react";
import { Plus, Edit, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_CONFIGS = {
  "property-categories": {
    title: "Property Categories",
    singular: "Category",
    mockData: [
      { id: 1, icon: "🏠", name: "Apartment", name_ar: "شقة", slug: "apartment", count: 1842, active: true, sort: 1 },
      { id: 2, icon: "🏡", name: "Villa", name_ar: "فيلا", slug: "villa", count: 634, active: true, sort: 2 },
      { id: 3, icon: "🏢", name: "Office", name_ar: "مكتب", slug: "office", count: 412, active: true, sort: 3 },
      { id: 4, icon: "🏗️", name: "Land", name_ar: "أرض", slug: "land", count: 298, active: true, sort: 4 },
      { id: 5, icon: "🏬", name: "Retail / Shop", name_ar: "محل تجاري", slug: "retail-shop", count: 187, active: true, sort: 5 },
      { id: 6, icon: "🏨", name: "Hotel Unit", name_ar: "وحدة فندقية", slug: "hotel-unit", count: 94, active: false, sort: 6 },
      { id: 7, icon: "🏠", name: "Studio", name_ar: "ستوديو", slug: "studio", count: 531, active: true, sort: 7 },
      { id: 8, icon: "🏘️", name: "Twin House", name_ar: "توين هاوس", slug: "twin-house", count: 215, active: true, sort: 8 },
    ],
  },
  "property-purposes": {
    title: "Property Purposes",
    singular: "Purpose",
    mockData: [
      { id: 1, icon: "💰", name: "For Sale", name_ar: "للبيع", slug: "for-sale", count: 3420, active: true, sort: 1 },
      { id: 2, icon: "🔑", name: "For Rent", name_ar: "للإيجار", slug: "for-rent", count: 1890, active: true, sort: 2 },
      { id: 3, icon: "📅", name: "For Daily Booking", name_ar: "للحجز اليومي", slug: "for-daily-booking", count: 340, active: true, sort: 3 },
      { id: 4, icon: "📈", name: "For Investment", name_ar: "للاستثمار", slug: "for-investment", count: 520, active: true, sort: 4 },
      { id: 5, icon: "🔨", name: "In Auction", name_ar: "في مزاد", slug: "in-auction", count: 45, active: false, sort: 5 },
    ],
  },
  "suitable-for": {
    title: "Suitable For",
    singular: "Type",
    mockData: [
      { id: 1, icon: "👨‍👩‍👧", name: "Residential", name_ar: "سكني", slug: "residential", count: 4200, active: true, sort: 1 },
      { id: 2, icon: "🏢", name: "Commercial", name_ar: "تجاري", slug: "commercial", count: 1200, active: true, sort: 2 },
      { id: 3, icon: "🏭", name: "Industrial", name_ar: "صناعي", slug: "industrial", count: 350, active: true, sort: 3 },
      { id: 4, icon: "🌾", name: "Agricultural", name_ar: "زراعي", slug: "agricultural", count: 180, active: false, sort: 4 },
    ],
  },
};

function Modal({ item, onClose, singular }) {
  const [form, setForm] = useState({
    name: item?.name || "", name_ar: item?.name_ar || "",
    icon: item?.icon || "🏠", slug: item?.slug || "",
    sort: item?.sort || 1, active: item?.active ?? true,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900">{item ? "Edit" : "Add"} {singular}</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Icon</label>
                <input value={form.icon} onChange={set("icon")} className="w-16 border border-gray-200 rounded-lg px-2 py-2.5 text-center text-xl focus:outline-none focus:border-orange-400" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">Slug</label>
                <input value={form.slug || autoSlug(form.name)} onChange={set("slug")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Name (EN)</label>
              <input value={form.name} onChange={(e) => { set("name")(e); setForm(f => ({ ...f, slug: autoSlug(e.target.value) })); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Name (AR)</label>
              <input value={form.name_ar} onChange={set("name_ar")} dir="rtl"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Sort Order</label>
              <input type="number" value={form.sort} onChange={set("sort")} min={1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" checked={form.active} onChange={set("active")} className="accent-orange-500 w-4 h-4" />
              <span className="text-sm text-gray-700">Active</span>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">Save {singular}</button>
        </div>
      </div>
    </>
  );
}

export default function AdminPropertyCategories() {
  const { pathname } = useLocation();
  const type = pathname.split("/").pop();
  const config = PAGE_CONFIGS[type] || PAGE_CONFIGS["property-categories"];
  const [items, setItems] = useState(config.mockData);
  const [modal, setModal] = useState(null);

  const toggleActive = (id) => setItems((prev) => prev.map((it) => it.id === id ? { ...it, active: !it.active } : it));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{config.title}</h1>
          <p className="text-gray-500 text-sm">{items.length} {config.singular.toLowerCase()}s</p>
        </div>
        <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={14} /> Add {config.singular}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name (AR)</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Sort</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 text-xl">{row.icon}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600" dir="rtl">{row.name_ar}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{row.slug}</td>
                  <td className="px-4 py-3 font-bold text-gray-700">{row.count.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{row.sort}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(row)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Edit size={13} /></button>
                      <button onClick={() => toggleActive(row.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center ${row.active ? "hover:bg-red-50 text-red-400" : "hover:bg-green-50 text-green-500"}`}>
                        {row.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <Modal item={modal === "add" ? null : modal} singular={config.singular} onClose={() => setModal(null)} />}
    </div>
  );
}