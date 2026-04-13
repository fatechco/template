import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FEATURES = [
  { icon: "📊", title: "Market Intelligence Briefing", desc: "Days on market, price reductions, comparable sales — AI analyzes it all before you make a move." },
  { icon: "💡", title: "AI Buyer Strategy", desc: "Recommended opening offer, expected counter, walk-away point, and your best argument — all AI-generated." },
  { icon: "✍️", title: "AI-Drafted Offer Messages", desc: "Professional offer message in Arabic or English, reviewed by you, sent in one click." },
  { icon: "🏷️", title: "Seller Coaching", desc: "When an offer arrives, AI advises the seller: 'Counter at X — this is standard for this market.'" },
  { icon: "🔄", title: "Live Deal Room", desc: "Both parties negotiate in a structured digital room with offer tracking and round history." },
  { icon: "🤖", title: "Private AI Coach", desc: "Your AI coach is visible only to you — real-time advice as the negotiation unfolds." },
];

const HOW_IT_WORKS = [
  { title: "Buyer initiates an offer on a property", desc: "Instead of just 'Contact Owner', a full AI briefing is generated first." },
  { title: "AI analyzes market position", desc: "Days listed, price drops, seasonal factors, owner type — all considered." },
  { title: "Strategy is presented privately", desc: "Buyer gets recommended offer, counter expectations, and walk-away point." },
  { title: "Offer drafted and sent", desc: "AI writes the message. You review. It's sent through the platform." },
  { title: "Seller coached on response", desc: "Seller gets AI advice too — the platform guides both sides to a fair deal." },
];

const WHY = [
  "Kemedar becomes the trusted intermediary even without a physical agent.",
  "Deals close faster and at fairer prices for both parties.",
  "Platform earns on every facilitated transaction.",
  "Arabic market is highly negotiation-driven — this is a natural fit.",
];

export default function NegotiateLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-teal-900 via-green-900 to-slate-900 text-white px-5 pt-12 pb-10">
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <span className="inline-block bg-teal-100 text-teal-700 text-[10px] font-black px-3 py-1 rounded-full mb-4">🤝 AI · Phase 2</span>
          <div className="text-5xl mb-3">🤝</div>
          <h1 className="text-2xl font-black text-teal-300 leading-tight mb-2">Kemedar Negotiate™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">AI Negotiation Coach for buyers and sellers. Stop guessing. Start winning.</p>
          <p className="text-xs text-gray-400 italic mb-6">Empowers both sides. Increases deal completion. Reduces emotional friction.</p>
          <Link to="/cp/user/negotiations"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-black px-8 py-3.5 rounded-2xl text-sm transition">
            🤝 Start Negotiating
          </Link>
          <p className="mt-4 text-[10px] text-gray-500">Implementation: Phase 2 — Live</p>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-8">
        <h2 className="text-lg font-black text-gray-900 text-center mb-5">What You Get</h2>
        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
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
        <h2 className="text-lg font-black text-gray-900 text-center mb-5">How It Works</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-teal-500 text-white font-black flex items-center justify-center flex-shrink-0 text-sm">
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

      {/* Why It Changes Everything */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-5 text-white">
          <h2 className="text-base font-black mb-4">💡 Why This Changes Everything</h2>
          <ul className="space-y-3">
            {WHY.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-teal-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-lg font-black text-gray-900 mb-2">Ready to get started?</h2>
        <p className="text-gray-500 text-sm mb-5">Join thousands of users on the Kemedar platform</p>
        <Link to="/cp/user/negotiations"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-black px-10 py-3.5 rounded-2xl text-sm transition">
          🤝 Start Negotiating
        </Link>
      </div>
    </div>
  );
}