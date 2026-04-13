import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { base44 } from "@/api/base44Client";
import { RefreshCw, TrendingUp } from "lucide-react";

function Stat({ label, value, trend, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-400 uppercase">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
    </div>
  );
}

export default function FinishingAnalytics() {
  const [stats, setStats] = useState({
    totalSimulations: 0,
    kemeworkConversions: 0,
    kemetroConversions: 0,
    turnkeyRequests: 0,
  });
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const sims = await base44.entities.FinishingSimulation.list("-created_date", 1000);
        setSimulations(sims);

        const kemeworkCount = sims.filter(s => s.convertedToKemeworkTaskId).length;
        const kemetroCount = sims.filter(s => s.convertedToKemetroRfqId).length;
        const turnkeyCount = sims.filter(s => s.requestedKemedarTurnkey).length;

        setStats({
          totalSimulations: sims.length,
          kemeworkConversions: kemeworkCount,
          kemetroConversions: kemetroCount,
          turnkeyRequests: turnkeyCount,
        });
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const kemeworkRate = stats.totalSimulations > 0 ? Math.round((stats.kemeworkConversions / stats.totalSimulations) * 100) : 0;
  const kemetroRate = stats.totalSimulations > 0 ? Math.round((stats.kemetroConversions / stats.totalSimulations) * 100) : 0;
  const turnkeyRate = stats.totalSimulations > 0 ? Math.round((stats.turnkeyRequests / stats.totalSimulations) * 100) : 0;

  const conversionData = [
    { name: "Kemework Tasks", value: stats.kemeworkConversions, color: "#2D6A4F" },
    { name: "Kemetro RFQs", value: stats.kemetroConversions, color: "#0077B6" },
    { name: "Turnkey Requests", value: stats.turnkeyRequests, color: "#F59E0B" },
  ];

  const tierBreakdown = simulations.reduce((acc, s) => {
    const tier = s.desiredTier || "Unknown";
    const existing = acc.find(t => t.tier === tier);
    if (existing) existing.count++;
    else acc.push({ tier, count: 1 });
    return acc;
  }, []);

  const styleBreakdown = simulations.reduce((acc, s) => {
    const style = s.desiredStyle || "Unknown";
    const existing = acc.find(t => t.style === style);
    if (existing) existing.count++;
    else acc.push({ style, count: 1 });
    return acc;
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Buy-It-Finished Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track simulator usage and cross-module conversions.</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Simulations" value={stats.totalSimulations} icon="✨" color="bg-purple-100 text-purple-600" />
        <Stat label="Kemework Tasks" value={`${stats.kemeworkConversions} (${kemeworkRate}%)`} icon="🔧" color="bg-teal-100 text-teal-600" />
        <Stat label="Kemetro RFQs" value={`${stats.kemetroConversions} (${kemetroRate}%)`} icon="🛒" color="bg-blue-100 text-blue-600" />
        <Stat label="Turnkey Requests" value={`${stats.turnkeyRequests} (${turnkeyRate}%)`} icon="👑" color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conversion funnel */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: "Simulations", value: stats.totalSimulations },
              { name: "Kemework", value: stats.kemeworkConversions },
              { name: "Kemetro", value: stats.kemetroConversions },
              { name: "Turnkey", value: stats.turnkeyRequests },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quality tier breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Quality Tier Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={tierBreakdown} cx="50%" cy="50%" labelLine={false} label={({ style, count }) => `${style}: ${count}`} dataKey="count">
                <Cell fill="#7C3AED" />
                <Cell fill="#3B82F6" />
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style preference */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Design Style Preferences</h3>
          <div className="space-y-2">
            {styleBreakdown.sort((a, b) => b.count - a.count).map(s => (
              <div key={s.style} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{s.style}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(s.count / Math.max(...styleBreakdown.map(x => x.count), 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 min-w-[40px]">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion metrics */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-black text-gray-900 mb-4">Cross-Module Conversion Rates</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Kemework Conversion</span>
                <span className="font-black text-teal-600">{kemeworkRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${kemeworkRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Kemetro Conversion</span>
                <span className="font-black text-blue-600">{kemetroRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${kemetroRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Turnkey Conversion</span>
                <span className="font-black text-amber-600">{turnkeyRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${turnkeyRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}