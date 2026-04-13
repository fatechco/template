import { ArrowUpRight, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { useState } from "react";

const WITHDRAWALS = [
  { id: 1, amount: 1000, method: "Bank Transfer", date: "Mar 20, 2026", status: "completed", time: "2 days ago" },
  { id: 2, amount: 500, method: "XeedWallet", date: "Mar 18, 2026", status: "pending", time: "4 days ago" },
  { id: 3, amount: 2500, method: "Bank Transfer", date: "Mar 15, 2026", status: "completed", time: "1 week ago" },
  { id: 4, amount: 800, method: "Bank Transfer", date: "Mar 10, 2026", status: "failed", time: "2 weeks ago" },
];

const STATUS_CONFIG = {
  completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  pending: { icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

export default function FranchiseOwnerWithdrawals() {
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all" ? WITHDRAWALS : WITHDRAWALS.filter(w => w.status === filterStatus);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">📤 Withdrawals</h1>
        <p className="text-gray-500 text-sm mt-1">Track all your withdrawal requests and history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Withdrawn</p>
          <p className="text-2xl font-black text-green-600 mt-2">$4,800</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-black text-orange-600 mt-2">$500</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">This Month</p>
          <p className="text-2xl font-black text-blue-600 mt-2">$1,500</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">Failed</p>
          <p className="text-2xl font-black text-red-600 mt-2">$800</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "completed", "pending", "failed"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all capitalize ${
              filterStatus === status
                ? "bg-orange-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-orange-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Withdrawals List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Date</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Method</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(withdrawal => {
                const config = STATUS_CONFIG[withdrawal.status];
                const Icon = config.icon;
                return (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">{withdrawal.date}</p>
                        <p className="text-xs text-gray-500">{withdrawal.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${withdrawal.amount}</td>
                    <td className="px-6 py-4 text-gray-700">{withdrawal.method}</td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
                        <Icon size={14} className={config.color} />
                        <span className={`text-xs font-bold ${config.color} capitalize`}>{withdrawal.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}