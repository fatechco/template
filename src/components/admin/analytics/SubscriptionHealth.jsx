import { useMemo } from "react";

const TIER_ORDER = ["free","basic","starter","bronze","silver","gold","professional","enterprise"];
const ARROW_PAIRS = [
  { from: "free", to: "basic" },
  { from: "basic", to: "bronze" },
  { from: "bronze", to: "silver" },
  { from: "silver", to: "gold" },
  { from: "gold", to: "professional" },
  { from: "professional", to: "enterprise" },
];

export default function SubscriptionHealth({ subscriptions, plans, activities }) {
  const planById = Object.fromEntries(plans.map(p => [p.id, p]));

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const healthData = useMemo(() => {
    return plans.map(plan => {
      const planSubs = subscriptions.filter(s => s.planId === plan.id);
      const active = planSubs.filter(s => s.status === "active").length;
      const newThisMonth = planSubs.filter(s => s.created_date && new Date(s.created_date) >= thisMonthStart).length;
      const cancelled = planSubs.filter(s => s.status === "cancelled").length;
      const revenue = planSubs.reduce((s, sub) => s + (sub.totalPaid || 0), 0);
      const net = newThisMonth - planSubs.filter(s => s.status === "cancelled" && s.cancellationDate && new Date(s.cancellationDate) >= thisMonthStart).length;
      const churn = active + cancelled > 0 ? ((cancelled / (active + cancelled)) * 100).toFixed(1) : "0.0";
      return { plan, active, newThisMonth, cancelled, net, revenue, churn };
    }).filter(d => d.active > 0 || d.newThisMonth > 0 || d.revenue > 0);
  }, [subscriptions, plans]);

  // Build upgrade flows from activity logs
  const upgradeFlows = useMemo(() => {
    return ARROW_PAIRS.map(({ from, to }) => {
      const fromPlan = plans.find(p => p.tier === from);
      const toPlan = plans.find(p => p.tier === to);
      if (!fromPlan || !toPlan) return null;
      const count = activities.filter(a =>
        a.action === "upgraded" &&
        (a.metadata || "").includes(toPlan.name)
      ).length;
      return { from: fromPlan.name, to: toPlan.name, count };
    }).filter(Boolean).filter(f => f.count > 0 || true); // show even 0 for context
  }, [plans, activities]);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black text-gray-700 uppercase tracking-wide">Subscription Health</h2>

      {/* Plan Health Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-700">Plan Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Plan","Active","New This Month","Cancelled","Net Change","Revenue","Churn Rate"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {healthData.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400 text-sm">No subscription data yet</td></tr>
              )}
              {healthData.map(({ plan, active, newThisMonth, cancelled, net, revenue, churn }) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-800">{plan.name}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full">{active}</span>
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-bold">+{newThisMonth}</td>
                  <td className="px-4 py-3 text-red-500 font-bold">{cancelled}</td>
                  <td className="px-4 py-3">
                    <span className={`font-black ${net >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {net >= 0 ? "+" : ""}{net}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-gray-900">${revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(Number(churn), 100)}%` }} />
                      </div>
                      <span className={`font-bold text-[10px] ${Number(churn) > 10 ? "text-red-600" : "text-gray-600"}`}>{churn}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade/Downgrade Flow */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-black text-gray-700 mb-4">📊 Plan Upgrade Flow</h3>
        {upgradeFlows.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No upgrade activity logged yet.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {upgradeFlows.map((flow, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700">{flow.from}</div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-orange-600 font-black">{flow.count} users</span>
                  <span className="text-orange-500 text-lg leading-none">→</span>
                </div>
                <div className="bg-orange-100 rounded-lg px-3 py-1.5 text-xs font-bold text-orange-700">{flow.to}</div>
                {i < upgradeFlows.length - 1 && <span className="text-gray-300 mx-1">·</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}