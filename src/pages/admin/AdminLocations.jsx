import { useState } from "react";
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

const TABS = ["Countries", "Provinces", "Cities", "Districts", "Areas"];

const MOCK_DATA = {
  Countries: [
    { id: 1, name: "Egypt", name_ar: "مصر", parent: "—", active: true },
    { id: 2, name: "UAE", name_ar: "الإمارات", parent: "—", active: true },
    { id: 3, name: "Saudi Arabia", name_ar: "المملكة العربية السعودية", parent: "—", active: true },
    { id: 4, name: "Jordan", name_ar: "الأردن", parent: "—", active: false },
    { id: 5, name: "Kuwait", name_ar: "الكويت", parent: "—", active: true },
  ],
  Provinces: [
    { id: 1, name: "Cairo Governorate", name_ar: "محافظة القاهرة", parent: "Egypt", active: true },
    { id: 2, name: "Giza Governorate", name_ar: "محافظة الجيزة", parent: "Egypt", active: true },
    { id: 3, name: "Alexandria Governorate", name_ar: "محافظة الإسكندرية", parent: "Egypt", active: true },
    { id: 4, name: "Dubai", name_ar: "دبي", parent: "UAE", active: true },
    { id: 5, name: "Abu Dhabi", name_ar: "أبو ظبي", parent: "UAE", active: true },
  ],
  Cities: [
    { id: 1, name: "New Cairo", name_ar: "القاهرة الجديدة", parent: "Cairo Governorate", active: true },
    { id: 2, name: "Maadi", name_ar: "المعادي", parent: "Cairo Governorate", active: true },
    { id: 3, name: "Sheikh Zayed", name_ar: "الشيخ زايد", parent: "Giza Governorate", active: true },
    { id: 4, name: "6th October City", name_ar: "مدينة السادس من أكتوبر", parent: "Giza Governorate", active: true },
    { id: 5, name: "North Coast", name_ar: "الساحل الشمالي", parent: "Alexandria Governorate", active: true },
  ],
  Districts: [
    { id: 1, name: "El Rehab", name_ar: "الرحاب", parent: "New Cairo", active: true },
    { id: 2, name: "Madinaty", name_ar: "مدينتي", parent: "New Cairo", active: true },
    { id: 3, name: "Sarayat", name_ar: "سرايات", parent: "Maadi", active: true },
    { id: 4, name: "Beverly Hills", name_ar: "بيفرلي هيلز", parent: "Sheikh Zayed", active: true },
    { id: 5, name: "Hayy 11", name_ar: "الحي 11", parent: "6th October City", active: true },
  ],
  Areas: [
    { id: 1, name: "Gate 1 Rehab", name_ar: "بوابة 1 الرحاب", parent: "El Rehab", active: true },
    { id: 2, name: "Madinaty A", name_ar: "مدينتي أ", parent: "Madinaty", active: true },
    { id: 3, name: "Sarayat East", name_ar: "سرايات الشرقية", parent: "Sarayat", active: true },
    { id: 4, name: "Beverly Hills Zone 1", name_ar: "بيفرلي هيلز منطقة 1", parent: "Beverly Hills", active: true },
    { id: 5, name: "Central District", name_ar: "المنطقة المركزية", parent: "Hayy 11", active: true },
  ],
};

function Modal({ item, onClose, tabName }) {
  const [form, setForm] = useState({ name: item?.name || "", name_ar: item?.name_ar || "", parent: item?.parent || "", active: item?.active ?? true });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900">{item ? "Edit" : "Add"} {tabName.slice(0, -1)}</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Name (English)</label>
            <input value={form.name} onChange={set("name")} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Name (Arabic)</label>
            <input value={form.name_ar} onChange={set("name_ar")} dir="rtl"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
          </div>
          {tabName !== "Countries" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Parent</label>
              <input value={form.parent} onChange={set("parent")} placeholder="Select or type parent..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={set("active")} className="accent-orange-500" />
            <span className="text-sm text-gray-700">Active</span>
          </label>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminLocations() {
  const [activeTab, setActiveTab] = useState("Countries");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | item

  const data = MOCK_DATA[activeTab] || [];
  const filtered = data.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.name_ar.includes(search));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Locations Management</h1>
        <p className="text-gray-500 text-sm">Manage geographic hierarchy</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => { setActiveTab(t); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeTab}...`}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-56" />
        <button onClick={() => setModal("add")} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors ml-auto">
          <Plus size={14} /> Add New {activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name (EN)</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name (AR)</th>
                {activeTab !== "Countries" && <th className="px-4 py-3 text-left font-bold text-gray-700">Parent</th>}
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-right" dir="rtl">{row.name_ar}</td>
                  {activeTab !== "Countries" && <td className="px-4 py-3 text-gray-500 text-xs">{row.parent}</td>}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal(row)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Edit size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {data.length}</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded-lg bg-orange-500 text-white text-sm font-bold">1</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {modal && <Modal item={modal === "add" ? null : modal} tabName={activeTab} onClose={() => setModal(null)} />}
    </div>
  );
}