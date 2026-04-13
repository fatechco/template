import { useState } from 'react';
import { Search, Eye, FileText, Check, MessageCircle, Trash2, ArrowUp, ArrowDown, Send, BarChart3 } from 'lucide-react';

const ORDERS_DATA = [
  { id: 1, orderNum: "ORD-00124", module: "kemedar", service: "KEMEDAR VERI Service", customer: "Ahmed Hassan", amount: 150, status: "completed", date: "2026-03-23", paymentMethod: "Credit Card" },
  { id: 2, orderNum: "ORD-00123", module: "kemetro", service: "Product Order #KT-0234", customer: "Sara Mohamed", amount: 245.50, status: "in-progress", date: "2026-03-22", paymentMethod: "Bank Transfer" },
  { id: 3, orderNum: "ORD-00122", module: "kemework", service: "Kemework Task #KW-89", customer: "Layla Ahmed", amount: 2800, status: "new", date: "2026-03-21", paymentMethod: "XeedWallet" },
  { id: 4, orderNum: "ORD-00121", module: "kemedar", service: "KEMEDAR LIST Service", customer: "Karim Ali", amount: 200, status: "completed", date: "2026-03-20", paymentMethod: "Credit Card" },
  { id: 5, orderNum: "ORD-00120", module: "kemetro", service: "Product Order #KT-0220", customer: "Fatima Khalil", amount: 89.99, status: "completed", date: "2026-03-19", paymentMethod: "Bank Transfer" },
];

const MODULE_CONFIG = {
  kemedar: { icon: "🏠", label: "Kemedar", color: "bg-orange-100", text: "text-orange-700" },
  kemetro: { icon: "🛒", label: "Kemetro", color: "bg-blue-100", text: "text-blue-700" },
  kemework: { icon: "🔧", label: "Kemework", color: "bg-teal-100", text: "text-teal-700" },
};

const STATUS_CONFIG = {
  new: { label: "New", badge: "bg-orange-100 text-orange-700" },
  "in-progress": { label: "In Progress", badge: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", badge: "bg-red-100 text-red-700" },
};

export default function FranchiseOwnerOrders() {
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", method: "bank" });

  const filteredOrders = ORDERS_DATA.filter(order => {
    const moduleMatch = selectedModule === "All" || order.module === selectedModule.toLowerCase().split(" ")[0];
    const statusMatch = selectedStatus === "All" || order.status === selectedStatus.toLowerCase().replace(" ", "-");
    const searchMatch = searchQuery === "" || order.orderNum.includes(searchQuery) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return moduleMatch && statusMatch && searchMatch;
  });

  const totalBalance = 12850.75;
  const pendingBalance = 1250;
  const monthlyRevenue = 8500;
  const revenue = { kemedar: 3450, kemetro: 2800, kemework: 2250 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-green-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Money &amp; Orders</p>
        <h1 className="text-3xl font-black text-gray-900">Money & Orders</h1>
      </div>

      {/* Balance Overview Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Left: Balance */}
          <div>
            <p className="text-sm opacity-90 mb-2">Available Balance</p>
            <p className="text-4xl font-black mb-2">${totalBalance.toLocaleString()}</p>
            <p className="text-sm opacity-80">Pending: ${pendingBalance.toLocaleString()}</p>
          </div>

          {/* Center: Revenue by Module */}
          <div>
            <p className="text-sm opacity-90 mb-4">Revenue by Module</p>
            {Object.entries(revenue).map(([key, value]) => (
              <div key={key} className="mb-2 flex items-center gap-2">
                <span>{MODULE_CONFIG[key].icon}</span>
                <span className="text-sm opacity-80">{MODULE_CONFIG[key].label}:</span>
                <span className="font-bold ml-auto">${value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Right: This Month */}
          <div className="text-right">
            <p className="text-sm opacity-90 mb-2">Total This Month</p>
            <p className="text-3xl font-black mb-2">${monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm opacity-80">↑ 12% vs last month</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => setShowWithdrawModal(true)} className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1">
            <ArrowUp size={16} /> Withdraw
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1">
            <ArrowDown size={16} /> Deposit
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1">
            <Send size={16} /> Transfer
          </button>
          <button className="bg-white/20 hover:bg-white/30 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1">
            <FileText size={16} /> Report
          </button>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {["All Modules", "🏠 Kemedar", "🛒 Kemetro", "🔧 Kemework"].map(module => (
          <button key={module} onClick={() => setSelectedModule(module)}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-all ${
              selectedModule === module
                ? "border-green-600 text-green-600 bg-green-50"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            {module}
          </button>
        ))}
      </div>

      {/* Status & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {["All Orders", "New", "In Progress", "Completed", "Cancelled", "Invoices"].map(status => (
            <button key={status} onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedStatus === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Order #, customer, service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-400"
            />
          </div>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 cursor-pointer font-bold"
          >
            <option>Today</option>
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded w-4 h-4" /></th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Order #</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Module</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Service/Product</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => {
                const mc = MODULE_CONFIG[order.module];
                const sc = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" className="rounded w-4 h-4" /></td>
                    <td className="px-4 py-3 font-bold text-gray-900">{order.orderNum}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded ${mc.color} ${mc.text}`}>
                        {mc.icon} {mc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-700">{order.service}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 font-bold text-green-600">${order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded ${sc.badge}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.date}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><FileText size={16} /></button>
                        {order.status === "in-progress" && <button className="p-1.5 hover:bg-gray-100 rounded text-green-600"><Check size={16} /></button>}
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><MessageCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 text-3xl hover:text-gray-600">×</button>
            </div>

            <div className="space-y-6">
              {/* Order Header */}
              <div className="border-l-4 border-green-600 pl-4">
                <p className="text-sm text-gray-600">{selectedOrder.orderNum}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{selectedOrder.service}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Customer</p>
                  <p className="font-bold text-gray-900">{selectedOrder.customer}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Module</p>
                  <p className="font-bold text-gray-900">{MODULE_CONFIG[selectedOrder.module].label}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <p className="font-black text-green-600 text-lg">${selectedOrder.amount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                  <p className="font-bold text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Date</p>
                  <p className="font-bold text-gray-900">{selectedOrder.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded inline-block ${STATUS_CONFIG[selectedOrder.status].badge}`}>
                    {STATUS_CONFIG[selectedOrder.status].label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">📥 Download Invoice</button>
                {selectedOrder.status === "in-progress" && (
                  <button className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">✅ Mark Completed</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Withdraw Funds</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Amount</label>
                <div className="flex items-center border border-gray-200 rounded-lg px-3">
                  <span className="font-bold text-gray-600">$</span>
                  <input type="number" placeholder="0.00" value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})}
                    className="flex-1 px-3 py-2.5 text-lg font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-3">Method</label>
                <div className="space-y-2">
                  {[{ id: "bank", label: "🏦 Bank Transfer" }, { id: "xeed", label: "💳 XeedWallet" }, { id: "paypal", label: "🅿️ PayPal" }].map(method => (
                    <label key={method.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="method" value={method.id} checked={withdrawForm.method === method.id} onChange={e => setWithdrawForm({...withdrawForm, method: e.target.value})} className="w-4 h-4" />
                      <span className="text-sm font-bold text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Processing fee: $5.00</p>
                <p className="text-sm font-bold text-gray-900 mt-1">You will receive: ${(parseFloat(withdrawForm.amount) - 5).toFixed(2)}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">Submit Withdrawal</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}