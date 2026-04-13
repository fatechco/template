import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const DATE_FILTERS = ["Today", "Week", "Month", "Year"];

const KPI1 = [
  { icon: "🤖", bg: "bg-purple-100", num: "3,247", color: "text-purple-700", label: "Active Advisor Profiles", trend: "↑ +48 this week", trendColor: "text-green-600", sub: "Guests: 812 | Registered: 2,435" },
  { icon: "✅", bg: "bg-green-100", num: "89", color: "text-green-700", label: "Surveys Completed Today", badge: "74% completion rate", sub: "Started today: 120 | Completed: 89" },
  { icon: "🏘️", bg: "bg-orange-100", num: "42,819", color: "text-orange-600", label: "Property Matches Generated", trend: "247 matches last 24hrs", sub: "Avg match score: 78%" },
  { icon: "🔔", bg: "bg-blue-100", num: "8,412", color: "text-blue-700", label: "Notifications Sent (Month)", sub: "Open rate: 34% | Click: 12%", breakdown: "Instant: 1,240 | Daily: 4,890 | Weekly: 2,282" },
];

const KPI2 = [
  { icon: "📉", bg: "bg-red-100", num: "26%", color: "text-red-600", label: "Survey Drop-off Rate", sub: "Most exits at: Step 5", link: "View Drop-off Report →" },
  { icon: "⏱", bg: "bg-teal-100", num: "4:28", color: "text-teal-700", label: "Avg Survey Duration", sub: "Target: 5 min", progress: 89 },
  { icon: "🎯", bg: "bg-yellow-100", num: "22%", color: "text-yellow-700", label: "Profiles → Contact Owner", sub: "Users who contacted after match", trend: "↑ +3% vs last month" },
  { icon: "🧠", bg: "bg-purple-100", num: "81%", color: "text-purple-700", label: "Avg Match Relevance", sub: "Based on views + saves + contacts" },
];

const FUNNEL = [
  { step: "Step 1 — Purpose", users: 4200, pct: 100, drop: 0 },
  { step: "Step 2 — Type", users: 3818, pct: 91, drop: 382 },
  { step: "Step 3 — Usage", users: 3540, pct: 84, drop: 278 },
  { step: "Step 4 — Household", users: 3190, pct: 76, drop: 350 },
  { step: "Step 5 — Budget", users: 2520, pct: 60, drop: 670, warn: true },
  { step: "Step 6 — Location", users: 2100, pct: 50, drop: 420, warn: true },
  { step: "Step 7 — Lifestyle", users: 1820, pct: 43, drop: 280 },
  { step: "Step 8 — Deal Breakers", users: 1540, pct: 37, drop: 280 },
  { step: "Completed", users: 1247, pct: 30, drop: 293 },
];

const PURPOSE_DATA = [
  { name: "Buy", value: 52, color: "#FF6B00" },
  { name: "Rent", value: 31, color: "#3B82F6" },
  { name: "Invest", value: 17, color: "#10B981" },
];

const TYPE_DATA = [
  { name: "Apartment", count: 1764, pct: 42 },
  { name: "Villa", count: 1176, pct: 28 },
  { name: "Studio", count: 630, pct: 15 },
  { name: "Off-Plan", count: 504, pct: 12 },
  { name: "Other", count: 126, pct: 3 },
];

const URGENCY_DATA = [
  { name: "Immediate (1 mo)", value: 18, fill: "#EF4444" },
  { name: "Soon (3 mo)", value: 35, fill: "#F59E0B" },
  { name: "Planning (6 mo)", value: 30, fill: "#10B981" },
  { name: "Exploring", value: 17, fill: "#3B82F6" },
];

const BUDGET_HEAT = {
  ranges: ["<1M", "1–2M", "2–3M", "3–5M", "5M+", "<5K/mo", "5–10K", "10–20K", "20K+"],
  rows: [
    { label: "Buy", vals: [12, 28, 34, 18, 8, 0, 0, 0, 0] },
    { label: "Rent", vals: [0, 0, 0, 0, 0, 15, 40, 30, 15] },
    { label: "Invest", vals: [5, 10, 25, 38, 22, 0, 0, 0, 0] },
  ]
};

