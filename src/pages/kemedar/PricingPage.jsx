import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import PlanCard from "@/components/subscription/PlanCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const ROLE_TABS = [
  { key: "buyer", label: "🏠 Buyer/Renter", category: "buyer" },
  { key: "seller", label: "🏡 Seller", category: "seller" },
  { key: "agent", label: "🤝 Agent", category: "agent" },
  { key: "pro", label: "👷 Professional", category: "kemework_professional" },
  { key: "kemetro", label: "🏭 Material Seller", category: "kemetro_seller" },
  { key: "fo", label: "🗺️ Franchise Owner", category: "franchise_owner" },
  { key: "developer", label: "🏗️ Developer", category: "developer" },
];

const FAQ = [
  { q: "Can I change plans anytime?", a: "Yes, upgrade instantly or downgrade at renewal. No penalties." },
  { q: "Is there a free trial?", a: "Pro plans include a 14-day free trial, no credit card required." },
  { q: "What payment methods are accepted?", a: "Credit/debit card, bank transfer, Kemedar Wallet, and Vodafone Cash." },
  { q: "Do unused credits roll over?", a: "AI credits (staging, searches) don't roll over. Usage limits reset each billing cycle." },
  { q: "Is there a refund policy?", a: "If you're unsatisfied within 7 days of upgrading, contact us for a full refund." },
  { q: "What happens to my data if I downgrade?", a: "Your data is always preserved. Features are simply gated until you upgrade again." },
];

export default function PricingPage() {
  const [activeRole, setActiveRole] = useState("buyer");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPlanCode, setCurrentPlanCode] = useState(null);

  useEffect(() => {
    loadPlans();
    loadCurrentPlan();
  }, []);

  const loadPlans = async () => {
    const all = await base44.entities.SubscriptionPlan.filter({ isPublic: true, isActive: true }, "sortOrder", 100);
    setPlans(all);
    setLoading(false);
  };

  const loadCurrentPlan = async () => {
    try {
      const user = await base44.auth.me().catch(() => null);
      if (!user) return;
      const subs = await base44.entities.UserSubscription.filter({ userId: user.id, status: "active" }, "-startedAt", 1);
      if (subs[0]) setCurrentPlanCode(subs[0].planCode);
    } catch {}
  };

  const activeCategory = ROLE_TABS.find(t => t.key === activeRole)?.category;
  const filteredPlans = plans.filter(p => p.planCategory === activeCategory);

  const totalSavings = billingCycle === "annual"
    ? filteredPlans.reduce((max, p) => Math.max(max, p.annualDiscountPercent || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16 px-6 text-center">
        <span className="inline-block bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-orange-500/30">
          💎 KEMEDAR PLANS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          Simple, Transparent<br />
          <span className="text-orange-400">Pricing</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-8">
          Start free. Upgrade when you're ready. No hidden fees.
        </p>

        {/* Role Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveRole(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeRole === tab.key
                  ? "bg-orange-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-white/10 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
              billingCycle === "monthly" ? "bg-white text-gray-900" : "text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
              billingCycle === "annual" ? "bg-white text-gray-900" : "text-gray-300"
            }`}
          >
            Annual
            {totalSavings > 0 && (
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                billingCycle === "annual" ? "bg-orange-500 text-white" : "bg-orange-500/30 text-orange-300"
              }`}>
                Save up to {totalSavings}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p>Plans coming soon for this category.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${filteredPlans.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan.planCode}
                plan={plan}
                billingCycle={billingCycle}
                currentPlanCode={currentPlanCode}
              />
            ))}
          </div>
        )}

        {/* Comparison Table Toggle */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
          >
            {showComparison ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showComparison ? "Hide" : "See"} Full Comparison Table
          </button>

          {showComparison && filteredPlans.length >= 2 && (
            <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto text-left">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold min-w-48">Feature</th>
                    {filteredPlans.map(p => (
                      <th key={p.planCode} className="text-center px-4 py-4 font-black text-gray-900">
                        {p.planName}
                        {p.isPopular && <span className="ml-1 text-orange-500">⭐</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Monthly Price", getValue: p => p.monthlyPriceEGP === 0 ? "Free" : `${p.monthlyPriceEGP} EGP` },
                    { label: "Annual Price", getValue: p => p.annualPriceEGP ? `${p.annualPriceEGP} EGP` : "—" },
                    { label: "Free Trial", getValue: p => p.trialDays > 0 ? `${p.trialDays} days` : "—" },
                    { label: "AI Reports", getValue: p => p.features?.advisor_report_ai ? "✅" : "❌" },
                    { label: "AI Negotiation", getValue: p => p.features?.negotiate_ai_strategy ? "✅" : "❌" },
                    { label: "AI Property Search", getValue: p => p.features?.ai_property_search ? "✅" : "❌" },
                    { label: "Price Predictions", getValue: p => p.features?.predict_basic ? "✅" : "❌" },
                    { label: "Virtual Tours", getValue: p => p.features?.twin_virtual_tour ? "✅" : "❌" },
                    { label: "Host Live Events", getValue: p => p.features?.live_host ? "✅" : "❌" },
                    { label: "Score Certificate", getValue: p => p.features?.score_certificate ? "✅" : "❌" },
                    { label: "Daily Swipes", getValue: p => p.limits?.match_swipes_daily === -1 ? "∞" : (p.limits?.match_swipes_daily || 20) },
                    { label: "Saved Properties", getValue: p => p.limits?.saved_properties === -1 ? "∞" : (p.limits?.saved_properties || 20) },
                    { label: "AI Coach Messages/day", getValue: p => p.limits?.coach_ai_messages_daily === -1 ? "∞" : (p.limits?.coach_ai_messages_daily || 5) },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-3 font-semibold text-gray-700">{row.label}</td>
                      {filteredPlans.map(p => (
                        <td key={p.planCode} className="px-4 py-3 text-center text-gray-800">{row.getValue(p)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Common Questions</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-bold text-gray-900 text-sm">{item.q}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}