import React, { useState } from "react";
import { Plus, Edit, Trash2, GripVertical, X, Search } from "lucide-react";

export default function FeaturedRecentTemplate({ title, type = "featured" }) {
  const mockItems = [
    { id: 1, rank: 1, thumbnail: "🏠", name: "Modern Villa Cairo", owner: "Ahmed Hassan", startDate: "2024-03-01", endDate: "2024-06-01", active: true },
    { id: 2, rank: 2, thumbnail: "🏢", name: "Downtown Apartment", owner: "Layla Mohamed", startDate: "2024-03-10", endDate: "2024-05-10", active: true },
    { id: 3, rank: 3, thumbnail: "🏬", name: "Office Complex", owner: "Omar Khalil", startDate: "2024-03-15", endDate: null, active: false },
  ];

  const [items, setItems] = useState(mockItems);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("index", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("index"));
    const newItems = [...items];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setItems(newItems.map((item, idx) => ({ ...item, rank: idx + 1 })));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage {title.toLowerCase()} items</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
          <Plus size={16} /> Add {title.slice(0, -1)}
        </button>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="p-4 hover:bg-gray-50 flex items-center gap-4 cursor-move transition-colors"
            >
              <GripVertical size={18} className="text-gray-400 flex-shrink-0" />
              <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-700 flex-shrink-0">
                {item.rank}
              </div>
              <div className="text-3xl flex-shrink-0">{item.thumbnail}</div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-600">{item.owner}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">{item.startDate}</span>
                {item.endDate && <span className="text-xs text-gray-600 whitespace-nowrap">to {item.endDate}</span>}
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={item.active} className="rounded" />
              </label>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Edit size={14} className="text-blue-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Add {title.slice(0, -1)}</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                {mockItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="w-full text-left p-3 hover:bg-white rounded-lg border border-transparent hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.thumbnail}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.owner}</p>
                      </div>
                      <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold hover:bg-orange-200">
                        Select
                      </button>
                    </div>
                  </button>
                ))}
              </div>

              {selectedItem && (
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-gray-900">Start Date</label>
                      <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900">End Date (Optional)</label>
                      <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900">Position</label>
                    <input type="number" defaultValue="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900">Display On</label>
                    <div className="space-y-2 mt-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Homepage slider</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Search results top</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Category page top</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={() => { setShowModal(false); setSelectedItem(null); }} className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700">
                    Add to {title}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}