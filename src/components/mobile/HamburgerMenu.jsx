import { useState } from "react";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const MODULES = [
  {
    id: "kemedar",
    name: "Kemedar",
    color: "#FF6B00",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    logo: "🏠",
    items: [
      { label: "Home", path: "/m/home", emoji: "🏡" },
      { label: "Search Properties", path: "/m/find/property", emoji: "🏠" },
      { label: "Search Projects", path: "/m/find/project", emoji: "🏗️" },
      { label: "Find Agents", path: "/m/find/agent", emoji: "🤝" },
      { label: "Find Agencies", path: "/m/find/agent", emoji: "🏢" },
      { label: "Find Developers", path: "/m/find/developer", emoji: "👷" },
      { label: "Find Franchise Owners", path: "/m/find/franchise-owner", emoji: "🗺️" },
      { label: "Buy Requests", path: "/m/find/buy-request", emoji: "📋" },
      { label: "Kemedar Negotiate™", path: "/kemedar/negotiate/landing", emoji: "🤝" },
      { label: "Kemedar Coach™", path: "/kemedar/coach", emoji: "🤖" },
      { label: "Kemedar Advisor™", path: "/kemedar/advisor", emoji: "🧠" },
      { label: "Kemedar Match™", path: "/kemedar/match", emoji: "🏘️" },
      { label: "Kemedar Score™", path: "/kemedar/score/landing", emoji: "🏆" },
      { label: "Kemedar DNA™", path: "/kemedar/dna/landing", emoji: "🧬" },
      { label: "Kemedar Expat™", path: "/kemedar/expat", emoji: "✈️" },
      { label: "Verify Pro™", path: "/kemedar/verify-pro", emoji: "🔐" },
      { label: "Kemedar Escrow™", path: "/kemedar/escrow/landing", emoji: "🔒" },
      { label: "Kemedar Predict™", path: "/kemedar/predict", emoji: "📊" },
      { label: "Kemedar Vision™", path: "/kemedar/vision/landing", emoji: "👁️" },
      { label: "Life Score™", path: "/kemedar/life-score", emoji: "📍" },
    ],
  },
  {
    id: "kemework",
    name: "Kemework",
    color: "#7C3AED",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    logo: "🔧",
    items: [
      { label: "Home", path: "/m/kemework/home", emoji: "🏡" },
      { label: "Browse Services", path: "/m/kemework/browse-services", emoji: "🔧" },
      { label: "Browse Tasks", path: "/m/kemework/browse-tasks", emoji: "📋" },
      { label: "Post a Task", path: "/m/kemework/post-task", emoji: "📢" },
      { label: "Find Professionals", path: "/m/kemework/find-professionals", emoji: "👷" },
      { label: "Preferred Pro Program", path: "/kemework/preferred-pro", emoji: "🏅" },
      { label: "Snap & Fix™", path: "/kemework/snap", emoji: "📸" },
      { label: "Kemedar Finish™", path: "/kemedar/finish/landing", emoji: "🏗️" },
    ],
  },
  {
    id: "kemetro",
    name: "Kemetro",
    color: "#059669",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    logo: "🛒",
    items: [
      { label: "Home", path: "/m/kemetro/home", emoji: "🏡" },
      { label: "Search Products", path: "/m/kemetro/search", emoji: "🛒" },
      { label: "Flash Deals", path: "/m/kemetro/flash/landing", emoji: "⚡" },
      { label: "Post an RFQ", path: "/m/add/rfq", emoji: "📝" },
      { label: "Kemetro Build™ BOQ", path: "/m/kemetro/build/landing", emoji: "🏗️" },
      { label: "Shop the Look ✨", path: "/m/kemetro/shop-the-look/landing", emoji: "✨" },
      { label: "AI Price Match", path: "/m/kemetro/ai-price-match/landing", emoji: "🤖" },
      { label: "ESG Impact Tracker", path: "/m/kemetro/surplus/esg/landing", emoji: "🌱" },
      { label: "Surplus & Salvage", path: "/m/kemetro/surplus", emoji: "♻️" },
      { label: "KemeKits™", path: "/kemetro/kemekits", emoji: "📦" },
    ],
  },
  {
    id: "other",
    name: "Other · ThinkDar™ AI",
    color: "#6366F1",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    logo: "🧠",
    items: [
      { label: "ThinkDar™ AI API", path: "/m/thinkdar", emoji: "🧠" },
      { label: "KemedarBid™ Auctions", path: "/m/auctions", emoji: "🔨" },
      { label: "KemeFrac™ Fractional", path: "/kemefrac", emoji: "🏛️" },
      { label: "Kemedar Swap™", path: "/kemedar/swap", emoji: "🔄" },
      { label: "Kemedar Community™", path: "/kemedar/community", emoji: "🏘️" },
      { label: "Kemedar Live™", path: "/kemedar/live", emoji: "🎥" },
      { label: "Twin Cities™", path: "/kemedar/twin-cities", emoji: "🌆" },
      { label: "Kemedar Valuation", path: "/kemedar/valuation", emoji: "📐" },
      { label: "Rent2Own™", path: "/kemedar/rent2own/landing", emoji: "🔑" },
      { label: "Kemedar Pricing", path: "/kemedar/pricing", emoji: "💳" },
      { label: "Virtual Twin™", path: "/kemedar/twin/new", emoji: "🌐" },
    ],
  },
];

function ModuleSection({ module, isOpen, onToggle }) {
  return (
    <div className={`rounded-2xl border ${module.borderColor} overflow-hidden mb-3`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3.5 ${module.bgColor}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{module.logo}</span>
          <span className="font-black text-gray-900 text-base">{module.name}</span>
        </div>
        <ChevronDown
          size={18}
          className="text-gray-500 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {isOpen && (
        <div className="bg-white divide-y divide-gray-50">
          {module.items.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100"
            >
              <span className="text-base w-6 text-center flex-shrink-0">{item.emoji}</span>
              <span className="text-sm font-medium text-gray-800">{item.label}</span>
              <ChevronRight size={14} className="text-gray-300 ml-auto flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HamburgerMenu({ onClose }) {
  const [openModule, setOpenModule] = useState("kemedar");

  const toggle = (id) => setOpenModule(openModule === id ? null : id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-gray-50 z-50 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <img
            src="https://media.base44.com/images/public/69c6065775877f52af7313ef/a00191aa3_Colored_square_Kemedar_logo_png.png"
            alt="Kemedar"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-black text-gray-900 text-lg">Menu</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {MODULES.map((mod) => (
            <ModuleSection
              key={mod.id}
              module={mod}
              isOpen={openModule === mod.id}
              onToggle={() => toggle(mod.id)}
            />
          ))}

          {/* Auth + Language */}
          <div className="mt-4 space-y-2">
            <Link
              to="/m/register"
              onClick={onClose}
              className="block w-full text-center bg-[#FF6B00] text-white font-black py-3 rounded-2xl text-sm"
            >
              Sign Up Free
            </Link>
            <Link
              to="/m/login"
              onClick={onClose}
              className="block w-full text-center border-2 border-[#FF6B00] text-[#FF6B00] font-black py-3 rounded-2xl text-sm"
            >
              Log In
            </Link>
          </div>

          {/* Language */}
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">🌐 Language</span>
            <span className="text-sm font-bold text-[#FF6B00]">English (EN)</span>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
}