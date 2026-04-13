import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/monetization" },
  { label: "📋 Plans", to: "/admin/kemedar/monetization/plans" },
  { label: "👥 Subscribers", to: "/admin/kemedar/monetization/subscribers" },
  { label: "💰 Revenue", to: "/admin/kemedar/monetization/revenue" },
  { label: "🎁 Promo Codes", to: "/admin/kemedar/monetization/promos" },
  { label: "⚙️ Settings", to: "/admin/kemedar/monetization/settings" },
];

const COLORS = ["#FF6B00", "#0077B6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

const PLAN_PRICES = {
  BUYER_PRO: 149, BUYER_PREMIUM: 349, SELLER_PRO: 299, SELLER_PREMIUM: 599,
  AGENT_STARTER: 499, AGENT_PRO: 999, KEMEWORK_PRO: 199, KEMEWORK_PREMIUM: 399,
  KEMETRO_PRO: 249, KEMETRO_PREMIUM: 599, FO_STANDARD: 999, FO_PREMIUM: 1999,
  DEVELOPER_PRO: 1999,
};

const CANCEL_REASONS = [
  "Too expensive", "Not using enough features", "Missing a feature I need",
  "Found a better alternative", "Temporary — will come back", "Other",
];

export default function MonetizationOverview() {
  const { pathname } = useLocation();
  const [subs, setSubs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPromo, setNewPromo] = useState({ code: "", discountType: "percent", discountValue: 20, validFrom: new Date().toISOString().slice(0, 10), isActive: true, usedCount: 0 });
  const [promoSaving, setPromoSaving] = useState(false);
  const [settings, setSettings] = useState({
    trial_days_default: 14, require_card_for_trial: false, max_trials_per_user: 1,
    retry_attempts: 3, retry_interval_days: 3, grace_period_days: 7,
    show_upgrade_prompts: true, prompt_frequency_days: 7,
    allow_immediate_upgrade: true, allow_immediate_downgrade: false, proration_on_upgrade: true,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [s, p, inv, pr] = await Promise.all([
      base44.entities.UserSubscription.list("-startedAt", 500),
      base44.entities.SubscriptionPlan.list("sortOrder", 100),
      base44.entities.SubscriptionInvoice.list("-created_date", 200),
      base44.entities.PromoCode.list("-created_date", 100),
    ]);
    setSubs(s);
    setPlans(p);
    setInvoices(inv);
    setPromos(pr);
    setLoading(false);
  };

  const activeSubs = subs.filter(s => s.status === "active" || s.status === "trialing");
  const paidSubs = subs.filter(s => (s.status === "active" || s.status === "trialing") && !s.planCode?.includes("FREE") && PLAN_PRICES[s.planCode]);
  const cancelledSubs = subs.filter(s => s.status === "cancelled");

  const mrr = paidSubs.reduce((sum, s) => {
    const price = PLAN_PRICES[s.planCode] || 0;
    const factor = s.billingCycle === "annual" ? 1/12 : s.billingCycle === "quarterly" ? 1/3 : 1;
    return sum + (s.priceEGP || price) * factor;
  }, 0);

  const arr = mrr * 12;

  const conversionRate = activeSubs.length > 0
    ? Math.round((paidSubs.length / activeSubs.length) * 100)
    : 0;

  const churnRate = subs.length > 0
    ? Math.round((cancelledSubs.length / subs.length) * 100)
    : 0;

  const planDistribution = Object.entries(
    paidSubs.reduce((acc, s) => {
      const name = plans.find(p => p.planCode === s.planCode)?.planName || s.planCode;
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const handleSavePromo = async () => {
    if (!newPromo.code) return;
    setPromoSaving(true);
    await base44.entities.PromoCode.create({
      ...newPromo,
      code: newPromo.code.toUpperCase(),
      validFrom: new Date(newPromo.validFrom).toISOString(),
    });
    const updated = await base44.entities.PromoCode.list("-created_date", 100);
    setPromos(updated);
    setNewPromo({ code: "", discountType: "percent", discountValue: 20, validFrom: new Date().toISOString().slice(0, 10), isActive: true, usedCount: 0 });
    setPromoSaving(false);
  };

  const KPIS = [
    { label: "MRR", val: `${Math.round(mrr).toLocaleString()} EGP`, icon: "💰", color: "text-green-600", bg: "bg-green-50", sub: "Monthly Recurring Revenue" },
    { label: "ARR", val: `${Math.round(arr).toLocaleString()} EGP`, icon: "📈", color: "text-blue-600", bg: "bg-blue-50", sub: "Annual Run Rate" },
    { label: "Paid Subscribers", val: paidSubs.length.toLocaleString(), icon: "👥", color: "text-orange-600", bg: "bg-orange-50", sub: "Active paid plans" },
    { label: "Free Users", val: (activeSubs.length - paidSubs.length).toLocaleString(), icon: "🆓", color: "text-gray-600", bg: "bg-gray-50", sub: "On free plans" },
    { label: "Conversion Rate", val: `${conversionRate}%`, icon: "🎯", color: "text-purple-600", bg: "bg-purple-50", sub: "Free → Paid" },
    { label: "Churn Rate", val: `${churnRate}%`, icon: "📉", color: "text-red-600", bg: "bg-red-50", sub: "Monthly cancellations" },
  ];

  const planTable = plans.filter(p => p.planTier !== "free").map(plan => {
    const planSubs = paidSubs.filter(s => s.planCode === plan.planCode);
    const planMRR = planSubs.reduce((sum, s) => {
      const factor = s.billingCycle === "annual" ? 1/12 : s.billingCycle === "quarterly" ? 1/3 : 1;
      return sum + (s.priceEGP || plan.monthlyPriceEGP || 0) * factor;
    }, 0);
    const planCancelled = cancelledSubs.filter(s => s.planCode === plan.planCode).length;
    const planChurn = planSubs.length > 0 ? Math.round((planCancelled / (planSubs.length + planCancelled)) * 100) : 0;
    return { ...plan, subCount: planSubs.length, planMRR: Math.round(planMRR), planChurn };
  }).sort((a, b) => b.planMRR - a.planMRR);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">💰 Monetization Hub</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${pathname === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* OVERVIEW */}
      {pathname === "/admin/kemedar/monetization" && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {KPIS.map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <p className="text-3xl mb-1">{k.icon}</p>
                <p className={`text-2xl font-black ${k.color}`}>{loading ? "—" : k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plan distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-4">MRR by Plan</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={planDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue trend placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-4">Revenue Trend (Simulated)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { month: "Jul", rev: Math.round(mrr * 0.3) }, { month: "Aug", rev: Math.round(mrr * 0.45) },
                  { month: "Sep", rev: Math.round(mrr * 0.55) }, { month: "Oct", rev: Math.round(mrr * 0.65) },
                  { month: "Nov", rev: Math.round(mrr * 0.78) }, { month: "Dec", rev: Math.round(mrr * 0.85) },
                  { month: "Jan", rev: Math.round(mrr * 0.92) }, { month: "Feb", rev: Math.round(mrr * 0.95) },
                  { month: "Mar", rev: Math.round(mrr) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => `${v.toLocaleString()} EGP`} />
                  <Area type="monotone" dataKey="rev" stroke="#FF6B00" fill="#FFF3E8" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-black text-gray-900">Plan Performance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    {["Plan", "Category", "Price", "Subscribers", "MRR", "Churn Rate"].map(h => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {planTable.map(plan => (
                    <tr key={plan.planCode} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gray-900">{plan.planName}</td>
                      <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{plan.planCategory?.replace(/_/g, ' ')}</span></td>
                      <td className="px-4 py-3 text-gray-700">{plan.monthlyPriceEGP} EGP/mo</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{plan.subCount}</td>
                      <td className="px-4 py-3 font-bold text-green-600">{plan.planMRR.toLocaleString()} EGP</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${plan.planChurn > 15 ? "text-red-600" : plan.planChurn > 5 ? "text-orange-600" : "text-green-600"}`}>
                          {plan.planChurn}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {planTable.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No paid subscribers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade Funnel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-black text-gray-900 mb-4">Upgrade Funnel</p>
            <div className="flex items-end gap-4 flex-wrap">
              {[
                { label: "Total Users", val: subs.length, color: "bg-gray-200" },
                { label: "Active Free", val: activeSubs.length - paidSubs.length, color: "bg-blue-200" },
                { label: "Trialing", val: subs.filter(s => s.status === "trialing").length, color: "bg-orange-200" },
                { label: "Paid Active", val: paidSubs.length, color: "bg-green-400" },
              ].map(item => (
                <div key={item.label} className="flex-1 min-w-24 text-center">
                  <div className={`${item.color} rounded-xl mx-auto mb-2`} style={{ height: Math.max(20, Math.round((item.val / Math.max(subs.length, 1)) * 120)), width: "100%" }} />
                  <p className="font-black text-gray-900 text-lg">{item.val}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PLANS */}
      {pathname === "/admin/kemedar/monetization/plans" && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <p className="font-black text-gray-900 text-lg">All Plans ({plans.length})</p>
            <Link to="/kemedar/pricing" target="_blank" className="text-xs bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg">
              Preview Public Page →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Code", "Name", "Category", "Tier", "Monthly Price", "Subscribers", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => {
                  const planSubs = paidSubs.filter(s => s.planCode === plan.planCode).length;
                  return (
                    <tr key={plan.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{plan.planCode}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{plan.planName}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize">{plan.planCategory?.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                          plan.planTier === "pro" ? "bg-orange-100 text-orange-700" :
                          plan.planTier === "premium" ? "bg-amber-100 text-amber-700" :
                          plan.planTier === "free" ? "bg-gray-100 text-gray-600" :
                          plan.planTier === "enterprise" ? "bg-purple-100 text-purple-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>{plan.planTier}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">{plan.monthlyPriceEGP === 0 ? "Free" : `${plan.monthlyPriceEGP} EGP`}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{planSubs}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${plan.isActive ? "text-green-600" : "text-gray-400"}`}>
                          {plan.isActive ? "✅ Active" : "⏸ Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSCRIBERS */}
      {pathname === "/admin/kemedar/monetization/subscribers" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">All Subscribers ({subs.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["User", "Plan", "Billing", "Status", "Started", "Renewal", "MRR"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.slice(0, 100).map(sub => {
                  const planName = plans.find(p => p.planCode === sub.planCode)?.planName || sub.planCode;
                  const factor = sub.billingCycle === "annual" ? 1/12 : sub.billingCycle === "quarterly" ? 1/3 : 1;
                  const subMRR = Math.round((sub.priceEGP || 0) * factor);
                  return (
                    <tr key={sub.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{sub.userId?.slice(0, 12)}...</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{planName}</td>
                      <td className="px-4 py-3 text-xs capitalize text-gray-500">{sub.billingCycle}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                          sub.status === "active" ? "bg-green-100 text-green-700" :
                          sub.status === "trialing" ? "bg-blue-100 text-blue-700" :
                          sub.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>{sub.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{sub.startedAt ? new Date(sub.startedAt).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3 text-xs font-bold text-green-600">{subMRR > 0 ? `${subMRR} EGP` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROMO CODES */}
      {pathname === "/admin/kemedar/monetization/promos" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-black text-gray-900 mb-5">Create Promo Code</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Code</label>
                <div className="flex gap-2">
                  <input value={newPromo.code} onChange={e => setNewPromo(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="KEMEDAR20"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-orange-400" />
                  <button onClick={() => setNewPromo(p => ({ ...p, code: `KMD${Math.random().toString(36).slice(2,7).toUpperCase()}` }))}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-xl">Auto</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Discount Type</label>
                <select value={newPromo.discountType} onChange={e => setNewPromo(p => ({ ...p, discountType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option value="percent">Percentage %</option>
                  <option value="fixed_egp">Fixed EGP</option>
                  <option value="free_months">Free Months</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Discount Value</label>
                <input type="number" value={newPromo.discountValue} onChange={e => setNewPromo(p => ({ ...p, discountValue: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Valid From</label>
                <input type="date" value={newPromo.validFrom} onChange={e => setNewPromo(p => ({ ...p, validFrom: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <button onClick={handleSavePromo} disabled={promoSaving || !newPromo.code}
              className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-50">
              {promoSaving ? "Saving..." : "Create Promo Code"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Code", "Discount", "Used", "Valid Until", "Status"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promos.map(promo => (
                  <tr key={promo.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{promo.code}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {promo.discountValue}{promo.discountType === "percent" ? "%" : promo.discountType === "free_months" ? " months free" : " EGP"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{promo.usedCount || 0}{promo.maxUses ? ` / ${promo.maxUses}` : ""}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{promo.validUntil ? new Date(promo.validUntil).toLocaleDateString() : "No expiry"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${promo.isActive ? "text-green-600" : "text-gray-400"}`}>
                        {promo.isActive ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {promos.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No promo codes yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {pathname === "/admin/kemedar/monetization/settings" && (
        <div className="space-y-5">
          {[
            {
              title: "Trial Settings",
              items: [
                { key: "trial_days_default", label: "Default trial days", type: "number" },
                { key: "require_card_for_trial", label: "Require card for trial", type: "toggle" },
                { key: "max_trials_per_user", label: "Max trials per user", type: "number" },
              ]
            },
            {
              title: "Payment Settings",
              items: [
                { key: "retry_attempts", label: "Payment retry attempts", type: "number" },
                { key: "retry_interval_days", label: "Retry interval (days)", type: "number" },
                { key: "grace_period_days", label: "Grace period after failure (days)", type: "number" },
              ]
            },
            {
              title: "Feature Gate Settings",
              items: [
                { key: "show_upgrade_prompts", label: "Show upgrade prompts", type: "toggle" },
                { key: "prompt_frequency_days", label: "Days between same prompt", type: "number" },
              ]
            },
            {
              title: "Plan Change Settings",
              items: [
                { key: "allow_immediate_upgrade", label: "Allow immediate upgrade", type: "toggle" },
                { key: "allow_immediate_downgrade", label: "Allow immediate downgrade", type: "toggle" },
                { key: "proration_on_upgrade", label: "Proration on upgrade", type: "toggle" },
              ]
            },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-black text-gray-900 mb-4">{section.title}</p>
              <div className="space-y-3">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-800">{item.label}</span>
                    {item.type === "toggle" ? (
                      <button onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                        className={`w-12 h-6 rounded-full relative transition-colors ${settings[item.key] ? "bg-orange-500" : "bg-gray-200"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${settings[item.key] ? "right-0.5" : "left-0.5"}`} />
                      </button>
                    ) : (
                      <input type="number" value={settings[item.key]} onChange={e => setSettings(s => ({ ...s, [item.key]: Number(e.target.value) }))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition">
            💾 Save Settings
          </button>
        </div>
      )}
    </div>
  );
}