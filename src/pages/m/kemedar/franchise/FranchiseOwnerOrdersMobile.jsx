import { useState } from 'react';
import { ChevronLeft, ArrowUp, ArrowDown, Eye, FileText, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ORDERS_DATA = [
  { id: 1, orderNum: "ORD-00124", module: "kemedar", service: "KEMEDAR VERI Service", customer: "Ahmed Hassan", amount: 150, status: "completed", date: "Mar 23" },
  { id: 2, orderNum: "ORD-00123", module: "kemetro", service: "Product Order #KT-0234", customer: "Sara Mohamed", amount: 245.50, status: "in-progress", date: "Mar 22" },
  { id: 3, orderNum: "ORD-00122", module: "kemework", service: "Kemework Task #KW-89", customer: "Layla Ahmed", amount: 2800, status: "new", date: "Mar 21" },
  { id: 4, orderNum: "ORD-00121", module: "kemedar", service: "KEMEDAR LIST Service", customer: "Karim Ali", amount: 200, status: "completed", date: "Mar 20" },
];

const MODULE_CONFIG = {
  kemedar: { icon: "🏠", label: "Kemedar" },
  kemetro: { icon: "🛒", label: "Kemetro" },
  kemework: { icon: "🔧", label: "Kemework" },
};

const STATUS_CONFIG = {
  new: { label: "New", color: "text-orange-700" },
  "in-progress": { label: "In Progress", color: "text-blue-700" },
  completed: { label: "Completed", color: "text-green-700" },
};

export default function FranchiseOwnerOrdersMobile() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ amount: "", method: "bank" });

  const filteredOrders = ORDERS_DATA.filter(order => {
    const moduleMatch = selectedModule === "All" || order.module === selectedModule.toLowerCase().split(" ")[0];
    const statusMatch = selectedStatus === "All" || order.status === selectedStatus.toLowerCase().replace(" ", "-");
    return moduleMatch && statusMatch;
  });

  const totalBalance = 12850.75;
  const pendingBalance = 1250;
  const monthlyRevenue = 8500;

  return (
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Money & Orders</h1>
        <div className="w-8" />
      </div>

      {/* Balance Card */}
      <div className="m-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
        <div className="mb-4">
          <p className="text-xs opacity-90">Available Balance</p>
          <p className="text-3xl font-black">${totalBalance.toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-1">Pending: ${pendingBalance}</p>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <p className="text-xs opacity-90">This Month</p>
            <p className="font-black text-lg">${monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-90">vs Last Month</p>
            <p className="font-black text-lg text-green-200">↑ 12%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowWithdrawModal(true)} className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1">
            <ArrowUp size={14} /> Withdraw
          </button>
          <button className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1">
            <ArrowDown size={14} /> Deposit
          </button>
        </div>
      </div>

      {/* Module Pills */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "🏠 Kemedar", "🛒 Kemetro", "🔧 Kemework"].map(module => (
          <button key={module} onClick={() => setSelectedModule(module)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedModule === module
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            {module}
          </button>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "New 🔴", "Progress", "Done", "Invoices"].map(status => (
          <button key={status} onClick={() => setSelectedStatus(status.split(" ")[0])}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedStatus === status.split(" ")[0]
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredOrders.map(order => {
          const mc = MODULE_CONFIG[order.module];
          const sc = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500 font-bold">{order.orderNum}</p>
                  <p className="font-bold text-gray-900 mt-1">{order.service}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">
                  {mc.icon} {mc.label}
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3">{order.customer}</p>

              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-black text-green-600">${order.amount.toLocaleString()}</p>
                <span className={`text-xs font-bold ${sc.color}`}>{sc.label}</span>
              </div>

              <p className="text-xs text-gray-500 mb-3">{order.date}</p>

              <div className="flex gap-2">
                <button onClick={() => setSelectedOrder(order)} className="flex-1 text-xs font-bold border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  👁 View
                </button>
                <button className="flex-1 text-xs font-bold border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  🧾 Invoice
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-black text-gray-900 mb-4">{selectedOrder.orderNum}</h2>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Service</p>
                <p className="font-bold text-gray-900">{selectedOrder.service}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Customer</p>
                <p className="font-bold text-gray-900">{selectedOrder.customer}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <p className="font-black text-green-600">${selectedOrder.amount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <p className={`font-bold text-sm ${STATUS_CONFIG[selectedOrder.status].color}`}>{STATUS_CONFIG[selectedOrder.status].label}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setSelectedOrder(null)} className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg">Cancel</button>
              <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg">📥 Download Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-black text-gray-900 mb-4">Withdraw Funds</h2>

            <div className="space-y-3 mb-4">
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
                <label className="text-xs font-bold text-gray-700 block mb-2">Method</label>
                <select value={withdrawForm.method} onChange={e => setWithdrawForm({...withdrawForm, method: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-green-400"
                >
                  <option value="bank">🏦 Bank Transfer</option>
                  <option value="xeed">💳 XeedWallet</option>
                  <option value="paypal">🅿️ PayPal</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Fee: $5.00</p>
                <p className="text-sm font-bold text-gray-900 mt-1">You will receive: ${(parseFloat(withdrawForm.amount) - 5).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 border-2 border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg">Cancel</button>
              <button className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}