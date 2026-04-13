import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TABS = ["All", "Active", "Completed", "Pending", "Cancelled"];

const STATUS_CONFIG = {
  active: { label: "Active", badge: "bg-green-100 text-green-700", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  completed: { label: "Completed", badge: "bg-gray-100 text-gray-600", icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-50" },
  pending: { label: "Pending", badge: "bg-yellow-100 text-yellow-700", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-500", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

const SERVICE_CONFIG = {
  VERI: { icon: "✅", color: "bg-green-100", text: "text-green-700", label: "VERI — Verification" },
  LIST: { icon: "📋", color: "bg-blue-100", text: "text-blue-700", label: "LIST — Professional Listing" },
  UP: { icon: "🚀", color: "bg-orange-100", text: "text-orange-700", label: "UP — Boost Listing" },
  KEY: { icon: "🔑", color: "bg-amber-100", text: "text-amber-700", label: "KEY — Featured Placement" },
  CAMPAIGN: { icon: "📢", color: "bg-red-100", text: "text-red-700", label: "CAMPAIGN — Marketing" },
};

const MOCK_ORDERS = [
  { id: 1, num: "KD-00121", status: "active", type: "VERI", property: "Modern Apartment in New Cairo", ordered: "Mar 10, 2026", amount: 150, statusNote: "Verification visit scheduled: Mar 25, 2026" },
  { id: 2, num: "KD-00118", status: "active", type: "LIST", property: "Villa in Sheikh Zayed", ordered: "Mar 8, 2026", amount: 200, statusNote: "Photography scheduled: Mar 22, 2026" },
  { id: 3, num: "KD-00115", status: "active", type: "UP", property: "Studio for Rent in Maadi", ordered: "Mar 5, 2026", amount: 50, statusNote: "Active until: Apr 5, 2026" },
  { id: 4, num: "KD-00110", status: "completed", type: "CAMPAIGN", property: "Penthouse in Heliopolis", ordered: "Feb 20, 2026", amount: 500, statusNote: "Campaign ran: Feb 20 – Mar 5, 2026" },
  { id: 5, num: "KD-00108", status: "pending", type: "KEY", property: "Chalet in North Coast", ordered: "Mar 18, 2026", amount: 300, statusNote: "Awaiting confirmation" },
  { id: 6, num: "KD-00102", status: "cancelled", type: "LIST", property: null, ordered: "Feb 10, 2026", amount: 200, statusNote: "Cancelled by user" },
];

function OrderCard({ order }) {
  const navigate = useNavigate();
  const sc = STATUS_CONFIG[order.status];
  const svc = SERVICE_CONFIG[order.type];
  const StatusIcon = sc.icon;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all`}>
      {/* Header Bar with Status */}
      <div className={`px-4 py-3 flex items-center gap-3 ${sc.bg} border-b border-gray-100`}>
        <StatusIcon size={16} className={sc.color} />
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{order.num}</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">{svc.label}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.badge}`}>{sc.label}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Property info */}
        {order.property && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-1">Property</p>
            <p className="text-sm font-bold text-gray-900">🏠 {order.property}</p>
          </div>
        )}

        {/* Key details grid */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Amount</p>
            <p className="text-lg font-black text-orange-600">${order.amount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Ordered</p>
            <p className="text-xs font-bold text-gray-900">{order.ordered}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-1">Type</p>
            <p className="text-xs font-bold text-gray-900">{order.type}</p>
          </div>
        </div>

        {/* Status note */}
        <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
          <p className="text-xs text-gray-600">{order.statusNote}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-lg text-xs transition">
            View Details
          </button>
          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-xs transition">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KemedarOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => STATUS_CONFIG[o.status].label === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Kemedar Orders" showBack />

      {/* Info strip */}
      <div className="mx-4 mt-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
        <p className="text-xs text-orange-700 font-semibold">Orders for Kemedar paid services (VERI, LIST, UP, KEY, CAMPAIGN)</p>
      </div>

      {/* Search bar */}
      <div className="mx-4 mt-3 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search orders..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
        />
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100 mt-3">
        <div className="flex overflow-x-auto no-scrollbar px-4 py-2 gap-2">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold text-gray-700">No orders found</p>
          </div>
        ) : filtered.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
}