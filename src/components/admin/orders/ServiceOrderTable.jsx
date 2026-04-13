import { RefreshCw, Eye, UserCheck, CheckCircle, XCircle, RefreshCcw, Mail } from "lucide-react";

const STATUS_CONFIG = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-500" },
  confirmed:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700",      dot: "bg-blue-500" },
  assigned:    { label: "Assigned",    color: "bg-purple-100 text-purple-700",  dot: "bg-purple-500" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700",  dot: "bg-orange-500" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700",    dot: "bg-green-500" },
  cancelled:   { label: "Cancelled",   color: "bg-gray-100 text-gray-500",      dot: "bg-gray-400" },
  refunded:    { label: "Refunded",    color: "bg-red-100 text-red-600",        dot: "bg-red-500" },
  on_hold:     { label: "On Hold",     color: "bg-gray-100 text-gray-600",      dot: "bg-gray-400" },
};

const MODULE_META = {
  kemedar:  { icon: "🏠" },
  kemework: { icon: "🔧" },
  kemetro:  { icon: "🛒" },
};

export default function ServiceOrderTable({ orders, services, modules, loading, onView, onAssign, onComplete, onCancel, onRefund }) {
  const serviceById = Object.fromEntries(services.map(s => [s.id, s]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center text-gray-400">
      <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
      <p className="text-sm font-semibold">Loading orders…</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Order Code","Buyer","Service","Module","Tier","Qty","Total","Status","Franchise Owner","Related","Created","Actions"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 && (
              <tr><td colSpan={12} className="py-16 text-center text-gray-400">
                <p className="text-2xl mb-2">📦</p>
                <p className="font-semibold">No orders found</p>
              </td></tr>
            )}
            {orders.map(o => {
              const svc = serviceById[o.serviceId];
              const mod = moduleById[o.moduleId];
              const modMeta = MODULE_META[mod?.slug] || { icon: "📦" };
              const statusCfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.pending;
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  {/* Order Code */}
                  <td className="px-3 py-3">
                    <span className="font-mono text-[10px] font-black text-gray-700">
                      {o.orderCode || o.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  {/* Buyer */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {(o.buyerId || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-gray-600 text-[10px] font-mono max-w-[80px] truncate">{o.buyerId?.slice(0, 8)}…</span>
                    </div>
                  </td>
                  {/* Service */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span>{svc?.icon}</span>
                      <span className="font-semibold text-gray-800 max-w-[120px] truncate">{svc?.name || "—"}</span>
                    </div>
                  </td>
                  {/* Module */}
                  <td className="px-3 py-3 text-center text-base" title={mod?.name}>{modMeta.icon}</td>
                  {/* Tier */}
                  <td className="px-3 py-3 text-gray-500 max-w-[100px] truncate">{o.pricingTierLabel || "—"}</td>
                  {/* Qty */}
                  <td className="px-3 py-3 text-center font-bold text-gray-700">{o.quantity || 1}</td>
                  {/* Total */}
                  <td className="px-3 py-3 font-black text-gray-900">${o.totalPrice || 0}</td>
                  {/* Status */}
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>
                  </td>
                  {/* Franchise Owner */}
                  <td className="px-3 py-3 text-gray-500 text-[10px]">
                    {o.franchiseOwnerId
                      ? <span className="font-mono">{o.franchiseOwnerId.slice(-6)}</span>
                      : <span className="text-red-400 font-bold">Unassigned</span>}
                  </td>
                  {/* Related */}
                  <td className="px-3 py-3 text-gray-400 text-[10px]">
                    {o.relatedEntityType ? (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded font-bold capitalize">{o.relatedEntityType}</span>
                    ) : "—"}
                  </td>
                  {/* Created */}
                  <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                    {o.created_date ? new Date(o.created_date).toLocaleDateString() : "—"}
                  </td>
                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => onView(o)} title="View Details"
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                      <button onClick={() => onAssign(o)} title="Assign Franchise Owner"
                        className="p-1.5 hover:bg-purple-50 text-purple-500 rounded"><UserCheck size={13} /></button>
                      {!["completed","cancelled","refunded"].includes(o.status) && (
                        <button onClick={() => onComplete(o.id)} title="Mark Completed"
                          className="p-1.5 hover:bg-green-50 text-green-500 rounded"><CheckCircle size={13} /></button>
                      )}
                      {!["cancelled","refunded"].includes(o.status) && (
                        <button onClick={() => onCancel(o.id)} title="Cancel"
                          className="p-1.5 hover:bg-gray-100 text-gray-400 rounded"><XCircle size={13} /></button>
                      )}
                      {["completed"].includes(o.status) && (
                        <button onClick={() => onRefund(o)} title="Process Refund"
                          className="p-1.5 hover:bg-red-50 text-red-400 rounded"><RefreshCcw size={13} /></button>
                      )}
                      <button title="Notify Buyer"
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