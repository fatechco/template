import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function AdminAuctionsTransfers() {
  const [auctions, setAuctions] = useState([]);
  const [tab, setTab] = useState("awaiting_payment");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await base44.entities.PropertyAuction.list("-created_date", 500);
    setAuctions(data);
    setLoading(false);
  };

  const statusMap = {
    awaiting_payment: "awaiting_payment",
    legal_review: "legal_transfer",
    completed: "completed",
    failed: "failed"
  };

  const filtered = auctions.filter(a => a.status === statusMap[tab]);
  const awaitingPaymentCount = filtered.filter(a => {
    const hoursLeft = (new Date(a.winnerPaymentDeadlineAt) - Date.now()) / (60 * 60 * 1000);
    return hoursLeft < 12;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📦 Transfers In Progress</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: "awaiting_payment", label: "Awaiting Payment" },
          { id: "legal_review", label: "Legal Review" },
          { id: "completed", label: "Completed" },
          { id: "failed", label: "Failed" }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Alert */}
      {tab === "awaiting_payment" && awaitingPaymentCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-red-700">{awaitingPaymentCount} winners approaching deadline!</p>
            <p className="text-sm text-red-600 mt-1">Less than 12 hours to complete payment</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 flex-shrink-0">
            📧 Send Reminders
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Code", "Property", "Winner", "Bid Amount", "Status", "Deadline", "Legal Stage", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No transfers in this status</td></tr>
              ) : (
                filtered.map(a => {
                  const hoursLeft = Math.max(0, Math.floor((new Date(a.winnerPaymentDeadlineAt) - Date.now()) / (60 * 60 * 1000)));
                  const isUrgent = hoursLeft < 12;
                  return (
                    <tr key={a.id} className={`hover:bg-gray-50 ${isUrgent ? "bg-red-50" : ""}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{a.auctionCode}</td>
                      <td className="px-4 py-3 text-gray-600">{a.auctionTitle?.substring(0, 25)}</td>
                      <td className="px-4 py-3 text-gray-600">{a.winnerUserId?.substring(0, 20)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{fmt(a.winnerBidEGP)} EGP</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === "payment_received" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {a.status === "payment_received" ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-bold ${isUrgent ? "text-red-600" : "text-gray-600"}`}>
                        {isUrgent && "⚠️ "}{hoursLeft}h left
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{a.status === "legal_transfer" ? "In Progress" : "Pending"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="px-2 py-1 text-xs bg-green-100 text-green-700 font-bold rounded hover:bg-green-200">Release</button>
                          <button className="px-2 py-1 text-xs bg-red-100 text-red-700 font-bold rounded hover:bg-red-200">Forfeit</button>
                          <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 font-bold rounded hover:bg-blue-200">2nd Bid</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}