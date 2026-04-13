import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

export default function CompanyPerformance() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">📊 Performance Stats</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$83,000", icon: "💰", color: "bg-green-50" },
          { label: "Active Projects", value: "28", icon: "🏗", color: "bg-blue-50" },
          { label: "Completed", value: "45", icon: "✅", color: "bg-emerald-50" },
          { label: "Avg. Rating", value: "4.8 ⭐", icon: "⭐", color: "bg-amber-50" },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.color} rounded-xl border border-gray-200 p-4`}>
            <p className="text-xs text-gray-600 font-medium">{kpi.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-2">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-black text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-black text-gray-900 mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={PROJECT_STATUS} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {PROJECT_STATUS.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-black text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}