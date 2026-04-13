import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Clock, Download } from "lucide-react";

const MONTHLY_DATA = [
  { month: "Sep", earnings: 820, orders: 18 },
  { month: "Oct", earnings: 1100, orders: 24 },
  { month: "Nov", earnings: 950, orders: 21 },
  { month: "Dec", earnings: 1540, orders: 34 },
  { month: "Jan", earnings: 1280, orders: 29 },
  { month: "Feb", earnings: 1620, orders: 38 },
  { month: "Mar", earnings: 1240, orders: 27 },
];

const TRANSACTIONS = [
  { id: "TXN-001", date: "2025-03-15", orderId: "ORD-2025-001", product: "Premium Cement 50kg ×10", gross: 75.00, commission: 3.75, net: 71.25, status: "Pending" },
  { id: "TXN-002", date: "2025-03-14", orderId: "ORD-2025-002", product: "Steel Rods 10mm ×2", gross: 840.00, commission: 42.00, net: 798.00, status: "Cleared" },
  { id: "TXN-003", date: "2025-03-12", orderId: "ORD-2025-003", product: "Ceramic Tiles 60×60 ×50", gross: 1425.00, commission: 71.25, net: 1353.75, status: "Cleared" },
  { id: "TXN-004", date: "2025-03-10", orderId: "ORD-2025-004", product: "Wall Paint 20L ×3", gross: 149.97, commission: 7.50, net: 142.47, status: "Paid" },
  { id: "TXN-005", date: "2025-03-08", orderId: "ORD-2025-005", product: "Electrical Cable ×5", gross: 190.00, commission: 9.50, net: 180.50, status: "Paid" },
  { id: "TXN-006", date: "2025-03-07", orderId: "ORD-2025-006", product: "Premium Cement 50kg ×20", gross: 150.00, commission: 7.50, net: 142.50, status: "Paid" },
];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Cleared: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
};

const PERIODS = ["Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "All Time"];

export default function KemetroSellerEarnings() {
  const [period, setPeriod] = useState("Last 6 Months");

  const totalGross = TRANSACTIONS.reduce((s, t) => s + t.gross, 0);
  const totalCommission = TRANSACTIONS.reduce((s, t) => s + t.commission, 0);
  const totalNet = TRANSACTIONS.reduce((s, t) => s + t.net, 0);
  const pendingPayout = TRANSACTIONS.filter(t => t.status === "Cleared").reduce((s, t) => s + t.net, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Earnings</h1>
          <p className="text-gray-500 text-sm mt-1">Track your revenue, commissions, and payouts</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue", value: `$${totalGross.toFixed(2)}`, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
          { label: "Platform Commission (5%)", value: `$${totalCommission.toFixed(2)}`, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
          { label: "Net Earnings", value: `$${totalNet.toFixed(2)}`, icon: DollarSign, color: "bg-teal-50 text-teal-600" },
          { label: "Pending Payout", value: `$${pendingPayout.toFixed(2)}`, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon size={20} />
            </div>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Net Earnings Trend</h3>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
              {PERIODS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${v}`} />
              <Line type="monotone" dataKey="earnings" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#14b8a6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Orders per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout info banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-teal-900">Next Payout: <span className="text-teal-700">March 25, 2025</span></p>
          <p className="text-teal-700 text-sm">Estimated amount: <strong>${pendingPayout.toFixed(2)}</strong> · Bank transfer to account ending ••••4782</p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors">
          Manage Payout
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Transaction</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Order</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Product</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Gross</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Commission</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Net</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono text-xs text-teal-700 font-bold">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{t.orderId}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{t.product}</td>
                  <td className="px-4 py-3 text-right text-gray-900 font-semibold">${t.gross.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-red-500">-${t.commission.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-black text-teal-700">${t.net.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}