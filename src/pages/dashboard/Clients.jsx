import { useState } from "react";
import { Phone, MessageCircle, Mail, Edit, FileText, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_OPTS = ["New Lead", "Contacted", "Interested", "Viewing Scheduled", "Negotiating", "Closed Won", "Closed Lost"];
const STATUS_COLORS = {
  "New Lead": "bg-blue-100 text-blue-700",
  "Contacted": "bg-purple-100 text-purple-700",
  "Interested": "bg-yellow-100 text-yellow-700",
  "Viewing Scheduled": "bg-orange-100 text-orange-700",
  "Negotiating": "bg-teal-100 text-teal-700",
  "Closed Won": "bg-green-100 text-green-700",
  "Closed Lost": "bg-red-100 text-red-700",
};

const BG_COLORS = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-teal-500"];

const MOCK_CLIENTS = [
  { id: 1, avatar: "AH", name: "Ahmed Hassan", phone: "+20 123 456 789", email: "ahmed@email.com", interestedIn: "Apartment, New Cairo", status: "Negotiating", lastContact: "Yesterday", source: "Direct", city: "New Cairo", notes: "Looking for 3BR, budget $150k", timeline: [{ date: "Mar 15", note: "First contact via phone" }, { date: "Mar 17", note: "Sent property details" }] },
  { id: 2, avatar: "FM", name: "Fatima Mohamed", phone: "+20 111 222 333", email: "fatima@email.com", interestedIn: "Villa, Sheikh Zayed", status: "Viewing Scheduled", lastContact: "2 days ago", source: "Featured", city: "Sheikh Zayed", notes: "Prefers semi-furnished", timeline: [{ date: "Mar 12", note: "Inquired via website" }, { date: "Mar 14", note: "Viewing scheduled for Mar 20" }] },
  { id: 3, avatar: "OR", name: "Omar Rashid", phone: "+20 100 987 654", email: "omar@email.com", interestedIn: "Studio, Maadi", status: "Interested", lastContact: "1 week ago", source: "Search", city: "Maadi", notes: "Flexible on price", timeline: [{ date: "Mar 10", note: "Called from search result" }] },
  { id: 4, avatar: "SK", name: "Sara Khaled", phone: "+20 122 345 678", email: "sara@email.com", interestedIn: "Office, Downtown", status: "New Lead", lastContact: "Just now", source: "Direct", city: "Cairo", notes: "", timeline: [] },
  { id: 5, avatar: "MN", name: "Mohamed Nasser", phone: "+20 115 567 890", email: "m.nasser@email.com", interestedIn: "Land, 6th October", status: "Closed Won", lastContact: "Last week", source: "Featured", city: "6th October", notes: "Deal closed at $95k", timeline: [{ date: "Feb 28", note: "Deal closed ✅" }] },
];

function ClientCard({ client }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(client.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Main card row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-11 h-11 rounded-full ${BG_COLORS[client.id % BG_COLORS.length]} text-white font-black text-sm flex items-center justify-center flex-shrink-0`}>
            {client.avatar}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-black text-gray-900 text-sm leading-tight">{client.name}</p>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none flex-shrink-0 ${STATUS_COLORS[status]}`}>
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-500 truncate">{client.interestedIn}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-gray-400">{client.phone}</span>
              <span className="text-[11px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">{client.lastContact}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl transition-colors">
            <Phone size={12} /> Call
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl transition-colors">
            <MessageCircle size={12} /> WhatsApp
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-xl transition-colors">
            <Mail size={12} /> Email
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="w-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 p-4 space-y-4">
          {/* Details row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Source</p>
              <p className="text-sm font-bold text-gray-800">{client.source}</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">City</p>
              <p className="text-sm font-bold text-gray-800">{client.city}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm text-gray-700">{client.email}</p>
          </div>

          {/* Timeline */}
          {client.timeline.length > 0 && (
            <div className="bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-2">Timeline</p>
              <div className="space-y-2">
                {client.timeline.map((t, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="text-orange-500 font-bold w-14 flex-shrink-0">{t.date}</span>
                    <span className="text-gray-600">{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-xl p-3 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1.5">Notes</p>
            {client.notes && <p className="text-xs text-gray-600 mb-2">{client.notes}</p>}
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={2}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:border-orange-300 mb-2" />
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-orange-500 text-white text-xs font-bold py-2 rounded-lg">
                <FileText size={11} /> Save Note
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white text-xs font-bold py-2 rounded-lg">
                <Plus size={11} /> Schedule Appt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Clients() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = statusFilter === "All" ? MOCK_CLIENTS : MOCK_CLIENTS.filter(c => c.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Clients</h1>
          <p className="text-gray-500 text-sm">{MOCK_CLIENTS.length} contacts in CRM</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Client Manually
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {["All", ...STATUS_OPTS].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(c => <ClientCard key={c.id} client={c} />)}
      </div>

      {/* Add Client Modal */}
      {showAdd && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowAdd(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">Add Client Manually</h3>
                <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
              </div>
              {["Full Name", "Phone", "Email", "Interested In", "City"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">{f}</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Initial Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                  {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">Add Client</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}