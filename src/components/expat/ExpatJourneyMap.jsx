import { useState } from "react";
import { Link } from "react-router-dom";

const JOURNEY_STAGES = [
  {
    id: "discovery",
    icon: "🔍",
    number: "01",
    title: "Discovery",
    subtitle: "Find & Compare",
    color: "orange",
    steps: [
      "Country-specific landing with live currency calculator",
      "Browse properties priced in YOUR currency (AED/SAR/GBP...)",
      "AI investment briefs: rental yield, capital growth, risk rating",
      "Virtual tours via Kemedar Twin™ — no visit needed",
    ],
    cta: { label: "Browse Properties", to: "/search-properties" },
  },
  {
    id: "profile",
    icon: "👤",
    number: "02",
    title: "Expat Profile",
    subtitle: "Personalization & FO Match",
    color: "blue",
    steps: [
      "Where you live → currency auto-detected",
      "Investment goals → apartment, villa, rental income, capital gain",
      "Budget → exchange rate applied in real-time",
      "Preferred area → AI matches best local Franchise Owner",
    ],
    cta: { label: "Create Profile", to: "/kemedar/expat/setup" },
  },
  {
    id: "fo_visit",
    icon: "🏠",
    number: "03",
    title: "FO Property Visit",
    subtitle: "Remote Verification",
    color: "teal",
    steps: [
      "Request FO visit on any property you shortlist",
      "FO visits in person — photos, video, honest condition report",
      "Optional live video call during the visit (WhatsApp/Zoom)",
      "FO recommendation: Buy / Caution / Avoid — with reasoning",
    ],
    cta: null,
  },
  {
    id: "negotiation",
    icon: "🤝",
    number: "04",
    title: "Negotiation",
    subtitle: "Kemedar Negotiate™",
    color: "purple",
    steps: [
      "AI strategy briefing tailored for remote buyers",
      "FO negotiates on-site on your behalf",
      "Digital offers and counter-offers in your dashboard",
      "Final agreed price confirmed with full audit trail",
    ],
    cta: null,
  },
  {
    id: "legal",
    icon: "⚖️",
    number: "05",
    title: "Legal & POA",
    subtitle: "100% Remote & Digital",
    color: "amber",
    steps: [
      "Choose a legal package — Due Diligence, Full Remote Buyer, or Add-On",
      "Power of Attorney signed at your local Egyptian Embassy (1 visit)",
      "FO + Kemedar lawyer handles everything in Egypt",
      "All original documents couriered to you after completion",
    ],
    cta: { label: "See Legal Packages", to: "/kemedar/expat/legal" },
  },
  {
    id: "escrow",
    icon: "🔒",
    number: "06",
    title: "Payment & Escrow",
    subtitle: "Kemedar Escrow™",
    color: "green",
    steps: [
      "International wire transfer — AED, SAR, GBP, USD accepted",
      "Funds held securely in Kemedar Escrow™",
      "Released milestone by milestone (deposit → contract → registration → keys)",
      "Full protection: if deal falls through, funds returned",
    ],
    cta: null,
  },
  {
    id: "purchase",
    icon: "🎉",
    number: "07",
    title: "Purchase Complete",
    subtitle: "You Own It",
    color: "indigo",
    steps: [
      "Title deed registered in your name",
      "Keys handed to your FO for safekeeping or management",
      "Property photographed, documented, and archived",
      "Digital property passport created in your dashboard",
    ],
    cta: null,
  },
  {
    id: "management",
    icon: "📊",
    number: "08",
    title: "Ongoing Management",
    subtitle: "Passive Income, Zero Effort",
    color: "rose",
    steps: [
      "FO manages tenant search, vetting, contracts",
      "Rent collected monthly & transferred to your foreign bank",
      "Maintenance handled via Kemework™ professionals",
      "Monthly AI report in English or Arabic",
    ],
    cta: { label: "See Management", to: "/kemedar/expat/management" },
  },
  {
    id: "returns",
    icon: "📈",
    number: "09",
    title: "Returns & Portfolio",
    subtitle: "Track Your Wealth",
    color: "cyan",
    steps: [
      "Passive rental income in EGP — converted to your currency",
      "Capital appreciation tracked via Kemedar Predict™",
      "Annual portfolio report with ROI, yield, and market outlook",
      "Grow: repeat the journey for your second property",
    ],
    cta: { label: "View Dashboard", to: "/kemedar/expat/dashboard" },
  },
];

