"use client";
// @ts-nocheck
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, ChevronRight, Tag } from "lucide-react";

const INITIAL_CATEGORIES = [
  { id: 1, name: "Cement & Concrete", icon: "🧱", productCount: 124, active: true, subcategories: ["Portland Cement", "Ready Mix", "Mortar", "Grouting"] },
  { id: 2, name: "Steel & Iron", icon: "⚙️", productCount: 87, active: true, subcategories: ["Rebar", "Steel Beams", "Wire Mesh", "Steel Pipes"] },
  { id: 3, name: "Tiles & Flooring", icon: "🔲", productCount: 213, active: true, subcategories: ["Ceramic Tiles", "Porcelain", "Marble", "Granite", "Wood Flooring"] },
  { id: 4, name: "Paints & Coatings", icon: "🎨", productCount: 156, active: true, subcategories: ["Wall Paint", "Primer", "Waterproofing", "Wood Stain"] },
  { id: 5, name: "Plumbing", icon: "🚰", productCount: 98, active: true, subcategories: ["Pipes", "Fittings", "Valves", "Water Heaters"] },
  { id: 6, name: "Electrical", icon: "⚡", productCount: 142, active: true, subcategories: ["Cables & Wires", "Switches", "Panels", "Lighting"] },
  { id: 7, name: "Insulation", icon: "🛡️", productCount: 45, active: false, subcategories: ["Thermal", "Sound", "Waterproof Membrane"] },
  { id: 8, name: "Doors & Windows", icon: "🚪", productCount: 76, active: true, subcategories: ["Wooden Doors", "Steel Doors", "PVC Windows", "Aluminum Windows"] },
];

const EMPTY_FORM = { name: "", icon: "", active: true };

export default function KemetroAdminCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState(null);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, icon: cat.icon, active: cat.active }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCategories([...categories, { id: Date.now(), ...form, productCount: 0, subcategories: [] }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) => setCategories(categories.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCategory = (id) => setCategories(categories.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">Categories</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Categories</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{categories.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-black text-green-700 mt-1">{categories.filter((c) => c.active).length}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-black text-gray-700 mt-1">{categories.reduce((s, c) => s + c.productCount, 0)}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {categories.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{cat.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {cat.active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{cat.productCount} products · {cat.subcategories.length} subcategories</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight size={16} className={`transition-transform ${expanded === cat.id ? "rotate-90" : ""}`} />
                </button>
                <button onClick={() => toggleActive(cat.id)} className={`p-1.5 rounded-lg transition-colors ${cat.active ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
                  <Check size={16} />
                </button>
                <button onClick={() => openEdit(cat)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Pencil size={16} /></button>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
            {expanded === cat.id && cat.subcategories.length > 0 && (
              <div className="px-14 py-3 bg-gray-50 flex flex-wrap gap-2 border-t border-gray-100">
                {cat.subcategories.map((sub) => (
                  <span key={sub} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Tag size={11} /> {sub}
                  </span>
                ))}
                <button className="flex items-center gap-1 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors">
                  <Plus size={11} /> Add Sub
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900">{editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. Cement & Concrete" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Icon (Emoji)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="e.g. 🧱" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-700">Active</label>
                <button onClick={() => setForm({ ...form, active: !form.active })} className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? "bg-green-500" : "bg-gray-300"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}