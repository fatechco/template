// @ts-nocheck
import Link from "next/link";
import { Check } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PLANS = [
  {
    id: "free",
    tier: "FREE",
    title: "Kemedar Free Package",
    price: "$0",
    period: "/ month",
    color: "text-gray-600",
    border: "border-gray-200",
    btnStyle: "border-2 border-gray-400 text-gray-700 hover:bg-gray-100",
    btnLabel: "Get Started",
    features: ["Up to 3 Properties", "Basic listing", "Standard support"],
  },
  {
    id: "bronze",
    tier: "BRONZE",
    title: "Kemedar Bronze Package",
    price: "$100",
    period: "/ month",
    popular: true,
    color: "text-[#FF6B00]",
    border: "border-[#FF6B00]",
    btnStyle: "bg-[#FF6B00] hover:bg-[#e55f00] text-white",
    btnLabel: "Subscribe Now",
    features: ["Up to 25 Properties", "Featured listing", "Priority support", "Analytics dashboard"],
  },
  {
    id: "silver",
    tier: "SILVER",
    title: "Kemedar Silver Package",
    price: "$200",
    period: "/ month",
    color: "text-slate-600",
    border: "border-slate-300",
    btnStyle: "bg-[#FF6B00] hover:bg-[#e55f00] text-white",
    btnLabel: "Subscribe Now",
    features: ["Up to 100 Properties", "1 Project listing", "Premium support", "Verification badge eligible", "Campaign tools"],
  },
  {
    id: "gold",
    tier: "GOLD",
    title: "Kemedar Gold Package",
    price: "$350",
    period: "/ month",
    color: "text-yellow-600",
    border: "border-yellow-400",
    btnStyle: "bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white",
    btnLabel: "Subscribe Now",
    features: ["Unlimited Properties", "Unlimited Projects", "VIP support", "Free verification", "Full marketing management", "Priority placement"],
  },
];

export default function SubscriptionPlans() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Choose Your Plan" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.border} p-6 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-black px-4 py-1 rounded-full tracking-wider shadow">
                  MOST POPULAR
                </span>
              )}
              <div>
                <span className={`text-[10px] font-black tracking-widest ${plan.color}`}>{plan.tier}</span>
                <h3 className="font-black text-gray-900 text-base mt-1 leading-tight">{plan.title}</h3>
              </div>
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-black ${plan.color}`}>{plan.price}</span>
                <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-[#FF6B00] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/advertise" className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors mt-2 text-center block ${plan.btnStyle}`}>
                {plan.btnLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}