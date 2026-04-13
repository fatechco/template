import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FLOWS = [
  { id: "kemework", icon: "🔧", title: "Kemework Leads", metric: "3.2×", metricSub: "more tasks", color: "#10B981",
    steps: ["Resident posts 'need a plumber'", "AI detects service request", "'Find on Kemework' prompt shown", "Task posted with context", "Accredited pro hired"] },
  { id: "kemetro", icon: "🛒", title: "Group Buys", metric: "35%", metricSub: "savings", color: "#3B82F6",
    steps: ["Multiple neighbors need same material", "AI detects demand pattern", "Flash™ group buy suggested", "Neighbors join together", "Bulk order at wholesale price"] },
  { id: "predict", icon: "📈", title: "Price Intel", metric: "2.1×", metricSub: "accuracy", color: "#8B5CF6",
    steps: ["Residents discuss prices", "AI extracts price mentions", "Feeds Kemedar Predict™", "Better market forecasts"] },
  { id: "match", icon: "💘", title: "Match Boost", metric: "4×", metricSub: "conversion", color: "#EC4899",
    steps: ["Neighbor lists property", "Community post reaches residents", "Interested neighbor taps", "Match™ session created"] },
  { id: "fo", icon: "🗺️", title: "FO Revenue", metric: "6", metricSub: "streams", color: "#F59E0B",
    steps: ["FO manages communities", "Verifies members (trust)", "Coordinates group buys (fee)", "Manages alerts (service)", "Identifies Kemework leads"] },
];

const STATS = [
  { icon: "🔧", val: "2,400+", sub: "Kemework leads/mo" },
  { icon: "🛒", val: "35%", sub: "Group buy savings" },
  { icon: "📈", val: "18K+", sub: "Price data points" },
  { icon: "💘", val: "4×", sub: "Match conversion" },
];

export default function CommunityHowItWorksMobile() {
  const navigate = useNavigate();
  const [activeFlow, setActiveFlow] = useState("kemework");
  const flow = FLOWS.find(f => f.id === activeFlow);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d1a)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🧠 How Community Works</p>
        <div className="w-9" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-6 pb-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d1a)" }}>
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-[10px] font-black px-3 py-1 rounded-full border border-orange-500/30 mb-3">
            🧠 AI-Powered Intelligence
          </div>
          <h1 className="text-2xl font-black mb-2 leading-tight">
            Community™ Drives<br /><span className="text-orange-400">Every Module</span>
          </h1>
          <p className="text-gray-400 text-xs mb-5">
            Every post is a data point. Every interaction feeds a module. Every module grows the community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {STATS.map(s => (
              <div key={s.sub} className="rounded-xl py-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-lg">{s.icon}</p>
                <p className="text-sm font-black text-orange-400">{s.val}</p>
                <p className="text-[8px] text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flywheel */}
        <div className="px-4 py-5">
          <h2 className="font-black text-gray-900 text-base text-center mb-4">The Community Flywheel</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
            {[
              { icon: "💬", label: "Post", sub: "Resident shares a need" },
              { icon: "🧠", label: "AI Engine", sub: "Detects intent" },
              { icon: "⚡", label: "Module Trigger", sub: "Action activated" },
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-xl border border-orange-100 p-3 text-center" style={{ width: 110 }}>
                <p className="text-2xl mb-1">{item.icon}</p>
                <p className="font-black text-gray-900 text-[10px]">{item.label}</p>
                <p className="text-[8px] text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { icon: "🔧", label: "Kemework", c: "bg-emerald-100 text-emerald-700" },
              { icon: "🛒", label: "Group Buy", c: "bg-blue-100 text-blue-700" },
              { icon: "📈", label: "Price Intel", c: "bg-purple-100 text-purple-700" },
              { icon: "💘", label: "Match", c: "bg-pink-100 text-pink-700" },
              { icon: "🗺️", label: "FO Revenue", c: "bg-orange-100 text-orange-700" },
            ].map(chip => (
              <span key={chip.label} className={`text-[9px] font-black px-2 py-0.5 rounded-full ${chip.c}`}>
                {chip.icon} {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Flow tabs */}
        <div className="px-4 pb-5">
          <h2 className="font-black text-gray-900 text-base text-center mb-3">How Each Flow Works</h2>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
            {FLOWS.map(f => (
              <button key={f.id} onClick={() => setActiveFlow(f.id)}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: activeFlow === f.id ? f.color : "#f3f4f6", color: activeFlow === f.id ? "#fff" : "#6b7280" }}>
                {f.icon} {f.title}
              </button>
            ))}
          </div>

          {flow && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{flow.icon}</span>
                <div>
                  <p className="font-black text-gray-900 text-sm">{flow.title}</p>
                  <p className="text-xs">
                    <span className="font-black" style={{ color: flow.color }}>{flow.metric}</span>
                    <span className="text-gray-400 ml-1">{flow.metricSub}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-0">
                {flow.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                        style={{ background: i === flow.steps.length - 1 ? "#10B981" : "#d1d5db" }}>
                        {i === flow.steps.length - 1 ? "✓" : i + 1}
                      </div>
                      {i < flow.steps.length - 1 && <div className="w-0.5 h-4 bg-gray-200" />}
                    </div>
                    <p className="text-xs text-gray-700 pt-1">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-white text-center"
          style={{ background: "linear-gradient(135deg, #EA580C, #F59E0B)" }}>
          <p className="font-black text-base mb-1">Ready to join?</p>
          <p className="text-orange-100 text-xs mb-3">Find your compound, building, or neighborhood.</p>
          <div className="flex gap-2 justify-center">
            <Link to="/m/kemedar/community" className="font-black text-sm px-5 py-2.5 rounded-xl bg-white text-orange-600">
              🏘 Browse
            </Link>
            <Link to="/m/kemedar/community/create" className="font-bold text-sm px-5 py-2.5 rounded-xl border border-white/30 text-white">
              + Create
            </Link>
          </div>
        </div>

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}