const TOP_AREAS = [
  { rank: 1, area: "New Cairo", profiles: 847, avgBudget: "2.8M", avgScore: 83 },
  { rank: 2, area: "Sheikh Zayed", profiles: 612, avgBudget: "3.5M", avgScore: 79 },
  { rank: 3, area: "6th October", profiles: 498, avgBudget: "1.9M", avgScore: 77 },
  { rank: 4, area: "Maadi", profiles: 421, avgBudget: "2.2M", avgScore: 81 },
  { rank: 5, area: "Heliopolis", profiles: 318, avgBudget: "2.1M", avgScore: 75 },
  { rank: 6, area: "North Coast", profiles: 287, avgBudget: "4.2M", avgScore: 72 },
  { rank: 7, area: "Zamalek", profiles: 245, avgBudget: "3.8M", avgScore: 74 },
  { rank: 8, area: "New Capital", profiles: 198, avgBudget: "2.5M", avgScore: 68 },
  { rank: 9, area: "Ain Sokhna", profiles: 176, avgBudget: "3.1M", avgScore: 70 },
  { rank: 10, area: "5th Settlement", profiles: 154, avgBudget: "2.3M", avgScore: 76 },
];

const RECENT_PROFILES = [
  { user: "Ahmed Hassan", purpose: "buy", type: "Apartment", budget: "2-3M", urgency: "soon", completion: 100, created: "10 min ago" },
  { user: "Sara Mohamed", purpose: "rent", type: "Studio", budget: "8K/mo", urgency: "immediate", completion: 87, created: "24 min ago" },
  { user: "Anonymous Guest", purpose: "invest", type: "Villa", budget: "5M+", urgency: "planning", completion: 62, created: "1 hr ago" },
  { user: "Karim Ali", purpose: "buy", type: "Duplex", budget: "3-5M", urgency: "exploring", completion: 100, created: "2 hrs ago" },
  { user: "Nour Hassan", purpose: "rent", type: "Apartment", budget: "10K/mo", urgency: "soon", completion: 50, created: "3 hrs ago" },
];

const PURPOSE_BADGE = { buy: "bg-orange-100 text-orange-700", rent: "bg-blue-100 text-blue-700", invest: "bg-green-100 text-green-700" };
const URGENCY_BADGE = { immediate: "bg-red-100 text-red-700", soon: "bg-orange-100 text-orange-700", planning: "bg-teal-100 text-teal-700", exploring: "bg-gray-100 text-gray-600" };

function KpiCard({ kpi }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>{kpi.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-3xl font-black ${kpi.color}`}>{kpi.num}</p>
          <p className="text-xs font-bold text-gray-600 mt-0.5">{kpi.label}</p>
        </div>
      </div>
      {kpi.badge && <span className="inline-block bg-teal-100 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">{kpi.badge}</span>}
      {kpi.progress && (
        <div className="mb-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${kpi.progress}%` }} />
          </div>
        </div>
      )}
      {kpi.trend && <p className="text-xs font-semibold text-green-600 mb-1">{kpi.trend}</p>}
      <p className="text-[11px] text-gray-400">{kpi.sub}</p>
      {kpi.breakdown && <p className="text-[10px] text-gray-400 mt-1 font-mono">{kpi.breakdown}</p>}
      {kpi.link && <button className="text-[11px] text-red-500 font-bold mt-1 hover:underline">{kpi.link}</button>}
    </div>
  );
}

