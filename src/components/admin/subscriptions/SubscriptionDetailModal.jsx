import { useState, useEffect } from "react";
import { X, ExternalLink, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  active:          { label: "Active",          color: "bg-green-100 text-green-700" },
  expired:         { label: "Expired",         color: "bg-red-100 text-red-600" },
  cancelled:       { label: "Cancelled",       color: "bg-gray-100 text-gray-600" },
  suspended:       { label: "Suspended",       color: "bg-orange-100 text-orange-700" },
  trial:           { label: "Trial",           color: "bg-blue-100 text-blue-700" },
  pending_payment: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠", color: "bg-orange-100 text-orange-700", label: "Kemedar" },
  kemework: { icon: "🔧", color: "bg-teal-100 text-teal-700",     label: "Kemework" },
  kemetro:  { icon: "🛒", color: "bg-blue-100 text-blue-700",     label: "Kemetro" },
};

const ACTION_ICONS = {
  created: "🆕", activated: "✅", renewed: "🔄", upgraded: "⬆️",
  downgraded: "⬇️", suspended: "⏸", cancelled: "❌", expired: "⌛",
  payment_received: "💰", payment_failed: "⚠️",
};

function Section({ title, children }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 font-semibold flex-shrink-0">{label}</span>
      <span className="text-xs font-bold text-gray-800 text-right">{value || "—"}</span>
    </div>
  );
}

export default function SubscriptionDetailModal({ subscription: sub, plan, module: mod, onClose, onRefresh }) {
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState(sub.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const modMeta = MODULE_META[mod?.slug] || { icon: "📦", color: "bg-gray-100 text-gray-600", label: mod?.name || "—" };
  const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending_payment;

  useEffect(() => {
    base44.entities.SubscriptionActivity.filter({ subscriptionId: sub.id }, "-created_date")
      .then(setActivities)
      .catch(() => setActivities([]));
  }, [sub.id]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await base44.entities.Subscription.update(sub.id, { notes });
    setSavingNotes(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono font-black text-gray-900 text-sm">
              {sub.subscriptionCode || sub.id.slice(-8).toUpperCase()}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modMeta.color}`}>{modMeta.icon} {modMeta.label}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Section 1 — Subscriber Info */}
          <Section title="Subscriber Info">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black text-sm flex items-center justify-center">
                {(sub.userId || "?").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">User ID: {sub.userId}</p>
                <p className="text-xs text-gray-400 font-mono">Created: {sub.created_date ? new Date(sub.created_date).toLocaleDateString() : "—"}</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-orange-600 font-bold hover:underline">
              View Full User Profile <ExternalLink size={10} />
            </button>
          </Section>

          {/* Section 2 — Subscription Details */}
          <Section title="Subscription Details">
            <Row label="Plan" value={plan?.name} />
            <Row label="Price" value={plan?.priceUSD === 0 ? "Free" : `$${plan?.priceUSD}/mo`} />
            <Row label="Billing Cycle" value={plan?.billingCycle} />
            <Row label="Start Date" value={sub.startDate} />
            <Row label="End Date" value={sub.endDate} />
            <Row label="Next Billing Date" value={sub.nextBillingDate} />
            <Row label="Auto-Renew" value={sub.autoRenew ? "✅ Yes" : "❌ No"} />
            <Row label="Payment Method" value={sub.paymentMethod} />
            <Row label="Total Paid" value={`$${(sub.totalPaid || 0).toFixed(2)}`} />
          </Section>

          {/* Section 3 — Franchise Owner */}
          <Section title="Franchise Owner Assignment">
            {sub.franchiseOwnerId ? (
              <>
                <Row label="Franchise Owner ID" value={sub.franchiseOwnerId} />
                <Row label="Commission %" value={sub.franchiseCommissionPercent ? `${sub.franchiseCommissionPercent}%` : "—"} />
                <Row label="Total Commission Earned" value={`$${(sub.franchiseCommissionTotal || 0).toFixed(2)}`} />
                <div className="flex gap-2 pt-1">
                  <button className="text-xs border border-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Change Owner
                  </button>
                  <button className="text-xs border border-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Adjust Commission %
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400 italic">No franchise owner assigned.</p>
            )}
          </Section>

          {/* Section 4 — Payment History */}
          <Section title="Payment History">
            {sub.lastPaymentDate ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Date","Amount","Method","Status","Invoice"].map(h => (
                      <th key={h} className="py-1.5 text-left font-bold text-gray-400 text-[10px] uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1.5 text-gray-600">{sub.lastPaymentDate}</td>
                    <td className="py-1.5 font-bold text-gray-900">${sub.lastPaymentAmount || 0}</td>
                    <td className="py-1.5 text-gray-600">{sub.paymentMethod || "—"}</td>
                    <td className="py-1.5">
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Paid</span>
                    </td>
                    <td className="py-1.5 text-gray-400">—</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-gray-400 italic">No payment records yet.</p>
            )}
          </Section>

          {/* Section 5 — Activity Timeline */}
          <Section title="Activity Timeline">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No activity logged yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-base flex-shrink-0">{ACTION_ICONS[a.action] || "📌"}</span>
                    <div>
                      <span className="font-bold text-gray-700">
                        {a.created_date ? new Date(a.created_date).toLocaleDateString() : "—"}
                      </span>
                      <span className="text-gray-400 mx-1">—</span>
                      <span className="text-gray-600">{a.description || a.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Section 6 — Admin Notes */}
          <Section title="Admin Notes">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this subscription…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
            />
            <button onClick={saveNotes} disabled={savingNotes}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-60">
              <Save size={12} /> {savingNotes ? "Saving…" : "Save Notes"}
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}