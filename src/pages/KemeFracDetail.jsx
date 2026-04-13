import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import VerifyProBadge from "@/components/verify/VerifyProBadge";
import FracPurchasePanel from "@/components/kemefrac/FracPurchasePanel";
import FracPurchaseModal from "@/components/kemefrac/FracPurchaseModal";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

// ── MOCK ──────────────────────────────────────────────────────────────────────
const MOCK = {
  id: "frac-1",
  offeringTitle: "New Cairo Apartment — Frac Series A",
  offeringTitleAr: "شقة القاهرة الجديدة — سلسلة أ",
  offeringDescription: "A premium fractional investment opportunity in the heart of 5th Settlement, New Cairo. The property is currently tenanted with a long-term corporate lease, providing stable rental income. Investors receive proportional rental yield distributed monthly via the Kemedar platform.",
  offeringDescriptionAr: "فرصة استثمارية مجزأة متميزة في قلب التجمع الخامس، القاهرة الجديدة. العقار مؤجر حاليًا بعقد إيجار تجاري طويل الأجل، مما يوفر دخلاً إيجارياً مستقراً.",
  offeringType: "fractional_investment",
  offeringSlug: "new-cairo-apt-frac-2026",
  tokenSymbol: "KMF-NC-001",
  tokenName: "KemeFrac New Cairo Apt #001",
  tokenPriceEGP: 1000,
  tokenPriceUSD: 20,
  propertyValuationEGP: 1000000,
  totalTokenSupply: 1000,
  tokensForSale: 1000,
  tokensSold: 820,
  tokensAvailable: 180,
  minTokensPerBuyer: 5,
  maxTokensPerBuyer: 200,
  expectedAnnualYieldPercent: 9.5,
  yieldFrequency: "monthly",
  status: "live",
  isFeatured: true,
  isVerified: true,
  verificationLevel: 5,
  nearContractAddress: "kmf-nc001.kemefrac.near",
  nearNetworkType: "testnet",
  nearExplorerUrl: "https://explorer.testnet.near.org/accounts/kmf-nc001.kemefrac.near",
  nearTokenContractDeployed: true,
  platformFeePercent: 2.5,
  city: "New Cairo", district: "5th Settlement", area: "El Rehab",
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  ],
  latitude: 30.0444, longitude: 31.4357,
  beds: 3, baths: 2, area_size: 185, floor_number: 8, year_built: 2021,
  category: "Apartment",
  submittedByUserId: "seller-1",
  sellerName: "Ahmed Hassan Properties",
  sellerRole: "Agency",
  sellerListings: 12,
  propertyId: "prop-1",
  tokenId: "token-1",
  updates: [
    { id: "u1", updateType: "financial_report", title: "Q1 2026 Financial Report", body: "Rental income collected on time. Net yield distributed to all token holders on March 1st.", created_date: "2026-03-05" },
    { id: "u2", updateType: "tenant_news", title: "Lease Renewed for 2 Years", body: "The corporate tenant has renewed their lease agreement for an additional 2 years at a 10% rent increase.", created_date: "2026-01-15" },
  ],
  watchlistCount: 47,
};

const UPDATE_TYPE_COLORS = {
  financial_report: "bg-blue-100 text-blue-700",
  tenant_news: "bg-green-100 text-green-700",
  maintenance_update: "bg-yellow-100 text-yellow-700",
  yield_announcement: "bg-teal-100 text-teal-700",
  general_news: "bg-gray-100 text-gray-700",
  milestone: "bg-purple-100 text-purple-700",
};

// ── GALLERY ───────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative rounded-2xl overflow-hidden cursor-pointer" style={{ height: 360 }} onClick={() => setLightbox(true)}>
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full">
          🔍 {active + 1}/{images.length}
        </div>
      </div>
      <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all"
            style={{ borderColor: active === i ? "#00C896" : "transparent" }}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={images[active]} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white text-2xl font-black">✕</button>
        </div>
      )}
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Financials", "Property Details", "Updates", "Legal"];

