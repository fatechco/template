import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TICKETS = [
  { id: 1, num: "TKT-001", subject: "Property verification delayed", priority: "high", status: "open" },
  { id: 2, num: "TKT-002", subject: "Can't access seller dashboard", priority: "high", status: "open" },
  { id: 3, num: "TKT-003", subject: "Invoice calculation wrong", priority: "medium", status: "pending" },
];

export default function FranchiseOwnerSupportMobile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("open");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const statusColor = (s) => s === "open" ? "🔴" : s === "pending" ? "🟡" : "🟢";
  const filtered = TICKETS.filter(t => activeTab === "open" ? t.status !== "resolved" : t.status === "resolved");

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Support</h1>
        <button className="p-1.5">
          <Plus size={22} className="text-orange-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["Open", "Resolved", "Mine"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeTab === tab.toLowerCase() ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tickets */}
      <div className="p-4 space-y-2">
        {filtered.map(ticket => (
          <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
            className={`w-full text-left bg-white rounded-2xl border-l-4 border-orange-600 p-4 shadow-sm active:bg-orange-50 ${
              selectedTicket?.id === ticket.id ? "bg-orange-50" : ""
            }`}
          >
            <p className="text-xs font-bold text-gray-600">{ticket.num}</p>
            <p className="font-bold text-gray-900 mt-1">{ticket.subject}</p>
            <div className="flex items-center gap-2 mt-2">
              <span>{statusColor(ticket.status)}</span>
              <span className="text-xs font-bold text-gray-600">{ticket.status}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail View */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <button onClick={() => setSelectedTicket(null)} className="text-lg text-gray-600">✕</button>
              <h2 className="text-lg font-black text-gray-900 mt-2">{selectedTicket.subject}</h2>
              <p className="text-xs text-gray-600 mt-1">{selectedTicket.num}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="bg-gray-100 rounded-2xl p-3">
                <p className="text-xs font-bold text-gray-900 mb-1">User Message</p>
                <p className="text-sm text-gray-700">The property verification is taking longer than expected. Can you help?</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-3 ml-8">
                <p className="text-xs font-bold text-gray-900 mb-1">Kemedar Support</p>
                <p className="text-sm text-gray-700">Hello, we're looking into this. Please allow 24-48 hours for completion.</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 space-y-3">
              <textarea placeholder="Type reply..." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-20 focus:outline-none focus:border-orange-400" />
              <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-sm hover:bg-orange-700">Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}