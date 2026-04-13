import { useState } from 'react';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const SALES_DATA = [
  { day: 'Mon', sales: 240 },
  { day: 'Tue', sales: 320 },
  { day: 'Wed', sales: 180 },
  { day: 'Thu', sales: 420 },
  { day: 'Fri', sales: 550 },
  { day: 'Sat', sales: 380 },
  { day: 'Sun', sales: 290 },
];

const TOP_PRODUCTS = [
  { name: 'Office Chair', sales: 1200 },
  { name: 'LED Lamp', sales: 890 },
  { name: 'Monitor Stand', sales: 650 },
  { name: 'Keyboard', sales: 520 },
  { name: 'Mouse Pad', sales: 380 },
];

const CATEGORY_DATA = [
  { name: 'Furniture', value: 35, color: '#92400E' },
  { name: 'Lighting', value: 25, color: '#D97706' },
  { name: 'Accessories', value: 20, color: '#0077B6' },
  { name: 'Electronics', value: 20, color: '#2563EB' },
];

export default function KemetroSellerAnalyticsPage() {
  const [period, setPeriod] = useState('30D');

  const kpis = [
    { label: 'Views', value: '2,340', change: '+12%' },
    { label: 'Carts Added', value: '1,245', change: '+8%' },
    { label: 'Orders', value: '89', change: '+21%' },
    { label: 'Conversion', value: '7.2%', change: '+2.1%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar title="Analytics" showBack />

      {/* Period Filter */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['7D', '30D', '3M', '1Y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                period === p
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-2">{kpi.value}</p>
              <p className="text-xs text-green-600 font-bold mt-1">{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <p className="text-sm font-black text-gray-900 mb-4">Sales Last 30 Days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={SALES_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={30} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#14B8A6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <p className="text-sm font-black text-gray-900 mb-4">Top 5 Products</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TOP_PRODUCTS}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} width={30} />
              <Tooltip />
              <Bar dataKey="sales" fill="#14B8A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <p className="text-sm font-black text-gray-900 mb-4">Orders by Category</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <p className="text-xs text-gray-700 flex-1">{cat.name}</p>
                <p className="text-xs font-bold text-gray-900">{cat.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}