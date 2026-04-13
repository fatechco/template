import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "🏘️", title: "Neighborhood Intelligence", desc: "Knows which areas you keep searching — even if you don't explicitly say." },
  { icon: "💰", title: "Real Budget Detection", desc: "Your actual filter behavior reveals your true budget — not just the stated one." },
  { icon: "📸", title: "Photo Preference Learning", desc: "Garden? Modern kitchen? Views? DNA tracks what photos you linger on." },
  { icon: "⏰", title: "Timing Intelligence", desc: "Lunch search = casual. Midnight search = serious buyer. Notifications timed accordingly." },
  { icon: "🤖", title: "Adaptive Homepage", desc: "No apartment banners if you always look at villas. Every section adapts to your actual behavior." },
  { icon: "🎯", title: "Franchise Owner Warm Leads", desc: "FO alerted when DNA readiness score hits 70%: 'Lead warming up in your area →'" },
];

const HOW_IT_WORKS = [
  { title: "Every interaction is a signal", desc: "Searches, swipes, time spent, photos viewed, filters applied — all feed the DNA model." },
  { title: "AI builds your behavioral profile", desc: "After 30 days, Kemedar understands your real preferences better than you stated them." },
  { title: "Platform adapts to you", desc: "Homepage, search defaults, notifications, and Advisor pre-fills — all personalized." },
  { title: "Privacy always respected", desc: "You can view your DNA profile, control what's tracked, and delete your data anytime." },
];

const WHY_BRILLIANT = [
  "Creates a platform that users feel truly 'understands them' — ultimate retention driver.",
  "Competitors can't replicate the behavioral data moat without years of users.",
  "Franchise Owners receive pre-qualified, behavior-validated warm leads automatically.",
  "Personalization compounds over time — the longer you use it, the better it gets.",
];

export default function DNALandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <span className="inline-block bg-violet-100 text-violet-700 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            🧬 Personalization · Ongoing
          </span>
          <div className="text-5xl mb-3">🧬</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-violet-300">Kemedar DNA™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            Platform-Wide Personalization Engine. The entire platform learns and adapts to you — every single day.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            An AI platform that gets smarter with every visit. Competitors can't replicate the data moat.
          </p>
          <Link to="/cp/user/my-dna"
            className="inline-block bg-violet-500 hover:bg-violet-600 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            🧬 View My DNA Profile
          </Link>
          <p className="mt-4 text-xs text-gray-500">Implementation: Ongoing — Live</p>
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
              <div className="w-9 h-9 rounded-xl bg-violet-500 text-white font-black flex items-center justify-center flex-shrink-0 text-base">
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
                <span className="text-violet-400 mt-0.5 flex-shrink-0">✦</span>
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
        <Link to="/cp/user/my-dna"
          className="inline-block bg-violet-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          🧬 View My DNA Profile
        </Link>
      </div>
      <MobileBottomNav />
    </div>
  );
}