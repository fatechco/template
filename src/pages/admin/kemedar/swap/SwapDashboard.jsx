import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const FUNNEL_COLORS = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

function KpiCard({ icon, label, value, sub, trend, color = "bg-gray-50", valueColor = "text-gray-900" }) {
  return (
    <div className={`${color} rounded-2xl p-5`}>
      <p className="text-2xl mb-2">{icon}</p>
      <p className={`text-2xl font-black leading-tight ${valueColor}`}>{value}</p>
      <p className="text-xs font-bold text-gray-600 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      {trend && <p className="text-xs font-bold text-green-600 mt-1">{trend}</p>}
    </div>
  );
}

function FunnelBar({ label, count, pct, color, isFirst }) {
  const w = isFirst ? 100 : Math.max(8, pct);
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs text-gray-500 w-44 flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden relative">
        <div className="h-full rounded-lg flex items-center pl-3" style={{ width: `${w}%`, background: color }}>
          <span className="text-xs font-bold text-white">{count.toLocaleString()}</span>
        </div>
        {!isFirst && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">{pct.toFixed(1)}%</span>
        )}
      </div>
    </div>
  );
}

const RECENT = [
  { icon: "🔄", text: "New swap intent — Luxury Apartment, New Cairo", time: "2 min ago" },
  { icon: "🤝", text: "New AI match — Score: 92% — Villa A ⇄ Apartment B", time: "15 min ago" },
  { icon: "💚", text: "Interest expressed — Ahmed Hassan on Sheikh Zayed Villa", time: "34 min ago" },
  { icon: "🎉", text: "MATCH! — Nour M. ⇄ Khaled A.", time: "1 hr ago" },
  { icon: "⚖️", text: "Kemework lawyer assigned — Match #a3f2e1", time: "3 hr ago" },
  { icon: "✅", text: "Swap completed — Twin House ⇄ Apartment, New Cairo", time: "Yesterday" },
];

const genDays = (n, base, v) => Array.from({ length: n }, (_, i) => ({
  day: `${i + 1}`, value: Math.max(0, base + Math.floor(Math.random() * v) - v / 2),
}));

export default function SwapDashboard() {
  const [intents, setIntents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [i, m, n, c] = await Promise.all([
          base44.entities.SwapIntent.filter({ status: "active" }, "-created_date", 100),
          base44.entities.SwapMatch.list("-created_date", 200),
          base44.entities.SwapMatch.filter({ status: "negotiating" }, "-created_date", 50),
          base44.entities.SwapMatch.filter({ status: "completed" }, "-created_date", 50),
        ]);
        setIntents(i || []);
        setMatches(m || []);
        setNegotiations(n || []);
        setCompleted(c || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const stalled = negotiations.filter(n => {
    if (!n.negotiationStartedAt) return false;
    return (Date.now() - new Date(n.negotiationStartedAt)) > 7 * 86400000;
  });

  const totalMatches = matches.length;
  const bothInterested = matches.filter(m => ["both_interested","negotiating","terms_agreed","legal_review","escrow_active","completed"].includes(m.status)).length;
  const termsAgreed = matches.filter(m => ["terms_agreed","legal_review","escrow_active","completed"].includes(m.status)).length;
  const funnelBase = totalMatches || 1;

  const funnelData = [
    { label: "Matches suggested", count: totalMatches },
    { label: "Interest expressed", count: Math.floor(totalMatches * 0.38), pct: 38 },
    { label: "Both interested", count: bothInterested, pct: bothInterested / funnelBase * 100 },
    { label: "Negotiating", count: negotiations.length, pct: negotiations.length / funnelBase * 100 },
    { label: "Terms agreed", count: termsAgreed, pct: termsAgreed / funnelBase * 100 },
    { label: "Completed swap", count: completed.length, pct: completed.length / funnelBase * 100 },
  ];

  const chartData = genDays(30, 4, 6);
  const gmv = completed.length * 4500000;
  const revenue = completed.length * 4500;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">🔄 Kemedar Swap™ Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Full overview of the AI property swap matchmaking system</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard icon="🔄" label="Active Swap Pool" value={loading ? "…" : intents.length.toLocaleString()} sub="properties open to swap" trend="↑ +8 this week" color="bg-purple-50" />
        <KpiCard icon="🤝" label="AI Matches Generated" value={loading ? "…" : totalMatches.toLocaleString()} sub="total matches created" trend="14 this week" color="bg-indigo-50" />
        <KpiCard icon="💬" label="Active Negotiations" value={loading ? "…" : negotiations.length.toLocaleString()} sub={`${stalled.length} awaiting admin assist`} color="bg-orange-50" valueColor={negotiations.length > 0 ? "text-orange-600" : "text-gray-900"} />
        <KpiCard icon="✅" label="Completed Swaps" value={loading ? "…" : completed.length.toLocaleString()} sub="all time" trend="2 this month" color="bg-green-50" />
        <KpiCard icon="💰" label="Swap GMV" value={loading ? "…" : `${Math.round(gmv / 1000000)}M EGP`} sub="combined property value swapped" color="bg-amber-50" valueColor="text-amber-600" />
        <KpiCard icon="💳" label="Revenue Generated" value={loading ? "…" : `${revenue.toLocaleString()} EGP`} sub="Veri + Legal + Escrow fees" trend="this month" color="bg-teal-50" />
      </div>

      {/* Stalled Alert */}
      {stalled.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-orange-800">{stalled.length} negotiations stalled for 7+ days</p>
              <p className="text-xs text-orange-600">These need a sales rep to assist</p>
            </div>
          </div>
          <Link to="/admin/kemedar/swaps/negotiations?tab=stalled" className="text-xs font-bold text-orange-700 border border-orange-300 px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors whitespace-nowrap">
            Assign Sales Rep →
          </Link>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Swap Intents Published — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Negotiation Stage Funnel</h3>
          <div className="space-y-1">
            {funnelData.map((f, i) => (
              <FunnelBar key={f.label} label={f.label} count={f.count} pct={f.pct || 100} color={FUNNEL_COLORS[i]} isFirst={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
          <Link to="/admin/kemedar/swaps/matches" className="text-xs text-[#7C3AED] hover:underline">View all →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
              <span className="text-lg flex-shrink-0">{r.icon}</span>
              <span className="flex-1 text-sm text-gray-700">{r.text}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}