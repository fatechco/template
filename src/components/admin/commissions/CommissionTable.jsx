import { RefreshCw, CheckCircle, Banknote, AlertTriangle, Eye } from "lucide-react";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  paid:     { label: "Paid",     color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
};

const SOURCE_CONFIG = {
  subscription:  { label: "Subscription",  color: "bg-purple-100 text-purple-700" },
  service_order: { label: "Service Order", color: "bg-orange-100 text-orange-700" },
};

export default function CommissionTable({ commissions, loading, selectedIds, onSelectIds, onApprove, onMarkPaid, onDispute }) {
  const toggleSelect = (id) => onSelectIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleAll = () => onSelectIds(
    selectedIds.length === commissions.length ? [] : commissions.map(c => c.id)
  );

  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center text-gray-400">
      <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
      <p className="text-sm font-semibold">Loading commissions…</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-3 py-3 w-8">
                <input type="checkbox"
                  checked={selectedIds.length === commissions.length && commissions.length > 0}
                  onChange={toggleAll} className="w-3.5 h-3.5 accent-orange-500" />
              </th>
              {["Franchise Owner","Source","Related Code","Gross Amount","Commission %","Commission Amount","Status","Period","Paid Date","Actions"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {commissions.length === 0 && (
              <tr><td colSpan={11} className="py-16 text-center text-gray-400">
                <p className="text-2xl mb-2">💸</p>
                <p className="font-semibold">No commission records found</p>
              </td></tr>
            )}
            {commissions.map(c => {
              const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
              const srcCfg = SOURCE_CONFIG[c.sourceType] || { label: c.sourceType, color: "bg-gray-100 text-gray-600" };
              return (
                <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(c.id) ? "bg-orange-50" : ""}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIds.includes(c.id)}
                      onChange={() => toggleSelect(c.id)} className="w-3.5 h-3.5 accent-orange-500" />
                  </td>
                  {/* Franchise Owner */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {(c.franchiseOwnerId || "FO").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-gray-600 font-mono text-[10px] max-w-[80px] truncate">{c.franchiseOwnerId?.slice(0, 8)}…</span>
                    </div>
                  </td>
                  {/* Source */}
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${srcCfg.color}`}>{srcCfg.label}</span>
                  </td>
                  {/* Related Code */}
                  <td className="px-3 py-3 font-mono text-[10px] text-gray-500">
                    {c.subscriptionId?.slice(-6) || c.serviceOrderId?.slice(-6) || "—"}
                  </td>
                  {/* Gross */}
                  <td className="px-3 py-3 font-bold text-gray-800">${(c.grossAmount || 0).toFixed(2)}</td>
                  {/* Pct */}
                  <td className="px-3 py-3 font-bold text-purple-600">{c.commissionPercent}%</td>
                  {/* Amount */}
                  <td className="px-3 py-3 font-black text-green-700">${(c.commissionAmount || 0).toFixed(2)}</td>
                  {/* Status */}
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </td>
                  {/* Period */}
                  <td className="px-3 py-3 text-gray-400 text-[10px] whitespace-nowrap">
                    {c.periodStart && c.periodEnd ? `${c.periodStart} → ${c.periodEnd}` : "—"}
                  </td>
                  {/* Paid Date */}
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{c.paidDate || "—"}</td>
                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      {c.status === "pending" && (
                        <button onClick={() => onApprove(c.id)} title="Approve"
                          className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><CheckCircle size={13} /></button>
                      )}
                      {(c.status === "pending" || c.status === "approved") && (
                        <button onClick={() => onMarkPaid(c.id)} title="Mark as Paid"
                          className="p-1.5 hover:bg-green-50 text-green-500 rounded"><Banknote size={13} /></button>
                      )}
                      {c.status !== "disputed" && (
                        <button onClick={() => onDispute(c.id)} title="Dispute"
                          className="p-1.5 hover:bg-red-50 text-red-400 rounded"><AlertTriangle size={13} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}