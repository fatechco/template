// @ts-nocheck
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function RevenueKPIs({ subscriptions, orders, commissions, plans, activities }) {
  const stats = useMemo(() => {
    const planById = Object.fromEntries(plans.map(p => [p.id, p]));
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total revenue from completed orders
    const orderRevenue = orders
      .filter(o => o.status === "completed")
      .reduce((s, o) => s + (o.totalPrice || 0), 0);

    // Subscription revenue (total paid)
    const subRevenue = subscriptions.reduce((s, sub) => s + (sub.totalPaid || 0), 0);
    const totalRevenue = subRevenue + orderRevenue;

    // This month: subscriptions created this month × plan price
    const thisMonthSubs = subscriptions.filter(s => s.created_date && new Date(s.created_date) >= thisMonthStart);
    const thisMonth = thisMonthSubs.reduce((s, sub) => s + (planById[sub.planId]?.priceUSD || 0), 0)
      + orders.filter(o => o.status === "completed" && o.created_date && new Date(o.created_date) >= thisMonthStart)
        .reduce((s, o) => s + (o.totalPrice || 0), 0);

    const lastMonthSubs = subscriptions.filter(s => s.created_date && new Date(s.created_date) >= lastMonthStart && new Date(s.created_date) <= lastMonthEnd);
    const lastMonth = lastMonthSubs.reduce((s, sub) => s + (planById[sub.planId]?.priceUSD || 0), 0)
      + orders.filter(o => o.status === "completed" && o.created_date && new Date(o.created_date) >= lastMonthStart && new Date(o.created_date) <= lastMonthEnd)
        .reduce((s, o) => s + (o.totalPrice || 0), 0);

    const growth = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : 0;

    const active = subscriptions.filter(s => s.status === "active").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const commPaid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + (c.commissionAmount || 0), 0);

    // Churn: cancelled this month / active start of month
    const cancelledThisMonth = subscriptions.filter(s => s.status === "cancelled" && s.cancellationDate && new Date(s.cancellationDate) >= thisMonthStart).length;
    const churnRate = active + cancelledThisMonth > 0 ? ((cancelledThisMonth / (active + cancelledThisMonth)) * 100).toFixed(1) : 0;

    return { totalRevenue, thisMonth, lastMonth, growth, active, completedOrders, commPaid, churnRate };
  }, [subscriptions, orders, commissions, plans, activities]);

  const growthPositive = Number(stats.growth) >= 0;

  const cards = [
    { icon: "💰", label: "Total Revenue",        value: `$${stats.totalRevenue.toLocaleString()}`, color: "text-gray-900",   bg: "bg-gray-50" },
    { icon: "📈", label: "This Month",            value: `$${stats.thisMonth.toLocaleString()}`,    color: "text-green-600",  bg: "bg-green-50" },
    { icon: "📊", label: "Last Month",            value: `$${stats.lastMonth.toLocaleString()}`,    color: "text-blue-600",   bg: "bg-blue-50" },
    {
      icon: growthPositive ? "📈" : "📉",
      label: "MoM Growth",
      value: (
        <span className={`flex items-center gap-1 ${growthPositive ? "text-green-600" : "text-red-600"}`}>
          {growthPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {stats.growth}%
        </span>
      ),
      color: "", bg: growthPositive ? "bg-green-50" : "bg-red-50"
    },
    { icon: "💎", label: "Active Subscriptions",  value: stats.active,           color: "text-purple-600", bg: "bg-purple-50" },
    { icon: "🛍", label: "Completed Orders",       value: stats.completedOrders,  color: "text-orange-600", bg: "bg-orange-50" },
    { icon: "💸", label: "Commissions Paid",       value: `$${stats.commPaid.toLocaleString()}`, color: "text-teal-600", bg: "bg-teal-50" },
    { icon: "🔄", label: "Churn Rate",             value: `${stats.churnRate}%`,  color: "text-red-600",    bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-4 border border-white shadow-sm`}>
          <div className="text-2xl mb-1">{c.icon}</div>
          <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
          <p className="text-xs text-gray-500 font-semibold mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}