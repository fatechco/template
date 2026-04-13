import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Loader2, Minus, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";
import MobileFracPurchaseSheet from "@/components/kemefrac/MobileFracPurchaseSheet";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const MOCK_OFFERINGS = [
  {
    id: "frac-1",
    offeringTitle: "New Cairo Apartment — Frac Series A",
    offeringDescription: "A premium fractional investment opportunity in the heart of 5th Settlement, New Cairo. The property is currently tenanted with a long-term corporate lease, providing stable rental income. Investors receive proportional rental yield distributed monthly via the Kemedar platform.",
    offeringDescriptionAr: "فرصة استثمارية مجزأة متميزة في قلب التجمع الخامس، القاهرة الجديدة. العقار مؤجر حاليًا بعقد إيجار تجاري طويل الأجل، مما يوفر دخلاً إيجارياً مستقراً. يحصل المستثمرون على عائد إيجاري تناسبي يوزع شهرياً عبر منصة كيميدار.",
    offeringType: "fractional_investment",
    tokenSymbol: "KMF-NC-001", tokenName: "KemeFrac New Cairo Apt #001",
    tokenPriceEGP: 1000, tokenPriceUSD: 20,
    propertyValuationEGP: 1000000, totalTokenSupply: 1000,
    tokensForSale: 1000, tokensSold: 820, tokensAvailable: 180,
    minTokensPerBuyer: 5, maxTokensPerBuyer: 200,
    expectedAnnualYieldPercent: 9.5, yieldFrequency: "monthly",
    status: "live", isFeatured: true, verificationLevel: 5,
    nearContractAddress: "kmf-nc001.kemefrac.near", nearNetworkType: "testnet",
    nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-nc001.kemefrac.near",
    nearTokenContractDeployed: true, platformFeePercent: 2.5,
    city: "New Cairo", district: "5th Settlement", area: "El Rehab",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80"],
    beds: 3, baths: 2, area_size: 185, floor_number: 8, year_built: 2021, category: "Apartment",
    sellerName: "Ahmed Hassan Properties", sellerRole: "Agency", sellerListings: 12,
    submittedByUserId: "seller-1", propertyId: "prop-1", tokenId: "token-1", watchlistCount: 47,
    latitude: 30.0444, longitude: 31.4357,
    updates: [
      { id: "u1", updateType: "financial_report", title: "Q1 2026 Financial Report", body: "Rental income collected on time. Net yield distributed to all token holders on March 1st.", created_date: "2026-03-05" },
      { id: "u2", updateType: "tenant_news", title: "Lease Renewed for 2 Years", body: "The corporate tenant has renewed their lease agreement for an additional 2 years at a 10% rent increase.", created_date: "2026-01-15" },
    ],
  },
  {
    id: "frac-2",
    offeringTitle: "Sheikh Zayed Villa — Ownership Tokens",
    offeringDescription: "A fractional ownership opportunity in a luxury villa in Beverly Hills, Sheikh Zayed. This is a direct fractional sale — no yield, pure ownership stake.",
    offeringDescriptionAr: "فرصة ملكية جزئية في فيلا فاخرة في بيفرلي هيلز، الشيخ زايد.",
    offeringType: "fractional_sale",
    tokenSymbol: "KMF-SZ-002",
    tokenPriceEGP: 5000, tokenPriceUSD: 100,
    propertyValuationEGP: 2500000, totalTokenSupply: 500,
    tokensForSale: 500, tokensSold: 180, tokensAvailable: 320,
    minTokensPerBuyer: 1, maxTokensPerBuyer: 100,
    expectedAnnualYieldPercent: null, yieldFrequency: null,
    status: "live", isFeatured: true, verificationLevel: 4,
    nearContractAddress: "kmf-sz002.kemefrac.near", nearNetworkType: "testnet",
    nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-sz002.kemefrac.near",
    nearTokenContractDeployed: true, platformFeePercent: 2.5,
    city: "Sheikh Zayed", district: "Beverly Hills", area: "",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"],
    beds: 5, baths: 4, area_size: 380, floor_number: null, year_built: 2023, category: "Villa",
    sellerName: "Zayed Realty Group", sellerRole: "Developer", sellerListings: 8,
    submittedByUserId: "seller-2", propertyId: "prop-2", tokenId: "token-2", watchlistCount: 31,
    latitude: 30.0131, longitude: 31.0095,
    updates: [],
  },
  {
    id: "frac-3",
    offeringTitle: "North Coast Chalet — Summer Yield Fund",
    offeringDescription: "A seasonal yield fund backed by a premium chalet in Sidi Abd El Rahman, North Coast. High summer rental demand drives above-average returns distributed quarterly.",
    offeringDescriptionAr: "صندوق عائد موسمي مدعوم بشاليه فاخر في سيدي عبد الرحمن، الساحل الشمالي.",
    offeringType: "fractional_investment",
    tokenSymbol: "KMF-NC-003",
    tokenPriceEGP: 800, tokenPriceUSD: 16,
    propertyValuationEGP: 1600000, totalTokenSupply: 2000,
    tokensForSale: 2000, tokensSold: 2000, tokensAvailable: 0,
    minTokensPerBuyer: 10, maxTokensPerBuyer: 500,
    expectedAnnualYieldPercent: 11.2, yieldFrequency: "quarterly",
    status: "sold_out", isFeatured: true, verificationLevel: 5,
    nearContractAddress: "kmf-nc003.kemefrac.near", nearNetworkType: "testnet",
    nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-nc003.kemefrac.near",
    nearTokenContractDeployed: true, platformFeePercent: 2.5,
    city: "North Coast", district: "Sidi Abd El Rahman", area: "",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"],
    beds: 3, baths: 2, area_size: 150, floor_number: 2, year_built: 2022, category: "Chalet",
    sellerName: "Sahel Premium Estates", sellerRole: "Agency", sellerListings: 5,
    submittedByUserId: "seller-3", propertyId: "prop-3", tokenId: "token-3", watchlistCount: 62,
    latitude: 31.0, longitude: 28.5,
    updates: [
      { id: "u3", updateType: "yield_announcement", title: "Summer 2025 Yield Distributed", body: "All token holders received their Q3 yield payout. 11.2% annualized rate maintained.", created_date: "2025-10-01" },
    ],
  },
];

