import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function AIPriceMatchLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-black mb-2">AI Price Match</h1>
          <p className="text-cyan-100 text-sm mb-2 leading-relaxed">
            Never overpay again. Our AI scans thousands of listings to find you the best price in real time.
          </p>
          <p className="text-xs text-cyan-200 italic mb-6">Save up to 40% on your next purchase</p>
          <button onClick={() => navigate("/m/kemetro/ai-price-match/browse")}
            className="inline-block bg-white text-cyan-700 font-black px-8 py-3.5 rounded-2xl text-base">
            🤖 Find Best Prices
          </button>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-lg mb-3">How AI Price Match Works</h2>
          <div className="space-y-3">
            {[
              { icon: "🔍", title: "Scan All Sellers", desc: "AI compares prices across every Kemetro seller instantly" },
              { icon: "📊", title: "Market Analysis", desc: "Understand if a price is fair based on market trends" },
              { icon: "🏆", title: "Best Price Alert", desc: "Get notified when your item drops to your target price" },
              { icon: "💬", title: "Negotiate with AI", desc: "AI-assisted negotiation with sellers for better deals" },
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

        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 text-white">
          <h3 className="font-black text-base mb-3">💡 Why This Matters</h3>
          <ul className="space-y-2">
            {[
              "Price transparency you can't find anywhere else in Egypt",
              "Saves you hours of manual price comparison",
              "Works across furniture, tiles, paint, electronics, and more",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-cyan-100">
                <span className="text-cyan-300 flex-shrink-0">✦</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <button onClick={() => navigate("/m/kemetro/ai-price-match/browse")}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#0891B2" }}>
          🤖 Start Price Matching
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}