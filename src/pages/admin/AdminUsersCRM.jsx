import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle, Phone, Mail, CheckCircle, Clock, AlertCircle, RefreshCw, Download, MoreVertical, X, Eye, Users
} from "lucide-react";

const MOCK_USERS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Layla Nour", "Omar Khalid", "Noor Hassan", "Mohamed Samir", "Rana Adel"][i % 8],
  email: `user${i + 1}@email.com`,
  phone: `+20 1${String(i * 7 + 10).padStart(9, "0")}`,
  role: ["Agent", "Agency", "Developer", "Professional", "Common User"][i % 5],
  city: ["Cairo", "Giza", "Alexandria", "New Cairo"][i % 4],
  plan: ["Free", "Basic", "Pro", "Business"][i % 4],
  contactStatus: ["not_contacted", "not_contacted", "contacted", "no_answer", "interested", "no_answer", "not_contacted", "not_interested", "interested", "callback_scheduled"][i % 10],
  callCount: [0, 0, 1, 2, 3, 1, 0, 1, 4, 2][i % 10],
  lastCallDate: i % 3 === 0 ? null : `2026-03-${String((i % 20) + 8).padStart(2, "0")}`,
  callbackDate: i % 10 === 9 ? "2026-04-05" : null,
  joinedAt: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  propertiesCount: [0, 3, 7, 12, 1, 5, 0, 2][i % 8],
  projectsCount: [0, 0, 1, 3, 0, 2, 0, 0][i % 8],
  notes: i % 3 === 0 ? "" : ["Interested in Pro plan upgrade.", "No answer x2. Try evening.", "User wants refund discussion."][i % 3],
  interactionHistory: i === 0 ? [
    { date: "Mar 20", action: "Assigned", by: "Admin" },
    { date: "Mar 21", action: "Called — No answer", by: "You" },
    { date: "Mar 22", action: "Email sent", by: "You" },
    { date: "Mar 23", action: "Callback scheduled", by: "You" },
  ] : [],
}));

