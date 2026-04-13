import { useState } from "react";
import { Search, Eye, Truck, MessageCircle, ChevronDown, Package } from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-2025-001", date: "2025-03-15", buyer: "Ahmed Hassan", buyerPhone: "+20 100 123 4567", product: "Premium Cement 50kg", qty: 10, amount: 75.00, status: "Pending", city: "Cairo, Egypt" },
  { id: "ORD-2025-002", date: "2025-03-14", buyer: "Fatima Mohamed", buyerPhone: "+966 50 234 5678", product: "Steel Rods 10mm (ton)", qty: 2, amount: 840.00, status: "Confirmed", city: "Riyadh, KSA" },
  { id: "ORD-2025-003", date: "2025-03-12", buyer: "Omar Al-Rashid", buyerPhone: "+971 55 345 6789", product: "Ceramic Tiles 60×60", qty: 50, amount: 1425.00, status: "Shipped", city: "Dubai, UAE" },
  { id: "ORD-2025-004", date: "2025-03-10", buyer: "Layla Hassan", buyerPhone: "+20 111 456 7890", product: "Wall Paint Matte 20L", qty: 3, amount: 149.97, status: "Delivered", city: "Alexandria, Egypt" },
  { id: "ORD-2025-005", date: "2025-03-08", buyer: "Khaled Ali", buyerPhone: "+20 122 567 8901", product: "Electrical Cable 2.5mm", qty: 5, amount: 190.00, status: "Cancelled", city: "Giza, Egypt" },
  { id: "ORD-2025-006", date: "2025-03-07", buyer: "Sara Ibrahim", buyerPhone: "+20 100 678 9012", product: "Premium Cement 50kg", qty: 20, amount: 150.00, status: "Delivered", city: "Cairo, Egypt" },
];

const STATUS_CONFIG = {
  Pending: { color: "bg-yellow-100 text-yellow-700", next: "Confirmed" },
  Confirmed: { color: "bg-blue-100 text-blue-700", next: "Shipped" },
  Shipped: { color: "bg-teal-100 text-teal-700", next: "Delivered" },
  Delivered: { color: "bg-green-100 text-green-700", next: null },
  Cancelled: { color: "bg-red-100 text-red-700", next: null },
};

const FILTER_TABS = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function KemetroSellerOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === "All" || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const advanceStatus = (id) => {
    setOrders(orders.map((o) => {
      if (o.id !== id) return o;
      const next = STATUS_CONFIG[o.status]?.next;
      return next ? { ...o, status: next } : o;
    }));
  };

  const counts = FILTER_TABS.reduce((acc, tab) => {
    acc[tab] = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and fulfill your customer orders</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 gap-3">
        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <div key={s} className={`rounded-xl border p-4 text-center cursor-pointer transition-all ${activeTab === s ? "border-teal-400 bg-teal-50" : "border-gray-200 bg-white hover:border-gray-300"}`} onClick={() => setActiveTab(s)}>
            <p className={`text-2xl font-black ${STATUS_CONFIG[s].color.split(" ")[1]}`}>{counts[s]}</p>
            <p className="text-xs text-gray-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 gap-4 flex-wrap">
          <div className="flex gap-1 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {tab} <span className="opacity-70">({counts[tab]})</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Order #</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Buyer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Qty</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : filtered.map((order, i) => (
                <tr key={order.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-bold text-teal-700">{order.id}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{order.buyer}</p>
                    <p className="text-xs text-gray-400">{order.city}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{order.product}</td>
                  <td className="px-4 py-3 text-gray-700">{order.qty}</td>
                  <td className="px-4 py-3 font-black text-gray-900">${order.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_CONFIG[order.status].color}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedOrder(order)} title="View Details" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      <button title="Contact Buyer" className="text-gray-400 hover:text-green-600 transition-colors">
                        <MessageCircle size={15} />
                      </button>
                      {STATUS_CONFIG[order.status]?.next && (
                        <button
                          onClick={() => advanceStatus(order.id)}
                          title={`Mark as ${STATUS_CONFIG[order.status].next}`}
                          className="text-gray-400 hover:text-teal-600 transition-colors"
                        >
                          <Truck size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-lg">{selectedOrder.id}</h3>
                <p className="text-gray-500 text-sm">{new Date(selectedOrder.date).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_CONFIG[selectedOrder.status].color}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-semibold">{selectedOrder.product}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-semibold">{selectedOrder.qty}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-black text-teal-700">${selectedOrder.amount.toFixed(2)}</span></div>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-bold text-gray-700 mb-1">Buyer Details</p>
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold">{selectedOrder.buyer}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-semibold">{selectedOrder.buyerPhone}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-semibold">{selectedOrder.city}</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              {STATUS_CONFIG[selectedOrder.status]?.next && (
                <button
                  onClick={() => { advanceStatus(selectedOrder.id); setSelectedOrder(null); }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Mark as {STATUS_CONFIG[selectedOrder.status].next}
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}