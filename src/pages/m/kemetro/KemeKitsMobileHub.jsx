import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const ROOM_TABS = [
  { value: "", label: "All" },
  { value: "bathroom", label: "🛁 Bath" },
  { value: "kitchen", label: "🍳 Kitchen" },
  { value: "living_room", label: "🛋️ Living" },
  { value: "bedroom", label: "🛏 Bedroom" },
  { value: "outdoor", label: "🌿 Outdoor" },
];

const BUDGET_BADGES = {
  economy: { label: "💚 Economy", bg: "bg-green-500" },
  standard: { label: "💛 Standard", bg: "bg-yellow-400" },
  premium: { label: "🔵 Premium", bg: "bg-blue-500" },
  luxury: { label: "💎 Luxury", bg: "bg-purple-700" },
};

const ROOM_LABELS = {
  bathroom: "🛁 Bathroom", kitchen: "🍳 Kitchen", living_room: "🛋️ Living Room",
  bedroom: "🛏 Bedroom", outdoor: "🌿 Outdoor", office: "🖥 Office", kids_room: "🧒 Kids Room",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&q=80",
];

function MobileKitCard({ kit, index }) {
  const badge = BUDGET_BADGES[kit.budgetTier];
  const imgHeight = index % 2 === 0 ? 200 : 160;

  return (
    <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
      <div className="relative" style={{ height: imgHeight }}>
        <img
          src={kit.heroImageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
          alt={kit.title}
          className="w-full h-full object-cover"
        />
        {kit.isEditorsPick && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full">⭐ Pick</span>
        )}
        {badge && (
          <span className={`absolute top-2 right-2 ${badge.bg} text-white text-[9px] font-black px-2 py-0.5 rounded-full`}>
            {badge.label}
          </span>
        )}
      </div>
      <div className="p-3">
        {kit.roomType && (
          <span className="text-[9px] font-bold border border-blue-200 text-blue-600 px-1.5 py-0.5 rounded-full">
            {ROOM_LABELS[kit.roomType] || kit.roomType}
          </span>
        )}
        <p className="font-black text-gray-900 text-xs leading-tight mt-1 line-clamp-2">{kit.title}</p>
        <p className="text-gray-400 text-[10px] mt-0.5">By {kit.creatorName || "Designer"}</p>
        <Link
          to={`/kemetro/kemekits/${kit.slug}`}
          className="block w-full text-center border border-blue-500 text-blue-600 font-bold text-xs py-2 rounded-lg mt-2 hover:bg-blue-50"
        >
          📐 Calculate
        </Link>
      </div>
    </div>
  );
}

export default function KemeKitsMobileHub() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomFilter, setRoomFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    base44.entities.KemeKitTemplate.filter({ status: "active" }, "-totalCalculationsRun", 60)
      .then(setKits)
      .finally(() => setLoading(false));
  }, []);

  const filtered = kits.filter(k => !roomFilter || k.roomType === roomFilter);
  const displayed = filtered.slice(0, page * PER_PAGE);
  const leftCol = displayed.filter((_, i) => i % 2 === 0);
  const rightCol = displayed.filter((_, i) => i % 2 !== 0);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Hero */}
      <div className="w-full text-center px-4 py-10" style={{ background: "#0A1628" }}>
        <div className="text-4xl mb-3">✨</div>
        <h1 className="text-white font-black text-2xl mb-2">KemeKits™</h1>
        <p className="text-sm mb-0" style={{ color: "rgba(255,255,255,0.75)" }}>
          Pick a design → enter your room → get your exact list
        </p>
      </div>

      {/* Room Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex gap-0 overflow-x-auto no-scrollbar px-3 py-0">
          {ROOM_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setRoomFilter(tab.value); setPage(1); }}
              className={`flex-shrink-0 px-3 py-3 text-xs font-bold border-b-2 transition-all ${
                roomFilter === tab.value ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-4">
        <p className="text-xs text-gray-400 mb-3 font-bold">{filtered.length} KemeKits</p>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse" style={{ height: 220 }} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 items-start">
              <div>{leftCol.map((kit, i) => <MobileKitCard key={kit.id} kit={kit} index={i * 2} />)}</div>
              <div>{rightCol.map((kit, i) => <MobileKitCard key={kit.id} kit={kit} index={i * 2 + 1} />)}</div>
            </div>
            {displayed.length < filtered.length && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full mt-4 border-2 border-blue-500 text-blue-600 font-bold py-3 rounded-xl text-sm hover:bg-blue-50"
              >
                Load More
              </button>
            )}
          </>
        )}

        {/* Designer CTA */}
        <div className="mt-8 rounded-2xl p-5 text-center" style={{ background: "#0A1628" }}>
          <p className="text-white font-black text-base mb-1">🎨 Are you a designer?</p>
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Create a KemeKit and earn Kemecoins on every sale</p>
          <Link to="/kemework/pro/kemekits/create" className="inline-block bg-white text-gray-900 font-black text-sm px-5 py-2.5 rounded-xl">
            Start Creating →
          </Link>
        </div>
      </div>
    </div>
  );
}