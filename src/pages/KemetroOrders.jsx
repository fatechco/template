import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import { Eye, Truck, Star } from "lucide-react";

const MOCK_ORDERS = [
  { id: "1", orderNumber: "ORD-2025-001", date: "2025-03-10", items: 3, total: 450.5, status: "Delivered" },
  { id: "2", orderNumber: "ORD-2025-002", date: "2025-03-08", items: 2, total: 280.75, status: "Shipped" },
  { id: "3", orderNumber: "ORD-2025-003", date: "2025-03-05", items: 5, total: 620.0, status: "Processing" },
  { id: "4", orderNumber: "ORD-2025-004", date: "2025-03-01", items: 1, total: 89.99, status: "Confirmed" },
  { id: "5", orderNumber: "ORD-2025-005", date: "2025-02-25", items: 4, total: 195.5, status: "Pending" },
];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-purple-100 text-purple-700",
  Shipped: "bg-teal-100 text-teal-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function KemetroOrders() {
  const [orders] = useState(MOCK_ORDERS);

  useEffect(() => {
    base44.auth.me().catch(() => {});
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <KemetroHeader />
        <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">Your orders will appear here</p>
          <a href="/kemetro" className="inline-block bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black px-8 py-3 rounded-lg transition-colors">
            Start Shopping
          </a>
        </div>
        <KemetroFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Orders</h1>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Order #</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Items</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Total</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600">{order.items} items</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <a href={`/kemetro/order/${order.id}`} className="text-blue-600 hover:text-blue-700 font-semibold text-xs">
                          <Eye size={16} className="inline mr-1" />View
                        </a>
                        {order.status !== "Cancelled" && (
                          <a href={`/kemetro/track/${order.id}`} className="text-teal-600 hover:text-teal-700 font-semibold text-xs">
                            <Truck size={16} className="inline mr-1" />Track
                          </a>
                        )}
                        {order.status === "Delivered" && (
                          <a href={`/kemetro/order/${order.id}/review`} className="text-orange-600 hover:text-orange-700 font-semibold text-xs">
                            <Star size={16} className="inline mr-1" />Review
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <KemetroFooter />
    </div>
  );
}