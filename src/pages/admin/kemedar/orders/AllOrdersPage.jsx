import { Search, Eye, CheckCircle, RotateCcw, Download } from "lucide-react";
import { useState } from "react";

const mockOrders = [
  { id: "ORD-001", customer: "Ahmed Hassan", product: "Silver Plan", amount: 19.99, method: "Stripe", status: "paid", date: "2024-03-21" },
  { id: "ORD-002", customer: "Layla Mohamed", product: "KEMEDAR VERI", amount: 29.99, method: "PayPal", status: "pending", date: "2024-03-20" },
  { id: "ORD-003", customer: "Omar Khalil", product: "Gold Plan", amount: 49.99, method: "Bank Transfer", status: "failed", date: "2024-03-19" },
  { id: "ORD-004", customer: "Fatima Ali", product: "KEMEDAR CAMPAIGN", amount: 99.99, method: "Stripe", status: "refunded", date: "2024-03-18" },
];

export default function AllOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: "all" });

  const filtered = mockOrders.filter(o =>
    (o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     o.product.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.status === "all" || o.status === filters.status)
  );

  const getStatusColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">All Orders</h1>
        <p className="text-sm text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order, customer, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Order</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Product/Service</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Payment Method</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{order.product}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">${order.amount}</td>
                  <td className="px-4 py-3 text-gray-600">{order.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{order.date}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded text-blue-600">
                      <Eye size={14} />
                    </button>
                    {order.status === "pending" && (
                      <button className="p-1 hover:bg-gray-200 rounded text-green-600">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {(order.status === "paid" || order.status === "pending") && (
                      <button className="p-1 hover:bg-gray-200 rounded text-orange-600">
                        <RotateCcw size={14} />
                      </button>
                    )}
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                      <Download size={14} />
                    </button>
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