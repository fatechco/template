// @ts-nocheck
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

const EARNINGS_DATA = [
  { month: "Mar 1-7", earnings: 420, shipments: 6 },
  { month: "Mar 8-14", earnings: 580, shipments: 8 },
  { month: "Mar 15-21", earnings: 650, shipments: 9 },
];

const TRANSACTIONS = [
  { date: "Mar 20", shipment: "SHP-105", route: "Alexandria → Cairo", amount: 110, status: "Cleared" },
  { date: "Mar 19", shipment: "SHP-104", route: "6th October → Giza", amount: 85, status: "Cleared" },
  { date: "Mar 18", shipment: "SHP-103", route: "Helwan → Giza", amount: 75, status: "Paid" },
  { date: "Mar 17", shipment: "SHP-102", route: "Giza → Cairo", amount: 65, status: "Paid" },
];

export default function ShipperMobileEarnings() {
  const total = EARNINGS_DATA.reduce((s, e) => s + e.earnings, 0);
  const totalShipments = EARNINGS_DATA.reduce((s, e) => s + e.shipments, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Track your shipping revenue</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-green-600">${total}</p>
          <p className="text-xs text-gray-600 mt-2">This Period</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-blue-600">{totalShipments}</p>
          <p className="text-xs text-gray-600 mt-2">Total Shipments</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Weekly Breakdown</h3>
        <div className="space-y-2">
          {EARNINGS_DATA.map((week) => (
            <div key={week.month} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-bold text-gray-900">{week.month}</p>
                <p className="text-xs text-gray-500">{week.shipments} shipments</p>
              </div>
              <p className="font-bold text-green-600">${week.earnings}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">Recent Transactions</h3>
        <div className="space-y-2">
          {TRANSACTIONS.map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 text-xs border-b border-gray-100 last:border-0">
              <div>
                <p className="font-bold text-gray-900">{tx.shipment}</p>
                <p className="text-gray-500">{tx.route}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">${tx.amount}</p>
                <span className={`text-xs font-bold ${tx.status === "Cleared" ? "text-blue-600" : "text-green-600"}`}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}