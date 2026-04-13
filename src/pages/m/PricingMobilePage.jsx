import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const ROLE_TABS = [
  { key: "buyer", label: "🏠 Buyer", category: "buyer" },
  { key: "seller", label: "🏡 Seller", category: "seller" },
  { key: "agent", label: "🤝 Agent", category: "agent" },
  { key: "pro", label: "👷 Pro", category: "kemework_professional" },
  { key: "kemetro", label: "🏭 Seller", category: "kemetro_seller" },
  { key: "fo", label: "🗺️ FO", category: "franchise_owner" },
];

const TIER_BG = {
  free: "bg-gray-50 border-gray-200",
  starter: "bg-blue-50 border-blue-200",
  pro: "bg-orange-50 border-orange-300",
  premium: "bg-amber-50 border-amber-300",
  enterprise: "bg-purple-50 border-purple-300",
};

export default function PricingMobilePage() {
  const [activeRole, setActiveRole] = useState("buyer");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    base44.entities.SubscriptionPlan.filter({ isPublic: true, isActive: true }, "sortOrder", 100)
      .then(setPlans)
      .finally(() => setLoading(false));
  }, []);

  const category = ROLE_TABS.find(t => t.key === activeRole)?.category;
  const filteredPlans = plans.filter(p => p.planCategory === category);

  const currentPlan = filteredPlans[currentCardIndex] || filteredPlans[0];

  const displayPrice = (plan) => {
    if (!plan) return 0;
    return billingCycle === "annual" && plan.annualPriceEGP
      ? Math.round(plan.annualPriceEGP / 12)
      : plan.monthlyPriceEGP;
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setCurrentCardIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white px-4 py-5 text-center">
        <h1 className="font-black text-xl mb-1">💎 Kemedar Plans</h1>
        <p className="text-gray-400 text-xs">Choose what's right for you</p>
      </div>

      {/* Role Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex overflow-x-auto no-scrollbar px-2 py-2 gap-1">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleRoleChange(tab.key)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeRole === tab.key ? "bg-orange-500 text-white" : "text-gray-600 bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pb-3">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${billingCycle === "monthly" ? "bg-gray-900 text-white" : "text-gray-500"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${billingCycle === "annual" ? "bg-orange-500 text-white" : "text-gray-500"}`}
          >
            Annual
            <span className="bg-green-500 text-white text-[9px] font-black px-1 rounded">-30%</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Plans coming soon.</div>
        ) : (
          <>
            {/* Card Navigator */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
                  disabled={currentCardIndex === 0}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center disabled:opacity-30 shadow-sm flex-shrink-0"
                >
                  <ChevronLeft size={16} />
                </button>

                {currentPlan && (
                  <div className={`flex-1 bg-white border-2 rounded-3xl p-6 shadow-lg ${TIER_BG[currentPlan.planTier] || "bg-white border-gray-200"}`}>
                    {currentPlan.isPopular && (
                      <div className="text-center mb-3">
                        <span className="bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full">
                          {currentPlan.badgeText || "Most Popular"}
                        </span>
                      </div>
                    )}

                    <h3 className="font-black text-gray-900 text-xl text-center mb-1">{currentPlan.planName}</h3>
                    {currentPlan.planNameAr && (
                      <p className="text-center text-gray-400 text-xs mb-3" dir="rtl">{currentPlan.planNameAr}</p>
                    )}
                    <p className="text-center text-gray-500 text-sm mb-5">{currentPlan.planDescription}</p>

                    <div className="text-center mb-5">
                      {currentPlan.planTier === "free" ? (
                        <span className="text-4xl font-black text-gray-900">Free</span>
                      ) : currentPlan.planTier === "enterprise" ? (
                        <span className="text-3xl font-black text-gray-900">Custom</span>
                      ) : (
                        <div>
                          <span className="text-5xl font-black text-orange-600">{displayPrice(currentPlan)}</span>
                          <span className="text-gray-400 text-sm"> EGP/mo</span>
                          {billingCycle === "annual" && currentPlan.annualDiscountPercent > 0 && (
                            <p className="text-green-600 text-xs font-bold mt-1">Save {currentPlan.annualDiscountPercent}% annually</p>
                          )}
                        </div>
                      )}
                    </div>

                    {currentPlan.planTier === "free" ? (
                      <Link to="/kemedar/search-properties" className="block w-full bg-gray-800 text-white font-black text-center py-4 rounded-2xl mb-4 text-base">
                        Get Started Free
                      </Link>
                    ) : currentPlan.planTier === "enterprise" ? (
                      <a href="mailto:enterprise@kemedar.com" className="block w-full bg-purple-600 text-white font-black text-center py-4 rounded-2xl mb-4 text-base">
                        Contact Sales
                      </a>
                    ) : (
                      <Link
                        to={`/kemedar/checkout/${currentPlan.planCode}`}
                        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-4 rounded-2xl mb-4 text-base"
                      >
                        {currentPlan.trialDays > 0 ? `✨ Start ${currentPlan.trialDays}-Day Trial` : "✨ Upgrade Now"}
                      </Link>
                    )}

                    {/* Key features */}
                    <div className="space-y-2">
                      {Object.entries(currentPlan.features || {}).slice(0, 6).map(([key, val]) => {
                        if (!val) return null;
                        return (
                          <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="text-green-500">✅</span>
                            <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                            {currentPlan.limits?.[key] && currentPlan.limits[key] !== -1 && (
                              <span className="ml-auto text-xs text-gray-400 font-bold">{currentPlan.limits[key]}</span>
                            )}
                            {currentPlan.limits?.[key] === -1 && (
                              <span className="ml-auto text-xs text-green-500 font-bold">∞</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setCurrentCardIndex(i => Math.min(filteredPlans.length - 1, i + 1))}
                  disabled={currentCardIndex >= filteredPlans.length - 1}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center disabled:opacity-30 shadow-sm flex-shrink-0"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                {filteredPlans.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCardIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentCardIndex ? "bg-orange-500 w-4" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            {/* All Plans Quick List */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">All Plans</p>
              {filteredPlans.map((plan, i) => (
                <button
                  key={plan.planCode}
                  onClick={() => setCurrentCardIndex(i)}
                  className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 transition ${i === currentCardIndex ? "border-orange-500" : "border-gray-100"}`}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{plan.planName}</p>
                    <p className="text-gray-400 text-xs">{plan.planTier}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-orange-600">
                      {plan.planTier === "free" ? "Free" : plan.planTier === "enterprise" ? "Custom" : `${displayPrice(plan)} EGP`}
                    </p>
                    {plan.planTier !== "free" && plan.planTier !== "enterprise" && (
                      <p className="text-gray-400 text-xs">/month</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* View full pricing on desktop */}
            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">See detailed comparison on desktop</p>
              <Link to="/kemedar/pricing" className="text-orange-600 text-sm font-bold hover:underline">
                Full Pricing Page →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}