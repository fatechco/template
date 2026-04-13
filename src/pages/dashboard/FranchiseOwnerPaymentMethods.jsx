import { CreditCard, Plus, Edit2, Trash2, Check } from "lucide-react";
import { useState } from "react";

const PAYMENT_METHODS = [
  { id: 1, type: "bank", label: "National Bank", last4: "1234", status: "verified", isDefault: true },
  { id: 2, type: "card", label: "Visa Card", last4: "5678", status: "verified", isDefault: false },
  { id: 3, type: "wallet", label: "XeedWallet", last4: "9999", status: "verified", isDefault: false },
];

export default function FranchiseOwnerPaymentMethods() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">💳 Payment Methods</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your payment methods for withdrawals</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Payment Method
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 gap-4">
        {PAYMENT_METHODS.map(method => (
          <div key={method.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-500">•••• •••• •••• {method.last4}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">✓ {method.status}</span>
                  {method.isDefault && <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">Default</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit2 size={18} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Method Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add Payment Method</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Payment Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500">
                  <option>🏦 Bank Transfer</option>
                  <option>💳 Credit/Debit Card</option>
                  <option>💰 XeedWallet</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Account Holder Name</label>
                <input type="text" placeholder="Enter name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Account/Card Number</label>
                <input type="text" placeholder="Enter account number" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-700">Set as default payment method</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}