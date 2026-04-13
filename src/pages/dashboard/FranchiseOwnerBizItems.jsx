import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const ITEMS = [
  { id: 1, name: "Construction Labor - Day Rate", sku: "CONST-001", category: "Labor", price: 500, tax: 50, costPrice: 400, stock: 100, status: "active" },
  { id: 2, name: "Premium Paint - 20L", sku: "PAINT-001", category: "Materials", price: 800, tax: 80, costPrice: 600, stock: 45, status: "active" },
  { id: 3, name: "Cement Bags - 50kg", sku: "CEMENT-001", category: "Materials", price: 150, tax: 15, costPrice: 120, stock: 200, status: "active" },
  { id: 4, name: "Design Consultation - Hour", sku: "DESIGN-001", category: "Services", price: 350, tax: 35, costPrice: 280, stock: 999, status: "active" },
];

export default function FranchiseOwnerBizItems() {
  const [items, setItems] = useState(ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: 'Materials',
    price: '',
    costPrice: '',
    tax: '',
    stock: '',
  });

  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = items.reduce((sum, item) => sum + (item.costPrice * item.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">📦 Items</h1>
          <p className="text-gray-500 text-sm mt-1">Manage products and services</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> New Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: items.length, icon: "📦" },
          { label: "Total SKUs", value: items.filter(i => i.sku).length, icon: "🏷️" },
          { label: "Total Stock Value", value: `$${totalValue.toLocaleString()}`, icon: "💰" },
          { label: "Low Stock", value: items.filter(i => i.stock < 50).length, icon: "⚠️" },
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

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search items by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Item Name</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">SKU</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Value</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-700 font-mono text-xs">{item.sku}</td>
                <td className="px-6 py-4 text-gray-600">{item.category}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${item.price}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.stock < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">${(item.costPrice * item.stock).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedItem(item)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
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
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">{selectedItem.name}</h2>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">SKU</p>
                  <p className="font-bold text-gray-900 font-mono">{selectedItem.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Category</p>
                  <p className="font-bold text-gray-900">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Selling Price</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedItem.price}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Cost Price</p>
                  <p className="font-bold text-gray-900">${selectedItem.costPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Tax</p>
                  <p className="font-bold text-gray-900">${selectedItem.tax}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Stock Level</p>
                  <p className={`font-bold text-lg ${selectedItem.stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedItem.stock} units
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Inventory Value</p>
                <p className="text-2xl font-black text-gray-900">${(selectedItem.costPrice * selectedItem.stock).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedItem(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700">Edit Item</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Item Name *</label>
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">SKU</label>
                <input
                  type="text"
                  placeholder="SKU-001"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                >
                  <option>Labor</option>
                  <option>Materials</option>
                  <option>Services</option>
                  <option>Equipment</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Selling Price ($) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Cost Price ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.costPrice}
                  onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Tax ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.tax}
                  onChange={(e) => setNewItem({ ...newItem, tax: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newItem.name && newItem.price) {
                      setItems([...items, {
                        id: Math.max(...items.map(i => i.id), 0) + 1,
                        status: 'active',
                        price: parseFloat(newItem.price),
                        costPrice: parseFloat(newItem.costPrice) || 0,
                        tax: parseFloat(newItem.tax) || 0,
                        stock: parseInt(newItem.stock) || 0,
                        ...newItem,
                      }]);
                      setShowForm(false);
                      setNewItem({ name: '', sku: '', category: 'Materials', price: '', costPrice: '', tax: '', stock: '' });
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700"
                >
                  Create Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}