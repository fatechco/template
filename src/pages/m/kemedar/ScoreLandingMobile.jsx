import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "🏡", title: "Seller Score", desc: "+Points for verified data, quality photos, fast responses, completed sales. -Points for disputes and ghost listings." },
  { icon: "🏠", title: "Buyer Score", desc: "+Points for identity verification, completed viewings, Kemedar transactions. -Points for no-shows and disputes." },
  { icon: "👷", title: "Professional Score", desc: "+Points for on-time delivery, 5-star reviews, accreditation. -Points for disputes and abandoned jobs." },
  { icon: "📈", title: "Score Affects Rankings", desc: "Higher score = higher search ranking, premium feature access, and Kemedar Escrow limits." },
  { icon: "🏦", title: "Bank Loan Applications", desc: "Your Kemedar Score is exportable — banks can use it as a track record for loan applications." },
  { icon: "🎯", title: "Franchise Owner Alerts", desc: "FO alerted when a lead's score hits 70% readiness — pre-qualified warm leads delivered automatically." },
];

const HOW_IT_WORKS = [
  { title: "Every action earns or costs points", desc: "Listing accurately, responding fast, completing transactions — all contribute to your score." },
  { title: "Score is visible on all profiles", desc: "Buyers, sellers, and professionals all see each other's scores before engaging." },
  { title: "Required for premium features", desc: "Kemedar Escrow, premium listings, and accreditation all require minimum score thresholds." },
  { title: "Exportable for external use", desc: "Share your score with banks or partners as a verified reputation credential." },
];

const WHY_BRILLIANT = [
  "Creates a reputation economy — users protect their score and stay on the platform forever.",
  "Incredibly sticky — once you've built your score, you'll never leave Kemedar.",
  "Self-regulating platform that improves quality without manual moderation.",
  "First Arab real estate platform to create an exportable reputation credential.",
];

export default function ScoreLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            ⭐ Reputation · Phase 4
          </span>
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-amber-300">Kemedar Score™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            Universal Real Estate Credit Score. Your reputation on the platform — built by every action you take.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Self-regulating platform. Good actors rewarded. Bad actors penalized.
          </p>
          <Link to="/cp/user/score"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            ⭐ View My Score
          </Link>
          <p className="mt-4 text-xs text-gray-500">Implementation: Phase 4 — Live</p>
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

      {/* How It Works */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">How It Works</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center flex-shrink-0 text-base">
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
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-6 text-white">
          <h2 className="text-base font-black mb-4">💡 Why This Changes Everything</h2>
          <ul className="space-y-3">
            {WHY_BRILLIANT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Ready to get started?</h2>
        <p className="text-gray-500 text-sm mb-5">Join thousands of users on the Kemedar platform</p>
        <Link to="/cp/user/score"
          className="inline-block bg-amber-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          ⭐ View My Score
        </Link>
      </div>
      <MobileBottomNav />
    </div>
  );
}