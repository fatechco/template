import { useState, useMemo } from "react";
import {
  Plus, Search, Filter, ChevronRight, CheckCircle, Clock, AlertCircle,
  Phone, MessageCircle, Mail, RefreshCw, Calendar, Users, Tag, Download,
  ChevronDown, ChevronUp, X
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const TASK_TYPES = ["call", "callback", "whatsapp", "email", "sms", "onboarding", "profile_completion", "document_request", "renewal", "viewing_confirmation", "escalation", "manual_review", "account_review"];

const TYPE_ICON = {
  call: "📞", callback: "🔁", whatsapp: "💬", email: "📧", sms: "📱",
  onboarding: "🚀", profile_completion: "👤", document_request: "📄",
  renewal: "🔄", viewing_confirmation: "🏠", escalation: "⚠️",
  manual_review: "🔍", account_review: "🏢",
};

const TYPE_COLOR = {
  call: "bg-green-100 text-green-700", callback: "bg-orange-100 text-orange-700",
  whatsapp: "bg-green-100 text-green-600", email: "bg-blue-100 text-blue-700",
  sms: "bg-yellow-100 text-yellow-700", onboarding: "bg-violet-100 text-violet-700",
  profile_completion: "bg-teal-100 text-teal-700", document_request: "bg-gray-100 text-gray-700",
  renewal: "bg-indigo-100 text-indigo-700", viewing_confirmation: "bg-orange-100 text-orange-600",
  escalation: "bg-red-100 text-red-700", manual_review: "bg-yellow-100 text-yellow-600",
  account_review: "bg-blue-100 text-blue-600",
};

const PRIORITY_DOT = { urgent: "bg-red-500", high: "bg-orange-400", medium: "bg-yellow-400", low: "bg-gray-300" };
const STATUS_BADGE = { open: "bg-blue-100 text-blue-700", in_progress: "bg-orange-100 text-orange-700", done: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-500" };

const MOCK_TASKS = Array.from({ length: 28 }, (_, i) => ({
  id: `t${i + 1}`,
  title: ["Call Ahmed for renewal", "WhatsApp follow-up — Nour", "Send contract draft", "Complete onboarding — Karim", "Request ID documents", "Renewal call — Elite Realty", "Schedule viewing — Maadi", "Escalate — no response 7d", "Profile completion reminder", "Account review — Palm Hills"][i % 10],
  type: TASK_TYPES[i % TASK_TYPES.length],
  contact: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Nour Hassan", "Omar Rashid"][i % 5],
  contactId: `c${(i % 5) + 1}`,
  account: i % 3 === 0 ? ["Elite Realty", "Palm Hills Dev", "Gulf Corp"][i % 3] : null,
  owner: ["You", "Adel M.", "Sara K.", "Mona A."][i % 4],
  priority: ["urgent", "high", "medium", "low"][i % 4],
  dueAt: i < 8 ? "Today" : i < 14 ? "Tomorrow" : i < 18 ? "Overdue" : `Apr ${(i % 20) + 5}`,
  isOverdue: i < 5 && i % 2 === 0,
  isToday: i >= 5 && i < 10,
  status: ["open", "in_progress", "done", "cancelled"][i % 4],
  source: ["CRM", "Automation", "Import", "Manual"][i % 4],
  linkedOpp: i % 5 === 0 ? "Pro Renewal" : null,
  notes: i % 3 === 0 ? "Contact prefers morning calls" : "",
  createdAt: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`,
}));

const PAGE_SIZE = 15;

const VIEWS = [
  { id: "today", label: "Today", count: MOCK_TASKS.filter(t => t.isToday).length },
  { id: "overdue", label: "Overdue", count: MOCK_TASKS.filter(t => t.isOverdue).length },
  { id: "list", label: "All Tasks", count: MOCK_TASKS.length },
  { id: "mine", label: "Assigned to Me", count: MOCK_TASKS.filter(t => t.owner === "You").length },
  { id: "open", label: "Open", count: MOCK_TASKS.filter(t => t.status === "open").length },
  { id: "done", label: "Completed", count: MOCK_TASKS.filter(t => t.status === "done").length },
];

// ─── Create Task Modal ──────────────────────────────────────────────────────────
function CreateTaskModal({ onClose }) {
  const [form, setForm] = useState({ title: "", type: "call", contact: "", owner: "You", priority: "medium", dueAt: "", notes: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">Create Task</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input placeholder="Task title..." value={form.title} onChange={e => set("title", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {TASK_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {["urgent", "high", "medium", "low"].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Assigned To</label>
              <select value={form.owner} onChange={e => set("owner", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {["You", "Adel M.", "Sara K.", "Mona A."].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Due Date</label>
              <input type="date" value={form.dueAt} onChange={e => set("dueAt", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
          </div>
          <input placeholder="Linked contact (search)..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-400" />
          <textarea placeholder="Notes (optional)..." rows={2} value={form.notes} onChange={e => set("notes", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-400 resize-none" />
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="bg-violet-600 hover:bg-violet-700 text-white font-black px-5 py-2 rounded-xl text-xs">Create Task</button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Row ───────────────────────────────────────────────────────────────────
function TaskRow({ task }) {
  const [status, setStatus] = useState(task.status);
  return (
    <tr className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${task.isOverdue ? "bg-red-50/30" : ""}`}>
      <td className="px-4 py-3">
        <input type="checkbox" checked={status === "done"} onChange={() => setStatus(s => s === "done" ? "open" : "done")}
          className="w-4 h-4 accent-violet-600 cursor-pointer" />
      </td>
      {/* Title */}
      <td className="px-3 py-3">
        <p className={`text-xs font-semibold text-gray-900 ${status === "done" ? "line-through text-gray-400" : ""}`}>{task.title}</p>
        {task.notes && <p className="text-[10px] text-gray-400 truncate max-w-[160px]">{task.notes}</p>}
      </td>
      {/* Type */}
      <td className="px-3 py-3">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize flex items-center gap-1 w-fit ${TYPE_COLOR[task.type] || "bg-gray-100 text-gray-600"}`}>
          {TYPE_ICON[task.type]} {task.type.replace(/_/g, " ")}
        </span>
      </td>
      {/* Contact */}
      <td className="px-3 py-3">
        <p className="text-xs font-semibold text-gray-700">{task.contact}</p>
        {task.account && <p className="text-[10px] text-gray-400">{task.account}</p>}
      </td>
      {/* Owner */}
      <td className="px-3 py-3 text-xs font-semibold text-gray-600">{task.owner}</td>
      {/* Priority */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          <span className="text-xs capitalize text-gray-600">{task.priority}</span>
        </div>
      </td>
      {/* Due */}
      <td className="px-3 py-3">
        <span className={`text-xs font-bold ${task.dueAt === "Overdue" ? "text-red-500" : task.dueAt === "Today" ? "text-orange-600" : "text-gray-600"}`}>
          {task.dueAt === "Overdue" && <AlertCircle size={11} className="inline mr-0.5" />}
          {task.dueAt}
        </span>
      </td>
      {/* Status */}
      <td className="px-3 py-3">
        <select value={status} onChange={e => setStatus(e.target.value)}
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 focus:outline-none capitalize ${STATUS_BADGE[status] || "bg-gray-100 text-gray-500"}`}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1">
          <button title="Call" className="p-1 hover:bg-green-50 rounded text-green-600"><Phone size={12} /></button>
          <button title="WhatsApp" className="p-1 hover:bg-green-50 rounded text-green-500"><MessageCircle size={12} /></button>
          <button title="Snooze" className="p-1 hover:bg-orange-50 rounded text-orange-500"><Clock size={12} /></button>
          <ChevronRight size={12} className="text-gray-300" />
        </div>
      </td>
    </tr>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMTasks() {
  const [activeView, setActiveView] = useState("list");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...MOCK_TASKS];
    if (search) { const q = search.toLowerCase(); data = data.filter(t => t.title.toLowerCase().includes(q) || t.contact.toLowerCase().includes(q)); }
    if (typeFilter) data = data.filter(t => t.type === typeFilter);
    if (ownerFilter) data = data.filter(t => t.owner === ownerFilter);
    if (priorityFilter) data = data.filter(t => t.priority === priorityFilter);
    if (activeView === "today") data = data.filter(t => t.isToday || t.dueAt === "Today");
    if (activeView === "overdue") data = data.filter(t => t.isOverdue || t.dueAt === "Overdue");
    if (activeView === "mine") data = data.filter(t => t.owner === "You");
    if (activeView === "open") data = data.filter(t => t.status === "open");
    if (activeView === "done") data = data.filter(t => t.status === "done");
    return data;
  }, [search, typeFilter, ownerFilter, priorityFilter, activeView]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Stats
  const stats = [
    { label: "Open", value: MOCK_TASKS.filter(t => t.status === "open").length, color: "text-blue-600" },
    { label: "Overdue", value: MOCK_TASKS.filter(t => t.isOverdue || t.dueAt === "Overdue").length, color: "text-red-500" },
    { label: "Due Today", value: MOCK_TASKS.filter(t => t.isToday || t.dueAt === "Today").length, color: "text-orange-600" },
    { label: "Completed", value: MOCK_TASKS.filter(t => t.status === "done").length, color: "text-green-600" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tasks</h1>
          <p className="text-gray-500 text-sm">{filtered.length} tasks</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <Plus size={12} /> Create Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* View tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => { setActiveView(v.id); setPage(1); }}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${activeView === v.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {v.label}
            <span className="ml-1.5 bg-gray-100 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded-full">{v.count}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search tasks or contacts..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 border font-bold px-3 py-2 rounded-lg text-xs ${showFilters ? "bg-violet-50 border-violet-300 text-violet-700" : "border-gray-200 text-gray-600"}`}>
          <Filter size={12} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Type", value: typeFilter, setter: setTypeFilter, options: TASK_TYPES },
            { label: "Owner", value: ownerFilter, setter: setOwnerFilter, options: ["You", "Adel M.", "Sara K.", "Mona A."] },
            { label: "Priority", value: priorityFilter, setter: setPriorityFilter, options: ["urgent", "high", "medium", "low"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">{label}</label>
              <select value={value} onChange={e => { setter(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none bg-white">
                <option value="">All</option>
                {options.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-end">
            <button onClick={() => { setTypeFilter(""); setOwnerFilter(""); setPriorityFilter(""); }}
              className="w-full border border-gray-200 text-gray-500 font-bold py-1.5 rounded-lg text-xs hover:bg-white">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-8" />
                {["Task", "Type", "Contact", "Owner", "Priority", "Due", "Status", "Actions"].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                  <CheckCircle size={30} className="mx-auto mb-2 opacity-20" />
                  <p className="font-semibold">No tasks</p>
                </td></tr>
              )}
              {paginated.map(t => <TaskRow key={t.id} task={t} />)}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}