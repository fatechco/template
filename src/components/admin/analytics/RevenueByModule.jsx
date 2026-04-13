import { useMemo } from "react";

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  color: "border-orange-200 bg-orange-50", accent: "text-orange-600", bar: "bg-orange-500" },
  kemework: { icon: "🔧", label: "Kemework", color: "border-teal-200 bg-teal-50",     accent: "text-teal-600",   bar: "bg-teal-500" },
  kemetro:  { icon: "🛒", label: "Kemetro",  color: "border-blue-200 bg-blue-50",     accent: "text-blue-600",   bar: "bg-blue-500" },
};

export default function RevenueByModule({ subscriptions, orders, plans, modules }) {
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));
  const planById = Object.fromEntries(plans.map(p => [p.id, p]));

  const data = useMemo(() => {
    return modules.map(mod => {
      const modSubs = subscriptions.filter(s => s.moduleId === mod.id);
      const modOrders = orders.filter(o => o.moduleId === mod.id && o.status === "completed");
      const subRevenue = modSubs.reduce((s, sub) => s + (sub.totalPaid || 0), 0);
      const svcRevenue = modOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
      const active = modSubs.filter(s => s.status === "active").length;
      return { mod, subRevenue, svcRevenue, total: subRevenue + svcRevenue, active };
    });
  }, [subscriptions, orders, modules]);

  const maxTotal = Math.max(...data.map(d => d.total), 1);

  return (
    <div>
      <h2 className="text-sm font-black text-gray-700 uppercase tracking-wide mb-3">Revenue by Module</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map(({ mod, subRevenue, svcRevenue, total, active }) => {
          const meta = MODULE_META[mod.slug] || { icon: "📦", label: mod.name, color: "border-gray-200 bg-gray-50", accent: "text-gray-600", bar: "bg-gray-500" };
          return (
            <div key={mod.id} className={`rounded-xl border-2 p-5 ${meta.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{meta.icon}</span>
                  <span className="font-black text-gray-900 text-lg">{meta.label}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white ${meta.accent}`}>
                  {active} active
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-semibold">Subscription Revenue</span>
                    <span className="font-bold text-gray-800">${subRevenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${meta.bar} rounded-full`} style={{ width: `${maxTotal > 0 ? (subRevenue / maxTotal) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-semibold">Service Revenue</span>
                    <span className="font-bold text-gray-800">${svcRevenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${meta.bar} opacity-60 rounded-full`} style={{ width: `${maxTotal > 0 ? (svcRevenue / maxTotal) * 100 : 0}%` }} />
                  </div>
                </div>
                <div className="border-t border-white/60 pt-3 flex justify-between items-center">
                  <span className="text-xs font-black text-gray-600 uppercase tracking-wide">Total</span>
                  <span className={`text-xl font-black ${meta.accent}`}>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}