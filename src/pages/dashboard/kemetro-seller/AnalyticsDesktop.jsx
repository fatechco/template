import { BarChart3, TrendingUp, Users, Eye, ShoppingCart, DollarSign } from 'lucide-react';

export default function AnalyticsDesktop() {
  const metrics = [
    { label: 'Store Visitors', value: '12.5K', change: '+15%', icon: Users, color: 'text-blue-600' },
    { label: 'Page Views', value: '45.3K', change: '+22%', icon: Eye, color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', icon: ShoppingCart, color: 'text-green-600' },
    { label: 'Avg Order Value', value: '$89.50', change: '+$12.30', icon: DollarSign, color: 'text-orange-600' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your store performance and customer insights</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg bg-opacity-10 ${metric.color.replace('text-', 'bg-')}`}>
                  <Icon size={24} className={metric.color} />
                </div>
                <span className="text-xs font-bold text-green-600">{metric.change}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-black text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Source */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Traffic Source</h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', visitors: 4200, percentage: 35 },
              { source: 'Search Engine', visitors: 3100, percentage: 26 },
              { source: 'Social Media', visitors: 2800, percentage: 23 },
              { source: 'Referral', visitors: 1800, percentage: 16 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{item.source}</span>
                  <span className="text-xs font-bold text-gray-600">{item.visitors.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Top Selling Products</h2>
          <div className="space-y-3">
            {[
              { name: 'Wireless Headphones Pro', sales: 234, revenue: '$21,066' },
              { name: 'USB-C Cable 2m', sales: 892, revenue: '$11,587' },
              { name: 'Screen Protector Pack', sales: 445, revenue: '$4,455' },
              { name: 'Power Bank 20000mAh', sales: 127, revenue: '$4,449' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.sales} sales</p>
                </div>
                <p className="text-sm font-black text-blue-600">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Customer Insights</h2>
          <div className="space-y-4">
            {[
              { label: 'New Customers', value: '234', icon: '👤' },
              { label: 'Repeat Customers', value: '156', icon: '🔄' },
              { label: 'Avg Order Frequency', value: '2.3x', icon: '📊' },
              { label: 'Customer Lifetime Value', value: '$234.50', icon: '💰' },
            ].map((insight, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <span className="text-sm text-gray-700">{insight.label}</span>
                </div>
                <span className="font-black text-gray-900">{insight.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Goals */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Performance Goals</h2>
          <div className="space-y-4">
            {[
              { goal: 'Monthly Revenue Target', current: 45230, target: 50000, percentage: 90 },
              { goal: 'Customer Rating Target', current: 4.8, target: 5.0, percentage: 96 },
              { goal: 'Order Delivery Rate', current: 98, target: 100, percentage: 98 },
              { goal: 'Return Rate Target', current: 2, target: 1, percentage: 50 },
            ].map((goal, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{goal.goal}</span>
                  <span className="text-xs font-bold text-gray-600">{goal.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${goal.percentage >= 90 ? 'bg-green-500' : goal.percentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${goal.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}