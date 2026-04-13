import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", color: "bg-teal-100 text-teal-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
  { key: "cancelled", label: "Cancelled" },
];

const MOCK_ORDERS = [
  { id: 1, num: "KW-00121", status: "in_progress", pro: { name: "Ahmed Hassan", rating: 4.9, verified: true, avatar: "AH" }, task: "Full Kitchen Renovation & Cabinet Installation", category: "Remodeling", amount: 2800, deadline: "Apr 10, 2026", progress: 60 },
  { id: 2, num: "KW-00118", status: "pending", pro: { name: "Sara Mohamed", rating: 4.8, verified: true, avatar: "SM" }, task: "Apartment Electrical Rewiring - 3 Rooms", category: "Electrical", amount: 950, deadline: "Apr 5, 2026", progress: 0 },
  { id: 3, num: "KW-00115", status: "delivered", pro: { name: "Omar Khalid", rating: 4.7, verified: false, avatar: "OK" }, task: "Interior Painting - Full Apartment 4 Rooms", category: "Painting", amount: 1200, deadline: "Mar 20, 2026", progress: 100 },
  { id: 4, num: "KW-00110", status: "completed", pro: { name: "Layla Nour", rating: 5.0, verified: true, avatar: "LN" }, task: "Garden Landscaping & Irrigation System", category: "Landscaping", amount: 3500, deadline: "Mar 15, 2026", progress: 100 },
  { id: 5, num: "KW-00108", status: "disputed", pro: { name: "Kareem Saad", rating: 4.2, verified: false, avatar: "KS" }, task: "Bathroom Tiles Replacement - 2 Bathrooms", category: "Tiling", amount: 800, deadline: "Mar 10, 2026", progress: 80 },
  { id: 6, num: "KW-00105", status: "cancelled", pro: { name: "Nadia Ali", rating: 4.6, verified: true, avatar: "NA" }, task: "AC Installation & Maintenance - 3 Units", category: "AC", amount: 600, deadline: "Mar 8, 2026", progress: 0 },
];

function StatusActions({ status, onNavigate, orderId }) {
  const btn = "flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-bold";
  const div = "border-r border-gray-100";
  if (status === "pending") return (
    <>
      <button className={`${btn} text-green-600`}>✅ Confirm</button>
      <div className={div} />
      <button className={`${btn} text-red-500`}>❌ Cancel</button>
    </>
  );
  if (status === "in_progress") return (
    <>
      <button onClick={() => onNavigate(`/m/dashboard/kemework/orders/${orderId}`)} className={`${btn} text-blue-600`}>👁 View Progress</button>
      <div className={div} />
      <button className={`${btn} text-gray-600`}>💬 Message Pro</button>
    </>
  );
  if (status === "delivered") return (
    <>
      <button className={`${btn} text-green-600`}>✅ Complete</button>
      <div className={div} />
      <button className={`${btn} text-orange-600`}>🔄 Revision</button>
      <div className={div} />
      <button className={`${btn} text-red-500`}>⚠️ Dispute</button>
    </>
  );
  if (status === "completed") return (
    <>
      <button onClick={() => onNavigate(`/m/dashboard/kemework/orders/${orderId}`)} className={`${btn} text-orange-600`}>⭐ Review</button>
      <div className={div} />
      <button className={`${btn} text-gray-600`}>🔄 Reorder</button>
    </>
  );
  if (status === "disputed") return (
    <>
      <button onClick={() => onNavigate(`/m/dashboard/kemework/orders/${orderId}`)} className={`${btn} text-red-600`}>👁 View Dispute</button>
      <div className={div} />
      <button className={`${btn} text-gray-600`}>💬 Support</button>
    </>
  );
  return <button className={`${btn} text-gray-500`}>📄 View Details</button>;
}

function OrderCard({ order, onNavigate }) {
  const sc = STATUS_CONFIG[order.status];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-gray-400">Order #{order.num}</p>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
        </div>

        {/* Professional */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600 flex-shrink-0">
            {order.pro.avatar}
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">{order.pro.name}</p>
            <p className="text-[11px] text-gray-400">⭐ {order.pro.rating} {order.pro.verified && "· ✅ Verified"}</p>
          </div>
        </div>

        {/* Task */}
        <p className="text-[14px] font-bold text-gray-900 line-clamp-2 mb-2">{order.task}</p>
        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{order.category}</span>

        {/* Details */}
        <div className="flex items-center gap-4 mt-3">
          <p className="text-[13px] font-black text-orange-600">💰 ${order.amount.toLocaleString()}</p>
          <p className="text-[12px] text-gray-500">📅 {order.deadline}</p>
        </div>

        {/* Progress bar */}
        {order.status === "in_progress" && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] text-gray-500">Progress</p>
              <p className="text-[11px] font-bold text-orange-600">{order.progress}% complete</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${order.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <StatusActions status={order.status} onNavigate={onNavigate} orderId={order.id} />
      </div>
    </div>
  );
}

export default function KemeworkOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? MOCK_ORDERS.length : MOCK_ORDERS.filter(o => o.status === t.key).length;
    return acc;
  }, {});

  const filtered = activeTab === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="My Task Orders" showBack
        rightAction={<button><Search size={20} className="text-gray-700" /></button>} />

      {/* Filter tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar px-3 py-2 gap-2">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab.key ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-bold text-gray-700">No orders in this category</p>
          </div>
        ) : (
          filtered.map(order => <OrderCard key={order.id} order={order} onNavigate={navigate} />)
        )}
      </div>
    </div>
  );
}