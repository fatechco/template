import { Link } from "react-router-dom";

const AI_MODULES = [
  { emoji: "📈", label: "Predict™", sub: "Price Forecasting", to: "/kemedar/predict/landing", color: "hover:bg-indigo-50 hover:text-indigo-700" },
  { emoji: "👁️", label: "Vision™", sub: "Photo AI Analyzer", to: "/kemedar/vision/landing", color: "hover:bg-cyan-50 hover:text-cyan-700" },
  { emoji: "🤝", label: "Negotiate™", sub: "AI Deal Coach", to: "/kemedar/negotiate/landing", color: "hover:bg-teal-50 hover:text-teal-700" },
  { emoji: "🏙️", label: "Life Score™", sub: "Neighborhood Intel", to: "/kemedar/life-score/landing", color: "hover:bg-green-50 hover:text-green-700" },
  { emoji: "🤖", label: "Advisor", sub: "Property Matching", to: "/kemedar/advisor", color: "hover:bg-orange-50 hover:text-orange-700" },
  { emoji: "🎓", label: "Coach™", sub: "Journey Guide", to: "/kemedar/coach/landing", color: "hover:bg-blue-50 hover:text-blue-700" },
  { emoji: "🧬", label: "DNA™", sub: "Personalization", to: "/kemedar/dna/landing", color: "hover:bg-violet-50 hover:text-violet-700" },
];

const REAL_ESTATE_MODULES = [
  { emoji: "❤️", label: "Match™", sub: "Swipe to Find", to: "/kemedar/match/landing", color: "hover:bg-pink-50 hover:text-pink-700" },
  { emoji: "🏠", label: "Twin™", sub: "Virtual Tours", to: "/kemedar/twin/landing", color: "hover:bg-purple-50 hover:text-purple-700" },
  { emoji: "🏦", label: "Escrow™", sub: "Trusted Payments", to: "/kemedar/escrow/landing", color: "hover:bg-blue-50 hover:text-blue-700" },
  { emoji: "🗓️", label: "Finish™", sub: "Home Renovation", to: "/kemedar/finish/landing", color: "hover:bg-orange-50 hover:text-orange-700" },
  { emoji: "🏘️", label: "Community™", sub: "Neighborhood Social", to: "/kemedar/community/landing", color: "hover:bg-yellow-50 hover:text-yellow-700" },
  { emoji: "📺", label: "Live™", sub: "Streaming Events", to: "/kemedar/live/landing", color: "hover:bg-red-50 hover:text-red-700" },
  { emoji: "⭐", label: "Score™", sub: "Reputation Score", to: "/kemedar/score/landing", color: "hover:bg-amber-50 hover:text-amber-700" },
  { emoji: "✈️", label: "Expat™", sub: "International Buy", to: "/kemedar/expat/landing", color: "hover:bg-sky-50 hover:text-sky-700" },
  { emoji: "🔑", label: "Rent2Own™", sub: "Flexible Ownership", to: "/kemedar/rent2own/landing", color: "hover:bg-emerald-50 hover:text-emerald-700" },
  { emoji: "🌍", label: "Twin Cities™", sub: "Cross-Market", to: "/kemedar/twin-cities/landing", color: "hover:bg-sky-50 hover:text-sky-700" },
  { emoji: "🔨", label: "KemedarBid™", sub: "Property Auctions", to: "/auctions/how-it-works", color: "hover:bg-red-50 hover:text-red-700" },
  { emoji: "🔐", label: "KemeFrac™", sub: "Fractional Ownership", to: "/kemefrac", color: "hover:bg-violet-50 hover:text-violet-700" },
  { emoji: "🔄", label: "Swap™", sub: "Property Exchange", to: "/dashboard/swap", color: "hover:bg-teal-50 hover:text-teal-700" },
];

const KEMETRO_MODULES = [
  { emoji: "⚡", label: "Flash™", sub: "Group Deals", to: "/kemetro/flash/landing", color: "hover:bg-orange-50 hover:text-orange-700" },
  { emoji: "📐", label: "Build™ BOQ", sub: "AI Material List", to: "/kemetro/build/landing", color: "hover:bg-teal-50 hover:text-teal-700" },
  { emoji: "🎨", label: "KemeKits™", sub: "Room Design Kits", to: "/kemetro/kemekits", color: "hover:bg-purple-50 hover:text-purple-700" },
  { emoji: "♻️", label: "Surplus™", sub: "Eco Material Market", to: "/kemetro/surplus", color: "hover:bg-green-50 hover:text-green-700" },
];

function ModuleItem({ item }) {
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-700 transition-colors ${item.color}`}
    >
      <span className="text-xl flex-shrink-0">{item.emoji}</span>
      <div className="min-w-0">
        <p className="font-bold text-xs leading-tight">{item.label}</p>
        <p className="text-[10px] text-gray-400 leading-tight truncate">{item.sub}</p>
      </div>
    </Link>
  );
}

export default function InnovativeMenu() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(800px,calc(100vw-32px))] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
      {/* ThinkDar™ Eyebrow */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#0F0E1A" }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">🧠</span>
            <span className="font-black text-white text-base">ThinkDar<span style={{ color: "#6366F1" }}>™</span></span>
          </div>
          <p className="text-gray-400 text-[11px] leading-tight">The First AI Model Built Exclusively for Real Estate</p>
        </div>
        <Link
          to="/thinkdar"
          className="px-4 py-2 rounded-xl text-xs font-black text-white whitespace-nowrap transition-all"
          style={{ background: "#6366F1" }}
          onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"}
          onMouseLeave={e => e.currentTarget.style.background = "#6366F1"}
        >
          Explore ThinkDar™ API →
        </Link>
      </div>

      <div className="p-5">
        {/* AI & Intelligence */}
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest mb-2 px-1" style={{ color: "#6366F1" }}>🤖 AI & Intelligence</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {AI_MODULES.map(m => <ModuleItem key={m.label} item={m} />)}
          </div>
        </div>

        <div className="border-t border-gray-100 my-3" />

        {/* Real Estate Innovation */}
        <div className="mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">🏠 Real Estate Innovation</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {REAL_ESTATE_MODULES.map(m => <ModuleItem key={m.label} item={m} />)}
          </div>
        </div>

        <div className="border-t border-gray-100 my-3" />

        {/* Kemetro */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">🛒 Kemetro Innovation</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {KEMETRO_MODULES.map(m => <ModuleItem key={m.label} item={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
}