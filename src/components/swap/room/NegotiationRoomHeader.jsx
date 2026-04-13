import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const STATUS_CONFIG = {
  both_interested: { label: "🔄 Opening Room", color: "bg-purple-100 text-purple-700" },
  negotiating: { label: "💬 Negotiating", color: "bg-orange-100 text-orange-700" },
  terms_agreed: { label: "✅ Terms Agreed", color: "bg-green-100 text-green-700" },
  legal_review: { label: "⚖️ Legal Review", color: "bg-blue-100 text-blue-700" },
  escrow_active: { label: "🔒 Escrow Active", color: "bg-purple-100 text-purple-700" },
  completed: { label: "✅ Swap Completed", color: "bg-emerald-100 text-emerald-800" },
};

function PropThumb({ label, title, imageUrl, align = "left" }) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <div className="w-[80px] h-[56px] rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
        )}
      </div>
      <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
        <p className="text-xs font-bold" style={{ color: align === "left" ? "#7C3AED" : "#6B7280" }}>{label}</p>
        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 max-w-[140px]">{title || "Property"}</p>
      </div>
    </div>
  );
}

export default function NegotiationRoomHeader({ match, isUserA }) {
  const statusInfo = STATUS_CONFIG[match.status] || { label: match.status, color: "bg-gray-100 text-gray-600" };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back link */}
        <div className="pt-3 pb-1">
          <Link to="/dashboard/swap?tab=negotiations" className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-xs font-medium transition-colors w-fit">
            <ArrowLeft size={13} /> Back to Swap Hub
          </Link>
        </div>

        {/* Property versus strip */}
        <div className="flex items-center py-3">
          {/* Party A */}
          <div className="flex-[2]">
            <PropThumb
              label={isUserA ? "Your property" : "Their property"}
              title={`Property #${match.propertyAId?.slice(0,8)}`}
              align="left"
            />
          </div>

          {/* Center */}
          <div className="flex-1 flex flex-col items-center">
            <span className="text-2xl" style={{ animation: "spin 6s linear infinite", display: "inline-block", color: "#7C3AED" }}>🔄</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">Swap Match</span>
          </div>

          {/* Party B */}
          <div className="flex-[2] flex justify-end">
            <PropThumb
              label={isUserA ? "Their property" : "Your property"}
              title={`Property #${match.propertyBId?.slice(0,8)}`}
              align="right"
            />
          </div>
        </div>

        {/* Status bar */}
        <div className="pb-3 flex justify-center">
          <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}