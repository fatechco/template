import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function ESGImpactLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">🌱</div>
          <h1 className="text-3xl font-black mb-2">ESG Impact Tracker</h1>
          <p className="text-green-100 text-sm mb-6 leading-relaxed">
            Track the environmental and social impact of your construction and renovation purchases. Build greener, smarter.
          </p>
          <button onClick={() => navigate("/m/kemetro/surplus/esg/score")}
            className="inline-block bg-white text-green-700 font-black px-8 py-3.5 rounded-2xl text-base">
            🌍 View My ESG Score
          </button>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">

        {/* ESG metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🌍", value: "12.4t", label: "CO₂ Saved" },
            { icon: "♻️", value: "8,200", label: "Items Recycled" },
            { icon: "💚", value: "4,300", label: "Buyers Joined" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-black text-green-700 text-sm">{s.value}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">What We Track</h2>
          <div className="space-y-3">
            {[
              { icon: "🌿", title: "Carbon Footprint", desc: "CO₂ avoided by choosing surplus materials" },
              { icon: "💧", title: "Water Savings", desc: "Water saved by reusing and recycling materials" },
              { icon: "🏗️", title: "Waste Diverted", desc: "Kg of construction waste kept out of landfill" },
              { icon: "🌟", title: "ESG Score", desc: "Your personal sustainability badge and ranking" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-5 text-white">
          <h3 className="font-black text-base mb-3">💡 Why It Matters</h3>
          <ul className="space-y-2">
            {[
              "First ESG tracker built into a Middle East construction marketplace",
              "Share your score with clients and partners as a green credential",
              "Earn ESG badges that unlock premium placement on Kemetro",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-green-100">
                <span className="text-green-300 flex-shrink-0">✦</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => navigate("/m/kemetro/surplus/esg/score")}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#16A34A" }}>
          🌱 Track My ESG Impact
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}