function TabOverview({ offering }) {
  const [showAr, setShowAr] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-gray-900">About this Investment</h3>
          <button onClick={() => setShowAr(!showAr)}
            className="text-xs font-bold px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-[#00C896] transition-colors">
            {showAr ? "EN" : "عربي"}
          </button>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm" dir={showAr ? "rtl" : "ltr"}>
          {showAr ? offering.offeringDescriptionAr : offering.offeringDescription}
        </p>
      </div>

      <div>
        <h3 className="font-black text-gray-900 mb-3">Location</h3>
        {offering.latitude && offering.longitude ? (
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <iframe title="map" width="100%" height="220" loading="lazy"
              src={`https://maps.google.com/maps?q=${offering.latitude},${offering.longitude}&z=15&output=embed`} />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">Map not available</div>
        )}
      </div>

      <div>
        <h3 className="font-black text-gray-900 mb-3">Property Specs</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Category", value: offering.category },
            { label: "Area", value: `${offering.area_size} m²` },
            { label: "Bedrooms", value: offering.beds },
            { label: "Bathrooms", value: offering.baths },
            { label: "Floor", value: offering.floor_number },
            { label: "Year Built", value: offering.year_built },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="font-black text-gray-900 text-sm">{s.value ?? "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabFinancials({ offering }) {
  const [qty, setQty] = useState(offering.minTokensPerBuyer || 1);
  const maxCalc = offering.tokensAvailable || offering.tokensForSale;
  const subtotal = qty * offering.tokenPriceEGP;
  const fee = subtotal * (offering.platformFeePercent / 100);
  const annualYield = offering.expectedAnnualYieldPercent
    ? (qty * offering.tokenPriceEGP * offering.expectedAnnualYieldPercent) / 100 : 0;
  const stake = ((qty / offering.totalTokenSupply) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-black text-gray-900 mb-3">Investment Summary</h3>
        <div className="rounded-2xl border border-gray-100 overflow-hidden text-sm">
          {[
            ["Full Property Valuation", `${fmt(offering.propertyValuationEGP)} EGP`],
            ["Total Token Supply", `${fmt(offering.totalTokenSupply)} tokens`],
            ["Token Price", `${fmt(offering.tokenPriceEGP)} EGP each`],
            ["Tokens Available", `${fmt(offering.tokensAvailable)} tokens`],
            ["Tokens Sold", `${fmt(offering.tokensSold)} tokens`],
            offering.maxTokensPerBuyer
              ? ["Max Exposure (you)", `${fmt(offering.maxTokensPerBuyer * offering.tokenPriceEGP)} EGP`]
              : null,
            null,
            offering.expectedAnnualYieldPercent
              ? ["Expected Annual Yield", `${offering.expectedAnnualYieldPercent}%`]
              : null,
            offering.yieldFrequency
              ? ["Yield Frequency", offering.yieldFrequency.charAt(0).toUpperCase() + offering.yieldFrequency.slice(1)]
              : null,
            offering.expectedAnnualYieldPercent
              ? ["Yield Per Token / Year", `${fmt(offering.tokenPriceEGP * offering.expectedAnnualYieldPercent / 100)} EGP`]
              : null,
            null,
            ["Platform Fee", `${offering.platformFeePercent}% per purchase`],
          ].filter(Boolean).map((row, i) =>
            row === null ? (
              <div key={i} className="border-t-2 border-gray-100" />
            ) : (
              <div key={i} className={`flex justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="text-gray-500">{row[0]}</span>
                <span className="font-black text-gray-900">{row[1]}</span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "#00C89608", border: "1.5px solid #00C89640" }}>
        <p className="font-black text-gray-900 mb-4">Calculate your potential return</p>
        <label className="block text-xs font-bold text-gray-600 mb-2">
          How many tokens? <span className="font-black" style={{ color: "#00C896" }}>{qty}</span>
        </label>
        <input type="range" min={offering.minTokensPerBuyer || 1} max={Math.min(maxCalc, 500)}
          value={qty} onChange={e => setQty(parseInt(e.target.value))}
          className="w-full mb-4 accent-[#00C896]" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Your investment", `${fmt(subtotal)} EGP`],
            ["Annual yield", offering.expectedAnnualYieldPercent ? `${fmt(annualYield)} EGP` : "—"],
            ["Monthly yield", offering.expectedAnnualYieldPercent ? `${fmt(annualYield / 12)} EGP` : "—"],
            ["Ownership stake", `${stake}%`],
          ].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl p-3">
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-black text-gray-900">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabPropertyDetails({ offering }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 overflow-hidden text-sm">
        {[
          ["Property Code", offering.propertyId],
          ["Category", offering.category],
          ["Area", `${offering.area_size} m²`],
          ["Bedrooms", offering.beds],
          ["Bathrooms", offering.baths],
          ["Floor", offering.floor_number],
          ["Year Built", offering.year_built],
          ["City", offering.city],
          ["District", offering.district],
        ].map(([label, val], i) => (
          <div key={label} className={`flex justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-gray-500">{label}</span>
            <span className="font-black text-gray-900">{val ?? "—"}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Link to={`/property/${offering.propertyId}`}
          className="text-sm font-bold hover:underline" style={{ color: "#00C896" }}>
          View full property listing →
        </Link>
        {offering.tokenId && (
          <Link to={`/verify/${offering.tokenId}`}
            className="text-sm font-bold hover:underline flex items-center gap-1" style={{ color: "#0A1628" }}>
            ⛓️ View Verification Chain →
          </Link>
        )}
      </div>
    </div>
  );
}

function TabUpdates({ updates }) {
  if (!updates || updates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-3xl mb-2">📢</p>
        <p className="font-bold">No updates yet</p>
        <p className="text-sm mt-1">Updates from the property manager will appear here.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {updates.map((u) => (
        <div key={u.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${UPDATE_TYPE_COLORS[u.updateType] || "bg-gray-100 text-gray-600"}`}>
              {u.updateType.replace(/_/g, " ").toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">{new Date(u.created_date).toLocaleDateString()}</span>
          </div>
          <p className="font-black text-gray-900 mb-1">{u.title}</p>
          <p className="text-gray-500 text-sm leading-relaxed">{u.body}</p>
        </div>
      ))}
    </div>
  );
}

function TabLegal({ offering }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#0A162808", border: "1px solid #0A162820" }}>
        <p className="font-black text-gray-900">NEAR Smart Contract</p>
        {offering.nearContractAddress ? (
          <>
            <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-gray-100">
              <code className="text-xs font-mono text-gray-700">{offering.nearContractAddress}</code>
              <button onClick={() => navigator.clipboard?.writeText(offering.nearContractAddress)}
                className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: "#00C896" }}>Copy</button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a href={offering.nearExplorerUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm font-black px-4 py-2 rounded-xl transition-all"
                style={{ background: "#0A1628", color: "#00C896" }}>
                View on NEAR Explorer →
              </a>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: offering.nearNetworkType === "mainnet" ? "#00C89620" : "#F59E0B20",
                  color: offering.nearNetworkType === "mainnet" ? "#00C896" : "#F59E0B" }}>
                {offering.nearNetworkType === "mainnet" ? "● Mainnet" : "○ Testnet"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-gray-400 text-xs">Token Standard</p>
                <p className="font-black text-gray-900">NEP-141</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-gray-400 text-xs">Contract Deployed</p>
                <p className="font-black" style={{ color: offering.nearTokenContractDeployed ? "#00C896" : "#9ca3af" }}>
                  {offering.nearTokenContractDeployed ? "✅ Yes" : "Pending"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">Smart contract pending admin deployment.</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-800 leading-relaxed">
        <p className="font-black mb-2">⚠️ Important Legal Notice</p>
        <p>KemeFrac™ tokens represent fractional economic interests in real estate assets and do not constitute securities, shares, or legal title transfer. Investments carry risk including potential loss of capital. Rental yields are estimated and not guaranteed. Past performance is not indicative of future results. This offering is available to KYC-verified users only. Kemedar is a licensed real estate technology platform in Egypt. By purchasing tokens, you agree to the KemeFrac™ Terms of Investment and the NEAR Protocol token terms.</p>
      </div>
    </div>
  );
}

// ── SELLER CARD ───────────────────────────────────────────────────────────────
function SellerCard({ offering }) {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0 font-black text-gray-500">
        {offering.sellerName?.[0] || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="font-black text-gray-900">{offering.sellerName}</p>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {offering.sellerRole}
          </span>
          <VerifyProBadge level={offering.verificationLevel} size="sm" />
        </div>
        <p className="text-xs text-gray-400">Listed {offering.sellerListings} properties on Kemedar</p>
      </div>
      <Link to={`/agent-profile/${offering.submittedByUserId}`}
        className="text-sm font-black flex-shrink-0 hover:underline" style={{ color: "#00C896" }}>
        View Profile →
      </Link>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function KemeFracDetail() {
  const { offeringSlug } = useParams();
  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.FracProperty.filter({ offeringSlug })
      .then((data) => {
        setOffering(data?.[0] || MOCK);
        setLoading(false);
      })
      .catch(() => { setOffering(MOCK); setLoading(false); });
  }, [offeringSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00C896] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const o = offering;
  const pct = o.tokensForSale > 0 ? Math.round((o.tokensSold / o.tokensForSale) * 100) : 0;
  const isSoldOut = o.status === "sold_out" || pct >= 100;
  const images = o.images || [o.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"];
  const updatesCount = o.updates?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-[1200px] mx-auto px-4 py-6 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#00C896]">Home</Link>
          <span>›</span>
          <Link to="/kemefrac" className="hover:text-[#00C896]">KemeFrac™</Link>
          <span>›</span>
          <span className="text-gray-700 truncate max-w-xs">{o.offeringTitle}</span>
        </nav>

        <div className="flex gap-6 items-start">
          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0">
            <Gallery images={images} />

            {/* Badge row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#0A1628", color: "#00C896" }}>
                KemeFrac™
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700">
                {o.offeringType === "fractional_investment" ? "💰 Yield Investment" : "🏢 Fractional Sale"}
              </span>
              <VerifyProBadge level={o.verificationLevel} />
              {o.isFeatured && (
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#FF6B00] text-white">⭐ Featured</span>
              )}
            </div>

            <h1 className="text-2xl font-black mb-1" style={{ color: "#0A1628" }}>{o.offeringTitle}</h1>
            <p className="text-sm text-gray-400 mb-5">📍 {[o.city, o.district, o.area].filter(Boolean).join(", ")}</p>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
              {TABS.map((t) => {
                const label = t === "Updates" && updatesCount > 0 ? `Updates (${updatesCount})` : t;
                return (
                  <button key={t} onClick={() => setTab(t)}
                    className="px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px"
                    style={{
                      borderColor: tab === t ? "#00C896" : "transparent",
                      color: tab === t ? "#00C896" : "#6b7280",
                    }}>
                    {label}
                  </button>
                );
              })}
            </div>

            {tab === "Overview" && <TabOverview offering={o} />}
            {tab === "Financials" && <TabFinancials offering={o} />}
            {tab === "Property Details" && <TabPropertyDetails offering={o} />}
            {tab === "Updates" && <TabUpdates updates={o.updates} />}
            {tab === "Legal" && <TabLegal offering={o} />}

            <SellerCard offering={o} />
          </div>

          {/* ── RIGHT ── */}
          <div className="w-[340px] flex-shrink-0 sticky top-[90px]">
            <FracPurchasePanel
              offering={o}
              user={user}
              isSoldOut={isSoldOut}
              pct={pct}
              onBuy={(qty) => { setPurchaseQty(qty); setShowPurchase(true); }}
            />
          </div>
        </div>
      </div>

      {showPurchase && (
        <FracPurchaseModal
          offering={o}
          user={user}
          initialQty={purchaseQty}
          onClose={() => setShowPurchase(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}