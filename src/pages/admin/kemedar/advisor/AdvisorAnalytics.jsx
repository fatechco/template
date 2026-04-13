import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter, Cell } from "recharts";

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Custom Range"];

const KPI_ROW = [
  { label: "Started", val: "4,200" }, { label: "Completed", val: "1,247" },
  { label: "Rate", val: "29.7%" }, { label: "Avg Steps", val: "6.2" },
  { label: "Avg Time", val: "4:28 min" }, { label: "Guests", val: "38%" }, { label: "Registered", val: "62%" }
];

const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  started: 120 + Math.floor(Math.random() * 60),
  completed: 30 + Math.floor(Math.random() * 20),
  rate: 25 + Math.floor(Math.random() * 15),
}));

const STEP_ANALYSIS = [
  { step: 1, name: "Intent", reached: 4200, dropped: 382, dropRate: 9.1, avgTime: "0:45" },
  { step: 2, name: "Type", reached: 3818, dropped: 278, dropRate: 7.3, avgTime: "1:12" },
  { step: 3, name: "Usage", reached: 3540, dropped: 350, dropRate: 9.9, avgTime: "0:38" },
  { step: 4, name: "Household", reached: 3190, dropped: 670, dropRate: 21.0, avgTime: "2:10" },
  { step: 5, name: "Budget", reached: 2520, dropped: 420, dropRate: 16.7, avgTime: "1:55" },
  { step: 6, name: "Location", reached: 2100, dropped: 280, dropRate: 13.3, avgTime: "2:20" },
  { step: 7, name: "Lifestyle", reached: 1820, dropped: 280, dropRate: 15.4, avgTime: "1:45" },
  { step: 8, name: "Deal Breakers", reached: 1540, dropped: 293, dropRate: 19.0, avgTime: "1:22" },
];

const COMMON_PROFILES = [
  { label: "Family Buyer — Apartment", combo: "Buy + Family + Apartment", count: 847, pct: 20, budget: "2.8M EGP", areas: "New Cairo, 6th Oct" },
  { label: "Young Professional Renter", combo: "Rent + Solo + Studio", count: 612, pct: 15, budget: "8K/mo", areas: "Maadi, Zamalek" },
  { label: "Investor", combo: "Invest + Compound + Apartment", count: 498, pct: 12, budget: "3.5M EGP", areas: "New Cairo, 6th Oct" },
  { label: "Family Upgrader", combo: "Buy + Family + Villa", count: 421, pct: 10, budget: "5.2M EGP", areas: "Sheikh Zayed, 6th Oct" },
  { label: "Newlyweds", combo: "Buy + Couple + Apartment", count: 318, pct: 7.5, budget: "1.9M EGP", areas: "New Cairo, 5th Sett." },
];

const BUDGET_DIST = [
  { range: "<1M", count: 145 }, { range: "1–2M", count: 412 }, { range: "2–3M", count: 524 },
  { range: "3–5M", count: 378 }, { range: "5–8M", count: 189 }, { range: "8M+", count: 89 }
];

const MATCH_DIST = [
  { range: "90–100%", count: 8124, pct: 19 },
  { range: "80–89%", count: 12450, pct: 29 },
  { range: "70–79%", count: 10892, pct: 25 },
  { range: "60–69%", count: 7680, pct: 18 },
  { range: "<60%", count: 3673, pct: 9 },
];

const PRECISION_TABLE = [
  { type: "Apartment", avgScore: 82, satisfaction: "78%", actionRate: "24%" },
  { type: "Villa", avgScore: 79, satisfaction: "74%", actionRate: "19%" },
  { type: "Studio", avgScore: 84, satisfaction: "81%", actionRate: "27%" },
  { type: "Off-Plan", avgScore: 76, satisfaction: "68%", actionRate: "15%" },
  { type: "Commercial", avgScore: 71, satisfaction: "62%", actionRate: "12%" },
];

const DEMAND_AREAS = [
  { rank: 1, area: "New Cairo", profiles: 847, budget: "2.8M", listings: 340, gap: "high" },
  { rank: 2, area: "Sheikh Zayed", profiles: 612, budget: "3.5M", listings: 289, gap: "medium" },
  { rank: 3, area: "6th October", profiles: 498, budget: "1.9M", listings: 512, gap: "good" },
  { rank: 4, area: "Maadi", profiles: 421, budget: "2.2M", listings: 198, gap: "high" },
  { rank: 5, area: "North Coast", profiles: 287, budget: "4.2M", listings: 120, gap: "high" },
];

