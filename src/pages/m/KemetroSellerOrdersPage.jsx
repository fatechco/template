import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const SELLER_ORDERS = [
  { id: 1, orderNum: "#KM12346", time: "5 mins ago", status: "new", product: "Office Chair", buyer: "Cairo", amount: "$180" },
  { id: 2, orderNum: "#KM12345", time: "12 mins ago", status: "new", product: "LED Desk Lamp", buyer: "Giza", amount: "$45" },
  { id: 3, orderNum: "#KM12344", time: "2 hours ago", status: "new", product: "Monitor Stand", buyer: "New Cairo", amount: "$65" },
  { id: 4, orderNum: "#KM12343", time: "8 hours ago", status: "confirmed", product: "Keyboard", buyer: "Heliopolis", amount: "$95" },
  { id: 5, orderNum: "#KM12342", time: "1 day ago", status: "progress", product: "Mouse Pad", buyer: "6th Oct", amount: "$25" },
  { id: 6, orderNum: "#KM12341", time: "2 days ago", status: "shipped", product: "Desk Lamp", buyer: "Maadi", amount: "$55" },
  { id: 7, orderNum: "#KM12340", time: "3 days ago", status: "delivered", product: "Office Chair", buyer: "Zamalek", amount: "$180" },
];

const STATUS_CONFIG = {
  new: { badge: "🔴 New", color: "bg-red-100 text-red-700" },
  confirmed: { badge: "🟡 Confirmed", color: "bg-yellow-100 text-yellow-700" },
  progress: { badge: "🟠 Processing", color: "bg-orange-100 text-orange-700" },
  shipped: { badge: "🔵 Shipped", color: "bg-blue-100 text-blue-700" },
  delivered: { badge: "🟢 Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { badge: "⚪ Cancelled", color: "bg-gray-100 text-gray-700" },
};

const FILTERS = ["New", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function KemetroSellerOrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get("status") || "new");

  const filtered = activeFilter === "all" ? SELLER_ORDERS : SELLER_ORDERS.filter(o => o.status === activeFilter);

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar title="My Orders" showBack />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? "bg-teal-600 text-white"
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
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No orders found</p>
          </div>
        ) : (
          filtered.map(order => (
            <div
              key={order.id}
              onClick={() => navigate(`/m/dashboard/seller-orders/${order.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-bold text-gray-500">{order.orderNum}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_CONFIG[order.status].color}`}>
                  {STATUS_CONFIG[order.status].badge}
                </span>
              </div>

              {/* Product & Buyer */}
              <div className="mb-3">
                <p className="text-sm font-bold text-gray-900">{order.product}</p>
                <p className="text-xs text-gray-500 mt-1">Buyer: {order.buyer}</p>
              </div>

              {/* Amount */}
              <p className="font-black text-gray-900 text-lg mb-3">{order.amount}</p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {order.status === "new" && (
                  <>
                    <button className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700">
                      ✅ Confirm
                    </button>
                    <button className="flex-1 bg-red-100 text-red-600 text-xs font-bold py-2 rounded hover:bg-red-200">
                      ❌ Reject
                    </button>
                  </>
                )}
                {order.status === "confirmed" && (
                  <button className="flex-1 text-xs font-bold text-teal-600 py-2 hover:bg-teal-50 rounded">
                    🚚 Arrange Shipping
                  </button>
                )}
                {order.status === "shipped" && (
                  <button className="flex-1 text-xs font-bold text-teal-600 py-2 hover:bg-teal-50 rounded">
                    📍 Update Tracking
                  </button>
                )}
                {(order.status === "delivered" || order.status === "cancelled") && (
                  <button className="flex-1 text-xs font-bold text-gray-600 py-2 hover:bg-gray-100 rounded">
                    📄 View Details
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}