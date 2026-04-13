import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle, Phone, Mail, CheckCircle, XCircle, ChevronRight,
  Save, Search, Filter, Calendar, Clock, User, Home, ArrowRight,
  AlertCircle, RefreshCw, Download, MoreVertical, X
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SALES_REPS = [
  { id: "rep1", name: "Ahmed Karim", avatar: "AK", color: "bg-orange-500" },
  { id: "rep2", name: "Sara Hassan", avatar: "SH", color: "bg-blue-500" },
  { id: "rep3", name: "Omar Nasser", avatar: "ON", color: "bg-green-500" },
];

const MOCK_QUEUE = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: [
    "Modern Apartment New Cairo", "Villa Sheikh Zayed", "Studio Maadi",
    "Duplex 5th Settlement", "Office Smart Village", "Twin House October",
    "Penthouse Heliopolis", "Chalet North Coast", "Apartment Zamalek", "Land New Capital"
  ][i % 10],
  category: ["Apartment", "Villa", "Studio", "Duplex", "Office", "Twin House", "Penthouse", "Chalet", "Apartment", "Land"][i % 10],
  purpose: ["For Sale", "For Rent", "For Sale", "For Sale", "For Rent", "For Sale", "For Sale", "For Rent", "For Sale", "For Sale"][i % 10],
  city: ["New Cairo", "Sheikh Zayed", "Maadi", "5th Settlement", "Smart Village", "6th October", "Heliopolis", "North Coast", "Zamalek", "New Capital"][i % 10],
  ownerName: ["Ahmed Hassan", "Sara Mohamed", "Omar Khalil", "Fatima Ali", null, "Karim Nasser", "Layla Ahmed", "Mohamed Samir", "Nour Ali", "Rania Adel"][i % 10],
  phone: `+20 1${String(i * 7 + 10).padStart(9, "0")}`,
  price: [2500000, 8000000, 750000, 3200000, 1500000, 5500000, 12000000, 1800000, 4200000, 6000000][i % 10],
  area: [120, 350, 55, 220, 180, 280, 380, 140, 160, 500][i % 10],
  beds: [2, 5, 0, 3, 0, 4, 5, 3, 2, 0][i % 10],
  source: ["Aqarmap", "OLX", "Property Finder", "Bayut", "Aqarmap", "OLX", "Property Finder", "Manual", "Aqarmap", "OLX"][i % 10],
  assignedTo: SALES_REPS[i % 3].id,
  movedAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  contactStatus: ["not_contacted", "not_contacted", "contacted", "no_answer", "interested", "no_answer", "not_contacted", "not_interested", "interested", "callback_scheduled"][i % 10],
  callCount: [0, 0, 1, 2, 3, 1, 0, 1, 4, 2][i % 10],
  lastCallDate: i % 3 === 0 ? null : `2026-03-${String((i % 20) + 8).padStart(2, "0")}`,
  callbackDate: i % 10 === 9 ? "2026-04-05" : null,
  image: ["photo-1560448204-e02f11c3d0e2", "photo-1600596542815-ffad4c1539a9", "photo-1502672260266-1c1ef2d93688", "photo-1564013799919-ab600027ffc6"][i % 4],
  notes: i % 3 === 0 ? "" : ["Owner was polite, interested in listing. Will call back.", "No answer x2. Try evening.", "Owner said property already sold."][i % 3],
  interactionHistory: i === 0 ? [
    { date: "Mar 20", action: "Moved to Pending", by: "Admin" },
    { date: "Mar 21", action: "Assigned to Ahmed Karim", by: "Admin" },
    { date: "Mar 22", action: "Called — No answer", by: "Ahmed Karim" },
    { date: "Mar 23", action: "WhatsApp sent", by: "Ahmed Karim" },
  ] : [],
}));

