import { useState } from "react";

const SAMPLE_BADGES = [
  { badgeCode: "verified_identity", badgeName: "Verified Identity", badgeIcon: "✅", badgeColor: "#22c55e", badgeCategory: "verification", badgeDescription: "National ID confirmed" },
  { badgeCode: "property_owner_verified", badgeName: "Property Owner", badgeIcon: "🏠", badgeColor: "#f97316", badgeCategory: "verification", badgeDescription: "Owns verified property on Kemedar" },
  { badgeCode: "kyc_complete", badgeName: "KYC Complete", badgeIcon: "🔒", badgeColor: "#3b82f6", badgeCategory: "verification", badgeDescription: "Full Escrow KYC passed" },
  { badgeCode: "contact_verified", badgeName: "Contact Verified", badgeIcon: "📱", badgeColor: "#8b5cf6", badgeCategory: "verification", badgeDescription: "Phone + email both verified" },
  { badgeCode: "first_deal", badgeName: "First Deal", badgeIcon: "🤝", badgeColor: "#06b6d4", badgeCategory: "transaction", badgeDescription: "Completed first transaction" },
  { badgeCode: "deal_maker", badgeName: "Deal Maker", badgeIcon: "🎯", badgeColor: "#f59e0b", badgeCategory: "transaction", badgeDescription: "5 deals completed" },
  { badgeCode: "power_trader", badgeName: "Power Trader", badgeIcon: "🏆", badgeColor: "#b8860b", badgeCategory: "transaction", badgeDescription: "20+ deals completed" },
  { badgeCode: "speed_dealer", badgeName: "Speed Dealer", badgeIcon: "⚡", badgeColor: "#eab308", badgeCategory: "transaction", badgeDescription: "Completed a deal in under 7 days" },
  { badgeCode: "zero_disputes", badgeName: "Zero Disputes", badgeIcon: "💎", badgeColor: "#6366f1", badgeCategory: "transaction", badgeDescription: "10+ deals with zero disputes" },
  { badgeCode: "lightning_responder", badgeName: "Lightning Responder", badgeIcon: "⚡", badgeColor: "#0ea5e9", badgeCategory: "behavior", badgeDescription: "Avg response < 1 hour for 30+ interactions" },
  { badgeCode: "always_shows_up", badgeName: "Always Shows Up", badgeIcon: "📅", badgeColor: "#10b981", badgeCategory: "behavior", badgeDescription: "Zero viewing no-shows (10+ viewings)" },
  { badgeCode: "community_leader", badgeName: "Community Leader", badgeIcon: "🏘", badgeColor: "#a855f7", badgeCategory: "community", badgeDescription: "Verified member + 50+ helpful votes" },
  { badgeCode: "area_expert", badgeName: "Area Expert", badgeIcon: "⭐", badgeColor: "#f97316", badgeCategory: "community", badgeDescription: "Published 5+ reviews in one area" },
  { badgeCode: "photo_pro", badgeName: "Photo Pro", badgeIcon: "📸", badgeColor: "#ec4899", badgeCategory: "quality", badgeDescription: "Average Vision™ score > 85" },
  { badgeCode: "one_year", badgeName: "1 Year Member", badgeIcon: "🗓️", badgeColor: "#64748b", badgeCategory: "loyalty", badgeDescription: "Member for over 1 year" },
  { badgeCode: "founding_member", badgeName: "Founding Member", badgeIcon: "🌟", badgeColor: "#b8860b", badgeCategory: "special", badgeDescription: "Joined in first 6 months" },
  { badgeCode: "expat_investor", badgeName: "Expat Investor", badgeIcon: "🌍", badgeColor: "#0d9488", badgeCategory: "special", badgeDescription: "Completed purchase from abroad" },
  { badgeCode: "finish_champion", badgeName: "Finish Champion", badgeIcon: "🏗️", badgeColor: "#7c3aed", badgeCategory: "special", badgeDescription: "Completed Kemedar Finish™ project" },
];

const CATEGORIES = ["All", "verification", "transaction", "behavior", "community", "quality", "loyalty", "special"];

export default function ScoreBadgesGrid({ earnedBadges = [], allBadges }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const badges = (allBadges?.length > 0 ? allBadges : SAMPLE_BADGES);
  const earnedCodes = new Set((earnedBadges || []).map(b => b.badgeId || b.badgeCode));

  const filtered = activeCategory === "All" ? badges : badges.filter(b => b.badgeCategory === activeCategory);
  const earned = filtered.filter(b => earnedCodes.has(b.badgeCode));
  const unearned = filtered.filter(b => !earnedCodes.has(b.badgeCode));

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${activeCategory === cat ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{earnedCodes.size} badges earned · {badges.length - earnedCodes.size} to unlock</p>

      {/* Earned first */}
      {earned.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-3">✅ Earned</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {earned.map(badge => (
              <BadgeItem key={badge.badgeCode} badge={badge} earned={true} earnedInfo={earnedBadges.find(b => (b.badgeId || b.badgeCode) === badge.badgeCode)} />
            ))}
          </div>
        </div>
      )}

      {/* Unearned */}
      {unearned.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">🔒 Not Yet Earned</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {unearned.map(badge => (
              <BadgeItem key={badge.badgeCode} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeItem({ badge, earned, earnedInfo }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative flex flex-col items-center" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1 transition-all ${earned ? "shadow-md" : "opacity-30 grayscale"}`}
        style={earned ? { background: badge.badgeColor + "22", border: `2px solid ${badge.badgeColor}40` } : {}}>
        {badge.badgeIcon}
      </div>
      <p className="text-[10px] font-bold text-gray-700 text-center leading-tight">{badge.badgeName}</p>

      {showTip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 bg-gray-900 text-white text-xs rounded-xl p-3 w-44 shadow-xl">
          <p className="font-bold mb-1">{badge.badgeName}</p>
          <p className="text-gray-300">{badge.badgeDescription}</p>
          {earned && earnedInfo?.earnedAt && (
            <p className="text-green-400 mt-1 text-[10px]">Earned: {new Date(earnedInfo.earnedAt).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
}