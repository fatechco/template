import { useState } from 'react';
import { Plus, Search, Truck, Package, Clock, MapPin, Eye, Edit, Trash2, Filter, Download } from 'lucide-react';

const SHIPMENTS = [
  { id: 1, orderNum: '#ORD-2025-001', product: 'Cement 50kg (×10)', buyer: 'Ahmed Hassan', city: 'Cairo', status: 'In Transit', date: 'Mar 24, 2026', tracker: 'KT123456789', weight: '500kg', shippingCost: 45.00 },
  { id: 2, orderNum: '#ORD-2025-002', product: 'Steel Rods 10mm (×5)', buyer: 'Fatima Mohamed', city: 'Riyadh', status: 'Pending Pickup', date: 'Mar 23, 2026', tracker: 'KT123456790', weight: '250kg', shippingCost: 35.00 },
  { id: 3, orderNum: '#ORD-2025-003', product: 'Ceramic Tiles (×20)', buyer: 'Omar Ahmed', city: 'Dubai', status: 'Delivered', date: 'Mar 20, 2026', tracker: 'KT123456791', weight: '800kg', shippingCost: 65.00 },
  { id: 4, orderNum: '#ORD-2025-004', product: 'Paint Buckets (×15)', buyer: 'Layla Nour', city: 'Jeddah', status: 'In Transit', date: 'Mar 25, 2026', tracker: 'KT123456792', weight: '300kg', shippingCost: 40.00 },
  { id: 5, orderNum: '#ORD-2025-005', product: 'Electrical Sockets (×50)', buyer: 'Karim Ali', city: 'Cairo', status: 'Cancelled', date: 'Mar 18, 2026', tracker: 'KT123456793', weight: '50kg', shippingCost: 15.00 },
];

const STATUS_CONFIG = {
  'Pending Pickup': { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  'In Transit': { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'Delivered': { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  'Cancelled': { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const STATUS_LABEL = {
  'Pending Pickup': '⏳ Pending Pickup',
  'In Transit': '🚚 In Transit',
  'Delivered': '✅ Delivered',
  'Cancelled': '❌ Cancelled',
};

export default function ShipmentsDesktop() {
  const [shipments] = useState(SHIPMENTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = shipments.filter(s => {
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchSearch = !search || 
      s.orderNum.toLowerCase().includes(search.toLowerCase()) ||
      s.product.toLowerCase().includes(search.toLowerCase()) ||
      s.buyer.toLowerCase().includes(search.toLowerCase()) ||
      s.tracker.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: 'Total Shipments', value: shipments.length, color: 'text-gray-900', icon: '📦' },
    { label: 'In Transit', value: shipments.filter(s => s.status === 'In Transit').length, color: 'text-blue-600', icon: '🚚' },
    { label: 'Pending', value: shipments.filter(s => s.status === 'Pending Pickup').length, color: 'text-yellow-600', icon: '⏳' },
    { label: 'Delivered', value: shipments.filter(s => s.status === 'Delivered').length, color: 'text-green-600', icon: '✅' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Shipments</h1>
          <p className="text-gray-600">Track and manage your product shipments</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 text-sm">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm"
          >
            <Plus size={18} /> Create Shipment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Pending Pickup', 'In Transit', 'Delivered', 'Cancelled'].map(status => {
              const count = status === 'All' ? shipments.length : shipments.filter(s => s.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                    statusFilter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Order #</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Product</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Buyer</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Destination</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Tracking</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Weight</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Cost</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(shipment => {
              const sc = STATUS_CONFIG[shipment.status];
              return (
                <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">{shipment.orderNum}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{shipment.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="font-semibold text-gray-900">{shipment.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">{shipment.buyer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={14} />
                      <span>{shipment.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-700">{shipment.tracker}</span>
                      <button className="block text-xs text-blue-600 hover:underline mt-1">Track</button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-700">{shipment.weight}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">${shipment.shippingCost.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${sc.color}`}>
                        {STATUS_LABEL[shipment.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                        <Eye size={15} />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Cancel">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Truck size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-bold text-gray-600">No shipments found</p>
            <p className="text-sm mt-1">Create your first shipment to get started</p>
          </div>
        )}
      </div>

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Create New Shipment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Order Number</label>
                  <input type="text" placeholder="#ORD-2025-XXX" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Product</label>
                  <input type="text" placeholder="Product name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Buyer Name</label>
                  <input type="text" placeholder="Buyer name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Destination City</label>
                  <input type="text" placeholder="City" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Tracking Number</label>
                  <input type="text" placeholder="KT123456789" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Weight</label>
                  <input type="text" placeholder="e.g. 500kg" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Shipping Cost ($)</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2">Status</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400">
                    <option>Pending Pickup</option>
                    <option>In Transit</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Notes</label>
                <textarea rows={3} placeholder="Additional shipment notes..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-2.5 border border-gray-200 font-bold rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm">Create Shipment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}