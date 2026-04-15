"use client";
// @ts-nocheck
import { useState } from "react";
import { Search, Eye, Truck, X, ChevronDown } from "lucide-react";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-purple-100 text-purple-700",
  Shipped: "bg-teal-100 text-teal-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Refunded: "bg-gray-100 text-gray-600",
};

const MOCK_ORDERS = [
  { id: "ORD-2025-001", buyer: "Ahmed Hassan", seller: "BuildRight Materials", date: "2025-03-10", items: 3, total: 450.5, status: "Delivered", payment: "Credit Card" },
  { id: "ORD-2025-002", buyer: "Fatima Al-Said", seller: "Steel Direct", date: "2025-03-11", items: 1, total: 1260.0, status: "Shipped", payment: "Bank Transfer" },
  { id: "ORD-2025-003", buyer: "Omar Khalil", seller: "Tile Experts Co.", date: "2025-03-12", items: 5, total: 320.75, status: "Processing", payment: "Cash on Delivery" },
  { id: "ORD-2025-004", buyer: "Sara Mostafa", seller: "Paint Hub", date: "2025-03-12", items: 2, total: 99.99, status: "Confirmed", payment: "Credit Card" },
  { id: "ORD-2025-005", buyer: "Khaled Nour", seller: "BuildRight Materials", date: "2025-03-13", items: 4, total: 780.0, status: "Pending", payment: "Credit Card" },
  { id: "ORD-2025-006", buyer: "Nadia Farouk", seller: "Steel Direct", date: "2025-03-08", items: 2, total: 540.0, status: "Cancelled", payment: "Bank Transfer" },
  { id: "ORD-2025-007", buyer: "Youssef Adel", seller: "Tile Experts Co.", date: "2025-03-07", items: 6, total: 210.5, status: "Delivered", payment: "Cash on Delivery" },
  { id: "ORD-2025-008", buyer: "Mona Sherif", seller: "Paint Hub", date: "2025-03-06", items: 1, total: 59.99, status: "Refunded", payment: "Credit Card" },
];

const STATUSES = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

const STATS = [
  { label: "Total Orders", value: "1,842", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Pending", value: "124", color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Shipped Today", value: "38", color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Revenue (Month)", value: "$94,320", color: "text-green-600", bg: "bg-green-50" },
];

export default function KemetroAdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Orders Management</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`rounded-xl border border-gray-200 p-4 ${s.bg}`}>
            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order, buyer, seller…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Order #", "Buyer", "Seller", "Date", "Items", "Total", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-900">{o.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{o.buyer}</td>
                  <td className="px-4 py-3 text-gray-600">{o.seller}</td>
                  <td className="px-4 py-3 text-gray-500">{o.date}</td>
                  <td className="px-4 py-3 text-gray-600 text-center">{o.items}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{o.payment}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(o)} className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1">
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">{selected.id}</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Buyer", selected.buyer], ["Seller", selected.seller], ["Date", selected.date], ["Items", selected.items], ["Payment", selected.payment], ["Total", `$${selected.total.toFixed(2)}`]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">{k}</p>
                  <p className="font-bold text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">Status:</span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                <Truck size={15} /> Update Status
              </button>
              <button onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}