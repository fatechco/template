import { useState } from "react";
import { X } from "lucide-react";

const TABS = ["All", "Active", "Disputes", "Completed"];

const STATUS_STYLES = {
  "In Progress": "bg-amber-100 text-amber-700",
  Completed: "bg-green-100 text-green-700",
  Disputed: "bg-red-100 text-red-700",
  Pending: "bg-gray-100 text-gray-600",
};

const ORDERS = [
  { id: "KW-00421", customer: "Fatima Al-Zahra", pro: "Ahmed Hassan", service: "Kitchen Cabinet Installation", amount: 1800, currency: "USD", status: "In Progress", date: "Mar 10" },
  { id: "KW-00398", customer: "Karim Mansour", pro: "Omar Khalid", service: "Plumbing Repair", amount: 350, currency: "USD", status: "Completed", date: "Mar 5" },
  { id: "KW-00355", customer: "Nour Salem", pro: "Sara Mohamed", service: "Electrical Panel Upgrade", amount: 900, currency: "USD", status: "Disputed", date: "Mar 12", issue: "Work incomplete — panel still shows faults" },
  { id: "KW-00310", customer: "Ahmed Badr", pro: "Rania Hassan", service: "Interior Painting", amount: 450, currency: "USD", status: "Disputed", date: "Mar 5", issue: "Color does not match what was agreed upon" },
];

function DisputeModal({ order, onClose }) {
  const [resolution, setResolution] = useState("");
  const [notes, setNotes] = useState("");

  const RESOLUTIONS = [
    { key: "refund_full", label: "Refund customer (full amount)" },
    { key: "release_pro", label: "Release payment to professional" },
    { key: "partial", label: "Partial refund to customer" },
    { key: "close", label: "Close as resolved (no action)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Review Dispute</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-xs font-black text-red-700 mb-1">Dispute Details — {order.id}</p>
          <p className="text-xs text-red-600">{order.issue}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 font-semibold mb-1">Customer</p>
            <p className="font-bold text-gray-900">{order.customer}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 font-semibold mb-1">Professional</p>
            <p className="font-bold text-gray-900">{order.pro}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 font-semibold mb-1">Service</p>
            <p className="font-bold text-gray-900 truncate">{order.service}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 font-semibold mb-1">Amount</p>
            <p className="font-bold text-gray-900">${order.amount}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p className="text-xs font-black text-gray-700 mb-1">Resolution Action</p>
          {RESOLUTIONS.map(r => (
            <label key={r.key} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${resolution === r.key ? "border-teal-400 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="resolution" value={r.key} checked={resolution === r.key} onChange={() => setResolution(r.key)} className="accent-teal-600" />
              <span className="text-sm text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin Resolution Notes</label>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe the resolution decision and reasoning..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
        </div>

        <button disabled={!resolution || !notes} onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40" style={{ background: "#0D9488" }}>
          Apply Resolution
        </button>
      </div>
    </div>
  );
}

export default function KemeworkOrdersAdmin() {
  const [activeTab, setActiveTab] = useState("All");
  const [dispute, setDispute] = useState(null);

  const filtered = activeTab === "All" ? ORDERS :
    activeTab === "Active" ? ORDERS.filter(o => o.status === "In Progress" || o.status === "Pending") :
    activeTab === "Disputes" ? ORDERS.filter(o => o.status === "Disputed") :
    ORDERS.filter(o => o.status === "Completed");

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-black text-gray-900">Orders Management</h1>
        <p className="text-sm text-gray-500">{ORDERS.length} total orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
            style={{ background: activeTab === t ? "#C41230" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
            {t} {t === "Disputes" && <span className="ml-1 bg-red-200 text-red-700 px-1 rounded-full">{ORDERS.filter(o => o.status === "Disputed").length}</span>}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Order#", "Customer", "Professional", "Service", "Amount", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-black text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-xs font-bold text-teal-700">{order.id}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{order.customer}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{order.pro}</td>
                <td className="px-4 py-3 text-xs text-gray-700 max-w-[160px] truncate">{order.service}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">${order.amount}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span></td>
                <td className="px-4 py-3 text-xs text-gray-400">{order.date}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-lg">View</button>
                    {order.status === "Disputed" && (
                      <button onClick={() => setDispute(order)} className="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg">⚖️ Resolve</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dispute && <DisputeModal order={dispute} onClose={() => setDispute(null)} />}
    </div>
  );
}