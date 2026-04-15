// @ts-nocheck
import { DollarSign, Calendar, CreditCard, Check, Clock } from "lucide-react";

const PAYOUTS = [
  { id: "PAY-001", date: "Mar 10, 2026", amount: 850, status: "Paid", method: "Bank Transfer", account: "••••4782" },
  { id: "PAY-002", date: "Feb 25, 2026", amount: 920, status: "Paid", method: "Bank Transfer", account: "••••4782" },
  { id: "PAY-003", date: "Feb 10, 2026", amount: 780, status: "Paid", method: "Bank Transfer", account: "••••4782" },
];

const PENDING = { amount: 650, date: "Mar 25, 2026" };

export default function ShipperMobilePayout() {
  const totalPaid = PAYOUTS.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Payouts</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your earnings withdrawals</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-green-600">${totalPaid}</p>
          <p className="text-xs text-gray-600 mt-2">Total Paid</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-yellow-600">${PENDING.amount}</p>
          <p className="text-xs text-gray-600 mt-2">Pending</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <p className="font-bold text-blue-900 text-sm">Next Payout</p>
          <p className="text-xs text-blue-800 mt-1">{PENDING.date} • <strong>${PENDING.amount}</strong></p>
          <button className="text-xs font-bold text-blue-600 hover:underline mt-2">Manage Payout →</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Payout History</h3>
        <div className="space-y-3">
          {PAYOUTS.map((payout) => (
            <div key={payout.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{payout.id}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar size={12} /> {payout.date}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><CreditCard size={12} /> {payout.method} ({payout.account})</p>
              </div>
              <div className="text-right">
                <p className="font-black text-green-600 text-lg">${payout.amount}</p>
                <span className="inline-block mt-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
                  <Check size={10} className="inline mr-0.5" /> {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}