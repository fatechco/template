import { TrendingUp, Package, ShoppingCart, DollarSign, Eye, MessageSquare } from 'lucide-react';

export default function StoreOverviewDesktop() {
  const stats = [
    { label: 'Total Orders', value: '234', icon: ShoppingCart, trend: '+12%', color: 'text-blue-600' },
    { label: 'Products Listed', value: '89', icon: Package, trend: '+5', color: 'text-green-600' },
    { label: 'Total Revenue', value: '$45,230', icon: DollarSign, trend: '+23%', color: 'text-purple-600' },
    { label: 'Store Views', value: '12.5K', icon: Eye, trend: '+8.3%', color: 'text-orange-600' },
    { label: 'Avg Rating', value: '4.8/5', icon: MessageSquare, trend: '+0.2', color: 'text-yellow-600' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, trend: '+0.8%', color: 'text-pink-600' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Store Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your store performance at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className="text-xs font-bold text-green-600">{stat.trend}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Sales Trend (Last 30 Days)</h2>
          <div className="h-64 bg-gradient-to-b from-blue-50 to-transparent rounded-lg flex items-end justify-around px-4 py-8">
            {[45, 52, 48, 61, 55, 68, 72, 65, 78, 82, 88, 92, 85, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-6 bg-blue-600 rounded" style={{ height: `${(h / 100) * 200}px` }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Pending', value: 12, color: 'bg-yellow-500', percentage: 5 },
              { label: 'Processing', value: 45, color: 'bg-blue-500', percentage: 19 },
              { label: 'Shipped', value: 89, color: 'bg-purple-500', percentage: 38 },
              { label: 'Delivered', value: 112, color: 'bg-green-500', percentage: 48 },
            ].map((status, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{status.label}</span>
                  <span className="text-xs font-bold text-gray-600">{status.value} ({status.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${status.color}`} style={{ width: `${status.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#KM-001', customer: 'Ahmed Hassan', amount: '$234.50', status: 'Delivered', date: '2026-03-23' },
                { id: '#KM-002', customer: 'Fatima Ali', amount: '$156.00', status: 'Shipped', date: '2026-03-22' },
                { id: '#KM-003', customer: 'Mohamed Samir', amount: '$89.99', status: 'Processing', date: '2026-03-21' },
                { id: '#KM-004', customer: 'Sara Mohamed', amount: '$342.75', status: 'Delivered', date: '2026-03-20' },
                { id: '#KM-005', customer: 'Omar Khalid', amount: '$129.50', status: 'Pending', date: '2026-03-19' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-3 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-3 font-bold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}