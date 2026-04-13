import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import VerifyProBadge from "@/components/verify/VerifyProBadge";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_OFFERINGS = [
  {
    id: "frac-1",
    offeringTitle: "New Cairo Apartment — Frac Series A",
    city: "New Cairo", district: "5th Settlement",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    offeringType: "fractional_investment",
    tokenPriceEGP: 1000, expectedAnnualYieldPercent: 9.5, yieldFrequency: "monthly",
    tokensForSale: 1000, tokensSold: 820, minTokensPerBuyer: 5,
    status: "live", isFeatured: true, isVerified: true, verificationLevel: 5,
  },
  {
    id: "frac-2",
    offeringTitle: "Sheikh Zayed Villa — Ownership Tokens",
    city: "Sheikh Zayed", district: "Beverly Hills",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    offeringType: "fractional_sale",
    tokenPriceEGP: 5000, expectedAnnualYieldPercent: null, yieldFrequency: null,
    tokensForSale: 500, tokensSold: 180, minTokensPerBuyer: 1,
    status: "live", isFeatured: true, isVerified: true, verificationLevel: 4,
  },
  {
    id: "frac-3",
    offeringTitle: "North Coast Chalet — Summer Yield Fund",
    city: "North Coast", district: "Sidi Abd El Rahman",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    offeringType: "fractional_investment",
    tokenPriceEGP: 800, expectedAnnualYieldPercent: 11.2, yieldFrequency: "quarterly",
    tokensForSale: 2000, tokensSold: 2000, minTokensPerBuyer: 10,
    status: "sold_out", isFeatured: true, isVerified: true, verificationLevel: 5,
  },
  {
    id: "frac-4",
    offeringTitle: "Maadi Office Unit — Commercial Yield",
    city: "Maadi", district: "Maadi Corniche",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    offeringType: "fractional_investment",
    tokenPriceEGP: 2000, expectedAnnualYieldPercent: 8.0, yieldFrequency: "monthly",
    tokensForSale: 750, tokensSold: 390, minTokensPerBuyer: 2,
    status: "live", isFeatured: false, isVerified: true, verificationLevel: 3,
  },
  {
    id: "frac-5",
    offeringTitle: "6th October Compound Unit — Family Yield",
    city: "6th October", district: "Hayy 11",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    offeringType: "fractional_investment",
    tokenPriceEGP: 500, expectedAnnualYieldPercent: 7.5, yieldFrequency: "quarterly",
    tokensForSale: 3000, tokensSold: 900, minTokensPerBuyer: 5,
    status: "live", isFeatured: false, isVerified: true, verificationLevel: 4,
  },
  {
    id: "frac-6",
    offeringTitle: "Heliopolis Penthouse — Premium Tokens",
    city: "Heliopolis", district: "Korba",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    offeringType: "fractional_sale",
    tokenPriceEGP: 10000, expectedAnnualYieldPercent: null, yieldFrequency: null,
    tokensForSale: 200, tokensSold: 60, minTokensPerBuyer: 1,
    status: "live", isFeatured: false, isVerified: true, verificationLevel: 5,
  },
];

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(n) : "—";

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: "#0A1628", minHeight: 480 }}
    >
      {/* Geometric grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00C896" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Teal glow top-right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #00C89614 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

      <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto w-full">
        {/* NEAR pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-bold"
          style={{ background: "#00C89620", border: "1px solid #00C89640", color: "#00C896" }}>
          <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse flex-shrink-0" />
          Powered by NEAR Protocol
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
          Own a Fraction.<br />
          <span style={{ color: "#00C896" }}>Earn Real Returns.</span>
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          Invest in Egyptian real estate from any budget.
          Buy tokens, earn rental yield, trade your stake.
          Powered by NEAR blockchain.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 flex-wrap mb-10">
          {[
            { num: "124", label: "Properties" },
            { num: "EGP 500", label: "Min Investment" },
            { num: "8.9%", label: "Avg Annual Yield" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black" style={{ color: "#00C896" }}>{s.num}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#offerings"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
            style={{ background: "#00C896", color: "#0A1628" }}>
            🔍 Browse Offerings
          </a>
          <a href="#how-it-works"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm border transition-all hover:bg-white/10"
            style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "white" }}>
            Learn How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01", icon: "🔍", bg: "#00C896", color: "#0A1628",
      title: "Browse Verified Properties",
      body: "All KemeFrac™ properties are Kemedar Verified. Review financials, location, and expected yield.",
    },
    {
      num: "02", icon: "💎", bg: "#0A1628", color: "#00C896",
      title: "Buy Tokens on NEAR",
      body: "Purchase as many tokens as you want. Each token = a fraction of ownership. No crypto wallet needed.",
    },
    {
      num: "03", icon: "💰", bg: "#F59E0B", color: "#1a1a2e",
      title: "Earn Returns",
      body: "Receive your share of rental income. Monthly, quarterly, or annual payouts direct to your Kemedar wallet.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12" style={{ color: "#0A1628" }}>
          How KemeFrac™ Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col items-start gap-4">
              <div className="absolute top-4 right-5 text-5xl font-black opacity-[0.06]" style={{ color: "#0A1628" }}>{s.num}</div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="font-black text-gray-900 text-base mb-2">{s.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FRAC CARD ────────────────────────────────────────────────────────────────
function FracCard({ offering }) {
  const pct = offering.tokensForSale > 0
    ? Math.round((offering.tokensSold / offering.tokensForSale) * 100)
    : 0;
  const isSoldOut = offering.status === "sold_out" || pct >= 100;
  const isHot = pct >= 80 && !isSoldOut;
  const typeLabel = offering.offeringType === "fractional_investment" ? "💰 Yield" : "🏢 Sale";

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "0.5px solid #E5E7EB", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

      {/* Image */}
      <div className="relative" style={{ height: 200 }}>
        <img src={offering.image || `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80`}
          alt={offering.offeringTitle}
          className="w-full h-full object-cover" />

        {/* KemeFrac badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black"
          style={{ background: "#0A1628", color: "#00C896" }}>
          KemeFrac™
        </span>

        {/* Type badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white text-gray-800 shadow-sm">
          {typeLabel}
        </span>

        {/* Sold out / hot overlay */}
        {isSoldOut && (
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white">
            SOLD OUT
          </span>
        )}
        {isHot && (
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>🔥 {pct}% sold</span>
            </div>
            <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#00C896" }} />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-black text-gray-900 text-sm leading-snug line-clamp-2">{offering.offeringTitle}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            📍 {offering.city}, {offering.district}
          </p>
        </div>

        <div className="border-t border-gray-100" />

        {/* Stats 2×2 */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
          <div>
            <p className="text-gray-400">Token Price</p>
            <p className="font-black text-gray-900">{fmt(offering.tokenPriceEGP)} EGP</p>
          </div>
          <div>
            <p className="text-gray-400">Annual Yield</p>
            <p className="font-black" style={{ color: offering.expectedAnnualYieldPercent ? "#00C896" : "#9ca3af" }}>
              {offering.expectedAnnualYieldPercent ? `${offering.expectedAnnualYieldPercent}% / yr` : "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Available</p>
            <p className="font-black text-gray-900">{fmt(offering.tokensForSale - offering.tokensSold)} tokens</p>
          </div>
          <div>
            <p className="text-gray-400">Min. Buy</p>
            <p className="font-black text-gray-900">{offering.minTokensPerBuyer} token{offering.minTokensPerBuyer !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">{fmt(offering.tokensSold)} of {fmt(offering.tokensForSale)} tokens sold</span>
            <span className="font-black" style={{ color: "#00C896" }}>{pct}% funded</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: isSoldOut ? "#ef4444" : "#00C896" }} />
          </div>
        </div>

        {/* Verify badge */}
        <div className="flex items-center gap-2">
          <VerifyProBadge level={offering.verificationLevel} size="sm" />
        </div>

        {/* CTA */}
        <Link to={`/kemefrac/${offering.id}`}
          className="mt-auto w-full text-center py-2.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
          style={{ background: isSoldOut ? "#f3f4f6" : "#00C896", color: isSoldOut ? "#9ca3af" : "#0A1628" }}>
          {isSoldOut ? "View Details" : "View Offering →"}
        </Link>
      </div>
    </div>
  );
}

// ─── FEATURED ─────────────────────────────────────────────────────────────────
function FeaturedOfferings({ offerings }) {
  const featured = offerings.filter((o) => o.isFeatured).slice(0, 3);
  return (
    <section className="py-16 px-4" style={{ background: "#F8FAFB" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black" style={{ color: "#0A1628" }}>Featured Offerings</h2>
          <a href="#offerings" className="text-sm font-bold hover:underline" style={{ color: "#00C896" }}>View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((o) => <FracCard key={o.id} offering={o} />)}
        </div>
      </div>
    </section>
  );
}

// ─── ALL OFFERINGS ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "yield", label: "Highest Yield" },
  { value: "price_asc", label: "Price Low→High" },
  { value: "funded", label: "% Funded" },
];

function AllOfferings({ offerings }) {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [yieldMin, setYieldMin] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [status, setStatus] = useState("live");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const cities = [...new Set(offerings.map((o) => o.city))];

  const filtered = offerings.filter((o) => {
    if (city && o.city !== city) return false;
    if (type && o.offeringType !== type) return false;
    if (yieldMin) {
      const min = parseFloat(yieldMin);
      if (!o.expectedAnnualYieldPercent || o.expectedAnnualYieldPercent < min) return false;
    }
    if (priceRange === "lt1k" && o.tokenPriceEGP >= 1000) return false;
    if (priceRange === "1k5k" && (o.tokenPriceEGP < 1000 || o.tokenPriceEGP > 5000)) return false;
    if (priceRange === "gt5k" && o.tokenPriceEGP <= 5000) return false;
    if (status === "live" && o.status !== "live") return false;
    if (status === "sold_out" && o.status !== "sold_out") return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "yield") return (b.expectedAnnualYieldPercent || 0) - (a.expectedAnnualYieldPercent || 0);
    if (sort === "price_asc") return a.tokenPriceEGP - b.tokenPriceEGP;
    if (sort === "funded") {
      const pa = a.tokensForSale > 0 ? a.tokensSold / a.tokensForSale : 0;
      const pb = b.tokensForSale > 0 ? b.tokensSold / b.tokensForSale : 0;
      return pb - pa;
    }
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAll = () => { setCity(""); setType(""); setYieldMin(""); setPriceRange(""); setStatus("live"); setPage(1); };

  const selectClass = "border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#00C896] cursor-pointer";

  return (
    <section id="offerings" className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-black mb-6" style={{ color: "#0A1628" }}>All Offerings</h2>

        {/* Filter bar */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-end border border-gray-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">City</label>
            <select value={city} onChange={e => { setCity(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
            <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All Types</option>
              <option value="fractional_sale">Fractional Sale</option>
              <option value="fractional_investment">Yield Investment</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Min Yield</label>
            <select value={yieldMin} onChange={e => { setYieldMin(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">Any</option>
              <option value="5">5%+</option>
              <option value="8">8%+</option>
              <option value="10">10%+</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Token Price</label>
            <select value={priceRange} onChange={e => { setPriceRange(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">Any</option>
              <option value="lt1k">Under 1K EGP</option>
              <option value="1k5k">1K–5K EGP</option>
              <option value="gt5k">5K+ EGP</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
              <option value="">All</option>
              <option value="live">Live</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>
          <button onClick={clearAll} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            Clear
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="font-black text-gray-900">{sorted.length}</span> offerings found
            </span>
            <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏗️</p>
            <p className="font-bold">No offerings match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((o) => <FracCard key={o.id} offering={o} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#00C896] disabled:opacity-40">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                className="w-9 h-9 rounded-xl text-sm font-black transition-all"
                style={{ background: page === i + 1 ? "#00C896" : "transparent", color: page === i + 1 ? "#0A1628" : "#6b7280", border: page === i + 1 ? "none" : "1px solid #e5e7eb" }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#00C896] disabled:opacity-40">
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── WHY KEMEFRAC ─────────────────────────────────────────────────────────────
function WhyKemeFrac() {
  const tiles = [
    { icon: "🔐", title: "NEAR Blockchain Security", body: "Every token is recorded on NEAR Protocol. Immutable, transparent, auditable." },
    { icon: "🏅", title: "Verified Properties Only", body: "All offerings require Kemedar Verify Pro™ Level 3 certification or above." },
    { icon: "💰", title: "Real Rental Yields", body: "Earn passive income from actual tenants. Distributed directly to your account." },
    { icon: "🌍", title: "Start from Any Budget", body: "Token prices start from 500 EGP. No minimum property purchase required." },
  ];

  return (
    <section className="py-20 px-4" style={{ background: "#0A1628" }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-white text-center mb-12">Why Invest with KemeFrac™?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tiles.map((t) => (
            <div key={t.title} className="rounded-2xl p-6 flex gap-4 items-start"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-3xl flex-shrink-0">{t.icon}</span>
              <div>
                <p className="font-black text-white mb-1">{t.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{t.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TRUST STRIP ─────────────────────────────────────────────────────────────
function TrustStrip() {
  const badges = [
    { icon: "⛓️", label: "NEAR Protocol Partner" },
    { icon: "✅", label: "Kemedar Verify Pro™ Certified" },
    { icon: "🪪", label: "KYC Protected" },
    { icon: "🏛️", label: "Licensed Real Estate Platform" },
    { icon: "🔒", label: "256-bit Encrypted" },
  ];
  return (
    <section className="bg-white border-y border-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center flex-wrap gap-6 md:gap-10">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-sm font-bold text-gray-500">
              <span className="text-xl">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-16 px-4 text-center" style={{ background: "#00C896" }}>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-black mb-3" style={{ color: "#0A1628" }}>Ready to Start Investing?</h2>
        <p className="mb-8 leading-relaxed" style={{ color: "#0A162899" }}>
          Join thousands of investors fractionalizing Egyptian real estate.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/m/account"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
            style={{ background: "#0A1628", color: "white" }}>
            🚀 Get Started — It&apos;s Free
          </Link>
          <a href="#how-it-works"
            className="text-sm font-bold underline-offset-2 hover:underline"
            style={{ color: "#0A1628" }}>
            Learn about KYC →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function KemeFrac() {
  const [offerings, setOfferings] = useState(MOCK_OFFERINGS);

  useEffect(() => {
    base44.entities.FracProperty.filter({ status: "live" }, "-created_date", 100)
      .then((data) => {
        if (data && data.length > 0) setOfferings(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <Hero />
      <HowItWorks />
      <FeaturedOfferings offerings={offerings} />
      <AllOfferings offerings={offerings} />
      <WhyKemeFrac />
      <TrustStrip />
      <CTABanner />
      <SuperFooter />
    </div>
  );
}