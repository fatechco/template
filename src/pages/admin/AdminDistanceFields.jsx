import { useState, useEffect } from "react";
import { Plus, Search, X, Trash2, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["transport", "education", "health", "shopping", "recreation", "services", "religion"];
const CAT_COLORS = {
  transport: "bg-blue-100 text-blue-700",
  education: "bg-green-100 text-green-700",
  health: "bg-red-100 text-red-700",
  shopping: "bg-orange-100 text-orange-700",
  recreation: "bg-teal-100 text-teal-700",
  services: "bg-gray-100 text-gray-700",
  religion: "bg-purple-100 text-purple-700",
};
const CAT_ICONS = {
  transport: "🚇", education: "🎓", health: "🏥", shopping: "🛒",
  recreation: "🌳", services: "🏛️", religion: "🕌",
};

function Toggle({ value, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"} ${value ? "bg-indigo-500" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function FieldModal({ field, onClose, onSave }) {
  const [form, setForm] = useState(field || {
    name: "", nameAr: "", icon: "📌", category: "transport",
    sortOrder: 1, isActive: true, enableForProperty: true, enableForProject: true,
  });
  const [saving, setSaving] = useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-gray-900">{field ? "Edit" : "Add"} Distance Field</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Name (EN) *</label>
              <input value={form.name} onChange={e => up("name", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Name (AR)</label>
              <input value={form.nameAr || ""} onChange={e => up("nameAr", e.target.value)} dir="rtl"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Icon</label>
              <input value={form.icon} onChange={e => up("icon", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-center text-xl focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
              <select value={form.category} onChange={e => up("category", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder || ""} onChange={e => up("sortOrder", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Status (Active)</span>
              <Toggle value={form.isActive !== false} onChange={v => up("isActive", v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Enable for Property</span>
              <Toggle value={form.enableForProperty !== false} onChange={v => up("enableForProperty", v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 font-medium">Enable for Project</span>
              <Toggle value={form.enableForProject !== false} onChange={v => up("enableForProject", v)} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDistanceFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | field object

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.DistanceField.list("sortOrder", 200);
    setFields(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (id, key) => {
    const f = fields.find(x => x.id === id);
    if (!f) return;
    await base44.entities.DistanceField.update(id, { [key]: !f[key] });
    setFields(prev => prev.map(x => x.id === id ? { ...x, [key]: !x[key] } : x));
  };

  const handleSortChange = async (id, val) => {
    await base44.entities.DistanceField.update(id, { sortOrder: val });
    setFields(prev => prev.map(x => x.id === id ? { ...x, sortOrder: val } : x).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
  };

  const handleSave = async (form) => {
    if (form.id) {
      const { id, created_date, updated_date, created_by, ...data } = form;
      await base44.entities.DistanceField.update(id, data);
    } else {
      await base44.entities.DistanceField.create(form);
    }
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this distance field?")) return;
    await base44.entities.DistanceField.delete(id);
    setFields(prev => prev.filter(x => x.id !== id));
  };

  const filtered = fields.filter(f => !search || f.name?.toLowerCase().includes(search.toLowerCase()) || f.nameAr?.includes(search));

  // Group by category
  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: filtered.filter(f => f.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Distance Fields</h1>
          <p className="text-gray-500 text-sm">Manage distance categories shown in property and project forms</p>
        </div>
        <button onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={14} /> Add Distance Field
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">NAME</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">STATUS</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ENABLE FOR PROPERTY</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">ENABLE FOR PROJECT</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">CATEGORY</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-700">SORT ORDER</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map(group => (
                  <GroupRows key={group.cat} group={group} onToggle={handleToggle} onSortChange={handleSortChange} onEdit={f => setModal(f)} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <FieldModal
          field={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function GroupRows({ group, onToggle, onSortChange, onEdit, onDelete }) {
  return (
    <>
      <tr>
        <td colSpan={7} className="px-4 py-2 bg-gray-50/70">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
            {CAT_ICONS[group.cat]} {group.cat}
          </span>
        </td>
      </tr>
      {group.items.map(row => (
        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
          <td className="px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{row.icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{row.name}</p>
                {row.nameAr && <p className="text-xs text-gray-400" dir="rtl">{row.nameAr}</p>}
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-center">
            <Toggle value={row.isActive !== false} onChange={() => onToggle(row.id, "isActive")} />
          </td>
          <td className="px-4 py-3 text-center">
            <Toggle value={row.enableForProperty !== false} onChange={() => onToggle(row.id, "enableForProperty")} disabled={!row.isActive} />
          </td>
          <td className="px-4 py-3 text-center">
            <Toggle value={row.enableForProject !== false} onChange={() => onToggle(row.id, "enableForProject")} disabled={!row.isActive} />
          </td>
          <td className="px-4 py-3 text-center">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CAT_COLORS[row.category] || "bg-gray-100 text-gray-600"}`}>
              {row.category}
            </span>
          </td>
          <td className="px-4 py-3 text-center">
            <input type="number" value={row.sortOrder || 0}
              onChange={e => onSortChange(row.id, parseInt(e.target.value) || 0)}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400" />
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center gap-1 justify-end">
              <button onClick={() => onEdit(row)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Pencil size={13} /></button>
              <button onClick={() => onDelete(row.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center"><Trash2 size={13} /></button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}