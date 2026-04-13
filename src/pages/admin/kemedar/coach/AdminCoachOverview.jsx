import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { JOURNEY_META } from "@/lib/coachJourneyData";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/coach" },
  { label: "👥 All Profiles", to: "/admin/kemedar/coach/profiles" },
  { label: "📚 Content", to: "/admin/kemedar/coach/content" },
  { label: "🔔 Nudges", to: "/admin/kemedar/coach/nudges" },
  { label: "⚙️ Settings", to: "/admin/kemedar/coach/settings" },
];

const COLORS = ['#f97316', '#14b8a6', '#8b5cf6', '#0ea5e9', '#f59e0b', '#6366f1', '#10b981', '#06b6d4'];

export default function AdminCoachOverview() {
  const { pathname } = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.CoachProfile.list('-created_date', 200),
      base44.entities.CoachAchievement.list('-created_date', 100),
      base44.entities.CoachMessage.list('-created_date', 100),
    ]).then(([p, a, m]) => { setProfiles(p); setAchievements(a); setMessages(m); })
      .finally(() => setLoading(false));
  }, []);

  const active = profiles.filter(p => p.coachStatus === 'active').length;
  const completed = profiles.filter(p => p.coachStatus === 'completed').length;
  const avgProgress = profiles.length ? Math.round(profiles.reduce((s, p) => s + (p.overallProgress || 0), 0) / profiles.length) : 0;
  const today = new Date().toDateString();
  const startedToday = profiles.filter(p => new Date(p.created_date).toDateString() === today).length;

  const journeyDist = Object.entries(
    profiles.reduce((acc, p) => { acc[p.journeyType] = (acc[p.journeyType] || 0) + 1; return acc; }, {})
  ).map(([type, count]) => ({ name: JOURNEY_META[type]?.name?.split(' ')[0] || type, value: count }));

  const dropOff = [
    { stage: 'Started', count: profiles.length },
    { stage: 'Stage 1', count: profiles.filter(p => (p.completedStageIds?.length || 0) >= 1).length },
    { stage: 'Stage 2', count: profiles.filter(p => (p.completedStageIds?.length || 0) >= 2).length },
    { stage: 'Stage 3', count: profiles.filter(p => (p.completedStageIds?.length || 0) >= 3).length },
    { stage: 'Complete', count: completed },
  ];

  const seedJourneys = async () => {
    await base44.functions.invoke('seedCoachJourneys', {});
    alert('Journeys seeded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">🎓 Kemedar Coach™ Admin</h1>
        <button onClick={seedJourneys} className="bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-teal-600">
          🌱 Seed Journey Templates
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${pathname === t.to ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Active Profiles', val: loading ? '—' : active, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Started Today', val: loading ? '—' : startedToday, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Journeys Complete', val: loading ? '—' : completed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Progress', val: loading ? '—' : `${avgProgress}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Messages', val: loading ? '—' : messages.length, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Journey distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">Journey Distribution</p>
          {journeyDist.length > 0 ? (
            <div className="flex gap-4 items-center">
              <PieChart width={160} height={160}>
                <Pie data={journeyDist} cx={75} cy={75} innerRadius={40} outerRadius={70} dataKey="value">
                  {journeyDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                </Pie>
              </PieChart>
              <div className="space-y-1.5">
                {journeyDist.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }}/>
                    <span className="text-xs text-gray-600">{d.name}</span>
                    <span className="text-xs font-bold text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-8">No data yet</p>}
        </div>

        {/* Drop-off funnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">Completion Funnel</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dropOff} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }}/>
              <YAxis type="category" dataKey="stage" width={60} tick={{ fontSize: 10 }}/>
              <Tooltip/>
              <Bar dataKey="count" fill="#14b8a6" radius={4}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent profiles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-black text-gray-900">Recent Coach Profiles</p>
          <Link to="/admin/kemedar/coach/profiles" className="text-xs text-teal-600 font-bold hover:underline">View all →</Link>
        </div>
        {profiles.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-4xl mb-2">🎓</p>
            <p className="font-bold">No coach profiles yet</p>
            <p className="text-sm mt-1">Users who start the Coach journey will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">User ID</th>
                  <th className="text-left px-4 py-3">Journey</th>
                  <th className="text-left px-4 py-3">Experience</th>
                  <th className="text-right px-4 py-3">Progress</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Started</th>
                </tr>
              </thead>
              <tbody>
                {profiles.slice(0, 10).map(p => {
                  const meta = JOURNEY_META[p.journeyType] || {};
                  return (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.userId?.slice(0, 10)}...</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{meta.icon}</span>
                          <span className="text-xs font-semibold text-gray-700">{meta.name?.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize">{p.experienceLevel?.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${p.overallProgress}%` }}/>
                          </div>
                          <span className="text-xs font-bold text-teal-600">{p.overallProgress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.coachStatus === 'active' ? 'bg-green-100 text-green-700' :
                          p.coachStatus === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>{p.coachStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(p.created_date).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}