import { useState } from "react";
import { Check, Zap, Star, Diamond, Gift, Megaphone, Package, Crown } from "lucide-react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: Gift,
    monthlyPrice: 0,
    color: "border-gray-200",
    badge: null,
    badgeColor: "",
    iconBg: "bg-gray-100 text-gray-600",
    btnClass: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
    features: [
      "Up to 5 products",
      "Basic store page",
      "Standard search visibility",
      "Customer messaging",
      "Order management",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    icon: Star,
    monthlyPrice: 15,
    color: "border-gray-300",
    badge: null,
    badgeColor: "",
    iconBg: "bg-gray-100 text-gray-500",
    btnClass: "bg-gray-700 hover:bg-gray-800 text-white",
    features: [
      "Up to 25 products",
      "Enhanced store page",
      "Improved search ranking",
      "Customer messaging",
      "Order management",
      "Basic analytics",
      "Coupon creation",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    icon: Crown,
    monthlyPrice: 50,
    color: "border-yellow-400",
    badge: "Most Popular",
    badgeColor: "bg-yellow-400 text-yellow-900",
    iconBg: "bg-yellow-50 text-yellow-600",
    btnClass: "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-lg shadow-orange-100",
    features: [
      "Up to 100 products",
      "Featured store badge",
      "Priority search ranking",
      "Customer messaging",
      "Advanced order management",
      "Full analytics dashboard",
      "Coupon & promotions",
      "Shipping zone management",
      "1 free listing service / month",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: Diamond,
    monthlyPrice: 100,
    color: "border-blue-400",
    badge: "Best Value",
    badgeColor: "bg-blue-600 text-white",
    iconBg: "bg-blue-50 text-blue-600",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100",
    features: [
      "Unlimited products",
      "Top-tier store badge & placement",
      "Highest search priority",
      "Dedicated account manager",
      "Advanced analytics & reports",
      "Coupons, promotions & campaigns",
      "Full shipping management",
      "3 free listing services / month",
      "1 free campaign / quarter",
      "Early access to new features",
    ],
  },
];

const SERVICES = [
  {
    id: "campaign",
    icon: Megaphone,
    name: "Kemetro Campaign",
    tagline: "Professional Marketing for Your Store",
    description:
      "Our expert marketing team will design and run a professional campaign for your store and product listings — including sponsored placements, social media promotions, email features, and homepage banners.",
    price: 199,
    unit: "per campaign",
    features: [
      "Sponsored product placements on homepage",
      "Social media posts & targeted ads",
      "Email newsletter feature",
      "Campaign performance report",
      "Dedicated campaign manager",
    ],
    cta: "Request Campaign",
    color: "border-orange-200 bg-orange-50",
    iconColor: "bg-orange-100 text-orange-600",
    btnClass: "bg-[#FF6B00] hover:bg-orange-600 text-white",
  },
  {
    id: "listing",
    icon: Package,
    name: "Kemetro Listing Service",
    tagline: "Professional Product Listing by Our Team",
    description:
      "Let our content specialists create polished, SEO-optimized product listings for you — complete with professional copywriting, high-quality image editing, spec sheets, and category optimization.",
    price: 29,
    unit: "per product",
    features: [
      "Professional product copywriting (EN & AR)",
      "Image editing & optimization",
      "Technical specifications formatting",
      "SEO-optimized title & description",
      "Category & tag optimization",
    ],
    cta: "Request Listing",
    color: "border-teal-200 bg-teal-50",
    iconColor: "bg-teal-100 text-teal-600",
    btnClass: "bg-teal-600 hover:bg-teal-700 text-white",
  },
];

export default function KemetroSellerSubscription() {
  const [billing, setBilling] = useState("monthly");
  const [currentPlan] = useState("free");
  const [requested, setRequested] = useState({});

  const discount = 0.20;
  const getPrice = (monthly) => {
    if (monthly === 0) return 0;
    if (billing === "yearly") return +(monthly * 12 * (1 - discount)).toFixed(0);
    return monthly;
  };

  const handleServiceRequest = (id) => {
    setRequested((r) => ({ ...r, [id]: true }));
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Subscriptions & Services</h1>
        <p className="text-gray-500 text-sm mt-1">Choose a plan and explore professional services to grow your store</p>
      </div>

      {/* ── SUBSCRIPTIONS ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">Subscription Plans</h2>
          {/* Billing Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billing === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billing === "yearly" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              Yearly
              <span className="bg-green-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const price = getPrice(plan.monthlyPrice);
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 ${plan.color} p-6 flex flex-col gap-4 ${plan.id === "gold" ? "shadow-lg" : ""}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap ${plan.badgeColor}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.iconBg}`}>
                    <plan.icon size={20} />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">{plan.name}</h3>
                </div>

                {/* Price */}
                <div>
                  {price === 0 ? (
                    <p className="text-3xl font-black text-gray-900">Free</p>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">${price}</span>
                      <span className="text-sm text-gray-500">/{billing === "yearly" ? "yr" : "mo"}</span>
                    </div>
                  )}
                  {billing === "yearly" && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-0.5">
                      Save ${(plan.monthlyPrice * 12 * discount).toFixed(0)}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${isCurrent ? "bg-gray-100 text-gray-400 cursor-default" : plan.btnClass}`}
                >
                  {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-gray-900">Professional Services</h2>
          <p className="text-sm text-gray-500 mt-1">One-time services to help you grow faster — handled by our expert team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc) => (
            <div key={svc.id} className={`rounded-2xl border-2 ${svc.color} p-6 flex flex-col gap-5`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${svc.iconColor}`}>
                  <svc.icon size={22} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{svc.name}</h3>
                  <p className="text-sm font-semibold text-gray-500">{svc.tagline}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{svc.description}</p>

              <ul className="space-y-2">
                {svc.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-2 border-t border-white/60">
                <div>
                  <span className="text-2xl font-black text-gray-900">${svc.price}</span>
                  <span className="text-sm text-gray-500 ml-1">{svc.unit}</span>
                </div>
                {requested[svc.id] ? (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 font-bold text-sm px-4 py-2.5 rounded-xl">
                    <Check size={16} /> Request Sent
                  </div>
                ) : (
                  <button onClick={() => handleServiceRequest(svc.id)} className={`font-bold text-sm px-5 py-2.5 rounded-xl transition-colors ${svc.btnClass}`}>
                    {svc.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}