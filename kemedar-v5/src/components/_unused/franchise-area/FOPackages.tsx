// @ts-nocheck
import { Check } from "lucide-react";

const APPLY_URL = "https://kemodoo.com/register-franchise-owner-area";

const PACKAGES = [
  {
    icon: "🏘",
    tier: "DISTRICT PACKAGE",
    coverage: "Single district",
    investment: "Contact Us",
    popular: false,
    features: ["Exclusive district license", "Up to 500 registered users", "Kemodoo office access", "Basic training & support", "1 team member access"],
    btnLabel: "Apply for District",
    btnStyle: "border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-orange-50",
  },
  {
    icon: "🏙",
    tier: "CITY PACKAGE",
    coverage: "Full city",
    investment: "Contact Us",
    popular: true,
    features: ["Exclusive city license", "Unlimited registered users", "Full Kemodoo access", "Advanced training program", "Up to 5 team members", "Priority support", "Marketing budget support"],
    btnLabel: "Apply for City",
    btnStyle: "bg-[#FF6B00] hover:bg-[#e55f00] text-white",
  },
  {
    icon: "🌆",
    tier: "MULTI-CITY PACKAGE",
    coverage: "Multiple cities",
    investment: "Contact Us",
    popular: false,
    features: ["Multiple city licenses", "Unlimited users & listings", "Premium Kemodoo access", "VIP training & certification", "Unlimited team members", "Dedicated account manager", "Co-investment opportunities"],
    btnLabel: "Apply for Multi-City",
    btnStyle: "bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white",
  },
];

export default function FOPackages() {
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl xl:text-4xl font-black text-gray-900 mb-4">Franchise Investment Packages</h2>
          <p className="text-gray-500 text-base">Choose the package that fits your territory size and ambitions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PACKAGES.map(pkg => (
            <div key={pkg.tier} className={`relative bg-white rounded-2xl border-2 p-7 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${pkg.popular ? "border-[#FF6B00] shadow-lg" : "border-gray-100"}`}>
              {pkg.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-black px-4 py-1 rounded-full whitespace-nowrap shadow">
                  ⭐ MOST POPULAR
                </span>
              )}
              <div className="text-4xl">{pkg.icon}</div>
              <div>
                <p className="text-[10px] font-black tracking-widest text-[#FF6B00] uppercase">{pkg.tier}</p>
                <p className="text-sm text-gray-500 mt-0.5">{pkg.coverage}</p>
              </div>
              <div>
                <span className="text-2xl font-black text-gray-900">{pkg.investment}</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-[#FF6B00] mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                className={`w-full text-center py-3 rounded-xl font-bold text-sm transition-all mt-2 block ${pkg.btnStyle}`}>
                {pkg.btnLabel}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 italic mt-8 max-w-xl mx-auto">
          * All investment amounts are disclosed during the consultation process based on territory size and market potential.
        </p>
      </div>
    </section>
  );
}