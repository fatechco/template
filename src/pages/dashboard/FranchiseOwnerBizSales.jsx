import { useState } from 'react';
import { Plus, Eye, Edit, Copy, Send, Download, MoreVertical } from 'lucide-react';

const SALES_TABS = [
  { id: "proposals", label: "Proposals" },
  { id: "estimates", label: "Estimates" },
  { id: "invoices", label: "Invoices" },
  { id: "credits", label: "Credit Notes" },
  { id: "items", label: "Items" },
];

const INVOICES = [
  { id: 1, num: "KFO-001", client: "Ahmed Hassan", amount: 5000, status: "draft", date: "2026-03-20", dueDate: "2026-04-20" },
  { id: 2, num: "KFO-002", client: "Fatima Ali", amount: 3500, status: "sent", date: "2026-03-19", dueDate: "2026-04-19" },
  { id: 3, num: "KFO-003", client: "Mohamed Samir", amount: 8000, status: "paid", date: "2026-03-18", dueDate: "2026-04-18" },
];

export default function FranchiseOwnerBizSales() {
  const [activeTab, setActiveTab] = useState("invoices");
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [lineItems, setLineItems] = useState([{ id: 1, description: "", quantity: 1, unitPrice: 0, tax: 0, discount: 0 }]);

  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalTax = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.tax / 100), 0);
  const totalDiscount = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.discount / 100), 0);
  const grandTotal = subtotal + totalTax - totalDiscount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="border-l-4 border-emerald-600 pl-4">
          <h1 className="text-3xl font-black text-gray-900">Sales Management</h1>
        </div>
        {activeTab !== "items" && (
          <button onClick={() => setShowCreateInvoice(true)} className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-emerald-700">
            <Plus size={18} /> Create Document
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {SALES_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600 bg-emerald-50"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">#</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Client</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-bold text-gray-900">{inv.num}</td>
                  <td className="px-6 py-3 text-gray-700">{inv.client}</td>
                  <td className="px-6 py-3 font-bold text-gray-900">${inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      inv.status === "paid" ? "bg-green-100 text-green-700" :
                      inv.status === "sent" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{inv.date}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Send size={16} /></button>
                      <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Download size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Create Invoice</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Client</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400">
                    <option>Ahmed Hassan</option>
                    <option>Fatima Ali</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Invoice #</label>
                  <input type="text" value="KFO-004" disabled className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Due Date</label>
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Line Items</h3>
                  <button className="text-xs text-emerald-600 font-bold">+ Add Item</button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-bold">Description</th>
                        <th className="px-3 py-2 text-left font-bold">Qty</th>
                        <th className="px-3 py-2 text-left font-bold">Unit Price</th>
                        <th className="px-3 py-2 text-left font-bold">Tax %</th>
                        <th className="px-3 py-2 text-left font-bold">Discount %</th>
                        <th className="px-3 py-2 text-left font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {lineItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-3 py-2"><input type="text" placeholder="Service description" className="w-full border border-gray-200 rounded px-2 py-1 text-xs" /></td>
                          <td className="px-3 py-2"><input type="number" defaultValue={1} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs" /></td>
                          <td className="px-3 py-2"><input type="number" placeholder="0" className="w-20 border border-gray-200 rounded px-2 py-1 text-xs" /></td>
                          <td className="px-3 py-2"><input type="number" defaultValue={0} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs" /></td>
                          <td className="px-3 py-2"><input type="number" defaultValue={0} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs" /></td>
                          <td className="px-3 py-2 font-bold">0.00</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Notes</label>
                  <textarea placeholder="Additional notes..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none h-16" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="text-sm text-gray-600">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></div>
                  <div className="text-sm text-gray-600">Tax: <span className="font-bold text-green-600">+${totalTax.toFixed(2)}</span></div>
                  <div className="text-sm text-gray-600">Discount: <span className="font-bold text-red-600">-${totalDiscount.toFixed(2)}</span></div>
                  <div className="text-xl font-black text-emerald-600 pt-2 border-t border-gray-200">Grand Total: ${grandTotal.toFixed(2)}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreateInvoice(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button className="flex-1 border-2 border-emerald-600 text-emerald-600 font-bold py-2.5 rounded-lg hover:bg-emerald-50">Save Draft</button>
                <button className="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700">Send to Client</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}