const GAP_CONFIG = {
  high: { label: "🔴 High demand, low supply", cls: "text-red-600 bg-red-50" },
  medium: { label: "🟡 Balanced", cls: "text-amber-600 bg-amber-50" },
  good: { label: "🟢 Good supply", cls: "text-green-600 bg-green-50" },
};

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-black text-gray-900 border-l-4 border-orange-500 pl-3 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function AdvisorAnalytics() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedQ, setSelectedQ] = useState("Q1.1 — Purpose");
  const [buyRentTab, setBuyRentTab] = useState("Buy");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Survey Analytics</h1>
          <p className="text-gray-500 text-sm">Deep insights into how users interact with Kemedar Advisor</p>
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {DATE_RANGES.map(r => (
            <button key={r} onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${dateRange === r ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Analytics */}
      <Section title="Survey Completion">
        <div className="flex flex-wrap gap-3 mb-4">
          {KPI_ROW.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center">
              <p className="text-xl font-black text-gray-900">{k.val}</p>
              <p className="text-[11px] text-gray-400">{k.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-bold text-gray-600 mb-3">Daily: Started vs Completed</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={3} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} unit="%" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="started" fill="#3B82F6" name="Started" radius={[2, 2, 0, 0]} />
              <Bar yAxisId="left" dataKey="completed" fill="#FF6B00" name="Completed" radius={[2, 2, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#10B981" dot={false} name="Completion %" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Step Analysis */}
      <Section title="Performance Per Survey Step">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Step", "Name", "Users Reached", "Dropped", "Drop Rate", "Avg Time", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STEP_ANALYSIS.map(s => (
                <tr key={s.step} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-black text-gray-400">Step {s.step}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{s.name}</td>
                  <td className="px-4 py-3">{s.reached.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">-{s.dropped}</td>
                  <td className="px-4 py-3">
                    <span className={`font-black px-2 py-0.5 rounded-full ${s.dropRate > 15 ? "bg-red-100 text-red-600" : s.dropRate > 8 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                      {s.dropRate > 15 && "⚠️ "}{s.dropRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.avgTime}</td>
                  <td className="px-4 py-3">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(s.reached / 4200) * 100}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.dropRate > 15 && <button className="text-[10px] text-red-500 font-bold hover:underline">🔍 Investigate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Common profile types */}
      <Section title="Most Common Profile Types">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COMMON_PROFILES.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-gray-900 text-sm">{p.label}</p>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full">{p.pct}%</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-3">{p.combo}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Profiles:</span><span className="font-bold">{p.count.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Avg Budget:</span><span className="font-bold">{p.budget}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Top Areas:</span><span className="font-bold text-right">{p.areas}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Budget Intelligence */}
      <Section title="Budget Distribution">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              {["Buy", "Rent", "Invest"].map(t => (
                <button key={t} onClick={() => setBuyRentTab(t)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${buyRentTab === t ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-500"}`}>
                  {t}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BUDGET_DIST}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Profiles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-black text-gray-700 mb-2">Income vs Budget Correlation</p>
            <p className="text-[11px] text-gray-400 mb-3">Each dot = an advisor profile, colored by purpose</p>
            <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-4xl mb-2">📊</p>
                <p className="text-xs font-semibold">Scatter plot rendered from live profile data</p>
              </div>
            </div>
            <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-700">
              💡 <strong>68% of profiles</strong> with 50K+ EGP income select budgets within the comfortable 30% housing cost guideline
            </div>
          </div>
        </div>
      </Section>

      {/* Location Demand */}
      <Section title="Property Demand Heatmap">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 text-center h-64 flex items-center justify-center">
              <div>
                <p className="text-4xl mb-2">🗺️</p>
                <p className="text-sm font-bold text-gray-500">Map heatmap from live profile location data</p>
                <p className="text-xs text-gray-400 mt-1">Powered by preferred locations in survey Q6.1</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-black text-gray-700 mb-3">Top Demanded Areas</p>
            <div className="space-y-2">
              {DEMAND_AREAS.map(a => (
                <div key={a.rank} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-gray-900">#{a.rank} {a.area}</p>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{a.profiles}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-1">{a.budget} avg · {a.listings} listings</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${GAP_CONFIG[a.gap].cls}`}>
                    {GAP_CONFIG[a.gap].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* AI Performance */}
      <Section title="AI Matching Quality">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          {[["Avg Match Score", "78%", "text-orange-600"], ["90%+ Matches", "19%", "text-green-600"], ["Matches Acted On", "22%", "text-blue-600"], ["AI Report Rating", "⭐ 4.2/5", "text-yellow-600"]].map(([l, v, c]) => (
            <div key={l} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className={`text-2xl font-black ${c}`}>{v}</p>
              <p className="text-xs font-bold text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-black text-gray-700 mb-4">Match Score Distribution</p>
            <div className="space-y-2">
              {MATCH_DIST.map(m => (
                <div key={m.range} className="flex items-center gap-3">
                  <div className="w-16 text-xs font-semibold text-gray-600 flex-shrink-0">{m.range}</div>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${m.pct * 4}%` }} />
                  </div>
                  <div className="w-24 text-xs text-gray-500 flex-shrink-0 text-right">{m.count.toLocaleString()} ({m.pct}%)</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs font-black text-gray-700 mb-4">Precision by Property Type</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr>{["Type", "Avg Score", "Satisfaction", "Action Rate"].map(h => <th key={h} className="text-left py-1 pr-3 font-bold text-gray-500">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {PRECISION_TABLE.map(r => (
                    <tr key={r.type}>
                      <td className="py-2 pr-3 font-semibold">{r.type}</td>
                      <td className="py-2 pr-3 font-black text-orange-600">{r.avgScore}%</td>
                      <td className="py-2 pr-3 text-green-600">{r.satisfaction}</td>
                      <td className="py-2 font-bold text-blue-600">{r.actionRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 border border-gray-100 rounded-xl p-3 bg-gray-50">
              <p className="text-xs font-black text-gray-700 mb-1">🧠 Claude API Usage This Month</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[["API Calls", "1,247"], ["Avg Response", "3.2s"], ["Failed", "4 (0.3%)"], ["Est. Cost", "$18.40"]].map(([k, v]) => (
                  <div key={k}><span className="text-gray-400">{k}: </span><span className="font-bold">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Export */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">📊 Export Analytics Data</h2>
        <div className="flex flex-wrap gap-3">
          {["⬇️ Survey Responses CSV", "⬇️ Match Data Excel", "⬇️ Notification Report PDF", "⬇️ Full Analytics Report PDF"].map(btn => (
            <button key={btn} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-50 transition-all">
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}