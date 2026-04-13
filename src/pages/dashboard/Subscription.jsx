import { useState, useEffect, useMemo } from "react";
import { CheckCircle, Download, Zap, X, AlertCircle, ChevronRight, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CFG = {
  active:          { label: "Active",          color: "bg-green-100 text-green-700" },
  trial:           { label: "Trial",           color: "bg-blue-100 text-blue-700" },
  expired:         { label: "Expired",         color: "bg-gray-100 text-gray-500" },
  cancelled:       { label: "Cancelled",       color: "bg-red-100 text-red-600" },
  suspended:       { label: "Suspended",       color: "bg-yellow-100 text-yellow-700" },
  pending_payment: { label: "Pending Payment", color: "bg-orange-100 text-orange-700" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  color: "bg-orange-100 text-orange-700", accent: "#f97316", limitField: "maxListings",  limitLabel: "Properties" },
  kemework: { icon: "🔧", label: "Kemework", color: "bg-teal-100 text-teal-700",     accent: "#14b8a6", limitField: "maxProjects",  limitLabel: "Services" },
  kemetro:  { icon: "🛒", label: "Kemetro",  color: "bg-blue-100 text-blue-700",     accent: "#3b82f6", limitField: "maxListings",  limitLabel: "Products" },
};

function UpgradeModal({ subscription, currentPlan, availablePlans, onClose, onConfirm }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    await onConfirm(subscription.id, selectedPlan.id);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Change Plan</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-xs text-gray-500 mb-3">Current: <strong>{currentPlan?.name}</strong> · ${currentPlan?.priceUSD}/mo</p>
          {availablePlans.filter(p => p.id !== currentPlan?.id).map(plan => {
            const isUpgrade = (plan.priceUSD || 0) > (currentPlan?.priceUSD || 0);
            return (
              <div key={plan.id} onClick={() => setSelectedPlan(plan)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPlan?.id === plan.id ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-gray-900">{plan.name}</p>
                    <p className="text-xs text-gray-500">${plan.priceUSD}/mo · {plan.billingCycle}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isUpgrade ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                    {isUpgrade ? "⬆ Upgrade" : "⬇ Downgrade"}
                  </span>
                </div>
                {plan.features?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600"><CheckCircle size={10} className="text-green-500" />{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {selectedPlan && (
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              <p className="font-bold mb-1">💡 Proration Info</p>
              <p>You'll be charged the difference for the remaining days in your current billing cycle. Changes take effect immediately.</p>
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={handleConfirm} disabled={!selectedPlan || loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm">
            {loading ? "Processing…" : "Confirm Change"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubCard({ sub, plan, mod, onManage }) {
  const meta = MODULE_META[mod?.slug] || { icon: "📦", label: mod?.name, color: "bg-gray-100 text-gray-600", accent: "#888", limitLabel: "Items", limitField: null };
  const statusCfg = STATUS_CFG[sub.status] || STATUS_CFG.active;
  const limit = plan?.[meta.limitField] || null;
  const used = 5; // placeholder — would need actual count query
  const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
  const expiringSoon = sub.endDate && (new Date(sub.endDate) - new Date()) < 1000 * 60 * 60 * 24 * 30;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{meta.icon}</div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">{meta.label}</p>
            <h3 className="text-xl font-black text-gray-900">{plan?.name || "Unknown Plan"}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
              {expiringSoon && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">⚠ Expiring Soon</span>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: meta.accent }}>${plan?.priceUSD || 0}<span className="text-sm font-normal text-gray-400">/mo</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400">Start Date</p>
          <p className="font-black text-gray-800 mt-0.5">{sub.startDate || "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400">Renewal Date</p>
          <p className="font-black text-gray-800 mt-0.5">{sub.nextBillingDate || sub.endDate || "—"}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-gray-400">Auto-Renew</p>
          <p className="font-black text-gray-800 mt-0.5">{sub.autoRenew ? "✅ Yes" : "❌ No"}</p>
        </div>
      </div>

      {limit && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500">{meta.limitLabel} used</span>
            <span className="font-black text-gray-800">{used} of {limit}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? "#ef4444" : meta.accent }} />
          </div>
          {pct > 80 && <p className="text-[10px] text-red-500 font-bold mt-1">⚠ You're nearing your plan limit. Consider upgrading.</p>}
        </div>
      )}

      {plan?.features?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {plan.features.slice(0, 4).map((f, i) => (
            <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.accent + "15", color: meta.accent }}>
              <CheckCircle size={9} className="inline mr-0.5" />{f}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button onClick={() => onManage(sub)} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs">
          <Zap size={12} /> Manage Subscription
        </button>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-4 py-2 rounded-lg text-xs">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Subscription() {
  const [me, setMe] = useState(null);
  const [subscriptions, setSubs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manageModal, setManageModal] = useState(null); // {sub, module}

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
  }, []);

  const fetchAll = () => {
    if (!me) return;
    setLoading(true);
    Promise.all([
      base44.entities.Subscription.filter({ userId: me.id }),
      base44.entities.SubscriptionPlan.list(),
      base44.entities.SystemModule.list(),
      base44.entities.Invoice.filter({ userId: me.id }),
    ]).then(([subs, pls, mods, invs]) => {
      setSubs(subs);
      setPlans(pls);
      setModules(mods);
      setInvoices(invs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [me]);

  const planById = Object.fromEntries(plans.map(p => [p.id, p]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const myModuleSlugs = new Set(subscriptions.map(s => moduleById[s.moduleId]?.slug).filter(Boolean));
  const otherModules = modules.filter(m => !myModuleSlugs.has(m.slug) && MODULE_META[m.slug]);

  const handleUpgradeConfirm = async (subId, newPlanId) => {
    const plan = planById[newPlanId];
    await base44.entities.Subscription.update(subId, { planId: newPlanId });
    await base44.entities.SubscriptionActivity.create({
      subscriptionId: subId,
      actorId: me?.id,
      action: "upgraded",
      description: `Plan changed to ${plan?.name}`,
    });
    fetchAll();
  };

  const INVOICE_STATUS = {
    paid:      "bg-green-100 text-green-700",
    draft:     "bg-gray-100 text-gray-500",
    sent:      "bg-blue-100 text-blue-700",
    overdue:   "bg-red-100 text-red-600",
    cancelled: "bg-gray-100 text-gray-400",
    refunded:  "bg-purple-100 text-purple-700",
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-7 h-7 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <h1 className="text-2xl font-black text-gray-900">My Subscriptions</h1>

      {/* SECTION 1 — Current Subscriptions */}
      {subscriptions.length === 0 ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">💎</p>
          <h3 className="font-black text-gray-900 text-lg mb-1">No active subscriptions</h3>
          <p className="text-gray-500 text-sm mb-4">Unlock premium features by subscribing to a plan.</p>
          <a href="/dashboard/premium-services" className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-colors inline-block">
            View Plans
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-800">Current Subscriptions</h2>
          {subscriptions.map(sub => (
            <SubCard
              key={sub.id}
              sub={sub}
              plan={planById[sub.planId]}
              mod={moduleById[sub.moduleId]}
              onManage={(s) => setManageModal({ sub: s, mod: moduleById[s.moduleId] })}
            />
          ))}
        </div>
      )}

      {/* SECTION 2 — Upgrade Options (per active module) */}
      {subscriptions.map(sub => {
        const mod = moduleById[sub.moduleId];
        const meta = MODULE_META[mod?.slug];
        if (!meta) return null;
        const modPlans = plans.filter(p => p.moduleId === sub.moduleId && p.isActive !== false);
        if (modPlans.length < 2) return null;
        return (
          <div key={sub.id}>
            <h2 className="text-lg font-black text-gray-800 mb-4">{meta.icon} {meta.label} — Plan Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modPlans.map(plan => {
                const isCurrent = plan.id === sub.planId;
                const isUpgrade = !isCurrent && (plan.priceUSD || 0) > (planById[sub.planId]?.priceUSD || 0);
                return (
                  <div key={plan.id} className={`relative bg-white rounded-2xl border-2 p-4 flex flex-col transition-all ${isCurrent ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-100 hover:border-orange-200"}`}>
                    {isCurrent && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">Current</span>}
                    <p className="font-black text-gray-900 text-sm mb-1">{plan.name}</p>
                    <p className="text-xl font-black" style={{ color: meta.accent }}>${plan.priceUSD}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                    <ul className="mt-2 space-y-1 flex-1 mb-3">
                      {(plan.features || []).slice(0, 3).map((f, i) => (
                        <li key={i} className="text-[10px] text-gray-500 flex items-start gap-1"><CheckCircle size={9} className="text-green-500 mt-0.5" />{f}</li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <button onClick={() => setManageModal({ sub, mod })}
                        className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: meta.accent }}>
                        {isUpgrade ? "⬆ Upgrade" : "⬇ Downgrade"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* SECTION 3 — Expand to Other Modules */}
      {otherModules.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-800 mb-4">Expand to More Platforms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {otherModules.map(mod => {
              const meta = MODULE_META[mod.slug];
              if (!meta) return null;
              const modPlans = plans.filter(p => p.moduleId === mod.id);
              const minPrice = modPlans.length ? Math.min(...modPlans.map(p => p.priceUSD || 0)) : 0;
              return (
                <div key={mod.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="text-3xl mb-3">{meta.icon}</div>
                  <h3 className="font-black text-gray-900 mb-1">{meta.label}</h3>
                  <p className="text-xs text-gray-500 mb-3">{mod.description || "Expand your presence on the " + meta.label + " platform."}</p>
                  <p className="text-sm font-bold text-gray-700 mb-3">From <span style={{ color: meta.accent }} className="font-black">${minPrice}/mo</span></p>
                  <a href="/dashboard/premium-services"
                    className="flex items-center gap-1 text-xs font-bold hover:opacity-80 transition-opacity"
                    style={{ color: meta.accent }}>
                    View Plans <ChevronRight size={12} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4 — Payment History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Payment History</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-2xl mb-2">🧾</p>
            <p>No invoices yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Date","Description","Amount","Status","Invoice"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{inv.created_date ? new Date(inv.created_date).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{inv.invoiceNumber || inv.invoiceType?.replace("_", " ")} </td>
                    <td className="px-4 py-3 font-black text-gray-900">${(inv.totalAmount || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${INVOICE_STATUS[inv.status] || "bg-gray-100 text-gray-500"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs">
                        <Download size={12} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade/Downgrade Modal */}
      {manageModal && (
        <UpgradeModal
          subscription={manageModal.sub}
          currentPlan={planById[manageModal.sub.planId]}
          availablePlans={plans.filter(p => p.moduleId === manageModal.sub.moduleId && p.isActive !== false)}
          onClose={() => setManageModal(null)}
          onConfirm={handleUpgradeConfirm}
        />
      )}
    </div>
  );
}