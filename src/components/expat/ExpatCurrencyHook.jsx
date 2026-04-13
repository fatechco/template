import { useState } from "react";
import { Link } from "react-router-dom";

const FX_FLAGS = { AED: "🇦🇪", SAR: "🇸🇦", QAR: "🇶🇦", KWD: "🇰🇼", USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺" };

const YIELD_ZONES = [
  { area: "New Cairo", yield: "6.8%", trend: "↑", appreciation: "+18% last 2yr" },
  { area: "Sheikh Zayed", yield: "7.2%", trend: "↑", appreciation: "+22% last 2yr" },
  { area: "Maadi", yield: "5.9%", trend: "→", appreciation: "+12% last 2yr" },
  { area: "North Coast", yield: "9.1%", trend: "↑", appreciation: "+31% last 2yr" },
];

export default function ExpatCurrencyHook({ currency = "AED", rate = 14.3, flag = "🇦🇪", properties = [] }) {
  const [amount, setAmount] = useState(500000);
  const egpAmount = amount * rate;

  const fmt = (n, cur) => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(n) + " " + cur;

  return (
    <div className="bg-[#0d1b3e] py-14 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-2">{flag} Prices in Your Currency</p>
          <h2 className="text-3xl font-black">How Much Can You Buy in Egypt?</h2>
          <p className="text-blue-200 mt-2">Move the slider to see what your budget gets you</p>
        </div>

        {/* Slider */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-200">Your budget</span>
            <span className="text-2xl font-black text-white">{flag} {fmt(amount, currency)}</span>
          </div>
          <input
            type="range" min={50000} max={2000000} step={10000}
            value={amount} onChange={e => setAmount(Number(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer mb-4"
          />
          <div className="flex items-center justify-between bg-orange-500/20 border border-orange-500/40 rounded-xl px-4 py-3">
            <span className="text-blue-200 text-sm">= in Egypt</span>
            <span className="text-2xl font-black text-orange-400">{fmt(egpAmount, "EGP")}</span>
          </div>
          <p className="text-center text-xs text-blue-300 mt-2">Rate: 1 {currency} = {rate} EGP (indicative)</p>
        </div>

        {/* Sample properties */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {properties.map(p => {
            const localPrice = Math.round(p.egp / rate);
            const canAfford = egpAmount >= p.egp;
            return (
              <div key={p.name} className={`rounded-2xl overflow-hidden border-2 transition-all ${canAfford ? "border-green-400" : "border-white/20"}`}>
                <div className="relative h-36">
                  <img src={p.img} alt={p.name} className={`w-full h-full object-cover ${canAfford ? "opacity-100" : "opacity-40 grayscale"}`} />
                  <div className={`absolute top-2 right-2 text-xs font-black px-2 py-1 rounded-full ${canAfford ? "bg-green-500 text-white" : "bg-gray-600 text-gray-300"}`}>
                    {canAfford ? "✅ In budget" : "↑ Above budget"}
                  </div>
                </div>
                <div className="bg-white/10 p-3">
                  <p className="font-bold text-white text-sm">{p.name}</p>
                  <p className="text-orange-400 font-black">{fmt(localPrice, currency)}</p>
                  <p className="text-blue-300 text-xs">{fmt(p.egp, "EGP")}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Yield zones */}
        <div className="grid sm:grid-cols-4 gap-3 mb-8">
          {YIELD_ZONES.map(z => (
            <div key={z.area} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
              <p className="font-black text-white">{z.area}</p>
              <p className="text-2xl font-black text-green-400 mt-1">{z.yield} <span className="text-green-300">{z.trend}</span></p>
              <p className="text-[10px] text-blue-300">Gross rental yield</p>
              <p className="text-[10px] text-orange-300 mt-1">{z.appreciation}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/kemedar/expat/setup" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105">
            Find Properties in My Budget →
          </Link>
        </div>
      </div>
    </div>
  );
}