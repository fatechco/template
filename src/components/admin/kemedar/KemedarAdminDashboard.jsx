import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Home, Building2, FileText, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const statsData = [
  { label: "Active Users", value: "12,483", icon: "👥", color: "blue", trend: "+145 this month", sub: "Common: 8,240 | Agents: 2,103 | Developers: 1,452 | Franchise: 688" },
  { label: "Total Properties", value: "8,942", icon: "🏠", color: "orange", sub: "Active: 7,201 | Pending: 1,205 | Imported: 536" },
  { label: "Total Projects", value: "342", icon: "🏗", color: "navy", sub: "Active: 298 | Pending: 44" },
  { label: "Buy Requests", value: "1,847", icon: "📋", color: "teal", trend: "+89 this week" },
  { label: "Pending Approvals", value: "423", icon: "⏳", color: "red", sub: "Users: 145 | Properties: 201 | Projects: 77", action: "Review Now" },
  { label: "Revenue This Month", value: "$47,230", icon: "💰", color: "green", sub: "Subscriptions: $32,100 | Services: $15,130" },
  { label: "Verified Users", value: "4,892", icon: "✅", color: "green", sub: "Agents: 2,103 | Agencies: 1,248 | Developers: 1,541" },
  { label: "Franchise Owners", value: "124", icon: "🗺", color: "gold", sub: "Active: 98 | Pending: 26" },
  { label: "Verify Pro Tokens", value: "—", icon: "🔐", color: "purple", sub: "Loading...", isVerifyPro: true },
];

const chartData = [
  { date: "Mar 1", Common: 120, Agent: 90, Developer: 45, Franchise: 32 },
  { date: "Mar 4", Common: 145, Agent: 110, Developer: 52, Franchise: 38 },
  { date: "Mar 7", Common: 180, Agent: 130, Developer: 68, Franchise: 45 },
  { date: "Mar 10", Common: 210, Agent: 155, Developer: 85, Franchise: 52 },
  { date: "Mar 13", Common: 245, Agent: 175, Developer: 98, Franchise: 62 },
  { date: "Mar 16", Common: 280, Agent: 198, Developer: 115, Franchise: 72 },
  { date: "Mar 19", Common: 320, Agent: 225, Developer: 135, Franchise: 85 },
];

const userDistribution = [
  { name: "Common Users", value: 8240, color: "#3B82F6" },
  { name: "Agents", value: 2103, color: "#FF6B00" },
  { name: "Developers", value: 1452, color: "#1E3A8A" },
  { name: "Franchise", value: 688, color: "#F59E0B" },
];

const propertyChartData = [
  { month: "Jan", "On-site": 245, "Imported": 180, "Franchise": 95 },
  { month: "Feb", "On-site": 320, "Imported": 210, "Franchise": 125 },
  { month: "Mar", "On-site": 380, "Imported": 245, "Franchise": 160 },
  { month: "Apr", "On-site": 420, "Imported": 280, "Franchise": 190 },
];

const recentUsers = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", joined: "2 hours ago", status: "verified" },
  { id: 2, name: "Layla Mohamed", role: "Common User", joined: "5 hours ago", status: "active" },
  { id: 3, name: "Omar Khalil", role: "Developer", joined: "1 day ago", status: "verified" },
  { id: 4, name: "Fatima Ali", role: "Franchise Owner", joined: "2 days ago", status: "pending" },
  { id: 5, name: "Khaled Mustafa", role: "Agent", joined: "3 days ago", status: "verified" },
];

const recentProperties = [
  { id: 1, title: "Modern Villa in Sheikh Zayed", owner: "Ahmed Hassan", city: "Giza", status: "active" },
  { id: 2, title: "Luxury Apartment Downtown", owner: "Layla Mohamed", city: "Cairo", status: "pending" },
  { id: 3, title: "Commercial Space", owner: "Omar Khalil", city: "Alexandria", status: "active" },
  { id: 4, title: "Studio in Nasr City", owner: "Fatima Ali", city: "Cairo", status: "active" },
  { id: 5, title: "Land for Development", owner: "Khaled Mustafa", city: "New Cairo", status: "pending" },
];

