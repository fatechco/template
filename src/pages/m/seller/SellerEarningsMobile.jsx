import { useState } from "react";
import { Menu, Download } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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
];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Cleared: "bg-blue-100 text-blue-700",
  Paid: "bg-green-100 text-green-700",
};

const PERIODS = ["Today", "This Week", "This Month", "Last Month", "3 Months", "All Time"];

export default function SellerEarningsMobile({ onOpenDrawer }) {
  const [period, setPeriod] = useState("This Month");
  const [showPayout, setShowPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");

  const totalGross = TRANSACTIONS.reduce((s, t) => s + t.gross, 0);
  const totalCommission = TRANSACTIONS.reduce((s, t) => s + t.commission, 0);
  const totalNet = TRANSACTIONS.reduce((s, t) => s + t.net, 0);
  const pendingPayout = TRANSACTIONS.filter(t => t.status === "Cleared").reduce((s, t) => s + t.net, 0);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">Earnings</span>
        <button className="p-1"><Download size={22} className="text-gray-700" /></button>
      </div>

      <div className="pb-28 space-y-4 pt-4 px-4">
        {/* Balance Card */}
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
          <p className="text-white/80 text-sm">Available Balance</p>
          <p className="text-4xl font-black mt-1">${pendingPayout.toFixed(2)}</p>
          <div className="flex gap-4 mt-3 text-sm text-white/80">
            <span>Pending: $71.25</span>
            <span>Total Earned: ${totalNet.toFixed(2)}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowPayout(true)} className="flex-1 bg-white text-green-700 font-bold py-2.5 rounded-xl text-sm">⬆️ Request Payout</button>
            <button className="flex-1 bg-white/20 text-white font-bold py-2.5 rounded-xl text-sm border border-white/30">📋 History</button>
          </div>
        </div>

        {/* Plan & Commission */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <span className="bg-teal-100 text-teal-700 text-xs font-black px-2.5 py-1 rounded-full">Professional</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Current Plan: Professional</p>
            <p className="text-xs text-gray-500">Commission rate: 5% per sale</p>
          </div>
          <button className="text-xs text-[#0077B6] font-bold border border-[#0077B6] px-2.5 py-1 rounded-lg">Upgrade</button>
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                period === p ? "bg-[#0077B6] text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}>{p}</button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Gross Revenue", value: `$${totalGross.toFixed(2)}`, color: "text-[#0077B6]", bg: "bg-blue-50" },
            { label: "Platform Fee (5%)", value: `-$${totalCommission.toFixed(2)}`, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Net Earnings", value: `$${totalNet.toFixed(2)}`, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Payout", value: `$${pendingPayout.toFixed(2)}`, color: "text-yellow-600", bg: "bg-yellow-50" },
          ].map((kpi, i) => (
            <div key={i} className={`${kpi.bg} rounded-2xl p-4 border border-gray-100`}>
              <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Earnings Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-black text-gray-900 text-sm mb-4">Net Earnings Trend</p>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={35} />
              <Tooltip formatter={v => `$${v}`} />
              <Line type="monotone" dataKey="earnings" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#14b8a6", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Next Payout */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start justify-between">
          <div>
            <p className="font-bold text-teal-900 text-sm">Next Payout: March 25, 2025</p>
            <p className="text-teal-700 text-xs mt-0.5">Est. ${pendingPayout.toFixed(2)} · Bank ••••4782</p>
          </div>
          <button className="bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Manage</button>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">Transaction History</p>
          </div>
          <div className="divide-y divide-gray-50">
            {TRANSACTIONS.map(t => (
              <div key={t.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs font-black text-[#0077B6] font-mono">{t.id}</p>
                    <p className="text-xs text-gray-700 font-semibold line-clamp-1">{t.product}</p>
                    <p className="text-[11px] text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-600">+${t.gross.toFixed(2)}</p>
                    <p className="text-xs text-red-500">-${t.commission.toFixed(2)} fee</p>
                    <p className="text-xs font-black text-teal-700">=${t.net.toFixed(2)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout Sheet */}
      {showPayout && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPayout(false)} />
          <div className="relative bg-white rounded-t-3xl w-full px-5 pt-5 pb-10 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-black text-gray-900 text-lg mb-2">Request Payout</p>
            <p className="text-3xl font-black text-green-600 mb-4">${pendingPayout.toFixed(2)} available</p>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Amount ($)</label>
            <div className="flex items-center border border-gray-200 rounded-xl mb-4 overflow-hidden" style={{ height: 52 }}>
              <span className="px-4 text-gray-400 font-bold">$</span>
              <input type="number" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)}
                placeholder="0.00" className="flex-1 focus:outline-none text-sm" />
              <button onClick={() => setPayoutAmount(pendingPayout.toFixed(2))} className="px-3 text-xs text-[#0077B6] font-bold">Withdraw all</button>
            </div>
            <div className="space-y-2 mb-4">
              {[{ label: "Bank Transfer", sub: "Bank ••••4782 · 3-5 business days" }, { label: "XeedWallet", sub: "Balance: $45.00 · Instant" }].map((m, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                  <input type="radio" name="payout" className="accent-[#0077B6]" defaultChecked={i === 0} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.sub}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-4">Payout fee: $2.50 · You receive: <strong className="text-green-600">${(parseFloat(payoutAmount || 0) - 2.5).toFixed(2)}</strong></p>
            <button onClick={() => setShowPayout(false)} className="w-full bg-green-600 text-white font-bold py-3.5 rounded-2xl mb-2">Submit Payout Request</button>
            <button onClick={() => setShowPayout(false)} className="w-full text-gray-500 font-bold py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}