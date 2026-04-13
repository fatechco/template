import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

export default function FlashDealsLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-black mb-2">Flash Deals</h1>
          <p className="text-orange-100 text-sm mb-6">Lightning-fast discounts on home essentials. Limited stock, limited time.</p>
          <button onClick={() => navigate("/m/kemetro/flash")}
            className="inline-block bg-white text-red-600 font-black px-8 py-3.5 rounded-2xl text-base">
            🛒 Browse Flash Deals
          </button>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-lg mb-3">How Flash Deals Work</h2>
          <div className="space-y-3">
            {[
              { icon: "⚡", title: "Limited Time", desc: "Deals change every few hours" },
              { icon: "📉", title: "Deep Discounts", desc: "Up to 70% off retail prices" },
              { icon: "🚀", title: "Fast Checkout", desc: "One-click purchase and delivery" },
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

        <button onClick={() => navigate("/m/kemetro/flash")}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#FF6B00" }}>
          ⚡ View Active Deals
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}