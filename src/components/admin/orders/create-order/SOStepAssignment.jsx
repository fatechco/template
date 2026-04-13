import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SOStepAssignment({ buyer, assignment, onChange }) {
  const [franchiseOwners, setFranchiseOwners] = useState([]);

  useEffect(() => {
    base44.entities.User.list().then(users => {
      setFranchiseOwners(users.filter(u => u.role === "franchise_owner"));
    }).catch(() => {});
  }, []);

  const set = (key, val) => onChange(d => ({ ...d, [key]: val }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Assign a franchise owner to handle this service order. You can skip and assign later.
      </p>

      {/* Skip toggle */}
      <label className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
        assignment.skipAssignment ? "border-gray-400 bg-gray-50" : "border-gray-200"
      }`}>
        <input type="checkbox" checked={assignment.skipAssignment}
          onChange={e => set("skipAssignment", e.target.checked)}
          className="accent-gray-600 w-4 h-4" />
        <div>
          <p className="font-bold text-gray-700 text-sm">Skip assignment — assign later</p>
          <p className="text-xs text-gray-400">Order will be created as "pending" until manually assigned</p>
        </div>
      </label>

      {!assignment.skipAssignment && (
        <>
          {/* Franchise Owner */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Franchise Owner</label>
            <select value={assignment.franchiseOwnerId} onChange={e => set("franchiseOwnerId", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Select franchise owner…</option>
              {franchiseOwners.map(u => (
                <option key={u.id} value={u.id}>{u.full_name} — {u.email}</option>
              ))}
            </select>
          </div>

          {/* Commission % */}
          {assignment.franchiseOwnerId && (
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Franchise Commission %</label>
              <input type="number" min="0" max="100" step="0.5"
                value={assignment.commissionPercent ?? 10}
                onChange={e => set("commissionPercent", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          )}

          {/* Info box if none selected */}
          {!assignment.franchiseOwnerId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-xs text-yellow-700 font-semibold">
              💡 Select a franchise owner above, or check "Skip" to assign this order later.
            </div>
          )}
        </>
      )}

      {/* Buyer info summary */}
      {buyer && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
          <p className="font-bold mb-1">Buyer Area Info</p>
          <p className="text-blue-600">{buyer.full_name} · {buyer.email}</p>
        </div>
      )}
    </div>
  );
}