import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const FEATURES = [
  { icon: "📸", title: "AI Photo Stitching", desc: "Upload 15-20 photos — AI auto-generates a 360° virtual tour. No special equipment." },
  { icon: "📐", title: "AI Floor Plan", desc: "Accurate floor plan extracted from photos with AI-estimated measurements." },
  { icon: "🎯", title: "Interactive Hotspots", desc: "Clickable room hotspots with details, specs, and finishing notes." },
  { icon: "📺", title: "Live Tour Streaming", desc: "Seller walks with phone, buyer watches live with 3D overlay." },
  { icon: "🔍", title: "Remote Verification", desc: "Franchise Owners verify properties remotely — no physical visit needed." },
  { icon: "✈️", title: "Expat-Ready", desc: "Diaspora investors can view & decide on Egyptian properties from abroad." },
];

const HOW_STEPS = [
  { icon: "📷", title: "Upload or Record", desc: "AI guides: 'Now take from this corner, now from here' — ensuring complete coverage." },
  { icon: "✨", title: "AI Processes", desc: "360° tour, floor plan, measurements, and hotspots generated automatically." },
  { icon: "🌍", title: "Buyers Explore", desc: "Full property experience from any device, anywhere in the world." },
  { icon: "📡", title: "Live Sessions", desc: "Seller and buyer connect in real-time for an interactive walkthrough." },
];

const WHY = [
  "Particularly valuable for expat buyers and diaspora investing from abroad",
  "Reduces wasted viewings dramatically — buyers arrive pre-qualified",
  "Franchise Owners gain a scalable remote verification tool",
  "First Arab platform to offer AI-generated property twins at scale",
];

export default function TwinLandingMobile() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg, #4C1D95, #1E3A5F)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/home"); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🏠 Kemedar Twin™</p>
        <div className="w-9" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-8 pb-10 text-white text-center"
          style={{ background: "linear-gradient(135deg, #4C1D95 0%, #1E3A5F 50%, #0F172A 100%)" }}>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-[10px] font-black px-3 py-1 rounded-full border border-purple-500/30 mb-4">
            🏠 VIRTUAL PROPERTY TWIN
          </div>
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-3xl font-black mb-2 leading-tight">
            Kemedar Twin™
          </h1>
          <p className="text-purple-200 text-sm mb-2">
            Every property gets a 3D digital twin you can explore from anywhere.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Solves the #1 problem: long distances to view properties.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "📸", val: "AI", label: "Generated" },
              { icon: "🌍", val: "Remote", label: "Viewing" },
              { icon: "📡", val: "Live", label: "Tours" },
            ].map(s => (
              <div key={s.label} className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-lg">{s.icon}</p>
                <p className="text-sm font-black text-purple-300">{s.val}</p>
                <p className="text-[9px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigate("/m/kemedar/twin/new")}
              className="flex-1 font-black text-sm py-3 rounded-xl text-white"
              style={{ background: "#7C3AED" }}>
              ✨ Create Tour
            </button>
            <button onClick={() => navigate("/m/kemedar/twin/dashboard")}
              className="flex-1 font-bold text-sm py-3 rounded-xl border-2"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
              📊 My Tours
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="px-4 py-5">
          <h2 className="font-black text-gray-900 text-base text-center mb-4">How It Works</h2>
          <div className="space-y-3">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: "#7C3AED" }}>{i + 1}</div>
                <div>
                  <p className="font-black text-gray-900 text-xs">{s.icon} {s.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="px-4 pb-5">
          <h2 className="font-black text-gray-900 text-base text-center mb-4">What You Get</h2>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3">
                <p className="text-xl mb-1">{f.icon}</p>
                <p className="font-black text-gray-900 text-[10px] mb-0.5">{f.title}</p>
                <p className="text-[9px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why brilliant */}
        <div className="mx-4 mb-5 rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #4C1D95, #1E3A5F)" }}>
          <p className="font-black text-base mb-3">💡 Why This Changes Everything</p>
          <ul className="space-y-2">
            {WHY.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-purple-400 flex-shrink-0 mt-0.5">✦</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-center text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}>
          <p className="font-black text-lg mb-1">Create Your First Tour</p>
          <p className="text-purple-100 text-xs mb-4">Upload photos and get a shareable 3D tour in minutes</p>
          <button onClick={() => navigate("/m/kemedar/twin/new")}
            className="font-black text-sm px-8 py-3 rounded-xl bg-white text-purple-700">
            ✨ Start Now
          </button>
        </div>

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}