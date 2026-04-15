// @ts-nocheck
import { Check, Star } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "month",
    popular: false,
    features: [
      "Up to 10 products",
      "Basic store page",
      "10% commission per sale",
      "Standard support",
    ],
    buttonLabel: "Start Free",
  },
  {
    name: "Basic",
    price: 30,
    period: "month",
    popular: false,
    features: [
      "Up to 50 products",
      "Custom store page",
      "8% commission",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonLabel: "Get Basic",
  },
  {
    name: "Professional",
    price: 80,
    period: "month",
    popular: true,
    features: [
      "Up to 200 products",
      "Featured store placement",
      "6% commission",
      "Advanced analytics",
      "Promotional tools",
      "Dedicated manager",
    ],
    buttonLabel: "Go Professional",
  },
  {
    name: "Enterprise",
    price: 150,
    period: "month",
    popular: false,
    features: [
      "Unlimited products",
      "Top placement in search",
      "4% commission",
      "Full marketing support",
      "API access",
      "Custom integrations",
    ],
    buttonLabel: "Enterprise",
  },
];

export default function KemetroSellerPlans() {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Seller Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl overflow-hidden transition-all ${
                plan.popular
                  ? "bg-white border-2 border-[#FF6B00] shadow-2xl scale-105"
                  : "bg-white border border-gray-200 hover:border-teal-300"
              }`}
            >
              {/* Header */}
              <div className={`p-6 ${plan.popular ? "bg-[#FF6B00]" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-2xl font-black ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  {plan.popular && <Star className="text-white fill-white" size={20} />}
                </div>
                <div className={`text-3xl font-black mb-1 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                  ${plan.price}
                </div>
                <p className={`text-sm ${plan.popular ? "text-white/80" : "text-gray-600"}`}>per {plan.period}</p>
              </div>

              {/* Features */}
              <div className="p-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="px-6 pb-6">
                <button
                  className={`w-full font-bold py-3 rounded-lg transition-colors ${
                    plan.popular
                      ? "bg-[#FF6B00] hover:bg-[#e55f00] text-white"
                      : "bg-teal-100 hover:bg-teal-200 text-teal-700"
                  }`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}