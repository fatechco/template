import { useState, useEffect } from "react";
import { X, UserCheck, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AssignFranchiseModal({ order, service, onConfirm, onClose }) {
  const [franchiseOwners, setFranchiseOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(order.franchiseOwnerId || "");
  const [commissionPct, setCommissionPct] = useState(15);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load users with franchise_owner role
    base44.entities.User.list()
      .then(users => {
        setFranchiseOwners(users.filter(u => u.role === "franchise_owner" || (u.primaryRole === "franchise_owner")));
        setLoading(false);
      })
      .catch(() => { setFranchiseOwners([]); setLoading(false); });
  }, []);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSaving(true);
    await onConfirm(selectedId, commissionPct);
    setSaving(false);
  };

  const selected = franchiseOwners.find(f => f.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <UserCheck size={18} className="text-purple-500" /> Assign Service Order
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-bold text-gray-500 mb-1">Order</p>
            <p className="font-black text-gray-900">{order.orderCode || order.id.slice(-8).toUpperCase()}</p>
            {service && <p className="text-xs text-gray-500">{service.icon} {service.name}</p>}
            <p className="text-xs text-gray-400 mt-1">Total: <strong>${order.totalPrice || 0}</strong></p>
          </div>

          {/* Franchise Owners */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Available Franchise Owners</p>
            {loading ? (
              <p className="text-xs text-gray-400 italic">Loading…</p>
            ) : franchiseOwners.length === 0 ? (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-700 font-semibold">No franchise owners found. You can still manually enter an ID below.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {franchiseOwners.map(fo => (
                  <button key={fo.id} onClick={() => setSelectedId(fo.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-colors ${
                      selectedId === fo.id ? "border-purple-400 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      {(fo.full_name || fo.email || "FO").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{fo.full_name || fo.email}</p>
                      <p className="text-[10px] text-gray-400 truncate">{fo.email}</p>
                    </div>
                    {selectedId === fo.id && (
                      <span className="text-purple-600 font-black text-xs flex-shrink-0">Selected ✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual override if no list */}
          {franchiseOwners.length === 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Franchise Owner ID</label>
              <input value={selectedId} onChange={e => setSelectedId(e.target.value)}
                placeholder="Enter franchise owner user ID…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
            </div>
          )}

          {/* Commission */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Commission % <span className="font-normal text-gray-400 normal-case">(auto-filled from defaults)</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="number" min="0" max="100" value={commissionPct} onChange={e => setCommissionPct(Number(e.target.value))}
                className="w-24 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 text-center" />
              <span className="text-sm text-gray-600">%</span>
              {order.totalPrice && (
                <span className="text-xs text-gray-500">
                  = <strong className="text-purple-600">${((order.totalPrice * commissionPct) / 100).toFixed(2)}</strong> commission
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleConfirm} disabled={!selectedId || saving}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {saving ? "Assigning…" : "Confirm Assignment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}