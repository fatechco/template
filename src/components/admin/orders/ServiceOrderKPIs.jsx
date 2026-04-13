import { useMemo } from "react";

export default function ServiceOrderKPIs({ orders }) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedThisMonth = orders.filter(o =>
      o.status === "completed" && o.completedDate && new Date(o.completedDate) >= monthStart
    );
    const revenueThisMonth = completedThisMonth.reduce((s, o) => s + (o.totalPrice || 0), 0);
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      inProgress: orders.filter(o => o.status === "in_progress").length,
      completedCount: completedThisMonth.length,
      revenue: revenueThisMonth,
    };
  }, [orders]);

  const cards = [
    { icon: "📦", label: "Total Orders",           value: stats.total,           color: "text-gray-900",   bg: "bg-gray-50" },
    { icon: "⏳", label: "Pending Assignment",      value: stats.pending,         color: "text-yellow-700", bg: "bg-yellow-50" },
    { icon: "🔄", label: "In Progress",             value: stats.inProgress,      color: "text-orange-600", bg: "bg-orange-50" },
    { icon: "✅", label: "Completed This Month",    value: stats.completedCount,  color: "text-green-600",  bg: "bg-green-50" },
    { icon: "💰", label: "Revenue This Month",      value: `$${stats.revenue.toLocaleString()}`, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
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