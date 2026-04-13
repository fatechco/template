import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LOOKS = [
  { title: "Scandinavian Living Room", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70", items: 8 },
  { title: "Modern Bedroom", img: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&q=70", items: 6 },
  { title: "Minimalist Kitchen", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", items: 5 },
];

export default function ShopTheLookLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-3xl font-black mb-2">Shop the Look</h1>
          <p className="text-pink-100 text-sm mb-6">Tap any item in a styled room photo and shop it instantly from verified Kemetro sellers.</p>
          <button onClick={() => navigate("/m/kemetro/shop-the-look/browse")}
            className="inline-block bg-white text-purple-600 font-black px-8 py-3.5 rounded-2xl text-base">
            ✨ Explore Looks
          </button>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">

        {/* Sample looks */}
        <div>
          <h2 className="font-black text-gray-900 text-base mb-3">Trending Looks</h2>
          <div className="flex flex-col gap-3">
            {LOOKS.map((look, i) => (
              <div key={i} onClick={() => navigate("/m/kemetro/shop-the-look/browse")}
                className="relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: 140 }}>
                <img src={look.img} alt={look.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                  <p className="text-white font-black text-sm">{look.title}</p>
                  <p className="text-white/70 text-xs">{look.items} shoppable items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">How It Works</h2>
          <div className="space-y-3">
            {[
              { icon: "📸", title: "Browse Styled Rooms", desc: "Real interior photos from Egyptian designers" },
              { icon: "👆", title: "Tap to Shop", desc: "Each item in the photo is tagged and purchasable" },
              { icon: "🛒", title: "Instant Checkout", desc: "Buy directly from verified Kemetro sellers" },
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

        <button onClick={() => navigate("/m/kemetro/shop-the-look/browse")}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#7C3AED" }}>
          ✨ Start Shopping Looks
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}