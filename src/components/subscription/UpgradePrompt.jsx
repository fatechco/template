import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Lock, Zap, ArrowRight } from "lucide-react";

/**
 * Reusable Upgrade Prompt component
 * Types: "inline_teaser" | "blocking_modal" | "usage_limit" | "soft_upsell"
 */
export default function UpgradePrompt({
  type = "blocking_modal",
  featureName,
  featureIcon = "✨",
  moduleName = "Kemedar",
  planName = "Seeker Pro",
  planCode = "BUYER_PRO",
  priceMonthly = 149,
  priceAnnual = 1299,
  trialDays = 14,
  benefits = [],
  usageLabel,
  usageUsed,
  usageLimit,
  resetsIn,
  onClose,
  onUpgrade,
  children, // for inline teaser — the blurred content
}) {
  const [dismissed, setDismissed] = useState(false);

  const pricingRoute = `/kemedar/pricing`;
  const checkoutRoute = `/kemedar/checkout/${planCode}`;

  const handleDismiss = () => {
    setDismissed(true);
    onClose?.();
  };

  if (dismissed) return null;

  // ─── INLINE TEASER ───────────────────────────────
  if (type === "inline_teaser") {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        {/* Content with fade */}
        <div className="relative">
          <div className="pointer-events-none select-none" style={{ maxHeight: 120, overflow: "hidden" }}>
            {children}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Frosted overlay */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm mt-2">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-orange-600" />
          </div>
          <p className="font-black text-gray-900 text-sm mb-1">{featureName} — Pro Feature</p>
          <p className="text-gray-500 text-xs mb-4">Unlock with {planName}</p>
          <p className="text-gray-400 text-xs mb-3">From {priceMonthly} EGP/month</p>
          <div className="flex gap-2 justify-center">
            <Link
              to={checkoutRoute}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition"
            >
              ✨ Upgrade to Pro
            </Link>
            <Link
              to={pricingRoute}
              className="text-orange-600 text-sm font-semibold px-3 py-2 hover:underline flex items-center gap-1"
            >
              See what's included <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── BLOCKING MODAL ──────────────────────────────
  if (type === "blocking_modal") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleDismiss}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-5">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">
              {featureIcon}
            </div>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>

          <p className="font-black text-gray-900 text-xl mb-1">🔒 {featureName}</p>
          <p className="text-orange-600 text-sm font-semibold mb-5">{moduleName}™ Pro Feature</p>

          {benefits.length > 0 && (
            <div className="mb-5">
              <p className="font-bold text-gray-800 text-sm mb-3">What you get:</p>
              <div className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500">✅</span> {b}
                  </div>
                ))}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✅</span> All {planName} features
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Monthly</span>
              <span className="font-bold text-gray-900">{priceMonthly} EGP/mo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Annual</span>
              <span className="font-bold text-green-600">{priceAnnual} EGP/yr <span className="text-xs text-gray-400">(save {Math.round((1 - priceAnnual / (priceMonthly * 12)) * 100)}%)</span></span>
            </div>
          </div>

          <Link
            to={checkoutRoute}
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-4 rounded-2xl transition mb-3 text-base"
            onClick={onUpgrade}
          >
            {trialDays > 0 ? `✨ Start ${trialDays}-Day Free Trial` : `✨ Upgrade Now — ${priceMonthly} EGP/mo`}
          </Link>

          <button
            onClick={handleDismiss}
            className="w-full text-gray-400 text-sm text-center py-2 hover:text-gray-600"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  // ─── USAGE LIMIT TOAST ───────────────────────────
  if (type === "usage_limit") {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex gap-4 items-start">
          <div className="text-2xl flex-shrink-0">⚡</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm mb-0.5">Daily Limit Reached</p>
            <p className="text-gray-300 text-xs mb-1">
              You've used all {usageLimit} {usageLabel} today
            </p>
            {resetsIn && (
              <p className="text-gray-400 text-xs">Resets in: {resetsIn}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            <Link
              to={checkoutRoute}
              className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              ✨ Upgrade
            </Link>
            <button
              onClick={handleDismiss}
              className="text-gray-400 text-xs text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SOFT UPSELL ─────────────────────────────────
  if (type === "soft_upsell") {
    return (
      <div className="border border-gray-200 rounded-2xl p-4 bg-white flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">✨</span>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-sm mb-0.5">Pro Tip:</p>
          <p className="text-gray-600 text-xs mb-2">{featureName}</p>
          <p className="text-gray-400 text-xs mb-2">Available in {planName}</p>
          <Link to={pricingRoute} className="text-orange-600 text-xs font-semibold hover:underline flex items-center gap-1">
            Learn more <ArrowRight size={12} />
          </Link>
        </div>
        <button onClick={handleDismiss} className="text-gray-300 hover:text-gray-500">
          <X size={14} />
        </button>
      </div>
    );
  }

  return null;
}

/**
 * Convenience wrapper: Feature Gate
 * Wraps children and shows upgrade prompt if no access
 */
export function FeatureGate({
  hasAccess = true,
  featureName,
  featureIcon,
  planName = "Seeker Pro",
  planCode = "BUYER_PRO",
  priceMonthly = 149,
  priceAnnual = 1299,
  trialDays = 14,
  benefits = [],
  promptType = "inline_teaser",
  children,
}) {
  if (hasAccess) return children;

  if (promptType === "inline_teaser") {
    return (
      <UpgradePrompt
        type="inline_teaser"
        featureName={featureName}
        featureIcon={featureIcon}
        planName={planName}
        planCode={planCode}
        priceMonthly={priceMonthly}
        priceAnnual={priceAnnual}
        trialDays={trialDays}
        benefits={benefits}
      >
        {children}
      </UpgradePrompt>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30 blur-sm select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-5 text-center max-w-xs mx-4">
          <Lock size={24} className="text-orange-500 mx-auto mb-2" />
          <p className="font-black text-gray-900 mb-1">{featureName}</p>
          <p className="text-gray-500 text-sm mb-3">Requires {planName}</p>
          <Link
            to={`/kemedar/checkout/${planCode}`}
            className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-xl block hover:bg-orange-600"
          >
            ✨ Upgrade — {priceMonthly} EGP/mo
          </Link>
        </div>
      </div>
    </div>
  );
}