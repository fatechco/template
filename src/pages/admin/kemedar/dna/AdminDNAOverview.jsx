import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DNA_TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/dna" },
  { label: "🔍 User Explorer", to: "/admin/kemedar/dna/users" },
  { label: "📋 Rules", to: "/admin/kemedar/dna/rules" },
  { label: "📡 Signals", to: "/admin/kemedar/dna/signals" },
  { label: "⚙️ Settings", to: "/admin/kemedar/dna/settings" },
];

const COLORS = ['#FF6B00', '#0077B6', '#10B981', '#F59E0B', '#8B5CF6'];
const STAGE_COLORS = { awareness: '#6B7280', consideration: '#3B82F6', decision: '#F59E0B', purchase: '#10B981' };

export default function AdminDNAOverview() {
  const { pathname } = useLocation();
  const [dnaProfiles, setDnaProfiles] = useState([]);
  const [signals, setSignals] = useState([]);
  const [rules, setRules] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [explorerLoading, setExplorerLoading] = useState(false);

  const activeTab = pathname;

  useEffect(() => {
    Promise.all([
      base44.entities.UserDNA.list('-updated_date', 200),
      base44.entities.DNASignal.list('-timestamp', 500),
      base44.entities.PersonalizationRule.list('priority', 100),
      base44.entities.DNAInsight.list('-created_date', 100),
    ]).then(([dna, sigs, r, ins]) => {
      setDnaProfiles(dna);
      setSignals(sigs);
      setRules(r);
      setInsights(ins);
      setLoading(false);
    });
  }, []);

  // KPIs
  const totalProfiles = dnaProfiles.length;
  const avgCompleteness = dnaProfiles.length > 0
    ? Math.round(dnaProfiles.reduce((s, d) => s + (d.dnaCompleteness || 0), 0) / dnaProfiles.length)
    : 0;
  const todaySignals = signals.filter(s => new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
  const activeRules = rules.filter(r => r.isActive).length;

  // Buyer stage distribution
  const stageDistribution = ['awareness', 'consideration', 'decision', 'purchase'].map(stage => ({
    name: stage,
    value: dnaProfiles.filter(d => d.intentDNA?.buyerStage === stage).length
  }));

  // Completeness histogram
  const completenessData = [
    { range: '0-20%', count: dnaProfiles.filter(d => (d.dnaCompleteness || 0) < 20).length },
    { range: '20-40%', count: dnaProfiles.filter(d => (d.dnaCompleteness || 0) >= 20 && (d.dnaCompleteness || 0) < 40).length },
    { range: '40-60%', count: dnaProfiles.filter(d => (d.dnaCompleteness || 0) >= 40 && (d.dnaCompleteness || 0) < 60).length },
    { range: '60-80%', count: dnaProfiles.filter(d => (d.dnaCompleteness || 0) >= 60 && (d.dnaCompleteness || 0) < 80).length },
    { range: '80-100%', count: dnaProfiles.filter(d => (d.dnaCompleteness || 0) >= 80).length },
  ];

  // Churn risk
  const highChurnUsers = dnaProfiles.filter(d => d.predictions?.churnRisk === 'high');
  const decisionStageUsers = dnaProfiles.filter(d => d.intentDNA?.buyerStage === 'decision');

  // Signal type breakdown (today)
  const todaySignalsByType = signals
    .filter(s => new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000))
    .reduce((acc, s) => { acc[s.signalType] = (acc[s.signalType] || 0) + 1; return acc; }, {});
  const topSignalTypes = Object.entries(todaySignalsByType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([type, count]) => ({ type, count }));

  const handleExploreUser = async () => {
    if (!searchUser.trim()) return;
    setExplorerLoading(true);
    const matching = dnaProfiles.filter(d => d.userId?.includes(searchUser));
    setSelectedUser(matching[0] || null);
    setExplorerLoading(false);
  };

  const [newRule, setNewRule] = useState({ ruleName: '', targetDimension: '', actionType: 'show_banner', actionTarget: '', priority: 50 });
  const [savingRule, setSavingRule] = useState(false);

  const handleSaveRule = async () => {
    if (!newRule.ruleName) return;
    setSavingRule(true);
    await base44.entities.PersonalizationRule.create({ ...newRule, isActive: true, impressions: 0, conversions: 0, conversionRate: 0 });
    const updated = await base44.entities.PersonalizationRule.list('priority', 100);
    setRules(updated);
    setNewRule({ ruleName: '', targetDimension: '', actionType: 'show_banner', actionTarget: '', priority: 50 });
    setSavingRule(false);
  };

  const [dnaSettings, setDnaSettings] = useState({
    collectSignals: true, signalRetentionDays: 90, recalcFrequency: 'daily',
    realtimeUpdates: true, homepagePersonalization: true, searchRanking: true,
    notificationPersonalization: true, emailPersonalization: true,
    minDNACompleteness: 30, generateInsights: true, insightFrequency: 'weekly',
    showInsightsToUsers: true, maxInsightsShown: 5,
    allowUsersToEdit: true, allowUsersToDelete: true, gdprMode: true
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🧬 Kemedar DNA™ Admin</h1>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {DNA_TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "/admin/kemedar/dna" && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "DNA Profiles", val: totalProfiles, icon: "🧬", color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Avg Completeness", val: `${avgCompleteness}%`, icon: "📊", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Signals Today", val: todaySignals, icon: "📡", color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Active Rules", val: activeRules, icon: "📋", color: "text-green-600", bg: "bg-green-50" },
              { label: "Decision Stage", val: decisionStageUsers.length, icon: "🎯", color: "text-amber-600", bg: "bg-amber-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <p className="text-3xl mb-1">{k.icon}</p>
                <p className={`text-2xl font-black ${k.color}`}>{loading ? "—" : k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completeness distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-4">DNA Completeness Distribution</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={completenessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Buyer stage distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-1">Buyer Stage Distribution</p>
              <p className="text-xs text-green-600 font-bold mb-4">{decisionStageUsers.length} in decision stage — highest conversion opportunity</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={stageDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {stageDistribution.map((entry) => (
                      <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || '#ccc'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Churn Risk */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-black text-gray-900">⚠️ High Churn Risk Users ({highChurnUsers.length})</p>
            </div>
            {highChurnUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-400"><p className="text-3xl mb-2">✅</p><p>No high-risk users detected</p></div>
            ) : (
              <div>
                {highChurnUsers.slice(0, 10).map(u => (
                  <div key={u.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{u.userId?.slice(0, 16)}...</p>
                      <p className="text-xs text-gray-400">Stage: {u.intentDNA?.buyerStage || 'unknown'} · Completeness: {u.dnaCompleteness || 0}%</p>
                    </div>
                    <button className="text-xs bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg hover:bg-orange-200">Send Recovery Nudge</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Signal Types */}
          {topSignalTypes.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-4">📡 Top Signal Types (Today)</p>
              <div className="space-y-2">
                {topSignalTypes.map(({ type, count }) => (
                  <div key={type} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500 w-52 truncate">{type}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(count / topSignalTypes[0].count) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* USER EXPLORER */}
      {activeTab === "/admin/kemedar/dna/users" && (
        <div className="space-y-5">
          <div className="flex gap-3">
            <input value={searchUser} onChange={e => setSearchUser(e.target.value)}
              placeholder="Search by user ID..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            <button onClick={handleExploreUser} disabled={explorerLoading}
              className="bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
              {explorerLoading ? "..." : "Search"}
            </button>
          </div>

          {selectedUser && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-black text-gray-900 text-lg">User DNA Profile</p>
                  <p className="text-xs font-mono text-gray-500">{selectedUser.userId}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-orange-600">{selectedUser.dnaCompleteness || 0}%</p>
                  <p className="text-xs text-gray-400">completeness</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Buyer Stage", val: selectedUser.intentDNA?.buyerStage || '—' },
                  { label: "Churn Risk", val: selectedUser.predictions?.churnRisk || '—' },
                  { label: "Signals", val: selectedUser.totalSignalsProcessed || 0 },
                  { label: "Last Updated", val: selectedUser.lastRecalculated ? new Date(selectedUser.lastRecalculated).toLocaleDateString() : '—' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="font-black text-gray-900 capitalize">{item.val}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 overflow-auto max-h-48">
                  {JSON.stringify(selectedUser.propertyDNA, null, 2)}
                </pre>
                <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 overflow-auto max-h-48">
                  {JSON.stringify(selectedUser.financialDNA, null, 2)}
                </pre>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-200">🔄 Force Recalculate</button>
                <button className="text-xs bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg hover:bg-orange-200">📊 Signal History</button>
                <button className="text-xs bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200">🗑 Delete DNA</button>
              </div>
            </div>
          )}

          {/* All Profiles Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-black text-gray-900">All DNA Profiles ({dnaProfiles.length})</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    {["User", "Completeness", "Stage", "Churn Risk", "Signals", "Last Updated"].map(h => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dnaProfiles.slice(0, 50).map(d => (
                    <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(d)}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.userId?.slice(0, 16)}...</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${d.dnaCompleteness || 0}%` }} />
                          </div>
                          <span className="text-xs font-bold">{d.dnaCompleteness || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="capitalize text-xs font-semibold text-gray-700">{d.intentDNA?.buyerStage || '—'}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold capitalize ${d.predictions?.churnRisk === 'high' ? 'text-red-600' : d.predictions?.churnRisk === 'medium' ? 'text-orange-600' : 'text-green-600'}`}>
                          {d.predictions?.churnRisk || 'low'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{d.totalSignalsProcessed || 0}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{d.lastRecalculated ? new Date(d.lastRecalculated).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RULES */}
      {activeTab === "/admin/kemedar/dna/rules" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 mb-4">Create New Rule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Rule Name</label>
                <input value={newRule.ruleName} onChange={e => setNewRule(r => ({ ...r, ruleName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Target Dimension</label>
                <select value={newRule.targetDimension} onChange={e => setNewRule(r => ({ ...r, targetDimension: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option value="">Select dimension...</option>
                  {['propertyDNA', 'financialDNA', 'intentDNA', 'timingDNA', 'geographicDNA', 'platformDNA'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Action Type</label>
                <select value={newRule.actionType} onChange={e => setNewRule(r => ({ ...r, actionType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  {['show_feature', 'hide_feature', 'reorder_content', 'personalize_message', 'trigger_notification', 'surface_property', 'show_banner', 'suggest_action'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Priority (1-100)</label>
                <input type="number" value={newRule.priority} onChange={e => setNewRule(r => ({ ...r, priority: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" />
              </div>
            </div>
            <button onClick={handleSaveRule} disabled={savingRule || !newRule.ruleName}
              className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
              {savingRule ? "Saving..." : "Save Rule"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Rule", "Dimension", "Action", "Impressions", "Conversions", "Active"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{rule.ruleName}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{rule.targetDimension || '—'}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{rule.actionType}</span></td>
                    <td className="px-4 py-3 text-gray-600">{rule.impressions || 0}</td>
                    <td className="px-4 py-3 text-gray-600">{rule.conversions || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${rule.isActive ? 'text-green-600' : 'text-gray-400'}`}>{rule.isActive ? '✅ Active' : '❌ Off'}</span>
                    </td>
                  </tr>
                ))}
                {rules.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No rules yet. Create your first personalization rule above.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SIGNALS */}
      {activeTab === "/admin/kemedar/dna/signals" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">📡 Signal Monitor (Latest {signals.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Time", "User", "Signal Type", "Entity", "Platform"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signals.slice(0, 100).map(s => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(s.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.userId?.slice(0, 12)}...</td>
                    <td className="px-4 py-3"><span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{s.signalType}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{s.entityType || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{s.platform || 'web'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "/admin/kemedar/dna/settings" && (
        <div className="space-y-5">
          {[
            {
              title: "DNA Collection",
              items: [
                { key: "collectSignals", label: "Collect behavioral signals", type: "toggle" },
                { key: "signalRetentionDays", label: "Signal retention period (days)", type: "number" },
                { key: "realtimeUpdates", label: "Real-time partial updates", type: "toggle" },
              ]
            },
            {
              title: "Personalization",
              items: [
                { key: "homepagePersonalization", label: "Homepage personalization", type: "toggle" },
                { key: "searchRanking", label: "Search result ranking", type: "toggle" },
                { key: "notificationPersonalization", label: "Notification personalization", type: "toggle" },
                { key: "emailPersonalization", label: "Email personalization", type: "toggle" },
                { key: "minDNACompleteness", label: "Min DNA completeness to personalize (%)", type: "number" },
              ]
            },
            {
              title: "AI Insights",
              items: [
                { key: "generateInsights", label: "Generate AI insights per user", type: "toggle" },
                { key: "showInsightsToUsers", label: "Show insights to users", type: "toggle" },
                { key: "maxInsightsShown", label: "Max insights shown to user", type: "number" },
              ]
            },
            {
              title: "Privacy & GDPR",
              items: [
                { key: "allowUsersToEdit", label: "Allow users to edit DNA", type: "toggle" },
                { key: "allowUsersToDelete", label: "Allow users to delete DNA", type: "toggle" },
                { key: "gdprMode", label: "GDPR compliance mode", type: "toggle" },
              ]
            }
          ].map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-black text-gray-900 mb-4">{section.title}</p>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-800">{item.label}</span>
                    {item.type === 'toggle' ? (
                      <button onClick={() => setDnaSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                        className={`w-12 h-6 rounded-full relative transition-colors ${dnaSettings[item.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${dnaSettings[item.key] ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    ) : (
                      <input type="number" value={dnaSettings[item.key]} onChange={e => setDnaSettings(s => ({ ...s, [item.key]: Number(e.target.value) }))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors">
            💾 Save Settings
          </button>
        </div>
      )}
    </div>
  );
}