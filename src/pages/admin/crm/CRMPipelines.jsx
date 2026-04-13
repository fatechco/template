import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Filter, ChevronRight, TrendingUp, DollarSign, X,
  MoreHorizontal, Clock, CheckCircle, AlertCircle, Search, Download
} from "lucide-react";

// ─── Pipeline definitions ──────────────────────────────────────────────────────
const PIPELINES = [
  {
    id: "activation", name: "Activation", color: "#6366F1", icon: "🚀",
    stages: [
      { id: "s1_1", name: "New Lead", order: 1, probability: 10, isClosedWon: false, isClosedLost: false },
      { id: "s1_2", name: "Contacted", order: 2, probability: 25, isClosedWon: false, isClosedLost: false },
      { id: "s1_3", name: "Qualified", order: 3, probability: 60, isClosedWon: false, isClosedLost: false },
      { id: "s1_4", name: "Activated", order: 4, probability: 100, isClosedWon: true, isClosedLost: false },
      { id: "s1_5", name: "Disqualified", order: 5, probability: 0, isClosedWon: false, isClosedLost: true },
    ]
  },
  {
    id: "renewal", name: "Renewal", color: "#F59E0B", icon: "🔄",
    stages: [
      { id: "s2_1", name: "Identified", order: 1, probability: 20, isClosedWon: false, isClosedLost: false },
      { id: "s2_2", name: "Outreach Sent", order: 2, probability: 40, isClosedWon: false, isClosedLost: false },
      { id: "s2_3", name: "In Discussion", order: 3, probability: 70, isClosedWon: false, isClosedLost: false },
      { id: "s2_4", name: "Won", order: 4, probability: 100, isClosedWon: true, isClosedLost: false },
      { id: "s2_5", name: "Lost", order: 5, probability: 0, isClosedWon: false, isClosedLost: true },
    ]
  },
  {
    id: "onboarding", name: "Onboarding", color: "#10B981", icon: "🎓",
    stages: [
      { id: "s3_1", name: "Pending", order: 1, probability: 10, isClosedWon: false, isClosedLost: false },
      { id: "s3_2", name: "Docs Received", order: 2, probability: 40, isClosedWon: false, isClosedLost: false },
      { id: "s3_3", name: "Setup Started", order: 3, probability: 75, isClosedWon: false, isClosedLost: false },
      { id: "s3_4", name: "Live", order: 4, probability: 100, isClosedWon: true, isClosedLost: false },
    ]
  },
  {
    id: "upsell", name: "Upsell", color: "#8B5CF6", icon: "⬆️",
    stages: [
      { id: "s4_1", name: "Identified", order: 1, probability: 15, isClosedWon: false, isClosedLost: false },
      { id: "s4_2", name: "Demo", order: 2, probability: 35, isClosedWon: false, isClosedLost: false },
      { id: "s4_3", name: "Proposal", order: 3, probability: 65, isClosedWon: false, isClosedLost: false },
      { id: "s4_4", name: "Won", order: 4, probability: 100, isClosedWon: true, isClosedLost: false },
      { id: "s4_5", name: "Lost", order: 5, probability: 0, isClosedWon: false, isClosedLost: true },
    ]
  },
  {
    id: "reactivation", name: "Reactivation", color: "#EF4444", icon: "🔁",
    stages: [
      { id: "s5_1", name: "Churned", order: 1, probability: 5, isClosedWon: false, isClosedLost: false },
      { id: "s5_2", name: "Re-engaged", order: 2, probability: 30, isClosedWon: false, isClosedLost: false },
      { id: "s5_3", name: "Proposal", order: 3, probability: 60, isClosedWon: false, isClosedLost: false },
      { id: "s5_4", name: "Won", order: 4, probability: 100, isClosedWon: true, isClosedLost: false },
      { id: "s5_5", name: "Lost", order: 5, probability: 0, isClosedWon: false, isClosedLost: true },
    ]
  },
  {
    id: "buyer_conversion", name: "Buyer Conversion", color: "#F97316", icon: "🏠",
    stages: [
      { id: "s6_1", name: "Inquiry", order: 1, probability: 10, isClosedWon: false, isClosedLost: false },
      { id: "s6_2", name: "Qualified", order: 2, probability: 30, isClosedWon: false, isClosedLost: false },
      { id: "s6_3", name: "Viewing", order: 3, probability: 55, isClosedWon: false, isClosedLost: false },
      { id: "s6_4", name: "Offer", order: 4, probability: 75, isClosedWon: false, isClosedLost: false },
      { id: "s6_5", name: "Won", order: 5, probability: 100, isClosedWon: true, isClosedLost: false },
      { id: "s6_6", name: "Lost", order: 6, probability: 0, isClosedWon: false, isClosedLost: true },
    ]
  },
];

