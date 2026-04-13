import { RefreshCw, Eye, Edit, ArrowUpDown, PauseCircle, RefreshCcw, XCircle, Mail } from "lucide-react";

const STATUS_CONFIG = {
  active:          { label: "Active",          color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  expired:         { label: "Expired",         color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
  cancelled:       { label: "Cancelled",       color: "bg-gray-100 text-gray-600",     dot: "bg-gray-400" },
  suspended:       { label: "Suspended",       color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  trial:           { label: "Trial",           color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  pending_payment: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠", color: "bg-orange-100 text-orange-700" },
  kemework: { icon: "🔧", color: "bg-teal-100 text-teal-700" },
  kemetro:  { icon: "🛒", color: "bg-blue-100 text-blue-700" },
};

function Avatar({ text }) {
  return (
    <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
      {(text || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function SubscriberTable({
  subscriptions, plans, modules, loading,
  selectedIds, onSelectIds,
  onView, onUpgrade, onCancel, onSuspend, onRenew
}) {
  const planById = Object.fromEntries(plans.map(p => [p.id, p]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const toggleSelect = (id) => onSelectIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleAll = () => onSelectIds(
    selectedIds.length === subscriptions.length ? [] : subscriptions.map(s => s.id)
  );

  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center text-gray-400">
      <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
      <p className="text-sm font-semibold">Loading subscriptions…</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-3 py-3 w-8">
                <input type="checkbox"
                  checked={selectedIds.length === subscriptions.length && subscriptions.length > 0}
                  onChange={toggleAll} className="w-3.5 h-3.5 accent-orange-500" />
              </th>
              {["Sub Code","User","Module","Plan","Price/mo","Status","Start","End","Auto-Renew","Franchise Owner","Total Paid","Actions"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.length === 0 && (
              <tr><td colSpan={13} className="py-16 text-center text-gray-400">
                <p className="text-2xl mb-2">💎</p>
                <p className="font-semibold">No subscriptions found</p>
              </td></tr>
            )}
            {subscriptions.map(sub => {
              const plan = planById[sub.planId];
              const mod = moduleById[sub.moduleId];
              const modMeta = MODULE_META[mod?.slug] || { icon: "📦", color: "bg-gray-100 text-gray-600" };
              const statusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending_payment;
              return (
                <tr key={sub.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(sub.id) ? "bg-orange-50" : ""}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIds.includes(sub.id)}
                      onChange={() => toggleSelect(sub.id)} className="w-3.5 h-3.5 accent-orange-500" />
                  </td>
                  {/* Sub Code */}
                  <td className="px-3 py-3">
                    <span className="font-mono text-[10px] font-bold text-gray-700">{sub.subscriptionCode || sub.id.slice(-6).toUpperCase()}</span>
                  </td>
                  {/* User */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar text={sub.userId} />
                      <span className="text-gray-600 font-mono text-[10px] max-w-[100px] truncate">{sub.userId?.slice(0,8)}…</span>
                    </div>
                  </td>
                  {/* Module */}
                  <td className="px-3 py-3">
                    <span className={`text-base`} title={mod?.name}>{modMeta.icon}</span>
                  </td>
                  {/* Plan */}
                  <td className="px-3 py-3 font-bold text-gray-800">{plan?.name || "—"}</td>
                  {/* Price */}
                  <td className="px-3 py-3 font-black text-gray-900">
                    {plan?.priceUSD === 0 ? <span className="text-green-600">Free</span> : plan?.priceUSD ? `$${plan.priceUSD}` : "—"}
                  </td>
                  {/* Status */}
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </td>
                  {/* Start */}
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{sub.startDate || "—"}</td>
                  {/* End */}
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{sub.endDate || "—"}</td>
                  {/* Auto-Renew */}
                  <td className="px-3 py-3 text-center">
                    {sub.autoRenew ? "✅" : "❌"}
                  </td>
                  {/* Franchise Owner */}
                  <td className="px-3 py-3 text-gray-500 text-[10px]">
                    {sub.franchiseOwnerId ? <span className="font-mono">{sub.franchiseOwnerId.slice(-6)}</span> : <span className="text-gray-300">—</span>}
                  </td>
                  {/* Total Paid */}
                  <td className="px-3 py-3 font-bold text-gray-800">
                    ${(sub.totalPaid || 0).toFixed(0)}
                  </td>
                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => onView(sub)} title="View Details"
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                      <button onClick={() => onUpgrade(sub)} title="Upgrade/Downgrade"
                        className="p-1.5 hover:bg-purple-50 text-purple-500 rounded"><ArrowUpDown size={13} /></button>
                      {sub.status === "active"
                        ? <button onClick={() => onSuspend(sub.id)} title="Suspend"
                            className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded"><PauseCircle size={13} /></button>
                        : <button onClick={() => onRenew(sub.id)} title="Renew/Reactivate"
                            className="p-1.5 hover:bg-green-50 text-green-500 rounded"><RefreshCcw size={13} /></button>
                      }
                      <button onClick={() => onCancel(sub)} title="Cancel"
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded"><XCircle size={13} /></button>
                      <button title="Send Reminder Email"
                        className="p-1.5 hover:bg-gray-100 text-gray-400 rounded"><Mail size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}