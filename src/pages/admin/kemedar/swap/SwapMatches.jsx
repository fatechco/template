import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const STATUS_COLORS = {
  suggested: "bg-gray-100 text-gray-600",
  a_interested: "bg-blue-100 text-blue-700",
  b_interested: "bg-blue-100 text-blue-700",
  both_interested: "bg-purple-100 text-purple-700",
  negotiating: "bg-orange-100 text-orange-700",
  terms_agreed: "bg-green-100 text-green-700",
  legal_review: "bg-blue-100 text-blue-700",
  escrow_active: "bg-teal-100 text-teal-700",
  completed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
  expired: "bg-gray-100 text-gray-400",
};

export default function SwapMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [boosting, setBoosting] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.SwapMatch.list("-created_date", 200);
        setMatches(data || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleBoost = async (match) => {
    setBoosting(match.id);
    await base44.entities.SwapMatch.update(match.id, { matchScore: 95 });
    setMatches(prev => prev.map(m => m.id === match.id ? { ...m, matchScore: 95 } : m));
    setBoosting(null);
  };

  const handleReject = async (match) => {
    await base44.entities.SwapMatch.update(match.id, { status: "rejected" });
    setMatches(prev => prev.map(m => m.id === match.id ? { ...m, status: "rejected" } : m));
  };

  const filtered = matches.filter(m => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (search && !m.propertyAId?.includes(search) && !m.propertyBId?.includes(search)) return false;
    return true;
  });

  const scoreBg = (s) => s >= 90 ? "text-green-700 bg-green-100" : s >= 75 ? "text-orange-700 bg-orange-100" : "text-gray-600 bg-gray-100";

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">All Swap Matches</h1>
        <p className="text-sm text-gray-500">AI-generated match pairs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by property ID or user…"
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] w-60"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]">
          {["all","suggested","both_interested","negotiating","terms_agreed","legal_review","completed","rejected"].map(s => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace(/_/g," ")}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 self-center ml-auto">{filtered.length} matches</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Property A", "Property B", "Score", "Gap (EGP)", "Who Pays", "Status", "Generated", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No matches found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">#{m.propertyAId?.slice(0,8)}</td>
                  <td className="px-4 py-3 text-xs font-medium text-gray-800">#{m.propertyBId?.slice(0,8)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${scoreBg(m.matchScore || 0)}`}>{m.matchScore || 0}%</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">{m.valuationGapEGP ? Number(m.valuationGapEGP).toLocaleString() : "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {m.gapPayerUserId ? `Party ${m.gapPayerUserId === m.userAId ? "A" : "B"}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[m.status] || "bg-gray-100 text-gray-600"}`}>
                      {m.status?.replace(/_/g," ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {m.generatedAt ? new Date(m.generatedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link to={`/dashboard/swap/negotiation/${m.id}`} className="text-[10px] font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">
                        View Room
                      </Link>
                      {m.status !== "rejected" && (
                        <button onClick={() => handleReject(m)} className="text-[10px] font-bold text-red-600 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50">
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleBoost(m)}
                        disabled={boosting === m.id || m.matchScore >= 95}
                        className="text-[10px] font-bold text-[#7C3AED] border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-50 disabled:opacity-40"
                      >
                        {boosting === m.id ? "…" : "⬆ Boost"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}