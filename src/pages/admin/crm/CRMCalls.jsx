import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Phone, Plus, Search, Filter, Download, ChevronRight, Clock,
  AlertCircle, CheckCircle, Bot, Mic, X, MessageCircle
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const OUTCOMES = [
  { value: "connected", label: "Connected", color: "bg-green-100 text-green-700" },
  { value: "voicemail", label: "Voicemail", color: "bg-blue-100 text-blue-700" },
  { value: "no_answer", label: "No Answer", color: "bg-red-100 text-red-600" },
  { value: "wrong_number", label: "Wrong Number", color: "bg-red-100 text-red-700" },
  { value: "callback_requested", label: "Callback Requested", color: "bg-orange-100 text-orange-700" },
  { value: "interested", label: "Interested", color: "bg-teal-100 text-teal-700" },
  { value: "not_interested", label: "Not Interested", color: "bg-gray-100 text-gray-500" },
  { value: "escalated", label: "Escalated", color: "bg-purple-100 text-purple-700" },
];
const OUTCOME_MAP = Object.fromEntries(OUTCOMES.map(o => [o.value, o]));

const MOCK_CALLS = Array.from({ length: 25 }, (_, i) => ({
  id: `call${i + 1}`,
  contactId: `c${(i % 5) + 1}`,
  contactName: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Nour Hassan", "Omar Rashid"][i % 5],
  accountName: i % 3 === 0 ? ["Elite Realty", "Palm Hills Dev", "Gulf Corp"][i % 3] : null,
  direction: i % 3 === 0 ? "inbound" : "outbound",
  callerType: i % 5 === 0 ? "ai_agent" : "human",
  calledBy: ["You", "Adel M.", "Sara K.", "AI Agent", "You"][i % 5],
  phone: `+20 1${String(i * 111 + 100000000).slice(0, 9)}`,
  status: ["completed", "no_answer", "voicemail", "completed", "failed"][i % 5],
  outcome: OUTCOMES[i % OUTCOMES.length].value,
  durationSeconds: i % 3 !== 0 ? (i + 1) * 37 : 0,
  startedAt: `2026-04-0${Math.min(i % 9 + 1, 9)} ${(9 + i % 8)}:${String((i * 7) % 60).padStart(2, "0")}`,
  transcriptAvailable: i % 3 === 0 && i % 5 !== 0,
  summary: i % 3 === 0 ? "Contact confirmed interest in renewal. Follow-up scheduled for next week." : null,
  linkedTask: i % 4 === 0 ? "Renewal follow-up task" : null,
  linkedOpp: i % 5 === 0 ? "Pro Renewal" : null,
  tags: i % 4 === 0 ? ["warm", "renewal"] : [],
  notes: i % 3 === 0 ? "Contact mentioned competitor pricing concerns." : "",
}));

const PAGE_SIZE = 12;

