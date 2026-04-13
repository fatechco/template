import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ScoreHeroCard from "@/components/score/ScoreHeroCard";
import ScoreDimensionCard from "@/components/score/ScoreDimensionCard";
import ScoreBadgesGrid from "@/components/score/ScoreBadgesGrid";
import ScoreHistory from "@/components/score/ScoreHistory";
import ScoreImprovePlan from "@/components/score/ScoreImprovePlan";
import ScoreShareSheet from "@/components/score/ScoreShareSheet";

const GRADE_ICONS = { Platinum: "💎", Gold: "🥇", Silver: "🥈", Bronze: "🥉", Starter: "⭐", Restricted: "⚠️" };

const PRIVILEGES = {
  Platinum: [
    { icon: "🔍", label: "Priority in search results", unlocked: true },
    { icon: "💎", label: "Platinum Verified badge shown", unlocked: true },
    { icon: "⚡", label: "Priority FO assignment", unlocked: true },
    { icon: "💰", label: "Reduced platform fees (1% off)", unlocked: true },
    { icon: "🚀", label: "Early access to new features", unlocked: true },
    { icon: "📞", label: "Direct admin support line", unlocked: true },
  ],
  Gold: [
    { icon: "🥇", label: "Gold Member badge on profile", unlocked: true },
    { icon: "🔍", label: "Enhanced search visibility", unlocked: true },
    { icon: "⚡", label: "Priority support queue", unlocked: true },
    { icon: "✅", label: "Trusted buyer/seller status", unlocked: true },
    { icon: "💎", label: "Priority in search results", unlocked: false, requires: "Platinum" },
    { icon: "💰", label: "Reduced fees (1%)", unlocked: false, requires: "Platinum" },
  ],
  Silver: [
    { icon: "✅", label: "Verified Member badge", unlocked: true },
    { icon: "🔓", label: "Access to all standard features", unlocked: true },
    { icon: "🔒", label: "Trusted for escrow transactions", unlocked: true },
    { icon: "🥇", label: "Gold Member badge", unlocked: false, requires: "Gold" },
    { icon: "⚡", label: "Priority support queue", unlocked: false, requires: "Gold" },
  ],
  Bronze: [
    { icon: "✅", label: "Basic platform features", unlocked: true },
    { icon: "🤝", label: "Can initiate negotiations", unlocked: true },
    { icon: "🔒", label: "Can use escrow (with verification)", unlocked: true },
    { icon: "🥈", label: "Verified Member badge", unlocked: false, requires: "Silver" },
    { icon: "🔍", label: "Enhanced search visibility", unlocked: false, requires: "Silver" },
  ],
  Starter: [
    { icon: "✅", label: "Basic browsing and search", unlocked: true },
    { icon: "⚠️", label: "Some premium features restricted", unlocked: false, requires: "Bronze" },
    { icon: "🤝", label: "Negotiations require verification", unlocked: false, requires: "Bronze" },
  ],
  Restricted: [
    { icon: "⚠️", label: "Account has active violations", unlocked: false, note: "Take action to lift restrictions" },
    { icon: "❌", label: "Cannot initiate new escrow deals", unlocked: false },
    { icon: "❌", label: "Limited messaging per day", unlocked: false },
    { icon: "❌", label: "Cannot create new listings", unlocked: false },
  ],
};

const BUYER_DIMS = ["financialReadiness", "platformBehavior", "verificationLevel", "communityStanding"];
const SELLER_DIMS = ["listingQuality", "transactionHistory", "responseBehavior", "sellerVerification"];
const PRO_DIMS = ["jobCompletion", "clientRatings", "professionalVerification", "professionalBehavior"];

export default function MyScore() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [events, setEvents] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [percentile, setPercentile] = useState(50);
  const [pointsToNextGrade, setPointsToNextGrade] = useState(0);
  const [nextGrade, setNextGrade] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await base44.functions.invoke("getMyKemedarScore", {});
    if (res.data?.success) {
      setScore(res.data.score);
      setEvents(res.data.recentEvents || []);
      setAllBadges(res.data.allBadges || []);
      setPercentile(res.data.percentile || 50);
      setPointsToNextGrade(res.data.pointsToNextGrade || 0);
      setNextGrade(res.data.nextGrade || null);
    }
    setLoading(false);
  };

  const grade = score?.overallGrade || "Starter";
  const privileges = PRIVILEGES[grade] || PRIVILEGES.Starter;
  const role = score?.primaryRole || "buyer";
  const dims = role === "professional" || role === "seller_kemetro" ? PRO_DIMS
    : role === "seller" ? SELLER_DIMS : BUYER_DIMS;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🎯 My Kemedar Score™</h1>
          <p className="text-gray-500 text-sm">Your trust & reputation score on the platform</p>
        </div>
      </div>

      {/* Hero */}
      <ScoreHeroCard score={score} percentile={percentile} onShare={() => setShowShare(true)} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {[
          ["overview", "📊 Overview"],
          ["breakdown", "📐 Breakdown"],
          ["badges", "🏅 Badges"],
          ["history", "📈 History"],
          ["improve", "🚀 Improve"],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* Privileges */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-black text-gray-900 text-lg mb-4">
              {GRADE_ICONS[grade]} Your {grade} Privileges
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {privileges.map((priv, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${priv.unlocked ? "bg-green-50" : "bg-gray-50"}`}>
                  <span className="text-xl">{priv.unlocked ? priv.icon : "🔒"}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${priv.unlocked ? "text-gray-900" : "text-gray-400"}`}>{priv.label}</p>
                    {!priv.unlocked && priv.requires && (
                      <p className="text-xs text-gray-400">Unlock with {priv.requires}</p>
                    )}
                    {priv.note && <p className="text-xs text-red-500">{priv.note}</p>}
                  </div>
                  {priv.unlocked && <span className="text-green-500 text-xs font-bold">✅</span>}
                </div>
              ))}
            </div>

            {pointsToNextGrade > 0 && nextGrade && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm font-bold text-orange-700">
                  You need <span className="text-orange-600 text-base">{pointsToNextGrade} more points</span> for {GRADE_ICONS[nextGrade]} {nextGrade}
                </p>
                <button onClick={() => setActiveTab("improve")} className="mt-2 text-xs text-orange-600 font-bold hover:underline">
                  See how to earn them →
                </button>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Score", val: score?.overallScore || 0, icon: "🎯", color: "text-orange-600" },
              { label: "Badges", val: (score?.earnedBadges || []).length, icon: "🏅", color: "text-amber-600" },
              { label: "Events", val: events.length, icon: "📊", color: "text-blue-600" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`font-black text-2xl ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BREAKDOWN */}
      {activeTab === "breakdown" && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Showing {role === "professional" ? "Professional" : role === "seller" ? "Seller" : "Buyer"} score breakdown
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {dims.map(dim => (
              <ScoreDimensionCard key={dim} dimension={dim} value={score?.[dim] || 0} />
            ))}
          </div>
        </div>
      )}

      {/* BADGES */}
      {activeTab === "badges" && (
        <ScoreBadgesGrid earnedBadges={score?.earnedBadges || []} allBadges={allBadges} />
      )}

      {/* HISTORY */}
      {activeTab === "history" && (
        <ScoreHistory events={events} currentScore={score?.overallScore || 0} />
      )}

      {/* IMPROVE */}
      {activeTab === "improve" && (
        <ScoreImprovePlan score={score} pointsToNextGrade={pointsToNextGrade} nextGrade={nextGrade} />
      )}

      {showShare && <ScoreShareSheet score={score} onClose={() => setShowShare(false)} />}
    </div>
  );
}