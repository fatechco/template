import { useState } from "react";

const DIMENSION_META = {
  financialReadiness:       { label: "Financial Readiness",     icon: "💰", max: 300, color: "text-green-600",  bar: "bg-green-500",  factors: [
    { label: "Phone verified", points: 20, key: "phone_verified" },
    { label: "Email verified", points: 10, key: "email_verified" },
    { label: "National ID verified", points: 50, key: "national_id_verified" },
    { label: "Bank statement uploaded", points: 40, key: "bank_statement_uploaded" },
    { label: "Pre-approval letter", points: 60, key: "pre_approval_uploaded" },
    { label: "Escrow account created", points: 30, key: "escrow_account_created" },
    { label: "Escrow KYC passed", points: 30, key: "escrow_kyc_standard" },
  ]},
  platformBehavior:         { label: "Platform Behavior",       icon: "🤝", max: 250, color: "text-blue-600",   bar: "bg-blue-500",   factors: [
    { label: "Offer followed through (+30/deal)", points: 30 },
    { label: "Viewings attended (+10 each)", points: 10 },
    { label: "Response < 1 hour (+5 each)", points: 5 },
    { label: "Deals completed (+50 each)", points: 50 },
    { label: "Negotiation completed (+20)", points: 20 },
  ]},
  verificationLevel:        { label: "Verification Level",      icon: "✅", max: 250, color: "text-teal-600",   bar: "bg-teal-500",   factors: [
    { label: "Profile complete (photo + bio)", points: 20 },
    { label: "Phone verified", points: 30 },
    { label: "Email verified", points: 20 },
    { label: "National ID verified", points: 60 },
    { label: "Address verified", points: 40 },
    { label: "Community verified resident", points: 30 },
    { label: "Escrow KYC — Standard", points: 30 },
    { label: "Escrow KYC — Enhanced", points: 20 },
  ]},
  communityStanding:        { label: "Community Standing",      icon: "🏘", max: 200, color: "text-purple-600", bar: "bg-purple-500", factors: [
    { label: "Verified community member (+50)", points: 50 },
    { label: "Area reviews written (+20 each)", points: 20 },
    { label: "Helpful votes received (+2 each)", points: 2 },
    { label: "Recommendations written (+15)", points: 15 },
    { label: "No community violations (+30)", points: 30 },
  ]},
  listingQuality:           { label: "Listing Quality",         icon: "📸", max: 300, color: "text-orange-600", bar: "bg-orange-500", factors: [
    { label: "Vision™ score > 85 (+40/listing)", points: 40 },
    { label: "All fields completed (+20)", points: 20 },
    { label: "Floor plan uploaded (+15)", points: 15 },
    { label: "Virtual tour added (+25)", points: 25 },
    { label: "Kemedar Verified badge (+50)", points: 50 },
    { label: "Property sold within 30 days (+40)", points: 40 },
  ]},
  transactionHistory:       { label: "Transaction History",     icon: "🤝", max: 300, color: "text-indigo-600", bar: "bg-indigo-500", factors: [
    { label: "Escrow™ deal completed (+60/deal)", points: 60 },
    { label: "First deal bonus (+50)", points: 50 },
    { label: "Multiple deals (3+) bonus (+30)", points: 30 },
    { label: "Positive buyer review (+25)", points: 25 },
    { label: "5-star review bonus (+10)", points: 10 },
  ]},
  responseBehavior:         { label: "Response Behavior",       icon: "⚡", max: 200, color: "text-yellow-600", bar: "bg-yellow-500", factors: [
    { label: "Avg response < 1 hour (+80)", points: 80 },
    { label: "Responds to 90%+ offers (+60)", points: 60 },
    { label: "Match™ responses sent (+5 each)", points: 5 },
  ]},
  sellerVerification:       { label: "Seller Verification",     icon: "🏡", max: 200, color: "text-rose-600",   bar: "bg-rose-500",   factors: [
    { label: "Basic profile (+20)", points: 20 },
    { label: "Phone verified (+30)", points: 30 },
    { label: "National ID (+50)", points: 50 },
    { label: "Property deed uploaded (+40)", points: 40 },
    { label: "Title deed FO-verified (+60)", points: 60 },
  ]},
  jobCompletion:            { label: "Job Completion",          icon: "🔨", max: 350, color: "text-teal-700",   bar: "bg-teal-600",   factors: [
    { label: "Job completed on time (+20/job)", points: 20 },
    { label: "Within budget (+15/job)", points: 15 },
    { label: "Client marked complete (+20)", points: 20 },
    { label: "Daily progress photos (+5/day)", points: 5 },
    { label: "No dispute bonus (+10)", points: 10 },
  ]},
  clientRatings:            { label: "Client Ratings",          icon: "⭐", max: 300, color: "text-amber-600",  bar: "bg-amber-500",  factors: [
    { label: "5.0 stars → 300 pts", points: 300 },
    { label: "4.5 stars → 270 pts", points: 270 },
    { label: "4.0 stars → 240 pts", points: 240 },
    { label: "Volume bonus (10+ reviews)", points: 20 },
  ]},
  professionalVerification: { label: "Pro Verification",        icon: "✅", max: 200, color: "text-cyan-600",   bar: "bg-cyan-500",   factors: [
    { label: "Profile complete (+20)", points: 20 },
    { label: "Phone verified (+30)", points: 30 },
    { label: "National ID (+50)", points: 50 },
    { label: "Trade certification (+40)", points: 40 },
    { label: "Kemedar Accredited (+60)", points: 60 },
  ]},
  professionalBehavior:     { label: "Pro Behavior",            icon: "🎯", max: 150, color: "text-violet-600", bar: "bg-violet-500", factors: [
    { label: "Response < 2hrs to jobs (+40)", points: 40 },
    { label: "Bid accuracy (+30)", points: 30 },
    { label: "Platform tenure per year (+20)", points: 20 },
    { label: "Community recs (+30)", points: 30 },
    { label: "No fake reviews (+30)", points: 30 },
  ]},
};

