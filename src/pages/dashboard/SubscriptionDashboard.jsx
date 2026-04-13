import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ChevronRight, CreditCard, FileText, TrendingUp, AlertTriangle } from "lucide-react";

const LIMIT_LABELS = {
  saved_properties: { label: "Saved Properties", icon: "🏠" },
  contact_owner_monthly: { label: "Owner Contacts", icon: "📞" },
  advisor_matches_per_report: { label: "Advisor Matches", icon: "🤝" },
  match_swipes_daily: { label: "Daily Swipes", icon: "👆" },
  match_super_likes_daily: { label: "Super Likes", icon: "⭐" },
  life_score_compare_areas: { label: "Life Score Areas", icon: "🏙️" },
  coach_ai_messages_daily: { label: "AI Coach Messages", icon: "💬" },
  vision_staging_monthly: { label: "Staging Credits", icon: "📸" },
  virtual_tours_monthly: { label: "Virtual Tours", icon: "🎬" },
  live_events_monthly: { label: "Live Events", icon: "📺" },
  active_listings: { label: "Active Listings", icon: "📋" },
  job_bids_monthly: { label: "Job Bids", icon: "📝" },
  products_active: { label: "Active Products", icon: "📦" },
};

const PLAN_NAME_MAP = {
  BUYER_FREE: "Explorer", BUYER_PRO: "Seeker Pro", BUYER_PREMIUM: "Owner Premium",
  SELLER_FREE: "Basic Lister", SELLER_PRO: "Seller Pro", SELLER_PREMIUM: "Top Seller",
  AGENT_STARTER: "Agent Starter", AGENT_PRO: "Agent Pro",
  KEMEWORK_FREE: "Basic Pro", KEMEWORK_PRO: "Verified Pro", KEMEWORK_PREMIUM: "Master Pro",
  KEMETRO_FREE: "Basic Seller", KEMETRO_PRO: "Verified Seller", KEMETRO_PREMIUM: "Power Seller",
  FO_STANDARD: "Franchise Owner", FO_PREMIUM: "Senior Franchise Owner",
  DEVELOPER_PRO: "Developer Pro", DEVELOPER_ENTERPRISE: "Developer Enterprise",
};

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [usageData, setUsageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelFlow, setCancelFlow] = useState(null); // null | "reason" | "offer" | "confirm"
  const [cancelReason, setCancelReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me().catch(() => null);
      if (!user) { setLoading(false); return; }

      const [subs, invs] = await Promise.all([
        base44.entities.UserSubscription.filter({ userId: user.id }, "-startedAt", 5),
        base44.entities.SubscriptionInvoice.filter({ userId: user.id }, "-created_date", 10),
      ]);

      const activeSub = subs.find(s => s.status === "active" || s.status === "trialing") || subs[0];
      setSubscription(activeSub);
      setInvoices(invs);

      if (activeSub) {
        const plans = await base44.entities.SubscriptionPlan.filter({ planCode: activeSub.planCode }, "sortOrder", 1);
        setPlan(plans[0]);
        loadUsage(user.id, plans[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async (userId, planData) => {
    if (!planData?.limits) return;
    const now = new Date();
    const period = now.toISOString().slice(0, 7);
    const events = await base44.entities.UsageEvent.filter({ userId, usagePeriod: period }, "created_date", 500);

    const grouped = {};
    events.forEach(e => {
      grouped[e.featureKey] = (grouped[e.featureKey] || 0) + (e.usageValue || 1);
    });
    setUsageData(grouped);
  };

  const handleCancelConfirm = async () => {
    if (confirmText !== "CANCEL") return;
    await base44.entities.UserSubscription.update(subscription.id, {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancelEffectiveAt: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: true,
    });
    setCancelFlow(null);
    loadData();
  };

  const CANCEL_REASONS = [
    "Too expensive",
    "Not using enough features",
    "Missing a feature I need",
    "Found a better alternative",
    "Temporary — will come back",
    "Other",
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const planName = plan ? plan.planName : (subscription ? PLAN_NAME_MAP[subscription.planCode] : "Free Plan");
  const isFree = !subscription || subscription.planCode?.includes("FREE");
  const isTrialing = subscription?.status === "trialing";
  const limits = plan?.limits || {};
  const features = plan?.features || {};

  const usageItems = Object.entries(LIMIT_LABELS).filter(([key]) => {
    return limits[key] !== undefined;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-black text-gray-900">📋 My Subscription</h1>

      {/* Current Plan Card */}
      <div className={`bg-white rounded-3xl border-2 ${isFree ? "border-gray-200" : "border-orange-300"} shadow-lg p-7`}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-black text-gray-900">{planName}</h2>
              {isTrialing && (
                <span className="bg-blue-100 text-blue-700 text-xs font-black px-2 py-1 rounded-full">TRIAL</span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{plan?.planDescription || "Free plan — upgrade for AI features"}</p>
          </div>
          <div className="text-right">
            {isFree ? (
              <span className="text-2xl font-black text-gray-400">Free</span>
            ) : (
              <div>
                <p className="text-2xl font-black text-orange-600">{subscription.priceEGP} EGP</p>
                <p className="text-sm text-gray-400">/{subscription.billingCycle}</p>
              </div>
            )}
          </div>
        </div>

        {subscription && !isFree && (
          <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-2xl text-sm">
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-bold text-green-600">✅ {subscription.status === "trialing" ? "Trial Active" : "Active"}</p>
            </div>
            <div>
              <p className="text-gray-400">Next Renewal</p>
              <p className="font-bold text-gray-900">{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "—"}</p>
            </div>
            <div>
              <p className="text-gray-400">Billing</p>
              <p className="font-bold capitalize text-gray-900">{subscription.billingCycle}</p>
            </div>
            <div>
              <p className="text-gray-400">Next Payment</p>
              <p className="font-bold text-gray-900">{subscription.nextPaymentAmount ? `${subscription.nextPaymentAmount} EGP` : "—"}</p>
            </div>
          </div>
        )}

        {subscription?.cancelAtPeriodEnd && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex gap-2 items-center text-sm">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <span className="text-red-700">Cancels on {new Date(subscription.cancelEffectiveAt || subscription.currentPeriodEnd).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link
            to="/kemedar/pricing"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            ⬆️ {isFree ? "Upgrade Plan" : "Change Plan"}
          </Link>
          {!isFree && (
            <>
              <button className="border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                💳 Update Payment
              </button>
              {!subscription?.cancelAtPeriodEnd && (
                <button
                  onClick={() => setCancelFlow("reason")}
                  className="text-red-500 text-sm hover:underline px-2"
                >
                  ❌ Cancel
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Usage This Month */}
      {usageItems.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-gray-900 text-xl">📊 Monthly Usage</h2>
            {subscription && (
              <p className="text-xs text-gray-400">
                Billing period: {subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart).toLocaleDateString() : "—"} — {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "—"}
              </p>
            )}
          </div>
          <div className="space-y-4">
            {usageItems.map(([key, meta]) => {
              const limit = limits[key];
              const usage = usageData[key] || 0;
              const isUnlimited = limit === -1;
              const pct = isUnlimited ? 0 : Math.min(100, Math.round((usage / limit) * 100));
              const barColor = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-orange-500" : "bg-blue-500";

              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-xl flex-shrink-0 w-8 text-center">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
                      <span className="text-sm text-gray-500">
                        {isUnlimited ? "∞" : `${usage} / ${limit}`}
                      </span>
                    </div>
                    {isUnlimited ? (
                      <div className="h-2 bg-green-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full w-1/3 opacity-50" />
                      </div>
                    ) : (
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className={`h-2 ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  {pct >= 100 && (
                    <Link to="/kemedar/pricing" className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                      ✨ Upgrade
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Billing History */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
          <h2 className="font-black text-gray-900 text-xl mb-5">🧾 Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr>
                  {["Date", "Plan", "Amount", "Status", "Invoice"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs font-bold text-gray-400 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-gray-600">{inv.created_date ? new Date(inv.created_date).toLocaleDateString() : "—"}</td>
                    <td className="py-3 font-semibold text-gray-900">{inv.planName}</td>
                    <td className="py-3 font-bold text-gray-900">{inv.total?.toFixed(2)} {inv.currency || "EGP"}</td>
                    <td className="py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${inv.status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {inv.status === "paid" ? "✅ Paid" : inv.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {inv.invoicePdfUrl ? (
                        <a href={inv.invoicePdfUrl} target="_blank" rel="noreferrer" className="text-orange-600 text-xs font-bold hover:underline">⬇️ PDF</a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Subscription CTA */}
      {isFree && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-8 text-center">
          <p className="text-4xl mb-4">✨</p>
          <h3 className="font-black text-gray-900 text-xl mb-2">Unlock the full Kemedar experience</h3>
          <p className="text-gray-600 mb-6">Get AI-powered tools, unlimited swipes, and premium insights from 149 EGP/month</p>
          <Link to="/kemedar/pricing" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl inline-block transition">
            ✨ View Plans & Pricing →
          </Link>
        </div>
      )}

      {/* Cancel Flow */}
      {cancelFlow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">

            {/* Step 1: Reason */}
            {cancelFlow === "reason" && (
              <>
                <h2 className="font-black text-xl text-gray-900 mb-5">Why are you leaving?</h2>
                <div className="space-y-2 mb-6">
                  {CANCEL_REASONS.map(reason => (
                    <label key={reason} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={e => setCancelReason(e.target.value)}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={!cancelReason}
                    onClick={() => setCancelFlow("offer")}
                    className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50"
                  >
                    Continue →
                  </button>
                  <button onClick={() => setCancelFlow(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm">
                    Keep Plan
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Retention Offer */}
            {cancelFlow === "offer" && (
              <>
                <h2 className="font-black text-xl text-gray-900 mb-2">Before you go...</h2>

                {cancelReason === "Too expensive" && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5">
                    <p className="font-bold text-orange-800 mb-2">Switch to annual and save!</p>
                    <p className="text-orange-700 text-sm mb-3">Pay {plan?.annualPriceEGP} EGP/year instead of {(plan?.monthlyPriceEGP || 0) * 12} EGP — save {Math.round((plan?.annualDiscountPercent || 0))}%</p>
                    <button className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm w-full">
                      Switch to Annual Plan
                    </button>
                  </div>
                )}

                {cancelReason === "Temporary — will come back" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5">
                    <p className="font-bold text-blue-800 mb-2">Pause your subscription instead?</p>
                    <p className="text-blue-700 text-sm mb-3">We'll keep your data and resume when you're ready.</p>
                    <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm w-full">
                      Pause for 1-3 months
                    </button>
                  </div>
                )}

                <p className="text-gray-600 text-sm mb-5">Still want to cancel? Your plan stays active until the end of your billing period.</p>

                <div className="flex gap-3">
                  <button onClick={() => setCancelFlow("confirm")} className="flex-1 text-red-500 text-sm border border-red-200 py-3 rounded-xl hover:bg-red-50">
                    Continue to Cancel
                  </button>
                  <button onClick={() => setCancelFlow(null)} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl text-sm">
                    ← Keep My Plan
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Confirm */}
            {cancelFlow === "confirm" && (
              <>
                <h2 className="font-black text-xl text-gray-900 mb-4">Cancel {planName}?</h2>
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-sm">
                  <p className="text-gray-700 mb-2">Your plan stays active until: <span className="font-bold">{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "—"}</span></p>
                  <p className="text-gray-500">After that, you'll move to the Free plan. Your data is always preserved.</p>
                </div>
                <div className="mb-5">
                  <p className="text-sm font-bold text-gray-700 mb-2">Type "CANCEL" to confirm:</p>
                  <input
                    value={confirmText}
                    onChange={e => setConfirmText(e.target.value)}
                    placeholder="CANCEL"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={confirmText !== "CANCEL"}
                    onClick={handleCancelConfirm}
                    className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl text-sm disabled:opacity-40"
                  >
                    ❌ Yes, Cancel My Plan
                  </button>
                  <button onClick={() => setCancelFlow(null)} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-xl text-sm">
                    ← Keep My Subscription
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}