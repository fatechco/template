// @ts-nocheck
// Compact score widget for use on profile cards, listings, negotiate rooms, etc.
const GRADE_CONFIG = {
  Platinum: { icon: "💎", color: "bg-yellow-800 text-yellow-100", badge: "border-yellow-600" },
  Gold:     { icon: "🥇", color: "bg-yellow-500 text-white",      badge: "border-yellow-400" },
  Silver:   { icon: "🥈", color: "bg-gray-400 text-white",        badge: "border-gray-300" },
  Bronze:   { icon: "🥉", color: "bg-orange-700 text-white",      badge: "border-orange-500" },
  Starter:  { icon: "⭐", color: "bg-gray-500 text-white",        badge: "border-gray-400" },
  Restricted: { icon: "⚠️", color: "bg-red-600 text-white",      badge: "border-red-400" },
};

export default function ScoreGradeWidget({ score, size = "md", showDetails = true }) {
  const grade = score?.overallGrade || "Starter";
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.Starter;
  const overall = score?.overallScore || 0;

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cfg.color}`}>
        {cfg.icon} {grade}
      </span>
    );
  }

  if (size === "xs") {
    return (
      <span title={`Kemedar Score: ${overall}/1000`} className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${cfg.color}`}>
        {cfg.icon}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 border ${cfg.badge} rounded-2xl px-3 py-2 bg-white shadow-sm`}>
      <span className="text-2xl">{cfg.icon}</span>
      <div>
        <p className="font-black text-gray-900 text-sm leading-none">Kemedar Score™: {grade}</p>
        {showDetails && <p className="text-xs text-gray-400 mt-0.5">{overall} / 1000</p>}
      </div>
    </div>
  );
}