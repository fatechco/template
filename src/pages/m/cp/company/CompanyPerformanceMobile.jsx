import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Briefcase, Star, ArrowUpRight } from "lucide-react";

const REVENUE_DATA = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 16000 },
  { month: "May", revenue: 22000 },
];

const PROJECT_STATUS = [
  { name: "Completed", value: 45, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#f59e0b" },
  { name: "Pending", value: 12, color: "#ef4444" },
];

const KPIS = [
  { label: "Total Revenue", value: "$83,000", icon: DollarSign, color: "text-green-600", bg: "bg-green-50", trend: "+12%" },
  { label: "Active Projects", value: "28", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50", trend: "+3" },
  { label: "Completed", value: "45", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+8" },
  { label: "Avg. Rating", value: "4.8", icon: Star, color: "text-amber-600", bg: "bg-amber-50", trend: "⭐" },
];

export default function CompanyPerformanceMobile() {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-4 py-6">
        <h1 className="text-xl font-black mb-1">📊 Performance Stats</h1>
        <p className="text-xs text-amber-100">Track your business growth</p>
      </div>

      {/* KPIs - Scrollable horizontal */}
      <div className="px-4 -mt-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {KPIS.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                    <Icon size={16} className={kpi.color} />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium mb-1">{kpi.label}</p>
                <p className="text-xl font-black text-gray-900">{kpi.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900 text-sm">Revenue Trend</h3>
            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
              <ArrowUpRight size={14} /> +15.3%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontSize: '11px', fontWeight: '600' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Status & Stats */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h3 className="font-black text-gray-900 text-xs mb-3">Project Status</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={PROJECT_STATUS} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                {PROJECT_STATUS.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} projects`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PROJECT_STATUS.map((status, i) => (
              <div key={i} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: status.color }} />
                  <span className="text-gray-600 font-medium">{status.name}</span>
                </div>
                <span className="font-black text-gray-900">{status.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 shadow-sm text-white">
          <h3 className="font-black text-xs mb-3 opacity-90">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] opacity-80 mb-0.5">This Month</p>
              <p className="text-lg font-black">$22,000</p>
            </div>
            <div className="border-t border-white/20 pt-2">
              <p className="text-[10px] opacity-80 mb-0.5">Growth Rate</p>
              <p className="text-lg font-black">+15.3%</p>
            </div>
            <div className="border-t border-white/20 pt-2">
              <p className="text-[10px] opacity-80 mb-0.5">Completion Rate</p>
              <p className="text-lg font-black">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-black text-gray-900 text-sm mb-4">Monthly Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontSize: '11px', fontWeight: '600' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 shadow-lg text-white">
          <h3 className="font-black text-sm mb-3">🎯 Performance Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] opacity-80 mb-1">Total Projects</p>
              <p className="text-xl font-black">85</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] opacity-80 mb-1">Success Rate</p>
              <p className="text-xl font-black">94%</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] opacity-80">Overall Performance</span>
              <span className="text-sm font-black text-green-400">Excellent ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}