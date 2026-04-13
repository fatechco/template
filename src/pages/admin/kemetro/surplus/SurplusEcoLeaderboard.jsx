import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TIER_COLORS = {
  eco_leader: "bg-emerald-100 text-emerald-800",
  eco_champion: "bg-green-100 text-green-800",
  eco_builder: "bg-teal-100 text-teal-800",
  eco_starter: "bg-gray-100 text-gray-700",
};

const RANK_BG = {
  0: "bg-yellow-50 border-l-4 border-yellow-400",
  1: "bg-gray-50 border-l-4 border-gray-400",
  2: "bg-orange-50 border-l-4 border-orange-400",
};

const RANK_MEDAL = { 0: "🥇", 1: "🥈", 2: "🥉" };

export default function SurplusEcoLeaderboard() {
  const [scores, setScores] = useState([]);
  const [tab, setTab] = useState("developers");

  useEffect(() => {
    base44.entities.DeveloperEcoScore.list("-totalWeightKgDiverted", 100)
      .then(data => setScores(data || []))
      .catch(() => {});
  }, []);

  const handleUpgradeTier = async (id) => {
    const score = scores.find(s => s.id === id);
    const tiers = ["eco_starter", "eco_builder", "eco_champion", "eco_leader"];
    const currentIdx = tiers.indexOf(score?.ecoTier || "eco_starter");
    const nextTier = tiers[Math.min(currentIdx + 1, tiers.length - 1)];
    await base44.entities.DeveloperEcoScore.update(id, { ecoTier: nextTier });
    setScores(s => s.map(x => x.id === id ? { ...x, ecoTier: nextTier } : x));
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-black text-gray-900">🏆 Eco Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {["developers", "professionals", "homeowners"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-bold text-sm capitalize ${tab === t ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Rank</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Developer</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Eco Tier</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Items Listed</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Kg Diverted</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">CO2 Saved (kg)</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">GMV (EGP)</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={s.id} className={`border-b border-gray-100 ${RANK_BG[idx] || "hover:bg-gray-50"}`}>
                <td className="px-4 py-3 font-black text-gray-900">{RANK_MEDAL[idx] || `#${idx + 1}`}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{s.developerUserId?.slice(0, 8)}…</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${TIER_COLORS[s.ecoTier] || ""}`}>
                    {s.ecoTier?.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">{s.totalItemsListed}</td>
                <td className="px-4 py-3 font-bold text-green-700">{s.totalWeightKgDiverted?.toLocaleString()}</td>
                <td className="px-4 py-3">{s.totalCo2SavedKg?.toLocaleString()}</td>
                <td className="px-4 py-3 font-bold">{s.totalGMVEGP?.toLocaleString()}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">View Profile</button>
                  <button onClick={() => handleUpgradeTier(s.id)} className="text-xs px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100">Upgrade Tier</button>
                  <button className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100">Feature</button>
                </td>
              </tr>
            ))}
            {scores.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No eco score data yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}