import { ArrowDownLeft, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const DEPOSITS = [
  { id: 1, amount: 450, source: "Property Verification", date: "Mar 22, 2026", status: "completed", time: "1 day ago" },
  { id: 2, amount: 300, source: "Premium Service", date: "Mar 20, 2026", status: "completed", time: "3 days ago" },
  { id: 3, amount: 280, source: "Kemetro Commission", date: "Mar 18, 2026", status: "completed", time: "5 days ago" },
  { id: 4, amount: 950, source: "Kemework Tasks", date: "Mar 15, 2026", status: "completed", time: "1 week ago" },
  { id: 5, amount: 600, source: "Premium Service", date: "Mar 12, 2026", status: "completed", time: "2 weeks ago" },
];

export default function FranchiseOwnerDeposits() {
  const totalDeposits = DEPOSITS.reduce((sum, d) => sum + d.amount, 0);
  const thisMonthDeposits = DEPOSITS.filter(d => d.date.includes("Mar")).reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">📥 Deposits</h1>
        <p className="text-gray-500 text-sm mt-1">View all income deposits to your account</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Deposits</p>
          <p className="text-3xl font-black text-green-600 mt-2">${totalDeposits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">This Month</p>
          <p className="text-3xl font-black text-blue-600 mt-2">${thisMonthDeposits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs font-bold text-gray-500 uppercase">Total Transactions</p>
          <p className="text-3xl font-black text-purple-600 mt-2">{DEPOSITS.length}</p>
        </div>
      </div>

      {/* Deposits by Source */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Deposits by Source</h2>
        <div className="space-y-3">
          {[
            { source: "Property Verification", amount: 450, percent: 25 },
            { source: "Premium Service", amount: 900, percent: 50 },
            { source: "Kemetro Commission", amount: 280, percent: 15 },
            { source: "Kemework Tasks", amount: 230, percent: 10 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-gray-900">{item.source}</p>
                <p className="text-sm font-bold text-gray-900">${item.amount}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposits List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Date</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Source</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Amount</th>
                <th className="text-left px-6 py-4 font-bold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DEPOSITS.map(deposit => (
                <tr key={deposit.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{deposit.date}</p>
                      <p className="text-xs text-gray-500">{deposit.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{deposit.source}</td>
                  <td className="px-6 py-4 font-bold text-green-600">+${deposit.amount}</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-xs font-bold text-green-600">Completed</span>
                    </div>
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