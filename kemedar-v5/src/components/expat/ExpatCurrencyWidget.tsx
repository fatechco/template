"use client";
// @ts-nocheck
// Re-export ExpatCurrencyHook as a simpler inline widget
import { useState } from "react";

const FX_RATES = { AED: 14.3, SAR: 13.9, QAR: 14.4, KWD: 171.0, USD: 52.5, GBP: 66.0, EUR: 57.0 };
const FX_FLAGS = { AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦", KWD: "🇰🇼", USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺" };

export default function ExpatCurrencyWidget({ currency = "AED" }) {
  const [amount, setAmount] = useState(10000);
  const rate = FX_RATES[currency] || 14.3;
  const flag = FX_FLAGS[currency] || "🌍";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="font-black text-gray-900 text-sm mb-3">💱 Live Rates → EGP</p>
      {Object.entries(FX_RATES).map(([cur, r]) => (
        <div key={cur} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
          <span className="text-sm font-bold text-gray-700">{FX_FLAGS[cur]} 1 {cur}</span>
          <span className="text-sm font-black text-gray-900">{r} EGP</span>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 mt-2 text-center">Updated daily</p>
      <div className="mt-3 bg-orange-50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value) || 0)}
            className="flex-1 text-lg font-black bg-transparent outline-none min-w-0" />
          <span className="text-sm font-bold text-gray-500">{currency}</span>
        </div>
        <p className="text-sm font-black text-orange-600">= {new Intl.NumberFormat("en-EG").format(amount * rate)} EGP</p>
      </div>
    </div>
  );
}