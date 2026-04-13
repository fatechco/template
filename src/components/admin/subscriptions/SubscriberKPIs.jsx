import { useMemo } from "react";

export default function SubscriberKPIs({ subscriptions, plans }) {
  const planById = Object.fromEntries(plans.map(p => [p.id, p]));

  const stats = useMemo(() => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const active = subscriptions.filter(s => s.status === "active");
    const mrr = active.reduce((sum, s) => {
      const plan = planById[s.planId];
      return sum + (plan?.priceUSD || 0);
    }, 0);
    const expiring = active.filter(s => {
      const end = new Date(s.endDate);
      return end >= now && end <= in7Days;
    }).length;
    const cancelledThisMonth = subscriptions.filter(s =>
      s.status === "cancelled" && s.cancellationDate && new Date(s.cancellationDate) >= thisMonthStart
    ).length;

    return { active: active.length, mrr, expiring, cancelledThisMonth };
  }, [subscriptions, plans]);

  const cards = [
    { icon: "💎", label: "Total Active Subscriptions", value: stats.active, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: "💰", label: "Monthly Recurring Revenue", value: `$${stats.mrr.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50" },
    { icon: "⏰", label: "Expiring in 7 Days", value: stats.expiring, color: "text-yellow-600", bg: "bg-yellow-50" },
    { icon: "🚫", label: "Cancelled This Month", value: stats.cancelledThisMonth, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-4 border border-white shadow-sm`}>
          <div className="text-2xl mb-1">{c.icon}</div>
          <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
          <p className="text-xs text-gray-500 font-semibold mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}