"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

export default function FracPurchasePanel({ offering, user, isSoldOut, pct, onBuy }) {
  const min = offering.minTokensPerBuyer || 1;
  const maxAvail = offering.tokensAvailable || offering.tokensForSale - offering.tokensSold;
  const max = offering.maxTokensPerBuyer ? Math.min(offering.maxTokensPerBuyer, maxAvail) : maxAvail;
  const [qty, setQty] = useState(min);

  const adjustQty = (delta) => setQty((q) => Math.max(min, Math.min(max, q + delta)));
  const handleInput = (val) => {
    const n = parseInt(val) || min;
    setQty(Math.max(min, Math.min(max, n)));
  };

  const subtotal = qty * offering.tokenPriceEGP;
  const fee = subtotal * (offering.platformFeePercent / 100);
  const total = subtotal + fee;
  const ownership = ((qty / offering.totalTokenSupply) * 100).toFixed(2);
  const annualReturn = offering.expectedAnnualYieldPercent
    ? (subtotal * offering.expectedAnnualYieldPercent) / 100 : null;

  const hasKYC = user?.kycStatus === "approved"; // simplified check
  const isLoggedIn = !!user;

  const handleBuyClick = () => {
    if (!isLoggedIn) { window.location.href = "/m/login"; return; }
    onBuy(qty);
  };

  const [watchlisted, setWatchlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-white p-5 flex flex-col gap-4"
      style={{ border: "2px solid #00C896", boxShadow: "0 4px 24px rgba(0,200,150,0.08)" }}>

      {/* Top */}
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black" style={{ background: "#0A1628", color: "#00C896" }}>
          KemeFrac™
        </span>
        <code className="text-sm font-mono font-black" style={{ color: "#00C896" }}>{offering.tokenSymbol}</code>
      </div>

      {/* Availability */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Tokens Available</p>
        <p className="text-2xl font-black" style={{ color: "#0A1628" }}>
          {fmt(offering.tokensAvailable)} <span className="text-base text-gray-400 font-bold">/ {fmt(offering.tokensForSale)}</span>
        </p>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2 mb-1">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: isSoldOut ? "#ef4444" : "#00C896" }} />
        </div>
        <p className="text-[11px] font-black text-right" style={{ color: isSoldOut ? "#ef4444" : "#00C896" }}>{pct}% funded</p>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price */}
      <div>
        <p className="text-xs text-gray-400 mb-0.5">Price per token</p>
        <p className="text-2xl font-black" style={{ color: "#0A1628" }}>{fmt(offering.tokenPriceEGP)} <span className="text-sm text-gray-500 font-bold">EGP</span></p>
        {offering.tokenPriceUSD && (
          <p className="text-xs text-gray-400">≈ ${offering.tokenPriceUSD} USD</p>
        )}
        {offering.expectedAnnualYieldPercent && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400">Expected yield:</span>
            <span className="font-black text-sm" style={{ color: "#F59E0B" }}>{offering.expectedAnnualYieldPercent}%/year</span>
            <span className="text-xs text-gray-400">
              = {fmt(offering.tokenPriceEGP * offering.expectedAnnualYieldPercent / 100)} EGP/token/yr
            </span>
          </div>
        )}
      </div>

      {!isSoldOut && (
        <>
          <div className="border-t border-gray-100" />

          {/* Qty selector */}
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2">How many tokens?</p>
            <div className="flex items-center gap-3 justify-center mb-3">
              <button onClick={() => adjustQty(-1)} disabled={qty <= min}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 text-xl font-black text-gray-700 hover:border-[#00C896] disabled:opacity-30 transition-colors">
                −
              </button>
              <input type="number" value={qty} onChange={e => handleInput(e.target.value)}
                className="w-20 text-center text-xl font-black border-2 rounded-xl py-2 focus:outline-none focus:border-[#00C896]"
                style={{ borderColor: "#00C896" }} />
              <button onClick={() => adjustQty(1)} disabled={qty >= max}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 text-xl font-black text-gray-700 hover:border-[#00C896] disabled:opacity-30 transition-colors">
                +
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Min {min} · Max {fmt(max)} tokens</p>
          </div>

          {/* Total calculation */}
          <div className="rounded-xl p-4 space-y-1.5 text-sm" style={{ background: "#F8FAFB", border: "1px solid #e5e7eb" }}>
            {[
              ["Tokens", `${qty}`],
              ["Subtotal", `${fmt(subtotal)} EGP`],
              ["Platform fee", `${fmt(fee)} EGP`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-gray-500">
                <span>{label}</span>
                <span className="font-bold text-gray-700">{val}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 my-1" />
            <div className="flex justify-between font-black">
              <span style={{ color: "#0A1628" }}>TOTAL</span>
              <span style={{ color: "#0A1628" }}>{fmt(total)} EGP</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Ownership</span>
              <span className="font-bold">{ownership}%</span>
            </div>
            {annualReturn && (
              <p className="text-xs font-bold mt-1" style={{ color: "#00C896" }}>
                Your estimated annual return: {fmt(annualReturn)} EGP
              </p>
            )}
          </div>

          {/* Buy button */}
          {!isLoggedIn ? (
            <Link href="/m/login"
              className="w-full text-center py-3.5 rounded-xl font-black text-sm transition-all"
              style={{ background: "#0A1628", color: "#00C896" }}>
              Sign in to invest →
            </Link>
          ) : !hasKYC ? (
            <Link href="/kemefrac/kyc"
              className="w-full text-center py-3.5 rounded-xl font-black text-sm transition-all"
              style={{ background: "#00C896", color: "#0A1628" }}>
              Complete KYC to Invest →
            </Link>
          ) : (
            <button onClick={handleBuyClick}
              className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
              style={{ background: "#0A1628", color: "#00C896", boxShadow: "0 0 16px rgba(0,200,150,0.25)" }}>
              🔐 Buy Tokens Now
            </button>
          )}
        </>
      )}

      {isSoldOut && (
        <div className="text-center py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="font-black text-red-600">SOLD OUT</p>
          <p className="text-xs text-red-400 mt-0.5">All tokens have been sold</p>
        </div>
      )}

      {/* Trust row */}
      <div className="flex items-center justify-between text-[10px] text-gray-400 flex-wrap gap-y-1">
        <span>🔗 NEAR Blockchain</span>
        <span>🔐 KYC Protected</span>
        <span>🏅 Verify Pro™</span>
      </div>

      <div className="border-t border-gray-100" />

      {/* Watchlist */}
      <div className="flex items-center justify-between">
        <button onClick={() => setWatchlisted(!watchlisted)}
          className="flex items-center gap-2 text-sm font-bold border rounded-xl px-3 py-2 transition-all"
          style={{ borderColor: watchlisted ? "#00C896" : "#e5e7eb", color: watchlisted ? "#00C896" : "#6b7280" }}>
          {watchlisted ? "♥" : "♡"} {watchlisted ? "Watching" : "Add to Watchlist"}
        </button>
        <span className="text-xs text-gray-400">{offering.watchlistCount || 0} watching</span>
      </div>

      {/* Share */}
      <div className="flex items-center gap-2">
        <button onClick={copyLink}
          className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#00C896] transition-colors">
          {copied ? "✅ Copied!" : "🔗 Copy Link"}
        </button>
        <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-green-400 transition-colors">
          💬 WhatsApp
        </a>
        <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-blue-400 transition-colors">
          ✈️ Telegram
        </a>
      </div>
    </div>
  );
}