function gradeLabel(score, max) {
  const pct = score / max;
  if (pct >= 0.9) return "A+";
  if (pct >= 0.75) return "A";
  if (pct >= 0.6) return "B";
  if (pct >= 0.4) return "C";
  return "D";
}

export default function ScoreDimensionCard({ dimension, value }) {
  const [expanded, setExpanded] = useState(false);
  const meta = DIMENSION_META[dimension];
  if (!meta) return null;

  const pct = Math.round((value / meta.max) * 100);
  const grade = gradeLabel(value, meta.max);
  const remaining = meta.max - value;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{meta.icon}</span>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm">{meta.label}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-2xl font-black ${meta.color}`}>{value}</span>
              <span className="text-gray-400 text-sm">/ {meta.max}</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${pct >= 80 ? "bg-green-100 text-green-700" : pct >= 60 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                {grade}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <div className={`h-full ${meta.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400">{remaining > 0 ? `${remaining} points to maximum` : "Maximum reached! 🏆"}</p>
      </div>

      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 border-t border-gray-100 text-xs text-gray-400 hover:bg-gray-50 transition-colors">
        {expanded ? "▲ Hide details" : "▼ What's in this score"}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <div className="space-y-2">
            {meta.factors.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{f.label}</span>
                <span className={`text-xs font-bold ${f.points > 0 ? "text-green-600" : "text-red-500"}`}>
                  {f.points > 0 ? "+" : ""}{f.points} pts
                </span>
              </div>
            ))}
          </div>
          {remaining > 0 && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="text-xs font-bold text-orange-700 mb-1">💡 How to improve:</p>
              <p className="text-xs text-orange-600">Complete the actions above to add {remaining} more points to this dimension.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}