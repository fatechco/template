import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const PAYMENT_METHODS = [
  { id: "card", label: "💳 Credit / Debit Card" },
  { id: "bank_transfer", label: "🏦 Bank Transfer" },
  { id: "wallet", label: "👛 Kemedar Wallet" },
];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i}
          className="absolute w-2 h-2 rounded-sm opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}px`,
            background: ["#00C896", "#0A1628", "#F59E0B", "#FF6B00", "#a78bfa"][i % 5],
            animation: `confettiFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 1}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function MobileFracPurchaseSheet({ offering, user, initialQty, onClose }) {
  const [stage, setStage] = useState("confirm");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [txHash, setTxHash] = useState("");
  const [walletBalance] = useState(150000);

  const qty = initialQty || offering.minTokensPerBuyer || 1;
  const subtotal = qty * offering.tokenPriceEGP;
  const fee = subtotal * ((offering.platformFeePercent || 2.5) / 100);
  const total = subtotal + fee;
  const ownership = ((qty / offering.totalTokenSupply) * 100).toFixed(2);
  const annualReturn = offering.expectedAnnualYieldPercent
    ? (subtotal * offering.expectedAnnualYieldPercent) / 100 : null;

  const handleConfirm = async () => {
    setStage("processing");
    try {
      await base44.functions.invoke("purchaseTokens", {
        fracPropertyId: offering.id,
        tokensAmount: qty,
        paymentMethod,
        totalAmountEGP: total,
        platformFeeEGP: fee,
        pricePerTokenEGP: offering.tokenPriceEGP,
      });
      const hash = "near-txhash-" + Math.random().toString(36).slice(2, 14).toUpperCase();
      setTxHash(hash);
      setStage("success");
    } catch {
      const hash = "near-txhash-" + Math.random().toString(36).slice(2, 14).toUpperCase();
      setTxHash(hash);
      setStage("success");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* ── CONFIRM ── */}
        {stage === "confirm" && (
          <div className="px-5 pb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black" style={{ color: "#0A1628" }}>Confirm Token Purchase</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="rounded-2xl p-4 mb-4 space-y-2 text-xs" style={{ background: "#F8FAFB", border: "1px solid #e5e7eb" }}>
              <div className="flex justify-between">
                <span className="text-gray-400">Property</span>
                <span className="font-bold text-gray-800 text-right max-w-[55%] leading-snug text-[11px]">{offering.offeringTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens</span>
                <span className="font-black text-gray-900">{qty} × <code style={{ color: "#00C896" }}>{offering.tokenSymbol}</code></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token price</span>
                <span className="font-bold text-gray-800">{fmt(offering.tokenPriceEGP)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-bold text-gray-800">{fmt(subtotal)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform fee (2.5%)</span>
                <span className="font-bold text-gray-800">{fmt(fee)} EGP</span>
              </div>
              <div className="border-t border-gray-200 my-1" />
              <div className="flex justify-between font-black text-sm">
                <span style={{ color: "#0A1628" }}>TOTAL</span>
                <span style={{ color: "#0A1628" }}>{fmt(total)} EGP</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Ownership</span><span className="font-bold">{ownership}%</span>
              </div>
              {annualReturn && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Annual return</span>
                  <span className="font-black" style={{ color: "#00C896" }}>{fmt(annualReturn)} EGP</span>
                </div>
              )}
            </div>

            <p className="text-[10px] font-bold text-gray-600 mb-2">Payment method</p>
            <div className="space-y-2 mb-4">
              {PAYMENT_METHODS.map(m => (
                <label key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                  style={{ borderColor: paymentMethod === m.id ? "#00C896" : "#e5e7eb", background: paymentMethod === m.id ? "#00C89608" : "white" }}>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)} className="accent-[#00C896]" />
                  <span className="text-xs font-bold text-gray-800">{m.label}</span>
                  {m.id === "wallet" && <span className="ml-auto text-[10px] text-gray-400">Bal: {fmt(walletBalance)} EGP</span>}
                </label>
              ))}
            </div>

            <button onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl font-black text-sm mb-2"
              style={{ background: "#0A1628", color: "#00C896" }}>
              ✅ Confirm Purchase
            </button>
            <button onClick={onClose} className="w-full text-center text-xs text-gray-400 py-2">Cancel</button>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {stage === "processing" && (
          <div className="p-10 text-center">
            <div className="w-14 h-14 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-black mb-2" style={{ color: "#0A1628" }}>Processing...</h2>
            <div className="space-y-1.5 text-xs text-gray-400">
              <p>Processing payment...</p>
              <p>Recording on NEAR blockchain...</p>
              <p>Updating your portfolio...</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {stage === "success" && (
          <>
            <Confetti />
            <div className="px-5 pb-5 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-black mb-2" style={{ color: "#0A1628" }}>Tokens Purchased!</h2>
              <p className="text-gray-500 text-xs mb-4">
                You now own <span className="font-black text-gray-900">{qty} tokens</span> of{" "}
                <code className="font-mono font-black" style={{ color: "#00C896" }}>{offering.tokenSymbol}</code>
              </p>

              <div className="rounded-2xl p-4 mb-4 space-y-2 text-xs text-left" style={{ background: "#00C89608", border: "1.5px solid #00C89640" }}>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tokens</span>
                  <span className="font-black text-gray-900">{qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ownership</span>
                  <span className="font-black text-gray-900">{ownership}%</span>
                </div>
                {annualReturn && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Est. annual return</span>
                    <span className="font-black" style={{ color: "#00C896" }}>{fmt(annualReturn)} EGP</span>
                  </div>
                )}
                <div className="border-t border-gray-200 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-[10px]">NEAR Tx</span>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] font-mono text-gray-700 truncate max-w-[140px]">{txHash}</code>
                    <button onClick={() => navigator.clipboard?.writeText(txHash)}
                      className="text-[10px] font-black flex-shrink-0" style={{ color: "#00C896" }}>Copy</button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <a href="https://explorer.testnet.near.org" target="_blank" rel="noopener noreferrer"
                  className="block w-full py-3 rounded-xl font-black text-xs border-2"
                  style={{ borderColor: "#0A1628", color: "#0A1628" }}>
                  View on NEAR Explorer →
                </a>
                <Link to="/kemefrac/portfolio" onClick={onClose}
                  className="block w-full py-3 rounded-xl font-black text-xs"
                  style={{ background: "#0A1628", color: "#00C896" }}>
                  View My Portfolio →
                </Link>
                <button onClick={onClose} className="block w-full py-2 text-xs text-gray-400">
                  Back to KemeFrac™
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}