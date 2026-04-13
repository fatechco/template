import { useState } from "react";
import { ArrowUp, ArrowDown, TrendingUp, Download, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const REVENUE_DATA = [
  { name: "Property Verification", value: 3200, color: "#FF6B00" },
  { name: "Premium Services", value: 2100, color: "#0077B6" },
  { name: "Kemetro Commission", value: 1800, color: "#2D6A4F" },
  { name: "Kemework Tasks", value: 950, color: "#D97706" },
];

const TRANSACTIONS = [
  { id: 1, service: "Property Verification", amount: 450, type: "income", date: "Today", time: "2:30 PM" },
  { id: 2, service: "Withdrawal", amount: 1000, type: "expense", date: "Today", time: "11:15 AM" },
  { id: 3, service: "Premium Service", amount: 300, type: "income", date: "Yesterday", time: "5:45 PM" },
  { id: 4, service: "Kemetro Commission", amount: 280, type: "income", date: "Yesterday", time: "3:20 PM" },
  { id: 5, service: "Withdrawal", amount: 500, type: "expense", date: "2 days ago", time: "10:00 AM" },
];

export default function FranchiseOwnerWallet() {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    method: "bank",
  });

  const totalBalance = 8050;
  const pendingBalance = 1200;
  const thisMonthRevenue = 3450;
  const lastMonthRevenue = 2890;

  const MONTHLY_DATA = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 2890 },
    { month: "Mar", revenue: 3450 },
    { month: "Apr", revenue: 3100 },
    { month: "May", revenue: 3800 },
  ];

  const handleWithdraw = () => {
    console.log("Withdrawal request:", withdrawForm);
    setShowWithdraw(false);
    setWithdrawForm({ amount: "", method: "bank" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">💰 Wallet & Revenue</h1>
            <p className="text-gray-500 text-sm mt-1">Track your earnings and manage withdrawals</p>
          </div>
          <button onClick={() => setShowWithdraw(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <ArrowUp size={18} /> Withdraw Funds
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-bold text-gray-500 uppercase">Available Balance</p>
            <p className="text-3xl font-black text-green-600 mt-2">${totalBalance.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">Pending: ${pendingBalance}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-bold text-gray-500 uppercase">This Month</p>
            <p className="text-3xl font-black text-blue-600 mt-2">${thisMonthRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 font-bold mt-1">↑ 19% vs last month</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-bold text-gray-500 uppercase">Last Month</p>
            <p className="text-3xl font-black text-gray-900 mt-2">${lastMonthRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">February</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-xs font-bold text-gray-500 uppercase">Total Earned</p>
            <p className="text-3xl font-black text-purple-600 mt-2">$24,580</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900">Monthly Revenue</h2>
              <button className="text-gray-400 hover:text-gray-600"><Filter size={18} /></button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Bar dataKey="revenue" fill="#FF6B00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Service */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-6">Revenue by Service</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={REVENUE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {REVENUE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {REVENUE_DATA.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="text-xs text-gray-600 flex-1 truncate">{item.name}</p>
                  <p className="text-xs font-bold text-gray-900">${item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-gray-900">Recent Transactions</h2>
            <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center gap-1">
              <Download size={16} /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Service</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Date & Time</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-600">Type</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TRANSACTIONS.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">{tx.service}</td>
                    <td className="px-4 py-4 text-gray-600">{tx.date} • {tx.time}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {tx.type === "income" ? "📈 Income" : "📉 Expense"}
                      </span>
                    </td>
                    <td className={`px-4 py-4 text-right font-bold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900">Withdraw Funds</h2>
                <p className="text-sm text-gray-500 mt-1">Available Balance: <span className="font-bold text-green-600">${totalBalance}</span></p>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-700 block mb-2">Amount</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                  <span className="text-gray-600 font-bold text-lg">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="flex-1 px-4 py-3 text-lg font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Method Selection */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-700 block mb-3">Withdrawal Method</label>
                <div className="space-y-2">
                  {[
                    { id: "bank", label: "🏦 Bank Transfer", details: "2-3 business days" },
                    { id: "xeed", label: "💳 XeedWallet", details: "Instant" },
                    { id: "cash", label: "💵 Cash Pickup", details: "1-2 hours" },
                  ].map(method => (
                    <label
                      key={method.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="method"
                        value={method.id}
                        checked={withdrawForm.method === method.id}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, method: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-gray-900">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.details}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Account Details</p>
                <p className="text-sm text-gray-700">National Bank</p>
                <p className="text-sm text-gray-700">•••• •••• •••• 1234</p>
                <button className="text-xs text-blue-600 font-bold mt-3 hover:underline">Change Account</button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}