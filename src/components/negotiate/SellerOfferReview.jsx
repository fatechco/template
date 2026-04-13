import { useState, useEffect } from "react";
import { Sparkles, Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmt(n) { return n ? Number(n).toLocaleString() : "—"; }

const DECLINE_REASONS = [
  "Price too low",
  "Not interested at this time",
  "Accepted another offer",
  "Conditions not acceptable",
  "Custom",
];

export default function SellerOfferReview({ offer, session, onAccept, onCounter, onDecline }) {
  const [strategy, setStrategy] = useState(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState(DECLINE_REASONS[0]);

  const listedPrice = session?.listedPrice || 0;
  const pct = listedPrice ? Math.round((offer.offerAmount / listedPrice) * 100) : 100;
  const diff = listedPrice - offer.offerAmount;

  const loadSellerStrategy = async () => {
    if (strategy || loadingStrategy) return;
    setLoadingStrategy(true);
    const res = await base44.functions.invoke("generateSellerStrategy", {
      sessionId: session.id,
      offerId: offer.id,
    }).catch(() => null);
    if (res?.data?.strategy) setStrategy(res.data.strategy);
    setLoadingStrategy(false);
  };

  useEffect(() => {
    loadSellerStrategy();
  }, [offer.id]);

  const assessmentConfig = {
    strong:   { label: "🎉 Strong Offer!", bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700" },
    fair:     { label: "✅ Fair Offer",    bg: "bg-green-50 border-green-200",   text: "text-green-800", badge: "bg-green-100 text-green-700" },
    low:      { label: "⚠️ Below Market",  bg: "bg-orange-50 border-orange-200", text: "text-orange-800", badge: "bg-orange-100 text-orange-700" },
    very_low: { label: "❌ Very Low Offer", bg: "bg-red-50 border-red-200",      text: "text-red-800",   badge: "bg-red-100 text-red-700" },
  };
  const cfg = assessmentConfig[strategy?.offerAssessment] || assessmentConfig.low;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Offer summary bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 font-semibold">📨 New Offer Received</p>
          <p className="text-xl font-black text-gray-900">{fmt(offer.offerAmount)} <span className="text-sm text-gray-400">EGP</span></p>
          <p className="text-xs text-gray-500">{pct}% of asking · ▼ {fmt(diff)} below</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={onAccept}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
            <CheckCircle size={14} /> Accept
          </button>
          <button onClick={onCounter}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm">
            🔄 Counter
          </button>
          <button onClick={() => setShowDecline(!showDecline)}
            className="flex items-center gap-1.5 border border-red-200 text-red-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-50">
            <XCircle size={14} /> Decline
          </button>
        </div>
      </div>

      {/* Decline dropdown */}
      {showDecline && (
        <div className="px-4 pb-3 space-y-2">
          <select value={declineReason} onChange={e => setDeclineReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400">
            {DECLINE_REASONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={() => setShowDecline(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={() => onDecline(declineReason)} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-xl text-sm">Confirm Decline</button>
          </div>
        </div>
      )}

      {/* AI Analysis expand */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-purple-50 border-t border-purple-100 text-xs font-bold text-purple-700">
        <span className="flex items-center gap-1.5">
          <Sparkles size={11} />
          {loadingStrategy ? "Analyzing offer with AI..." : strategy ? "View AI Analysis" : "Load AI Analysis"}
        </span>
        {loadingStrategy ? <Loader2 size={12} className="animate-spin" /> : expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && strategy && (
        <div className={`border-t px-4 py-4 space-y-4 ${cfg.bg} ${cfg.text}`}>
          {/* Assessment */}
          <div className={`border rounded-xl p-3 ${cfg.bg}`}>
            <p className="font-black text-base">{cfg.label}</p>
            <p className="text-sm mt-1 leading-relaxed">{strategy.assessmentRationale}</p>
          </div>

          {/* Market comparison */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: "Your Price", val: fmt(listedPrice) + " EGP", highlight: false },
              { label: "This Offer", val: fmt(offer.offerAmount) + " EGP", highlight: true },
              { label: "Market Avg", val: fmt(session?.marketAvgPricePerSqm) + " /m²", highlight: false },
            ].map(c => (
              <div key={c.label} className={`rounded-xl p-2.5 ${c.highlight ? "bg-orange-100 border border-orange-200" : "bg-white border border-gray-100"}`}>
                <p className="text-gray-400 mb-1">{c.label}</p>
                <p className={`font-black ${c.highlight ? "text-orange-700" : "text-gray-800"}`}>{c.val}</p>
              </div>
            ))}
          </div>

          {/* Recommended counter */}
          {strategy.recommendedCounterOffer && (
            <div className="bg-white border border-orange-200 rounded-xl p-3">
              <p className="text-[10px] font-black text-orange-500 mb-1">⭐ AI Recommended Counter</p>
              <p className="text-xl font-black text-orange-600">{fmt(strategy.recommendedCounterOffer)} EGP</p>
              <p className="text-xs text-gray-600 mt-1">{strategy.counterOfferRationale}</p>
            </div>
          )}

          {/* Arguments */}
          {strategy.strongCounterArguments?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-wide opacity-70">Your Counter Arguments</p>
              {strategy.strongCounterArguments.map((a, i) => (
                <p key={i} className="text-xs flex items-start gap-1.5">
                  <span className="flex-shrink-0">•</span>{a}
                </p>
              ))}
            </div>
          )}

          {/* Acceptance advice */}
          {strategy.acceptanceAdvice && (
            <div className="bg-white/70 rounded-xl p-3 text-xs">
              <p className="font-black mb-1">💡 Should You Accept?</p>
              <p className="leading-relaxed">{strategy.acceptanceAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}