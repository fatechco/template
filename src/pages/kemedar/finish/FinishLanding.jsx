import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Shield, Zap, Users, Package } from "lucide-react";
import FinishModuleConnectionBanner from "@/components/finish/FinishModuleConnectionBanner";

const HOW_IT_WORKS = [
  { step: 1, icon: "🤖", title: "AI Design + BOQ", desc: "Describe your vision, AI generates a complete Bill of Quantities with pricing" },
  { step: 2, icon: "🛒", title: "Materials from Kemetro", desc: "Order all materials directly from verified Kemetro sellers, delivered on schedule" },
  { step: 3, icon: "👷", title: "Professionals from Kemework", desc: "AI matches and sequences accredited professionals per phase" },
  { step: 4, icon: "🗺️", title: "FO Quality Control", desc: "Your local Franchise Owner inspects each phase before payment releases" },
  { step: 5, icon: "🏠", title: "You Approve & Move In", desc: "Snagging list auto-generated, issues resolved, keys handed over" },
];

const STATS = [
  { val: "500+", label: "Projects" },
  { val: "3", label: "Modules" },
  { val: "AI", label: "Powered" },
  { val: "FO", label: "Supervised" },
  { val: "🔒", label: "Escrow" },
];

const WHY = [
  { icon: CheckCircle, text: "AI generates complete design + BOQ" },
  { icon: Package, text: "Materials auto-ordered from Kemetro" },
  { icon: Users, text: "Professionals sequenced from Kemework" },
  { icon: Shield, text: "Milestone payments via Escrow™" },
  { icon: Zap, text: "Daily progress photos required" },
  { icon: CheckCircle, text: "AI quality checks each phase" },
];

export default function FinishLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gray-900 text-white overflow-hidden" style={{ minHeight: 320 }}>
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-orange-900 via-gray-900 to-gray-900" />
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80"
          alt="Construction"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-orange-400 font-bold text-sm mb-2 tracking-widest uppercase">Kemedar</p>
          <h1 className="text-5xl font-black mb-3">🏗️ Kemedar Finish™</h1>
          <p className="text-xl text-gray-300 mb-8">End-to-End Home Finishing, Beautifully Managed</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-10 flex-wrap">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-orange-400">{s.val}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <Link to="/kemedar/finish/new" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
            🏗️ Start My Project <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">How It Works</h2>
        <p className="text-gray-500 text-center mb-10">5 phases, fully managed, zero stress</p>

        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-gray-300 text-xl">›</div>
              )}
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs font-black flex items-center justify-center mx-auto mb-2">{item.step}</div>
              <h3 className="font-black text-gray-900 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Finish */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Why Kemedar Finish™?</h2>
            <p className="text-gray-500 mb-6">Coordinating a renovation is chaotic. Materials arrive at wrong times, professionals don't communicate, and budget overruns are common. Kemedar Finish™ solves all of it.</p>
            <div className="space-y-3">
              {WHY.map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <w.icon size={12} className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-700">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-8 text-white">
            <h3 className="font-black text-xl mb-4">Problems We Solve</h3>
            {["No coordination between trades", "Materials delivered at wrong time", "No progress visibility", "Budget overruns and surprises", "Disputes with contractors", "No accountability"].map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <span className="text-orange-200 font-black text-sm">✓</span>
                <p className="text-orange-100 text-sm">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Module connections */}
        <div className="mt-12 mb-12">
          <FinishModuleConnectionBanner />
        </div>

        <div className="text-center">
          <Link to="/kemedar/finish/new" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
            🚀 Start Your Finish Project <ArrowRight size={20} />
          </Link>
          <p className="text-gray-400 text-sm mt-3">Free to start • AI BOQ in minutes • No commitment</p>
        </div>
      </div>
    </div>
  );
}