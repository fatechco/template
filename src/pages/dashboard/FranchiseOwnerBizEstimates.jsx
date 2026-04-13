import { useState } from 'react';
import { Plus, Eye, Send, FileText, Download, Edit, Trash2 } from 'lucide-react';

const ESTIMATES = [
  { id: 1, number: "EST-001", client: "Ahmed Hassan", amount: 12000, status: "open", date: "2026-03-20", items: 4 },
  { id: 2, number: "EST-002", client: "Fatima Ali", amount: 7500, status: "approved", date: "2026-03-19", items: 3 },
  { id: 3, number: "EST-003", client: "Mohamed Samir", amount: 18000, status: "open", date: "2026-03-18", items: 6 },
];

const STATUS_CONFIG = {
  open: { badge: "bg-yellow-100 text-yellow-700", color: "yellow" },
  approved: { badge: "bg-green-100 text-green-700", color: "green" },
  rejected: { badge: "bg-red-100 text-red-700", color: "red" },
  completed: { badge: "bg-blue-100 text-blue-700", color: "blue" },
};

export default function FranchiseOwnerBizEstimates() {
  const [estimates, setEstimates] = useState(ESTIMATES);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEstimate, setNewEstimate] = useState({
    client: '',
    amount: '',
    items: '1',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📐 Estimates</h1>
          <p className="text-gray-500 text-sm mt-1">Create and track cost estimates</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Estimate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Estimates", value: estimates.length, icon: "📊" },
          { label: "Open", value: estimates.filter(e => e.status === 'open').length, icon: "📂" },
          { label: "Approved", value: estimates.filter(e => e.status === 'approved').length, icon: "✅" },
          { label: "Total Value", value: `$${estimates.reduce((s, e) => s + e.amount, 0).toLocaleString()}`, icon: "💰" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Estimate #</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {estimates.map(estimate => (
              <tr key={estimate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{estimate.number}</td>
                <td className="px-6 py-4 text-gray-700">{estimate.client}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${estimate.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[estimate.status].badge}`}>
                    {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{estimate.date}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedEstimate(estimate)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Download size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedEstimate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Estimate {selectedEstimate.number}</h2>
              <button onClick={() => setSelectedEstimate(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Client</p>
                  <p className="font-bold text-gray-900">{selectedEstimate.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[selectedEstimate.status].badge}`}>
                    {selectedEstimate.status.charAt(0).toUpperCase() + selectedEstimate.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Amount</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedEstimate.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Date</p>
                  <p className="font-bold text-gray-900">{selectedEstimate.date}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Items ({selectedEstimate.items})</p>
                <div className="space-y-2">
                  {[...Array(selectedEstimate.items)].map((_, i) => (
                    <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900 font-medium">Item {i + 1}</span>
                      <span className="text-sm font-bold text-gray-900">${(selectedEstimate.amount / selectedEstimate.items).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedEstimate(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Approve Estimate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Estimate</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client Name *</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={newEstimate.client}
                  onChange={(e) => setNewEstimate({ ...newEstimate, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Estimate Amount ($) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newEstimate.amount}
                  onChange={(e) => setNewEstimate({ ...newEstimate, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Number of Items</label>
                <input
                  type="number"
                  min="1"
                  value={newEstimate.items}
                  onChange={(e) => setNewEstimate({ ...newEstimate, items: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newEstimate.client && newEstimate.amount) {
                      setEstimates([...estimates, {
                        id: Math.max(...estimates.map(e => e.id), 0) + 1,
                        number: `EST-${String(estimates.length + 1).padStart(3, '0')}`,
                        amount: parseFloat(newEstimate.amount),
                        items: parseInt(newEstimate.items),
                        date: new Date().toISOString().split('T')[0],
                        status: 'open',
                        ...newEstimate,
                      }]);
                      setShowForm(false);
                      setNewEstimate({ client: '', amount: '', items: '1' });
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700"
                >
                  Create Estimate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}