import { useState, useEffect } from "react";
import { X, UserCheck, Save, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700" },
  confirmed:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700" },
  assigned:    { label: "Assigned",    color: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700" },
  cancelled:   { label: "Cancelled",   color: "bg-gray-100 text-gray-500" },
  refunded:    { label: "Refunded",    color: "bg-red-100 text-red-600" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠", color: "bg-orange-100 text-orange-700", label: "Kemedar" },
  kemework: { icon: "🔧", color: "bg-teal-100 text-teal-700",     label: "Kemework" },
  kemetro:  { icon: "🛒", color: "bg-blue-100 text-blue-700",     label: "Kemetro" },
};

const TIMELINE_STEPS = ["pending", "assigned", "in_progress", "completed"];

const ACTION_ICONS = {
  created: "🆕", assigned: "👤", started: "▶️", note_added: "📝",
  completed: "✅", cancelled: "❌", rated: "⭐", refunded: "💸",
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 font-semibold flex-shrink-0">{label}</span>
      <span className="text-xs font-bold text-gray-800 text-right">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function TimelineBar({ status }) {
  const current = TIMELINE_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i <= current;
        const labels = { pending: "Pending", assigned: "Assigned", in_progress: "In Progress", completed: "Completed" };
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${done ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className="text-[9px] text-gray-500 mt-1 text-center leading-tight">{labels[step]}</span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-4 ${i < current ? "bg-orange-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ServiceOrderDetailModal({ order, service, module: mod, onClose, onRefresh, onAssign }) {
  const [activities, setActivities] = useState([]);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [franchiseNotes, setFranchiseNotes] = useState(order.franchiseNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const modMeta = MODULE_META[mod?.slug] || { icon: "📦", color: "bg-gray-100 text-gray-600", label: mod?.name || "—" };
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  useEffect(() => {
    base44.entities.ServiceOrderActivity.filter({ serviceOrderId: order.id }, "-created_date")
      .then(setActivities).catch(() => setActivities([]));
  }, [order.id]);

  const saveNotes = async () => {
    setSavingNotes(true);
    await base44.entities.ServiceOrder.update(order.id, { adminNotes, franchiseNotes });
    setSavingNotes(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-black text-gray-900">{order.orderCode || order.id.slice(-8).toUpperCase()}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modMeta.color}`}>{modMeta.icon} {modMeta.label}</span>
            {service && <span className="text-xs text-gray-500">{service.icon} {service.name}</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[78vh]">
          {/* Section 1 — Order Summary */}
          <Section title="Order Summary">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase">Buyer</p>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    {(order.buyerId || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Buyer ID</p>
                    <p className="text-xs font-mono text-gray-400">{order.buyerId}</p>
                  </div>
                </div>
                {order.buyerNotes && (
                  <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 italic">"{order.buyerNotes}"</div>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-gray-400 uppercase">Order Details</p>
                <Row label="Service" value={service?.name} />
                <Row label="Tier" value={order.pricingTierLabel} />
                <Row label="Qty" value={order.quantity} />
                <Row label="Unit Price" value={`$${order.unitPrice || 0}`} />
                <Row label="Total" value={<span className="text-green-700 font-black">${order.totalPrice || 0}</span>} />
                <Row label="Currency" value={order.currency || "USD"} />
              </div>
            </div>
          </Section>

          {/* Section 2 — Related Entity */}
          <Section title="Related Entity">
            {order.relatedEntityType ? (
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <span className="text-2xl">
                  {order.relatedEntityType === "property" ? "🏠" :
                   order.relatedEntityType === "product" ? "📦" :
                   order.relatedEntityType === "profile" ? "👤" : "📌"}
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-700 capitalize">{order.relatedEntityType}</p>
                  <p className="text-[10px] font-mono text-gray-400">{order.relatedEntityId}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No linked entity for this order.</p>
            )}
          </Section>

          {/* Section 3 — Assignment */}
          <Section title="Assignment & Implementation">
            <TimelineBar status={order.status} />
            <div className="pt-2 space-y-1.5">
              {order.franchiseOwnerId ? (
                <>
                  <Row label="Franchise Owner" value={order.franchiseOwnerId} />
                  <Row label="Assigned Date" value={order.assignedDate} />
                  <Row label="Started Date" value={order.startedDate} />
                  <Row label="Completed Date" value={order.completedDate} />
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-red-500 font-bold">⚠️ No franchise owner assigned</p>
                  <button onClick={onAssign}
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                    <UserCheck size={12} /> Assign Now
                  </button>
                </div>
              )}
            </div>
          </Section>

          {/* Section 4 — Activity Timeline */}
          <Section title="Activity Timeline">
            {activities.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No activity logged yet.</p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-base flex-shrink-0">{ACTION_ICONS[a.action] || "📌"}</span>
                    <div>
                      <span className="font-bold text-gray-700">{a.created_date ? new Date(a.created_date).toLocaleDateString() : "—"}</span>
                      <span className="text-gray-400 mx-1">—</span>
                      <span className="text-gray-500 capitalize">{a.actorRole}</span>
                      <span className="text-gray-400 mx-1">·</span>
                      <span className="text-gray-700">{a.description || a.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Section 5 — Communication */}
          <Section title="Notes & Communication">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Buyer Notes (read-only)</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 min-h-[36px]">
                {order.buyerNotes || <span className="italic text-gray-300">No buyer notes</span>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Franchise Owner Notes</p>
              <textarea value={franchiseNotes} onChange={e => setFranchiseNotes(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Admin Notes</p>
              <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <button onClick={saveNotes} disabled={savingNotes}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-60">
              <Save size={12} /> {savingNotes ? "Saving…" : "Save Notes"}
            </button>
          </Section>

          {/* Section 6 — Rating */}
          <Section title="Rating & Review">
            {order.status === "completed" && order.rating ? (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={18} className={n <= order.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                  ))}
                  <span className="text-sm font-black text-gray-700 ml-1">{order.rating}/5</span>
                </div>
                {order.reviewText && <p className="text-xs text-gray-600 italic">"{order.reviewText}"</p>}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">
                {order.status === "completed" ? "⏳ Awaiting buyer review" : "Review available after order completion"}
              </p>
            )}
          </Section>

          {/* Section 7 — Financial */}
          <Section title="Financial">
            <Row label="Total Amount" value={`$${order.totalPrice || 0} ${order.currency || "USD"}`} />
            <Row label="Refund Status" value={order.refundAmount ? `$${order.refundAmount} on ${order.refundDate}` : "None"} />
            <Row label="Cancellation Reason" value={order.cancellationReason} />
          </Section>
        </div>
      </div>
    </div>
  );
}