const TABS = ["Overview", "Financials", "Property", "Updates", "Legal"];
const UPDATE_COLORS = {
  financial_report: "bg-blue-100 text-blue-700",
  tenant_news: "bg-green-100 text-green-700",
  maintenance_update: "bg-yellow-100 text-yellow-700",
  yield_announcement: "bg-teal-100 text-teal-700",
  general_news: "bg-gray-100 text-gray-700",
  milestone: "bg-purple-100 text-purple-700",
};

export default function KemeFracDetailMobile() {
  const { offeringSlug } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");
  const [activeImg, setActiveImg] = useState(0);
  const [user, setUser] = useState(null);
  const [showAr, setShowAr] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  // Purchase panel state
  const [qty, setQty] = useState(5);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    const fallback = MOCK_OFFERINGS.find(m => m.id === offeringSlug) || MOCK_OFFERINGS[0];
    base44.entities.FracProperty.filter({ offeringSlug })
      .then((data) => {
        setOffering(data && data.length > 0 ? data[0] : fallback);
        setLoading(false);
      })
      .catch(() => { setOffering(fallback); setLoading(false); });
  }, [offeringSlug]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: "#00C896" }} />
      </div>
    );
  }

  const o = offering;
  const pct = o.tokensForSale > 0 ? Math.round((o.tokensSold / o.tokensForSale) * 100) : 0;
  const isSoldOut = o.status === "sold_out" || pct >= 100;
  const images = o.images || [o.image];
  const typeLabel = o.offeringType === "fractional_investment" ? "💰 Yield Investment" : "🏢 Fractional Sale";

  const min = o.minTokensPerBuyer || 1;
  const maxAvail = o.tokensAvailable || o.tokensForSale - o.tokensSold;
  const max = o.maxTokensPerBuyer ? Math.min(o.maxTokensPerBuyer, maxAvail) : maxAvail;
  const adjustQty = (d) => setQty(q => Math.max(min, Math.min(max, q + d)));

  const subtotal = qty * o.tokenPriceEGP;
  const fee = subtotal * (o.platformFeePercent / 100);
  const total = subtotal + fee;
  const ownership = ((qty / o.totalTokenSupply) * 100).toFixed(2);
  const annualReturn = o.expectedAnnualYieldPercent ? (subtotal * o.expectedAnnualYieldPercent) / 100 : null;

  const isLoggedIn = !!user;
  const hasKYC = user?.kycStatus === "approved";

  const copyLink = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleInvestClick = () => {
    if (!isLoggedIn) { base44.auth.redirectToLogin(); return; }
    setShowPurchase(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "#0A1628", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/kemefrac"); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-xs truncate max-w-[200px]">{o.offeringTitle}</p>
        <button onClick={copyLink}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <Share2 size={16} color="white" />
        </button>
      </div>

      {/* Scrollable */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Gallery */}
        <div className="relative" style={{ height: 220 }}>
          <img src={images[activeImg]} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            🔍 {activeImg + 1}/{images.length}
          </div>
          {isSoldOut && <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">SOLD OUT</div>}
        </div>
        {images.length > 1 && (
          <div className="flex gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className="flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2"
                style={{ borderColor: activeImg === i ? "#00C896" : "transparent" }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Header info */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black" style={{ background: "#0A1628", color: "#00C896" }}>KemeFrac™</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{typeLabel}</span>
            {o.verificationLevel >= 3 && <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700">🛡️ L{o.verificationLevel}</span>}
            {o.isFeatured && <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-500 text-white">⭐ Featured</span>}
          </div>
          <h1 className="font-black text-gray-900 text-lg leading-tight mb-0.5">{o.offeringTitle}</h1>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">📍 {[o.city, o.district, o.area].filter(Boolean).join(", ")}</p>
            <code className="text-xs font-mono font-black" style={{ color: "#00C896" }}>{o.tokenSymbol}</code>
          </div>
        </div>

        {/* Key stats */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Token Price</p>
              <p className="font-black text-sm" style={{ color: "#0A1628" }}>{fmt(o.tokenPriceEGP)} EGP</p>
              {o.tokenPriceUSD && <p className="text-[9px] text-gray-400">≈ ${o.tokenPriceUSD} USD</p>}
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Annual Yield</p>
              <p className="font-black text-sm" style={{ color: o.expectedAnnualYieldPercent ? "#00C896" : "#9ca3af" }}>
                {o.expectedAnnualYieldPercent ? `${o.expectedAnnualYieldPercent}%` : "—"}
              </p>
              {o.expectedAnnualYieldPercent && (
                <p className="text-[9px] text-gray-400">= {fmt(o.tokenPriceEGP * o.expectedAnnualYieldPercent / 100)} EGP/yr</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">Available</p>
              <p className="font-black text-sm" style={{ color: "#0A1628" }}>{fmt(o.tokensAvailable || o.tokensForSale - o.tokensSold)}</p>
              <p className="text-[9px] text-gray-400">of {fmt(o.tokensForSale)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-400">{fmt(o.tokensSold)} tokens sold</span>
            <span className="font-black" style={{ color: isSoldOut ? "#ef4444" : "#00C896" }}>{pct}% funded</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: isSoldOut ? "#ef4444" : "#00C896" }} />
          </div>
        </div>

        {/* Quick purchase panel (inline) */}
        {!isSoldOut && (
          <div className="px-4 py-4 bg-white border-b border-gray-100">
            <p className="text-xs font-bold text-gray-600 mb-2">How many tokens?</p>
            <div className="flex items-center gap-3 justify-center mb-2">
              <button onClick={() => adjustQty(-1)} disabled={qty <= min}
                className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30">
                <Minus size={16} />
              </button>
              <input type="number" value={qty} onChange={e => { const n = parseInt(e.target.value) || min; setQty(Math.max(min, Math.min(max, n))); }}
                className="w-16 text-center text-lg font-black border-2 rounded-xl py-1.5 focus:outline-none"
                style={{ borderColor: "#00C896" }} />
              <button onClick={() => adjustQty(1)} disabled={qty >= max}
                className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-700 disabled:opacity-30">
                <Plus size={16} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mb-3">Min {min} · Max {fmt(max)} tokens</p>

            {/* Order summary */}
            <div className="rounded-xl p-3 space-y-1.5 text-xs" style={{ background: "#F8FAFB", border: "1px solid #e5e7eb" }}>
              {[
                ["Subtotal", `${fmt(subtotal)} EGP`],
                ["Platform fee (2.5%)", `${fmt(fee)} EGP`],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-gray-500">
                  <span>{l}</span><span className="font-bold text-gray-700">{v}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 my-1" />
              <div className="flex justify-between font-black text-sm">
                <span style={{ color: "#0A1628" }}>TOTAL</span>
                <span style={{ color: "#0A1628" }}>{fmt(total)} EGP</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Ownership</span><span className="font-bold">{ownership}%</span>
              </div>
              {annualReturn && (
                <p className="text-[10px] font-bold" style={{ color: "#00C896" }}>Est. annual return: {fmt(annualReturn)} EGP</p>
              )}
            </div>

            {/* Buy / Auth button */}
            {!isLoggedIn ? (
              <button onClick={() => base44.auth.redirectToLogin()}
                className="w-full mt-3 py-3 rounded-xl font-black text-sm" style={{ background: "#0A1628", color: "#00C896" }}>
                Sign in to invest →
              </button>
            ) : !hasKYC ? (
              <Link to="/kemefrac/kyc"
                className="block w-full mt-3 text-center py-3 rounded-xl font-black text-sm" style={{ background: "#00C896", color: "#0A1628" }}>
                Complete KYC to Invest →
              </Link>
            ) : (
              <button onClick={handleInvestClick}
                className="w-full mt-3 py-3 rounded-xl font-black text-sm" style={{ background: "#0A1628", color: "#00C896" }}>
                🔐 Buy {qty} Tokens Now
              </button>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-between text-[9px] text-gray-400 mt-3">
              <span>🔗 NEAR Blockchain</span><span>🔐 KYC Protected</span><span>🏅 Verify Pro™</span>
            </div>
          </div>
        )}

        {isSoldOut && (
          <div className="mx-4 mt-3 text-center py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="font-black text-red-600">SOLD OUT</p>
            <p className="text-xs text-red-400 mt-0.5">All tokens have been sold</p>
          </div>
        )}

        {/* Watchlist + Share */}
        <div className="px-4 py-3 bg-white border-b border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <button onClick={() => setWatchlisted(!watchlisted)}
              className="flex items-center gap-1.5 text-xs font-bold border rounded-xl px-3 py-2 transition-all"
              style={{ borderColor: watchlisted ? "#00C896" : "#e5e7eb", color: watchlisted ? "#00C896" : "#6b7280" }}>
              {watchlisted ? "♥ Watching" : "♡ Watchlist"}
            </button>
            <span className="text-[10px] text-gray-400">{o.watchlistCount || 0} watching</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyLink}
              className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-600">
              {copied ? "✅ Copied!" : "🔗 Copy Link"}
            </button>
            <a href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-600">
              💬 WhatsApp
            </a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-[10px] font-bold text-gray-600">
              ✈️ Telegram
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{ background: tab === t ? "#0A1628" : "#f3f4f6", color: tab === t ? "#00C896" : "#6b7280" }}>
                {t === "Updates" && o.updates?.length ? `Updates (${o.updates.length})` : t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 py-4">
          {/* ── Overview ── */}
          {tab === "Overview" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-gray-900 text-sm">About this Investment</h3>
                  <button onClick={() => setShowAr(!showAr)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500">
                    {showAr ? "EN" : "عربي"}
                  </button>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed" dir={showAr ? "rtl" : "ltr"}>
                  {showAr ? (o.offeringDescriptionAr || o.offeringDescription) : o.offeringDescription}
                </p>
              </div>

              {/* Location Map */}
              {o.latitude && o.longitude && (
                <div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">Location</h3>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <iframe title="map" width="100%" height="180" loading="lazy"
                      src={`https://maps.google.com/maps?q=${o.latitude},${o.longitude}&z=15&output=embed`} />
                  </div>
                </div>
              )}

              {/* Property Specs */}
              <div>
                <h3 className="font-black text-gray-900 text-sm mb-2">Property Specs</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Type", v: o.category }, { l: "Area", v: `${o.area_size}m²` }, { l: "Beds", v: o.beds },
                    { l: "Baths", v: o.baths }, { l: "Floor", v: o.floor_number }, { l: "Built", v: o.year_built },
                  ].map(s => (
                    <div key={s.l} className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="font-black text-gray-900 text-xs">{s.v ?? "—"}</p>
                      <p className="text-[9px] text-gray-400">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-black text-gray-500 flex-shrink-0">
                  {o.sellerName?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-black text-gray-900 text-xs">{o.sellerName}</p>
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{o.sellerRole}</span>
                    {o.verificationLevel >= 3 && <span className="text-[9px]">🛡️</span>}
                  </div>
                  <p className="text-[10px] text-gray-400">{o.sellerListings} listings on Kemedar</p>
                </div>
                <Link to={`/m/agent-profile/${o.submittedByUserId}`}
                  className="text-[10px] font-black flex-shrink-0" style={{ color: "#00C896" }}>
                  Profile →
                </Link>
              </div>
            </div>
          )}

          {/* ── Financials ── */}
          {tab === "Financials" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-gray-100 overflow-hidden text-xs">
                {[
                  ["Full Property Valuation", `${fmt(o.propertyValuationEGP)} EGP`],
                  ["Total Token Supply", `${fmt(o.totalTokenSupply)} tokens`],
                  ["Token Price", `${fmt(o.tokenPriceEGP)} EGP each`],
                  ["Tokens Available", `${fmt(o.tokensAvailable || o.tokensForSale - o.tokensSold)} tokens`],
                  ["Tokens Sold", `${fmt(o.tokensSold)} tokens`],
                  o.maxTokensPerBuyer ? ["Max Exposure (you)", `${fmt(o.maxTokensPerBuyer * o.tokenPriceEGP)} EGP`] : null,
                  o.expectedAnnualYieldPercent ? ["Expected Annual Yield", `${o.expectedAnnualYieldPercent}%`] : null,
                  o.yieldFrequency ? ["Yield Frequency", o.yieldFrequency.charAt(0).toUpperCase() + o.yieldFrequency.slice(1)] : null,
                  o.expectedAnnualYieldPercent ? ["Yield Per Token / Year", `${fmt(o.tokenPriceEGP * o.expectedAnnualYieldPercent / 100)} EGP`] : null,
                  ["Platform Fee", `${o.platformFeePercent}% per purchase`],
                ].filter(Boolean).map(([label, val], i) => (
                  <div key={label} className={`flex justify-between px-3.5 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="text-gray-500">{label}</span>
                    <span className="font-black text-gray-900">{val}</span>
                  </div>
                ))}
              </div>

              {/* Calculator */}
              <div className="rounded-2xl p-4" style={{ background: "#00C89608", border: "1.5px solid #00C89640" }}>
                <p className="font-black text-gray-900 text-sm mb-3">📊 Return Calculator</p>
                <label className="text-[10px] font-bold text-gray-600 mb-1 block">
                  Tokens: <span className="font-black" style={{ color: "#00C896" }}>{qty}</span>
                </label>
                <input type="range" min={min} max={Math.min(maxAvail || 200, 500)}
                  value={qty} onChange={e => setQty(parseInt(e.target.value))}
                  className="w-full mb-3 accent-[#00C896]" />
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {[
                    ["Investment", `${fmt(subtotal)} EGP`],
                    ["Annual Yield", annualReturn ? `${fmt(annualReturn)} EGP` : "—"],
                    ["Monthly Yield", annualReturn ? `${fmt(annualReturn / 12)} EGP` : "—"],
                    ["Ownership", `${ownership}%`],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-white rounded-xl p-2.5">
                      <p className="text-gray-400">{l}</p>
                      <p className="font-black text-gray-900 text-xs">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Property Details ── */}
          {tab === "Property" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 overflow-hidden text-xs">
                {[
                  ["Property Code", o.propertyId],
                  ["Category", o.category],
                  ["Area", `${o.area_size} m²`],
                  ["Bedrooms", o.beds],
                  ["Bathrooms", o.baths],
                  ["Floor", o.floor_number],
                  ["Year Built", o.year_built],
                  ["City", o.city],
                  ["District", o.district],
                ].map(([label, val], i) => (
                  <div key={label} className={`flex justify-between px-3.5 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <span className="text-gray-500">{label}</span>
                    <span className="font-black text-gray-900">{val ?? "—"}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Link to={`/m/property/${o.propertyId}`}
                  className="text-xs font-bold" style={{ color: "#00C896" }}>
                  View full property listing →
                </Link>
                {o.tokenId && (
                  <Link to={`/m/verify/${o.tokenId}`}
                    className="text-xs font-bold flex items-center gap-1" style={{ color: "#0A1628" }}>
                    ⛓️ View Verification Chain →
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ── Updates ── */}
          {tab === "Updates" && (
            <div className="space-y-3">
              {(!o.updates || o.updates.length === 0) ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-3xl mb-2">📢</p>
                  <p className="font-bold text-sm">No updates yet</p>
                  <p className="text-xs mt-1">Updates from the property manager will appear here.</p>
                </div>
              ) : o.updates.map(u => (
                <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${UPDATE_COLORS[u.updateType] || "bg-gray-100 text-gray-600"}`}>
                      {u.updateType.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400">{new Date(u.created_date).toLocaleDateString()}</span>
                  </div>
                  <p className="font-black text-gray-900 text-xs mb-1">{u.title}</p>
                  <p className="text-gray-500 text-[11px] leading-relaxed">{u.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Legal ── */}
          {tab === "Legal" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: "#0A162808", border: "1px solid #0A162820" }}>
                <p className="font-black text-gray-900 text-sm mb-2">NEAR Smart Contract</p>
                {o.nearContractAddress ? (
                  <>
                    <div className="bg-white rounded-xl px-3 py-2 border border-gray-100 mb-2 flex items-center justify-between">
                      <code className="text-[10px] font-mono text-gray-700 truncate">{o.nearContractAddress}</code>
                      <button onClick={() => navigator.clipboard?.writeText(o.nearContractAddress)}
                        className="text-[10px] font-bold ml-2 flex-shrink-0" style={{ color: "#00C896" }}>Copy</button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <a href={o.nearExplorerUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-black px-3 py-1.5 rounded-lg" style={{ background: "#0A1628", color: "#00C896" }}>
                        View on NEAR Explorer →
                      </a>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: o.nearNetworkType === "mainnet" ? "#00C89620" : "#F59E0B20", color: o.nearNetworkType === "mainnet" ? "#00C896" : "#F59E0B" }}>
                        {o.nearNetworkType === "mainnet" ? "● Mainnet" : "○ Testnet"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-gray-400 text-[10px]">Token Standard</p>
                        <p className="font-black text-gray-900">NEP-141</p>
                      </div>
                      <div className="bg-white rounded-xl p-2.5 border border-gray-100">
                        <p className="text-gray-400 text-[10px]">Contract Deployed</p>
                        <p className="font-black" style={{ color: o.nearTokenContractDeployed ? "#00C896" : "#9ca3af" }}>
                          {o.nearTokenContractDeployed ? "✅ Yes" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-xs">Smart contract pending admin deployment.</p>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-[11px] text-yellow-800 leading-relaxed">
                <p className="font-black mb-1">⚠️ Important Legal Notice</p>
                <p>KemeFrac™ tokens represent fractional economic interests in real estate assets and do not constitute securities, shares, or legal title transfer. Investments carry risk including potential loss of capital. Rental yields are estimated and not guaranteed. Past performance is not indicative of future results. This offering is available to KYC-verified users only. By purchasing tokens, you agree to the KemeFrac™ Terms of Investment and the NEAR Protocol token terms.</p>
              </div>
            </div>
          )}
        </div>

        <div className="h-24" />
      </div>

      {/* Sticky Invest Bar */}
      {!isSoldOut && (
        <div className="bg-white border-t border-gray-100 px-4 py-2.5 flex items-center gap-3"
          style={{ position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 51 }}>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm" style={{ color: "#0A1628" }}>{fmt(total)} EGP</p>
            <p className="text-[10px] text-gray-400">{qty} tokens · {ownership}% ownership</p>
          </div>
          <button onClick={handleInvestClick}
            className="px-5 py-2.5 rounded-xl font-black text-sm"
            style={{ background: "#00C896", color: "#0A1628" }}>
            💎 Invest Now
          </button>
        </div>
      )}

      <MobileBottomNav />

      {showPurchase && (
        <MobileFracPurchaseSheet
          offering={o}
          user={user}
          initialQty={qty}
          onClose={() => setShowPurchase(false)}
        />
      )}
    </div>
  );
}