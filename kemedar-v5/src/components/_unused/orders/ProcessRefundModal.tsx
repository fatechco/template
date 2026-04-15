"use client";
// @ts-nocheck
import { useState } from "react";
import { X, RefreshCcw } from "lucide-react";

const REFUND_REASONS = [
  "Service not delivered",
  "Poor quality",
  "Buyer request",
  "Duplicate order",
  "Other",
];

export default function ProcessRefundModal({ order, onConfirm, onClose }) {
  const [refundType, setRefundType] = useState("full");
  const [partialAmt, setPartialAmt] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!reason) return;
    if (refundType === "partial" && !partialAmt) return;
    setSaving(true);
    await onConfirm(refundType, Number(partialAmt), reason, notes);
    setSaving(false);
  };

  const refundAmount = refundType === "full" ? (order.totalPrice || 0) : (Number(partialAmt) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <RefreshCcw size={18} className="text-red-500" /> Process Refund
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Order Info */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-1">
            <p className="text-xs font-bold text-gray-600">Order: <span className="font-mono">{order.orderCode || order.id.slice(-8).toUpperCase()}</span></p>
            <p className="text-xs text-gray-600">Original Amount: <strong className="text-red-700">${order.totalPrice || 0}</strong></p>
          </div>

          {/* Refund Type */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Refund Type</label>
            <div className="flex gap-3">
              {[
                { value: "full", label: "Full Refund" },
                { value: "partial", label: "Partial Refund" },
              ].map(opt => (
                <label key={opt.value} className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer text-sm transition-colors ${
                  refundType === opt.value ? "border-red-400 bg-red-50 text-red-800 font-semibold" : "border-gray-200 text-gray-600"
                }`}>
                  <input type="radio" name="refundType" value={opt.value} checked={refundType === opt.value}
                    onChange={() => setRefundType(opt.value)} className="accent-red-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Partial Amount */}
          {refundType === "partial" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Partial Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-bold">$</span>
                <input type="number" min="0" max={order.totalPrice} step="0.01"
                  value={partialAmt} onChange={e => setPartialAmt(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400" />
              </div>
              {partialAmt && Number(partialAmt) > (order.totalPrice || 0) && (
                <p className="text-xs text-red-500 mt-1">Cannot exceed original amount of ${order.totalPrice}</p>
              )}
            </div>
          )}

          {/* Refund Summary */}
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Refund Amount</span>
            <span className="text-xl font-black text-red-600">${refundAmount.toFixed(2)}</span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Reason *</label>
            <select value={reason} onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400">
              <option value="">Select a reason…</option>
              {REFUND_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Any additional details…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleConfirm}
              disabled={!reason || (refundType === "partial" && !partialAmt) || saving}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {saving ? "Processing…" : "Process Refund"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}