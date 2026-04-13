import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "🔍", title: "Remote Property Search", desc: "Browse verified listings, get AI-matched recommendations, and shortlist properties from anywhere in the world." },
  { icon: "🤝", title: "Dedicated Franchise Owner", desc: "A verified local Franchise Owner visits properties on your behalf, negotiates prices, and sends you video walkthroughs." },
  { icon: "⚖️", title: "100% Legal & Digital", desc: "Full legal review, digital contracts, notarized documents — all handled remotely with zero paperwork hassle." },
  { icon: "💱", title: "Pay in Your Currency", desc: "Pay in AED, SAR, GBP, USD — no EGP bank account needed. Secure transfers via Kemedar Escrow™." },
  { icon: "🏠", title: "Property Management", desc: "Monthly rent collection, maintenance coordination, and transparent reports — your property earns while you live abroad." },
  { icon: "📊", title: "Monthly Reports", desc: "Every EGP tracked. Your FO sends monthly voice notes + financial reports so you always know what's happening." },
];

const HOW_IT_WORKS = [
  { title: "Create your Expat Profile", desc: "Tell us your budget, preferred areas, and investment goals. Takes 3 minutes." },
  { title: "Get matched with a local FO", desc: "A verified Franchise Owner in your target area is assigned to you instantly." },
  { title: "FO searches & visits for you", desc: "Your FO shortlists, visits, and records walkthroughs of matching properties." },
  { title: "Buy digitally, legally, securely", desc: "Review, negotiate, and sign — all digitally. Kemedar Escrow™ protects your funds." },
  { title: "Sit back & earn", desc: "Your FO manages the property, collects rent, and sends you monthly reports." },
];

const TESTIMONIALS = [
  { flag: "🇦🇪", name: "Khaled M.", location: "Dubai, UAE", text: "Bought my apartment in 5th Settlement without visiting Egypt once. My FO negotiated 8% off and I signed everything digitally. 6 weeks total.", property: "3BR — New Cairo" },
  { flag: "🇬🇧", name: "Sara A.", location: "London, UK", text: "The monthly management reports give me complete peace of mind. My FO sends a personal voice note each month. Incredible service.", property: "2BR — Maadi, Managed" },
  { flag: "🇸🇦", name: "Tarek H.", location: "Riyadh, KSA", text: "My FO spotted a legal issue that saved me from disaster. Honest, thorough, and speaks perfect English. I've bought two properties now.", property: "Villa — Sheikh Zayed" },
];

const WHY_BRILLIANT = [
  "No Egypt visit required — 100% remote from search to purchase to management.",
  "Verified local Franchise Owner acts as your trusted on-the-ground representative.",
  "Kemedar Escrow™ protects every payment — funds released only when milestones are met.",
  "First platform built specifically for Egyptian expats investing back home.",
];

export default function ExpatLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d1b3e] via-blue-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <span className="inline-block bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            🌍 Kemedar Expat™ · Live
          </span>
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-2xl font-black mb-3 leading-tight text-orange-300">Own Property in Egypt.<br />Without Leaving.</h1>
          <p className="text-sm text-blue-200 mb-2 leading-relaxed">
            From search to purchase to monthly rent — managed remotely by a verified local Franchise Owner.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            100% digital, legally secure, fully transparent.
          </p>
          <Link to="/kemedar/expat/setup"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            🚀 Start My Expat Profile
          </Link>
          <p className="mt-4 text-xs text-gray-500">Takes 3 minutes · No commitment · FO matched instantly</p>
        </div>
      </div>

      {/* Trust pills */}
      <div className="px-4 py-4 flex flex-wrap gap-2 justify-center bg-gray-50 border-b border-gray-100">
        {["✅ No Egypt visit needed", "💱 Pay in AED/SAR/GBP/USD", "🤝 Verified FO", "🔒 Escrow™ protected"].map(pill => (
          <span key={pill} className="bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">{pill}</span>
        ))}
      </div>

      {/* Features */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">What You Get</h2>
        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <div className="text-2xl flex-shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-black text-gray-900 text-sm mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">How It Works</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0 text-base">
                {i + 1}
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm mb-1">{step.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">What Expats Are Saying</h2>
        <div className="space-y-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">{t.flag}</div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                  <p className="text-[10px] text-orange-600 font-bold">{t.property}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">"{t.text}"</p>
              <p className="text-yellow-400 mt-2 text-sm">⭐⭐⭐⭐⭐</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Brilliant */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-[#0d1b3e] to-slate-800 rounded-3xl p-6 text-white">
          <h2 className="text-base font-black mb-4">💡 Why This Changes Everything</h2>
          <ul className="space-y-3">
            {WHY_BRILLIANT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-orange-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Ready to Invest in Egypt?</h2>
        <p className="text-gray-500 text-sm mb-5">Create your free expat profile. We'll match you with a local FO in minutes.</p>
        <Link to="/kemedar/expat/setup"
          className="inline-block bg-orange-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          🚀 Get Started Free
        </Link>
        <p className="text-gray-400 text-xs mt-3">Takes 3 minutes · No commitment</p>
      </div>

      <MobileBottomNav />
    </div>
  );
}