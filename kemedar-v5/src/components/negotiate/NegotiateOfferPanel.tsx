"use client";
// @ts-nocheck
import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const PAYMENT_METHODS = [
  { key: "cash", label: "💵 Cash", sub: "Immediate" },
  { key: "mortgage", label: "🏦 Mortgage", sub: "Bank" },
  { key: "installment", label: "📋 Installment", sub: "Plan" },
  { key: "mixed", label: "🤝 Flexible", sub: "Mixed" },
];
const TIMELINES = ["30 days", "60 days", "90 days", "As agreed"];
const CONDITIONS_LIST = [
  "Subject to satisfactory inspection",
  "Subject to mortgage approval",
  "Seller leaves fixtures & fittings",
];
const LANGUAGES = [{ key: "en", label: "🇺🇸 English" }, { key: "ar", label: "🇸🇦 العربية" }, { key: "fr", label: "🇫🇷 Français" }];
const TONES = ["Professional", "Friendly", "Firm"];

export default function NegotiateOfferPanel({ strategy, session, property, onOfferSent }) {
  const recommended = strategy?.recommendedOpeningOffer || 0;
  const walkAway = strategy?.walkAwayPrice || 0;
  const listedPrice = session?.listedPrice || property?.price_amount || 0;

  const [amount, setAmount] = useState(recommended);
  const [payment, setPayment] = useState("cash");
  const [timeline, setTimeline] = useState("30 days");
  const [conditions, setConditions] = useState([]);
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("Professional");
  const [message, setMessage] = useState("");
  const [aiDrafted, setAiDrafted] = useState(false);
  const [draftWarning, setDraftWarning] = useState(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validDays, setValidDays] = useState(3);

  const pct = listedPrice ? Math.round((amount / listedPrice) * 100) : 100;
  const diff = amount - recommended;
  const tooLow = amount < recommended * 0.9;
  const tooHigh = amount > walkAway;
  const justRight = !tooLow && !tooHigh;

  const fmt = (n) => Number(n || 0).toLocaleString();

  const handleDraftMessage = async () => {
    setDraftLoading(true);
    const res = await apiClient.post("/api/v1/ai/draftOfferMessage", {
      sessionId: session?.id,
      offerAmount: amount,
      direction: "buy",
      language,
      tone: tone.toLowerCase(),
      paymentMethod: payment,
      paymentTimeline: timeline,
      conditions: conditions.join("; "),
      keyArguments: strategy?.bestArguments?.slice(0, 2).map(a => a.argument) || [],
    }).catch(() => null);
    setDraftLoading(false);
    if (res?.data?.draft) {
      setMessage(res.data.draft.fullMessage);
      setAiDrafted(true);
      setDraftWarning(res.data.draft.warningIfAny);
    }
  };

  const handleSubmitOffer = async () => {
    if (!session?.id || !amount) return;
    setSubmitting(true);
    const validUntil = new Date(Date.now() + validDays * 86400000).toISOString();
    const offer = await apiClient.post("/api/v1/negotiationoffer", {
      sessionId: session.id,
      roundNumber: 1,
      offeredBy: "buyer",
      offererId: session.buyerId,
      offerAmount: Number(amount),
      offerCurrency: "EGP",
      offerPerSqm: property?.area_size ? Math.round(amount / property.area_size) : null,
      percentOfListed: pct,
      paymentMethod: payment,
      paymentTimeline: timeline,
      conditions: conditions.join("; "),
      validUntil,
      offerMessage: message,
      messageLanguage: language,
      isAiDrafted: aiDrafted,
      aiRecommendedAmount: recommended,
      userFollowedAiAdvice: Math.abs(amount - recommended) / recommended < 0.05,
      aiCoachingSummary: strategy?.briefingSummary,
      status: "sent",
    }).catch(() => null);

    if (offer) {
      await apiClient.put("/api/v1/negotiationsession/", session.id, {
        status: "offer_sent",
        currentOfferAmount: Number(amount),
        currentOfferBy: "buyer",
        currentOfferAt: new Date().toISOString(),
        currentOfferExpiresAt: validUntil,
        currentRound: 1,
      }).catch(() => {});

      await apiClient.post("/api/v1/negotiationmessage", {
        sessionId: session.id,
        senderId: session.buyerId,
        senderRole: "buyer",
        messageType: "offer",
        content: message || `Offer submitted: ${fmt(amount)} EGP`,
        relatedOfferId: offer.id,
      }).catch(() => {});
    }
    setSubmitting(false);
    onOfferSent?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5 sticky top-0">
      <p className="font-black text-gray-900 text-base flex items-center gap-2">
        📋 <span>Your Offer</span>
      </p>

      {/* Amount */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-1.5">Your Offer Amount</p>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full border-2 border-orange-300 focus:border-orange-500 rounded-xl px-4 py-3 text-lg font-black text-gray-900 outline-none text-right"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">EGP</span>
        </div>
        <p className="text-xs text-orange-500 font-semibold mt-1">AI recommends: {fmt(recommended)} EGP</p>

        {/* Feedback */}
        {tooLow && (
          <div className="mt-2 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
            <AlertTriangle size={12} /> Very low offer — may be rejected immediately
          </div>
        )}
        {justRight && amount > 0 && (
          <div className="mt-2 bg-green-50 text-green-600 text-xs px-3 py-2 rounded-lg">
            ✅ Strategic offer amount — {pct}% of asking price
          </div>
        )}
        {tooHigh && (
          <div className="mt-2 bg-orange-50 text-orange-600 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
            <AlertTriangle size={12} /> Above your walk-away price ({fmt(walkAway)} EGP)
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-2">Payment Method</p>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(p => (
            <button key={p.key} onClick={() => setPayment(p.key)}
              className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all text-left ${payment === p.key ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-orange-200"}`}>
              {p.label}<br /><span className="text-[10px] font-normal text-gray-400">{p.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-2">Expected closing in</p>
        <div className="flex flex-wrap gap-1.5">
          {TIMELINES.map(t => (
            <button key={t} onClick={() => setTimeline(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${timeline === t ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-2">Conditions (optional)</p>
        <div className="space-y-1.5">
          {CONDITIONS_LIST.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={conditions.includes(c)}
                onChange={e => setConditions(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c))}
                className="accent-orange-500 w-4 h-4" />
              <span className="text-xs text-gray-700">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Valid until */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-1">Offer valid for</p>
        <div className="flex gap-1.5">
          {[1, 3, 7].map(d => (
            <button key={d} onClick={() => setValidDays(d)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${validDays === d ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600"}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <p className="text-xs font-black text-gray-600 mb-2">Your Offer Message</p>
        <div className="flex gap-1.5 mb-2">
          {LANGUAGES.map(l => (
            <button key={l.key} onClick={() => setLanguage(l.key)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${language === l.key ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600"}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 mb-2">
          {TONES.map(t => (
            <button key={t} onClick={() => setTone(t)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${tone === t ? "border-purple-400 text-purple-600 bg-purple-50" : "border-gray-200 text-gray-600"}`}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={handleDraftMessage} disabled={draftLoading}
          className="w-full mb-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
          {draftLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {draftLoading ? "Drafting..." : "✨ Draft with AI"}
        </button>
        {aiDrafted && <p className="text-[10px] text-purple-500 font-semibold mb-1">✨ AI Drafted — feel free to edit</p>}
        {draftWarning && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-2 rounded-lg mb-2">
            ⚠️ {draftWarning}
          </div>
        )}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          placeholder="Write your offer message here..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-700 resize-none outline-none focus:border-orange-400"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
      </div>

      {/* Summary + Submit */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Property</span>
          <span className="font-semibold truncate max-w-[160px]">{property?.title?.split("|")[0]?.trim()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Your Offer</span>
          <span className="font-black text-orange-600">{fmt(amount)} EGP</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>% of asking</span>
          <span>{pct}%</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Valid until</span>
          <span>{new Date(Date.now() + validDays * 86400000).toLocaleDateString()}</span>
        </div>
      </div>

      <button
        onClick={handleSubmitOffer}
        disabled={submitting || !amount || !session?.id}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black py-4 rounded-xl text-base flex items-center justify-center gap-2 transition-colors"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : "🤝"}
        {submitting ? "Sending..." : "Send Offer"}
      </button>
      <p className="text-[10px] text-gray-400 text-center">🔒 Seller will be notified immediately</p>
    </div>
  );
}