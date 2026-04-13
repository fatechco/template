import React, { useState } from "react";
import { Search, Download, Eye, Edit, MoreVertical, X } from "lucide-react";

const mockProjects = [
  { id: 1, name: "New Cairo City", logo: "🏗", developer: "Cairo Developments", city: "New Cairo", units: 450, status: "active", delivery: "Q4 2025", source: "on-site" },
  { id: 2, name: "Sheikh Zayed Phase 2", logo: "🏢", developer: "Gold Coast", city: "Giza", units: 320, status: "pending", delivery: "Q2 2026", source: "on-site" },
  { id: 3, name: "Downtown Mall Complex", logo: "🏬", developer: "Megamall Corp", city: "Cairo", units: 180, status: "active", delivery: "Q1 2025", source: "imported" },
];

export default function ProjectsListTemplate({ tab = "all" }) {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailPanel, setDetailPanel] = useState(null);

  const filtered = mockProjects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.developer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      imported: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Projects</h1>
        <p className="text-sm text-gray-600 mt-1">Manage development projects</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { id: "all", label: "All", count: 3 },
          { id: "active", label: "Active", count: 2 },
          { id: "pending", label: "Pending", count: 1 },
          { id: "onsite", label: "On-Site", count: 2 },
          { id: "imported", label: "Imported", count: 1 },
          { id: "franchise", label: "Franchise", count: 0 },
        ].map(t => (
          <button
            key={t.id}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded-t-lg transition-all border-b-2 ${
              tab === t.id
                ? "border-orange-600 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label} <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded-full ml-1">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, developer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
            <option>All Cities</option>
            <option>Cairo</option>
            <option>Giza</option>
            <option>Alexandria</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Reset</button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{selected.length} projects selected</span>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">✅ Activate</button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">🗑 Delete</button>
            <button onClick={() => setSelected([])} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300">❌ Clear</button>
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
                <th className="px-4 py-3 text-left font-bold text-gray-700">Project Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Developer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Delivery</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(proj => (
                <tr key={proj.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(proj.id)} onChange={() => toggleSelect(proj.id)} className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{proj.logo}</span>
                      <span className="font-bold text-gray-900">{proj.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{proj.developer}</td>
                  <td className="px-4 py-3 text-gray-600">{proj.city}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{proj.units}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(proj.status)}`}>{proj.status}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{proj.delivery}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{proj.source}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setDetailPanel(proj)} className="p-1 hover:bg-gray-200 rounded">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Edit size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded text-blue-600 font-bold text-xs">📊 Units</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {detailPanel && (
        <div className="fixed right-0 top-16 h-screen w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-40">
          <div className="p-6 space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">{detailPanel.logo}</div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">{detailPanel.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{detailPanel.developer}</p>
              </div>
              <button onClick={() => setDetailPanel(null)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Units</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{detailPanel.units}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Status</p>
                <p className={`text-sm font-bold mt-1 ${getStatusColor(detailPanel.status)}`}>{detailPanel.status}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Delivery Date</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{detailPanel.delivery}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}