import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, Loader2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

export default function AdminEscrowDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.EscrowDispute.list('-created_date', 100)
      .then(setDisputes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDisputes = disputes.filter(d => {
    if (search && !(d.disputeNumber || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-red-500" /> Active Disputes</h1>
          <p className="text-gray-500 text-sm">{disputes.length} total disputes</p>
        </div>
      </div>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dispute #..."
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Dispute #", "Type", "Amount", "Raised by", "Days Open", "AI Status", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDisputes.map(d => {
                const daysOpen = Math.floor((Date.now() - new Date(d.created_date)) / 86400000);
                return (
                  <tr key={d.id} className={`hover:bg-gray-50 ${daysOpen > 10 ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.disputeNumber}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{(d.disputeType || "").replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-bold text-red-600 text-xs">{fmt(d.amountDisputed)} EGP</td>
                    <td className="px-4 py-3 text-xs capitalize">{d.raisedBy}</td>
                    <td className={`px-4 py-3 font-bold text-xs ${daysOpen > 10 ? "text-red-600" : "text-gray-600"}`}>{daysOpen}d</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`font-bold ${d.aiEvaluationStatus === "evaluated" ? "text-green-600" : d.aiEvaluationStatus === "analyzing" ? "text-orange-600" : "text-gray-400"}`}>
                        {d.aiEvaluationStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize text-gray-600">{(d.status || "").replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/escrow/${d.dealId}/dispute/${d.id}`} className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredDisputes.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No disputes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}