export default function AdvisorOverview() {
  const [dateFilter, setDateFilter] = useState("Month");

  const maxHeat = Math.max(...BUDGET_HEAT.rows.flatMap(r => r.vals));
  const heatOpacity = (v) => v === 0 ? 0 : 0.1 + (v / maxHeat) * 0.9;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kemedar Advisor — Overview</h1>
          <p className="text-gray-500 text-sm">AI Property Matching System Performance Dashboard</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {DATE_FILTERS.map(f => (
            <button key={f} onClick={() => setDateFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${dateFilter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI1.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI2.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-black text-gray-900 mb-1">Survey Completion Funnel</h2>
        <p className="text-sm text-gray-500 mb-5">Where users drop off</p>
        <div className="space-y-2">
          {FUNNEL.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-36 text-xs font-semibold text-gray-600 truncate flex-shrink-0">{s.step}</div>
              <div className="w-20 text-right text-xs font-black text-gray-800 flex-shrink-0">{s.users.toLocaleString()}</div>
              <div className="flex-1">
                <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
                  <div className={`h-full rounded-lg transition-all ${s.warn ? "bg-red-400" : "bg-orange-500"}`}
                    style={{ width: `${s.pct}%` }} />
                </div>
              </div>
              <div className="w-10 text-xs font-bold text-gray-600 text-right flex-shrink-0">{s.pct}%</div>
              {s.drop > 0 && (
                <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${s.warn ? "text-red-500 font-bold" : "text-gray-400"}`}>
                  {s.warn && "⚠️"} ↓ -{s.drop}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Purpose + Type charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-900 mb-4">Advisor Users by Purpose</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PURPOSE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {PURPOSE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-black text-gray-900 mb-4">Advisor Users by Property Type</h2>
          <div className="space-y-3">
            {TYPE_DATA.map(t => (
              <div key={t.name} className="flex items-center gap-3">
                <div className="w-20 text-xs font-semibold text-gray-700 flex-shrink-0">{t.name}</div>
                <div className="w-14 text-xs font-bold text-gray-900 text-right flex-shrink-0">{t.count.toLocaleString()}</div>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
                <div className="w-8 text-xs font-bold text-gray-500 flex-shrink-0">{t.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">Buyer/Renter Urgency</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-center">
          <div className="xl:col-span-2 space-y-3">
            {URGENCY_DATA.map(u => (
              <div key={u.name} className="flex items-center gap-3">
                <div className="w-36 text-xs font-semibold text-gray-700 flex-shrink-0">{u.name}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${u.value}%`, backgroundColor: u.fill }} />
                </div>
                <div className="w-8 text-xs font-bold text-gray-600 flex-shrink-0">{u.value}%</div>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-orange-700">💡 <strong>53% of active profiles</strong> need a property within 3 months — these are hot leads for sales</p>
          </div>
        </div>
      </div>

      {/* Budget Heatmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        <h2 className="text-sm font-black text-gray-900 mb-4">Budget Range Distribution</h2>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 font-bold text-gray-600">Purpose</th>
              {BUDGET_HEAT.ranges.map(r => <th key={r} className="px-2 py-2 font-bold text-gray-500 whitespace-nowrap">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {BUDGET_HEAT.rows.map(row => (
              <tr key={row.label}>
                <td className="py-2 pr-4 font-bold text-gray-700">{row.label}</td>
                {row.vals.map((v, i) => (
                  <td key={i} className="px-2 py-2 text-center rounded"
                    style={{ backgroundColor: v > 0 ? `rgba(255, 107, 0, ${heatOpacity(v)})` : "transparent" }}>
                    {v > 0 ? <span className="font-bold">{v}</span> : <span className="text-gray-200">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Areas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">Most Requested Locations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {["Rank", "Area", "Profiles", "Avg Budget", "Avg Score", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_AREAS.map(a => (
                <tr key={a.rank} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-black text-gray-400">#{a.rank}</td>
                  <td className="px-3 py-2 font-bold text-gray-900">{a.area}</td>
                  <td className="px-3 py-2"><span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{a.profiles}</span></td>
                  <td className="px-3 py-2 font-semibold text-gray-700">{a.avgBudget} EGP</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${a.avgScore}%` }} />
                      </div>
                      <span className="font-bold text-gray-600">{a.avgScore}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button className="text-orange-500 hover:text-orange-600 font-bold text-[10px]">View Properties →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Profiles */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-gray-900">Latest Advisor Profiles</h2>
          <Link to="/admin/kemedar/advisor/profiles" className="text-xs text-orange-500 font-bold hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Purpose", "Type", "Budget", "Urgency", "Completion", "Created", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_PROFILES.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {p.user === "Anonymous Guest" ? "?" : p.user.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{p.user}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2"><span className={`font-bold px-2 py-0.5 rounded-full capitalize ${PURPOSE_BADGE[p.purpose]}`}>{p.purpose}</span></td>
                  <td className="px-3 py-2 text-gray-600">{p.type}</td>
                  <td className="px-3 py-2 font-bold text-gray-700">{p.budget}</td>
                  <td className="px-3 py-2"><span className={`font-bold px-2 py-0.5 rounded-full capitalize ${URGENCY_BADGE[p.urgency]}`}>{p.urgency}</span></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.completion}%` }} />
                      </div>
                      <span className="font-bold text-gray-600">{p.completion}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{p.created}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Link to="/admin/kemedar/advisor/profiles" className="w-6 h-6 rounded hover:bg-blue-50 text-blue-500 flex items-center justify-center">👁</Link>
                      <Link to="/admin/kemedar/advisor/matches" className="w-6 h-6 rounded hover:bg-orange-50 text-orange-500 flex items-center justify-center">🏘️</Link>
                    </div>
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