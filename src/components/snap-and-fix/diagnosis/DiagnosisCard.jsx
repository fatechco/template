const URGENCY_BADGE = {
  low: {
    label: "● Low Urgency",
    className: "bg-gray-100 text-gray-600",
  },
  medium: {
    label: "● Plan Soon",
    className: "bg-orange-100 text-orange-600",
  },
  high: {
    label: "● Urgent",
    className: "border border-red-400 text-red-600 bg-white",
  },
  emergency: {
    label: "⚡ Emergency",
    className: "bg-red-500 text-white",
    pulse: true,
  },
};

function formatCategorySlug(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatCost(min, max) {
  if (!min && !max) return "—";
  if (min && max) return `${Number(min).toLocaleString()}–${Number(max).toLocaleString()} EGP`;
  if (min) return `From ${Number(min).toLocaleString()} EGP`;
  if (max) return `Up to ${Number(max).toLocaleString()} EGP`;
  return "—";
}

export default function DiagnosisCard({ session }) {
  const urgency = session?.urgencyLevel || "medium";
  const badge = URGENCY_BADGE[urgency] || URGENCY_BADGE.medium;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #E5E7EB",
        borderLeft: "4px solid #14B8A6",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-xl flex-shrink-0">
            🩺
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
            AI Found:
          </span>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full ${badge.className}`}
          style={badge.pulse ? { animation: "safety-pulse 1.5s ease-in-out infinite" } : {}}
        >
          {badge.label}
        </span>
      </div>

      {/* Diagnosis text */}
      <div className="px-4 pb-3 text-center">
        <p className="text-[20px] font-black text-gray-900 leading-snug mb-1">
          {session?.diagnosedIssue || "Issue Detected"}
        </p>
        {session?.diagnosedIssueAr && (
          <p className="text-sm text-gray-400 leading-snug" dir="rtl">
            {session.diagnosedIssueAr}
          </p>
        )}

        {/* Category badge */}
        {session?.kemeworkCategorySlug && (
          <div className="mt-3">
            <span className="inline-block bg-teal-50 text-teal-700 text-[12px] font-bold px-3 py-1.5 rounded-full border border-teal-100">
              {formatCategorySlug(session.kemeworkCategorySlug)}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mx-4" />

      {/* Details rows */}
      <div className="px-4 py-3 space-y-2">
        {session?.professionalSkillRequired && (
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <span>👷</span>
            <span>Requires:</span>
            <span className="font-semibold text-gray-700">{session.professionalSkillRequired}</span>
          </div>
        )}

        {(session?.estimatedLaborHoursMin || session?.estimatedLaborHoursMax) && (
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <span>⏱️</span>
            <span>Est. labor time:</span>
            <span className="font-semibold text-gray-700">
              {session.estimatedLaborHoursMin || "?"}–{session.estimatedLaborHoursMax || "?"} hours
            </span>
          </div>
        )}

        {(session?.estimatedLaborCostEGPMin || session?.estimatedLaborCostEGPMax) && (
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <span>💰</span>
            <span>Est. labor cost:</span>
            <span className="font-semibold text-gray-700">
              {formatCost(session.estimatedLaborCostEGPMin, session.estimatedLaborCostEGPMax)}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes safety-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}