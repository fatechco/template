import { useState } from 'react';
import { Eye, Printer, RotateCcw, Trash2, Award } from 'lucide-react';

const ACCREDITED_DATA = [
  { id: 1, name: "Hassan Ibrahim", idCard: "KH-A89B2F", specialization: "Plumbing", accreditDate: "2025-01-15", jobsDone: 87, rating: 4.9, status: "active", avatar: "HI" },
  { id: 2, name: "Karim Ali", idCard: "KH-C45D7E", specialization: "Electrical", accreditDate: "2025-02-10", jobsDone: 65, rating: 4.8, status: "active", avatar: "KA" },
  { id: 3, name: "Mohamed Ahmed", idCard: "KH-B12F4G", specialization: "Carpentry", accreditDate: "2024-12-01", jobsDone: 54, rating: 4.7, status: "active", avatar: "MA" },
];

export default function FranchiseOwnerAccreditedHandymen() {
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-yellow-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} Kemework {">"} Accredited</p>
        <h1 className="text-3xl font-black text-gray-900">Accredited Handymen</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Accredited", value: ACCREDITED_DATA.length, icon: "🏅" },
          { label: "Active", value: ACCREDITED_DATA.filter(h => h.status === "active").length, icon: "✅" },
          { label: "Avg Rating", value: "4.8", icon: "⭐" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">ID Card #</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Specialization</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Accredited Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Jobs Done</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Rating</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ACCREDITED_DATA.map(handyman => (
                <tr key={handyman.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-xs">{handyman.avatar}</div>
                      <span className="font-bold text-gray-900">{handyman.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-yellow-600">{handyman.idCard}</td>
                  <td className="px-4 py-3 text-gray-600">{handyman.specialization}</td>
                  <td className="px-4 py-3 text-gray-600">{handyman.accreditDate}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{handyman.jobsDone}</td>
                  <td className="px-4 py-3 font-bold text-yellow-600">⭐ {handyman.rating}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">Active</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedHandyman(handyman)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button onClick={() => setShowPrintModal(true)} className="p-1.5 hover:bg-gray-100 rounded text-yellow-600"><Printer size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-blue-600"><RotateCcw size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4 text-white font-black text-3xl">
                🏅
              </div>
              <p className="text-xl font-black text-gray-900 mb-1">Hassan Ibrahim</p>
              <p className="text-sm text-gray-600 mb-4">Certified Plumbing Professional</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600">ID Card Number</p>
                <p className="text-2xl font-black text-yellow-600">KH-A89B2F</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowPrintModal(false)} className="flex-1 border border-gray-300 text-gray-900 font-bold py-2 rounded-lg">Close</button>
                <button onClick={() => window.print()} className="flex-1 bg-yellow-600 text-white font-bold py-2 rounded-lg hover:bg-yellow-700">🖨 Print Card</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}