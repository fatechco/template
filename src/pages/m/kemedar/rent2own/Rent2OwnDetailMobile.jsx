import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const fmt = n => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const STRUCTURE_LABEL = { standard: "Standard", accelerated: "Accelerated", flexible_hybrid: "Flexible" };
const CONDITION_COLOR = { excellent: "text-emerald-600", good: "text-green-600", fair: "text-amber-600", needs_minor_work: "text-orange-600" };

export default function Rent2OwnDetailMobile() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Rent2OwnListing.filter({ id: listingId }).then(data => {
      setListing(data?.[0] || null);
      setLoading(false);
    });
  }, [listingId]);

  if (loading) return <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>;
  if (!listing) return <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center text-gray-500">Listing not found</div>;

  const images = listing.propertyImages || [];
  const pctEquity = listing.purchaseOptionPrice && listing.totalEquityIfFullTerm
    ? Math.round((listing.totalEquityIfFullTerm / listing.purchaseOptionPrice) * 100) : 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 flex items-center justify-between"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <button onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <Share2 size={16} color="white" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Gallery */}
        <div className="h-56 bg-gray-200 relative">
          {images.length > 0 ? (
            <img src={images[imgIdx]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className="w-2 h-2 rounded-full" style={{ background: i === imgIdx ? "white" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
          )}
          <div className="absolute top-12 left-3">
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              🔑 {STRUCTURE_LABEL[listing.structureType] || "Standard"}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white px-4 py-4 border-b border-gray-100">
          <h1 className="font-black text-gray-900 text-lg">{listing.propertyTitle || "Rent-to-Own Property"}</h1>
          <p className="text-xs text-gray-400 mt-0.5">📍 {listing.propertyCity || listing.propertyArea || "Egypt"}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {listing.propertyBeds && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">🛏 {listing.propertyBeds} beds</span>}
            {listing.propertyBaths && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">🚿 {listing.propertyBaths} baths</span>}
            {listing.propertyAreaSqm && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">📐 {listing.propertyAreaSqm}m²</span>}
            {listing.propertyType && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold capitalize">{listing.propertyType}</span>}
          </div>
        </div>

        {/* Key numbers */}
        <div className="bg-white px-4 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "#10B98110", border: "1px solid #10B98130" }}>
              <p className="text-[10px] text-gray-400">Monthly Payment</p>
              <p className="text-lg font-black text-emerald-600">{fmt(listing.totalMonthlyPayment)} <span className="text-[10px] text-gray-400">EGP</span></p>
              <p className="text-[9px] text-gray-400">Rent {fmt(listing.baseMonthlyRent)} + Equity {fmt(listing.equityPremium)}</p>
            </div>
            <div className="rounded-xl p-3 bg-gray-50 border border-gray-100">
              <p className="text-[10px] text-gray-400">Purchase Price</p>
              <p className="text-lg font-black text-gray-900">{fmt(listing.purchaseOptionPrice)} <span className="text-[10px] text-gray-400">EGP</span></p>
              <p className="text-[9px] text-gray-400">{listing.optionTermYears}yr term</p>
            </div>
          </div>

          {/* Equity progress preview */}
          <div className="mt-3 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold text-gray-600">Equity at full term</p>
              <p className="text-[10px] font-black text-emerald-600">{pctEquity}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(pctEquity, 100)}%`, background: "#10B981" }} />
            </div>
            <p className="text-[9px] text-gray-400 mt-1">{fmt(listing.totalEquityIfFullTerm)} EGP equity · {fmt(listing.totalPaymentsIfFullTerm)} EGP total payments</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 sticky top-0 z-10">
          <div className="flex gap-1.5">
            {[["overview", "Overview"], ["financial", "Financial"], ["requirements", "Requirements"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold"
                style={{ background: tab === k ? "#10B981" : "#f3f4f6", color: tab === k ? "#fff" : "#6b7280" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          {tab === "overview" && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="font-black text-gray-900 text-xs mb-2">Property Details</p>
                {[
                  ["Market Value", `${fmt(listing.marketValueAtListing)} EGP`],
                  ["Condition", listing.conditionAtListing || "—"],
                  ["Available From", listing.availableFrom || "—"],
                  ["Applications", `${listing.applicationsCount || 0}`],
                  ["Views", `${listing.viewsCount || 0}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] text-gray-400">{label}</span>
                    <span className={`text-[10px] font-bold ${CONDITION_COLOR[val] || "text-gray-700"}`}>{val}</span>
                  </div>
                ))}
              </div>
              {listing.isIjaraCompatible && (
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 flex items-center gap-2">
                  <span className="text-lg">☪</span>
                  <div>
                    <p className="font-bold text-teal-800 text-xs">Ijara Compatible</p>
                    <p className="text-[10px] text-teal-600">This listing is Sharia-compliant (Ijara structure)</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "financial" && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="font-black text-gray-900 text-xs mb-2">Financial Breakdown</p>
                {[
                  ["Base Monthly Rent", `${fmt(listing.baseMonthlyRent)} EGP`],
                  ["Equity Premium", `${fmt(listing.equityPremium)} EGP`],
                  ["Total Monthly", `${fmt(listing.totalMonthlyPayment)} EGP`],
                  ["Purchase Option Price", `${fmt(listing.purchaseOptionPrice)} EGP`],
                  ["Term", `${listing.optionTermYears} years (${listing.optionTermMonths || listing.optionTermYears * 12} months)`],
                  ["Equity Rate", `${listing.equityAccumulationRate || 100}%`],
                  ["Total Equity (Full Term)", `${fmt(listing.totalEquityIfFullTerm)} EGP`],
                  ["Total Payments (Full Term)", `${fmt(listing.totalPaymentsIfFullTerm)} EGP`],
                  ["Exit Penalty", `${listing.exitPenaltyPercent || 2}% (min ${listing.exitPenaltyMonths || 12} months)`],
                  ["Min Commitment", `${listing.minimumCommitmentMonths || 12} months`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] text-gray-400">{label}</span>
                    <span className="text-[10px] font-bold text-gray-700">{val}</span>
                  </div>
                ))}
              </div>
              {listing.vsMarketPurchaseSaving > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                  <p className="font-black text-emerald-700 text-sm">Save {fmt(listing.vsMarketPurchaseSaving)} EGP</p>
                  <p className="text-[10px] text-emerald-600">vs buying at current market price</p>
                </div>
              )}
            </div>
          )}

          {tab === "requirements" && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="font-black text-gray-900 text-xs mb-2">Eligibility Requirements</p>
                {[
                  ["Income Proof", listing.requiresIncomeProof ? "Required" : "Not required"],
                  ["Min Monthly Income", listing.minimumMonthlyIncome ? `${fmt(listing.minimumMonthlyIncome)} EGP` : "—"],
                  ["Credit Check", listing.requiresCreditCheck ? "Required" : "Not required"],
                  ["Min Kemedar Score", listing.requiresKemedarScore || "—"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-[10px] text-gray-400">{label}</span>
                    <span className="text-[10px] font-bold text-gray-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-28" />
      </div>

      {/* Sticky CTA */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0 flex items-center gap-3"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="flex-1">
          <p className="text-[10px] text-gray-400">Monthly</p>
          <p className="text-base font-black text-emerald-600">{fmt(listing.totalMonthlyPayment)} EGP</p>
        </div>
        <button onClick={() => {
          if (!user) { base44.auth.redirectToLogin(); return; }
          navigate(`/m/kemedar/rent2own/${listingId}/apply`);
        }}
          className="font-black text-sm px-6 py-3 rounded-xl text-white" style={{ background: "#10B981" }}>
          Apply Now →
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}