import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const HOW_IT_WORKS = [
  { step: 1, icon: "🤖", title: "AI Design + BOQ", desc: "Describe your vision, AI generates a complete Bill of Quantities with pricing in minutes." },
  { step: 2, icon: "🛒", title: "Materials from Kemetro", desc: "Order all materials directly from verified Kemetro sellers, delivered on schedule." },
  { step: 3, icon: "👷", title: "Professionals from Kemework", desc: "AI matches and sequences accredited professionals per phase automatically." },
  { step: 4, icon: "🗺️", title: "FO Quality Control", desc: "Your local Franchise Owner inspects each phase before any payment releases." },
  { step: 5, icon: "🏠", title: "You Approve & Move In", desc: "Snagging list auto-generated, issues resolved, keys handed over." },
];

const FEATURES = [
  { icon: "🤖", title: "AI-Generated BOQ", desc: "Describe your space and style. ThinkDar™ generates a full Bill of Quantities with market-accurate pricing in under 2 minutes." },
  { icon: "🛒", title: "Materials Auto-Ordered", desc: "Every material in your BOQ is sourced from verified Kemetro sellers. Delivered phase by phase — no waste, no delays." },
  { icon: "👷", title: "Professionals Sequenced", desc: "Kemework professionals are booked in the right order. Electrician before tiler. Plumber before painter. Perfectly coordinated." },
  { icon: "🔒", title: "Escrow-Protected Payments", desc: "Funds held in Kemedar Escrow™. Released only when FO confirms each phase is complete. Zero risk of contractor fraud." },
  { icon: "📸", title: "Daily Progress Photos", desc: "Contractors submit daily photo updates. AI reviews for quality. You see your project advance in real time." },
  { icon: "✅", title: "AI Snagging List", desc: "At handover, AI scans all progress photos and flags outstanding issues before you sign off. No nasty surprises." },
];

const PROBLEMS_SOLVED = [
  "No coordination between trades",
  "Materials delivered at wrong time",
  "No progress visibility",
  "Budget overruns and surprises",
  "Disputes with contractors",
  "No accountability or snagging",
];

const WHY_BRILLIANT = [
  "First fully AI-coordinated finishing platform in Egypt — nothing else exists like this.",
  "Locks in buyers of raw units who can't move in without finishing — massive captive market.",
  "FO earns commission on every Finish project in their area — creates referral incentive.",
  "Ties together all three modules: Kemedar + Kemetro + Kemework in one seamless project.",
];

export default function FinishLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-900 via-amber-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <span className="inline-block bg-orange-100/20 border border-orange-400/30 text-orange-300 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            🏗️ Finishing · AI Coordinated
          </span>
          <div className="text-5xl mb-3">🏗️</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-orange-200">Kemedar Finish™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            End-to-End Home Finishing, Beautifully Managed. AI designs your space, orders materials, coordinates professionals, and supervises every phase.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Free to start · AI BOQ in minutes · No commitment
          </p>
          <Link to="/m/kemedar/finish/new"
            className="inline-block bg-orange-500 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            🏗️ Start My Project
          </Link>
          <p className="mt-4 text-xs text-gray-500">500+ projects · AI-powered · FO supervised</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-2">How It Works</h2>
        <p className="text-center text-gray-500 text-sm mb-5">5 phases, fully managed, zero stress</p>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0 text-sm">
                {item.step}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <h3 className="font-black text-gray-900 text-sm">{item.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">Everything Handled For You</h2>
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

      {/* Problems Solved */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-6 text-white">
          <h2 className="text-base font-black mb-4">✅ Problems We Solve</h2>
          <ul className="space-y-2.5">
            {PROBLEMS_SOLVED.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-orange-200 font-black flex-shrink-0">✓</span>
                <span className="text-orange-100">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Module Connection */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">Powered by All 3 Modules</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🏠", name: "Kemedar", desc: "Property & FO network" },
            { icon: "🛒", name: "Kemetro", desc: "Materials marketplace" },
            { icon: "👷", name: "Kemework", desc: "Professionals platform" },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 text-center shadow-sm">
              <div className="text-2xl mb-1">{m.icon}</div>
              <p className="font-black text-gray-900 text-xs">{m.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{m.desc}</p>
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
                <span className="text-orange-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Ready to finish your home?</h2>
        <p className="text-gray-500 text-sm mb-5">AI BOQ ready in minutes. No commitment to start.</p>
        <Link to="/m/kemedar/finish/new"
          className="inline-block bg-orange-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          🏗️ Start My Project
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  );
}