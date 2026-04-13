import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Percent, Gift, Zap, Edit, Trash2, BarChart3, PauseCircle, Eye } from "lucide-react";

const MOCK_PROMOTION = {
  id: 1,
  name: "Spring Sale 20% Off",
  type: "Discount",
  discount: "20%",
  minOrder: "$50",
  startDate: "2026-03-01",
  endDate: "2026-04-01",
  uses: 134,
  maxUses: 500,
  status: "active",
  description: "Special spring promotion offering 20% off on all products with a minimum order of $50.",
  products: ["All Products"],
  customerEligibility: "All Customers",
};

const TYPE_ICONS = { Discount: Percent, Bundle: Gift, Flash: Zap };
const TYPE_COLORS = { Discount: "bg-blue-100 text-blue-700", Bundle: "bg-purple-100 text-purple-700", Flash: "bg-orange-100 text-orange-700" };

export default function SellerPromotionsDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [promo] = useState(MOCK_PROMOTION);

  const usagePercent = promo.maxUses > 0 ? Math.min((promo.uses / promo.maxUses) * 100, 100) : 0;
  const Icon = TYPE_ICONS[promo.type];

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Promotion Details</span>
        <div className="w-6" />
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${TYPE_COLORS[promo.type]}`}>
              <Icon size={12} /> {promo.type}
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
              promo.status === "active" ? "bg-green-100 text-green-700" :
              promo.status === "scheduled" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-500"
            }`}>
              {promo.status}
            </span>
          </div>
          <h1 className="font-black text-gray-900 text-lg mb-2">{promo.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="font-bold">🏷 {promo.discount}</span>
            <span className="font-bold">📦 Min. {promo.minOrder}</span>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-bold">📅 {promo.startDate}</span> - <span className="font-bold">{promo.endDate}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/m/dashboard/seller-promotions/${promo.id}/edit`)} className="flex-1 bg-[#0077B6] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
              <Edit size={14} /> Edit
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
              <PauseCircle size={14} /> Pause
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900 text-sm">Usage Statistics</p>
            <BarChart3 size={18} className="text-gray-400" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
              <span>Uses: {promo.uses} / {promo.maxUses}</span>
              <span>{usagePercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 60 ? "bg-yellow-500" : "bg-blue-500"}`} style={{ width: `${usagePercent}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-lg font-black text-blue-600">{promo.uses}</p>
              <p className="text-[9px] text-blue-600 font-bold mt-0.5">Used</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-lg font-black text-gray-600">{promo.maxUses - promo.uses}</p>
              <p className="text-[9px] text-gray-600 font-bold mt-0.5">Remaining</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-lg font-black text-green-600">{usagePercent.toFixed(0)}%</p>
              <p className="text-[9px] text-green-600 font-bold mt-0.5">Rate</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <p className="font-black text-gray-900 text-sm">Promotion Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Type</span>
              <span className="font-bold text-gray-900">{promo.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Discount</span>
              <span className="font-bold text-gray-900">{promo.discount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Minimum Order</span>
              <span className="font-bold text-gray-900">{promo.minOrder}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Start Date</span>
              <span className="font-bold text-gray-900">{promo.startDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">End Date</span>
              <span className="font-bold text-gray-900">{promo.endDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Customer Eligibility</span>
              <span className="font-bold text-gray-900">{promo.customerEligibility}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Products</span>
              <span className="font-bold text-gray-900">{promo.products.join(", ")}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {promo.description && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="font-black text-gray-900 text-sm mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{promo.description}</p>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <p className="font-black text-red-700 text-sm mb-2">⚠️ Danger Zone</p>
          <p className="text-xs text-red-600 mb-3">Once you delete this promotion, it cannot be recovered.</p>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Trash2 size={14} /> Delete Promotion
          </button>
        </div>
      </div>
    </div>
  );
}