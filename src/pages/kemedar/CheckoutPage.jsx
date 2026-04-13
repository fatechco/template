import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, Building2, Smartphone, ArrowLeft } from "lucide-react";
import { clearSubscriptionCache } from "@/lib/subscriptionEngine";

const PLAN_NAMES = {
  BUYER_FREE: "Explorer", BUYER_PRO: "Seeker Pro", BUYER_PREMIUM: "Owner Premium",
  SELLER_FREE: "Basic Lister", SELLER_PRO: "Seller Pro", SELLER_PREMIUM: "Top Seller",
  AGENT_STARTER: "Agent Starter", AGENT_PRO: "Agent Pro",
  KEMEWORK_FREE: "Basic Pro", KEMEWORK_PRO: "Verified Pro", KEMEWORK_PREMIUM: "Master Pro",
  KEMETRO_FREE: "Basic Seller", KEMETRO_PRO: "Verified Seller", KEMETRO_PREMIUM: "Power Seller",
  FO_STANDARD: "Franchise Owner", FO_PREMIUM: "Senior Franchise Owner",
  DEVELOPER_PRO: "Developer Pro", DEVELOPER_ENTERPRISE: "Developer Enterprise",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const planCode = window.location.pathname.split("/").pop();
  const billingCycle = urlParams.get("billing") || "monthly";

  const [plan, setPlan] = useState(null);
  const [step, setStep] = useState(1); // 1=summary, 2=payment, 3=confirm
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreed, setAgreed] = useState({ terms: false, cancel: false });

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    const plans = await base44.entities.SubscriptionPlan.filter({ planCode }, "sortOrder", 1);
    setPlan(plans[0]);
    setLoading(false);
  };

  const displayPrice = billingCycle === "annual" && plan?.annualPriceEGP
    ? Math.round(plan.annualPriceEGP / 12)
    : plan?.monthlyPriceEGP || 0;

  const totalPrice = billingCycle === "annual" ? (plan?.annualPriceEGP || 0) : (plan?.monthlyPriceEGP || 0);
  const discountAmount = promoApplied ? Math.round(totalPrice * (promoApplied.discountValue / 100)) : 0;
  const finalPrice = totalPrice - discountAmount;

  const trialEndDate = plan?.trialDays > 0
    ? new Date(Date.now() + plan.trialDays * 86400000).toLocaleDateString()
    : null;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    const promos = await base44.entities.PromoCode.filter({ code: promoCode.toUpperCase(), isActive: true }, "created_date", 1);
    if (promos[0]) {
      setPromoApplied(promos[0]);
    } else {
      alert("Invalid or expired promo code");
    }
    setPromoLoading(false);
  };

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const user = await base44.auth.me();
      if (!user) { navigate("/"); return; }

      const now = new Date();
      const periodEnd = new Date(now);
      if (billingCycle === "annual") periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      else if (billingCycle === "quarterly") periodEnd.setMonth(periodEnd.getMonth() + 3);
      else periodEnd.setMonth(periodEnd.getMonth() + 1);

      const trialEnd = plan?.trialDays > 0
        ? new Date(Date.now() + plan.trialDays * 86400000).toISOString()
        : null;

      // Cancel existing active sub
      const existing = await base44.entities.UserSubscription.filter({ userId: user.id, status: "active" }, "-startedAt", 1);
      if (existing[0]) {
        await base44.entities.UserSubscription.update(existing[0].id, { status: "cancelled" });
      }

      const plans = await base44.entities.SubscriptionPlan.filter({ planCode }, "sortOrder", 1);
      const planData = plans[0];

      const sub = await base44.entities.UserSubscription.create({
        userId: user.id,
        planId: planData?.id || planCode,
        planCode,
        billingCycle,
        priceEGP: finalPrice,
        currency: "EGP",
        startedAt: now.toISOString(),
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        trialEndAt: trialEnd,
        status: trialEnd ? "trialing" : "active",
        autoRenew: true,
        cancelAtPeriodEnd: false,
        promoCodeUsed: promoApplied?.code || null,
        discountPercent: promoApplied?.discountValue || 0,
        nextPaymentAt: trialEnd || periodEnd.toISOString(),
        nextPaymentAmount: finalPrice,
        usageThisPeriod: {},
        upgradeHistory: [],
      });

      // Create invoice
      await base44.entities.SubscriptionInvoice.create({
        subscriptionId: sub.id,
        userId: user.id,
        invoiceNumber: `KMD-INV-${Date.now()}`,
        planName: planData?.planName || PLAN_NAMES[planCode] || planCode,
        billingPeriodStart: now.toISOString().slice(0, 10),
        billingPeriodEnd: periodEnd.toISOString().slice(0, 10),
        subtotal: totalPrice,
        discount: discountAmount,
        taxAmount: 0,
        total: finalPrice,
        currency: "EGP",
        status: trialEnd ? "open" : "paid",
        paidAt: trialEnd ? null : now.toISOString(),
        paymentMethod,
      });

      if (promoApplied) {
        await base44.entities.PromoCode.update(promoApplied.id, {
          usedCount: (promoApplied.usedCount || 0) + 1,
        });
      }

      clearSubscriptionCache();
      setSuccess(true);
    } catch (e) {
      alert("Subscription failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    const name = PLAN_NAMES[planCode] || planCode;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">You're all set!</h1>
          <p className="text-gray-500 mb-6">Welcome to {name}!</p>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["AI Features", "Priority Access", "Unlimited Potential"].map(feat => (
              <span key={feat} className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">{feat}</span>
            ))}
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition text-base"
          >
            🚀 Start Using Your Plan →
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  const STEPS = ["Plan Summary", "Payment", "Confirm"];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Pricing
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i + 1 <= step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${i + 1 === step ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-12 h-1 rounded-full mx-1 ${i + 1 < step ? "bg-orange-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Step 1 */}
            {step === 1 && (
              <div className="bg-white rounded-3xl shadow-sm p-7">
                <h2 className="font-black text-xl text-gray-900 mb-5">Plan Summary</h2>
                <div className="flex items-center gap-4 p-5 bg-orange-50 border border-orange-200 rounded-2xl mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl">✨</div>
                  <div>
                    <p className="font-black text-gray-900 text-lg">{PLAN_NAMES[planCode] || planCode}</p>
                    <p className="text-orange-600 font-bold">{displayPrice} EGP/month · Billed {billingCycle}</p>
                  </div>
                </div>

                {plan?.trialDays > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 text-sm">
                    <p className="font-bold text-green-800 mb-1">✅ {plan.trialDays}-Day Free Trial Included</p>
                    <p className="text-green-700">Your card won't be charged for {plan.trialDays} days. Cancel anytime before {trialEndDate} and you won't pay anything.</p>
                  </div>
                )}

                <button onClick={() => setStep(2)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition text-base">
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="bg-white rounded-3xl shadow-sm p-7">
                <h2 className="font-black text-xl text-gray-900 mb-5">Payment Method</h2>

                <div className="flex gap-2 mb-6">
                  {[
                    { id: "card", icon: <CreditCard size={18} />, label: "Card" },
                    { id: "bank", icon: <Building2 size={18} />, label: "Bank Transfer" },
                    { id: "mobile", icon: <Smartphone size={18} />, label: "Mobile Wallet" },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition ${paymentMethod === m.id ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Card Number</label>
                      <input placeholder="1234 5678 9012 3456" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">Expiry</label>
                        <input placeholder="MM/YY" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">CVV</label>
                        <input placeholder="123" type="password" maxLength={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Cardholder Name</label>
                      <input placeholder="Name on card" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                  </div>
                )}

                {paymentMethod === "mobile" && (
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-3 gap-2">
                      {["Vodafone Cash", "Instapay", "Fawry"].map(w => (
                        <button key={w} className="py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-orange-400">{w}</button>
                      ))}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Mobile Number</label>
                      <input placeholder="+20 10X XXXX XXXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-800">
                    <p className="font-bold mb-2">Bank Transfer Instructions</p>
                    <p>Transfer to account XXXX-XXXX-XXXX and email your receipt to billing@kemedar.com with your order number.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm">← Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="bg-white rounded-3xl shadow-sm p-7">
                <h2 className="font-black text-xl text-gray-900 mb-5">Review Your Order</h2>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Plan</span><span className="font-bold">{PLAN_NAMES[planCode] || planCode}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Billing</span><span className="font-bold capitalize">{billingCycle}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Amount</span><span className="font-bold">{finalPrice} EGP</span></div>
                  {plan?.trialDays > 0 && (
                    <div className="flex justify-between"><span className="text-gray-600">First charge</span><span className="font-bold text-green-600">{trialEndDate}</span></div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-orange-500" checked={agreed.terms} onChange={e => setAgreed(a => ({ ...a, terms: e.target.checked }))} />
                    <span className="text-sm text-gray-700">I agree to the subscription terms and conditions</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-orange-500" checked={agreed.cancel} onChange={e => setAgreed(a => ({ ...a, cancel: e.target.checked }))} />
                    <span className="text-sm text-gray-700">I understand the cancellation policy</span>
                  </label>
                </div>

                <button
                  onClick={handleSubscribe}
                  disabled={!agreed.terms || !agreed.cancel || processing}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition text-base disabled:opacity-50"
                >
                  {processing ? "Processing..." : (plan?.trialDays > 0 ? `✅ Start Free Trial` : "✅ Subscribe Now")}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-6">
              <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-2 mb-5 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Plan</span><span className="font-bold">{PLAN_NAMES[planCode] || planCode}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Billing</span><span className="font-bold capitalize">{billingCycle}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-bold">{totalPrice} EGP</span></div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Promo discount</span><span className="font-bold">-{discountAmount} EGP</span></div>
                )}
                <div className="border-t pt-2 flex justify-between font-black text-gray-900">
                  <span>Total</span><span className="text-orange-600">{finalPrice} EGP</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <button onClick={handleApplyPromo} disabled={promoLoading} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-xl text-xs">
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-xs mt-1 font-bold">✅ {promoApplied.discountValue}% discount applied!</p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-gray-400">
                {plan?.trialDays > 0 && <p>✅ {plan.trialDays}-day free trial included</p>}
                <p>✅ Cancel anytime</p>
                <p>✅ No setup fees</p>
                <p>✅ Data always preserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}