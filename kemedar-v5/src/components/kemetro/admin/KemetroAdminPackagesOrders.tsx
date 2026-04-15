"use client";
// @ts-nocheck
import { useState } from "react";
import { Search, CreditCard, CheckCircle, Clock, AlertCircle, XCircle, Calendar, Store } from "lucide-react";

const PLAN_COLORS = {
  Free: "bg-gray-100 text-gray-600",
  Silver: "bg-slate-100 text-slate-600",
  Gold: "bg-yellow-100 text-yellow-700",
  Diamond: "bg-purple-100 text-purple-700",
};

const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Expiring: "bg-yellow-100 text-yellow-700",
  Expired: "bg-red-100 text-red-600",
  Cancelled: "bg-gray-100 text-gray-500",
};

const STATUS_ICONS = {
  Active: CheckCircle,
  Expiring: Clock,
  Expired: AlertCircle,
  Cancelled: XCircle,
};

const MOCK_SUBSCRIPTIONS = [
  { id: "SUB-001", seller: "BuildRight Materials", plan: "Gold", billing: "Monthly", amount: 79, currency: "USD", startDate: "2025-01-01", expiryDate: "2025-04-01", status: "Active", autoRenew: true, paymentMethod: "Credit Card", txId: "TXN-9821" },
  { id: "SUB-002", seller: "Steel Direct", plan: "Diamond", billing: "Yearly", amount: 990, currency: "USD", startDate: "2025-01-15", expiryDate: "2026-01-15", status: "Active", autoRenew: true, paymentMethod: "Bank Transfer", txId: "TXN-9822" },
  { id: "SUB-003", seller: "Tile Experts Co.", plan: "Silver", billing: "Monthly", amount: 29, currency: "USD", startDate: "2025-02-10", expiryDate: "2025-03-20", status: "Expiring", autoRenew: false, paymentMethod: "Credit Card", txId: "TXN-9823" },
  { id: "SUB-004", seller: "Paint Hub", plan: "Gold", billing: "Yearly", amount: 760, currency: "USD", startDate: "2024-03-05", expiryDate: "2025-03-05", status: "Expired", autoRenew: false, paymentMethod: "Credit Card", txId: "TXN-9824" },
  { id: "SUB-005", seller: "Marble World", plan: "Free", billing: "—", amount: 0, currency: "USD", startDate: "2025-03-01", expiryDate: "—", status: "Active", autoRenew: false, paymentMethod: "—", txId: "—" },
  { id: "SUB-006", seller: "ElectroPro", plan: "Diamond", billing: "Monthly", amount: 129, currency: "USD", startDate: "2025-02-01", expiryDate: "2025-04-01", status: "Active", autoRenew: true, paymentMethod: "Credit Card", txId: "TXN-9826" },
  { id: "SUB-007", seller: "SandStone Supplies", plan: "Silver", billing: "Monthly", amount: 29, currency: "USD", startDate: "2025-01-20", expiryDate: "2025-02-20", status: "Cancelled", autoRenew: false, paymentMethod: "Credit Card", txId: "TXN-9827" },
  { id: "SUB-008", seller: "Plumb Masters", plan: "Gold", billing: "Monthly", amount: 79, currency: "USD", startDate: "2025-03-01", expiryDate: "2025-04-01", status: "Active", autoRenew: true, paymentMethod: "Bank Transfer", txId: "TXN-9828" },
];

const FILTERS = ["All", "Active", "Expiring", "Expired", "Cancelled"];
const PLANS = ["All Plans", "Free", "Silver", "Gold", "Diamond"];

function daysUntil(dateStr) {
  if (dateStr === "—") return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function KemetroAdminPackagesOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All Plans");

  const filtered = MOCK_SUBSCRIPTIONS.filter((s) => {
    const matchSearch = s.seller.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchPlan = planFilter === "All Plans" || s.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const totalRevenue = MOCK_SUBSCRIPTIONS.filter((s) => s.status !== "Cancelled").reduce((sum, s) => sum + s.amount, 0);

  const stats = [
    { label: "Total Subscribers", value: MOCK_SUBSCRIPTIONS.length, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Active", value: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "Active").length, color: "text-green-700", bg: "bg-green-50" },
    { label: "Expiring Soon", value: MOCK_SUBSCRIPTIONS.filter((s) => s.status === "Expiring").length, color: "text-yellow-700", bg: "bg-yellow-50" },
    { label: "MRR", value: `$${totalRevenue.toLocaleString()}`, color: "text-purple-700", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Packages & Services Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor seller subscriptions, payment status, validity, and expiry</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border border-gray-200 p-4 ${s.bg}`}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-black text-gray-900 mb-4 text-sm">Plan Distribution</h2>
        <div className="grid grid-cols-4 gap-3">
          {["Free", "Silver", "Gold", "Diamond"].map((plan) => {
            const count = MOCK_SUBSCRIPTIONS.filter((s) => s.plan === plan).length;
            const pct = Math.round((count / MOCK_SUBSCRIPTIONS.length) * 100);
            return (
              <div key={plan} className="text-center">
                <div className={`inline-block text-xs font-black px-3 py-1 rounded-full mb-2 ${PLAN_COLORS[plan]}`}>{plan}</div>
                <p className="text-2xl font-black text-gray-900">{count}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search seller or ID…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${statusFilter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f}</button>
          ))}
        </div>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
          {PLANS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["ID", "Seller", "Plan", "Billing", "Amount", "Start Date", "Expiry Date", "Days Left", "Status", "Auto-Renew", "Payment", "Tx ID"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => {
                const days = daysUntil(sub.expiryDate);
                const StatusIcon = STATUS_ICONS[sub.status];
                return (
                  <tr key={sub.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{sub.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Store size={13} className="text-gray-400" />
                        <span className="font-semibold text-gray-900 whitespace-nowrap">{sub.seller}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full ${PLAN_COLORS[sub.plan]}`}>{sub.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{sub.billing}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{sub.amount === 0 ? "Free" : `$${sub.amount}`}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{sub.startDate}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{sub.expiryDate}</td>
                    <td className="px-4 py-3">
                      {days === null ? <span className="text-gray-400 text-xs">—</span>
                        : days < 0 ? <span className="text-red-500 font-bold text-xs">Expired</span>
                        : days <= 7 ? <span className="text-yellow-600 font-bold text-xs">{days}d ⚠️</span>
                        : <span className="text-gray-700 font-semibold text-xs">{days}d</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${STATUS_COLORS[sub.status]}`}>
                        <StatusIcon size={11} /> {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold ${sub.autoRenew ? "text-green-600" : "text-gray-400"}`}>{sub.autoRenew ? "✓ Yes" : "✗ No"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <CreditCard size={11} />
                        <span className="whitespace-nowrap">{sub.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{sub.txId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}