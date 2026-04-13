import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Share2, Copy } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const STATUS_CONFIG = {
  pending: { label: "Pending", badge: "bg-yellow-100 text-yellow-700" },
  processing: { label: "Processing", badge: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", badge: "bg-teal-100 text-teal-700" },
  delivered: { label: "Delivered", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-500" },
  returned: { label: "Returned", badge: "bg-red-100 text-red-600" },
};

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "returned", label: "Returned" },
];

const MOCK_ORDERS = [
  {
    id: 1, num: "KT-00234", status: "shipped", date: "Mar 15, 2026",
    store: { name: "HomeStyle Store", logo: "🏠" },
    products: [
      { id: 1, name: "LED Desk Lamp - Modern", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&q=70", qty: 2, price: 45 },
      { id: 2, name: "Ergonomic Chair Pro", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=100&q=70", qty: 1, price: 120 },
    ],
    subtotal: 210, shipping: 15, total: 225,
  },
  {
    id: 2, num: "KT-00231", status: "delivered", date: "Mar 10, 2026",
    store: { name: "DecorPlus", logo: "🪴" },
    products: [
      { id: 3, name: "Wall Mirror Gold Frame 60×60", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=100&q=70", qty: 2, price: 75 },
      { id: 4, name: "Ceramic Vase Set", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&q=70", qty: 1, price: 35 },
    ],
    subtotal: 185, shipping: 0, total: 185,
  },
  {
    id: 3, num: "KT-00228", status: "pending", date: "Mar 18, 2026",
    store: { name: "TechZone", logo: "💻" },
    products: [
      { id: 5, name: "Wireless Keyboard & Mouse", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&q=70", qty: 1, price: 89 },
    ],
    subtotal: 89, shipping: 10, total: 99,
  },
  {
    id: 4, num: "KT-00220", status: "cancelled", date: "Mar 5, 2026",
    store: { name: "HomeStyle Store", logo: "🏠" },
    products: [
      { id: 6, name: "Smart Light Bulb Pack", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=70", qty: 3, price: 22 },
    ],
    subtotal: 66, shipping: 8, total: 74,
  },
];

function OrderActions({ status }) {
  if (status === "shipped") return (
    <button className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm">📦 Track Order</button>
  );
  if (status === "delivered") return (
    <div className="flex gap-2">
      <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm">⭐ Rate Order</button>
      <button className="flex-1 border border-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-sm">🔄 Return</button>
    </div>
  );
  if (status === "pending" || status === "processing") return (
    <button className="w-full border border-red-400 text-red-500 font-bold py-2.5 rounded-xl text-sm">❌ Cancel Order</button>
  );
  if (status === "cancelled") return (
    <button className="w-full border border-gray-300 text-gray-700 font-bold py-2.5 rounded-xl text-sm">🔄 Reorder</button>
  );
  return null;
}

function OrderCard({ order, onClick }) {
  const sc = STATUS_CONFIG[order.status];
  const shown = order.products.slice(0, 2);
  const extra = order.products.length - 2;

  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer">
      {/* Header strip */}
      <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-[12px] font-bold text-gray-800">Order #{order.num}</p>
          <p className="text-[11px] text-gray-400">{order.date}</p>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${sc.badge}`}>{sc.label}</span>
      </div>

      <div className="p-4">
        {/* Store row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">{order.store.logo}</span>
            <p className="text-[12px] font-black text-gray-900">{order.store.name}</p>
          </div>
          <p className="text-[11px] text-gray-400">{order.products.length} item{order.products.length > 1 ? "s" : ""}</p>
        </div>

        {/* Products */}
        <div className="space-y-2 mb-3">
          {shown.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <p className="flex-1 text-[13px] text-gray-800 line-clamp-1">{p.name}</p>
              <p className="text-[12px] text-gray-500 flex-shrink-0">{p.qty} × ${p.price}</p>
            </div>
          ))}
          {extra > 0 && <p className="text-[12px] text-gray-400">+{extra} more item{extra > 1 ? "s" : ""}</p>}
        </div>

        {/* Totals */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
          <p className="text-[12px] text-gray-400">
            ${order.subtotal} + ${order.shipping} shipping
          </p>
          <p className="text-[14px] font-black text-orange-600">Total: ${order.total}</p>
        </div>

        {/* Actions */}
        <OrderActions status={order.status} />
      </div>
    </div>
  );
}

// ── Order Detail Page ─────────────────────────────────────────────
const TIMELINE_STEPS = ["Placed", "Confirmed", "Processing", "Shipped", "Delivered"];

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = MOCK_ORDERS.find(o => o.id === parseInt(id)) || MOCK_ORDERS[0];
  const currentStep = { pending: 0, processing: 2, shipped: 3, delivered: 4, cancelled: 0 }[order.status] ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title={`Order #${order.num}`} showBack
        rightAction={<button><Share2 size={20} className="text-gray-700" /></button>} />

      {/* Timeline */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
        <p className="font-black text-gray-900 text-sm mb-4">Order Status</p>
        <div className="flex items-center">
          {TIMELINE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  i < currentStep ? "bg-green-500 text-white" :
                  i === currentStep ? "bg-orange-500 text-white" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <p className={`text-[9px] font-bold mt-1 text-center ${
                  i === currentStep ? "text-orange-600" : i < currentStep ? "text-green-600" : "text-gray-400"
                }`}>{step}</p>
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tracking card (if shipped) */}
      {order.status === "shipped" && (
        <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          <p className="font-black text-gray-900 text-sm mb-3">Tracking</p>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Tracking #</p>
              <p className="text-sm font-bold text-gray-900">TRK-7788991234</p>
            </div>
            <button className="p-2 bg-gray-100 rounded-lg"><Copy size={14} className="text-gray-600" /></button>
          </div>
          <p className="text-xs text-gray-500 mb-2">Carrier: <span className="font-bold text-gray-800">Aramex</span></p>
          <button className="text-xs font-bold text-blue-600">📦 Track on Carrier Site →</button>
          <p className="text-xs text-gray-400 mt-2">Last update: In transit to destination — Mar 17, 2026</p>
        </div>
      )}

      {/* Products */}
      <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
        <p className="font-black text-gray-900 text-sm mb-3">Products</p>
        <div className="space-y-3">
          {order.products.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900 line-clamp-1">{p.name}</p>
                <p className="text-xs text-gray-400">Qty: {p.qty} · ${p.price} each</p>
                <p className="text-sm font-black text-gray-900">${p.qty * p.price}</p>
              </div>
              {order.status === "delivered" && (
                <button className="text-xs font-bold text-orange-600 border border-orange-200 px-2.5 py-1.5 rounded-lg flex-shrink-0">⭐ Rate</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
        <p className="font-black text-gray-900 text-sm mb-2">Delivery Address</p>
        <p className="text-sm text-gray-700">📍 Apt 14, Building 3, 5th Settlement</p>
        <p className="text-sm text-gray-700">New Cairo, Cairo, Egypt</p>
        <p className="text-xs text-gray-500 mt-1">Ahmed Mohamed · +20 100 123 4567</p>
      </div>

      {/* Payment */}
      <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
        <p className="font-black text-gray-900 text-sm mb-2">Payment</p>
        <p className="text-sm text-gray-700">💳 Visa •••• 1234</p>
        <p className="text-sm font-bold text-gray-900 mt-1">Amount: ${order.total}</p>
        <button className="text-xs font-bold text-blue-600 mt-2">📄 Download Invoice</button>
      </div>

      {/* Help */}
      <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
        <p className="font-black text-gray-900 text-sm mb-3">Need Help?</p>
        <div className="flex gap-2">
          <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">💬 Contact Seller</button>
          <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">🎫 Open Ticket</button>
        </div>
      </div>
    </div>
  );
}

export { OrderDetailPage as KemetroOrderDetailPageV2 };

// ── List Page ─────────────────────────────────────────────────────
export default function KemetroOrdersPageV2() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "all" ? MOCK_ORDERS.length : MOCK_ORDERS.filter(o => o.status === t.key).length;
    return acc;
  }, {});

  const filtered = activeTab === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="My Orders" showBack
        rightAction={<button><Search size={20} className="text-gray-700" /></button>} />

      {/* Tabs */}
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
          filtered.map(order => (
            <OrderCard key={order.id} order={order}
              onClick={() => navigate(`/m/kemetro/buyer/orders/${order.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}