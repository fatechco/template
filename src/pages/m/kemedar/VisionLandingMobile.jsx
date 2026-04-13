import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "📸", title: "Photo Quality Scoring", desc: "AI scores every photo 0–100. 'This photo is too dark — retake for 40% more views.'" },
  { icon: "🏠", title: "Finishing Quality Detection", desc: "Automatically detects high-end marble, premium cabinets, and suggests price adjustments." },
  { icon: "🏷️", title: "Auto Room Labeling", desc: "Master Bedroom | Living Room | Kitchen — detected automatically, no manual input." },
  { icon: "⚠️", title: "Issue Detection & Flags", desc: "Water stain detected? Clutter reducing buyer interest? AI flags it for transparency." },
  { icon: "🛋️", title: "Virtual Staging", desc: "Empty room? One-click AI generates a furnished version that looks 58% more attractive." },
  { icon: "✅", title: "Seller Score Boost", desc: "High Vision score improves listing ranking and buyer confidence automatically." },
];

const HOW_IT_WORKS = [
  { title: "Seller uploads photos", desc: "Standard photo upload — no special equipment needed." },
  { title: "AI analyzes every image", desc: "Quality, finishing, room type, issues, and staging potential all detected in seconds." },
  { title: "Report is generated", desc: "Seller sees a full Vision Report with actionable suggestions to improve their listing." },
  { title: "Buyer sees transparency badge", desc: "Property shows AI-analyzed badge giving buyers confidence and reducing disputes." },
];

const WHY_BRILLIANT = [
  "Protects buyers through radical transparency.",
  "Helps sellers command better prices with better listings.",
  "Franchise Owners use it for on-site verification quality control.",
  "Virtual staging drives massive engagement with zero effort from sellers.",
];

export default function VisionLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cyan-900 via-teal-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <span className="inline-block bg-cyan-100/20 border border-cyan-400/30 text-cyan-300 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            👁 AI · Phase 1
          </span>
          <div className="text-5xl mb-3">👁️</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-cyan-200">Kemedar Vision™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            AI Property Photo Analyzer. Every photo automatically scored, analyzed, and enhanced.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Protects buyers. Helps sellers get better prices. Reduces disputes.
          </p>
          <Link to="/cp/user/valuations"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            ✨ Try Vision Report
          </Link>
          <p className="mt-4 text-xs text-gray-500">Phase 1 — Live</p>
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

      {/* Virtual Staging Preview */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-2">Virtual Staging</h2>
        <p className="text-gray-500 text-sm text-center mb-5">Before → After · AI transforms empty rooms instantly</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&q=70" alt="Empty room" className="w-full h-36 object-cover" />
            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">Before</span>
          </div>
          <div className="rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=70" alt="Staged room" className="w-full h-36 object-cover" />
            <span className="absolute bottom-2 left-2 bg-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">After ✨</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">58% more buyer interest with AI staging</p>
      </div>

      {/* How It Works */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">How It Works</h2>
        <div className="space-y-3">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white font-black flex items-center justify-center flex-shrink-0 text-base">
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
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-6 text-white">
          <h2 className="text-base font-black mb-4">💡 Why This Changes Everything</h2>
          <ul className="space-y-3">
            {WHY_BRILLIANT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-cyan-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Ready to get started?</h2>
        <p className="text-gray-500 text-sm mb-5">Analyze your property photos with AI</p>
        <Link to="/cp/user/valuations"
          className="inline-block bg-cyan-500 text-white font-black px-10 py-4 rounded-2xl text-base">
          ✨ Try Vision Report
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  );
}