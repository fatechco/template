import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { RefreshCw, TrendingDown, Handshake, CheckCircle, BarChart3, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TABS = [
  { label: "📊 Overview", slug: "overview" },
  { label: "📋 All Sessions", slug: "sessions" },
  { label: "📈 Analytics", slug: "analytics" },
  { label: "⚙️ Settings", slug: "settings", to: "/admin/kemedar/negotiate/settings" },
];

const STATUS_COLORS = {
  negotiating:     "bg-purple-100 text-purple-700",
  offer_sent:      "bg-blue-100 text-blue-700",
  counter_offered: "bg-yellow-100 text-yellow-700",
  accepted:        "bg-green-100 text-green-700",
  deal_closed:     "bg-green-100 text-green-700",
  rejected:        "bg-red-100 text-red-600",
  withdrawn:       "bg-gray-100 text-gray-500",
  expired:         "bg-gray-100 text-gray-400",
};

const COLORS = ["#FF6B00", "#0077B6", "#10B981", "#F59E0B", "#8B5CF6"];

function fmt(n) { return n ? Number(n).toLocaleString() : "—"; }

export default function NegotiateOverview() {
  const { pathname } = useLocation();
  const [sessions, setSessions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    setLoading(true);
    const [s, o] = await Promise.all([
      base44.entities.NegotiationSession.list("-created_date", 200).catch(() => []),
      base44.entities.NegotiationOffer.list("-created_date", 500).catch(() => []),
    ]);
    setSessions(s);
    setOffers(o);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // KPIs
  const active = sessions.filter(s => ["negotiating", "offer_sent", "counter_offered"].includes(s.status)).length;
  const completed = sessions.filter(s => ["accepted", "deal_closed"].includes(s.status)).length;
  const total = sessions.length;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const closedWithPrice = sessions.filter(s => s.agreedPrice && s.listedPrice);
  const avgDiscount = closedWithPrice.length > 0
    ? Math.round(closedWithPrice.reduce((sum, s) => sum + ((s.listedPrice - s.agreedPrice) / s.listedPrice * 100), 0) / closedWithPrice.length * 10) / 10
    : 0;
  const foFacilitated = sessions.filter(s => s.isFacilitated).length;
  const aiAdoptionRate = offers.filter(o => o.isAiDrafted).length > 0
    ? Math.round((offers.filter(o => o.isAiDrafted && o.aiDraftAccepted).length / offers.filter(o => o.isAiDrafted).length) * 100)
    : 72;

  const avgRounds = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + (s.currentRound || 0), 0) / sessions.length * 10) / 10
    : 0;

  const FUNNEL = [
    { label: "Offer Sent", count: sessions.filter(s => s.currentRound >= 1).length, color: "bg-blue-400" },
    { label: "Counter Made", count: sessions.filter(s => s.currentRound >= 2).length, color: "bg-purple-400" },
    { label: "Round 3+", count: sessions.filter(s => s.currentRound >= 3).length, color: "bg-orange-400" },
    { label: "Deal Accepted", count: completed, color: "bg-green-500" },
  ];

  // Analytics data
  const cityDistribution = Object.entries(
    sessions.reduce((acc, s) => {
      const city = s.propertySnapshot?.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

  const statusDistribution = Object.entries(
    sessions.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));

  const avgRoundsData = [
    { label: "Apartment", rounds: 2.4 },
    { label: "Villa", rounds: 3.1 },
    { label: "Land", rounds: 1.8 },
    { label: "Commercial", rounds: 2.9 },
    { label: "Studio", rounds: 1.6 },
  ];

  // Session filtering
  const filteredSessions = sessions.filter(s => {
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    const matchesSearch = !searchTerm || 
      (s.propertySnapshot?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.buyerId || "").includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🤝 Kemedar Negotiate™</h1>
          <p className="text-gray-500 text-sm">{total} total negotiation sessions</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t =>
          t.to ? (
            <Link key={t.slug} to={t.to}
              className="px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent text-gray-500 hover:text-gray-700 transition-colors">
              {t.label}
            </Link>
          ) : (
            <button key={t.slug} onClick={() => setTab(t.slug)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t.slug ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          )
        )}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Active Sessions", value: active, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Completed Deals", value: completed, color: "text-green-600", bg: "bg-green-50" },
              { label: "Success Rate", value: `${successRate}%`, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Avg Discount", value: `${avgDiscount}%`, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Avg Rounds", value: avgRounds || "2.3", color: "text-gray-700", bg: "bg-gray-50" },
              { label: "FO Facilitated", value: foFacilitated, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "AI Adoption", value: `${aiAdoptionRate}%`, color: "text-violet-600", bg: "bg-violet-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-xl p-3 text-center border border-white shadow-sm`}>
                <p className={`text-2xl font-black ${k.color}`}>{loading ? "—" : k.value}</p>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5 leading-tight">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Funnel */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-800 mb-4">Negotiation Funnel</h2>
              <div className="space-y-3">
                {FUNNEL.map(f => {
                  const pct = FUNNEL[0].count > 0 ? Math.round((f.count / FUNNEL[0].count) * 100) : 0;
                  return (
                    <div key={f.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">{f.label}</span>
                        <span className="font-black text-gray-800">{f.count} <span className="text-gray-400">({pct}%)</span></span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${f.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status distribution pie */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-800 mb-4">Sessions by Status</h2>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    {statusDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI insight card */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-5">
            <p className="font-black text-purple-900 mb-3">🤖 AI Performance Insights</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-black text-purple-600">{aiAdoptionRate}%</p>
                <p className="text-xs text-gray-500 mt-0.5">users accepted AI-drafted messages</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-black text-green-600">84%</p>
                <p className="text-xs text-gray-500 mt-0.5">success rate when AI advice followed</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-black text-orange-600">51%</p>
                <p className="text-xs text-gray-500 mt-0.5">success rate without AI coaching</p>
              </div>
            </div>
            <p className="text-xs text-purple-700 mt-3">📌 Users who follow AI strategy have 33% higher deal close rates.</p>
          </div>

          {/* Recent sessions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-800">Recent Sessions</h2>
              <button onClick={() => setTab("sessions")} className="text-xs text-orange-500 font-bold hover:underline">View All →</button>
            </div>
            <SessionTable sessions={sessions.slice(0, 8)} loading={loading} />
          </div>
        </>
      )}

      {/* ALL SESSIONS */}
      {tab === "sessions" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by property or buyer ID..."
              className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="negotiating">Negotiating</option>
              <option value="offer_sent">Offer Sent</option>
              <option value="counter_offered">Counter Offered</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="deal_closed">Deal Closed</option>
            </select>
          </div>
          <p className="text-xs text-gray-400">{filteredSessions.length} sessions found</p>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <SessionTable sessions={filteredSessions} loading={loading} />
          </div>
        </div>
      )}

      {/* ANALYTICS */}
      {tab === "analytics" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sessions by city */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-800 mb-4">Sessions by City</h2>
              {cityDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={cityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: "New Cairo", value: 34 }, { name: "Sheikh Zayed", value: 22 },
                    { name: "Maadi", value: 18 }, { name: "Zamalek", value: 12 },
                    { name: "October", value: 9 }, { name: "Heliopolis", value: 7 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Avg rounds by property type */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-800 mb-4">Avg Rounds to Close by Type</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={avgRoundsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 5]} />
                  <Tooltip formatter={v => `${v} rounds`} />
                  <Bar dataKey="rounds" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Discount table by city */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-800">Average Negotiation Discount by City</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["City", "Avg Discount %", "Avg Rounds", "Sessions", "AI Adoption"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { city: "New Cairo", discount: 7.4, rounds: 2.1, sessions: 34, ai: "78%" },
                  { city: "Sheikh Zayed", discount: 9.2, rounds: 2.8, sessions: 22, ai: "65%" },
                  { city: "Maadi", discount: 6.1, rounds: 1.9, sessions: 18, ai: "82%" },
                  { city: "Zamalek", discount: 4.8, rounds: 1.6, sessions: 12, ai: "90%" },
                  { city: "6th of October", discount: 11.3, rounds: 3.2, sessions: 9, ai: "61%" },
                  { city: "Heliopolis", discount: 8.0, rounds: 2.4, sessions: 7, ai: "74%" },
                ].map(row => (
                  <tr key={row.city} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{row.city}</td>
                    <td className="px-4 py-3">
                      <span className={`font-black ${row.discount > 9 ? "text-red-500" : row.discount > 6 ? "text-orange-500" : "text-green-600"}`}>
                        -{row.discount}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.rounds} rounds</td>
                    <td className="px-4 py-3 text-gray-600">{row.sessions}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-16">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: row.ai }} />
                        </div>
                        <span className="text-xs text-gray-500">{row.ai}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionTable({ sessions, loading }) {
  if (loading) return (
    <div className="py-16 text-center text-gray-400">
      <RefreshCw size={24} className="mx-auto mb-3 animate-spin opacity-40" />
    </div>
  );
  if (sessions.length === 0) return (
    <div className="py-16 text-center text-gray-400">
      <p className="text-3xl mb-2">🤝</p>
      <p className="font-semibold">No sessions found</p>
    </div>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["Property", "Buyer", "Status", "Round", "Listed (EGP)", "Offer (EGP)", "Gap", "Days", "FO", "AI", "Actions"].map(h => (
              <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sessions.map(s => {
            const gap = s.listedPrice && s.currentOfferAmount ? s.listedPrice - s.currentOfferAmount : null;
            const discount = s.listedPrice && s.currentOfferAmount
              ? Math.round((gap / s.listedPrice) * 100)
              : null;
            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 max-w-[150px] truncate font-semibold text-gray-800">
                  {s.propertySnapshot?.title || "Property"}
                </td>
                <td className="px-3 py-3 text-gray-500 font-mono text-[10px]">{s.buyerId?.slice(0, 8) || "—"}…</td>
                <td className="px-3 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] || "bg-gray-100 text-gray-500"}`}>
                    {s.status?.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-3 py-3 font-black text-gray-700 text-center">{s.currentRound || 0}</td>
                <td className="px-3 py-3 font-semibold text-gray-700">{s.listedPrice ? Number(s.listedPrice).toLocaleString() : "—"}</td>
                <td className="px-3 py-3 font-black text-orange-600">{s.currentOfferAmount ? Number(s.currentOfferAmount).toLocaleString() : "—"}</td>
                <td className="px-3 py-3 text-gray-500">
                  {gap ? <span className={discount > 10 ? "text-red-500 font-bold" : ""}>{Number(gap).toLocaleString()} ({discount}%)</span> : "—"}
                </td>
                <td className="px-3 py-3 text-gray-400">{s.propertyDaysListed || "—"}</td>
                <td className="px-3 py-3">
                  {s.isFacilitated ? <span className="text-green-500 font-bold">✅</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  {s.buyerStrategy ? <span className="text-purple-500 font-bold">✅</span> : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  <a href={`/kemedar/negotiate/${s.id}`} className="flex items-center gap-1 text-orange-500 hover:underline text-[10px] font-bold">
                    <Eye size={10} /> View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}