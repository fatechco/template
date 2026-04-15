"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { CheckCircle, Loader } from "lucide-react";

const CYCLE_MONTHS = {
  monthly: 1, quarterly: 3, semi_annual: 6, annual: 12, lifetime: 120, one_time: 0,
};

function calcEndDate(startDate, billingCycle) {
  if (!startDate) return "—";
  const d = new Date(startDate);
  const months = CYCLE_MONTHS[billingCycle] || 1;
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function calcNextBilling(startDate, billingCycle) {
  if (!startDate) return "—";
  const d = new Date(startDate);
  const months = CYCLE_MONTHS[billingCycle] || 1;
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

const PAYMENT_LABELS = {
  credit_card: "Credit Card", bank_transfer: "Bank Transfer",
  wallet: "Wallet", cash: "Cash", free: "Free / Manual",
};

export default function StepReview({ selectedUser, selectedModule, selectedPlan, details, onCreated, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const endDate = calcEndDate(details.startDate, details.billingCycle);
  const nextBilling = calcNextBilling(details.startDate, details.billingCycle);
  const invoiceAmount = details.billingCycle === "annual"
    ? (selectedPlan?.priceUSD || 0) * 12
    : details.billingCycle === "quarterly"
      ? (selectedPlan?.priceUSD || 0) * 3
      : details.billingCycle === "semi_annual"
        ? (selectedPlan?.priceUSD || 0) * 6
        : (selectedPlan?.priceUSD || 0);
  const commissionAmount = details.franchiseOwnerId
    ? ((invoiceAmount * (details.franchiseCommissionPercent || 0)) / 100)
    : 0;

  const generateCode = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    const subCode = generateCode("SUB");
    const invCode = generateCode("INV");

    // 1. Create Subscription
    const sub = await apiClient.post("/api/v1/subscription", {
      subscriptionCode: subCode,
      userId: selectedUser.id,
      planId: selectedPlan.id,
      moduleId: selectedModule.id,
      status: "active",
      startDate: details.startDate,
      endDate,
      nextBillingDate: nextBilling,
      autoRenew: details.autoRenew,
      paymentMethod: details.paymentMethod,
      lastPaymentDate: details.startDate,
      lastPaymentAmount: invoiceAmount,
      totalPaid: invoiceAmount,
      franchiseOwnerId: details.franchiseOwnerId || null,
      franchiseCommissionPercent: details.franchiseOwnerId ? details.franchiseCommissionPercent : null,
      franchiseCommissionTotal: commissionAmount,
      notes: details.notes,
    });

    // 2. Create Invoice
    const today = new Date().toISOString().slice(0, 10);
    await apiClient.post("/api/v1/invoice", {
      invoiceNumber: invCode,
      userId: selectedUser.id,
      invoiceType: "subscription",
      subscriptionId: sub.id,
      subtotal: invoiceAmount,
      tax: 0,
      discount: 0,
      totalAmount: invoiceAmount,
      currency: "USD",
      status: details.paymentMethod === "free" ? "paid" : "paid",
      dueDate: today,
      paidDate: today,
      paymentMethod: details.paymentMethod,
    });

    // 3. Activity log
    await apiClient.post("/api/v1/subscriptionactivity", {
      subscriptionId: sub.id,
      action: "created",
      description: `Subscription created by admin. Plan: ${selectedPlan.name}. Payment: ${details.paymentMethod}.`,
    });

    // 4. Franchise Commission (if applicable)
    if (details.franchiseOwnerId && commissionAmount > 0) {
      await apiClient.post("/api/v1/franchisecommission", {
        franchiseOwnerId: details.franchiseOwnerId,
        sourceType: "subscription",
        subscriptionId: sub.id,
        grossAmount: invoiceAmount,
        commissionPercent: details.franchiseCommissionPercent,
        commissionAmount,
        status: "pending",
        periodStart: details.startDate,
        periodEnd: endDate,
      });
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => { onCreated(); onClose(); }, 1500);
  };

  if (success) {
    return (
      <div className="py-12 text-center space-y-3">
        <CheckCircle size={48} className="text-green-500 mx-auto" />
        <h3 className="text-xl font-black text-gray-900">Subscription Created!</h3>
        <p className="text-sm text-gray-500">Invoice and activity log created automatically.</p>
      </div>
    );
  }

  const rows = [
    { label: "User", value: `${selectedUser.full_name} (${selectedUser.email})` },
    { label: "Module", value: selectedModule.name },
    { label: "Plan", value: `${selectedPlan.name} — $${selectedPlan.priceUSD}/mo` },
    { label: "Billing Cycle", value: details.billingCycle },
    { label: "Start Date", value: details.startDate },
    { label: "End Date", value: endDate },
    { label: "Next Billing", value: nextBilling },
    { label: "Auto-Renew", value: details.autoRenew ? "Yes" : "No" },
    { label: "Payment Method", value: PAYMENT_LABELS[details.paymentMethod] || details.paymentMethod },
    { label: "Invoice Amount", value: <span className="font-black text-orange-600">${invoiceAmount.toFixed(2)} USD</span> },
    ...(details.franchiseOwnerId ? [
      { label: "Commission %", value: `${details.franchiseCommissionPercent}%` },
      { label: "Commission Amount", value: <span className="font-bold text-purple-600">${commissionAmount.toFixed(2)}</span> },
    ] : []),
    ...(details.notes ? [{ label: "Admin Notes", value: details.notes }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start px-4 py-2.5 text-xs">
            <span className="text-gray-500 font-semibold">{label}</span>
            <span className="font-bold text-gray-800 text-right max-w-[60%]">{value}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 font-semibold">{error}</div>
      )}

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleCreate} disabled={loading}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
          {loading ? <><Loader size={14} className="animate-spin" /> Creating…</> : "✅ Create Subscription"}
        </button>
      </div>
    </div>
  );
}