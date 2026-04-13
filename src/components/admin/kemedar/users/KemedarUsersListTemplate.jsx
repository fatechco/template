import React, { useState } from "react";
import { Search, Download, Plus, Eye, Edit, MoreVertical, Filter, X } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Ahmed Hassan", email: "ahmed@example.com", phone: "+201001234567", role: "Agent", country: "Egypt", city: "Cairo", properties: 12, status: "active", verified: true, joined: "2024-01-15" },
  { id: 2, name: "Layla Mohamed", email: "layla@example.com", phone: "+201101234567", role: "Common User", country: "Egypt", city: "Giza", properties: 3, status: "active", verified: false, joined: "2024-02-10" },
  { id: 3, name: "Omar Khalil", email: "omar@example.com", phone: "+201201234567", role: "Developer", country: "Egypt", city: "Alexandria", properties: 25, status: "pending", verified: true, joined: "2024-03-01" },
  { id: 4, name: "Fatima Ali", email: "fatima@example.com", phone: "+201301234567", role: "Agency", country: "Egypt", city: "New Cairo", properties: 45, status: "active", verified: true, joined: "2024-01-20" },
  { id: 5, name: "Khaled Mustafa", email: "khaled@example.com", phone: "+201401234567", role: "Franchise Owner", country: "Egypt", city: "6th October", properties: 18, status: "suspended", verified: false, joined: "2024-02-05" },
];

export default function KemedarUsersListTemplate({ title, userType }) {
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailPanel, setShowDetailPanel] = useState(null);

  const filtered = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      suspended: "bg-red-100 text-red-700",
      imported: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id));
  };

  const toggleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">Manage {userType} users</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
              <Download size={16} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{selected.length} users selected</span>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">✅ Activate</button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">⛔ Suspend</button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">✉️ Email</button>
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
                <th className="px-4 py-3 text-left font-bold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Joined</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">{user.role}</span></td>
                  <td className="px-4 py-3 text-gray-600">{user.city}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{user.properties}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(user.status)}`}>{user.status}</span></td>
                  <td className="px-4 py-3">{user.verified ? "✅" : "❌"}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setShowDetailPanel(user)} className="p-1 hover:bg-gray-200 rounded">
                        <Eye size={14} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Edit size={14} className="text-gray-600" />
                      </button>
                      <div className="relative group">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical size={14} className="text-gray-600" />
                        </button>
                        <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-40">
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">✅ Activate</button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">⛔ Suspend</button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">✉️ Email</button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">🔑 Reset Password</button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">🏠 View Properties</button>
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">🗑 Delete</button>
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
      {showDetailPanel && (
        <div className="fixed right-0 top-16 h-screen w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{showDetailPanel.name}</h2>
                <span className={`inline-block mt-1 px-3 py-1 rounded text-xs font-bold ${getStatusColor(showDetailPanel.status)}`}>{showDetailPanel.status}</span>
              </div>
              <button onClick={() => setShowDetailPanel(null)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">ID</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Email</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Phone</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Role</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Location</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.city}, {showDetailPanel.country}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Properties</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.properties}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Joined</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetailPanel.joined}</p>
              </div>
              <a href="#" className="inline-block text-orange-600 font-bold text-sm hover:underline">View Full Profile →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}