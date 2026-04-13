import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, Search, Edit, BarChart2, PauseCircle, Trash2, Eye } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";

const MOCK_COUPONS = [
  {
    id: 1,
    code: "SUMMER20",
    type: "percentage",
    discount: 20,
    uses: 45,
    maxUses: 100,
    saved: 450,
    status: "active",
    expires: "2025-06-30",
  },
  {
    id: 2,
    code: "SAVE15",
    type: "fixed",
    discount: 15,
    uses: 28,
    maxUses: 50,
    saved: 420,
    status: "active",
    expires: "2025-04-15",
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "shipping",
    discount: 5.99,
    uses: 12,
    maxUses: null,
    saved: 71.88,
    status: "scheduled",
    expires: "2025-03-25",
  },
];

export default function SellerCouponsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filters = [
    { id: "all", label: "All", count: MOCK_COUPONS.length },
    { id: "active", label: "Active", count: 2 },
    { id: "scheduled", label: "Scheduled", count: 1 },
    { id: "expired", label: "Expired", count: 0 },
    { id: "disabled", label: "Disabled", count: 0 },
  ];

  const totalSaved = MOCK_COUPONS.reduce((sum, c) => sum + c.saved, 0);
  const totalUses = MOCK_COUPONS.reduce((sum, c) => sum + c.uses, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title="Coupons"
          showMenu
          onMenuClick={() => setDrawerOpen(true)}
          rightAction={
            <button
              onClick={() => navigate("/m/dashboard/seller-coupons/create")}
              className="p-1 text-purple-600"
            >
              <Plus size={22} />
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Performance Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-purple-600">{MOCK_COUPONS.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-gray-600 mt-1">Active</p>
              </div>
              <div>
                <p className="text-2xl font-black text-blue-600">{totalUses}</p>
                <p className="text-xs text-gray-600 mt-1">Total Uses</p>
              </div>
              <div>
                <p className="text-2xl font-black text-green-600">${totalSaved.toFixed(0)}</p>
                <p className="text-xs text-gray-600 mt-1">Buyer Savings</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                  activeFilter === f.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2.5">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>

          {/* Coupons List */}
          <div className="space-y-3">
            {MOCK_COUPONS.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Colored Top Section */}
                <div
                  className={`p-4 text-white flex items-center justify-between ${
                    coupon.type === "percentage"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : coupon.type === "fixed"
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-r from-purple-500 to-purple-600"
                  }`}
                >
                  <div>
                    <p className="text-3xl font-black">
                      {coupon.type === "percentage"
                        ? `${coupon.discount}% OFF`
                        : coupon.type === "fixed"
                        ? `$${coupon.discount} OFF`
                        : "FREE SHIP"}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-white bg-opacity-25 px-2.5 py-1 rounded-full">
                    {coupon.status === "active"
                      ? "✅ Active"
                      : coupon.status === "scheduled"
                      ? "⏰ Scheduled"
                      : "❌ Expired"}
                  </span>
                </div>

                {/* Coupon Code */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between">
                    <p className="font-mono font-bold text-gray-900 text-sm">{coupon.code}</p>
                    <button className="text-blue-600 text-sm font-bold">📋 Copy</button>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 py-3 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Uses:</span>
                    <span className="font-bold text-gray-900">
                      {coupon.uses}/{coupon.maxUses || "∞"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="font-bold text-gray-900">{coupon.expires}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-4 gap-2">
                  <button
                    onClick={() => navigate(`/m/dashboard/seller-coupons/${coupon.id}/edit`)}
                    className="flex flex-col items-center gap-1 text-blue-600 hover:bg-blue-50 rounded-lg py-2 transition-colors"
                  >
                    <Edit size={18} />
                    <span className="text-[10px] font-bold">Edit</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-blue-600 hover:bg-blue-50 rounded-lg py-2 transition-colors">
                    <Eye size={18} />
                    <span className="text-[10px] font-bold">View</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-orange-600 hover:bg-orange-50 rounded-lg py-2 transition-colors">
                    <BarChart2 size={18} />
                    <span className="text-[10px] font-bold">Stats</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 text-red-600 hover:bg-red-50 rounded-lg py-2 transition-colors">
                    <Trash2 size={18} />
                    <span className="text-[10px] font-bold">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}