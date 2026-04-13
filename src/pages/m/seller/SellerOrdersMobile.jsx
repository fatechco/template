import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-2025-001", date: "2025-03-15", buyer: "Ahmed Hassan", buyerPhone: "+20 100 123 4567", product: "Premium Cement 50kg", qty: 10, amount: 75.00, status: "Pending", city: "Cairo, Egypt", time: "5 mins ago", payment: "Credit Card" },
  { id: "ORD-2025-002", date: "2025-03-14", buyer: "Fatima Mohamed", buyerPhone: "+966 50 234 5678", product: "Steel Rods 10mm (ton)", qty: 2, amount: 840.00, status: "Confirmed", city: "Riyadh, KSA", time: "1h ago", payment: "Bank Transfer" },
  { id: "ORD-2025-003", date: "2025-03-12", buyer: "Omar Al-Rashid", buyerPhone: "+971 55 345 6789", product: "Ceramic Tiles 60×60", qty: 50, amount: 1425.00, status: "Shipped", city: "Dubai, UAE", time: "2 days ago", payment: "Credit Card" },
  { id: "ORD-2025-004", date: "2025-03-10", buyer: "Layla Hassan", buyerPhone: "+20 111 456 7890", product: "Wall Paint Matte 20L", qty: 3, amount: 149.97, status: "Delivered", city: "Alexandria, Egypt", time: "3 days ago", payment: "Cash" },
  { id: "ORD-2025-005", date: "2025-03-08", buyer: "Khaled Ali", buyerPhone: "+20 122 567 8901", product: "Electrical Cable 2.5mm", qty: 5, amount: 190.00, status: "Cancelled", city: "Giza, Egypt", time: "5 days ago", payment: "Wallet" },
];

const STATUS_CONFIG = {
  Pending:   { badge: "bg-red-100 text-red-700", border: "border-l-red-400" },
  Confirmed: { badge: "bg-blue-100 text-blue-700", border: "border-l-blue-400" },
  Shipped:   { badge: "bg-teal-100 text-teal-700", border: "border-l-teal-400" },
  Delivered: { badge: "bg-green-100 text-green-700", border: "border-l-green-400" },
  Cancelled: { badge: "bg-gray-100 text-gray-600", border: "border-l-gray-400" },
  Returns:   { badge: "bg-orange-100 text-orange-700", border: "border-l-orange-400" },
};

const TABS = ["New", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returns"];

export default function SellerOrdersMobile({ onOpenDrawer }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("New");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [confirmModal, setConfirmModal] = useState(null);

  const tabToStatus = { New: "Pending", Confirmed: "Confirmed", Processing: "Processing", Shipped: "Shipped", Delivered: "Delivered", Cancelled: "Cancelled", Returns: "Returns" };

  const counts = TABS.reduce((acc, t) => {
    acc[t] = orders.filter(o => o.status === tabToStatus[t]).length;
    return acc;
  }, {});

  const filtered = orders.filter(o => {
    const matchTab = tabToStatus[activeTab] === o.status || (activeTab === "Processing" && o.status === "Processing");
    const matchSearch = o.id.includes(search) || o.product.toLowerCase().includes(search.toLowerCase()) || o.buyer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const advanceStatus = (id) => {
    const map = { Pending: "Confirmed", Confirmed: "Shipped", Shipped: "Delivered" };
    setOrders(prev => prev.map(o => o.id === id && map[o.status] ? { ...o, status: map[o.status] } : o));
    setConfirmModal(null);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">My Orders</span>
        <button className="p-1"><Search size={22} className="text-gray-700" /></button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input type="text" placeholder="Search by order # or product..." value={search}
            onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                activeTab === tab ? "bg-[#0077B6] text-white" : "bg-white border border-[#0077B6] text-[#0077B6]"
              }`}>
              {tab === "New" && counts[tab] > 0 ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{tab} ({counts[tab]})</span> : `${tab} (${counts[tab]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="px-4 py-4 pb-28 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-bold text-gray-700">No orders in this category</p>
          </div>
        ) : filtered.map(order => {
          const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.Cancelled;
          return (
            <div key={order.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${sc.border} overflow-hidden`}>
              {/* Header */}
              <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
                <p className="text-xs font-black text-gray-700">{order.id}</p>
                <p className="text-[11px] text-gray-400">{order.time}</p>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sc.badge}`}>{order.status}</span>
              </div>
              <div className="p-4">
                {/* Buyer */}
                <p className="text-xs text-gray-500 mb-2">📍 {order.city} · 💳 {order.payment}</p>
                {/* Product */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{order.product}</p>
                    <p className="text-xs text-gray-500">Qty: {order.qty}</p>
                  </div>
                  <p className="font-black text-gray-900 text-base">${order.amount.toFixed(2)}</p>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  {order.status === "Pending" && <>
                    <button onClick={() => setConfirmModal(order)} className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl">✅ Confirm Order</button>
                    <button className="flex-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2.5 rounded-xl">❌ Reject</button>
                  </>}
                  {order.status === "Confirmed" && <button onClick={() => advanceStatus(order.id)} className="w-full bg-[#0077B6] text-white text-xs font-bold py-2.5 rounded-xl">🚚 Arrange Shipping</button>}
                  {order.status === "Shipped" && <button onClick={() => advanceStatus(order.id)} className="flex-1 bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl">📍 Update Tracking</button>}
                  {order.status === "Delivered" && <button className="flex-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold py-2.5 rounded-xl">⭐ View Review</button>}
                  {["Pending","Confirmed","Shipped","Delivered"].includes(order.status) && (
                    <button className="px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500">💬</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmModal(null)} />
          <div className="relative bg-white rounded-t-3xl w-full px-5 pt-5 pb-8">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-black text-gray-900 text-base mb-4">Confirm Order {confirmModal.id}?</p>
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
              <p className="font-bold text-gray-900">{confirmModal.product}</p>
              <p className="text-gray-500">Qty: {confirmModal.qty} · Total: ${confirmModal.amount.toFixed(2)}</p>
            </div>
            <button onClick={() => advanceStatus(confirmModal.id)} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-2xl mb-2">✅ Confirm & Notify Buyer</button>
            <button onClick={() => setConfirmModal(null)} className="w-full text-gray-500 font-bold py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}