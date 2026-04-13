import { useState } from "react";
import { Eye, MessageCircle, ArrowUpRight, X, Send } from "lucide-react";

const TABS = ["Open Tickets in My Area", "Resolved in My Area", "My Tickets"];

const MOCK_TICKETS = [
  { id: "T-201", user: "Ahmed H.", subject: "Cannot upload property photos", priority: "High", status: "Open", created: "Mar 18", updated: "1 hr ago" },
  { id: "T-202", user: "Fatima M.", subject: "Kemetro order not delivered", priority: "High", status: "Open", created: "Mar 17", updated: "3 hr ago" },
  { id: "T-203", user: "Omar R.", subject: "Subscription renewal failed", priority: "Medium", status: "Pending", created: "Mar 16", updated: "Yesterday" },
  { id: "T-204", user: "Sara K.", subject: "Handyman didn't show up for job", priority: "High", status: "Open", created: "Mar 15", updated: "2 days ago" },
  { id: "T-205", user: "Khaled M.", subject: "Wrong price on listed property", priority: "Low", status: "Resolved", created: "Mar 14", updated: "Mar 16" },
];

const STATUS_COLORS = { Open: "bg-red-100 text-red-700", Pending: "bg-yellow-100 text-yellow-700", Resolved: "bg-green-100 text-green-700" };
const PRIORITY_COLORS = { High: "bg-red-100 text-red-600", Medium: "bg-orange-100 text-orange-600", Low: "bg-gray-100 text-gray-600" };

const MOCK_THREAD = [
  { from: "user", name: "Ahmed Hassan", text: "I'm trying to upload photos for my property but keep getting an error", time: "Mar 18, 9:00 AM" },
  { from: "agent", name: "You", text: "Hi Ahmed! Can you tell me what type of files you're trying to upload?", time: "Mar 18, 9:15 AM" },
  { from: "user", name: "Ahmed Hassan", text: "JPEG files, about 4MB each. The limit says 10MB per image.", time: "Mar 18, 9:20 AM" },
];

function TicketDetailModal({ ticket, onClose }) {
  const [reply, setReply] = useState("");

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-gray-900">{ticket.id}: {ticket.subject}</h3>
              <p className="text-xs text-gray-500">User: {ticket.user} · Created: {ticket.created}</p>
            </div>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {MOCK_THREAD.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.from === "agent" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${m.from === "agent" ? "bg-orange-500" : "bg-gray-400"}`}>
                  {m.name[0]}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.from === "agent" ? "bg-orange-50 border border-orange-200" : "bg-gray-100"}`}>
                  <p className="text-xs font-bold text-gray-700 mb-1">{m.name}</p>
                  <p className="text-sm text-gray-800">{m.text}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option>Open</option><option>Pending</option><option>Resolved</option>
              </select>
              <button className="flex items-center gap-1 bg-red-50 text-red-600 font-bold text-xs px-3 py-2 rounded-lg border border-red-200 hover:bg-red-100"><ArrowUpRight size={12} /> Escalate</button>
            </div>
            <div className="flex gap-2">
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Reply..." className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              <button onClick={() => setReply("")} className="w-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors"><Send size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FranchiseTickets() {
  const [activeTab, setActiveTab] = useState("Open Tickets in My Area");
  const [viewTicket, setViewTicket] = useState(null);

  return (
    <div className="space-y-5">
      <div className="bg-red-500 rounded-2xl px-6 py-5">
        <h1 className="text-2xl font-black text-white">🎫 Support Tickets</h1>
        <p className="text-red-100 text-sm mt-1">Manage and respond to user support requests in your area</p>
      </div>

      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === t ? "bg-red-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Ticket#", "User", "Subject", "Priority", "Status", "Created", "Last Update", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKETS.map((t, i) => (
                <tr key={t.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3 font-bold text-gray-700 text-xs">{t.id}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{t.user}</td>
                  <td className="px-4 py-3 text-gray-800">{t.subject}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{t.created}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{t.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewTicket(t)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={13} /></button>
                      <button onClick={() => setViewTicket(t)} className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><MessageCircle size={13} /></button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><ArrowUpRight size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewTicket && <TicketDetailModal ticket={viewTicket} onClose={() => setViewTicket(null)} />}
    </div>
  );
}