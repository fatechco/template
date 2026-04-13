import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const fmt = n => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const STRUCTURE_LABEL = {
  standard: "Standard",
  accelerated: "Accelerated",
  flexible_hybrid: "Flexible",
};

function ListingCard({ listing, onClick }) {
  const pct = listing.purchaseOptionPrice && listing.totalEquityIfFullTerm
    ? Math.round((listing.totalEquityIfFullTerm / listing.purchaseOptionPrice) * 100) : 0;

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
      <div className="h-32 bg-gray-100 relative">
        {listing.propertyImages?.[0] ? (
          <img src={listing.propertyImages[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
            {STRUCTURE_LABEL[listing.structureType] || "Standard"}
          </span>
        </div>
        {listing.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white">⭐ Featured</span>
          </div>
        )}
        {listing.isIjaraCompatible && (
          <div className="absolute bottom-2 left-2">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700">☪ Ijara Compatible</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-black text-gray-900 text-xs line-clamp-1">{listing.propertyTitle || "Rent-to-Own Property"}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">📍 {listing.propertyCity || listing.propertyArea || "Egypt"}</p>
        <div className="flex items-center gap-3 mt-2">
          <div>
            <p className="text-[9px] text-gray-400">Monthly</p>
            <p className="text-sm font-black text-emerald-600">{fmt(listing.totalMonthlyPayment)} <span className="text-[9px] text-gray-400">EGP</span></p>
          </div>
          <div>
            <p className="text-[9px] text-gray-400">Purchase Price</p>
            <p className="text-xs font-bold text-gray-700">{fmt(listing.purchaseOptionPrice)} EGP</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
            {listing.optionTermYears}yr term
          </span>
          {listing.propertyBeds && (
            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
              🛏 {listing.propertyBeds}
            </span>
          )}
          {listing.propertyAreaSqm && (
            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
              📐 {listing.propertyAreaSqm}m²
            </span>
          )}
          <span className="text-[9px] font-black text-emerald-600">{pct}% equity on full term</span>
        </div>
      </div>
    </div>
  );
}

export default function Rent2OwnBrowseMobile() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    base44.entities.Rent2OwnListing.filter({ status: "active" }, "-created_date", 50)
      .then(data => { setListings(data || []); setLoading(false); });
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = !search || l.propertyTitle?.toLowerCase().includes(search.toLowerCase()) || l.propertyCity?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || l.structureType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#0F172A", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🔑 Browse Rent-to-Own</p>
        <div className="w-9" />
      </div>

      {/* Search */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="bg-gray-100 rounded-xl flex items-center gap-2 px-3 py-2">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by location, property..." className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent" />
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {[["all", "All"], ["standard", "Standard"], ["accelerated", "Accelerated"], ["flexible_hybrid", "Flexible"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: filter === val ? "#10B981" : "#f3f4f6", color: filter === val ? "#fff" : "#6b7280" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🏠</p>
            <p className="font-bold text-sm">No listings found</p>
            <p className="text-xs mt-1">Check back soon or adjust your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(l => (
              <ListingCard key={l.id} listing={l} onClick={() => navigate(`/m/kemedar/rent2own/${l.id}`)} />
            ))}
          </div>
        )}
        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}