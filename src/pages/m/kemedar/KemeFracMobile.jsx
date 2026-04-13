import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const MOCK_OFFERINGS = [
  { id: "frac-1", offeringTitle: "New Cairo Apartment — Frac Series A", city: "New Cairo", district: "5th Settlement", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", offeringType: "fractional_investment", tokenPriceEGP: 1000, expectedAnnualYieldPercent: 9.5, tokensForSale: 1000, tokensSold: 820, minTokensPerBuyer: 5, status: "live", isFeatured: true },
  { id: "frac-2", offeringTitle: "Sheikh Zayed Villa — Ownership Tokens", city: "Sheikh Zayed", district: "Beverly Hills", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", offeringType: "fractional_sale", tokenPriceEGP: 5000, expectedAnnualYieldPercent: null, tokensForSale: 500, tokensSold: 180, minTokensPerBuyer: 1, status: "live", isFeatured: true },
  { id: "frac-3", offeringTitle: "North Coast Chalet — Summer Yield Fund", city: "North Coast", district: "Sidi Abd El Rahman", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", offeringType: "fractional_investment", tokenPriceEGP: 800, expectedAnnualYieldPercent: 11.2, tokensForSale: 2000, tokensSold: 2000, minTokensPerBuyer: 10, status: "sold_out", isFeatured: true },
  { id: "frac-4", offeringTitle: "Maadi Office Unit — Commercial Yield", city: "Maadi", district: "Maadi Corniche", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", offeringType: "fractional_investment", tokenPriceEGP: 2000, expectedAnnualYieldPercent: 8.0, tokensForSale: 750, tokensSold: 390, minTokensPerBuyer: 2, status: "live", isFeatured: false },
  { id: "frac-5", offeringTitle: "6th October Compound Unit — Family Yield", city: "6th October", district: "Hayy 11", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80", offeringType: "fractional_investment", tokenPriceEGP: 500, expectedAnnualYieldPercent: 7.5, tokensForSale: 3000, tokensSold: 900, minTokensPerBuyer: 5, status: "live", isFeatured: false },
  { id: "frac-6", offeringTitle: "Heliopolis Penthouse — Premium Tokens", city: "Heliopolis", district: "Korba", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", offeringType: "fractional_sale", tokenPriceEGP: 10000, expectedAnnualYieldPercent: null, tokensForSale: 200, tokensSold: 60, minTokensPerBuyer: 1, status: "live", isFeatured: false },
];

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(n) : "—";

const TABS = [
  { id: "all", label: "All" },
  { id: "yield", label: "💰 Yield" },
  { id: "sale", label: "🏢 Sale" },
  { id: "sold_out", label: "Sold Out" },
];

function FracCardMobile({ offering }) {
  const pct = offering.tokensForSale > 0 ? Math.round((offering.tokensSold / offering.tokensForSale) * 100) : 0;
  const isSoldOut = offering.status === "sold_out" || pct >= 100;
  const isHot = pct >= 80 && !isSoldOut;
  const typeLabel = offering.offeringType === "fractional_investment" ? "💰 Yield" : "🏢 Sale";

  return (
    <Link to={`/kemefrac/${offering.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform block">
      <div className="h-36 relative">
        <img src={offering.image} alt="" className="w-full h-full object-cover" />
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: "#0A1628", color: "#00C896" }}>KemeFrac™</span>
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-800 shadow-sm">{typeLabel}</span>
        {isSoldOut && <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">SOLD OUT</span>}
        {isHot && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
            <p className="text-[10px] font-bold text-white mb-0.5">🔥 {pct}% sold</p>
            <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#00C896" }} />
            </div>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-black text-gray-900 text-xs line-clamp-2 mb-1">{offering.offeringTitle}</p>
        <p className="text-[10px] text-gray-400 mb-2">📍 {offering.city}, {offering.district}</p>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-2">
          <div><span className="text-gray-400">Token: </span><span className="font-black text-gray-900">{fmt(offering.tokenPriceEGP)} EGP</span></div>
          <div><span className="text-gray-400">Yield: </span><span className="font-black" style={{ color: offering.expectedAnnualYieldPercent ? "#00C896" : "#9ca3af" }}>{offering.expectedAnnualYieldPercent ? `${offering.expectedAnnualYieldPercent}%` : "—"}</span></div>
        </div>
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-400">{fmt(offering.tokensSold)}/{fmt(offering.tokensForSale)} sold</span>
          <span className="font-black" style={{ color: "#00C896" }}>{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: isSoldOut ? "#ef4444" : "#00C896" }} />
        </div>
      </div>
    </Link>
  );
}

export default function KemeFracMobile() {
  const navigate = useNavigate();
  const [offerings, setOfferings] = useState(MOCK_OFFERINGS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    base44.entities.FracProperty.filter({ status: "live" }, "-created_date", 100)
      .then((data) => { if (data && data.length > 0) setOfferings(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = offerings.filter(o => {
    if (activeTab === "all") return true;
    if (activeTab === "yield") return o.offeringType === "fractional_investment" && o.status === "live";
    if (activeTab === "sale") return o.offeringType === "fractional_sale" && o.status === "live";
    if (activeTab === "sold_out") return o.status === "sold_out";
    return true;
  });

  const liveCount = offerings.filter(o => o.status === "live").length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "#0A1628", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between border-b border-white/10">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/home"); }}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🏛️ KemeFrac™</p>
        <div style={{ width: 36 }} />
      </div>

      {/* Scrollable */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-8 pb-8 text-white text-center" style={{ background: "#0A1628" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold mb-4"
            style={{ background: "#00C89620", border: "1px solid #00C89640", color: "#00C896" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
            Powered by NEAR Protocol
          </div>
          <h1 className="text-2xl font-black mb-2 text-white leading-tight">
            Own a Fraction.<br /><span style={{ color: "#00C896" }}>Earn Real Returns.</span>
          </h1>
          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            Invest in Egyptian real estate from any budget. Buy tokens, earn rental yield, trade your stake.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[{ v: "124", l: "Properties" }, { v: "EGP 500", l: "Min Investment" }, { v: "8.9%", l: "Avg Yield" }].map(s => (
              <div key={s.l} className="rounded-xl py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="text-base font-black" style={{ color: "#00C896" }}>{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <Link to="/kemefrac/portfolio" className="px-5 py-2.5 rounded-xl font-black text-xs" style={{ background: "#00C896", color: "#0A1628" }}>
              📊 My Portfolio
            </Link>
            <Link to="/kemefrac/kyc" className="px-5 py-2.5 rounded-xl font-black text-xs border" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
              🪪 Complete KYC
            </Link>
          </div>
        </div>

        {/* How it works strip */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {[
              { icon: "🔍", t: "Browse Properties", d: "Verified offerings" },
              { icon: "💎", t: "Buy Tokens", d: "NEAR blockchain" },
              { icon: "💰", t: "Earn Returns", d: "Monthly payouts" },
            ].map((s, i) => (
              <div key={i} className="flex-shrink-0 text-center" style={{ width: 80 }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-[10px] font-black text-gray-900">{s.t}</p>
                <p className="text-[9px] text-gray-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{ background: activeTab === tab.id ? "#0A1628" : "#f3f4f6", color: activeTab === tab.id ? "#00C896" : "#374151" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offerings */}
        <div className="px-4 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-gray-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🏗️</div>
              <p className="font-black text-gray-700 mb-1">No offerings found</p>
              <p className="text-gray-500 text-xs">Try a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(o => <FracCardMobile key={o.id} offering={o} />)}
            </div>
          )}
        </div>

        {/* Why KemeFrac */}
        <div className="px-4 py-6">
          <h2 className="font-black text-gray-900 text-base mb-3">Why Invest with KemeFrac™?</h2>
          <div className="space-y-2.5">
            {[
              { icon: "🔐", title: "NEAR Blockchain", desc: "Immutable, transparent, auditable" },
              { icon: "🏅", title: "Verified Properties", desc: "Level 3+ Verify Pro certified" },
              { icon: "💰", title: "Real Yields", desc: "Passive income from actual tenants" },
              { icon: "🌍", title: "Any Budget", desc: "Start from just 500 EGP" },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <div>
                  <p className="font-black text-gray-900 text-xs">{t.title}</p>
                  <p className="text-[10px] text-gray-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-center" style={{ background: "#00C896" }}>
          <p className="font-black text-base mb-1" style={{ color: "#0A1628" }}>Ready to Start Investing?</p>
          <p className="text-xs mb-3" style={{ color: "#0A162899" }}>Join thousands fractionalizing Egyptian real estate.</p>
          <Link to="/m/account" className="inline-block px-6 py-2.5 rounded-xl font-black text-sm text-white" style={{ background: "#0A1628" }}>
            🚀 Get Started — Free
          </Link>
        </div>

        {/* Trust strip */}
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {["⛓️ NEAR Partner", "✅ Verify Pro™", "🪪 KYC Protected", "🔒 Encrypted"].map(b => (
              <span key={b} className="flex-shrink-0 text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">{b}</span>
            ))}
          </div>
        </div>

        <div className="h-20" />
      </div>

      <MobileBottomNav />
    </div>
  );
}