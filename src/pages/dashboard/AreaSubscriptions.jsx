import { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, Eye, MessageCircle, AlertTriangle, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const STATUS_CONFIG = {
  active:          { label: "Active",          color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  expired:         { label: "Expired",         color: "bg-gray-100 text-gray-500",     dot: "bg-gray-400" },
  cancelled:       { label: "Cancelled",       color: "bg-red-100 text-red-500",       dot: "bg-red-400" },
  suspended:       { label: "Suspended",       color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  trial:           { label: "Trial",           color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  pending_payment: { label: "Pending Payment", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  color: "bg-orange-100 text-orange-700" },
  kemework: { icon: "🔧", label: "Kemework", color: "bg-teal-100 text-teal-700" },
  kemetro:  { icon: "🛒", label: "Kemetro",  color: "bg-blue-100 text-blue-700" },
};

const avatarBg = ["bg-orange-500","bg-blue-500","bg-teal-500","bg-purple-500","bg-red-500"];
const colorFor = (id) => avatarBg[(id?.charCodeAt(0) || 0) % avatarBg.length];
const initials = (name) => (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

function SubDetailModal({ sub, plan, mod, commission, activities, users, onClose }) {
  const user = users.find(u => u.id === sub.userId);
  const modMeta = MODULE_META[mod?.slug] || { icon: "📦", label: mod?.name || "—", color: "bg-gray-100 text-gray-600" };
  const myActivities = (activities || []).filter(a => a.subscriptionId === sub.id);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Subscription Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Subscriber */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colorFor(user?.id || sub.userId)} text-white text-sm font-black flex items-center justify-center`}>
              {initials(user?.full_name || sub.userId)}
            </div>
            <div>
              <p className="font-black text-gray-900">{user?.full_name || "Unknown User"}</p>
              <p className="text-xs text-gray-500">{user?.email || sub.userId}</p>
            </div>
          </div>
          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "Module", value: <span className={`font-bold px-2 py-0.5 rounded-full ${modMeta.color}`}>{modMeta.icon} {modMeta.label}</span> },
              { label: "Plan", value: <span className="font-bold">{plan?.name || "—"}</span> },
              { label: "Status", value: <span className={`font-bold px-2 py-0.5 rounded-full ${(STATUS_CONFIG[sub.status] || {}).color}`}>{sub.status}</span> },
              { label: "Price", value: `$${plan?.priceUSD || 0}/mo` },
              { label: "Start Date", value: sub.startDate || "—" },
              { label: "End Date", value: sub.endDate || "—" },
              { label: "Auto-Renew", value: sub.autoRenew ? "✅ Yes" : "❌ No" },
              { label: "Payment Method", value: sub.paymentMethod || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400 text-[10px] font-semibold mb-0.5">{label}</p>
                <div className="font-bold text-gray-800">{value}</div>
              </div>
            ))}
          </div>
          {/* Commission */}
          {commission && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3">
              <p className="text-[10px] font-black text-green-700 uppercase mb-2">💸 My Commission</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div><p className="text-gray-500">Rate</p><p className="font-black text-green-700">{sub.franchiseCommissionPercent || 0}%</p></div>
                <div><p className="text-gray-500">Amount</p><p className="font-black text-green-700">${(commission.commissionAmount || 0).toFixed(2)}</p></div>
                <div><p className="text-gray-500">Status</p><p className="font-black text-green-700">{commission.status}</p></div>
              </div>
            </div>
          )}
          {/* Activity */}
          {myActivities.length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-500 uppercase mb-2">Activity Timeline</p>
              <div className="space-y-2">
                {myActivities.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-700">{a.action}</span>
                      {a.description && <span className="text-gray-500 ml-1">— {a.description}</span>}
                      <p className="text-gray-400 text-[10px]">{a.created_date ? new Date(a.created_date).toLocaleDateString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AreaSubscriptions() {
  const [moduleTab, setModuleTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewSub, setViewSub] = useState(null);
  const [me, setMe] = useState(null);

  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => setMe(u)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    Promise.all([
      base44.entities.Subscription.filter({ franchiseOwnerId: me.id }),
      base44.entities.SubscriptionPlan.list(),
      base44.entities.SystemModule.list(),
      base44.entities.FranchiseCommission.filter({ franchiseOwnerId: me.id }),
      base44.entities.SubscriptionActivity.list("-created_date", 200),
      base44.entities.User.list(),
    ]).then(([subs, pl, mods, comm, acts, usrs]) => {
      setSubscriptions(subs);
      setPlans(pl);
      setModules(mods);
      setCommissions(comm);
      setActivities(acts);
      setUsers(usrs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [me]);

  const planById = Object.fromEntries(plans.map(p => [p.id, p]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));
  const commBySubId = Object.fromEntries(commissions.filter(c => c.subscriptionId).map(c => [c.subscriptionId, c]));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const soonDate = new Date(); soonDate.setDate(soonDate.getDate() + 30);

  const stats = {
    active: subscriptions.filter(s => s.status === "active").length,
    newThisMonth: subscriptions.filter(s => s.created_date && new Date(s.created_date) >= monthStart).length,
    expiringSoon: subscriptions.filter(s => s.status === "active" && s.endDate && new Date(s.endDate) <= soonDate).length,
    commissionThisMonth: commissions.filter(c => c.created_date && new Date(c.created_date) >= monthStart).reduce((s, c) => s + (c.commissionAmount || 0), 0),
  };

  const filtered = subscriptions.filter(s => {
    const mod = moduleById[s.moduleId];
    if (moduleTab !== "all" && mod?.slug !== moduleTab) return false;
    if (filterPlan && s.planId !== filterPlan) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    if (search) {
      const user = users.find(u => u.id === s.userId);
      const q = search.toLowerCase();
      if (!(user?.full_name || "").toLowerCase().includes(q) && !(user?.email || "").toLowerCase().includes(q) && !(s.subscriptionCode || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const kpis = [
    { icon: "💎", label: "Active Subscribers", value: stats.active, color: "text-green-600", bg: "bg-green-50" },
    { icon: "🆕", label: "New This Month", value: stats.newThisMonth, color: "text-blue-600", bg: "bg-blue-50" },
    { icon: "⏳", label: "Expiring Soon", value: stats.expiringSoon, color: "text-yellow-700", bg: "bg-yellow-50" },
    { icon: "💰", label: "My Commission This Month", value: `$${stats.commissionThisMonth.toFixed(2)}`, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Subscriptions in My Area</h1>
        <p className="text-gray-500 text-sm">{filtered.length} subscriptions assigned to your area</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-white shadow-sm`}>
            <div className="text-2xl mb-1">{k.icon}</div>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Module Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white overflow-x-auto no-scrollbar">
        {[{ key: "all", label: "All" }, ...modules.map(m => ({ key: m.slug, label: m.name }))].map(tab => (
          <button key={tab.key} onClick={() => setModuleTab(tab.key)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              moduleTab === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{tab.label}</button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscriber…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Plans</option>
          {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Subscriber","Module","Plan","Price","Status","Start","End","My Commission","Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-16 text-center text-gray-400">No subscriptions found</td></tr>
                )}
                {filtered.map(sub => {
                  const user = users.find(u => u.id === sub.userId);
                  const plan = planById[sub.planId];
                  const mod = moduleById[sub.moduleId];
                  const modMeta = MODULE_META[mod?.slug] || { icon: "📦", label: mod?.name || "—", color: "bg-gray-100 text-gray-600" };
                  const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.active;
                  const comm = commBySubId[sub.id];
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${colorFor(sub.userId)} text-white text-[10px] font-black flex items-center justify-center flex-shrink-0`}>
                            {initials(user?.full_name || sub.userId)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user?.full_name || "—"}</p>
                            <p className="text-[10px] text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${modMeta.color}`}>{modMeta.icon} {modMeta.label}</span>
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-800">{plan?.name || "—"}</td>
                      <td className="px-3 py-3 font-bold text-gray-800">${plan?.priceUSD || 0}/mo</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{sub.startDate || "—"}</td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{sub.endDate || "—"}</td>
                      <td className="px-3 py-3">
                        {comm ? (
                          <div>
                            <p className="font-black text-green-600">${(comm.commissionAmount || 0).toFixed(2)}</p>
                            <p className="text-[10px] text-gray-400">{sub.franchiseCommissionPercent || 0}%</p>
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => setViewSub(sub)} title="View Details"
                            className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                          {user?.email && (
                            <a href={`mailto:${user.email}`} title="Contact"
                              className="p-1.5 hover:bg-green-50 text-green-500 rounded"><MessageCircle size={13} /></a>
                          )}
                          <button title="Report Issue"
                            className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded"><AlertTriangle size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewSub && (
        <SubDetailModal
          sub={viewSub}
          plan={planById[viewSub.planId]}
          mod={moduleById[viewSub.moduleId]}
          commission={commBySubId[viewSub.id]}
          activities={activities}
          users={users}
          onClose={() => setViewSub(null)}
        />
      )}
    </div>
  );
}