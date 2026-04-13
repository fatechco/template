import { useState } from "react";
import { Plus, Tag, Percent, Gift, Zap } from "lucide-react";

const PROMOTIONS = [
  { id: 1, name: "Spring Sale 20% Off", type: "Discount", discount: "20%", minOrder: "$50", startDate: "2026-03-01", endDate: "2026-04-01", uses: 134, maxUses: 500, status: "active" },
  { id: 2, name: "Buy 2 Get 1 Free", type: "Bundle", discount: "B2G1", minOrder: "$0", startDate: "2026-03-15", endDate: "2026-03-31", uses: 67, maxUses: 200, status: "active" },
  { id: 3, name: "Flash Deal - 30% Off", type: "Flash", discount: "30%", minOrder: "$30", startDate: "2026-04-05", endDate: "2026-04-06", uses: 0, maxUses: 100, status: "scheduled" },
];

const TYPE_ICONS = { Discount: Percent, Bundle: Gift, Flash: Zap };
const TYPE_COLORS = { Discount: "bg-blue-100 text-blue-700", Bundle: "bg-purple-100 text-purple-700", Flash: "bg-orange-100 text-orange-700" };

export default function SellerPromotionsMobile({ onOpenDrawer }) {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? PROMOTIONS : PROMOTIONS.filter(p => p.status === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Tag size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Promotions</span>
        <button className="p-1"><Plus size={22} className="text-[#0077B6]" /></button>
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Active", value: PROMOTIONS.filter(p => p.status === "active").length, icon: "🎯" },
            { label: "Scheduled", value: PROMOTIONS.filter(p => p.status === "scheduled").length, icon: "📅" },
            { label: "Total Uses", value: PROMOTIONS.reduce((s, p) => s + p.uses, 0), icon: "📊" },
            { label: "Avg Discount", value: "21%", icon: "💸" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Active", "Scheduled", "Expired"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-[#0077B6] text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Promotions List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Tag size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-black text-gray-700">No promotions found</p>
            <p className="text-xs text-gray-400 mt-1">Create your first promotion to boost sales</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(promo => {
              const Icon = TYPE_ICONS[promo.type];
              const usagePercent = promo.maxUses > 0 ? Math.min((promo.uses / promo.maxUses) * 100, 100) : 0;
              return (
                <div key={promo.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[promo.type]}`}>
                      <Icon size={12} /> {promo.type}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                      promo.status === "active" ? "bg-green-100 text-green-700" :
                      promo.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {promo.status}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 text-base mb-2">{promo.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <span className="font-bold">🏷 {promo.discount}</span>
                    <span className="font-bold">📦 Min. {promo.minOrder}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-bold">📅 {promo.startDate}</span> - <span className="font-bold">{promo.endDate}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Usage</span>
                      <span>{promo.uses} / {promo.maxUses}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 60 ? "bg-yellow-500" : "bg-blue-500"}`} style={{ width: `${usagePercent}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2.5 rounded-xl">View</button>
                    <button className="flex-1 bg-[#0077B6] text-white text-xs font-bold py-2.5 rounded-xl">Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}