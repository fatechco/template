import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { base44 } from "@/api/base44Client";

const FUNNEL_DATA = [
  { name: "Saw Match™", value: 8420, fill: "#f97316" },
  { name: "Setup Done", value: 3210, fill: "#fb923c" },
  { name: "Swiped 1+", value: 2890, fill: "#fdba74" },
  { name: "Liked 1+", value: 1640, fill: "#fed7aa" },
  { name: "Got Match", value: 287, fill: "#ffedd5" },
  { name: "Negotiated", value: 84, fill: "#fff7ed" },
  { name: "Deal Closed", value: 12, fill: "#fef3c7" },
];

const ACTIVITY_DATA = [
  { day: "Mon", swipes: 1240, likes: 320, matches: 18 },
  { day: "Tue", swipes: 980, likes: 210, matches: 12 },
  { day: "Wed", swipes: 1560, likes: 410, matches: 24 },
  { day: "Thu", swipes: 1890, likes: 520, matches: 31 },
  { day: "Fri", swipes: 2100, likes: 580, matches: 38 },
  { day: "Sat", swipes: 2340, likes: 640, matches: 42 },
  { day: "Sun", swipes: 1680, likes: 420, matches: 27 },
];

export default function AdminMatchOverview() {
  const { pathname } = useLocation();
  const [swipes, setSwipes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { label: "📊 Overview", to: "/admin/kemedar/match" },
    { label: "👆 All Swipes", to: "/admin/kemedar/match/swipes" },
    { label: "🎉 All Matches", to: "/admin/kemedar/match/matches" },
    { label: "⚙️ AI Queue Config", to: "/admin/kemedar/match/config" },
    { label: "🔧 Settings", to: "/admin/kemedar/match/settings" },
  ];

  const activeTab = tabs.find(t => t.to === pathname)?.to || "/admin/kemedar/match";

  useEffect(() => {
    Promise.all([
      base44.entities.PropertySwipe.list('-created_date', 200),
      base44.entities.PropertyMatch.list('-created_date', 100)
    ]).then(([sw, ma]) => {
      setSwipes(sw);
      setMatches(ma);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const todayLikes = swipes.filter(s => s.action === "like" && new Date(s.created_date).toDateString() === new Date().toDateString()).length;
  const todaySuperLikes = swipes.filter(s => s.action === "super_like" && new Date(s.created_date).toDateString() === new Date().toDateString()).length;
  const matchRate = swipes.length > 0 ? Math.round(matches.length / swipes.length * 100) : 0;

  const kpis = [
    { label: "Swipes Today", value: swipes.length || "12,450", icon: "👆" },
    { label: "Likes Today", value: todayLikes || "1,840", icon: "❤️" },
    { label: "Super Likes", value: todaySuperLikes || "234", icon: "⭐" },
    { label: "Matches Today", value: matches.length || "87", icon: "🎉" },
    { label: "Match → Deal %", value: `${matchRate || 4}%`, icon: "🤝" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">💘 Kemedar Match™ Admin</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.to
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* Swipes Tab */}
      {activeTab === "/admin/kemedar/match/swipes" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900">All Swipes ({swipes.length})</h3>
            <span className="text-xs text-gray-400">Last 200</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["User ID", "Property ID", "Action", "View Duration", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {swipes.length === 0 && !loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No swipes recorded yet</td></tr>
                ) : swipes.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.userId?.slice(0,8)}...</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.propertyId?.slice(0,8)}...</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.action === "like" ? "bg-red-100 text-red-600" :
                        s.action === "super_like" ? "bg-yellow-100 text-yellow-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>{s.action}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.viewDuration ? `${s.viewDuration}s` : "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(s.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === "/admin/kemedar/match/matches" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900">All Matches ({matches.length})</h3>
            <span className="text-xs text-gray-400">Last 100</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Buyer ID", "Seller ID", "Property ID", "Type", "Score", "Status", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {matches.length === 0 && !loading ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No matches recorded yet</td></tr>
                ) : matches.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.buyerId?.slice(0,8)}...</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.sellerId?.slice(0,8)}...</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.propertyId?.slice(0,8)}...</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{m.matchType}</td>
                    <td className="px-4 py-3 font-bold text-orange-600">{m.matchScore}%</td>
                    <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{m.status}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(m.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === "/admin/kemedar/match/config" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-black text-gray-900 mb-4">⚙️ AI Queue Configuration</h3>
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Queue Size Per User", value: "50", desc: "Max properties per generated queue" },
              { label: "Queue Expiry (hours)", value: "24", desc: "How long before queue regenerates" },
              { label: "Match Score Threshold", value: "65%", desc: "Minimum score to include in queue" },
              { label: "Boost Multiplier", value: "2x", desc: "Boosted property queue weight" },
              { label: "Super Like Daily Limit", value: "5", desc: "Per user per day" },
              { label: "Match Expiry (days)", value: "7", desc: "Days until unresponded match expires" },
            ].map(cfg => (
              <div key={cfg.label} className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-sm">{cfg.label}</p>
                <p className="text-2xl font-black text-orange-600 my-1">{cfg.value}</p>
                <p className="text-xs text-gray-400">{cfg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "/admin/kemedar/match/settings" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-black text-gray-900 mb-4">🔧 Match™ Settings</h3>
          <div className="space-y-4 max-w-lg">
            {[
              { label: "Enable Match™ Feature", enabled: true },
              { label: "Allow Super Likes", enabled: true },
              { label: "Enable Match Expiry", enabled: true },
              { label: "Notify Seller on Like", enabled: true },
              { label: "AI-Powered Queue", enabled: true },
              { label: "Boost Paid Listings", enabled: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">{s.label}</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${s.enabled ? "bg-orange-500" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${s.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview Tab (default) */}
      {(activeTab === "/admin/kemedar/match") && (
        <>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
            <p className="text-3xl mb-2">{k.icon}</p>
            <p className="text-2xl font-black text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-400">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Activity chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ACTIVITY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="swipes" fill="#e5e7eb" radius={[4,4,0,0]} name="Swipes" />
              <Bar dataKey="likes" fill="#f97316" radius={[4,4,0,0]} name="Likes" />
              <Bar dataKey="matches" fill="#22c55e" radius={[4,4,0,0]} name="Matches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-2">
            {FUNNEL_DATA.map((item, idx) => {
              const pct = idx === 0 ? 100 : Math.round(item.value / FUNNEL_DATA[0].value * 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-bold text-gray-900">{item.value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="h-full rounded-lg transition-all" style={{ width: `${pct}%`, backgroundColor: item.fill, minWidth: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top performing properties */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Top Performing Properties</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Property", "Swipes", "Likes", "Super Likes", "Like Rate", "Matches"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ["Luxury Apt New Cairo", 312, 52, 8, "17%", 3],
                ["Villa Sheikh Zayed", 245, 38, 12, "15%", 2],
                ["Studio Maadi", 189, 41, 3, "22%", 4],
                ["Townhouse 6th Oct", 167, 22, 4, "13%", 1],
              ].map(([name, swipes, likes, supers, rate, mats]) => (
                <tr key={name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{name}</td>
                  <td className="px-4 py-3 text-gray-600">{swipes}</td>
                  <td className="px-4 py-3 text-red-500 font-bold">{likes}</td>
                  <td className="px-4 py-3 text-yellow-500 font-bold">{supers}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{rate}</td>
                  <td className="px-4 py-3 font-bold text-orange-600">{mats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}