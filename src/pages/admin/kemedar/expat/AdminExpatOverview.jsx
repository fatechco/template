import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/expat" },
  { label: "👥 Expat Profiles", to: "/admin/kemedar/expat/profiles" },
  { label: "🏠 Property Management", to: "/admin/kemedar/expat/management" },
  { label: "⚖️ Legal Services", to: "/admin/kemedar/expat/legal" },
  { label: "💱 Exchange Rates", to: "/admin/kemedar/expat/rates" },
  { label: "⚙️ Settings", to: "/admin/kemedar/expat/settings" },
];

const COUNTRY_DIST = [
  { flag: "🇦🇪", country: "UAE", count: 4821, pct: 38 },
  { flag: "🇸🇦", country: "Saudi Arabia", count: 3102, pct: 25 },
  { flag: "🇬🇧", country: "UK", count: 1247, pct: 10 },
  { flag: "🇺🇸", country: "USA", count: 1891, pct: 15 },
  { flag: "🇶🇦", country: "Qatar", count: 987, pct: 8 },
  { flag: "🌍", country: "Other", count: 352, pct: 4 },
];

const FUNNEL = [
  { label: "Expat Profiles", val: 12400, color: "bg-blue-500" },
  { label: "Searched Properties", val: 8920, color: "bg-indigo-500" },
  { label: "FO Visit Requested", val: 1240, color: "bg-purple-500" },
  { label: "Negotiation Started", val: 420, color: "bg-orange-500" },
  { label: "Purchase Completed", val: 87, color: "bg-green-500" },
  { label: "Now Being Managed", val: 54, color: "bg-teal-500" },
];

export default function AdminExpatOverview() {
  const { pathname } = useLocation();
  const [profiles, setProfiles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.ExpatProfile.list("-created_date", 100),
      base44.entities.PropertyManagementContract.list("-created_date", 100),
    ]).then(([p, c]) => { setProfiles(p); setContracts(c); setLoading(false); });
  }, []);

  const activeTab = TABS.find(t => t.to === pathname)?.to || "/admin/kemedar/expat";
  const activeContracts = contracts.filter(c => c.status === "active");
  const totalManagedRevenue = contracts.reduce((s, c) => s + (c.totalRentCollected || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🌍 Kemedar Expat™ Admin</h1>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Active Expat Users", val: loading ? "—" : profiles.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Top Country", val: "🇦🇪 UAE (38%)", color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Properties Managed", val: loading ? "—" : activeContracts.length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Monthly Revenue", val: loading ? "—" : `${new Intl.NumberFormat("en-EG").format(Math.round(totalManagedRevenue / 1000))}K EGP`, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Legal Packages", val: 47, color: "text-purple-600", bg: "bg-purple-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-2xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">🌍 Geographic Distribution</p>
          {COUNTRY_DIST.map(c => (
            <div key={c.country} className="flex items-center gap-3 mb-3">
              <span className="text-xl flex-shrink-0">{c.flag}</span>
              <span className="text-sm font-semibold text-gray-700 w-28 flex-shrink-0">{c.country}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
              </div>
              <span className="text-xs font-bold text-gray-500 w-12 text-right flex-shrink-0">{c.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Investment Pipeline Funnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-4">📊 Investment Pipeline</p>
          {FUNNEL.map((f, i) => {
            const pct = Math.round(f.val / FUNNEL[0].val * 100);
            return (
              <div key={f.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700 font-semibold">{f.label}</span>
                  <span className="text-sm font-black text-gray-900">{f.val.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Profiles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <p className="font-black text-gray-900">Recent Expat Profiles</p>
          <Link to="/admin/kemedar/expat/profiles" className="text-xs text-orange-500 hover:underline">View all →</Link>
        </div>
        {profiles.length === 0 && !loading ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-4xl mb-2">🌍</p>
            <p className="font-bold">No expat profiles yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Currency</th>
                  <th className="text-left px-4 py-3">Goals</th>
                  <th className="text-left px-4 py-3">Completeness</th>
                  <th className="text-left px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.userId?.slice(0, 10)}...</td>
                    <td className="px-4 py-3 text-gray-700">{p.currentCity}, {p.currentCountry}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{p.primaryCurrency}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.investmentGoals?.slice(0, 2).join(", ")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.profileCompleteness || 0}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{p.profileCompleteness || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(p.created_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}