import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Edit2, Trash2, Copy, X, ChevronDown, ChevronUp } from "lucide-react";

const MODULE_COLORS = {
  kemework: "#14B8A6",
  kemetro: "#0A6EBD",
  kemedar: "#FF6B00",
};

const MODULE_OPTIONS = ["kemework", "kemetro", "kemedar"];

const KEMEWORK_CATS = ["Cleaning Services", "Moving & Packing", "Painting & Decoration", "Pest Control", "Plumbing", "Electrical", "Carpentry", "AC & Appliances"];
const KEMETRO_CATS = ["Furniture", "Appliances", "Cleaning Supplies", "Kitchen Items", "Bedding & Linens", "Home Decor", "Storage & Organization"];
const KEMEDAR_CATS = ["Legal & Administrative", "Internet & WiFi", "Mortgage", "Rental Agreement"];

function getCatSuggestions(module) {
  if (module === "kemework") return KEMEWORK_CATS;
  if (module === "kemetro") return KEMETRO_CATS;
  return KEMEDAR_CATS;
}

const EMPTY_TASK = {
  title: "", titleAr: "", description: "", descriptionAr: "",
  icon: "📋", moduleTarget: "kemework", categoryTarget: "",
  deepLinkPath: "/kemework/post-task", autoFillParams: '{"category":""}',
  triggerDay: 0, triggerDayFromMoveIn: "",
  discountCode: "", discountPercent: "",
  accentColor: "#14B8A6", sortOrder: 0, isActive: true,
};

const EMPTY_TEMPLATE = { templateTitle: "", countryId: "", cityId: "", isActive: true, scope: "global" };

