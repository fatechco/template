import React, { useState } from "react";
import { Search, Download, Plus, Eye, Edit, MoreVertical, X } from "lucide-react";

const mockProperties = [
  { id: 1, title: "Modern Villa Cairo", code: "PROP-001", thumbnail: "🏠", category: "Villa", purpose: "Sale", owner: "Ahmed Hassan", city: "Cairo", price: 850000, status: "active", verified: true, featured: true, source: "on-site", date: "2024-03-15", views: 234 },
  { id: 2, title: "Apartment Giza", code: "PROP-002", thumbnail: "🏢", category: "Apartment", purpose: "Rent", owner: "Layla Mohamed", city: "Giza", price: 2500, status: "pending", verified: false, featured: false, source: "on-site", date: "2024-03-18", views: 45 },
  { id: 3, title: "Downtown Office", code: "PROP-003", thumbnail: "🏬", category: "Office", purpose: "Rent", owner: "Omar Khalil", city: "Cairo", price: 5000, status: "active", verified: true, featured: false, source: "imported", date: "2024-03-10", views: 567 },
];

export default function PropertiesListTemplate({ tab = "all" }) {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailPanel, setDetailPanel] = useState(null);

  const filtered = mockProperties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-black text-gray-900">Properties</h1>
        <p className="text-sm text-gray-600 mt-1">Manage property listings</p>
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
                placeholder="Search title, ID, owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
            <option>All Categories</option>
            <option>Villa</option>
            <option>Apartment</option>
            <option>Office</option>
          </select>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
            <option>All Purposes</option>
            <option>Sale</option>
            <option>Rent</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Reset</button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{selected.length} properties selected</span>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">✅ Activate</button>
            <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-200">⏳ Pending</button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">⭐ Featured</button>
            <button className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200">✅ Verify</button>
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
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Featured</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Views</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(prop.id)}
                      onChange={() => toggleSelect(prop.id)}
                      className="rounded"
                    />
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
                  <td className="px-4 py-3 text-gray-600">{prop.category}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{prop.owner}</td>
                  <td className="px-4 py-3 text-gray-600">{prop.city}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">EGP {prop.price.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(prop.status)}`}>{prop.status}</span></td>
                  <td className="px-4 py-3">{prop.verified ? "✅" : "❌"}</td>
                  <td className="px-4 py-3">{prop.featured ? "⭐" : "☆"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{prop.source}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{prop.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setDetailPanel(prop)} className="p-1 hover:bg-gray-200 rounded">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Edit size={14} className="text-gray-600" />
                      </button>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical size={14} className="text-gray-600" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48 text-xs">
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">✅ Verify</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">⭐ Feature</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">🔄 Recent</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">📋 Duplicate</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">👤 View Owner</button>
                          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">🗑 Delete</button>
                        </div>
                      </div>
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
            {/* Gallery Preview */}
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">{detailPanel.thumbnail}</div>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">{detailPanel.title}</h2>
                <p className="text-xs text-gray-500 mt-1">{detailPanel.code}</p>
              </div>
              <button onClick={() => setDetailPanel(null)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              <button className="px-4 py-2 font-bold text-orange-600 border-b-2 border-orange-600">Details</button>
              <button className="px-4 py-2 font-bold text-gray-600">Owner</button>
              <button className="px-4 py-2 font-bold text-gray-600">History</button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Category</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{detailPanel.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Purpose</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{detailPanel.purpose}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Location</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{detailPanel.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Price</p>
                <p className="text-sm text-gray-900 font-bold mt-1">EGP {detailPanel.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Status</p>
                <p className={`text-sm font-bold mt-1 ${getStatusColor(detailPanel.status)}`}>{detailPanel.status}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold focus:border-orange-500 focus:outline-none">
                <option>Change Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">✅ Approve</button>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">❌ Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}