import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const CATS = [
  { id: 1, icon: "🏠", name: "Home Design & Remodeling", nameAr: "تصميم وتجديد المنازل", parent: null, pros: 234, services: 412, tasks: 156, active: true },
  { id: 2, icon: "⚡", name: "Electrical Services", nameAr: "الخدمات الكهربائية", parent: null, pros: 178, services: 289, tasks: 203, active: true },
  { id: 3, icon: "🔧", name: "Plumbing Services", nameAr: "خدمات السباكة", parent: null, pros: 145, services: 198, tasks: 178, active: true },
  { id: 4, icon: "🎨", name: "Painting & Decorating", nameAr: "الدهانات والديكور", parent: null, pros: 112, services: 167, tasks: 134, active: true },
  { id: 5, icon: "🌿", name: "Landscaping & Gardening", nameAr: "تنسيق الحدائق", parent: null, pros: 89, services: 134, tasks: 98, active: true },
];

function CategoryModal({ cat, onClose }) {
  const [form, setForm] = useState(cat || { icon: "", name: "", nameAr: "", parent: "", sortOrder: 0, active: true });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">{cat ? "Edit Category" : "Add Category"}</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon (emoji)</label>
            <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. 🔧" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Name (English) <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Category name" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Name (Arabic)</label>
            <input dir="rtl" value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} placeholder="اسم الفئة" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Parent Category (optional)</label>
            <select value={form.parent || ""} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-teal-400">
              <option value="">None (top-level)</option>
              {CATS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: +e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-teal-600 w-4 h-4" />
            <span className="text-sm font-semibold text-gray-700">Active</span>
          </label>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1" style={{ background: "#0D9488" }}>
            {cat ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KemeworkCategories() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Kemework Categories</h1>
          <p className="text-sm text-gray-500">{CATS.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#0D9488" }}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Icon", "Name", "Parent", "Professionals", "Services", "Tasks", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATS.map(cat => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-xl">{cat.icon}</td>
                <td className="px-4 py-3">
                  <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5" dir="rtl">{cat.nameAr}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{cat.parent || "—"}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">{cat.pros}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">{cat.services}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">{cat.tasks}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{cat.active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => { setEditing(cat); setShowModal(true); }} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil size={13} className="text-gray-500" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CategoryModal cat={editing} onClose={() => setShowModal(false)} />}
    </div>
  );
}