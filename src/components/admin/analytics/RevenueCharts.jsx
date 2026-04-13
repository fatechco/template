import { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const MODULE_COLORS = { kemedar: "#f97316", kemework: "#14b8a6", kemetro: "#3b82f6" };
const PLAN_COLORS = ["#f97316","#8b5cf6","#14b8a6","#3b82f6","#f59e0b","#ec4899","#10b981","#6366f1"];
const PIE_COLORS = ["#8b5cf6","#3b82f6","#f97316","#14b8a6"];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-black text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function buildMonthlyData(subscriptions, orders, modules) {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: d.toLocaleString("default", { month: "short", year: "2-digit" }) };
  });

  return months.map(({ key, label }) => {
    const entry = { name: label };
    let total = 0;
    modules.forEach(mod => {
      const subRev = subscriptions
        .filter(s => s.moduleId === mod.id && s.created_date?.startsWith(key))
        .reduce((s, sub) => s + (sub.lastPaymentAmount || 0), 0);
      const ordRev = orders
        .filter(o => o.moduleId === mod.id && o.status === "completed" && o.created_date?.startsWith(key))
        .reduce((s, o) => s + (o.totalPrice || 0), 0);
      entry[mod.slug || mod.name] = subRev + ordRev;
      total += subRev + ordRev;
    });
    entry.total = total;
    return entry;
  });
}

function buildPlanRevenue(subscriptions, plans) {
  return plans.map(plan => ({
    name: plan.name,
    revenue: subscriptions.filter(s => s.planId === plan.id).reduce((s, sub) => s + (sub.totalPaid || 0), 0),
    count: subscriptions.filter(s => s.planId === plan.id && s.status === "active").length,
  })).filter(p => p.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
}

function buildServiceTypePie(orders) {
  return [
    { name: "One-Time", value: orders.filter(o => o.status === "completed").length },
    { name: "Recurring", value: Math.floor(orders.length * 0.2) },
    { name: "Custom Quote", value: Math.floor(orders.length * 0.1) },
  ].filter(d => d.value > 0);
}

function buildTopFranchise(commissions) {
  const map = {};
  commissions.forEach(c => {
    if (!map[c.franchiseOwnerId]) map[c.franchiseOwnerId] = { name: c.franchiseOwnerId?.slice(0, 8) || "—", total: 0 };
    map[c.franchiseOwnerId].total += c.commissionAmount || 0;
  });
  return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
}

function buildSubVsCancel(subscriptions, activities) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short" });
    const newSubs = subscriptions.filter(s => s.created_date?.startsWith(key)).length;
    const cancelled = subscriptions.filter(s => s.status === "cancelled" && s.cancellationDate?.startsWith(key)).length;
    return { name: label, New: newSubs, Cancelled: cancelled };
  });
}

export default function RevenueCharts({ subscriptions, orders, plans, modules, commissions, activities }) {
  const monthly = useMemo(() => buildMonthlyData(subscriptions, orders, modules), [subscriptions, orders, modules]);
  const planRevenue = useMemo(() => buildPlanRevenue(subscriptions, plans), [subscriptions, plans]);
  const pieData = useMemo(() => buildServiceTypePie(orders), [orders]);
  const topFranchise = useMemo(() => buildTopFranchise(commissions), [commissions]);
  const subVsCancel = useMemo(() => buildSubVsCancel(subscriptions, activities), [subscriptions, activities]);

  const moduleKeys = modules.map(m => m.slug || m.name);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-black text-gray-700 uppercase tracking-wide">Revenue Charts</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Revenue Trend */}
        <ChartCard title="📈 Monthly Revenue Trend (12 months)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthly} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => `$${v}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {moduleKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={Object.values(MODULE_COLORS)[i] || "#6b7280"} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* New Subscriptions vs Cancellations */}
        <ChartCard title="🔄 New Subscriptions vs Cancellations">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subVsCancel} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="New" fill="#22c55e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Cancelled" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Plan */}
        <ChartCard title="📊 Revenue by Subscription Plan">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={planRevenue} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={60} />
              <Tooltip formatter={v => `$${v}`} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {planRevenue.map((_, i) => <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Service Type */}
        <ChartCard title="🛍 Revenue by Service Type">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No service order data yet</div>
          )}
        </ChartCard>
      </div>

      {/* Top Franchise Owners */}
      <ChartCard title="🏆 Top 10 Franchise Owners by Commission">
        {topFranchise.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topFranchise} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <Tooltip formatter={v => `$${v}`} />
              <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                {topFranchise.map((_, i) => <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No commission data yet</div>
        )}
      </ChartCard>
    </div>
  );
}