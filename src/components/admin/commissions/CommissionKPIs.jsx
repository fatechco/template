import { useMemo } from "react";

export default function CommissionKPIs({ commissions }) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const total = commissions.reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const pending = commissions.filter(c => c.status === "pending").reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const paidThisMonth = commissions
      .filter(c => c.status === "paid" && c.paidDate && new Date(c.paidDate) >= monthStart)
      .reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const earners = new Set(commissions.filter(c => c.status !== "disputed").map(c => c.franchiseOwnerId)).size;
    return { total, pending, paidThisMonth, earners };
  }, [commissions]);

  const cards = [
    { icon: "💸", label: "Total Commissions",      value: `$${stats.total.toLocaleString()}`,         color: "text-gray-900",   bg: "bg-gray-50" },
    { icon: "⏳", label: "Pending Payout",          value: `$${stats.pending.toLocaleString()}`,       color: "text-yellow-700", bg: "bg-yellow-50" },
    { icon: "✅", label: "Paid This Month",         value: `$${stats.paidThisMonth.toLocaleString()}`, color: "text-green-600",  bg: "bg-green-50" },
    { icon: "👤", label: "Active Franchise Earners",value: stats.earners,                              color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-4 border border-white shadow-sm`}>
          <div className="text-2xl mb-1">{c.icon}</div>
          <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
          <p className="text-xs text-gray-500 font-semibold mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}