// ─── Log Call Modal ─────────────────────────────────────────────────────────────
function LogCallModal({ onClose }) {
  const [form, setForm] = useState({ contact: "", direction: "outbound", outcome: "connected", duration: "", notes: "", linkedTask: false });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">📞 Log a Call</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input placeholder="Search contact..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Direction</label>
              <select value={form.direction} onChange={e => set("direction", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Outcome</label>
              <select value={form.outcome} onChange={e => set("outcome", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Duration (min:sec)</label>
              <input placeholder="e.g. 3:45" value={form.duration} onChange={e => set("duration", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Date/Time</label>
              <input type="datetime-local" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
          </div>
          <textarea placeholder="Notes about the call..." rows={2} value={form.notes} onChange={e => set("notes", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.linkedTask} onChange={e => set("linkedTask", e.target.checked)} className="accent-violet-600" />
            <span className="text-xs text-gray-700">Create follow-up task automatically</span>
          </label>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="bg-violet-600 text-white font-black px-5 py-2 rounded-xl text-xs">Log Call</button>
        </div>
      </div>
    </div>
  );
}

// ─── Call Row ───────────────────────────────────────────────────────────────────
function CallRow({ call }) {
  const outcomeConf = OUTCOME_MAP[call.outcome] || { label: call.outcome, color: "bg-gray-100 text-gray-500" };
  const dur = call.durationSeconds > 0
    ? `${Math.floor(call.durationSeconds / 60)}:${String(call.durationSeconds % 60).padStart(2, "0")}`
    : "—";

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{call.startedAt}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
            {call.contactName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">{call.contactName}</p>
            {call.accountName && <p className="text-[10px] text-gray-400 truncate">{call.accountName}</p>}
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${call.callerType === "ai_agent" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
          {call.callerType === "ai_agent" ? "🤖 AI" : call.calledBy}
        </span>
      </td>
      <td className="px-3 py-3">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${call.direction === "inbound" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
          {call.direction === "inbound" ? "↓ In" : "↑ Out"}
        </span>
      </td>
      <td className="px-3 py-3 text-xs font-mono text-gray-600">{dur}</td>
      <td className="px-3 py-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${outcomeConf.color}`}>{outcomeConf.label}</span>
      </td>
      <td className="px-3 py-3">
        {call.transcriptAvailable
          ? <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 w-fit"><Mic size={9} /> Transcript</span>
          : <span className="text-gray-300 text-[10px]">—</span>}
      </td>
      <td className="px-3 py-3">
        {call.linkedTask && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-full">Task</span>}
        {call.linkedOpp && <span className="text-[10px] bg-violet-100 text-violet-700 font-bold px-1.5 py-0.5 rounded-full ml-1">Opp</span>}
      </td>
      <td className="px-3 py-3">
        <div className="flex gap-1">
          <button className="p-1 hover:bg-green-50 rounded text-green-600" title="Callback"><Phone size={12} /></button>
          <button className="p-1 hover:bg-green-50 rounded text-green-500" title="WhatsApp"><MessageCircle size={12} /></button>
          <Link to={`/admin/crm/calls/${call.id}`} className="p-1 hover:bg-violet-50 rounded text-violet-500"><ChevronRight size={12} /></Link>
        </div>
      </td>
    </tr>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMCalls() {
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [dirFilter, setDirFilter] = useState("");
  const [callerFilter, setCallerFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...MOCK_CALLS];
    if (search) { const q = search.toLowerCase(); data = data.filter(c => c.contactName.toLowerCase().includes(q)); }
    if (outcomeFilter) data = data.filter(c => c.outcome === outcomeFilter);
    if (dirFilter) data = data.filter(c => c.direction === dirFilter);
    if (callerFilter) data = data.filter(c => c.calledBy === callerFilter || (callerFilter === "ai_agent" && c.callerType === "ai_agent"));
    return data;
  }, [search, outcomeFilter, dirFilter, callerFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: "Total Calls", value: MOCK_CALLS.length, color: "text-gray-900" },
    { label: "Connected", value: MOCK_CALLS.filter(c => c.outcome === "connected").length, color: "text-green-600" },
    { label: "No Answer", value: MOCK_CALLS.filter(c => c.outcome === "no_answer").length, color: "text-red-500" },
    { label: "Callback Needed", value: MOCK_CALLS.filter(c => c.outcome === "callback_requested").length, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Calls</h1>
          <p className="text-gray-500 text-sm">{filtered.length} calls</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-dashed border-gray-300 text-gray-500 font-bold px-3 py-2 rounded-lg text-xs hover:border-violet-400 hover:text-violet-600">
            <Bot size={12} /> AI Call <span className="text-[9px] bg-purple-100 text-purple-600 px-1 rounded">PLACEHOLDER</span>
          </button>
          <button onClick={() => setShowLog(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <Plus size={12} /> Log Call
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contact..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 border font-bold px-3 py-2 rounded-lg text-xs ${showFilters ? "bg-violet-50 border-violet-300 text-violet-700" : "border-gray-200 text-gray-600"}`}>
          <Filter size={12} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Outcome</label>
            <select value={outcomeFilter} onChange={e => setOutcomeFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none bg-white">
              <option value="">All</option>
              {OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Direction</label>
            <select value={dirFilter} onChange={e => setDirFilter(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none bg-white">
              <option value="">All</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setOutcomeFilter(""); setDirFilter(""); }}
              className="w-full border border-gray-200 text-gray-500 font-bold py-1.5 rounded-lg text-xs hover:bg-white">Clear</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Date/Time", "Contact", "By", "Dir", "Duration", "Outcome", "Transcript", "Linked", ""].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                  <Phone size={30} className="mx-auto mb-2 opacity-20" />
                  <p className="font-semibold">No calls found</p>
                </td></tr>
              )}
              {paginated.map(c => <CallRow key={c.id} call={c} />)}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {showLog && <LogCallModal onClose={() => setShowLog(false)} />}
    </div>
  );
}