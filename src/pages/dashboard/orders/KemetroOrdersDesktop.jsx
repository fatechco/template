import { useState } from "react";
import { Search, Package } from "lucide-react";

const TABS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_CONFIG = {
  pending: { label: "Pending", badge: "bg-yellow-100 text-yellow-700" },
  processing: { label: "Processing", badge: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", badge: "bg-teal-100 text-teal-700" },
  delivered: { label: "Delivered", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_ORDERS = [
  {
    id: 1, num: "KT-00234", status: "shipped", date: "Mar 15, 2026",
    store: "HomeStyle Store",
    products: [{ name: "LED Desk Lamp - Modern", qty: 2, price: 45 }, { name: "Ergonomic Chair Pro", qty: 1, price: 120 }],
    total: 225,
  },
  {
    id: 2, num: "KT-00231", status: "delivered", date: "Mar 10, 2026",
    store: "DecorPlus",
    products: [{ name: "Wall Mirror Gold Frame 60×60", qty: 2, price: 75 }, { name: "Ceramic Vase Set", qty: 1, price: 35 }],
    total: 185,
  },
  {
    id: 3, num: "KT-00228", status: "pending", date: "Mar 18, 2026",
    store: "TechZone",
    products: [{ name: "Wireless Keyboard & Mouse", qty: 1, price: 89 }],
    total: 99,
  },
  {
    id: 4, num: "KT-00220", status: "cancelled", date: "Mar 5, 2026",
    store: "HomeStyle Store",
    products: [{ name: "Smart Light Bulb Pack", qty: 3, price: 22 }],
    total: 74,
  },
];

export default function KemetroOrdersDesktop() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter(o => {
    const tabMatch = activeTab === "All" || STATUS_CONFIG[o.status].label === activeTab;
    const searchMatch = !search || o.num.toLowerCase().includes(search.toLowerCase()) || o.store.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🛒 Kemetro Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your product orders</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-56" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Store</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => {
                const sc = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-700">{order.num}</td>
                    <td className="px-5 py-4 text-gray-700 font-semibold">{order.store}</td>
                    <td className="px-5 py-4 text-gray-500">
                      <div className="space-y-0.5">
                        {order.products.map((p, i) => (
                          <p key={i} className="text-xs">{p.name} <span className="text-gray-400">×{p.qty}</span></p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{order.date}</td>
                    <td className="px-5 py-4 font-black text-orange-600">${order.total}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.badge}`}>{sc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}