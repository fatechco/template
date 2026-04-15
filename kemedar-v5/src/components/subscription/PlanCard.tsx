// @ts-nocheck
import Link from "next/link";
import { Check, X } from "lucide-react";

const TIER_COLORS = {
  free: { border: "border-gray-200", badge: "bg-gray-100 text-gray-700", btn: "bg-gray-800 hover:bg-gray-900", btnText: "text-white" },
  starter: { border: "border-blue-200", badge: "bg-blue-100 text-blue-700", btn: "bg-blue-600 hover:bg-blue-700", btnText: "text-white" },
  pro: { border: "border-orange-300", badge: "bg-orange-500 text-white", btn: "bg-orange-500 hover:bg-orange-600", btnText: "text-white" },
  premium: { border: "border-amber-300", badge: "bg-amber-500 text-white", btn: "bg-amber-500 hover:bg-amber-600", btnText: "text-white" },
  enterprise: { border: "border-purple-300", badge: "bg-purple-600 text-white", btn: "bg-purple-600 hover:bg-purple-700", btnText: "text-white" },
};

export default function PlanCard({ plan, billingCycle = "monthly", currentPlanCode = null, compact = false }) {
  const colors = TIER_COLORS[plan.planTier] || TIER_COLORS.free;
  const isCurrent = currentPlanCode === plan.planCode;
  const isFree = plan.planTier === "free";
  const isEnterprise = plan.planTier === "enterprise";

  const displayPrice = billingCycle === "annual" && plan.annualPriceEGP
    ? Math.round(plan.annualPriceEGP / 12)
    : plan.monthlyPriceEGP;

  const annualSaving = plan.annualPriceEGP
    ? Math.round((plan.monthlyPriceEGP * 12) - plan.annualPriceEGP)
    : 0;

  const checkoutPath = `/kemedar/checkout/${plan.planCode}`;

  const featureGroups = [
    {
      label: "Search & Match",
      features: [
        { key: "search_properties", label: "Property Search" },
        { key: "ai_property_search", label: "AI Natural Language Search" },
        { key: "match_swipe", label: "Property Match Swipes" },
        { key: "match_undo", label: "Undo Swipes" },
        { key: "match_filters_advanced", label: "Advanced Filters" },
        { key: "save_properties", label: "Save Properties" },
      ],
    },
    {
      label: "AI Features",
      features: [
        { key: "advisor_report_ai", label: "AI Advisor Report" },
        { key: "negotiate_ai_strategy", label: "AI Negotiation Strategy" },
        { key: "negotiate_ai_draft", label: "AI Message Drafting" },
        { key: "predict_basic", label: "Price Predictions" },
        { key: "coach_all_journeys", label: "All Coach Journeys" },
      ],
    },
    {
      label: "Analytics & Insights",
      features: [
        { key: "vision_view_score", label: "Vision™ Scores" },
        { key: "vision_report_full", label: "Full Vision™ Reports" },
        { key: "life_score_compare", label: "Life Score Comparison" },
        { key: "predict_full", label: "Full Predict™ Reports" },
        { key: "score_certificate", label: "Score Certificate" },
      ],
    },
    {
      label: "Platform Access",
      features: [
        { key: "twin_virtual_tour", label: "Virtual Tours" },
        { key: "live_host", label: "Host Live Events" },
        { key: "escrow_basic", label: "Escrow™ Access" },
        { key: "expat_fo_visit", label: "FO Visit Requests" },
        { key: "community_join", label: "Community Access" },
      ],
    },
  ];

  return (
    <div
      className={`relative bg-white rounded-3xl border-2 ${colors.border} shadow-lg flex flex-col
        ${plan.isPopular ? "shadow-orange-100 scale-[1.02]" : ""}
        ${isCurrent ? "ring-2 ring-green-400 ring-offset-2" : ""}
        transition-all duration-200`}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            {plan.badgeText || "Most Popular"}
          </span>
        </div>
      )}

      {/* Current badge */}
      {isCurrent && (
        <div className="absolute -top-4 right-4 z-10">
          <span className="bg-green-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow">
            ✅ Current Plan
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-black text-gray-900 text-xl mb-1">{plan.planName}</h3>
          {plan.planNameAr && (
            <p className="text-gray-400 text-xs mb-2" dir="rtl">{plan.planNameAr}</p>
          )}
          <p className="text-gray-500 text-sm">{plan.planDescription}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          {isEnterprise ? (
            <div>
              <p className="text-3xl font-black text-gray-900">Custom</p>
              <p className="text-gray-500 text-sm mt-1">Contact us for pricing</p>
            </div>
          ) : isFree ? (
            <div>
              <p className="text-5xl font-black text-gray-900">Free</p>
              <p className="text-gray-400 text-sm mt-1">Forever</p>
            </div>
          ) : (
            <div>
              {billingCycle === "annual" && (
                <p className="text-gray-400 text-sm line-through mb-1">{plan.monthlyPriceEGP} EGP/mo</p>
              )}
              <p className="text-5xl font-black text-orange-600">{displayPrice}</p>
              <p className="text-gray-500 text-base mt-1">EGP/month</p>
              {billingCycle === "annual" && plan.annualPriceEGP && (
                <div className="mt-2">
                  <p className="text-gray-400 text-xs">Billed {plan.annualPriceEGP} EGP annually</p>
                  {annualSaving > 0 && (
                    <p className="text-green-600 text-xs font-bold">Save {annualSaving} EGP per year</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        {isCurrent ? (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 font-bold text-center py-3.5 rounded-2xl mb-6 text-sm">
            ✅ Your Current Plan
          </div>
        ) : isEnterprise ? (
          <a
            href="mailto:enterprise@kemedar.com"
            className={`w-full ${colors.btn} ${colors.btnText} font-black text-center py-4 rounded-2xl mb-6 text-base block transition`}
          >
            Contact Sales
          </a>
        ) : isFree ? (
          <Link
            href="/kemedar/search-properties"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-black text-center py-4 rounded-2xl mb-6 text-base block transition"
          >
            Get Started Free
          </Link>
        ) : (
          <Link
            href={checkoutPath}
            className={`w-full ${colors.btn} ${colors.btnText} font-black text-center py-4 rounded-2xl mb-6 text-base block transition`}
          >
            {plan.trialDays > 0 ? `✨ Start ${plan.trialDays}-Day Free Trial` : `✨ Upgrade Now`}
          </Link>
        )}

        {!isFree && !isEnterprise && (
          <p className="text-center text-gray-400 text-xs mb-4">
            Cancel anytime · No setup fees
          </p>
        )}

        {/* Features */}
        {!compact && (
          <div className="space-y-4 flex-1">
            <p className="font-bold text-gray-900 text-sm">What's included:</p>
            {featureGroups.map(group => {
              const feats = plan.features || {};
              return (
                <div key={group.label}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{group.label}</p>
                  {group.features.map(feat => {
                    const included = feats[feat.key] === true || feats[feat.key] !== false && feats[feat.key] !== undefined;
                    const isNew = !isFree && included;
                    return (
                      <div key={feat.key} className={`flex items-center gap-2 py-1 text-sm ${included ? "text-gray-800" : "text-gray-300"}`}>
                        {included
                          ? <span className="text-green-500 flex-shrink-0">✅</span>
                          : <span className="text-gray-300 flex-shrink-0">❌</span>
                        }
                        {feat.label}
                        {plan.limits?.[feat.key] && (
                          <span className="ml-auto text-xs text-gray-400">
                            {plan.limits[feat.key] === -1 ? "∞" : plan.limits[feat.key]}
                            {feat.key.includes("daily") ? "/day" : feat.key.includes("monthly") ? "/mo" : ""}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}