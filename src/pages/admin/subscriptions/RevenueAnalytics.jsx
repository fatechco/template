import { useState, useEffect, useMemo } from "react";
import { Download, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import RevenueKPIs from "@/components/admin/analytics/RevenueKPIs";
import RevenueByModule from "@/components/admin/analytics/RevenueByModule";
import RevenueCharts from "@/components/admin/analytics/RevenueCharts";
import SubscriptionHealth from "@/components/admin/analytics/SubscriptionHealth";

export default function RevenueAnalytics() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [modules, setModules] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    Promise.all([
      base44.entities.Subscription.list("-created_date", 500),
      base44.entities.ServiceOrder.list("-created_date", 500),
      base44.entities.SubscriptionPlan.list(),
      base44.entities.SystemModule.list(),
      base44.entities.FranchiseCommission.list("-created_date", 500),
      base44.entities.SubscriptionActivity.list("-created_date", 500),
    ]).then(([subs, ord, pl, mod, comm, act]) => {
      setSubscriptions(subs);
      setOrders(ord);
      setPlans(pl);
      setModules(mod);
      setCommissions(comm);
      setActivities(act);
      setLoading(false);
    });
  }, []);

  const planById = useMemo(() => Object.fromEntries(plans.map(p => [p.id, p])), [plans]);
  const moduleById = useMemo(() => Object.fromEntries(modules.map(m => [m.id, m])), [modules]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-500 text-sm">Platform-wide revenue and subscription health</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white">
            <Calendar size={12} className="text-gray-400" />
            <input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))}
              className="focus:outline-none text-gray-600 bg-transparent" />
            <span className="text-gray-400">→</span>
            <input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))}
              className="focus:outline-none text-gray-600 bg-transparent" />
          </div>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
          <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
            <Download size={12} /> Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold">Loading analytics…</p>
        </div>
      ) : (
        <>
          <RevenueKPIs subscriptions={subscriptions} orders={orders} commissions={commissions} plans={plans} activities={activities} />
          <RevenueByModule subscriptions={subscriptions} orders={orders} plans={plans} modules={modules} />
          <RevenueCharts subscriptions={subscriptions} orders={orders} plans={plans} modules={modules} commissions={commissions} activities={activities} />
          <SubscriptionHealth subscriptions={subscriptions} plans={plans} activities={activities} />
        </>
      )}
    </div>
  );
}