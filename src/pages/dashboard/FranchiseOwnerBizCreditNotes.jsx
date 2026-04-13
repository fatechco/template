import { useState } from 'react';
import { Plus, Eye, FileText, Download, Edit } from 'lucide-react';

const CREDIT_NOTES = [
  { id: 1, number: "CN-001", invoice: "INV-001", client: "Ahmed Hassan", amount: 500, reason: "Discount", date: "2026-03-20", status: "issued" },
  { id: 2, number: "CN-002", invoice: "INV-002", client: "Fatima Ali", amount: 250, reason: "Return", date: "2026-03-19", status: "issued" },
  { id: 3, number: "CN-003", invoice: "INV-003", client: "Mohamed Samir", amount: 1000, reason: "Damage", date: "2026-03-18", status: "pending" },
];

export default function FranchiseOwnerBizCreditNotes() {
  const [creditNotes, setCreditNotes] = useState(CREDIT_NOTES);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState({
    invoice: '',
    client: '',
    amount: '',
    reason: 'Discount',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📝 Credit Notes</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer credit notes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Credit Note
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Notes", value: creditNotes.length, icon: "📄" },
          { label: "Issued", value: creditNotes.filter(n => n.status === 'issued').length, icon: "✅" },
          { label: "Pending", value: creditNotes.filter(n => n.status === 'pending').length, icon: "⏳" },
          { label: "Total Credits", value: `$${creditNotes.reduce((s, n) => s + n.amount, 0).toLocaleString()}`, icon: "💳" },
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
              <th className="px-6 py-4 text-left font-bold text-gray-900">Note #</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Invoice</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Reason</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {creditNotes.map(note => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{note.number}</td>
                <td className="px-6 py-4 text-gray-700">{note.invoice}</td>
                <td className="px-6 py-4 text-gray-700">{note.client}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${note.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{note.reason}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    note.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedNote(note)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
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
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Credit Note {selectedNote.number}</h2>
              <button onClick={() => setSelectedNote(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Related Invoice</p>
                  <p className="font-bold text-gray-900">{selectedNote.invoice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Client</p>
                  <p className="font-bold text-gray-900">{selectedNote.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Amount</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedNote.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Reason</p>
                  <p className="font-bold text-gray-900">{selectedNote.reason}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Status</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  selectedNote.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedNote.status.charAt(0).toUpperCase() + selectedNote.status.slice(1)}
                </span>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedNote(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Credit Note</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Invoice Number *</label>
                <input
                  type="text"
                  placeholder="INV-001"
                  value={newNote.invoice}
                  onChange={(e) => setNewNote({ ...newNote, invoice: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client Name *</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={newNote.client}
                  onChange={(e) => setNewNote({ ...newNote, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Credit Amount ($) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newNote.amount}
                  onChange={(e) => setNewNote({ ...newNote, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Reason</label>
                <select
                  value={newNote.reason}
                  onChange={(e) => setNewNote({ ...newNote, reason: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option>Discount</option>
                  <option>Return</option>
                  <option>Damage</option>
                  <option>Cancellation</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newNote.invoice && newNote.client && newNote.amount) {
                      setCreditNotes([...creditNotes, {
                        id: Math.max(...creditNotes.map(n => n.id), 0) + 1,
                        number: `CN-${String(creditNotes.length + 1).padStart(3, '0')}`,
                        date: new Date().toISOString().split('T')[0],
                        status: 'issued',
                        amount: parseFloat(newNote.amount),
                        ...newNote,
                      }]);
                      setShowForm(false);
                      setNewNote({ invoice: '', client: '', amount: '', reason: 'Discount' });
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700"
                >
                  Create Credit Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}