const CONTACT_STATUS_CONFIG = {
  not_contacted:       { label: "Not Contacted",       color: "bg-gray-100 text-gray-600",      dot: "bg-gray-400",    emoji: "⚪" },
  contacted:           { label: "Contacted",            color: "bg-blue-100 text-blue-700",      dot: "bg-blue-500",    emoji: "🔵" },
  no_answer:           { label: "No Answer",            color: "bg-red-100 text-red-600",        dot: "bg-red-500",     emoji: "🔴" },
  callback_scheduled:  { label: "Callback Scheduled",  color: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-500",  emoji: "📅" },
  interested:          { label: "Interested ✅",         color: "bg-green-100 text-green-700",    dot: "bg-green-500",   emoji: "🟢" },
  not_interested:      { label: "Not Interested",       color: "bg-gray-100 text-gray-500",      dot: "bg-gray-400",    emoji: "⛔" },
};

const OUTCOME_BUTTONS = [
  { key: "interested",         label: "✅ Interested",         className: "bg-green-500 hover:bg-green-600 text-white" },
  { key: "no_answer",          label: "📵 No Answer",          className: "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200" },
  { key: "callback_scheduled", label: "📅 Schedule Callback",  className: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border border-yellow-200" },
  { key: "not_interested",     label: "⛔ Not Interested",     className: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200" },
];

function StatusBadge({ status }) {
  const cfg = CONTACT_STATUS_CONFIG[status] || CONTACT_STATUS_CONFIG.not_contacted;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function AdminUsersCRM() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [selectedId, setSelectedId] = useState(MOCK_USERS[0].id);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [notes, setNotes] = useState("");
  const [callbackDate, setCallbackDate] = useState("");

  const selected = users.find(u => u.id === selectedId) || users[0];

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.phone.includes(search) && !u.email.includes(search)) return false;
    if (filterRole !== "All" && u.role !== filterRole) return false;
    return true;
  });

  const stats = {
    total: users.length,
    notContacted: users.filter(u => u.contactStatus === "not_contacted").length,
    interested: users.filter(u => u.contactStatus === "interested").length,
    noAnswer: users.filter(u => u.contactStatus === "no_answer").length,
  };

  const contacted = users.filter(u => u.contactStatus !== "not_contacted").length;
  const progressPct = Math.round(((contacted / users.length) * 100));

  const selectUser = (user) => {
    setSelectedId(user.id);
    setNotes(user.notes || "");
    setCallbackDate(user.callbackDate || "");
  };

  const setOutcome = (outcomeKey) => {
    setUsers(prev => prev.map(u => u.id === selected.id ? {
      ...u,
      contactStatus: outcomeKey,
      callCount: u.callCount + 1,
      lastCallDate: new Date().toISOString().slice(0, 10),
      callbackDate: outcomeKey === "callback_scheduled" ? callbackDate : u.callbackDate,
      notes: notes || u.notes,
      interactionHistory: [
        { date: new Date().toLocaleDateString("en-GB", { day: "short", month: "short" }), action: `Logged: ${CONTACT_STATUS_CONFIG[outcomeKey]?.label}`, by: "You" },
        ...(u.interactionHistory || []),
      ]
    } : u));
    const nextUser = users.find(u => u.id !== selected.id && u.contactStatus === "not_contacted");
    if (nextUser) setSelectedId(nextUser.id);
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Users CRM</h1>
          <p className="text-gray-500 text-sm">Call users for support, upgrades, feedback → log outcome → track interactions</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Queue", val: stats.total, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Not Contacted", val: stats.notContacted, color: "text-red-600", bg: "bg-red-50" },
          { label: "No Answer", val: stats.noAnswer, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Interested", val: stats.interested, color: "text-green-600", bg: "bg-green-50" },
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
            <span className="text-orange-500">{contacted} / {users.length} contacted ({progressPct}%)</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* 3-Panel */}
      <div className="grid grid-cols-12 gap-4" style={{ height: 580 }}>
        {/* LEFT: User List */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-3 py-2.5 border-b border-gray-100 space-y-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-3 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
              <option>All Roles</option>
              <option>Agent</option>
              <option>Agency</option>
              <option>Developer</option>
              <option>Professional</option>
            </select>
            <p className="text-[10px] text-gray-400">{filtered.length} users</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map(user => {
              const cfg = CONTACT_STATUS_CONFIG[user.contactStatus];
              return (
                <button key={user.id} onClick={() => selectUser(user)}
                  className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors ${selectedId === user.id ? "bg-orange-50 border-r-2 border-orange-500" : ""}`}>
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{user.phone}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className={`text-[9px] font-bold`}>{cfg.label}</span>
                      </div>
                    </div>
                    {user.callCount > 0 && <span className="text-[9px] text-gray-400">📞 {user.callCount}x</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE: User Details */}
        <div className="col-span-5 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {selected && (
            <>
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-black text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.role} · {selected.city}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Plan", val: selected.plan },
                    { label: "Properties", val: selected.propertiesCount > 0 ? `${selected.propertiesCount}` : "—" },
                    { label: "Projects", val: selected.projectsCount > 0 ? `${selected.projectsCount}` : "—" },
                    { label: "Calls Made", val: `${selected.callCount}x` },
                  ].map(f => (
                    <div key={f.label} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-[10px] text-gray-400">{f.label}</p>
                      <p className="text-xs font-black text-gray-800">{f.val}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-blue-700 uppercase mb-2">User Contact Info</p>
                  <p className="text-xs font-bold text-gray-900">{selected.name}</p>
                  <p className="text-xs font-mono text-blue-700">{selected.phone}</p>
                  <p className="text-xs font-mono text-blue-700">{selected.email}</p>
                </div>

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
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide">📞 Contact Panel</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick Dial */}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide mb-2">Quick Dial</p>
              <div className="grid grid-cols-2 gap-2">
                <a href={selected?.phone ? `tel:${selected.phone}` : undefined}
                  className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-xs">
                  <Phone size={13} /> Call Now
                </a>
                <a href={(selected?.phone) ? `https://wa.me/${selected.phone.replace(/\D/g, "")}` : undefined}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-xs">
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wide mb-1.5">Call Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="What did the user say?..."
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
                    className={`w-full font-bold py-2.5 rounded-xl text-xs transition-all ${btn.className}`}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}