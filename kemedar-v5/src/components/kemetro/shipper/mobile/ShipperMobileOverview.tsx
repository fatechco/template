// @ts-nocheck
import { TrendingUp, Truck, Package, Star, DollarSign, AlertCircle } from "lucide-react";

const STATS = [
  { label: "Active Shipments", value: "12", icon: "🚚" },
  { label: "Total Earnings", value: "$2,450", icon: "💰" },
  { label: "Avg Rating", value: "4.9★", icon: "⭐" },
  { label: "Completed", value: "248", icon: "✓" },
];

const RECENT_SHIPMENTS = [
  { id: "SHP-001", route: "Cairo → Alexandria", status: "In Transit", amount: "$85", eta: "2 hours" },
  { id: "SHP-002", route: "Giza → Cairo", status: "Picked Up", amount: "$65", eta: "30 min" },
  { id: "SHP-003", route: "Alexandria → Cairo", status: "Delivered", amount: "$95", eta: "Completed" },
];

export default function ShipperMobileOverview() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Your shipping dashboard</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-gray-900 mb-4">Active Shipments</h3>
        <div className="space-y-3">
          {RECENT_SHIPMENTS.map((ship) => (
            <div key={ship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">{ship.id}</p>
                <p className="text-xs text-gray-500">{ship.route}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${ship.status === "Delivered" ? "text-green-600" : "text-blue-600"}`}>{ship.status}</p>
                <p className="text-xs text-gray-600 font-bold mt-0.5">{ship.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <p className="font-bold text-green-900 text-sm">Next Payout</p>
          <p className="text-xs text-green-800 mt-1">March 25, 2026 • <strong>$2,450</strong></p>
        </div>
      </div>
    </div>
  );
}