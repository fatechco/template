import { useState } from 'react';
import { Plus, Eye, Send, FileText, Download, Edit, Trash2 } from 'lucide-react';

const PROPOSALS = [
  { id: 1, number: "PRO-001", client: "Ahmed Hassan", amount: 15000, status: "sent", date: "2026-03-20", validUntil: "2026-04-20", items: 5 },
  { id: 2, number: "PRO-002", client: "Fatima Ali", amount: 8500, status: "draft", date: "2026-03-19", validUntil: "2026-04-19", items: 3 },
  { id: 3, number: "PRO-003", client: "Mohamed Samir", amount: 22000, status: "accepted", date: "2026-03-18", validUntil: "2026-04-18", items: 7 },
];

const STATUS_CONFIG = {
  draft: { badge: "bg-gray-100 text-gray-700", color: "gray" },
  sent: { badge: "bg-blue-100 text-blue-700", color: "blue" },
  accepted: { badge: "bg-green-100 text-green-700", color: "green" },
  rejected: { badge: "bg-red-100 text-red-700", color: "red" },
};

export default function FranchiseOwnerBizProposals() {
  const [proposals, setProposals] = useState(PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    client: '',
    amount: '',
    items: '1',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📋 Proposals</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage sales proposals</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Proposals", value: proposals.length, icon: "📊" },
          { label: "Sent", value: proposals.filter(p => p.status === 'sent').length, icon: "📤" },
          { label: "Accepted", value: proposals.filter(p => p.status === 'accepted').length, icon: "✅" },
          { label: "Total Value", value: `$${proposals.reduce((s, p) => s + p.amount, 0).toLocaleString()}`, icon: "💰" },
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
              <th className="px-6 py-4 text-left font-bold text-gray-900">Proposal #</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Valid Until</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proposals.map(proposal => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{proposal.number}</td>
                <td className="px-6 py-4 text-gray-700">{proposal.client}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${proposal.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[proposal.status].badge}`}>
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{proposal.validUntil}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedProposal(proposal)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Send size={16} /></button>
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
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Proposal {selectedProposal.number}</h2>
              <button onClick={() => setSelectedProposal(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Client</p>
                  <p className="font-bold text-gray-900">{selectedProposal.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[selectedProposal.status].badge}`}>
                    {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Amount</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedProposal.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Valid Until</p>
                  <p className="font-bold text-gray-900">{selectedProposal.validUntil}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Items ({selectedProposal.items})</p>
                <div className="space-y-2">
                  {[...Array(selectedProposal.items)].map((_, i) => (
                    <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900 font-medium">Item {i + 1}</span>
                      <span className="text-sm font-bold text-gray-900">${(selectedProposal.amount / selectedProposal.items).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedProposal(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Send Proposal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Proposal</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client Name *</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={newProposal.client}
                  onChange={(e) => setNewProposal({ ...newProposal, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Proposal Amount ($) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newProposal.amount}
                  onChange={(e) => setNewProposal({ ...newProposal, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Number of Items</label>
                <input
                  type="number"
                  min="1"
                  value={newProposal.items}
                  onChange={(e) => setNewProposal({ ...newProposal, items: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Valid Until</label>
                <input
                  type="date"
                  value={newProposal.validUntil}
                  onChange={(e) => setNewProposal({ ...newProposal, validUntil: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newProposal.client && newProposal.amount) {
                      setProposals([...proposals, {
                        id: Math.max(...proposals.map(p => p.id), 0) + 1,
                        number: `PRO-${String(proposals.length + 1).padStart(3, '0')}`,
                        amount: parseFloat(newProposal.amount),
                        items: parseInt(newProposal.items),
                        date: new Date().toISOString().split('T')[0],
                        status: 'draft',
                        ...newProposal,
                      }]);
                      setShowForm(false);
                      setNewProposal({ client: '', amount: '', items: '1', validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}