const PIPELINE_MAP = Object.fromEntries(PIPELINES.map(p => [p.id, p]));

// ─── Mock opportunities ────────────────────────────────────────────────────────
const MOCK_OPPS = Array.from({ length: 30 }, (_, i) => {
  const pipeline = PIPELINES[i % PIPELINES.length];
  const stage = pipeline.stages[i % pipeline.stages.length];
  return {
    id: `opp${i + 1}`,
    title: ["Pro Plan Renewal", "Agency Business Package", "Featured Listing Upsell", "Developer Enterprise Deal", "Profile Upgrade — Karim", "Reactivate churned agent", "Buyer to Kemedar Pro"][i % 7],
    contactName: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Nour Hassan", "Omar Rashid"][i % 5],
    contactId: `c${(i % 5) + 1}`,
    accountName: i % 3 === 0 ? ["Elite Realty", "Palm Hills", "Gulf Corp"][i % 3] : null,
    pipelineId: pipeline.id,
    stageId: stage.id,
    stageName: stage.name,
    owner: ["You", "Adel M.", "Sara K.", "Mona A."][i % 4],
    value: [1200, 8000, 400, 24000, 600, 1800, 2400][i % 7],
    probability: stage.probability,
    expectedClose: `2026-0${Math.min(i % 6 + 4, 9)}-${String((i % 28) + 1).padStart(2, "0")}`,
    status: stage.isClosedWon ? "won" : stage.isClosedLost ? "lost" : "open",
    nextStep: i % 3 === 0 ? "Send proposal" : i % 3 === 1 ? "Follow-up call" : "Waiting for reply",
    source: ["CRM", "Import", "Manual", "Automation"][i % 4],
    tags: i % 4 === 0 ? ["hot"] : [],
    lastActivity: `${(i % 10) + 1} days ago`,
    wonLostReason: stage.isClosedLost ? "Price too high" : stage.isClosedWon ? "Accepted offer" : null,
  };
});

const PRIORITY_COLOR = { hot: "bg-red-100 text-red-600" };
const STATUS_COLOR = { open: "bg-blue-100 text-blue-700", won: "bg-green-100 text-green-700", lost: "bg-red-100 text-red-600" };

