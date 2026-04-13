import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  matched: "bg-purple-100 text-purple-700",
  paused: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-600",
  in_negotiation: "bg-orange-100 text-orange-700",
};

const DIR_LABELS = { upgrade: "⬆️ Upgrade", downsize: "⬇️ Downsize", equal: "⚖️ Equal" };

export default function SwapPool() {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "all", direction: "all" });
  const [running, setRunning] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.SwapIntent.list("-created_date", 200);
        setIntents(data || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleForceMatch = async (intentId) => {
    setRunning(intentId);
    await base44.functions.invoke("generateSwapMatches", { intentId });
    setRunning(null);
  };

  const handlePause = async (intent) => {
    const newStatus = intent.status === "paused" ? "active" : "paused";
    await base44.entities.SwapIntent.update(intent.id, { status: newStatus });
    setIntents(prev => prev.map(i => i.id === intent.id ? { ...i, status: newStatus } : i));
  };

  const filtered = intents.filter(i => {
    if (filters.status !== "all" && i.status !== filters.status) return false;
    if (filters.direction !== "all" && i.swapDirection !== filters.direction) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Swap Pool</h1>
          <p className="text-sm text-gray-500">All published swap intents</p>
        </div>
        <button className="text-xs font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50">📤 Export CSV</button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]">
          {["all","active","matched","paused","expired","in_negotiation"].map(s => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace("_"," ")}</option>
          ))}
        </select>
        <select value={filters.direction} onChange={e => setFilters(f => ({ ...f, direction: e.target.value }))}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]">
          {["all","upgrade","downsize","equal"].map(d => (
            <option key={d} value={d}>{d === "all" ? "All Directions" : d}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400 self-center ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Property", "Owner", "Direction", "Est. Value", "Matches", "Status", "Published", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No swap intents found</td></tr>
              ) : filtered.map(intent => (
                <tr key={intent.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 text-xs">{intent.offeredPropertyId?.slice(0,12)}…</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{intent.userId?.slice(0,10)}…</td>
                  <td className="px-4 py-3 text-xs">{DIR_LABELS[intent.swapDirection] || "—"}</td>
                  <td className="px-4 py-3 text-xs font-bold text-[#7C3AED]">
                    {intent.offeredPropertyEstimatedValueEGP ? `${(intent.offeredPropertyEstimatedValueEGP/1000000).toFixed(1)}M EGP` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">{intent.matchCount || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[intent.status] || "bg-gray-100 text-gray-600"}`}>
                      {intent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {intent.publishedAt ? new Date(intent.publishedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="text-[10px] font-bold text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">View</button>
                      <button onClick={() => handlePause(intent)} className="text-[10px] font-bold text-orange-600 border border-orange-200 px-2 py-1 rounded-lg hover:bg-orange-50">
                        {intent.status === "paused" ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={() => handleForceMatch(intent.id)}
                        disabled={running === intent.id}
                        className="text-[10px] font-bold text-[#7C3AED] border border-purple-200 px-2 py-1 rounded-lg hover:bg-purple-50 disabled:opacity-50"
                      >
                        {running === intent.id ? "Running…" : "⚡ Match"}
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