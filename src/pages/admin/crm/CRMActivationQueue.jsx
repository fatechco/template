import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, Phone, MessageCircle, ChevronRight, UserPlus,
  CheckCircle, X, Clock, AlertCircle, RefreshCw, Download,
  ChevronDown
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────
const OUTCOMES = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-600" },
  { value: "no_answer", label: "No Answer", color: "bg-red-100 text-red-600" },
  { value: "wrong_number", label: "Wrong Number", color: "bg-red-100 text-red-700" },
  { value: "callback", label: "Call Back Later", color: "bg-orange-100 text-orange-700" },
  { value: "interested", label: "Interested", color: "bg-green-100 text-green-700" },
  { value: "not_interested", label: "Not Interested", color: "bg-gray-100 text-gray-500" },
  { value: "already_active", label: "Already Active", color: "bg-teal-100 text-teal-700" },
  { value: "invalid", label: "Invalid Import", color: "bg-red-50 text-red-400" },
  { value: "escalated", label: "Escalated", color: "bg-purple-100 text-purple-700" },
];

const OUTCOME_MAP = Object.fromEntries(OUTCOMES.map(o => [o.value, o]));

const SOURCES = ["Aqarmap", "OLX", "Property Finder", "Bayut", "Manual", "CSV Import"];

const TABS = [
  { id: "all", label: "All" },
  { id: "from_import", label: "From Import" },
  { id: "pending_activation", label: "Pending Activation" },
  { id: "assigned_to_me", label: "Assigned to Me" },
  { id: "interested", label: "Interested" },
  { id: "no_response", label: "No Response" },
];

// ─── Mock queue data ───────────────────────────────────────────────────────────
const MOCK_QUEUE = Array.from({ length: 35 }, (_, i) => {
  const outcomes = ["pending", "no_answer", "callback", "interested", "not_interested", "already_active", "invalid", "escalated", "wrong_number"];
  const types = ["imported_owner", "pending_activation", "imported_user", "reactivation"];
  const sources = SOURCES;

  return {
    id: `q${i + 1}`,
    displayName: ["Mohamed Hassan", "Fatima Ali", "Ahmed Kamel", "Sara Nour", "Omar Rashid", "Rania Samir", "Karim Bassem", "Nour Adel"][i % 8],
    phone: `+20 1${String(i * 11 + 100000000).slice(0, 9)}`,
    email: i % 3 === 0 ? `user${i}@example.com` : null,
    source: sources[i % sources.length],
    type: types[i % types.length],
    importedRecords: (i % 10) + 1,
    assignedRep: ["You", "Adel M.", "Sara K.", "Mona A.", null][i % 5],
    outcome: outcomes[i % outcomes.length],
    lastAttempt: i % 4 === 0 ? null : `${(i % 5) + 1} days ago`,
    nextAttempt: i % 3 === 0 ? "Tomorrow" : i % 6 === 0 ? "Overdue" : null,
    attempts: i % 4,
    linkedContactId: i % 3 === 0 ? `c${i + 1}` : null,
    city: ["Cairo", "Giza", "Alexandria", "New Cairo"][i % 4],
    notes: i % 5 === 0 ? "Prefers morning calls" : "",
    createdAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  };
});

const PAGE_SIZE = 12;

