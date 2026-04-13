import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TABS = [
  { id: "kemedar",  label: "🏠 Kemedar",  color: "text-orange-600",  activeBg: "bg-orange-500" },
  { id: "kemework", label: "🔧 Kemework", color: "text-teal-600",    activeBg: "bg-teal-500" },
  { id: "kemetro",  label: "📦 Kemetro",  color: "text-blue-600",    activeBg: "bg-blue-500" },
];

const MODULE_OPTIONS = {
  kemedar: [
    { emoji: "🤖", label: "Get Property Advice", subtitle: "AI matches you with perfect properties", path: "/m/kemedar/advisor", bg: "bg-purple-50", border: "border-purple-300", badge: "NEW" },
    { emoji: "✨", label: "Property with AI", subtitle: "Describe by voice — AI fills the form", path: "/m/kemedar/add/property/ai", bg: "bg-purple-50", border: "border-purple-300", badge: "AI" },
    { emoji: "🏠", label: "Property",             subtitle: "List your property for sale or rent",  path: "/m/add/property",     bg: "bg-orange-50", border: "border-orange-200" },
    { emoji: "🏗️", label: "Project",              subtitle: "Add a new real estate project",        path: "/m/add/project",      bg: "bg-orange-50", border: "border-orange-200" },
    { emoji: "📋", label: "Buy Request",           subtitle: "Tell sellers what you're looking for", path: "/m/add/buy-request",  bg: "bg-orange-50", border: "border-orange-200" },
  ],
  kemework: [
    { emoji: "🔧", label: "Service",  subtitle: "Offer a professional service",      path: "/m/add/service", bg: "bg-teal-50", border: "border-teal-200" },
    { emoji: "📝", label: "Task",     subtitle: "Post a task for handymen",          path: "/m/add/task",    bg: "bg-teal-50", border: "border-teal-200" },
  ],
  kemetro: [
    { emoji: "♻️", label: "Sell Leftover Materials", subtitle: "Snap a photo — done in 60 seconds", path: "/kemetro/surplus/add", bg: "bg-green-50", border: "border-green-400", badge: "ECO", isEco: true },
    { emoji: "📦", label: "Product",  subtitle: "Add a product to your store",          path: "/m/add/product", bg: "bg-blue-50", border: "border-blue-200" },
    { emoji: "📄", label: "RFQ",      subtitle: "Request for quotation on products",    path: "/m/add/rfq",     bg: "bg-blue-50", border: "border-blue-200" },
  ],
};

export default function MobileAddPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kemedar");

  const options = MODULE_OPTIONS[activeTab];

  return (
    <div className="min-h-full bg-gray-50">
      <MobileTopBar title="Add Listing" showBack rightAction={
        <button onClick={() => navigate("/m")} className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <X size={22} className="text-gray-600" />
        </button>
      } />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-3">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-t-xl text-sm font-black transition-all ${
                activeTab === tab.id
                  ? `${tab.activeBg} text-white shadow-sm`
                  : `text-gray-500 hover:text-gray-700`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="px-4 pt-5 space-y-3 pb-8">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">
          What would you like to add?
        </p>
        {options.map((opt) => (
          <button
            key={opt.path}
            onClick={() => navigate(opt.path)}
            className={`w-full ${opt.bg} border ${opt.border} rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm active:opacity-80 transition-colors text-left${opt.isEco ? " border-l-4" : ""}`}
            style={opt.isEco ? { borderLeftColor: "#16A34A", borderLeftWidth: 3 } : {}}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900 text-base">{opt.label}</p>
                {opt.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${opt.isEco ? "bg-green-600 text-white" : "bg-purple-600 text-white"}`}>
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className={`text-sm mt-0.5 ${opt.isEco ? "text-green-600 font-semibold" : "text-gray-500"}`}>{opt.subtitle}</p>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}