// ─── Config ──────────────────────────────────────────────────────────────────
const CONTACT_STATUS_CONFIG = {
  not_contacted:       { label: "Not Contacted",       color: "bg-gray-100 text-gray-600",      dot: "bg-gray-400",    emoji: "⚪" },
  contacted:           { label: "Contacted",            color: "bg-blue-100 text-blue-700",      dot: "bg-blue-500",    emoji: "🔵" },
  no_answer:           { label: "No Answer",            color: "bg-red-100 text-red-600",        dot: "bg-red-500",     emoji: "🔴" },
  callback_scheduled:  { label: "Callback Scheduled",  color: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-500",  emoji: "📅" },
  interested:          { label: "Interested ✅",         color: "bg-green-100 text-green-700",    dot: "bg-green-500",   emoji: "🟢" },
  not_interested:      { label: "Not Interested",       color: "bg-gray-100 text-gray-500",      dot: "bg-gray-400",    emoji: "⛔" },
  activated:           { label: "Activated",            color: "bg-emerald-100 text-emerald-700",dot: "bg-emerald-500", emoji: "⭐" },
};

const OUTCOME_BUTTONS = [
  { key: "interested",         label: "✅ Interested",         className: "bg-green-500 hover:bg-green-600 text-white" },
  { key: "no_answer",          label: "📵 No Answer",          className: "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200" },
  { key: "callback_scheduled", label: "📅 Schedule Callback",  className: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-200" },
  { key: "not_interested",     label: "⛔ Not Interested",     className: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = CONTACT_STATUS_CONFIG[status] || CONTACT_STATUS_CONFIG.not_contacted;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function RepAvatar({ repId, size = "sm" }) {
  const rep = SALES_REPS.find(r => r.id === repId);
  if (!rep) return null;
  const sz = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-xs";
  return (
    <div className={`${sz} ${rep.color} rounded-full text-white font-black flex items-center justify-center flex-shrink-0`} title={rep.name}>
      {rep.avatar}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminContactCRM() {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [selectedId, setSelectedId] = useState(MOCK_QUEUE[0].id);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRep, setFilterRep] = useState("All");
  const [channels, setChannels] = useState({ whatsapp: false, email: false, sms: false, phone: false });
  const [notes, setNotes] = useState("");
  const [callbackDate, setCallbackDate] = useState("");
  const [showActivateModal, setShowActivateModal] = useState(false);

  const selected = queue.find(p => p.id === selectedId) || queue[0];

  const filtered = queue.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.phone.includes(search) && !(p.ownerName || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "All" && p.contactStatus !== filterStatus) return false;
    if (filterRep !== "All" && p.assignedTo !== filterRep) return false;
    return true;
  });

  const selectItem = (item) => {
    setSelectedId(item.id);
    setChannels({ whatsapp: false, email: false, sms: false, phone: false });
    setNotes(item.notes || "");
    setCallbackDate(item.callbackDate || "");
  };

  const setOutcome = (outcomeKey) => {
    setQueue(prev => prev.map(p => p.id === selected.id ? {
      ...p,
      contactStatus: outcomeKey,
      callCount: p.callCount + 1,
      lastCallDate: new Date().toISOString().slice(0, 10),
      callbackDate: outcomeKey === "callback_scheduled" ? callbackDate : p.callbackDate,
      notes: notes || p.notes,
      interactionHistory: [
        { date: new Date().toLocaleDateString("en-GB", { day: "short", month: "short" }), action: `Logged: ${CONTACT_STATUS_CONFIG[outcomeKey]?.label}`, by: "Admin" },
        ...(p.interactionHistory || []),
      ]
    } : p));
    if (outcomeKey === "interested") setShowActivateModal(true);
    // Auto advance to next not_contacted
    const nextProp = queue.find(p => p.id !== selected.id && p.contactStatus === "not_contacted");
    if (nextProp) setSelectedId(nextProp.id);
  };

  const stats = {
    total: queue.length,
    notContacted: queue.filter(p => p.contactStatus === "not_contacted").length,
    interested: queue.filter(p => p.contactStatus === "interested").length,
    noAnswer: queue.filter(p => p.contactStatus === "no_answer").length,
    activated: queue.filter(p => p.contactStatus === "activated").length,
  };

  const progressPct = Math.round(((stats.total - stats.notContacted) / stats.total) * 100);

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link to="/admin/kemedar/properties/imported" className="hover:text-orange-500">Imported Properties</Link>
            <ArrowRight size={10} />
            <span className="text-gray-700 font-semibold">Sales Contact CRM</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Sales Contact CRM</h1>
          <p className="text-gray-500 text-sm">Call owners of imported properties → log outcome → activate accounts</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/kemedar/properties/imported"
            className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
            ⬇️ Imported Properties
          </Link>
          <button className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Queue", val: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Not Contacted", val: stats.notContacted, color: "text-red-600", bg: "bg-red-50" },
          { label: "No Answer", val: stats.noAnswer, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Interested", val: stats.interested, color: "text-green-600", bg: "bg-green-50" },
          { label: "Activated", val: stats.activated, color: "text-emerald-700", bg: "bg-emerald-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-3 border border-white shadow-sm`}>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 font-semibold">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
            <span>Outreach Progress</span>
            <span className="text-orange-500">{stats.total - stats.notContacted} / {stats.total} contacted ({progressPct}%)</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {["All", "not_contacted", "no_answer", "callback_scheduled", "interested"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${filterStatus === s ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {s === "All" ? "All" : CONTACT_STATUS_CONFIG[s]?.emoji + " " + CONTACT_STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Panel */}
      <div className="grid grid-cols-12 gap-4" style={{ height: 580 }}>

        {/* LEFT: Queue List */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-3 py-2.5 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="w-full pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
            </div>
            <select value={filterRep} onChange={e => setFilterRep(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              <option value="All">All Reps</option>
              {SALES_REPS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <p className="text-[10px] text-gray-400">{filtered.length} properties</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(item => {
              const cfg = CONTACT_STATUS_CONFIG[item.contactStatus] || CONTACT_STATUS_CONFIG.not_contacted;
              return (
                <button key={item.id} onClick={() => selectItem(item)}
                  className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors ${selectedId === item.id ? "bg-orange-50 border-r-2 border-orange-500" : ""}`}>
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate leading-tight">{item.title}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{item.phone}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className={`text-[9px] font-bold ${cfg.color.split(" ").find(c => c.startsWith("text-"))}`}>{cfg.label}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <RepAvatar repId={item.assignedTo} />
                      {item.callCount > 0 && <span className="text-[9px] text-gray-400">📞 {item.callCount}x</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE: Property Details + History */}
        <div className="col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {selected && (
            <>
              {/* Property header */}
              <div className="relative flex-shrink-0">
                <img src={`https://images.unsplash.com/${selected.image}?w=600&q=70`} alt="" className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-white font-black text-sm leading-tight">{selected.title}</p>
                  <p className="text-white/80 text-xs mt-0.5">📍 {selected.city} · {selected.source}</p>
                </div>
                <StatusBadge status={selected.contactStatus} />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Property Facts */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Price", val: `${(selected.price / 1000000).toFixed(1)}M EGP` },
                    { label: "Area", val: `${selected.area} m²` },
                    { label: "Purpose", val: selected.purpose },
                    { label: "Category", val: selected.category },
                    { label: "Calls Made", val: `${selected.callCount}x` },
                    { label: "Moved", val: selected.movedAt },
                  ].map(f => (
                    <div key={f.label} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-gray-400">{f.label}</p>
                      <p className="text-xs font-black text-gray-800">{f.val}</p>
                    </div>
                  ))}
                </div>

                {/* Owner Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-blue-700 uppercase mb-2">Owner Contact Info</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-full text-white font-black text-sm flex items-center justify-center">
                      {(selected.ownerName || "??").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selected.ownerName || "Unknown Owner"}</p>
                      <p className="text-xs font-mono text-blue-700">{selected.phone}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-white border border-blue-200 rounded-lg p-2">
                    <p className="text-[10px] text-blue-600 font-bold mb-0.5">🔐 Login Credentials (if needed):</p>
                    <p className="text-[10px] text-gray-600">Username: <span className="font-mono font-bold">{selected.phone}</span></p>
                    <p className="text-[10px] text-gray-600">Temp Password: <span className="font-mono font-bold">last 6 digits of phone</span></p>
                  </div>
                </div>

                {/* Interaction History */}
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Interaction History</p>
                  {(selected.interactionHistory?.length > 0) ? (
                    <div className="space-y-2">
                      {selected.interactionHistory.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-gray-700">{h.date}</span> — {h.action}
                            <span className="text-gray-400 ml-1">by {h.by}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No interactions logged yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Contact Action Panel */}
        <div className="col-span-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide">📞 Contact Panel</p>
            <div className="flex items-center gap-1.5">
              <RepAvatar repId={selected?.assignedTo} size="md" />
              <select className="text-[10px] border border-gray-200 rounded-lg px-1.5 py-1 focus:outline-none cursor-pointer">
                {SALES_REPS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {/* Call Actions */}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Quick Dial</p>
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${selected?.phone}`}
                  className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-xs">
                  <Phone size={13} /> Call Now
                </a>
                <a href={`https://wa.me/${selected?.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-xs">
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Channels Used */}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Channels Used This Call</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: "phone", label: "Phone", icon: Phone, color: "text-orange-600" },
                  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
                  { key: "sms", label: "SMS", icon: MessageCircle, color: "text-purple-600" },
                  { key: "email", label: "Email", icon: Mail, color: "text-blue-600" },
                ].map(({ key, label, icon: Icon, color }) => (
                  <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-colors ${channels[key] ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <input type="checkbox" checked={channels[key]} onChange={() => setChannels(c => ({ ...c, [key]: !c[key] }))} className="accent-orange-500" />
                    <Icon size={12} className={color} />
                    <span className="text-[10px] font-bold text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Call Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="What did the owner say?..."
                className="w-full text-xs border border-gray-200 rounded-xl p-2.5 resize-none focus:outline-none focus:border-orange-400" />
            </div>

            {/* Callback Date */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Callback Date</label>
              <input type="datetime-local" value={callbackDate} onChange={e => setCallbackDate(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400" />
            </div>

            {/* Outcome Buttons */}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Log Outcome</p>
              <div className="grid grid-cols-1 gap-2">
                {OUTCOME_BUTTONS.map(btn => (
                  <button key={btn.key} onClick={() => setOutcome(btn.key)}
                    className={`w-full font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all ${btn.className}`}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: Save & Activate */}
          <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
            <button onClick={() => setOutcome(selected?.contactStatus)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2">
              <Save size={13} /> Save Notes & Advance
            </button>
            {selected?.contactStatus === "interested" && (
              <button onClick={() => setShowActivateModal(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 animate-pulse">
                ⭐ Send Activation SMS to Owner
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Activation Modal */}
      {showActivateModal && (
        <ActivationModal property={selected} onClose={() => setShowActivateModal(false)}
          onConfirm={() => {
            setQueue(prev => prev.map(p => p.id === selected.id ? { ...p, contactStatus: "activated" } : p));
            setShowActivateModal(false);
          }} />
      )}
    </div>
  );
}

// ─── Activation Modal ────────────────────────────────────────────────────────
function ActivationModal({ property, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {step === 1 ? (
          <>
            <div className="px-6 pt-6 pb-4 text-center border-b border-gray-100">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-lg font-black text-gray-900">Owner is Interested!</h2>
              <p className="text-sm text-gray-500 mt-1">Send login credentials and activate their account</p>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs font-bold text-green-700 mb-2">SMS to be sent to {property?.phone}:</p>
                <p className="text-xs text-gray-700 italic">
                  "Welcome to Kemedar! Your account is ready. Login at kemedar.com with your phone number. Temp password: last 6 digits of your phone. Please change it after login."
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                <p className="font-bold mb-1">What happens next:</p>
                <div className="space-y-1 text-blue-600">
                  <p>1. Owner receives SMS with login link</p>
                  <p>2. Owner logs in → prompted to change password</p>
                  <p>3. System asks "Import your properties?" → YES</p>
                  <p>4. Properties go ACTIVE ✅ in owner's dashboard</p>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => setStep(2)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 rounded-xl text-sm">
                📱 Send SMS & Activate
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-10 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-black text-gray-900">Account Activated!</h2>
            <p className="text-sm text-gray-500">SMS sent to {property?.ownerName || "the owner"}.<br />Their properties will go active once they log in and confirm.</p>
            <button onClick={onConfirm} className="w-full bg-emerald-500 text-white font-black py-3 rounded-xl text-sm hover:bg-emerald-600">
              ✅ Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}