// ─── Close Opp Modal ──────────────────────────────────────────────────────────
function CloseOppModal({ opp, onClose, onConfirm }) {
  const [outcome, setOutcome] = useState("won");
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
        <h2 className="text-base font-black text-gray-900 mb-4">Close Opportunity</h2>
        <p className="text-xs text-gray-500 mb-3"><strong>{opp?.title}</strong></p>
        <div className="flex gap-3 mb-3">
          {["won", "lost"].map(o => (
            <button key={o} onClick={() => setOutcome(o)}
              className={`flex-1 py-2 rounded-xl font-bold text-xs border-2 transition-all capitalize ${outcome === o ? (o === "won" ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500") : "border-gray-200 text-gray-600"}`}>
              {o === "won" ? "✅ Won" : "✗ Lost"}
            </button>
          ))}
        </div>
        {outcome === "lost" && (
          <div className="mb-3">
            <label className="block text-[10px] font-bold text-gray-500 mb-1">Loss Reason (required)</label>
            <select value={reason} onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
              <option value="">Select reason...</option>
              {["Price too high", "Went with competitor", "No budget", "Not interested", "Wrong timing", "Product not suitable", "No response"].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button onClick={() => onConfirm(outcome, reason)}
            disabled={outcome === "lost" && !reason}
            className={`font-black px-5 py-2 rounded-xl text-xs text-white disabled:opacity-40 ${outcome === "won" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
            Confirm Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Opp Modal ─────────────────────────────────────────────────────────
function CreateOppModal({ onClose }) {
  const [form, setForm] = useState({ title: "", pipelineId: "activation", value: "", owner: "You", expectedClose: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-gray-900">New Opportunity</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <input placeholder="Opportunity title..." value={form.title} onChange={e => set("title", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-violet-400" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Pipeline</label>
              <select value={form.pipelineId} onChange={e => set("pipelineId", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {PIPELINES.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Value (EGP)</label>
              <input type="number" placeholder="e.g. 1200" value={form.value} onChange={e => set("value", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Owner</label>
              <select value={form.owner} onChange={e => set("owner", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {["You", "Adel M.", "Sara K.", "Mona A."].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Expected Close</label>
              <input type="date" value={form.expectedClose} onChange={e => set("expectedClose", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
          </div>
          <input placeholder="Linked contact (search)..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="bg-violet-600 text-white font-black px-5 py-2 rounded-xl text-xs hover:bg-violet-700">Create</button>
        </div>
      </div>
    </div>
  );
}

// ─── Kanban View ──────────────────────────────────────────────────────────────
function KanbanView({ opps, pipeline, onClose }) {
  const stages = pipeline.stages.filter(s => !s.isClosedLost);
  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {stages.map(stage => {
        const cards = opps.filter(o => o.stageId === stage.id && o.pipelineId === pipeline.id);
        const stageValue = cards.reduce((s, o) => s + o.value, 0);
        return (
          <div key={stage.id} className="flex-shrink-0 w-60">
            <div className="bg-gray-100 rounded-xl p-2.5 mb-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-black text-gray-700">{stage.name}</p>
                <span className="text-[10px] bg-white text-gray-600 font-bold px-1.5 py-0.5 rounded-full">{cards.length}</span>
              </div>
              <p className="text-[10px] text-gray-500">EGP {stageValue.toLocaleString()} · {stage.probability}%</p>
            </div>
            <div className="space-y-2">
              {cards.map(opp => (
                <div key={opp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
                  <p className="text-xs font-bold text-gray-900 mb-1 truncate">{opp.title}</p>
                  <p className="text-[10px] text-gray-500 truncate">{opp.contactName}{opp.accountName ? ` · ${opp.accountName}` : ""}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-violet-600">EGP {opp.value.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400">{opp.expectedClose}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{opp.owner}</span>
                    <div className="flex gap-1">
                      <button onClick={() => onClose(opp)} className="text-[10px] border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded hover:bg-gray-50">Close</button>
                      <Link to={`/admin/crm/opportunities/${opp.id}`} className="text-[10px] text-violet-500 border border-violet-200 px-1.5 py-0.5 rounded hover:bg-violet-50">View</Link>
                    </div>
                  </div>
                </div>
              ))}
              {cards.length === 0 && <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-[10px] text-gray-400">Drop here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Forecast Summary ─────────────────────────────────────────────────────────
function ForecastView({ opps, pipeline }) {
  const open = opps.filter(o => o.pipelineId === pipeline.id && o.status === "open");
  const weighted = open.reduce((s, o) => s + (o.value * o.probability / 100), 0);
  const total = open.reduce((s, o) => s + o.value, 0);
  const won = opps.filter(o => o.pipelineId === pipeline.id && o.status === "won").reduce((s, o) => s + o.value, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-3">
        {pipeline.stages.filter(s => !s.isClosedLost).map(stage => {
          const stageOpps = open.filter(o => o.stageId === stage.id);
          const stageVal = stageOpps.reduce((s, o) => s + o.value, 0);
          return (
            <div key={stage.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="w-32 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{stage.name}</p>
                <p className="text-[10px] text-gray-400">{stage.probability}% prob</p>
              </div>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min(100, (stageVal / Math.max(total, 1)) * 100)}%` }} />
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-xs font-black text-gray-900">EGP {stageVal.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{stageOpps.length} opps</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        {[
          { label: "Open Pipeline", value: `EGP ${total.toLocaleString()}`, color: "text-blue-600" },
          { label: "Weighted Forecast", value: `EGP ${Math.round(weighted).toLocaleString()}`, color: "text-violet-600" },
          { label: "Won This Period", value: `EGP ${won.toLocaleString()}`, color: "text-green-600" },
          { label: "Open Opportunities", value: open.length, color: "text-gray-900" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMPipelines() {
  const [activePipeline, setActivePipeline] = useState(PIPELINES[0]);
  const [view, setView] = useState("kanban");
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [closingOpp, setClosingOpp] = useState(null);
  const [opps, setOpps] = useState(MOCK_OPPS);

  const filtered = useMemo(() => {
    let data = opps.filter(o => o.pipelineId === activePipeline.id);
    if (search) { const q = search.toLowerCase(); data = data.filter(o => o.title.toLowerCase().includes(q) || o.contactName.toLowerCase().includes(q)); }
    if (ownerFilter) data = data.filter(o => o.owner === ownerFilter);
    return data;
  }, [opps, activePipeline, search, ownerFilter]);

  const openOpps = filtered.filter(o => o.status === "open");
  const pipelineTotal = openOpps.reduce((s, o) => s + o.value, 0);

  const handleCloseOpp = (opp) => setClosingOpp(opp);
  const handleConfirmClose = (outcome, reason) => {
    setOpps(prev => prev.map(o => o.id === closingOpp.id
      ? { ...o, status: outcome, wonLostReason: reason || null }
      : o));
    setClosingOpp(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pipelines & Opportunities</h1>
          <p className="text-gray-500 text-sm">{filtered.length} opportunities · EGP {pipelineTotal.toLocaleString()} open</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><Download size={12} /> Export</button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs"><Plus size={12} /> New Opportunity</button>
        </div>
      </div>

      {/* Pipeline selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {PIPELINES.map(p => {
          const count = opps.filter(o => o.pipelineId === p.id && o.status === "open").length;
          return (
            <button key={p.id} onClick={() => setActivePipeline(p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border-2 whitespace-nowrap flex-shrink-0 transition-all ${activePipeline.id === p.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 bg-white hover:border-violet-300"}`}>
              {p.icon} {p.name}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activePipeline.id === p.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Views + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-0 bg-gray-100 p-1 rounded-xl">
          {[["kanban", "Kanban"], ["list", "List"], ["forecast", "Forecast"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === v ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}>{l}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Owners</option>
          {["You", "Adel M.", "Sara K.", "Mona A."].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* View content */}
      {view === "kanban" && <KanbanView opps={filtered} pipeline={activePipeline} onClose={handleCloseOpp} />}
      {view === "forecast" && <ForecastView opps={opps} pipeline={activePipeline} />}
      {view === "list" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["Opportunity", "Contact/Account", "Stage", "Owner", "Value", "Probability", "Close Date", "Status", ""].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900 max-w-[160px] truncate">
                      <div>{o.title}</div>
                      {o.tags.map(t => <span key={t} className="text-[9px] bg-red-100 text-red-600 font-bold px-1 rounded">{t}</span>)}
                    </td>
                    <td className="px-3 py-3"><p className="font-semibold text-gray-700">{o.contactName}</p>{o.accountName && <p className="text-[10px] text-gray-400">{o.accountName}</p>}</td>
                    <td className="px-3 py-3"><span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">{o.stageName}</span></td>
                    <td className="px-3 py-3 font-semibold text-gray-600">{o.owner}</td>
                    <td className="px-3 py-3 font-black text-violet-600">EGP {o.value.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1"><div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${o.probability}%` }} /></div><span className="font-bold text-gray-600">{o.probability}%</span></div>
                    </td>
                    <td className="px-3 py-3 text-gray-500">{o.expectedClose}</td>
                    <td className="px-3 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        {o.status === "open" && <button onClick={() => handleCloseOpp(o)} className="text-[10px] border border-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">Close</button>}
                        <Link to={`/admin/crm/opportunities/${o.id}`} className="p-1 hover:bg-violet-50 rounded text-violet-500"><ChevronRight size={12} /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && <CreateOppModal onClose={() => setShowCreate(false)} />}
      {closingOpp && <CloseOppModal opp={closingOpp} onClose={() => setClosingOpp(null)} onConfirm={handleConfirmClose} />}
    </div>
  );
}