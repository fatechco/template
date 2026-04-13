import { useState } from "react";
import { Plus, Edit, ToggleRight, ToggleLeft, X, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const PAGE_CONFIGS = {
  amenities: {
    title: "Property Amenities",
    singular: "Amenity",
    hasCategory: true,
    mockData: [
      { id: 1, icon: "🏊", name: "Swimming Pool", name_ar: "حمام سباحة", category: "Recreation", usage: 842, active: true },
      { id: 2, icon: "🏋️", name: "Gym", name_ar: "نادي رياضي", category: "Recreation", usage: 634, active: true },
      { id: 3, icon: "🔒", name: "24/7 Security", name_ar: "أمن 24 ساعة", category: "Safety", usage: 1200, active: true },
      { id: 4, icon: "🛗", name: "Elevator", name_ar: "مصعد", category: "Building", usage: 980, active: true },
      { id: 5, icon: "🚗", name: "Parking", name_ar: "موقف سيارات", category: "Building", usage: 1100, active: true },
      { id: 6, icon: "🌳", name: "Garden", name_ar: "حديقة", category: "Outdoor", usage: 560, active: true },
      { id: 7, icon: "🎾", name: "Tennis Court", name_ar: "ملعب تنس", category: "Recreation", usage: 210, active: true },
      { id: 8, icon: "🛝", name: "Kids Play Area", name_ar: "منطقة ألعاب", category: "Recreation", usage: 430, active: true },
      { id: 9, icon: "🕌", name: "Mosque", name_ar: "مسجد", category: "Services", usage: 380, active: true },
      { id: 10, icon: "🏪", name: "Supermarket", name_ar: "سوبر ماركت", category: "Services", usage: 290, active: false },
    ],
  },
  "distance-fields": {
    title: "Distance Fields",
    singular: "Place",
    hasCategory: false,
    mockData: [
      { id: 1, icon: "🚆", name: "Train Station", name_ar: "محطة قطار", category: "Transport", usage: 720, active: true },
      { id: 2, icon: "🕌", name: "Mosque", name_ar: "مسجد", category: "Religion", usage: 1100, active: true },
      { id: 3, icon: "🏥", name: "Hospital", name_ar: "مستشفى", category: "Health", usage: 890, active: true },
      { id: 4, icon: "🏫", name: "School", name_ar: "مدرسة", category: "Education", usage: 960, active: true },
      { id: 5, icon: "🛒", name: "Shopping Mall", name_ar: "مول تسوق", category: "Retail", usage: 750, active: true },
      { id: 6, icon: "✈️", name: "Airport", name_ar: "مطار", category: "Transport", usage: 580, active: true },
      { id: 7, icon: "⛽", name: "Gas Station", name_ar: "محطة وقود", category: "Services", usage: 420, active: true },
      { id: 8, icon: "🏖️", name: "Beach", name_ar: "شاطئ", category: "Leisure", usage: 310, active: false },
    ],
  },
};

function AddModal({ onClose, singular, hasCategory }) {
  const [form, setForm] = useState({ name: "", name_ar: "", icon: "📌", category: "", active: true });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900">Add {singular}</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="flex gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Icon</label>
              <input value={form.icon} onChange={set("icon")} className="w-14 border border-gray-200 rounded-lg px-2 py-2.5 text-center text-xl focus:outline-none focus:border-orange-400" />
            </div>
            {hasCategory && (
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                <input value={form.category} onChange={set("category")} placeholder="e.g. Recreation"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Name (EN)</label>
            <input value={form.name} onChange={set("name")} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Name (AR)</label>
            <input value={form.name_ar} onChange={set("name_ar")} dir="rtl" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={set("active")} className="accent-orange-500" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">Add {singular}</button>
        </div>
      </div>
    </>
  );
}

export default function AdminAmenities() {
  const { pathname } = useLocation();
  const type = pathname.split("/").pop();
  const config = PAGE_CONFIGS[type] || PAGE_CONFIGS.amenities;
  const [items, setItems] = useState(config.mockData);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = items.filter((it) => !search || it.name.toLowerCase().includes(search.toLowerCase()));
  const toggleActive = (id) => setItems((prev) => prev.map((it) => it.id === id ? { ...it, active: !it.active } : it));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{config.title}</h1>
          <p className="text-gray-500 text-sm">{filtered.length} items</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
          <Plus size={14} /> Add {config.singular}
        </button>
      </div>

      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`}
          className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name (AR)</th>
                {config.hasCategory && <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>}
                <th className="px-4 py-3 text-left font-bold text-gray-700">Usage</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 text-xl">{row.icon}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600" dir="rtl">{row.name_ar}</td>
                  {config.hasCategory && <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{row.category}</span></td>}
                  <td className="px-4 py-3 font-bold text-gray-600">{row.usage.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Edit size={13} /></button>
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

      {showAdd && <AddModal onClose={() => setShowAdd(false)} singular={config.singular} hasCategory={config.hasCategory} />}
    </div>
  );
}