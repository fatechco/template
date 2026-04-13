import { useState } from 'react';
import { Plus, Search, Phone, MessageCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const TICKETS = [
  { id: 1, num: "TKT-001", user: "Ahmed Hassan", subject: "Property verification delayed", module: "Kemedar", priority: "high", status: "open", created: "2026-03-20", updated: "2026-03-23" },
  { id: 2, num: "TKT-002", user: "Fatima Ali", subject: "Can't access seller dashboard", module: "Kemetro", priority: "high", status: "open", created: "2026-03-21", updated: "2026-03-23" },
  { id: 3, num: "TKT-003", user: "Omar Hassan", subject: "Invoice calculation wrong", module: "Kemedar", priority: "medium", status: "pending", created: "2026-03-22", updated: "2026-03-22" },
  { id: 4, num: "TKT-004", user: "Sara Mohamed", subject: "How to add team member", module: "General", priority: "low", status: "resolved", created: "2026-03-15", updated: "2026-03-18" },
];

const MESSAGES = [
  { id: 1, author: "Ahmed Hassan", text: "The property verification is taking longer than expected. Can you help?", timestamp: "2026-03-20 10:30", fromUser: true },
  { id: 2, author: "Kemedar Support", text: "Hello Ahmed, we're looking into this. Please allow 24-48 hours for completion.", timestamp: "2026-03-20 11:00", fromUser: false },
  { id: 3, author: "Ahmed Hassan", text: "Thanks. Can you check on the status now?", timestamp: "2026-03-23 09:00", fromUser: true },
  { id: 4, author: "Kemedar Support", text: "Status updated: Verification is in progress and will be completed by EOD tomorrow.", timestamp: "2026-03-23 09:30", fromUser: false },
];

export default function FranchiseOwnerSupport() {
  const [activeTab, setActiveTab] = useState("open");
  const [selectedTicket, setSelectedTicket] = useState(TICKETS[0]);
  const [reply, setReply] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const statusColor = (s) => s === "open" ? "bg-red-100 text-red-700" : s === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700";
  const priorityIcon = (p) => p === "high" ? "🔴" : p === "medium" ? "🟡" : "🟢";

  const filtered = TICKETS.filter(t => {
    if (activeTab === "open") return t.status === "open" || t.status === "pending";
    if (activeTab === "resolved") return t.status === "resolved";
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Tickets */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-gray-900">Support Tickets</h1>
            <button onClick={() => setShowCreateTicket(true)} className="flex items-center gap-2 bg-orange-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
              <Plus size={16} /> New Ticket
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xl font-black text-red-600">2</p>
              <p className="text-xs text-gray-600">Open</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xl font-black text-yellow-600">1</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xl font-black text-green-600">8</p>
              <p className="text-xs text-gray-600">Resolved</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-gray-200 bg-white">
          {[
            { id: "open", label: "Open in My Area", count: 3 },
            { id: "resolved", label: "Resolved", count: 8 },
            { id: "mine", label: "My Tickets", count: 4 },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {filtered.map(ticket => (
              <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-4 rounded-xl border-l-4 transition-all ${
                  selectedTicket?.id === ticket.id
                    ? "bg-orange-50 border-orange-600 shadow-sm"
                    : "bg-white border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-600">{ticket.num}</p>
                    <p className="font-bold text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">{ticket.user}</p>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-bold">{ticket.module}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-sm">{priorityIcon(ticket.priority)}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${statusColor(ticket.status)}`}>{ticket.status}</span>
                  <span className="text-xs text-gray-600 ml-auto">{ticket.updated}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Ticket Detail */}
      {selectedTicket && (
        <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-2">{selectedTicket.subject}</h2>
            <div className="flex gap-2 flex-wrap text-xs">
              <span className="font-bold text-gray-600">{selectedTicket.num}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-600">{selectedTicket.user}</span>
              <span className="text-gray-600">•</span>
              <span className="font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">{selectedTicket.module}</span>
              <span className={`font-bold px-2 py-1 rounded ${statusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {MESSAGES.map(msg => (
              <div key={msg.id} className={`flex ${msg.fromUser ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-xs rounded-lg p-3 ${msg.fromUser ? "bg-gray-100 text-gray-900" : "bg-orange-600 text-white"}`}>
                  <p className="text-xs font-bold mb-1">{msg.author}</p>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.fromUser ? "text-gray-600" : "text-orange-100"}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Bar */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:border-orange-400" />
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50">Attach</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg hover:bg-orange-700 text-sm">Send Reply</button>
            </div>

            {/* Status Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="flex-1 text-xs font-bold px-3 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-50">✅ Resolve</button>
              <button className="flex-1 text-xs font-bold px-3 py-2 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-50">📌 Escalate</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Create New Ticket</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Subject</label>
                <input type="text" placeholder="Issue subject" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Module</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                  <option>Kemedar</option>
                  <option>Kemetro</option>
                  <option>Kemework</option>
                  <option>General</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Priority</label>
                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                  <option>🔴 High</option>
                  <option>🟡 Medium</option>
                  <option>🟢 Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Description</label>
                <textarea placeholder="Describe your issue..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none h-24 focus:outline-none focus:border-orange-400" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreateTicket(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowCreateTicket(false)} className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}