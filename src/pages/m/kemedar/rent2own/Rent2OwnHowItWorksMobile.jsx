import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STEPS = [
  { num: "01", icon: "🏠", title: "Find a Property", desc: "Browse rent-to-own listings near you. Each listing shows the monthly payment, equity portion, and full purchase price.", color: "#10B981" },
  { num: "02", icon: "📋", title: "Apply", desc: "Submit your application with income details. Kemedar AI assesses affordability and risk. Franchise Owner reviews in person.", color: "#3B82F6" },
  { num: "03", icon: "🤝", title: "Agree on Terms", desc: "Final price, monthly rent, equity allocation (e.g. 40%), and timeframe (e.g. 5 years) — all formalized in a Kemedar contract.", color: "#8B5CF6" },
  { num: "04", icon: "💳", title: "Monthly Payments", desc: "Rent collected automatically each month. A portion is tracked as equity toward your purchase. Dashboard shows progress in real-time.", color: "#F59E0B" },
  { num: "05", icon: "📈", title: "Watch Your Equity Grow", desc: "Every month brings you closer to ownership. Track your progress, see remaining balance, and celebrate milestones.", color: "#EC4899" },
  { num: "06", icon: "🏠", title: "Complete the Purchase", desc: "When the term ends (or you exercise early), final payment executes via Kemedar Escrow™. Title transfers to you.", color: "#10B981" },
];

const FAQ = [
  { q: "What if I can't continue payments?", a: "You can exit after the minimum commitment period (usually 12 months). You receive accumulated equity minus an exit fee (typically 2%)." },
  { q: "Can I buy earlier than the term?", a: "Yes! You can exercise the purchase option at any time after the minimum commitment period." },
  { q: "What happens to my equity if the market drops?", a: "Your purchase price is locked at agreement. You keep all accumulated equity regardless of market conditions." },
  { q: "Is this Sharia-compliant?", a: "We offer Ijara-compatible structures for Sharia compliance. Look for the ☪ Ijara badge on listings." },
  { q: "Who manages the property?", a: "The seller remains the owner until final purchase. Kemedar coordinates inspections and manages the contract." },
];

export default function Rent2OwnHowItWorksMobile() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#0F172A", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">📖 How Rent-to-Own Works</p>
        <div className="w-9" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-6 pb-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)" }}>
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-black mb-2">Your Path to<br /><span className="text-emerald-400">Homeownership</span></h1>
          <p className="text-gray-300 text-sm">A step-by-step guide to owning your dream home through rent-to-own.</p>
        </div>

        {/* Steps */}
        <div className="px-4 py-5 space-y-3">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black text-white flex-shrink-0"
                  style={{ background: s.color }}>{s.num}</div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{s.icon} {s.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual example */}
        <div className="px-4 pb-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="font-black text-emerald-800 text-sm mb-3">📊 Example Calculation</p>
            <div className="space-y-1.5 text-xs">
              {[
                ["Property Value", "2,000,000 EGP"],
                ["Monthly Payment", "8,000 EGP"],
                ["Rent Portion (60%)", "4,800 EGP"],
                ["Equity Portion (40%)", "3,200 EGP"],
                ["Term", "5 years (60 months)"],
                ["Total Equity Built", "192,000 EGP"],
                ["Remaining at Purchase", "1,808,000 EGP"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-emerald-700">{label}</span>
                  <span className="font-bold text-emerald-900">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-4 pb-5">
          <h2 className="font-black text-gray-900 text-base mb-3">❓ Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-white rounded-2xl border border-gray-100 p-3 group">
                <summary className="font-bold text-gray-900 text-xs cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-center text-white"
          style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
          <p className="font-black text-lg mb-1">Ready to Start?</p>
          <p className="text-emerald-100 text-xs mb-4">Browse available rent-to-own listings near you</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate("/m/kemedar/rent2own/browse")}
              className="font-black text-sm px-6 py-2.5 rounded-xl bg-white text-emerald-700">
              🏠 Browse Listings
            </button>
            <button onClick={() => navigate("/m/kemedar/rent2own/my-contracts")}
              className="font-bold text-sm px-5 py-2.5 rounded-xl border-2 border-white/40 text-white">
              📋 My Contracts
            </button>
          </div>
        </div>

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}