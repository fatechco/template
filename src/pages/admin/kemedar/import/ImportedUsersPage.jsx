import { Search, Download, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", phone: "+201001234567", role: "Agent", source: "Aqarmap", imported: "2024-03-21", properties: 12 },
  { id: 2, name: "Layla Mohamed", email: "layla@example.com", phone: "+201101234567", role: "Investor", source: "OLX", imported: "2024-03-20", properties: 5 },
];

export default function ImportedUsersPage() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id));
  };

  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Imported Users</h1>
        <p className="text-sm text-gray-600 mt-1">Manage imported user accounts</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{selected.length} users selected</span>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">✅ Activate All</button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">📤 Export</button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">🗑 Delete All</button>
            <button onClick={() => setSelected([])} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Imported</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelect(user.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{user.role}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.source}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.imported}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{user.properties}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded text-green-600">
                      <CheckCircle size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}