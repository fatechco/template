import { useState } from "react";
import { X, XCircle } from "lucide-react";

const CANCEL_REASONS = [
  "Too expensive",
  "Found alternative",
  "Not using",
  "Closing business",
  "Other",
];

export default function CancelModal({ subscription, plan, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [effective, setEffective] = useState("end_of_period");
  const [refund, setRefund] = useState("none");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!reason) return;
    setSaving(true);
    await onConfirm(reason, notes, effective, refund);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <XCircle size={18} className="text-red-500" /> Cancel Subscription
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Current plan info */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <p className="text-xs text-red-600 font-semibold">Cancelling: <strong>{plan?.name || "—"}</strong> — ${plan?.priceUSD || 0}/mo</p>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Cancellation Reason *</label>
            <select value={reason} onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400">
              <option value="">Select a reason…</option>
              {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Additional Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Any additional details…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Effective Date</label>
            <div className="flex gap-3">
              {[
                { value: "immediately", label: "Immediately" },
                { value: "end_of_period", label: "End of Period" },
              ].map(opt => (
                <label key={opt.value} className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer text-sm transition-colors ${
                  effective === opt.value ? "border-red-400 bg-red-50 text-red-800 font-semibold" : "border-gray-200 text-gray-600"
                }`}>
                  <input type="radio" name="effective" value={opt.value} checked={effective === opt.value}
                    onChange={() => setEffective(opt.value)} className="accent-red-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Refund */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Refund</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "none", label: "None" },
                { value: "prorated", label: "Prorated" },
                { value: "full", label: "Full" },
              ].map(opt => (
                <label key={opt.value} className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border-2 cursor-pointer text-xs font-bold transition-colors ${
                  refund === opt.value ? "border-red-400 bg-red-50 text-red-800" : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                  <input type="radio" name="refund" value={opt.value} checked={refund === opt.value}
                    onChange={() => setRefund(opt.value)} className="accent-red-500" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Keep Subscription
            </button>
            <button onClick={handleConfirm} disabled={!reason || saving}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {saving ? "Cancelling…" : "Confirm Cancellation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}