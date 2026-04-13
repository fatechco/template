import { useState } from "react";
import { Search, Wrench } from "lucide-react";

const TABS = ["All", "Pending", "In Progress", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  pending: { label: "Pending", badge: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "In Progress", badge: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_ORDERS = [
  { id: 1, num: "KW-00421", status: "in_progress", service: "Full Apartment Painting", professional: "Mohamed Hassan", category: "Painting", date: "Mar 12, 2026", amount: 2800, note: "Work started Mar 14, ETA: Mar 20" },
  { id: 2, num: "KW-00418", status: "completed", service: "Electrical Wiring Inspection", professional: "Khalid Electric", category: "Electrical", date: "Mar 5, 2026", amount: 450, note: "Completed successfully" },
  { id: 3, num: "KW-00415", status: "pending", service: "Kitchen Cabinet Installation", professional: "Top Carpentry Co.", category: "Carpentry", date: "Mar 18, 2026", amount: 5200, note: "Awaiting pro confirmation" },
  { id: 4, num: "KW-00410", status: "cancelled", service: "AC Maintenance (3 units)", professional: "Cool Air Services", category: "HVAC", date: "Feb 28, 2026", amount: 600, note: "Cancelled by client" },
];

export default function KemeworkOrdersDesktop() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter(o => {
    const tabMatch = activeTab === "All" || STATUS_CONFIG[o.status].label === activeTab;
    const searchMatch = !search || o.num.toLowerCase().includes(search.toLowerCase()) || o.service.toLowerCase().includes(search.toLowerCase()) || o.professional.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🔧 Kemework Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track your service and task orders</p>
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
          <Wrench size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Professional</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => {
                const sc = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-700">{order.num}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{order.service}</td>
                    <td className="px-5 py-4 text-gray-600">{order.professional}</td>
                    <td className="px-5 py-4 text-gray-500">{order.category}</td>
                    <td className="px-5 py-4 text-gray-500">{order.date}</td>
                    <td className="px-5 py-4 font-black text-orange-600">${order.amount.toLocaleString()}</td>
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