const COLOR_MAP = {
  orange: { bg: "bg-orange-50", border: "border-orange-200", num: "bg-orange-500", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500", icon: "text-orange-500" },
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   num: "bg-blue-600",   badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-600",   icon: "text-blue-600" },
  teal:   { bg: "bg-teal-50",   border: "border-teal-200",   num: "bg-teal-600",   badge: "bg-teal-100 text-teal-700",   dot: "bg-teal-600",   icon: "text-teal-600" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", num: "bg-purple-600", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-600", icon: "text-purple-600" },
  amber:  { bg: "bg-amber-50",  border: "border-amber-200",  num: "bg-amber-500",  badge: "bg-amber-100 text-amber-700",  dot: "bg-amber-500",  icon: "text-amber-600" },
  green:  { bg: "bg-green-50",  border: "border-green-200",  num: "bg-green-600",  badge: "bg-green-100 text-green-700",  dot: "bg-green-600",  icon: "text-green-600" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", num: "bg-indigo-600", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-600", icon: "text-indigo-600" },
  rose:   { bg: "bg-rose-50",   border: "border-rose-200",   num: "bg-rose-500",   badge: "bg-rose-100 text-rose-700",   dot: "bg-rose-500",   icon: "text-rose-500" },
  cyan:   { bg: "bg-cyan-50",   border: "border-cyan-200",   num: "bg-cyan-600",   badge: "bg-cyan-100 text-cyan-700",   dot: "bg-cyan-600",   icon: "text-cyan-600" },
};

export default function ExpatJourneyMap({ currency = "AED", compact = false }) {
  const [active, setActive] = useState(null);

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-300 via-green-300 to-cyan-300 hidden sm:block" />

      <div className="space-y-4">
        {JOURNEY_STAGES.map((stage, idx) => {
          const c = COLOR_MAP[stage.color];
          const isOpen = active === stage.id;
          return (
            <div key={stage.id} className="relative">
              {/* Stage row */}
              <button
                onClick={() => setActive(isOpen ? null : stage.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${isOpen ? `${c.bg} ${c.border}` : "bg-white border-gray-100 hover:border-gray-200"}`}
              >
                {/* Number badge */}
                <div className={`w-14 h-14 rounded-2xl ${c.num} text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-xl leading-none">{stage.icon}</span>
                  <span className="text-[10px] font-black opacity-80">{stage.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-gray-900">{stage.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{stage.subtitle}</span>
                  </div>
                  {!compact && (
                    <p className="text-xs text-gray-400 mt-0.5">{stage.steps[0]}</p>
                  )}
                </div>
                <span className={`text-gray-400 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className={`mt-1 ml-0 sm:ml-18 ${c.bg} border ${c.border} rounded-2xl p-5`}>
                  <ul className="space-y-2 mb-4">
                    {stage.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <div className={`w-5 h-5 rounded-full ${c.num} text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5`}>{i + 1}</div>
                        {step}
                      </li>
                    ))}
                  </ul>
                  {stage.cta && (
                    <Link to={stage.cta.to} className={`inline-block text-sm font-black px-5 py-2.5 rounded-xl text-white ${c.num} hover:opacity-90 transition-opacity`}>
                      {stage.cta.label} →
                    </Link>
                  )}
                </div>
              )}

              {/* Arrow connector */}
              {idx < JOURNEY_STAGES.length - 1 && !isOpen && (
                <div className="flex justify-center my-1 text-gray-300 text-lg hidden sm:flex">↓</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link to="/kemedar/expat/setup" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg">
          Start My Journey →
        </Link>
        <p className="text-gray-400 text-sm mt-2">Free to start · No Egypt visit required</p>
      </div>
    </div>
  );
}