import { useState } from "react";
import { Plus, Tag, Copy, Percent, DollarSign, Truck } from "lucide-react";

const COUPONS = [
  { id: 1, code: "SUMMER20", type: "percentage", discount: 20, uses: 45, maxUses: 100, saved: 450, status: "active", expires: "2025-06-30", minOrder: 50 },
  { id: 2, code: "SAVE15", type: "fixed", discount: 15, uses: 28, maxUses: 50, saved: 420, status: "active", expires: "2025-04-15", minOrder: 0 },
  { id: 3, code: "FREESHIP", type: "shipping", discount: 5.99, uses: 12, maxUses: null, saved: 71.88, status: "scheduled", expires: "2025-03-25", minOrder: 30 },
];

const TYPE_ICONS = { percentage: Percent, fixed: DollarSign, shipping: Truck };
const STATUS_COLORS = { active: "bg-green-100 text-green-700", scheduled: "bg-yellow-100 text-yellow-700", expired: "bg-red-100 text-red-700" };

export default function SellerCouponsMobile({ onOpenDrawer }) {
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState(null);

  const filtered = filter === "All" ? COUPONS : COUPONS.filter(c => c.status === filter.toLowerCase());

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Tag size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Coupons</span>
        <button className="p-1"><Plus size={22} className="text-[#0077B6]" /></button>
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Coupons", value: COUPONS.length, color: "text-gray-900" },
            { label: "Active", value: COUPONS.filter(c => c.status === "active").length, color: "text-purple-600" },
            { label: "Total Uses", value: COUPONS.reduce((s, c) => s + c.uses, 0), color: "text-blue-600" },
            { label: "Buyer Savings", value: `$${COUPONS.reduce((s, c) => s + c.saved, 0).toFixed(0)}`, color: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Active", "Scheduled", "Expired"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-purple-600 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Coupons List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Tag size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-black text-gray-700">No coupons found</p>
            <p className="text-xs text-gray-400 mt-1">Create your first coupon to attract buyers</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(coupon => {
              const Icon = TYPE_ICONS[coupon.type];
              const usagePercent = coupon.maxUses ? Math.min((coupon.uses / coupon.maxUses) * 100, 100) : 0;
              return (
                <div key={coupon.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-black text-xs`}>
                      <Icon size={12} />
                      {coupon.type === "percentage" ? `${coupon.discount}% OFF` : coupon.type === "fixed" ? `$${coupon.discount} OFF` : "FREE SHIP"}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[coupon.status]}`}>
                      {coupon.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono font-black text-gray-900 text-sm">{coupon.code}</span>
                    <button onClick={() => handleCopy(coupon.code)} className="p-1 text-gray-400 hover:text-purple-600">
                      {copied === coupon.code ? <span className="text-green-600 text-xs font-bold">✓</span> : <Copy size={14} />}
                    </button>
                  </div>
                  {coupon.minOrder > 0 && <p className="text-xs text-gray-500 mb-2">Min. order: ${coupon.minOrder}</p>}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Uses</span>
                      <span>{coupon.uses} / {coupon.maxUses ?? "∞"}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${usagePercent}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Expires: <span className="font-bold">{coupon.expires}</span></p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}