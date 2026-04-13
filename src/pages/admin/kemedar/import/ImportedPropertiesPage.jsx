import { Search, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

const mockProperties = [
  { id: 1, title: "Modern Villa Cairo", code: "IMP-001", thumbnail: "🏠", owner: "Ahmed Hassan", city: "Cairo", price: 850000, status: "imported", source: "Aqarmap", imported: "2024-03-21", views: 234 },
  { id: 2, title: "Apartment Giza", code: "IMP-002", thumbnail: "🏢", owner: "Layla Mohamed", city: "Giza", price: 2500, status: "imported", source: "OLX", imported: "2024-03-20", views: 45 },
];

export default function ImportedPropertiesPage() {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mockProperties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Imported Properties</h1>
        <p className="text-sm text-gray-600 mt-1">Manage imported property listings</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{selected.length} properties selected</span>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">✅ Move to Active</button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">👤 Create User</button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">🗑 Delete</button>
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
                <th className="px-4 py-3 text-left font-bold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Imported</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(prop.id)} onChange={() => toggleSelect(prop.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{prop.thumbnail}</span>
                      <div>
                        <p className="font-bold text-gray-900">{prop.title}</p>
                        <p className="text-xs text-gray-500">{prop.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{prop.owner}</td>
                  <td className="px-4 py-3 text-gray-600">{prop.city}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">EGP {prop.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Imported</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{prop.source}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{prop.imported}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button className="p-1 hover:bg-gray-200 rounded text-blue-600">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-green-600 font-bold text-xs">✅ Move</button>
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