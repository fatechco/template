import { useState } from 'react';
import { Search, Filter, Eye, Download, Calendar } from 'lucide-react';

export default function OrdersDesktop() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    { id: '#KM-2401', customer: 'Ahmed Hassan', items: 3, amount: '$234.50', status: 'delivered', date: '2026-03-23', address: 'Cairo, Egypt' },
    { id: '#KM-2400', customer: 'Fatima Ali', items: 1, amount: '$89.99', status: 'shipped', date: '2026-03-22', address: 'Alexandria, Egypt' },
    { id: '#KM-2399', customer: 'Mohamed Samir', items: 5, amount: '$456.75', status: 'processing', date: '2026-03-21', address: 'Giza, Egypt' },
    { id: '#KM-2398', customer: 'Sara Mohamed', items: 2, amount: '$156.00', status: 'pending', date: '2026-03-20', address: 'Cairo, Egypt' },
    { id: '#KM-2397', customer: 'Omar Khalid', items: 4, amount: '$342.50', status: 'delivered', date: '2026-03-19', address: 'Helwan, Egypt' },
    { id: '#KM-2396', customer: 'Leila Ahmed', items: 2, amount: '$198.99', status: 'shipped', date: '2026-03-18', address: 'Cairo, Egypt' },
  ];

  const filtered = orders.filter(o => {
    const searchMatch = o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.includes(searchQuery);
    const statusMatch = filterStatus === 'all' || o.status === filterStatus;
    return searchMatch && statusMatch;
  });

  const statusColors = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-700' },
    processing: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    shipped: { bg: 'bg-blue-100', text: 'text-blue-700' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700' },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage all your customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: '234', color: 'bg-blue-100 text-blue-700' },
          { label: 'Pending', value: '12', color: 'bg-yellow-100 text-yellow-700' },
          { label: 'In Transit', value: '34', color: 'bg-purple-100 text-purple-700' },
          { label: 'Delivered', value: '188', color: 'bg-green-100 text-green-700' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-2xl p-4 text-center`}>
            <p className="text-sm font-bold mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Items</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Shipping Address</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-blue-600">{order.id}</td>
                  <td className="px-6 py-3">
                    <p className="font-bold text-gray-900">{order.customer}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{order.items} items</td>
                  <td className="px-6 py-3 font-bold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-3 text-gray-600 text-xs">{order.address}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs flex items-center gap-1">
                    <Calendar size={14} /> {order.date}
                  </td>
                  <td className="px-6 py-3">
                    <button className="p-2 hover:bg-gray-100 rounded text-blue-600">
                      <Eye size={16} />
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