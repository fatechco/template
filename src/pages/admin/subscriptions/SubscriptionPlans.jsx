import { useState, useEffect } from "react";
import { Plus, Edit, Copy, Power, Trash2, RefreshCw, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PlanFormModal from "@/components/admin/subscriptions/PlanFormModal";

const MODULE_META = {
  kemedar: { label: "Kemedar", icon: "🏠", color: "bg-orange-100 text-orange-700" },
  kemework: { label: "Kemework", icon: "🔧", color: "bg-teal-100 text-teal-700" },
  kemetro: { label: "Kemetro", icon: "🛒", color: "bg-blue-100 text-blue-700" },
};

const TIER_COLORS = {
  free: "bg-gray-100 text-gray-600",
  basic: "bg-slate-100 text-slate-700",
  starter: "bg-cyan-100 text-cyan-700",
  bronze: "bg-amber-100 text-amber-700",
  silver: "bg-zinc-200 text-zinc-700",
  gold: "bg-yellow-100 text-yellow-700",
  professional: "bg-purple-100 text-purple-700",
  enterprise: "bg-indigo-100 text-indigo-700",
};

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [subscribers, setSubscribers] = useState({});
  const [loading, setLoading] = useState(true);
  const [moduleTab, setModuleTab] = useState("all");
  const [modalMode, setModalMode] = useState(null); // null | "create" | "edit" | "duplicate"
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const [plansData, modulesData, subsData] = await Promise.all([
      base44.entities.SubscriptionPlan.list("-sortOrder"),
      base44.entities.SystemModule.list(),
      base44.entities.Subscription.list(),
    ]);
    setPlans(plansData);
    setModules(modulesData);
    // Count active subscribers per plan
    const counts = {};
    subsData.forEach(s => {
      if (s.status === "active") {
        counts[s.planId] = (counts[s.planId] || 0) + 1;
      }
    });
    setSubscribers(counts);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const filteredPlans = moduleTab === "all"
    ? plans
    : plans.filter(p => {
        const mod = moduleById[p.moduleId];
        return mod?.slug === moduleTab;
      });

  const openCreate = () => { setEditingPlan(null); setModalMode("create"); };
  const openEdit = (plan) => { setEditingPlan(plan); setModalMode("edit"); };
  const openDuplicate = (plan) => {
    setEditingPlan({
      ...plan,
      id: undefined,
      name: plan.name + " (Copy)",
      slug: (plan.slug || "") + "-copy",
      isDefault: false,
    });
    setModalMode("duplicate");
  };

  const handleToggleActive = async (plan) => {
    await base44.entities.SubscriptionPlan.update(plan.id, { isActive: !plan.isActive });
    fetchAll();
  };

  const handleDelete = async (id) => {
    await base44.entities.SubscriptionPlan.delete(id);
    setDeleteConfirm(null);
    fetchAll();
  };

  const handleSave = async (data) => {
    if (modalMode === "edit" && editingPlan?.id) {
      await base44.entities.SubscriptionPlan.update(editingPlan.id, data);
    } else {
      await base44.entities.SubscriptionPlan.create(data);
    }
    setModalMode(null);
    setEditingPlan(null);
    fetchAll();
  };

  const moduleTabs = [
    { key: "all", label: "All", icon: "💎", color: "text-gray-700" },
    { key: "kemedar", label: "Kemedar", icon: "🏠", color: "text-orange-600" },
    { key: "kemework", label: "Kemework", icon: "🔧", color: "text-teal-600" },
    { key: "kemetro", label: "Kemetro", icon: "🛒", color: "text-blue-600" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500 text-sm">{filteredPlans.length} plans across all modules</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={15} /> Create New Plan
          </button>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {moduleTabs.map(tab => {
          const count = tab.key === "all"
            ? plans.length
            : plans.filter(p => moduleById[p.moduleId]?.slug === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setModuleTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                moduleTab === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="ml-1 bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
            <p className="text-sm font-semibold">Loading plans…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Module", "Plan Name", "Tier", "Price/mo", "Max Listings", "Max Projects", "Commission%", "Subscribers", "Sort", "Status", "Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPlans.length === 0 && (
                  <tr><td colSpan={11} className="py-16 text-center text-gray-400">
                    <p className="text-2xl mb-2">💎</p>
                    <p className="font-semibold">No plans found</p>
                  </td></tr>
                )}
                {filteredPlans.map(plan => {
                  const mod = moduleById[plan.moduleId];
                  const modMeta = MODULE_META[mod?.slug] || { label: mod?.name || "—", icon: "📦", color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={plan.id} className={`hover:bg-gray-50 transition-colors ${!plan.isActive ? "opacity-50" : ""}`}>
                      {/* Module */}
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${modMeta.color}`}>
                          {modMeta.icon} {modMeta.label}
                        </span>
                      </td>
                      {/* Plan Name */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{plan.name}</span>
                          {plan.badgeLabel && (
                            <span className="text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{plan.badgeLabel}</span>
                          )}
                          {plan.isDefault && (
                            <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">DEFAULT</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{plan.slug}</p>
                      </td>
                      {/* Tier */}
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TIER_COLORS[plan.tier] || "bg-gray-100 text-gray-600"}`}>
                          {plan.tier}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-3 py-3 font-black text-gray-900">
                        {plan.priceUSD === 0 ? <span className="text-green-600">Free</span> : `$${plan.priceUSD}`}
                      </td>
                      {/* Max Listings */}
                      <td className="px-3 py-3 text-gray-600">
                        {plan.maxListings == null ? <span className="text-purple-600 font-bold">∞</span> : plan.maxListings}
                      </td>
                      {/* Max Projects */}
                      <td className="px-3 py-3 text-gray-600">
                        {plan.maxProjects == null ? <span className="text-purple-600 font-bold">∞</span> : plan.maxProjects ?? "—"}
                      </td>
                      {/* Commission% */}
                      <td className="px-3 py-3 text-gray-600">
                        {plan.commissionPercent != null ? `${plan.commissionPercent}%` : "—"}
                      </td>
                      {/* Subscribers */}
                      <td className="px-3 py-3">
                        <span className={`font-black text-sm ${(subscribers[plan.id] || 0) > 0 ? "text-orange-600" : "text-gray-300"}`}>
                          {subscribers[plan.id] || 0}
                        </span>
                      </td>
                      {/* Sort */}
                      <td className="px-3 py-3 text-gray-500">{plan.sortOrder ?? 0}</td>
                      {/* Status */}
                      <td className="px-3 py-3">
                        <button onClick={() => handleToggleActive(plan)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${
                            plan.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {plan.isActive ? <><Check size={10} /> Active</> : <><X size={10} /> Inactive</>}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => openEdit(plan)} title="Edit"
                            className="p-1.5 hover:bg-orange-50 text-orange-500 rounded">
                            <Edit size={13} />
                          </button>
                          <button onClick={() => openDuplicate(plan)} title="Duplicate"
                            className="p-1.5 hover:bg-blue-50 text-blue-500 rounded">
                            <Copy size={13} />
                          </button>
                          <button onClick={() => handleToggleActive(plan)} title={plan.isActive ? "Deactivate" : "Activate"}
                            className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded">
                            <Power size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm(plan.id)} title="Delete"
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded">
                            <Trash2 size={13} />
                          </button>
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

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-black text-gray-900 mb-2">Delete Plan?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. Any active subscribers will be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Form Modal */}
      {modalMode && (
        <PlanFormModal
          plan={editingPlan}
          modules={modules}
          mode={modalMode}
          onSave={handleSave}
          onClose={() => { setModalMode(null); setEditingPlan(null); }}
        />
      )}
    </div>
  );
}