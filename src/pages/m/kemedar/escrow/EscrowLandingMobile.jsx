import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "🔒", title: "Secure Fund Holding", desc: "Buyer deposits earnest money (5-10%) — held securely by Kemedar while the deal completes." },
  { icon: "✅", title: "Milestone-Based Release", desc: "Funds release only when contract signed, title checked, inspection done, and notarization complete." },
  { icon: "🤝", title: "Both-Party Confirmation", desc: "Buyer confirms property received. Seller confirms payment. Both must confirm for release." },
  { icon: "⚖️", title: "AI Dispute Resolution", desc: "If deal falls through, AI evaluates fault and manages automatic partial/full refund." },
  { icon: "🗺️", title: "Franchise Owner Guarantee", desc: "FO acts as trusted local guardian and earns commission on each transaction in their area." },
  { icon: "📋", title: "Full Digital Paper Trail", desc: "Every step documented. No cash deals, no fraud risk, full legal protection." },
];

const HOW_IT_WORKS = [
  { title: "Buyer deposits earnest money", desc: "Via XeedWallet or bank transfer — funds held securely by Kemedar." },
  { title: "Kemedar holds while deal completes", desc: "Contract signed digitally. Legal title checked. Property inspected. Notarization complete." },
  { title: "Both parties confirm", desc: "Buyer: 'I confirm property received.' Seller: 'I confirm payment received.'" },
  { title: "Funds released instantly", desc: "Secure, documented, and legally clean. Franchise Owner witnesses the process." },
];

const WHY_BRILLIANT = [
  "Solves the #1 trust problem in MENA real estate — cash deals with no paper trail.",
  "Kemedar becomes financial infrastructure, not just a listing site.",
  "Regulatory moat — hard to replicate once established.",
  "Creates transaction fee revenue on top of subscriptions.",
];

export default function EscrowLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <span className="inline-block bg-blue-100/20 border border-blue-400/30 text-blue-300 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            🏦 Trust Layer · Phase 3
          </span>
          <div className="text-5xl mb-3">🏦</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-blue-200">Kemedar Escrow™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            Trusted Digital Transaction Layer. The biggest pain in Arab real estate: TRUST between buyer and seller.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Kemedar becomes financial infrastructure, not just listings.
          </p>
          <Link to="/m/kemedar/escrow/new"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            🔒 Start Secure Transaction
          </Link>
          <p className="mt-4 text-xs text-gray-500">Phase 3 — Live</p>
        </div>
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

      {/* 5 Milestones Visual */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">5-Step Deal Protection</h2>
        <div className="flex items-center justify-between mb-4">
          {["💰", "📝", "⚖️", "💵", "🔑"].map((icon, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${i === 0 ? "bg-blue-500 text-white" : "bg-white border-2 border-gray-200"}`}>
                {icon}
              </div>
              {i < 4 && <div className="flex-1 h-0.5 bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1">
          {["Earnest", "Contract", "Legal", "Balance", "Handover"].map(l => (
            <span key={l} className="text-[9px] text-gray-400 text-center" style={{ width: 44 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">How It Works</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center flex-shrink-0 text-base">
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

      {/* Why Brilliant */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-[#0d1b3e] to-slate-800 rounded-3xl p-6 text-white">
          <h2 className="text-base font-black mb-4">💡 Why This Changes Everything</h2>
          <ul className="space-y-3">
            {WHY_BRILLIANT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Ready to transact safely?</h2>
        <p className="text-gray-500 text-sm mb-5">Start a secure escrow deal in minutes</p>
        <Link to="/m/kemedar/escrow/new"
          className="inline-block bg-blue-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          🔒 Start Secure Transaction
        </Link>
        <div className="mt-4">
          <Link to="/m/kemedar/escrow/wallet" className="text-sm text-blue-500 font-bold">View My Escrow Wallet →</Link>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}