export default function KemedarAdminDashboard() {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const [vpTokens, setVpTokens] = useState([]);
  const [vpRecords, setVpRecords] = useState([]);

  useEffect(() => {
    base44.entities.PropertyToken.list("-created_date", 100).then(setVpTokens).catch(() => {});
    base44.entities.VerificationRecord.list("-recordedAt", 5).then(setVpRecords).catch(() => {});
  }, []);

  const vpTotal = vpTokens.length;
  const vpLevel5 = vpTokens.filter(t => t.verificationLevel >= 5).length;
  const vpToday = vpTokens.filter(t => new Date(t.created_date).toDateString() === new Date().toDateString()).length;
  const vpCertsToday = vpTokens.filter(t => t.certificateIssued && new Date(t.certificateIssuedAt).toDateString() === new Date().toDateString()).length;

  const RECORD_ICONS = { certificate_issued: "🏅", fo_inspection_completed: "🔍", fraud_flag_raised: "🚨", document_ai_analyzed: "🤖", document_fo_verified: "✅" };
  function timeAgo(d) {
    if (!d) return "";
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return `${Math.round(s)}s ago`;
    if (s < 3600) return `${Math.round(s/60)}m ago`;
    return `${Math.round(s/3600)}h ago`;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">Kemedar Admin Dashboard</h1>
        <span className="text-sm text-gray-500">{today}</span>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.slice(0, 4).map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'orange' ? 'bg-orange-100' :
                stat.color === 'navy' ? 'bg-slate-900/10' : 'bg-teal-100'
              }`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-3xl font-black ${
              stat.color === 'blue' ? 'text-blue-600' :
              stat.color === 'orange' ? 'text-orange-600' :
              stat.color === 'navy' ? 'text-slate-900' : 'text-teal-600'
            }`}>{stat.value}</p>
            <p className="text-sm font-bold text-gray-700 mt-1">{stat.label}</p>
            {stat.trend && <p className="text-xs text-green-600 mt-2">↑ {stat.trend}</p>}
            <p className="text-xs text-gray-500 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.slice(4, 8).map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                stat.color === 'red' ? 'bg-red-100' :
                stat.color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-3xl font-black ${
              stat.color === 'red' ? 'text-red-600' :
              stat.color === 'green' ? 'text-green-600' : 'text-amber-600'
            }`}>{stat.value}</p>
            <p className="text-sm font-bold text-gray-700 mt-1">{stat.label}</p>
            {stat.action && <a href="#" className="text-xs text-red-600 font-bold mt-2 hover:underline">{stat.action} →</a>}
            <p className="text-xs text-gray-500 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Pending Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { count: 145, text: "users pending approval", color: "red" },
          { count: 201, text: "properties pending review", color: "yellow" },
          { count: 77, text: "projects pending approval", color: "orange" },
          { count: 34, text: "marketing requests pending", color: "blue" },
        ].map((alert, idx) => (
          <div key={idx} className={`bg-white rounded-xl border-l-4 p-4 shadow-sm flex items-start justify-between ${
            alert.color === 'red' ? 'border-l-red-500' :
            alert.color === 'yellow' ? 'border-l-yellow-500' :
            alert.color === 'orange' ? 'border-l-orange-500' : 'border-l-blue-500'
          }`}>
            <div>
              <p className="text-sm font-bold text-gray-900">{alert.count}</p>
              <p className="text-xs text-gray-600">{alert.text}</p>
            </div>
            <a href="#" className={`text-xs font-bold whitespace-nowrap ml-2 ${
              alert.color === 'red' ? 'text-red-600' :
              alert.color === 'yellow' ? 'text-yellow-600' :
              alert.color === 'orange' ? 'text-orange-600' : 'text-blue-600'
            }`}>Review →</a>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">New Users — Last 30 Days</h2>
            <div className="flex gap-2">
              {['7D', '30D', '3M'].map(period => (
                <button key={period} className={`text-xs font-bold px-3 py-1 rounded-full ${period === '30D' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}>{period}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Common" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Agent" stroke="#FF6B00" strokeWidth={2} />
              <Line type="monotone" dataKey="Developer" stroke="#1E3A8A" strokeWidth={2} />
              <Line type="monotone" dataKey="Franchise" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">User Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                {userDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {userDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Properties Added — Last 12 Months</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={propertyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="On-site" stackId="a" fill="#FF6B00" />
            <Bar dataKey="Imported" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Franchise" stackId="a" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Verify Pro Today Card */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-black text-white">🔐 Verify Pro Today</h2>
          </div>
          <Link to="/admin/kemedar/verify-pro" className="text-xs text-orange-400 font-bold hover:underline">View Full Dashboard →</Link>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center">
            <p className="text-2xl font-black text-orange-400">{vpToday}</p>
            <p className="text-[10px] text-gray-400">New tokens</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-blue-400">{vpRecords.length}</p>
            <p className="text-[10px] text-gray-400">Docs reviewed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-yellow-400">{vpCertsToday}</p>
            <p className="text-[10px] text-gray-400">Certs issued</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {vpRecords.slice(0, 5).map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
              <span>{RECORD_ICONS[r.recordType] || "📝"}</span>
              <span className="flex-1 truncate">{r.title || r.recordType?.replace(/_/g, " ")}</span>
              <span className="text-gray-500">{timeAgo(r.recordedAt)}</span>
            </div>
          ))}
        </div>
        <Link to="/admin/kemedar/verify-pro"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-3 rounded-xl text-sm transition-colors">
          🔐 Go to Verify Pro Dashboard →
        </Link>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Latest Registered Users</h2>
            <a href="#" className="text-orange-600 text-sm font-bold">View All →</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map(user => (
              <div key={user.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                  user.status === 'verified' ? 'bg-green-100 text-green-700' :
                  user.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Latest Properties Added</h2>
            <a href="#" className="text-orange-600 text-sm font-bold">View All →</a>
          </div>
          <div className="space-y-3">
            {recentProperties.map(prop => (
              <div key={prop.id} className="pb-3 border-b border-gray-100 last:border-0">
                <p className="text-sm font-bold text-gray-900 truncate">{prop.title}</p>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{prop.owner}</span>
                  <span>{prop.city}</span>
                </div>
                <span className={`inline-block text-xs font-bold px-2 py-1 rounded-full mt-1 ${
                  prop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {prop.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { icon: "👤", label: "Add New User" },
              { icon: "🏠", label: "Add Property" },
              { icon: "📢", label: "Send Notification" },
              { icon: "📥", label: "Import Data" },
              { icon: "🗑", label: "Clear Cache" },
              { icon: "📊", label: "Generate Report" },
            ].map((action, idx) => (
              <a
                key={idx}
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 text-sm"
              >
                <span className="text-base">{action.icon}</span>
                <span className="flex-1">{action.label}</span>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}