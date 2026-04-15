// @ts-nocheck
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";

const STATS = [
  { label: "Total Products", value: "24", icon: "📦" },
  { label: "Orders This Month", value: "12", icon: "🛒" },
  { label: "Revenue This Month", value: "$1,240", icon: "💰" },
  { label: "Average Rating", value: "4.8★", icon: "⭐" },
];

const SALES_DATA = [
  { date: "Day 1", sales: 120 },
  { date: "Day 5", sales: 320 },
  { date: "Day 10", sales: 280 },
  { date: "Day 15", sales: 450 },
  { date: "Day 20", sales: 380 },
  { date: "Day 25", sales: 520 },
  { date: "Day 30", sales: 680 },
];

const TOP_PRODUCTS = [
  { name: "Cement 50kg", sales: 156, revenue: "$624" },
  { name: "Steel Rods 10mm", sales: 89, revenue: "$356" },
  { name: "Floor Tiles 60x60", sales: 72, revenue: "$288" },
  { name: "Paint 20L", sales: 45, revenue: "$180" },
  { name: "Electrical Sockets", sales: 38, revenue: "$152" },
];

const RECENT_ORDERS = [
  { id: "#ORD-2025-001", product: "Cement 50kg (x10)", buyer: "Ahmed Hassan", amount: "$120", status: "Pending", date: "Today" },
  { id: "#ORD-2025-002", product: "Steel Rods 10mm (x5)", buyer: "Fatima Mohamed", amount: "$225", status: "Confirmed", date: "Yesterday" },
  { id: "#ORD-2025-003", product: "Floor Tiles 60x60 (x20)", buyer: "Omar Ahmed", amount: "$310", status: "Shipped", date: "2 days ago" },
  { id: "#ORD-2025-004", product: "Paint 20L (x3)", buyer: "Layla Hassan", amount: "$45", status: "Delivered", date: "3 days ago" },
  { id: "#ORD-2025-005", product: "Electrical Sockets (x50)", buyer: "Khaled Ali", amount: "$125", status: "Confirmed", date: "5 days ago" },
];

const LOW_STOCK_PRODUCTS = [
  { id: 1, name: "Premium Electrical Cable 2.5mm", stock: 3 },
  { id: 2, name: "Circuit Breaker MCB 63A", stock: 2 },
];

export default function KemetroSellerOverview({ storeName = "Your Store" }) {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Welcome, {storeName}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Sales Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top 5 Products</h3>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-gray-900">{prod.name}</span>
                  <span className="text-teal-600 font-bold">{prod.revenue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500"
                      style={{ width: `${(prod.sales / 156) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs">{prod.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Sales by Product Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={TOP_PRODUCTS.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Low Stock Alert */}
      {LOW_STOCK_PRODUCTS.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 mb-3">⚠️ Low Stock Alert</h3>
              <div className="space-y-2">
                {LOW_STOCK_PRODUCTS.map((prod) => (
                  <div key={prod.id} className="text-sm text-yellow-800">
                    <strong>{prod.name}</strong>: Only {prod.stock} units left
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
        <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Order #</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Product</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Buyer</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Amount</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Date</th>
              <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-semibold text-gray-900">{order.id}</td>
                <td className="px-4 py-3 text-gray-700">{order.product}</td>
                <td className="px-4 py-3 text-gray-700">{order.buyer}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{order.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Confirmed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{order.date}</td>
                <td className="px-4 py-3">
                  <button className="text-teal-600 hover:text-teal-700 font-bold text-xs">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}