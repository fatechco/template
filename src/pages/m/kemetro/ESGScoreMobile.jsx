import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function ESGScoreMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ weightSaved: 0, moneySaved: 0, itemsBought: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.SurplusTransaction
      .filter({}, "-created_date", 100)
      .then(txns => {
        const weightSaved = txns.reduce((s, t) => s + (t.weightKgSaved || 0), 0);
        const moneySaved = txns.reduce((s, t) => s + Math.max(0, (t.originalPriceEGP || 0) - (t.paidPriceEGP || 0)), 0);
        setStats({ weightSaved: Math.round(weightSaved), moneySaved: Math.round(moneySaved), itemsBought: txns.length });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const score = Math.min(100, Math.round((stats.weightSaved / 100) * 40 + (stats.itemsBought * 5) + 20));
  const grade = score >= 80 ? "🌟 Eco Champion" : score >= 50 ? "🌿 Green Builder" : "🌱 Getting Started";

  const co2Saved = (stats.weightSaved * 2.5).toFixed(1);
  const treesEquiv = Math.round(stats.weightSaved / 21);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">My ESG Score</p>
        <div className="w-8" />
      </div>

      {/* Score Hero */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 px-5 pt-8 pb-10 text-white text-center">
        <div className="text-4xl mb-2">🌍</div>
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-white/30 flex flex-col items-center justify-center mb-3"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          {loading ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <p className="text-4xl font-black">{score}</p>
              <p className="text-xs text-green-200">/ 100</p>
            </>
          )}
        </div>
        <p className="font-black text-lg mb-1">{grade}</p>
        <p className="text-green-200 text-xs">Based on your surplus purchases</p>
      </div>

      <div className="px-4 py-6 space-y-4">

        {/* Impact Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "⚖️", value: `${stats.weightSaved} kg`, label: "Waste Diverted" },
            { icon: "🌿", value: `${co2Saved} kg`, label: "CO₂ Saved" },
            { icon: "🌳", value: `${treesEquiv}`, label: "Trees Equiv." },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="font-black text-green-700 text-sm">{s.value}</p>
              <p className="text-[10px] text-gray-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Purchases */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900 text-sm">Purchase Activity</p>
            <span className="text-xs font-bold text-green-700">{stats.itemsBought} items</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Money Saved</p>
              <p className="font-black text-green-700 text-base">EGP {stats.moneySaved.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Surplus Buys</p>
              <p className="font-black text-emerald-700 text-base">{stats.itemsBought}</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="font-black text-gray-900 text-sm mb-3">Score Breakdown</p>
          {[
            { label: "Waste Diverted", pct: Math.min(100, (stats.weightSaved / 100) * 100), color: "#16A34A" },
            { label: "Purchases Made", pct: Math.min(100, stats.itemsBought * 10), color: "#059669" },
            { label: "Platform Activity", pct: 20, color: "#10B981" },
          ].map((bar, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-600">{bar.label}</p>
                <p className="text-xs font-bold text-gray-700">{Math.round(bar.pct)}%</p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${bar.pct}%`, background: bar.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => navigate("/m/kemetro/surplus")}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-sm" style={{ background: "#16A34A" }}>
          ♻️ Buy More Surplus → Boost Score
        </button>

      </div>

      <MobileBottomNav />
    </div>
  );
}