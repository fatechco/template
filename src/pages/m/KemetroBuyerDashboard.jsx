import { useState } from "react";
import { ChevronRight, ShoppingCart, Heart, Package, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import ModuleSwitcher from "@/components/mobile-v2/ModuleSwitcher";
import KemetroBuyerDrawer from "@/components/dashboard/KemetroBuyerDrawer";

const ACTIVE_ORDERS = [
  { id: 1, orderNum: "#KM12345", product: "LED Desk Lamp", status: "shipped", thumb: "💡", eta: "Today" },
  { id: 2, orderNum: "#KM12344", product: "Wooden Chair", status: "delivered", thumb: "🪑", eta: "Delivered" },
];

const RECENTLY_VIEWED = [
  { id: 1, emoji: "🪑", name: "Office Chair", price: "$120", rating: 4.5 },
  { id: 2, emoji: "💡", name: "LED Light", price: "$45", rating: 4.8 },
  { id: 3, emoji: "🛏️", name: "Bedside Table", price: "$85", rating: 4.3 },
  { id: 4, emoji: "🪞", name: "Mirror", price: "$35", rating: 4.6 },
];

const FLASH_DEALS = [
  { id: 1, emoji: "🪑", name: "Office Chair", original: "$200", deal: "$120", discount: "40%" },
  { id: 2, emoji: "💡", name: "Smart Light", original: "$80", deal: "$48", discount: "40%" },
];

export default function KemetroBuyerDashboard() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);
  const [timeLeft] = useState({ hours: 5, mins: 32, secs: 18 });

  const stats = { orders: 12, wishlist: 8 };

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar
        title="Kemetro Shopping"
        rightAction={
          <button onClick={() => setShowModuleSwitcher(true)} className="p-1">
            <Menu size={22} className="text-gray-700" />
          </button>
        }
      />
      <KemetroBuyerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ModuleSwitcher isOpen={showModuleSwitcher} onClose={() => setShowModuleSwitcher(false)} />

      {/* Profile Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">Welcome back! 👋</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">Product Buyer</span>
        </div>
      </div>

      {/* Module Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl mb-1">🛒</p>
              <p className="font-black text-base">Kemetro Marketplace</p>
              <p className="text-sm text-blue-100 mt-1">Your shopping hub</p>
            </div>
            <button className="text-xl">→</button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">📦</p>
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="font-black text-gray-900">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl mb-1">❤️</p>
          <p className="text-xs text-gray-500 mb-1">Wishlist Items</p>
          <p className="font-black text-gray-900">{stats.wishlist}</p>
        </div>
      </div>

      {/* Active Orders */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">Active Orders</p>
          <button onClick={() => navigate("/m/dashboard/kemetro-orders")} className="text-xs text-blue-600 font-bold">
            Track All →
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {ACTIVE_ORDERS.map(order => (
            <div key={order.id} className="flex-shrink-0 w-48 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{order.thumb}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-bold">{order.orderNum}</p>
                  <p className="text-xs font-bold text-gray-900 truncate mt-1">{order.product}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status === "shipped" ? "🔵 Shipped" : "🟢 Delivered"}
                </span>
                <button className="text-xs text-blue-600 font-bold">Track →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="px-4 pb-4">
        <p className="text-sm font-black text-gray-900 mb-3">Recently Viewed</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {RECENTLY_VIEWED.map(item => (
            <div
              key={item.id}
              onClick={() => navigate("/m/product/" + item.id)}
              className="flex-shrink-0 w-36 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-3xl">{item.emoji}</div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{item.name}</p>
                <p className="text-sm font-black text-gray-900 mt-2">{item.price}</p>
                <p className="text-xs text-yellow-600 mt-1">⭐ {item.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Deals */}
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">🔥 Flash Deals</p>
          <div className="text-xs font-bold text-red-600">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.mins).padStart(2, "0")}:{String(timeLeft.secs).padStart(2, "0")}
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {FLASH_DEALS.map(deal => (
            <div key={deal.id} className="flex-shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="aspect-square bg-red-50 flex items-center justify-center text-4xl relative">
                {deal.emoji}
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded">{deal.discount}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900">{deal.name}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-sm font-black text-gray-900">{deal.deal}</p>
                  <p className="text-xs text-gray-400 line-through">{deal.original}</p>
                </div>
                <button className="w-full bg-orange-600 text-white text-xs font-bold py-2 rounded-lg mt-2">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}