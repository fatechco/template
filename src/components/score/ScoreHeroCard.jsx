import { Link } from "react-router-dom";

const GRADE_CONFIG = {
  Platinum: { gradient: "from-[#6b4f00] via-[#b8860b] to-[#2d1f00]", icon: "💎", color: "#B8860B", text: "Top 5% of all Kemedar users" },
  Gold:     { gradient: "from-[#7c5a00] via-[#ffd700] to-[#4a3300]",  icon: "🥇", color: "#FFD700", text: "Top 20% of all Kemedar users" },
  Silver:   { gradient: "from-[#5a5a5a] via-[#c0c0c0] to-[#3a3a3a]", icon: "🥈", color: "#C0C0C0", text: "Top 40% of all Kemedar users" },
  Bronze:   { gradient: "from-[#5a3000] via-[#cd7f32] to-[#2d1800]", icon: "🥉", color: "#CD7F32", text: "Active member — keep building!" },
  Starter:  { gradient: "from-gray-600 via-gray-500 to-gray-700",     icon: "⭐", color: "#808080", text: "New member — start earning points!" },
  Restricted: { gradient: "from-red-900 via-red-700 to-red-900",      icon: "⚠️", color: "#FF0000", text: "Account has violations — take action" },
};

export default function ScoreHeroCard({ score, percentile, onShare }) {
  const grade = score?.overallGrade || "Starter";
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.Starter;
  const overall = score?.overallScore || 0;
  const change = score?.scoreChange || 0;
  const trend = score?.scoreTrend || "stable";

  const trendEl = trend === "rising"
    ? <span className="text-green-300 text-sm font-bold">↑ +{change} this month</span>
    : trend === "falling"
    ? <span className="text-red-300 text-sm font-bold">↓ {change} this month</span>
    : <span className="text-white/70 text-sm">→ Stable</span>;

  return (
    <div className={`bg-gradient-to-br ${cfg.gradient} rounded-3xl p-8 text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-9xl">{cfg.icon}</div>
      </div>

      <div className="relative z-10">
        {/* Share button */}
        <button onClick={onShare} className="absolute top-0 right-0 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">
          📤 Share My Score
        </button>

        {/* Grade icon */}
        <div className="text-center mb-3">
          <span className="text-6xl animate-pulse">{cfg.icon}</span>
        </div>

        {/* Grade name */}
        <p className="text-center text-white font-black text-3xl tracking-widest mb-1">{grade.toUpperCase()}</p>

        {/* Score number */}
        <div className="text-center mb-2">
          <span className="text-8xl font-black text-white">{overall}</span>
          <span className="text-2xl text-white/60 ml-2">/ 1000</span>
        </div>

        {/* Trend */}
        <div className="text-center mb-3">{trendEl}</div>

        {/* Percentile */}
        <p className="text-center text-white/70 text-sm mb-5">{cfg.text}</p>

        {/* Role sub-scores */}
        <div className="flex flex-wrap gap-2 justify-center">
          {score?.buyerScore != null && (
            <span className="bg-white/15 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">🏠 Buyer: {score.buyerScore}</span>
          )}
          {score?.sellerScore != null && (
            <span className="bg-white/15 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">🏡 Seller: {score.sellerScore}</span>
          )}
          {score?.professionalScore != null && (
            <span className="bg-white/15 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">👷 Pro: {score.professionalScore}</span>
          )}
        </div>
      </div>
    </div>
  );
}