function TaskModal({ task, templateId, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_TASK, ...task });
  const [saving, setSaving] = useState(false);
  const cats = getCatSuggestions(form.moduleTarget);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        journeyTemplateId: templateId,
        triggerDay: Number(form.triggerDay) || 0,
        sortOrder: Number(form.sortOrder) || 0,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : undefined,
        triggerDayFromMoveIn: form.triggerDayFromMoveIn !== "" ? Number(form.triggerDayFromMoveIn) : undefined,
        autoFillParams: (() => { try { return JSON.parse(form.autoFillParams); } catch { return {}; } })(),
      };
      if (task?.id) {
        await base44.entities.ConciergeTaskTemplate.update(task.id, payload);
      } else {
        await base44.entities.ConciergeTaskTemplate.create(payload);
      }
      onSave();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-black text-gray-900 text-lg">{task?.id ? "Edit Task" : "Add Task"}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Task Title (EN)</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Task Title (AR)</label>
              <input dir="rtl" value={form.titleAr} onChange={e => set("titleAr", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description (EN)</label>
              <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description (AR)</label>
              <textarea dir="rtl" rows={3} value={form.descriptionAr} onChange={e => set("descriptionAr", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Icon (Emoji)</label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" placeholder="🧹" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Module Target</label>
              <select value={form.moduleTarget} onChange={e => { set("moduleTarget", e.target.value); set("accentColor", MODULE_COLORS[e.target.value] || "#FF6B00"); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                {MODULE_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category Target</label>
              <input list="cat-suggestions" value={form.categoryTarget} onChange={e => set("categoryTarget", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <datalist id="cat-suggestions">{cats.map(c => <option key={c} value={c} />)}</datalist>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Deep Link Path</label>
            <input value={form.deepLinkPath} onChange={e => set("deepLinkPath", e.target.value)} placeholder="/kemework/post-task" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Auto-fill Params (JSON)</label>
            <textarea rows={2} value={form.autoFillParams} onChange={e => set("autoFillParams", e.target.value)} placeholder='{"category":"Cleaning Services"}' className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Trigger Day (from journey start)</label>
              <input type="number" value={form.triggerDay} onChange={e => set("triggerDay", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">0 = immediate</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Trigger from Move-In Date (optional)</label>
              <input type="number" value={form.triggerDayFromMoveIn} onChange={e => set("triggerDayFromMoveIn", e.target.value)} placeholder="-7 for 7 days before" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">Overrides trigger day if set</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount Code</label>
              <input value={form.discountCode} onChange={e => set("discountCode", e.target.value)} placeholder="NEWHOME5" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount %</label>
              <input type="number" value={form.discountPercent} onChange={e => set("discountPercent", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => set("sortOrder", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              {[["#14B8A6", "Teal (Kemework)"], ["#0A6EBD", "Blue (Kemetro)"], ["#FF6B00", "Orange (Kemedar)"]].map(([color, label]) => (
                <button key={color} onClick={() => set("accentColor", color)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${form.accentColor === color ? "border-gray-400" : "border-transparent hover:border-gray-200"}`}>
                  <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
                  {label}
                </button>
              ))}
              <input type="color" value={form.accentColor} onChange={e => set("accentColor", e.target.value)} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-700">Active</label>
            <button onClick={() => set("isActive", !form.isActive)} className={`w-10 h-5 rounded-full transition-colors ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isActive ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="text-gray-500 text-sm font-medium hover:text-gray-800">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateModal({ onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_TEMPLATE });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.ConciergeJourneyTemplate.create({
        templateTitle: form.templateTitle,
        countryId: form.scope === "country" ? form.countryId : null,
        cityId: form.scope === "city" ? form.cityId : null,
        isActive: true,
        sortOrder: 0,
      });
      onSave();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-gray-900 text-lg">Add New Template</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Template Name</label>
            <input value={form.templateTitle} onChange={e => set("templateTitle", e.target.value)} placeholder="e.g. Standard Egypt Move-In" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Applies to</label>
            <div className="space-y-2">
              {[["global", "🌍 Global (all countries)"], ["country", "🏳️ Specific country"], ["city", "🏙️ Specific city"]].map(([val, label]) => (
                <label key={val} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="scope" value={val} checked={form.scope === val} onChange={() => set("scope", val)} className="accent-orange-500" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            {form.scope === "country" && (
              <input value={form.countryId} onChange={e => set("countryId", e.target.value)} placeholder="Country ID" className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            )}
            {form.scope === "city" && (
              <input value={form.cityId} onChange={e => set("cityId", e.target.value)} placeholder="City ID" className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button onClick={onClose} className="text-gray-500 text-sm hover:text-gray-800">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.templateTitle} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm disabled:opacity-50">
            {saving ? "Creating…" : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateSection({ template, onRefresh }) {
  const [tasks, setTasks] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    base44.entities.ConciergeTaskTemplate.filter({ journeyTemplateId: template.id }, "sortOrder", 50)
      .then(setTasks).catch(() => setTasks([]));
  }, [template.id]);

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    await base44.entities.ConciergeTaskTemplate.delete(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleToggleActive = async () => {
    await base44.entities.ConciergeJourneyTemplate.update(template.id, { isActive: !template.isActive });
    onRefresh();
  };

  const handleDeleteTemplate = async () => {
    if (!confirm("Delete this template and all its tasks?")) return;
    await base44.entities.ConciergeJourneyTemplate.delete(template.id);
    onRefresh();
  };

  const handleTaskSaved = () => {
    setEditingTask(null);
    setShowAddTask(false);
    base44.entities.ConciergeTaskTemplate.filter({ journeyTemplateId: template.id }, "sortOrder", 50)
      .then(setTasks).catch(() => {});
  };

  const scope = template.cityId ? `City: ${template.cityId}` : template.countryId ? `Country: ${template.countryId}` : "Global";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Template header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-gray-50 border-b border-gray-100">
        <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-700">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900">{template.templateTitle}</p>
          <p className="text-xs text-gray-500 mt-0.5">Applies to: <span className="font-bold text-gray-700">{scope}</span> · {tasks.length} tasks</p>
        </div>
        <button
          onClick={handleToggleActive}
          className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 ${template.isActive ? "bg-green-500" : "bg-gray-300"}`}
          title={template.isActive ? "Active" : "Inactive"}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow mx-0.5 transition-transform ${template.isActive ? "translate-x-4" : "translate-x-0"}`} />
        </button>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${template.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {template.isActive ? "Active" : "Inactive"}
        </span>
        <button onClick={() => { /* duplicate */ onRefresh(); }} title="Duplicate" className="text-gray-400 hover:text-gray-700"><Copy size={14} /></button>
        <button onClick={handleDeleteTemplate} title="Delete" className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
      </div>

      {/* Tasks table */}
      {expanded && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-100 bg-white">
                <tr>
                  {["Sort", "Icon", "Title", "Module", "Category", "Trigger Day", "Accent", "Active", ""].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 text-gray-400 font-mono">{task.sortOrder ?? 0}</td>
                    <td className="px-4 py-2.5 text-lg">{task.icon || "📋"}</td>
                    <td className="px-4 py-2.5 font-bold text-gray-900">{task.title}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ backgroundColor: MODULE_COLORS[task.moduleTarget] || "#888" }}>
                        {task.moduleTarget}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">{task.categoryTarget || "—"}</td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {task.triggerDayFromMoveIn != null ? `${task.triggerDayFromMoveIn}d (move-in)` : `Day ${task.triggerDay || 0}`}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="w-4 h-4 rounded inline-block" style={{ backgroundColor: task.accentColor || "#FF6B00" }} />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold ${task.isActive !== false ? "text-green-600" : "text-gray-400"}`}>
                        {task.isActive !== false ? "🟢" : "⚫"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => setEditingTask(task)} className="text-blue-500 hover:text-blue-700"><Edit2 size={13} /></button>
                        <button onClick={() => handleDeleteTask(task.id)} className="text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No tasks yet. Add one below.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <button onClick={() => setShowAddTask(true)} className="flex items-center gap-1.5 text-teal-600 border border-teal-200 rounded-xl px-4 py-2 text-xs font-bold hover:bg-teal-50 transition-colors">
              <Plus size={13} /> Add Task to This Template
            </button>
          </div>
        </div>
      )}

      {(editingTask || showAddTask) && (
        <TaskModal
          task={editingTask}
          templateId={template.id}
          onSave={handleTaskSaved}
          onClose={() => { setEditingTask(null); setShowAddTask(false); }}
        />
      )}
    </div>
  );
}

export default function ConciergeTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTemplate, setShowNewTemplate] = useState(false);

  const load = () => {
    base44.entities.ConciergeJourneyTemplate.list("sortOrder", 50)
      .then(setTemplates).catch(() => setTemplates([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🗝️ Journey Templates</h1>
          <p className="text-sm text-gray-500 mt-1">Define tasks auto-generated when a user starts a move-in journey</p>
        </div>
        <button onClick={() => setShowNewTemplate(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add New Template
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">🗝️</p>
          <p className="font-bold text-gray-700">No templates yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first journey template to get started.</p>
          <button onClick={() => setShowNewTemplate(true)} className="mt-4 bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600">
            Create Template
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map(t => (
            <TemplateSection key={t.id} template={t} onRefresh={load} />
          ))}
        </div>
      )}

      {showNewTemplate && (
        <TemplateModal onSave={() => { setShowNewTemplate(false); load(); }} onClose={() => setShowNewTemplate(false)} />
      )}
    </div>
  );
}