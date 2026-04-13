import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const AUCTION_TYPES = [
  {
    value: "open",
    icon: "👁️",
    label: "Open Auction",
    sub: "All bids visible to all bidders. Creates competitive excitement.",
  },
  {
    value: "reserve",
    icon: "🔒",
    label: "Reserve Auction",
    sub: "Set a hidden minimum price. Property only sells if reserve is met.",
    recommended: true,
  },
  {
    value: "sealed",
    icon: "✉️",
    label: "Sealed Bids",
    sub: "Bidders submit once without seeing others. Winner revealed at end.",
  },
  {
    value: "absolute",
    icon: "⚡",
    label: "Absolute Auction",
    sub: "No reserve. Sells to highest bid regardless of price. Maximum urgency.",
  },
];

const EXTENSION_MINUTES_OPTIONS = [2, 5, 10, 15];
const MAX_EXTENSIONS_OPTIONS = [1, 2, 3, 5];

function fmt(n) {
  return Number(n || 0).toLocaleString("en-EG");
}

function calcDuration(start, end) {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms <= 0) return null;
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  return { days, hours, totalDays: ms / (1000 * 60 * 60 * 24) };
}

export default function AuctionOptIn({ auctionData, onChange }) {
  const [settings, setSettings] = useState(null);
  const [enabled, setEnabled] = useState(auctionData?.enabled || false);
  const [form, setForm] = useState({
    auctionType: "reserve",
    startingPriceEGP: "",
    minimumBidIncrementEGP: 5000,
    reservePriceEGP: "",
    buyNowEnabled: false,
    buyNowPriceEGP: "",
    registrationOpenAt: "",
    registrationCloseAt: "",
    auctionStartAt: "",
    auctionEndAt: "",
    extensionMinutes: 5,
    maxExtensions: 3,
    requireBuyerKYC: true,
    requireBuyerProofOfFunds: false,
    auctionDescription: "",
    auctionDescriptionAr: "",
    ...(auctionData || {}),
  });

  useEffect(() => {
    base44.entities.AuctionSettings.list().then(arr => setSettings(arr[0])).catch(() => {});
  }, []);

  const update = (fields) => {
    const next = { ...form, ...fields };
    setForm(next);
    onChange({ enabled, ...next });
  };

  const handleToggle = (val) => {
    setEnabled(val);
    onChange({ enabled: val, ...form });
  };

  // Deposit calculations
  const startingPrice = parseFloat(form.startingPriceEGP) || 0;
  const sellerPct = settings?.sellerDepositPercent ?? 0.5;
  const sellerMin = settings?.sellerDepositMinEGP ?? 2000;
  const buyerPct = settings?.buyerDepositPercent ?? 1;
  const buyerMin = settings?.buyerDepositMinEGP ?? 5000;
  const sellerDeposit = startingPrice > 0 ? Math.max(startingPrice * (sellerPct / 100), sellerMin) : sellerMin;
  const buyerDeposit = startingPrice > 0 ? Math.max(startingPrice * (buyerPct / 100), buyerMin) : buyerMin;

  const duration = calcDuration(form.auctionStartAt, form.auctionEndAt);
  const maxDays = settings?.maxAuctionDurationDays ?? 30;

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#FFF7ED",
        borderLeft: "4px solid #DC2626",
        border: "1px solid #FED7AA",
        borderLeftWidth: 4,
        borderLeftColor: "#DC2626",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🔨</span>
          <div>
            <h3 className="font-black text-[#1C1917] text-lg leading-tight">KemedarBid™ — Sell by Auction</h3>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed max-w-lg">
              Set a starting price, sit back, and let verified buyers compete.
              Reserve price kept confidential — only revealed if needed.
            </p>
          </div>
        </div>
        <span className="flex-shrink-0 bg-[#DC2626] text-white text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap">
          KemedarBid™
        </span>
      </div>

      {/* Opt-In Toggle Card */}
      <div
        className="bg-white rounded-xl p-4 border-2 transition-all"
        style={{ borderColor: enabled ? "#DC2626" : "#E5E7EB" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 text-sm">List this property For Auction</p>
            <p className="text-xs text-gray-500 mt-0.5">Property will appear in the Auction section</p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${enabled ? "bg-[#DC2626]" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? "left-6" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      {/* Wizard — shown only when enabled */}
      {enabled && (
        <div className="mt-5 space-y-6">

          {/* ── SECTION 1: AUCTION TYPE ── */}
          <div>
            <p className="font-black text-gray-900 text-sm mb-3">🏷️ Choose Your Auction Type</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUCTION_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => update({ auctionType: t.value })}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    form.auctionType === t.value
                      ? "border-[#DC2626] bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {t.recommended && (
                    <span className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-bold text-gray-900 text-sm">{t.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.sub}</p>
                  {form.auctionType === t.value && (
                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#DC2626]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── SECTION 2: PRICING ── */}
          <div>
            <p className="font-black text-gray-900 text-sm mb-3">💰 Set Your Pricing</p>
            <div className="space-y-3">
              {/* Row 1: Starting price + increment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Starting bid price <span className="text-red-500">*</span></label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-red-400">
                    <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 border-r border-gray-200">EGP</span>
                    <input
                      type="number"
                      value={form.startingPriceEGP}
                      onChange={e => update({ startingPriceEGP: e.target.value })}
                      placeholder="e.g. 500000"
                      className="flex-1 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">The minimum first bid allowed</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Minimum bid increment</label>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-red-400">
                    <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 border-r border-gray-200">EGP</span>
                    <input
                      type="number"
                      value={form.minimumBidIncrementEGP}
                      onChange={e => update({ minimumBidIncrementEGP: e.target.value })}
                      placeholder="5000"
                      className="flex-1 px-3 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Smallest raise allowed above current bid</p>
                </div>
              </div>

              {/* Reserve price (only for reserve type) */}
              {form.auctionType === "reserve" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Reserve price (confidential)</label>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:border-red-400">
                      <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 border-r border-gray-200">EGP</span>
                      <input
                        type="number"
                        value={form.reservePriceEGP}
                        onChange={e => update({ reservePriceEGP: e.target.value })}
                        placeholder="e.g. 800000"
                        className="flex-1 px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Hidden minimum you will accept. Displayed as "Reserve" to buyers but exact amount is never shown.
                    </p>
                  </div>
                </div>
              )}

              {/* Buy Now */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Buy Now price (optional)</p>
                    <p className="text-[11px] text-gray-400">Any bidder who offers this price wins instantly. Creates urgency.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ buyNowEnabled: !form.buyNowEnabled })}
                    className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${form.buyNowEnabled ? "bg-[#DC2626]" : "bg-gray-200"}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.buyNowEnabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {form.buyNowEnabled && (
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:border-red-400 mt-2">
                    <span className="px-3 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 border-r border-gray-200">EGP</span>
                    <input
                      type="number"
                      value={form.buyNowPriceEGP}
                      onChange={e => update({ buyNowPriceEGP: e.target.value })}
                      placeholder="e.g. 1200000"
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: TIMING ── */}
          <div>
            <p className="font-black text-gray-900 text-sm mb-3">📅 Auction Schedule</p>
            <div className="space-y-3">
              {/* Registration period */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-gray-700 mb-2">When can bidders register?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">From</label>
                    <input
                      type="datetime-local"
                      value={form.registrationOpenAt}
                      onChange={e => update({ registrationOpenAt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">To</label>
                    <input
                      type="datetime-local"
                      value={form.registrationCloseAt}
                      onChange={e => update({ registrationCloseAt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Registration closes 24h before bidding starts. Buyers must pay deposit to register.</p>
              </div>

              {/* Auction dates */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-gray-700 mb-2">Auction dates</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">Start</label>
                    <input
                      type="datetime-local"
                      value={form.auctionStartAt}
                      onChange={e => update({ auctionStartAt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-500 block mb-1">End</label>
                    <input
                      type="datetime-local"
                      value={form.auctionEndAt}
                      onChange={e => update({ auctionEndAt: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                </div>
                {/* Duration badge */}
                {duration && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    duration.totalDays > maxDays
                      ? "bg-red-100 text-red-700"
                      : duration.totalDays < 1
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {duration.totalDays > maxDays
                      ? `⚠️ Max ${maxDays} days allowed`
                      : duration.totalDays < 1
                      ? `⚠️ Duration: ${duration.hours}h — too short`
                      : `✓ Duration: ${duration.days}d ${duration.hours}h`}
                  </div>
                )}
              </div>

              {/* Anti-snipe */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-bold text-gray-700 mb-1">Anti-Sniping Extension</p>
                <p className="text-[11px] text-gray-400 mb-3">Prevents last-second sniping. Fair for all bidders.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Extend if bid placed in final</span>
                    <select
                      value={form.extensionMinutes}
                      onChange={e => update({ extensionMinutes: Number(e.target.value) })}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-red-400"
                    >
                      {EXTENSION_MINUTES_OPTIONS.map(m => <option key={m} value={m}>{m} min</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Max extensions:</span>
                    <select
                      value={form.maxExtensions}
                      onChange={e => update({ maxExtensions: Number(e.target.value) })}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-red-400"
                    >
                      {MAX_EXTENSIONS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: BUYER REQUIREMENTS ── */}
          <div>
            <p className="font-black text-gray-900 text-sm mb-3">👤 Who Can Bid?</p>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {/* KYC */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Require Identity Verification (KYC)</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">All bidders must have verified identity</p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ requireBuyerKYC: !form.requireBuyerKYC })}
                  className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${form.requireBuyerKYC ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.requireBuyerKYC ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              {/* Proof of funds */}
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">Require Proof of Funds</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Bidders must upload bank statement or mortgage pre-approval letter</p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ requireBuyerProofOfFunds: !form.requireBuyerProofOfFunds })}
                  className={`relative w-10 h-5 rounded-full transition-all flex-shrink-0 ${form.requireBuyerProofOfFunds ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.requireBuyerProofOfFunds ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ── DEPOSIT SUMMARY ── */}
          <div className="rounded-xl border-2 border-[#DC2626] bg-white p-4">
            <p className="font-black text-gray-900 text-sm mb-3">🔐 Deposit Requirements</p>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-0.5">Your deposit (seller)</p>
                  <p className="text-[11px] text-gray-400">{sellerPct}% of starting price — paid after admin approval</p>
                  <p className="text-[11px] text-gray-400">Refunded on completion. Forfeited if you withdraw.</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black text-[#DC2626]">{fmt(sellerDeposit)} EGP</p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 mb-0.5">Buyer deposit (per bidder)</p>
                  <p className="text-[11px] text-gray-400">{buyerPct}% of starting price — paid on registration</p>
                  <p className="text-[11px] text-gray-400">Refunded to all losers. Forfeited by winner who fails to pay.</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black text-gray-800">{fmt(buyerDeposit)} EGP</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── AUCTION DESCRIPTION ── */}
          <div>
            <p className="font-black text-gray-900 text-sm mb-3">📝 Auction Description</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Why are you selling by auction? (English)</label>
                <textarea
                  value={form.auctionDescription}
                  onChange={e => update({ auctionDescription: e.target.value })}
                  rows={3}
                  placeholder="Describe the auction reason, property highlights for bidders..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">وصف المزاد (عربي)</label>
                <textarea
                  value={form.auctionDescriptionAr}
                  onChange={e => update({ auctionDescriptionAr: e.target.value })}
                  rows={3}
                  dir="rtl"
                  placeholder="اكتب سبب البيع بالمزاد ومميزات العقار..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none bg-white text-right"
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}