import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SurplusTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    base44.entities.SurplusTransaction.list("-created_date", 500)
      .then(data => setTransactions(data || []))
      .catch(() => {});
  }, []);

  const filtered = transactions.filter(t => filter === "all" || t.transactionType === filter);

  const typeStyle = {
    reservation: "bg-yellow-100 text-yellow-700",
    settlement: "bg-green-100 text-green-700",
    cancellation: "bg-red-100 text-red-700",
    refund: "bg-blue-100 text-blue-700",
    expiry: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-black text-gray-900">Surplus Transactions</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex gap-2 flex-wrap">
          {["all", "reservation", "settlement", "cancellation", "refund", "expiry"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize ${filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Type</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Item ID</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Amount</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Fee</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Seller Net</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${typeStyle[t.transactionType] || "bg-gray-100 text-gray-700"}`}>
                    {t.transactionType}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{t.surplusItemId?.slice(0, 8)}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{t.amountEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3 text-gray-600">{t.platformFeeEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3 text-green-700 font-bold">{t.sellerNetEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{new Date(t.created_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No transactions yet</div>
        )}
      </div>
    </div>
  );
}