import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function BuildBOQLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">🏗️</div>
          <h1 className="text-3xl font-black mb-2">Kemetro Build™ BOQ</h1>
          <p className="text-blue-100 text-sm mb-6">AI-powered Bill of Quantities. Get accurate material lists and pricing for your project instantly.</p>
          <button onClick={() => navigate("/kemetro/build")}
            className="inline-block bg-white text-blue-600 font-black px-8 py-3.5 rounded-2xl text-base">
            📋 Start Your BOQ
          </button>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-lg mb-3">What You Get</h2>
          <div className="space-y-3">
            {[
              { icon: "🤖", title: "AI Calculation", desc: "Automatic material quantity calculation" },
              { icon: "💰", title: "Live Pricing", desc: "Current market prices from verified sellers" },
              { icon: "📊", title: "Instant BOQ", desc: "Complete material list in seconds" },
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

        <button onClick={() => navigate("/kemetro/build")}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#16A34A" }}>
          🏗️ Create Your BOQ
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}