// ─── Quick Action Row ──────────────────────────────────────────────────────────
function QueueRow({ item, onOutcomeChange }) {
  const [expanded, setExpanded] = useState(false);
  const [outcome, setOutcome] = useState(item.outcome);
  const [notes, setNotes] = useState(item.notes);
  const [nextAttempt, setNextAttempt] = useState(item.nextAttempt || "");
  const outcomeConf = OUTCOME_MAP[outcome] || OUTCOME_MAP.pending;

  const handleOutcome = (val) => {
    setOutcome(val);
    onOutcomeChange && onOutcomeChange(item.id, val);
  };

  const typeLabel = {
    imported_owner: "Imported Owner",
    pending_activation: "Pending Activation",
    imported_user: "Imported User",
    reactivation: "Reactivation",
  }[item.type] || item.type;

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
        {/* Contact */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
              {item.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-xs truncate max-w-[130px]">{item.displayName}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                item.type === "imported_owner" ? "bg-blue-100 text-blue-700" :
                item.type === "pending_activation" ? "bg-orange-100 text-orange-700" :
                item.type === "reactivation" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
              }`}>{typeLabel}</span>
            </div>
          </div>
        </td>
        {/* Phone */}
        <td className="px-3 py-3 font-mono text-xs text-gray-600">{item.phone}</td>
        {/* Source */}
        <td className="px-3 py-3">
          <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">{item.source}</span>
        </td>
        {/* Records */}
        <td className="px-3 py-3">
          <span className="bg-orange-100 text-orange-700 font-black text-[10px] px-2 py-0.5 rounded-full">{item.importedRecords}</span>
        </td>
        {/* Rep */}
        <td className="px-3 py-3">
          {item.assignedRep
            ? <span className="text-xs font-semibold text-gray-700">{item.assignedRep}</span>
            : <button className="text-[10px] border border-dashed border-gray-300 text-gray-400 font-bold px-2 py-1 rounded-lg hover:border-violet-300 hover:text-violet-600">Assign</button>}
        </td>
        {/* Outcome */}
        <td className="px-3 py-3">
          <select value={outcome} onChange={e => handleOutcome(e.target.value)}
            className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${outcomeConf.color}`}>
            {OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </td>
        {/* Last Attempt */}
        <td className="px-3 py-3">
          {item.lastAttempt
            ? <div>
                <p className="text-xs text-gray-500">{item.lastAttempt}</p>
                <p className="text-[10px] text-gray-300">{item.attempts} attempts</p>
              </div>
            : <span className="text-red-400 text-xs font-bold">Never</span>}
        </td>
        {/* Next Attempt */}
        <td className="px-3 py-3">
          {item.nextAttempt === "Overdue"
            ? <span className="text-red-500 font-bold text-xs flex items-center gap-1"><AlertCircle size={10} /> Overdue</span>
            : item.nextAttempt
            ? <span className="text-orange-500 text-xs font-semibold">{item.nextAttempt}</span>
            : <span className="text-gray-300 text-xs">—</span>}
        </td>
        {/* Quick Actions */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Quick Call"><Phone size={13} /></button>
            <button className="p-1.5 hover:bg-green-50 rounded-lg text-green-500" title="WhatsApp"><MessageCircle size={13} /></button>
            {item.linkedContactId
              ? <Link to={`/admin/crm/contacts/${item.linkedContactId}`} className="p-1.5 hover:bg-violet-50 rounded-lg text-violet-500" title="Open Contact"><ChevronRight size={13} /></Link>
              : <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500" title="Create Contact"><UserPlus size={13} /></button>}
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
              <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded panel */}
      {expanded && (
        <tr className="bg-gray-50/50">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Contact info */}
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Contact Info</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>📞 {item.phone}</p>
                  {item.email && <p>📧 {item.email}</p>}
                  <p>📍 {item.city}</p>
                  <p>📥 Source: {item.source}</p>
                  <p>📅 Added: {item.createdAt}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    <Phone size={11} /> Call Now
                  </button>
                  <button className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs">
                    <MessageCircle size={11} /> WhatsApp
                  </button>
                </div>
              </div>
              {/* Notes + Follow-up */}
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Notes & Follow-up</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Add notes about this contact..."
                  rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-violet-400 resize-none" />
                <div className="mt-2">
                  <label className="text-[10px] font-bold text-gray-500">Next Attempt</label>
                  <input type="date" value={nextAttempt} onChange={e => setNextAttempt(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-violet-400 mt-1" />
                </div>
              </div>
              {/* Actions */}
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Actions</p>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
                    <UserPlus size={12} /> Create CRM Contact
                  </button>
                  <button className="w-full flex items-center gap-2 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
                    <CheckCircle size={12} /> Create Follow-up Task
                  </button>
                  <button className="w-full flex items-center gap-2 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
                    <RefreshCw size={12} /> Assign to Another Rep
                  </button>
                  <button className="w-full flex items-center gap-2 border border-red-200 text-red-500 font-bold px-3 py-2 rounded-lg text-xs hover:bg-red-50">
                    <X size={12} /> Mark as Invalid
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total in Queue", value: MOCK_QUEUE.length, color: "text-gray-900" },
  { label: "Pending", value: MOCK_QUEUE.filter(q => q.outcome === "pending").length, color: "text-gray-600" },
  { label: "Interested", value: MOCK_QUEUE.filter(q => q.outcome === "interested").length, color: "text-green-600" },
  { label: "No Answer", value: MOCK_QUEUE.filter(q => q.outcome === "no_answer").length, color: "text-red-500" },
  { label: "Callback", value: MOCK_QUEUE.filter(q => q.outcome === "callback").length, color: "text-orange-600" },
  { label: "Unassigned", value: MOCK_QUEUE.filter(q => !q.assignedRep).length, color: "text-violet-600" },
];

export default function CRMActivationQueue() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [repFilter, setRepFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [queue, setQueue] = useState(MOCK_QUEUE);

  const handleOutcomeChange = (id, outcome) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, outcome } : q));
  };

  const filtered = useMemo(() => {
    let data = [...queue];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(item => item.displayName.toLowerCase().includes(q) || item.phone.includes(q));
    }
    if (sourceFilter) data = data.filter(item => item.source === sourceFilter);
    if (repFilter) data = data.filter(item => item.assignedRep === repFilter);

    if (activeTab === "from_import") data = data.filter(item => ["imported_owner", "imported_user"].includes(item.type));
    if (activeTab === "pending_activation") data = data.filter(item => item.type === "pending_activation");
    if (activeTab === "assigned_to_me") data = data.filter(item => item.assignedRep === "You");
    if (activeTab === "interested") data = data.filter(item => item.outcome === "interested");
    if (activeTab === "no_response") data = data.filter(item => ["no_answer", "pending"].includes(item.outcome) && item.attempts > 0);

    return data;
  }, [queue, search, sourceFilter, repFilter, activeTab]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Activation Queue</h1>
          <p className="text-gray-500 text-sm">Imported & pending records awaiting sales contact</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export
          </button>
          <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <RefreshCw size={12} /> Auto-Assign
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name or phone..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 border font-bold px-3 py-2 rounded-lg text-xs ${showFilters ? "bg-violet-50 border-violet-300 text-violet-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
          <Filter size={12} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Source</label>
            <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none bg-white">
              <option value="">All Sources</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Assigned Rep</label>
            <select value={repFilter} onChange={e => { setRepFilter(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none bg-white">
              <option value="">All Reps</option>
              {["You", "Adel M.", "Sara K.", "Mona A."].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setSourceFilter(""); setRepFilter(""); setPage(1); }}
              className="w-full border border-gray-200 text-gray-500 font-bold py-1.5 rounded-lg text-xs hover:bg-white">Clear</button>
          </div>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Contact", "Phone", "Source", "Records", "Rep", "Outcome", "Last Attempt", "Next Attempt", "Actions"].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                  <RefreshCw size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">No items in this queue</p>
                  <p className="text-xs mt-1">Try a different tab or clear filters</p>
                </td></tr>
              )}
              {paginated.map(item => (
                <QueueRow key={item.id} item={item} onOutcomeChange={handleOutcomeChange} />
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">Prev</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold ${page === p ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>;
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Logic note */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-xs text-violet-700 space-y-1">
        <p className="font-black">⚙️ Auto-match logic</p>
        <p>Imported records are matched to existing CRM contacts by normalized phone/email. If matched → linked. If unmatched → new contact created with source=imported, stage=lead.</p>
        <p>Ownership assigned by round-robin within the active team, or manually overridden.</p>
      </div>
    </div>
  );
}