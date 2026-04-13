import { useState } from "react";
import { X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const MONTHLY_DATA = [
  { month: "Apr", amount: 1200 }, { month: "May", amount: 1800 }, { month: "Jun", amount: 980 },
  { month: "Jul", amount: 2200 }, { month: "Aug", amount: 1650 }, { month: "Sep", amount: 2800 },
  { month: "Oct", amount: 3100 }, { month: "Nov", amount: 2400 }, { month: "Dec", amount: 3600 },
  { month: "Jan", amount: 2900 }, { month: "Feb", amount: 3200 }, { month: "Mar", amount: 2340 },
];

const PIE_DATA = [
  { name: "Interior Design", value: 6800, color: "#0D9488" },
  { name: "Electrical", value: 2400, color: "#3B82F6" },
  { name: "Landscaping", value: 1200, color: "#10B981" },
  { name: "Carpentry", value: 900, color: "#F59E0B" },
  { name: "Other", value: 560, color: "#8B5CF6" },
];

const TRANSACTIONS = [
  { id: "KW-00421", client: "Fatima Al-Zahra", service: "Kitchen Cabinet Installation", amount: 1800, commission: 180, net: 1620, status: "Pending", date: "Mar 20" },
  { id: "KW-00398", client: "Karim Mansour", service: "Plumbing Repair", amount: 350, commission: 35, net: 315, status: "Available", date: "Mar 5" },
  { id: "KW-00355", client: "Nour Salem", service: "Electrical Panel Upgrade", amount: 900, commission: 90, net: 810, status: "Available", date: "Mar 18" },
  { id: "KW-00310", client: "Ahmed Badr", service: "Interior Painting", amount: 450, commission: 45, net: 405, status: "Available", date: "Mar 5" },
  { id: "KW-00288", client: "Layla Nour", service: "Garden Landscaping", amount: 2200, commission: 220, net: 1980, status: "Paid", date: "Feb 20" },
];

export default function ProEarningsPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");

  const available = 3130;
  const pending = 1620;
  const total = 11860;

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[1000px] mx-auto">
          <h1 className="text-xl font-black text-gray-900">Earnings</h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 py-5 space-y-5">

        {/* Balance Card */}
        <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-teal-100 text-xs mb-1">Available Balance</p>
              <p className="text-3xl font-black text-white">${available.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs mb-1">Pending</p>
              <p className="text-2xl font-black text-white/80">${pending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs mb-1">Total Earned</p>
              <p className="text-2xl font-black text-white/80">${total.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPayoutModal(true)} className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-white text-teal-700 hover:bg-teal-50 transition-colors">
              Request Payout
            </button>
            <button className="flex-1 py-2.5 rounded-xl font-bold text-sm border-2 border-white/50 text-white hover:bg-white/10 transition-colors">
              Add Bank Account
            </button>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="font-black text-gray-900 text-sm mb-4">Revenue by Service</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="font-black text-gray-900 text-sm mb-4">Monthly Revenue</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DATA} barSize={14}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="amount" fill="#0D9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">Transaction History</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Order#", "Client", "Service", "Amount", "Commission", "Net", "Status", "Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-bold text-teal-700">{t.id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{t.client}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[140px] truncate">{t.service}</td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-900">${t.amount}</td>
                    <td className="px-4 py-3 text-xs text-red-600">-${t.commission}</td>
                    <td className="px-4 py-3 text-xs font-black text-teal-700">${t.net}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "Available" ? "bg-green-100 text-green-700" : t.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPayoutModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-gray-900">Request Payout</p>
              <button onClick={() => setShowPayoutModal(false)}><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Available: <span className="font-black text-teal-700">${available.toLocaleString()}</span></p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Amount</label>
                <input type="number" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} max={available} placeholder="Enter amount" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Payout Method</label>
                <div className="flex flex-col gap-2">
                  {["🏦 Bank Account — ****4521", "💳 XeedWallet", "🌍 PayPal"].map(m => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-teal-400">
                      <input type="radio" name="payout_method" className="accent-teal-600" />
                      <span className="text-sm font-semibold text-gray-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: "#0D9488" }}>Confirm Payout Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}