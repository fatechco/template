import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowRight, BarChart3, X } from "lucide-react";

const MOCK_TRANSACTIONS = [
  { date: "Mar 18", type: "Credit", desc: "Commission - Property Sale #ORD-041", amount: "+$840", balance: "$23,840", status: "Completed" },
  { date: "Mar 17", type: "Credit", desc: "Kemetro Order Commission", amount: "+$124", balance: "$23,000", status: "Completed" },
  { date: "Mar 16", type: "Debit", desc: "Withdrawal to Bank Account", amount: "-$2,000", balance: "$22,876", status: "Completed" },
  { date: "Mar 15", type: "Credit", desc: "Kemework Task Commission", amount: "+$180", balance: "$24,876", status: "Completed" },
  { date: "Mar 14", type: "Credit", desc: "Subscription Commission", amount: "+$350", balance: "$24,696", status: "Pending" },
  { date: "Mar 13", type: "Debit", desc: "Service Fee Payment", amount: "-$50", balance: "$24,346", status: "Completed" },
];

const TYPE_ICONS = { Credit: ArrowDownLeft, Debit: ArrowUpRight };
const TYPE_COLORS = { Credit: "text-green-500", Debit: "text-red-500" };

function WithdrawModal({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Request Withdrawal</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Amount</label>
            <input placeholder="$0.00" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Withdrawal Method</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400">
              <option>Bank Transfer — CIB ****4521</option>
              <option>XeedWallet</option>
              <option>Cash Pickup</option>
            </select>
          </div>
          <button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors">Submit Request</button>
        </div>
      </div>
    </>
  );
}

export default function FranchiseWallet() {
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-gray-900">👛 My Wallet</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3 bg-gradient-to-br from-[#1a1a2e] to-[#0d6efd] rounded-2xl p-6 text-white">
          <p className="text-white/60 text-sm mb-1">Available Balance</p>
          <p className="text-5xl font-black">$23,840</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-white/50 text-xs">Pending Balance</p>
              <p className="text-xl font-black text-yellow-400">$1,240</p>
            </div>
            <div>
              <p className="text-white/50 text-xs">Total Earned (All Time)</p>
              <p className="text-xl font-black text-green-400">$142,600</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: ArrowUpRight, label: "Withdraw", color: "bg-green-500", action: () => setShowWithdraw(true) },
          { icon: ArrowDownLeft, label: "Deposit", color: "bg-blue-500", action: () => {} },
          { icon: ArrowRight, label: "Transfer", color: "bg-purple-500", action: () => {} },
          { icon: BarChart3, label: "History", color: "bg-gray-700", action: () => {} },
        ].map(({ icon: Icon, label, color, action }) => (
          <button key={label} onClick={action} className={`${color} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Date", "Type", "Description", "Amount", "Balance After", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t, i) => {
                const Icon = TYPE_ICONS[t.type];
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold ${TYPE_COLORS[t.type]}`}><Icon size={12} /> {t.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.desc}</td>
                    <td className={`px-4 py-3 font-black ${TYPE_COLORS[t.type]}`}>{t.amount}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{t.balance}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
    </div>
  );
}