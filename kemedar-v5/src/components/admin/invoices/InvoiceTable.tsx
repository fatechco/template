// @ts-nocheck
import { RefreshCw, Eye, CheckCircle, Mail, Download, Ban } from "lucide-react";

const STATUS_CONFIG = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600" },
  sent:      { label: "Sent",      color: "bg-blue-100 text-blue-700" },
  paid:      { label: "Paid",      color: "bg-green-100 text-green-700" },
  overdue:   { label: "Overdue",   color: "bg-red-100 text-red-600" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-400" },
  refunded:  { label: "Refunded",  color: "bg-orange-100 text-orange-700" },
};

const TYPE_CONFIG = {
  subscription:  { label: "Subscription",  color: "bg-purple-100 text-purple-700" },
  service_order: { label: "Service Order", color: "bg-orange-100 text-orange-700" },
  franchise_fee: { label: "Franchise Fee", color: "bg-teal-100 text-teal-700" },
  advertising:   { label: "Advertising",   color: "bg-blue-100 text-blue-700" },
};

export default function InvoiceTable({ invoices, loading, onView, onMarkPaid, onVoid }) {
  if (loading) return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-20 text-center text-gray-400">
      <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
      <p className="text-sm font-semibold">Loading invoices…</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Invoice #","User","Type","Related To","Amount","Status","Due Date","Paid Date","Actions"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.length === 0 && (
              <tr><td colSpan={9} className="py-16 text-center text-gray-400">
                <p className="text-2xl mb-2">🧾</p>
                <p className="font-semibold">No invoices found</p>
              </td></tr>
            )}
            {invoices.map(inv => {
              const statusCfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft;
              const typeCfg = TYPE_CONFIG[inv.invoiceType] || { label: inv.invoiceType, color: "bg-gray-100 text-gray-600" };
              return (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-mono text-[10px] font-black text-gray-700">{inv.invoiceNumber || inv.id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                        {(inv.userId || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-gray-600 font-mono text-[10px] max-w-[80px] truncate">{inv.userId?.slice(0, 8)}…</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCfg.color}`}>{typeCfg.label}</span>
                  </td>
                  <td className="px-3 py-3 font-mono text-[10px] text-gray-500">
                    {inv.subscriptionId?.slice(-6) || inv.serviceOrderId?.slice(-6) || "—"}
                  </td>
                  <td className="px-3 py-3 font-black text-gray-900">${(inv.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{inv.dueDate || "—"}</td>
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{inv.paidDate || "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => onView(inv)} title="View Invoice"
                        className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                      {inv.status !== "paid" && inv.status !== "cancelled" && (
                        <button onClick={() => onMarkPaid(inv.id)} title="Mark as Paid"
                          className="p-1.5 hover:bg-green-50 text-green-500 rounded"><CheckCircle size={13} /></button>
                      )}
                      <button title="Send Reminder"
                        className="p-1.5 hover:bg-gray-100 text-gray-400 rounded"><Mail size={13} /></button>
                      <button title="Download PDF"
                        className="p-1.5 hover:bg-gray-100 text-gray-400 rounded"><Download size={13} /></button>
                      {inv.status !== "cancelled" && inv.status !== "paid" && (
                        <button onClick={() => onVoid(inv.id)} title="Void"
                          className="p-1.5 hover:bg-red-50 text-red-400 rounded"><Ban size={13} /></button>
                      )}
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