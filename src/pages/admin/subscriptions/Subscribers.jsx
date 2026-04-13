import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SubscriberKPIs from "@/components/admin/subscriptions/SubscriberKPIs";
import SubscriberTable from "@/components/admin/subscriptions/SubscriberTable";
import SubscriptionDetailModal from "@/components/admin/subscriptions/SubscriptionDetailModal";
import UpgradeModal from "@/components/admin/subscriptions/UpgradeModal";
import CancelModal from "@/components/admin/subscriptions/CancelModal";
import CreateSubscriptionModal from "@/components/admin/subscriptions/CreateSubscriptionModal";

export default function Subscribers() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ moduleSlug: "", planId: "", status: "", franchiseOwnerId: "" });
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [detailSub, setDetailSub] = useState(null);
  const [upgradeSub, setUpgradeSub] = useState(null);
  const [cancelSub, setCancelSub] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [subs, plansData, modsData] = await Promise.all([
      base44.entities.Subscription.list("-created_date", 200),
      base44.entities.SubscriptionPlan.list(),
      base44.entities.SystemModule.list(),
    ]);
    setSubscriptions(subs);
    setPlans(plansData);
    setModules(modsData);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const planById = Object.fromEntries(plans.map(p => [p.id, p]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const filtered = subscriptions.filter(sub => {
    const plan = planById[sub.planId];
    const mod = moduleById[sub.moduleId];
    if (filters.moduleSlug && mod?.slug !== filters.moduleSlug) return false;
    if (filters.planId && sub.planId !== filters.planId) return false;
    if (filters.status && sub.status !== filters.status) return false;
    if (filters.franchiseOwnerId && sub.franchiseOwnerId !== filters.franchiseOwnerId) return false;
    if (search) {
      const q = search.toLowerCase();
      const matches = (sub.subscriptionCode || "").toLowerCase().includes(q) ||
        (sub.userId || "").toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  const handleSuspend = async (id) => {
    await base44.entities.Subscription.update(id, { status: "suspended" });
    fetchAll();
  };

  const handleRenew = async (id) => {
    await base44.entities.Subscription.update(id, { status: "active" });
    fetchAll();
  };

  const handleBulkSuspend = async () => {
    await Promise.all(selectedIds.map(id => base44.entities.Subscription.update(id, { status: "suspended" })));
    setSelectedIds([]);
    fetchAll();
  };

  const handleUpgradeConfirm = async (subId, newPlanId, effectiveDate) => {
    const plan = planById[newPlanId];
    await base44.entities.Subscription.update(subId, { planId: newPlanId });
    await base44.entities.SubscriptionActivity.create({
      subscriptionId: subId,
      action: "upgraded",
      description: `Plan changed to ${plan?.name}`,
    });
    setUpgradeSub(null);
    fetchAll();
  };

  const handleCancelConfirm = async (subId, reason, notes, effective, refund) => {
    const updates = {
      status: "cancelled",
      cancellationReason: `${reason}${notes ? ": " + notes : ""}`,
      cancellationDate: new Date().toISOString().slice(0, 10),
    };
    await base44.entities.Subscription.update(subId, updates);
    await base44.entities.SubscriptionActivity.create({
      subscriptionId: subId,
      action: "cancelled",
      description: `Cancelled — ${reason}. Effective: ${effective}. Refund: ${refund}.`,
    });
    setCancelSub(null);
    fetchAll();
  };

  const setFilter = (key, val) => setFilters(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Subscribers</h1>
          <p className="text-gray-500 text-sm">{filtered.length} subscriptions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={14} /> Create Subscription
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <SubscriberKPIs subscriptions={subscriptions} plans={plans} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by code, user ID…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filters.moduleSlug} onChange={e => setFilter("moduleSlug", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Modules</option>
          {modules.map(m => <option key={m.id} value={m.slug}>{m.icon} {m.name}</option>)}
        </select>
        <select value={filters.planId} onChange={e => setFilter("planId", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Plans</option>
          {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilter("status", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Statuses</option>
          {["active","expired","cancelled","suspended","trial","pending_payment"].map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-orange-700">{selectedIds.length} selected</span>
          <button onClick={handleBulkSuspend}
            className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
            Suspend Selected
          </button>
          <button className="flex items-center gap-1.5 border border-orange-300 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-orange-100">
            <Download size={11} /> Export
          </button>
          <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 font-bold px-2">Clear</button>
        </div>
      )}

      {/* Table */}
      <SubscriberTable
        subscriptions={filtered}
        plans={plans}
        modules={modules}
        loading={loading}
        selectedIds={selectedIds}
        onSelectIds={setSelectedIds}
        onView={setDetailSub}
        onUpgrade={setUpgradeSub}
        onCancel={setCancelSub}
        onSuspend={handleSuspend}
        onRenew={handleRenew}
      />

      {/* Modals */}
      {detailSub && (
        <SubscriptionDetailModal
          subscription={detailSub}
          plan={planById[detailSub.planId]}
          module={moduleById[detailSub.moduleId]}
          onClose={() => setDetailSub(null)}
          onRefresh={fetchAll}
        />
      )}
      {upgradeSub && (
        <UpgradeModal
          subscription={upgradeSub}
          currentPlan={planById[upgradeSub.planId]}
          allPlans={plans.filter(p => p.moduleId === upgradeSub.moduleId)}
          onConfirm={(newPlanId, effective) => handleUpgradeConfirm(upgradeSub.id, newPlanId, effective)}
          onClose={() => setUpgradeSub(null)}
        />
      )}
      {showCreate && (
        <CreateSubscriptionModal
          modules={modules}
          plans={plans}
          onClose={() => setShowCreate(false)}
          onCreated={fetchAll}
        />
      )}
      {cancelSub && (
        <CancelModal
          subscription={cancelSub}
          plan={planById[cancelSub.planId]}
          onConfirm={(reason, notes, effective, refund) => handleCancelConfirm(cancelSub.id, reason, notes, effective, refund)}
          onClose={() => setCancelSub(null)}
        />
      )}
    </div>
  );
}