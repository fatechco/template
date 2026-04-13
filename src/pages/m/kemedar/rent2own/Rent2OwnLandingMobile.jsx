import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "📋", title: "Structured Agreement", desc: "Agree on price, rent, equity portion & timeframe — all managed by Kemedar." },
  { icon: "📈", title: "Equity Dashboard", desc: "Track your ownership progress in real-time. See exactly how much equity you've built." },
  { icon: "💰", title: "Managed Payments", desc: "Kemedar collects rent, tracks equity, enforces terms throughout." },
  { icon: "🏠", title: "Seller Benefits", desc: "Immediate rent income + guaranteed buyer + premium price upfront." },
  { icon: "⚖️", title: "Contract Enforcement", desc: "Full lifecycle management from setup to final title transfer." },
  { icon: "🌍", title: "Social Impact", desc: "Homeownership for millions who can afford rent but not a down payment." },
];

const HOW_STEPS = [
  { icon: "🤝", title: "Agree on Terms", desc: "Final price, monthly rent, equity portion (e.g. 40%), and timeframe (e.g. 5 years)." },
  { icon: "📝", title: "Kemedar Sets Up Contract", desc: "Digital contract, payment tracking, and equity accumulation — all managed." },
  { icon: "💳", title: "Monthly Payments", desc: "Rent collected automatically. Portion tracked as equity. Dashboard updated live." },
  { icon: "🏠", title: "Final Sale Completes", desc: "When term ends, final payment and title transfer via Kemedar Escrow™." },
];

const WHY = [
  "Opens homeownership to millions excluded by down payment requirements",
  "Creates 3–5 year locked-in relationships — highest retention on the platform",
  "Kemedar earns setup fees, monthly management fees, and final sale commission",
  "Enormous social impact story that attracts government & media attention",
];

const STATS = [
  { val: "40%", label: "Equity portion", sub: "of monthly rent" },
  { val: "3-5yr", label: "Typical term", sub: "to full ownership" },
  { val: "0", label: "Down payment", sub: "needed to start" },
];

export default function Rent2OwnLandingMobile() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/home"); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🔑 Rent-to-Own</p>
        <div className="w-9" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-8 pb-10 text-white text-center"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)" }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/30 mb-4">
            🔑 PATH TO HOMEOWNERSHIP
          </div>
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-3xl font-black mb-2 leading-tight">
            Rent Today.<br />
            <span className="text-emerald-400">Own Tomorrow.</span>
          </h1>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Can't afford a down payment? Start renting, build equity every month, and own your home in 3–5 years.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {STATS.map(s => (
              <div key={s.label} className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xl font-black text-emerald-400">{s.val}</p>
                <p className="text-[10px] text-gray-300 font-bold">{s.label}</p>
                <p className="text-[8px] text-gray-500">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigate("/m/kemedar/rent2own/browse")}
              className="flex-1 font-black text-sm py-3 rounded-xl"
              style={{ background: "#10B981", color: "white" }}>
              🏠 Browse Listings
            </button>
            <button onClick={() => navigate("/m/kemedar/rent2own/how-it-works")}
              className="flex-1 font-bold text-sm py-3 rounded-xl border-2"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
              📖 How It Works
            </button>
          </div>
        </div>

        {/* How it works strip */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <p className="font-black text-gray-900 text-sm mb-3 text-center">How Rent-to-Own Works</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="flex-shrink-0 text-center" style={{ width: 90 }}>
                <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-lg font-black text-white"
                  style={{ background: "#10B981" }}>{i + 1}</div>
                <p className="text-[10px] font-black text-gray-900 leading-tight">{s.title}</p>
                <p className="text-[8px] text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Equity visualization */}
        <div className="px-4 py-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="font-black text-gray-900 text-sm mb-3">📈 Your Equity Grows Every Month</p>
            <div className="bg-gray-100 rounded-xl p-4 text-center mb-3">
              <p className="text-[10px] text-gray-500 mb-1">After 3 years of 8,000 EGP/month</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #10B981, #059669)" }} />
                </div>
                <span className="text-sm font-black text-emerald-600">60%</span>
              </div>
              <p className="text-xs text-gray-600">
                <span className="font-black text-emerald-600">172,800 EGP</span> equity built · <span className="font-bold">115,200 EGP</span> remaining
              </p>
            </div>
            <p className="text-[10px] text-gray-400 text-center">*Example based on 40% equity allocation</p>
          </div>
        </div>

        {/* Features */}
        <div className="px-4 pb-5">
          <h2 className="font-black text-gray-900 text-sm mb-3 text-center">What You Get</h2>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3">
                <p className="text-2xl mb-1">{f.icon}</p>
                <p className="font-black text-gray-900 text-[10px] mb-0.5">{f.title}</p>
                <p className="text-[9px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For Buyers vs Sellers */}
        <div className="px-4 pb-5 space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="font-black text-emerald-800 text-sm mb-2">🏠 For Buyers</p>
            <ul className="space-y-1.5">
              {["No down payment required — start with monthly rent", "Build equity automatically every month", "Lock in today's price, own in 3-5 years", "Full transparency via equity dashboard"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="font-black text-blue-800 text-sm mb-2">💰 For Sellers</p>
            <ul className="space-y-1.5">
              {["Immediate rental income from day one", "Premium price locked in at agreement", "Guaranteed buyer at end of term", "Kemedar manages everything"].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                  <span className="text-blue-500 flex-shrink-0 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why brilliant */}
        <div className="mx-4 mb-5 rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #0F172A, #1E3A5F)" }}>
          <p className="font-black text-base mb-3">💡 Why This Changes Everything</p>
          <ul className="space-y-2">
            {WHY.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">✦</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
          <p className="font-black text-white text-lg mb-1">Start Your Journey</p>
          <p className="text-emerald-100 text-xs mb-4">Browse available rent-to-own properties near you</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate("/m/kemedar/rent2own/browse")}
              className="font-black text-sm px-6 py-2.5 rounded-xl bg-white text-emerald-700">
              🏠 Browse Listings
            </button>
            <button onClick={() => navigate("/m/kemedar/rent2own/list")}
              className="font-bold text-sm px-5 py-2.5 rounded-xl border-2 border-white/40 text-white">
              + List Property
            </button>
          </div>
        </div>

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}