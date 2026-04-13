import { useState } from "react";
import { X, ArrowUpDown } from "lucide-react";

export default function UpgradeModal({ subscription, currentPlan, allPlans, onConfirm, onClose }) {
  const [newPlanId, setNewPlanId] = useState("");
  const [effective, setEffective] = useState("immediately");
  const [saving, setSaving] = useState(false);

  const newPlan = allPlans.find(p => p.id === newPlanId);

  // Simple proration: days remaining / 30 * price difference
  const proration = (() => {
    if (!newPlan || !currentPlan || !subscription.endDate) return null;
    const daysLeft = Math.max(0, Math.round((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
    const diff = (newPlan.priceUSD || 0) - (currentPlan?.priceUSD || 0);
    const prorated = ((daysLeft / 30) * diff).toFixed(2);
    return { daysLeft, diff, prorated };
  })();

  const handleConfirm = async () => {
    if (!newPlanId) return;
    setSaving(true);
    await onConfirm(newPlanId, effective);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <ArrowUpDown size={18} className="text-purple-500" /> Upgrade / Downgrade Plan
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Current Plan */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Current Plan</p>
            <p className="font-black text-gray-900">{currentPlan?.name || "—"}</p>
            <p className="text-sm text-gray-500">${currentPlan?.priceUSD}/mo</p>
          </div>

          {/* New Plan */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">New Plan</label>
            <select value={newPlanId} onChange={e => setNewPlanId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
              <option value="">Select a plan…</option>
              {allPlans.filter(p => p.id !== subscription.planId).map(p => (
                <option key={p.id} value={p.id}>{p.name} — ${p.priceUSD}/mo</option>
              ))}
            </select>
          </div>

          {/* Proration */}
          {proration && newPlan && (
            <div className={`rounded-xl p-3 border ${proration.diff >= 0 ? "bg-purple-50 border-purple-100" : "bg-green-50 border-green-100"}`}>
              <p className="text-xs font-bold text-gray-600 mb-1">Proration Estimate</p>
              <p className="text-xs text-gray-600">{proration.daysLeft} days remaining in current cycle</p>
              <p className="text-xs text-gray-600">Price difference: <strong>{proration.diff >= 0 ? "+" : ""}${proration.diff}/mo</strong></p>
              <p className="text-sm font-black mt-1">
                {proration.diff >= 0 ? "Amount due now:" : "Credit:"} <span className={proration.diff >= 0 ? "text-purple-700" : "text-green-700"}>${Math.abs(proration.prorated)}</span>
              </p>
            </div>
          )}

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Effective Date</label>
            <div className="flex gap-3">
              {[
                { value: "immediately", label: "Immediately" },
                { value: "next_cycle", label: "Next Billing Cycle" },
              ].map(opt => (
                <label key={opt.value} className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer text-sm transition-colors ${
                  effective === opt.value ? "border-purple-400 bg-purple-50 text-purple-800 font-semibold" : "border-gray-200 text-gray-600"
                }`}>
                  <input type="radio" name="effective" value={opt.value} checked={effective === opt.value}
                    onChange={() => setEffective(opt.value)} className="accent-purple-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={!newPlanId || saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {saving ? "Saving…" : "Confirm Change"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}