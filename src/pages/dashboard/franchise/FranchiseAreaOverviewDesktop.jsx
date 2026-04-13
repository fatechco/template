import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Home, Briefcase, Package, AlertCircle } from 'lucide-react';

const STATS = [
  { icon: Home, label: "Properties", value: 1247, color: "bg-orange-100", textColor: "text-orange-700" },
  { icon: Briefcase, label: "Projects", value: 34, color: "bg-navy-100", textColor: "text-navy-700" },
  { icon: Users, label: "Total Users", value: 4302, color: "bg-blue-100", textColor: "text-blue-700" },
  { icon: Package, label: "Products", value: 892, color: "bg-teal-100", textColor: "text-teal-700" },
];

const MONTHLY_DATA = [
  { month: 'Jan', properties: 145, users: 320, revenue: 4200 },
  { month: 'Feb', properties: 158, users: 380, revenue: 4800 },
  { month: 'Mar', properties: 187, users: 450, revenue: 5600 },
  { month: 'Apr', properties: 165, users: 420, revenue: 5100 },
  { month: 'May', properties: 205, users: 520, revenue: 6200 },
  { month: 'Jun', properties: 247, users: 640, revenue: 7100 },
];

const REVENUE_BREAKDOWN = [
  { name: "Property Verification", value: 3200, color: "#FF6B00" },
  { name: "Premium Services", value: 2100, color: "#0077B6" },
  { name: "Kemetro Commission", value: 1800, color: "#2D6A4F" },
  { name: "Kemework Tasks", value: 950, color: "#D97706" },
];

const NEW_USERS_TODAY = [
  { type: "Property Owners", count: 12 },
  { type: "Buyers", count: 28 },
  { type: "Agents", count: 15 },
  { type: "Developers", count: 5 },
  { type: "Professionals", count: 9 },
];

export default function FranchiseAreaOverviewDesktop() {
  const totalBalance = 12450;
  const pendingBalance = 1200;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">Area Overview</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">Cairo, Egypt</p>
          <p className="text-2xl font-black text-orange-600">Performance: 87/100</p>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={24} className={stat.textColor} />
              </div>
              <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-green-100 text-sm font-semibold">Total Balance</p>
            <p className="text-4xl font-black mt-2">${totalBalance.toLocaleString()}</p>
            <p className="text-sm text-green-100 mt-1">Pending: ${pendingBalance}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white text-green-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-50">
              Withdraw
            </button>
            <button className="bg-white text-green-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-50">
              History
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="properties" fill="#FF6B00" name="Properties" />
              <Bar dataKey="users" fill="#0077B6" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={REVENUE_BREAKDOWN} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                {REVENUE_BREAKDOWN.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Users & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Users Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">New Users Today</h2>
          <div className="space-y-3">
            {NEW_USERS_TODAY.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <p className="text-sm text-gray-700">{item.type}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <p className="text-xs font-black text-orange-600">{item.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">12 properties pending verification</p>
                <p className="text-xs text-orange-700 mt-1">Action required within 7 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900">3 sellers need approval</p>
                <p className="text-xs text-yellow-700 mt-1">Review their documentation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">5 new support tickets</p>
                <p className="text-xs text-blue-700 mt-1">Average response time: 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}