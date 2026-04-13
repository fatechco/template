import { Menu, Download, TrendingUp, Package, DollarSign, BarChart3 } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CHART_DATA = [
  { date: "Mar 1", earnings: 450 },
  { date: "Mar 3", earnings: 620 },
  { date: "Mar 5", earnings: 380 },
  { date: "Mar 7", earnings: 890 },
  { date: "Mar 9", earnings: 560 },
  { date: "Mar 11", earnings: 1200 },
  { date: "Mar 13", earnings: 980 },
];

const TRANSACTIONS = [
  { id: "TXN-001", date: "2025-03-15", orderId: "ORD-2025-001", product: "Product A", gross: 75.0, commission: 3.75, net: 71.25, status: "Pending" },
  { id: "TXN-002", date: "2025-03-14", orderId: "ORD-2025-002", product: "Product B", gross: 150.0, commission: 7.5, net: 142.5, status: "Cleared" },
  { id: "TXN-003", date: "2025-03-12", orderId: "ORD-2025-003", product: "Product C", gross: 200.0, commission: 10.0, net: 190.0, status: "Paid" },
];

export default function SellerEarningsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateRange, setDateRange] = useState("month");

  const totalEarnings = 4230.5;
  const pendingPayout = 1340.25;
  const totalOrders = 156;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title="Earnings"
          rightAction={
            <button onClick={() => setDrawerOpen(true)} className="p-1">
              <Menu size={22} className="text-gray-700" />
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-5">
            <p className="text-sm opacity-90">Available Balance</p>
            <p className="text-4xl font-black mt-1">$2,890.25</p>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
              <div>
                <p className="text-xs opacity-90">Pending</p>
                <p className="font-bold text-lg">${pendingPayout.toFixed(2)}</p>
                <p className="text-xs opacity-75">Clears in 3-5 days</p>
              </div>
              <div>
                <p className="text-xs opacity-90">Total Earned</p>
                <p className="font-bold text-lg">${totalEarnings.toFixed(2)}</p>
                <p className="text-xs opacity-75">All time</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-white text-green-600 font-bold text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors">
                ⬆️ Request Payout
              </button>
              <button className="flex-1 border border-white text-white font-bold text-sm py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                📋 History
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: `$${totalEarnings.toFixed(2)}`, icon: "💰", color: "green" },
              { label: "Orders", value: totalOrders, icon: "📦", color: "blue" },
              { label: "Avg/Order", value: "$27.12", icon: "📊", color: "teal" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className={`text-sm font-black ${stat.color === "green" ? "text-green-600" : stat.color === "blue" ? "text-blue-600" : "text-teal-600"}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {["Today", "Week", "Month", "3M", "All"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                  dateRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="font-bold text-gray-900 mb-4">Revenue Trend</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Line type="monotone" dataKey="earnings" stroke="#0077B6" strokeWidth={2} dot={{ fill: "#0077B6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="font-bold text-gray-900 mb-3">Top Products</p>
            <div className="space-y-2">
              {[
                { name: "Product A", orders: 45, revenue: 1350 },
                { name: "Product B", orders: 38, revenue: 1140 },
                { name: "Product C", orders: 73, revenue: 1740 },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.orders} orders</p>
                  </div>
                  <p className="font-bold text-blue-600">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-bold text-gray-900">Transactions</p>
            </div>
            <div className="divide-y divide-gray-100">
              {TRANSACTIONS.map((txn) => (
                <div key={txn.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{txn.product}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{txn.date}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      txn.status === "Paid" ? "bg-green-100 text-green-700"
                      : txn.status === "Cleared" ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order {txn.orderId}</span>
                    <span className="font-bold text-green-600">+${txn.net.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}