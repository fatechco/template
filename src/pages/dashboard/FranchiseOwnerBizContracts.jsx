import { useState } from 'react';
import { Plus, Eye, Download, Edit, Trash2, FileText, CheckCircle, Clock } from 'lucide-react';

const CONTRACTS = [
  { id: 1, number: "CON-001", client: "Ahmed Hassan", type: "Service Agreement", status: "active", startDate: "2026-01-15", endDate: "2027-01-15", value: 50000 },
  { id: 2, number: "CON-002", client: "Fatima Ali", type: "Project Contract", status: "active", startDate: "2026-02-01", endDate: "2026-12-31", value: 75000 },
  { id: 3, number: "CON-003", client: "Mohamed Samir", type: "Maintenance", status: "pending", startDate: "2026-04-01", endDate: "2027-03-31", value: 35000 },
  { id: 4, number: "CON-004", client: "Leila Ahmed", type: "Service Agreement", status: "expired", startDate: "2025-03-01", endDate: "2026-03-01", value: 40000 },
];

const STATUS_CONFIG = {
  active: { badge: "bg-green-100 text-green-700", icon: "✅" },
  pending: { badge: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  expired: { badge: "bg-red-100 text-red-700", icon: "❌" },
  archived: { badge: "bg-gray-100 text-gray-700", icon: "📦" },
};

export default function FranchiseOwnerBizContracts() {
  const [contracts, setContracts] = useState(CONTRACTS);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newContract, setNewContract] = useState({
    client: '',
    type: 'Service Agreement',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    value: '',
  });

  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingContracts = contracts.filter(c => c.status === 'pending').length;
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📋 Contracts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage client and service contracts</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Contracts", value: contracts.length, icon: "📄" },
          { label: "Active", value: activeContracts, icon: "✅" },
          { label: "Pending", value: pendingContracts, icon: "⏳" },
          { label: "Total Value", value: `$${totalValue.toLocaleString()}`, icon: "💰" },
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
              <th className="px-6 py-4 text-left font-bold text-gray-900">Contract #</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Value</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Period</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contracts.map(contract => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{contract.number}</td>
                <td className="px-6 py-4 text-gray-700">{contract.client}</td>
                <td className="px-6 py-4 text-gray-600">{contract.type}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${contract.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600 text-xs">
                  {contract.startDate} to {contract.endDate}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[contract.status].badge}`}>
                    {STATUS_CONFIG[contract.status].icon} {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedContract(contract)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Download size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Contract {selectedContract.number}</h2>
              <button onClick={() => setSelectedContract(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Client</p>
                  <p className="font-bold text-gray-900">{selectedContract.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Contract Type</p>
                  <p className="font-bold text-gray-900">{selectedContract.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Contract Value</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedContract.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[selectedContract.status].badge}`}>
                    {STATUS_CONFIG[selectedContract.status].icon} {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Contract Period</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">Start Date</p>
                    <p className="font-bold text-gray-900">{selectedContract.startDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">End Date</p>
                    <p className="font-bold text-gray-900">{selectedContract.endDate}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Document</p>
                <button className="w-full border border-gray-300 text-gray-700 font-bold py-2.5 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <FileText size={16} /> Download Contract PDF
                </button>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedContract(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Edit Contract</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Contract</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client Name *</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={newContract.client}
                  onChange={(e) => setNewContract({ ...newContract, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Contract Type</label>
                <select
                  value={newContract.type}
                  onChange={(e) => setNewContract({ ...newContract, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option>Service Agreement</option>
                  <option>Project Contract</option>
                  <option>Maintenance</option>
                  <option>Retainer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Contract Value ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newContract.value}
                  onChange={(e) => setNewContract({ ...newContract, value: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Start Date</label>
                <input
                  type="date"
                  value={newContract.startDate}
                  onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">End Date</label>
                <input
                  type="date"
                  value={newContract.endDate}
                  onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newContract.client && newContract.value && newContract.endDate) {
                      setContracts([...contracts, {
                        id: Math.max(...contracts.map(c => c.id), 0) + 1,
                        number: `CON-${String(contracts.length + 1).padStart(3, '0')}`,
                        ...newContract,
                        value: parseFloat(newContract.value),
                        status: 'pending',
                      }]);
                      setShowForm(false);
                      setNewContract({ client: '', type: 'Service Agreement', startDate: new Date().toISOString().split('T')[0], endDate: '', value: '' });
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700"
                >
                  Create Contract
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}