import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import { ChevronRight, Package, Clock, Truck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const ORDERS = [
  { id: 1, orderNum: "#KM12345", date: "Mar 15, 2026", status: "pending", store: "HomeStyle Store", product: "LED Desk Lamp", qty: 1, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=70", amount: 45, originalAmount: 65 },
  { id: 2, orderNum: "#KM12344", date: "Mar 14, 2026", status: "shipped", store: "Office Pro", product: "Ergonomic Chair", qty: 1, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&q=70", amount: 120, originalAmount: 150 },
  { id: 3, orderNum: "#KM12343", date: "Mar 12, 2026", status: "delivered", store: "HomeStyle Store", product: "Wooden Table", qty: 1, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70", amount: 280, originalAmount: 350 },
  { id: 4, orderNum: "#KM12342", date: "Mar 10, 2026", status: "delivered", store: "DecorPlus", product: "Wall Mirror", qty: 2, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=70", amount: 70, originalAmount: 100 },
  { id: 5, orderNum: "#KM12341", date: "Mar 08, 2026", status: "cancelled", store: "HomeStyle Store", product: "Smart Light", qty: 1, image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=200&q=70", amount: 65, originalAmount: 85 },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  shipped: { label: "Shipped", icon: Truck, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
  returned: { label: "Returned", icon: RotateCcw, color: "text-gray-600", bg: "bg-gray-50", badge: "bg-gray-100 text-gray-700" },
};

const FILTERS = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

function OrderCard({ order, onTap }) {
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const discount = Math.round(((order.originalAmount - order.amount) / order.originalAmount) * 100);

  return (
    <div
      onClick={onTap}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
    >
      {/* Status Bar */}
      <div className={`px-4 py-2.5 flex items-center gap-2 ${statusConfig.bg}`}>
        <StatusIcon size={16} className={statusConfig.color} />
        <span className="text-xs font-bold flex-1">{statusConfig.label}</span>
        <span className="text-[10px] text-gray-500">{order.date}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Order Number & Store */}
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-900">{order.orderNum}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{order.store}</p>
        </div>

        {/* Product */}
        <div className="flex gap-3 mb-4">
          <img src={order.image} alt={order.product} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-100" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{order.product}</p>
            <p className="text-xs text-gray-500 mb-2">Qty: {order.qty}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-900">${order.amount}</span>
              {discount > 0 && (
                <>
                  <span className="text-xs text-gray-400 line-through">${order.originalAmount}</span>
                  <span className="text-xs font-bold text-green-600">-{discount}%</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {order.status === "pending" && (
            <>
              <button className="flex-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-lg transition">Track</button>
              <button className="flex-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 py-2.5 rounded-lg transition">Cancel</button>
            </>
          )}
          {order.status === "shipped" && (
            <button className="flex-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-lg transition">Track Order</button>
          )}
          {order.status === "delivered" && (
            <>
              <button className="flex-1 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 py-2.5 rounded-lg transition">Review</button>
              <button className="flex-1 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-lg transition">Return</button>
            </>
          )}
          {order.status === "cancelled" && (
            <button className="w-full text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 py-2.5 rounded-lg transition">Details</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KemetroOrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get("status") || "all");

  const filtered = activeFilter === "all" ? ORDERS : ORDERS.filter(o => o.status === activeFilter.toLowerCase());

  return (
    <div className="min-h-full bg-gray-50 pb-24 max-w-[480px] mx-auto">
      <MobileTopBar title="My Orders" showBack />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
                activeFilter === filter.toLowerCase()
                  ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" />
            </div>
            <p className="font-bold text-gray-700 mb-1">No orders found</p>
            <p className="text-xs text-gray-500">Check back later or browse products</p>
          </div>
        ) : (
          filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onTap={() => navigate(`/m/dashboard/kemetro-orders/${order.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}