import { useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";

const CATEGORIES = ["Interior Design", "Electrical", "Plumbing", "Carpentry", "Landscaping", "Painting", "Tiling", "HVAC"];

const MOCK_ITEMS = [
  { id: 1, title: "Modern Villa Interior — Maadi, Cairo", category: "Interior Design", date: "2025-11-15", tags: ["Residential", "Modern", "Full Renovation"], images: ["https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=70"] },
  { id: 2, title: "Complete Electrical Rewiring — 120sqm Apartment", category: "Electrical", date: "2025-10-20", tags: ["Apartment", "Electrical", "Safety"], images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70"] },
  { id: 3, title: "Custom Kitchen Cabinets & Countertops", category: "Carpentry", date: "2025-09-08", tags: ["Kitchen", "Custom", "Wood"], images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70"] },
  { id: 4, title: "Villa Garden Landscaping with Irrigation", category: "Landscaping", date: "2025-08-12", tags: ["Outdoor", "Garden", "Irrigation"], images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70"] },
];

function PortfolioForm({ item, onClose }) {
  const [form, setForm] = useState(item || { title: "", category: "", date: "", description: "", tags: [], images: [] });
  const [tagInput, setTagInput] = useState("");

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] })); setTagInput(""); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">{item ? "Edit Portfolio Item" : "Add Portfolio Item"}</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 bg-white">
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Date Completed</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the project..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tags</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              <button type="button" onClick={addTag} className="px-3 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold text-sm">+</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
                    {t} <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}><X size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Images (up to 10)</label>
            <label className="flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-teal-400">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload project images</span>
              <input type="file" multiple accept="image/*" onChange={e => setForm(f => ({ ...f, images: Array.from(e.target.files || []).slice(0, 10) }))} className="hidden" />
            </label>
            {form.images?.length > 0 && <p className="text-xs text-green-600 mt-1">✅ {form.images.length} image(s)</p>}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1" style={{ background: "#0D9488" }}>
            {item ? "Save Changes" : "Add to Portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProPortfolioPage() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">My Portfolio</h1>
            <p className="text-sm text-gray-500">{MOCK_ITEMS.length} portfolio items</p>
          </div>
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: "#C41230" }}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ITEMS.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Image preview */}
              <div className="relative h-44 bg-gray-100">
                {item.images.length > 0
                  ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">🖼</div>
                }
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    +{item.images.length - 1}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-black text-gray-900 text-sm mb-1 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-400 mb-2">{item.category} · {item.date}</p>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => { setEditItem(item); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">
                    <Pencil size={11} /> Edit
                  </button>
                  <button className="py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && <PortfolioForm item={editItem} onClose={() => setShowForm(false)} />}
    </div>
  );
}