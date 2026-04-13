import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TRANSACTIONS = [
  { id: 1, orderNum: "#KM12345", product: "Office Chair", amount: 180, commission: 18, net: 162, status: "completed" },
  { id: 2, orderNum: "#KM12344", product: "LED Lamp", amount: 65, commission: 6.5, net: 58.5, status: "completed" },
  { id: 3, orderNum: "#KM12343", product: "Monitor Stand", amount: 45, commission: 4.5, net: 40.5, status: "completed" },
  { id: 4, orderNum: "#KM12342", product: "Keyboard", amount: 95, commission: 9.5, net: 85.5, status: "pending" },
  { id: 5, orderNum: "#KM12341", product: "Mouse", amount: 35, commission: 3.5, net: 31.5, status: "pending" },
];

export default function KemetroSellerEarningsPage() {
  const navigate = useNavigate();

  const totalEarned = 8450;
  const pendingPayout = 650;
  const availableWithdraw = 8450 - 650;
  const currentPlan = "Professional";
  const commissionRate = 10;

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar title="Earnings" showBack />

      {/* Balance Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <p className="text-xs text-green-100">Total Earned</p>
          <p className="text-4xl font-black mt-2">${totalEarned}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <p className="text-green-100 text-xs">Pending Payout</p>
              <p className="font-black mt-1">${pendingPayout}</p>
            </div>
            <div>
              <p className="text-green-100 text-xs">Available to Withdraw</p>
              <p className="font-black mt-1">${availableWithdraw}</p>
            </div>
          </div>

          <button className="w-full bg-white text-green-600 font-bold py-2.5 rounded-lg mt-4 hover:bg-green-50 transition-colors text-sm">
            💰 Request Payout (Min $50)
          </button>
        </div>
      </div>

      {/* Plan Card */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Plan</p>
              <p className="text-lg font-black text-gray-900 mt-1">{currentPlan}</p>
              <p className="text-sm text-gray-600 mt-1">Commission rate: {commissionRate}%</p>
            </div>
            <button className="text-xs text-teal-600 font-bold hover:underline">Upgrade →</button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="px-4 pb-8">
        <p className="text-sm font-black text-gray-900 mb-3">Recent Transactions</p>
        <div className="space-y-2">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-600">{tx.orderNum}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{tx.product}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    tx.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tx.status === "completed" ? "✅ Completed" : "🟡 Pending"}
                </span>
              </div>

              {/* Breakdown */}
              <div className="text-xs text-gray-600 space-y-1 mt-2">
                <div className="flex justify-between">
                  <span>Sale: ${tx.amount}</span>
                  <span className="text-gray-400">—</span>
                  <span>Commission (10%): ${tx.commission}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                  <span className="font-bold text-gray-900">Net Earned:</span>
                  <span className="font-black text-green-600">${tx.net}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}