import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Package, DollarSign, CheckCircle, XCircle, Clock, Truck } from "lucide-react";

const MOCK_ORDERS = [
  { id: 1, orderNum: "#KM12346", product: "Office Chair Ergonomic", quantity: 2, buyer: "Ahmed Hassan", city: "Cairo", amount: 360, status: "pending", time: "5 mins ago" },
  { id: 2, orderNum: "#KM12345", product: "LED Desk Lamp", quantity: 1, buyer: "Fatima Ali", city: "Giza", amount: 45, status: "pending", time: "12 mins ago" },
  { id: 3, orderNum: "#KM12344", product: "Filing Cabinet", quantity: 1, buyer: "Mohamed Samir", city: "Alexandria", amount: 95, status: "confirmed", time: "1h ago" },
  { id: 4, orderNum: "#KM12343", product: "Standing Desk", quantity: 1, buyer: "Sara Mohamed", city: "Cairo", amount: 350, status: "shipped", time: "3h ago" },
  { id: 5, orderNum: "#KM12342", product: "Monitor Stand", quantity: 3, buyer: "Omar Farouk", city: "Luxor", amount: 195, status: "delivered", time: "1d ago" },
];

const STATUS_CONFIG = {
  pending: { badge: "bg-yellow-100 text-yellow-700", label: "⏳ Pending", icon: Clock, color: "text-yellow-600" },
  confirmed: { badge: "bg-green-100 text-green-700", label: "✅ Confirmed", icon: CheckCircle, color: "text-green-600" },
  shipped: { badge: "bg-blue-100 text-blue-700", label: "🚚 Shipped", icon: Truck, color: "text-blue-600" },
  delivered: { badge: "bg-teal-100 text-teal-700", label: "📦 Delivered", icon: Package, color: "text-teal-600" },
  cancelled: { badge: "bg-red-100 text-red-700", label: "❌ Cancelled", icon: XCircle, color: "text-red-600" },
};

export default function SellerCPOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = MOCK_ORDERS.filter(order => {
    const matchesSearch = order.product.toLowerCase().includes(search.toLowerCase()) || 
      order.orderNum.toLowerCase().includes(search.toLowerCase()) ||
      order.buyer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: MOCK_ORDERS.filter(o => o.status === "pending").length,
    confirmed: MOCK_ORDERS.filter(o => o.status === "confirmed").length,
    shipped: MOCK_ORDERS.filter(o => o.status === "shipped").length,
    total: MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0),
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black">📋 My Orders</h1>
            <p className="text-teal-100 text-sm mt-1">Manage and track all customer orders</p>
          </div>
          <Package size={32} className="opacity-80" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-black">{stats.pending}</p>
            <p className="text-[10px] text-teal-100 font-medium">Pending</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-black">{stats.confirmed}</p>
            <p className="text-[10px] text-teal-100 font-medium">Confirmed</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-2xl font-black">${stats.total}</p>
            <p className="text-[10px] text-teal-100 font-medium">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {["all", "pending", "confirmed", "shipped", "delivered"].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              statusFilter === status
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map(order => {
          const sc = STATUS_CONFIG[order.status];
          const StatusIcon = sc.icon;
          return (
            <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500">{order.orderNum}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${sc.badge}`}>
                      <StatusIcon size={8} /> {sc.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{order.product}</h3>
                  <p className="text-xs text-gray-400 mt-1">Qty: {order.quantity} · 📍 {order.city}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900 text-lg">${order.amount}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-xs font-black text-teal-700">
                    {order.buyer.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">{order.buyer}</span>
                </div>
                {order.status === "pending" && (
                  <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      ✅ Confirm
                    </button>
                    <button className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg border border-red-200 transition-colors">
                      ❌ Reject
                    </button>
                  </div>
                )}
                {order.status !== "pending" && (
                  <button 
                    onClick={() => navigate(`/m/cp/seller/orders/${order.id}`)}
                    className="text-teal-600 hover:text-teal-700 text-xs font-bold"
                  >
                    View Details →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <p className="font-bold text-gray-700 text-lg mb-1">No orders found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}