import { useState } from "react";
import { Search, ClipboardList } from "lucide-react";

const TABS = ["All", "Active", "Pending", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  active: { label: "Active", badge: "bg-green-100 text-green-700" },
  completed: { label: "Completed", badge: "bg-gray-100 text-gray-600" },
  pending: { label: "Pending", badge: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-500" },
};

const SERVICE_CONFIG = {
  VERI: { icon: "✅", color: "bg-green-100", text: "text-green-700", label: "VERI — Verification" },
  LIST: { icon: "📋", color: "bg-blue-100", text: "text-blue-700", label: "LIST — Professional Listing" },
  UP: { icon: "🚀", color: "bg-orange-100", text: "text-orange-700", label: "UP — Boost Listing" },
  KEY: { icon: "🔑", color: "bg-amber-100", text: "text-amber-700", label: "KEY — Featured Placement" },
  CAMPAIGN: { icon: "📢", color: "bg-red-100", text: "text-red-700", label: "CAMPAIGN — Marketing" },
};

const MOCK_ORDERS = [
  { id: 1, num: "KD-00121", status: "active", type: "VERI", property: "Modern Apartment in New Cairo", ordered: "Mar 10, 2026", amount: 150, statusNote: "Verification visit scheduled: Mar 25, 2026" },
  { id: 2, num: "KD-00118", status: "active", type: "LIST", property: "Villa in Sheikh Zayed", ordered: "Mar 8, 2026", amount: 200, statusNote: "Photography scheduled: Mar 22, 2026" },
  { id: 3, num: "KD-00115", status: "active", type: "UP", property: "Studio for Rent in Maadi", ordered: "Mar 5, 2026", amount: 50, statusNote: "Active until: Apr 5, 2026" },
  { id: 4, num: "KD-00110", status: "completed", type: "CAMPAIGN", property: "Penthouse in Heliopolis", ordered: "Feb 20, 2026", amount: 500, statusNote: "Campaign ran: Feb 20 – Mar 5, 2026" },
  { id: 5, num: "KD-00108", status: "pending", type: "KEY", property: "Chalet in North Coast", ordered: "Mar 18, 2026", amount: 300, statusNote: "Awaiting confirmation" },
  { id: 6, num: "KD-00102", status: "cancelled", type: "LIST", property: null, ordered: "Feb 10, 2026", amount: 200, statusNote: "Cancelled by user" },
];

export default function KemedarOrdersDesktop() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_ORDERS.filter(o => {
    const tabMatch = activeTab === "All" || STATUS_CONFIG[o.status].label === activeTab;
    const searchMatch = !search || o.num.toLowerCase().includes(search.toLowerCase()) || (o.property || "").toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🏠 Kemedar Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Orders for Kemedar paid services (VERI, LIST, UP, KEY, CAMPAIGN)</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-56" />
        </div>
      </div>

      {/* Tabs */}
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

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => {
                const sc = STATUS_CONFIG[order.status];
                const svc = SERVICE_CONFIG[order.type];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-700">{order.num}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${svc.color} ${svc.text}`}>
                        {svc.icon} {order.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{order.property || <span className="text-gray-400 italic">N/A</span>}</td>
                    <td className="px-5 py-4 text-gray-500">{order.ordered}</td>
                    <td className="px-5 py-4 font-black text-orange-600">${order.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.badge}`}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{order.statusNote}</td>
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