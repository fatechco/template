import { X, Download, Send } from "lucide-react";

const STATUS_CONFIG = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600" },
  sent:      { label: "Sent",      color: "bg-blue-100 text-blue-700" },
  paid:      { label: "Paid",      color: "bg-green-100 text-green-700" },
  overdue:   { label: "Overdue",   color: "bg-red-100 text-red-600" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-400" },
  refunded:  { label: "Refunded",  color: "bg-orange-100 text-orange-700" },
};

const TYPE_LABEL = {
  subscription:  "Subscription Plan",
  service_order: "Service Order",
  franchise_fee: "Franchise Fee",
  advertising:   "Advertising",
};

export default function InvoiceViewModal({ invoice: inv, onClose }) {
  const statusCfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft;
  const invoiceNum = inv.invoiceNumber || inv.id.slice(-8).toUpperCase();
  const issueDate = inv.created_date ? new Date(inv.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const dueDate = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-700">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
              <Download size={12} /> Download PDF
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50">
              <Send size={12} /> Send Email
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 ml-2"><X size={18} /></button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">K</span>
                </div>
                <span className="font-black text-xl text-gray-900">Kemedar</span>
              </div>
              <p className="text-xs text-gray-500">kemedar.com</p>
              <p className="text-xs text-gray-500">Cairo, Egypt</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gray-900">INVOICE</p>
              <p className="text-sm font-mono font-bold text-orange-600">{invoiceNum}</p>
              <div className="mt-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
              </div>
            </div>
          </div>

          {/* Dates + Bill To */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <p className="font-bold text-gray-800 text-sm">User ID: {inv.userId}</p>
                <p className="text-xs text-gray-500">Type: {TYPE_LABEL[inv.invoiceType] || inv.invoiceType}</p>
                {inv.paymentMethod && <p className="text-xs text-gray-500">Payment: {inv.paymentMethod}</p>}
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Issue Date:</span>
                <span className="font-bold text-gray-800">{issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Due Date:</span>
                <span className="font-bold text-gray-800">{dueDate}</span>
              </div>
              {inv.paidDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Paid Date:</span>
                  <span className="font-bold text-green-600">{inv.paidDate}</span>
                </div>
              )}
              {inv.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Reference:</span>
                  <span className="font-mono text-gray-700">{inv.paymentReference}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-2.5 text-left font-bold rounded-l-lg">Description</th>
                  <th className="px-4 py-2.5 text-center font-bold">Qty</th>
                  <th className="px-4 py-2.5 text-right font-bold">Unit Price</th>
                  <th className="px-4 py-2.5 text-right font-bold rounded-r-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-800 font-semibold">
                    {TYPE_LABEL[inv.invoiceType] || inv.invoiceType}
                    {inv.subscriptionId && <span className="ml-2 text-[10px] text-gray-400 font-mono">SUB-{inv.subscriptionId.slice(-6)}</span>}
                    {inv.serviceOrderId && <span className="ml-2 text-[10px] text-gray-400 font-mono">SVO-{inv.serviceOrderId.slice(-6)}</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">1</td>
                  <td className="px-4 py-3 text-right text-gray-600">${(inv.subtotal || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">${(inv.subtotal || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-56 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">${(inv.subtotal || 0).toFixed(2)}</span>
              </div>
              {(inv.discount || 0) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-bold">-${(inv.discount || 0).toFixed(2)}</span>
                </div>
              )}
              {(inv.tax || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-bold text-gray-800">${(inv.tax || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-black text-gray-900 text-sm">Total</span>
                <span className="font-black text-orange-600 text-sm">${(inv.totalAmount || 0).toFixed(2)} {inv.currency || "USD"}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {inv.notes && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Notes</p>
              <p className="text-xs text-gray-600">{inv.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 pt-4 text-center">
            <p className="text-[10px] text-gray-400">Thank you for your business — Kemedar Platform · kemedar.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}