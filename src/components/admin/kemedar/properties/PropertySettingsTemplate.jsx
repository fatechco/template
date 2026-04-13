import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function PropertySettingsTemplate({ title, columns, mockData }) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAdd = () => {
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage {title.toLowerCase()}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700"
        >
          <Plus size={16} /> Add {title.slice(0, -1)}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map(col => (
                  <th key={col} className="px-4 py-3 text-left font-bold text-gray-700">{col}</th>
                ))}
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col} className="px-4 py-3 text-gray-900">
                      {col === "Icon" && <span className="text-2xl">{item.icon || "📌"}</span>}
                      {col === "Name (EN)" && <span className="font-bold">{item.nameEn || item.name}</span>}
                      {col === "Name (AR)" && <span>{item.nameAr || "—"}</span>}
                      {col === "Slug" && <span className="text-gray-600">{item.slug || "—"}</span>}
                      {col === "Category" && <span className="text-gray-600">{item.category || "—"}</span>}
                      {col === "Count" && <span className="font-bold">{item.count}</span>}
                      {col === "Sort" && <span className="text-gray-600">{item.sort || "—"}</span>}
                      {col === "Status" && <span className={`px-2 py-1 rounded text-xs font-bold ${item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{item.active ? "Active" : "Inactive"}</span>}
                      {col === "Unit" && <span className="text-gray-600">{item.unit || "—"}</span>}
                    </td>
                  ))}
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1 hover:bg-gray-200 rounded">
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">{editingId ? "Edit" : "Add"} {title.slice(0, -1)}</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Name (English)</label>
                <input
                  type="text"
                  placeholder="Enter name in English"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Name (Arabic)</label>
                <input
                  type="text"
                  placeholder="أدخل الاسم بالعربية"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Slug</label>
                <input
                  type="text"
                  placeholder="auto-generated"
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Status</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}