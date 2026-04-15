"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

const BILLING_CYCLES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly (3 months)" },
  { value: "semi_annual", label: "Semi-Annual (6 months)" },
  { value: "annual", label: "Annual (12 months)" },
  { value: "lifetime", label: "Lifetime" },
];

const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "wallet", label: "Wallet" },
  { value: "cash", label: "Cash" },
  { value: "free", label: "Free / Manual" },
];

export default function StepDetails({ details, onChange, selectedPlan }) {
  const [franchiseOwners, setFranchiseOwners] = useState([]);

  useEffect(() => {
    apiClient.list("/api/v1/user").then(users => {
      setFranchiseOwners(users.filter(u => u.role === "franchise_owner"));
    }).catch(() => {});
  }, []);

  const set = (key, val) => onChange(d => ({ ...d, [key]: val }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Start Date *</label>
          <input type="date" value={details.startDate}
            onChange={e => set("startDate", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>

        {/* Billing Cycle */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Billing Cycle *</label>
          <select value={details.billingCycle} onChange={e => set("billingCycle", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
            {BILLING_CYCLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Payment Method *</label>
          <select value={details.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
            {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        {/* Auto Renew */}
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Auto-Renew</label>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => set("autoRenew", !details.autoRenew)}
              className={`relative w-12 h-6 rounded-full transition-colors ${details.autoRenew ? "bg-orange-500" : "bg-gray-200"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${details.autoRenew ? "left-7" : "left-1"}`} />
            </button>
            <span className="text-sm font-semibold text-gray-700">{details.autoRenew ? "On" : "Off"}</span>
          </div>
        </div>
      </div>

      {/* Franchise Owner */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Franchise Owner (optional)</label>
        <select value={details.franchiseOwnerId} onChange={e => set("franchiseOwnerId", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
          <option value="">None / Direct</option>
          {franchiseOwners.map(u => (
            <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
          ))}
        </select>
      </div>

      {/* Commission % */}
      {details.franchiseOwnerId && (
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Franchise Commission %</label>
          <input type="number" min="0" max="100" step="0.5"
            value={details.franchiseCommissionPercent}
            onChange={e => set("franchiseCommissionPercent", Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      )}

      {/* Admin Notes */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Admin Notes</label>
        <textarea value={details.notes} onChange={e => set("notes", e.target.value)}
          placeholder="Internal notes about this subscription…"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>
    </div>
  );
}