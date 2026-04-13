import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, Loader2, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

export default function AdminEscrowDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    base44.entities.EscrowDeal.list('-created_date', 200)
      .then(setDeals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDeals = deals.filter(d => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !(d.dealNumber || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Lock className="w-6 h-6 text-orange-500" /> All Deals</h1>
          <p className="text-gray-500 text-sm">{deals.length} total deals</p>
        </div>
        <Link to="/kemedar/escrow/new" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm">
          + New Deal
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deal #..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Deal #", "Amount", "Status", "Progress", "Disputed?", "Created", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDeals.slice(0, 50).map(deal => {
                const sCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
                return (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{deal.dealNumber}</td>
                    <td className="px-4 py-3 font-black text-orange-600">{fmt(deal.agreedPrice)} EGP</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sCfg.color}`}>{sCfg.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${deal.completionPercent || 0}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">{deal.isDisputed ? <span className="text-red-500 font-bold text-xs">⚠️ Yes</span> : <span className="text-gray-300 text-xs">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(deal.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/escrow/${deal.id}`} className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredDeals.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No deals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}