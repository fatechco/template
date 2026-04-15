"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Search, MapPin, Eye, X, ChevronDown, ChevronUp, ShoppingBag, BarChart2, Pause, Play, StopCircle, ExternalLink } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ── helpers ──────────────────────────────────────────────────────────────────
const CATEGORY_SLUGS = ["furniture", "lighting", "decor", "rugs", "curtains", "wall-art", "kitchen-accessories", "outdoor-furniture"];
const DURATIONS = [
  { label: "7 days", days: 7 },
  { label: "14 days", days: 14 },
  { label: "30 days", days: 30 },
  { label: "Custom", days: null },
];
const DAILY_RATE = 50;
const CLICK_RATE = 2;
const AVG_DAILY_CLICKS = 4;

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r.toISOString().split("T")[0];
}

// ── SPONSORSHIP MODAL ────────────────────────────────────────────────────────
function SponsorshipModal({ hotspot, property, imageUrl, onClose, sellerId, sellerProducts, onLaunch }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [durationIdx, setDurationIdx] = useState(2); // 30 days default
  const [customStart, setCustomStart] = useState(new Date().toISOString().split("T")[0]);
  const [customEnd, setCustomEnd] = useState(addDays(new Date(), 30));
  const [launching, setLaunching] = useState(false);

  const duration = DURATIONS[durationIdx];
  const today = new Date().toISOString().split("T")[0];
  const endDate = duration.days ? addDays(new Date(), duration.days) : customEnd;
  const startDate = duration.days ? today : customStart;
  const days = duration.days || Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000));
  const estimatedTotal = days * DAILY_RATE + days * AVG_DAILY_CLICKS * CLICK_RATE;

  const filteredProducts = sellerProducts.filter(p =>
    !productSearch || (p.title || p.name || "").toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleLaunch = async () => {
    if (!selectedProduct) return;
    setLaunching(true);
    try {
      await apiClient.put("/api/v1/imagehotspot/", hotspot.id, {
        isSponsored: true,
        sponsoredProductId: selectedProduct.id,
        sponsoredBySellerId: sellerId,
        sponsorshipStartDate: startDate,
        sponsorshipEndDate: endDate,
        sponsorshipDailyBudgetEGP: DAILY_RATE,
        sponsorshipStatus: "active",
        sponsorshipTotalSpentEGP: 0,
      });
      onLaunch();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[500] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900">Sponsor This Item</h2>
            <p className="text-sm text-gray-500 mt-0.5">{hotspot.itemLabel} — {property?.title?.slice(0, 40)}{property?.title?.length > 40 ? "…" : ""}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Item preview */}
          <div className="relative rounded-xl overflow-hidden bg-black" style={{ height: 200 }}>
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-80" />}
            {/* Gold hotspot indicator */}
            <div style={{
              position: "absolute",
              left: `${hotspot.xPercent}%`,
              top: `${hotspot.yPercent}%`,
              transform: "translate(-50%, -50%)",
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#F59E0B",
              border: "3px solid white",
              boxShadow: "0 0 0 4px rgba(245,158,11,0.4)",
            }} />
            <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              ⭐ {hotspot.itemLabel}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-gray-900">{hotspot.itemLabel}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{hotspot.kemetroCategorySlug}</span>
          </div>

          {/* Product selection */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Which of your products matches this item?</label>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search your Kemetro catalog…"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400"
              />
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              {filteredProducts.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">No products found</p>
              )}
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${selectedProduct?.id === p.id ? "bg-teal-50 border-teal-100" : ""}`}
                >
                  <img src={p.featured_image || p.avatar_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=60"} alt="" className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.title || p.name}</p>
                    <p className="text-xs text-teal-600 font-bold">{(p.price_amount || p.price || 0).toLocaleString("en-EG")} EGP</p>
                  </div>
                  {selectedProduct?.id === p.id && <span className="text-teal-500 font-black text-sm">✓</span>}
                </button>
              ))}
            </div>

            {selectedProduct && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-teal-50 rounded-xl border border-teal-200">
                <img src={selectedProduct.featured_image || selectedProduct.avatar_image || ""} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedProduct.title || selectedProduct.name}</p>
                  <p className="text-xs text-teal-700 font-bold mt-0.5">{(selectedProduct.price_amount || selectedProduct.price || 0).toLocaleString("en-EG")} EGP</p>
                </div>
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Campaign Duration</label>
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => setDurationIdx(i)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${durationIdx === i ? "bg-teal-500 text-white border-teal-500" : "bg-white text-gray-700 border-gray-200 hover:border-teal-300"}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {durationIdx === 3 && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Start</label>
                  <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">End</label>
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                </div>
              </div>
            )}
          </div>

          {/* Pricing breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Daily rate</span>
              <span className="font-bold text-gray-900">{DAILY_RATE} EGP/day</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Per click rate</span>
              <span className="font-bold text-gray-900">{CLICK_RATE} EGP/click</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-bold text-gray-900">{days} days ({startDate} → {endDate})</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
              <span className="font-bold text-gray-800">Estimated total</span>
              <span className="font-black text-orange-600">~{estimatedTotal.toLocaleString("en-EG")} EGP</span>
            </div>
            <p className="text-[11px] text-gray-400 pt-1">You are charged per day + per click your sponsored pin receives.</p>
          </div>

          {/* Campaign preview */}
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Campaign Preview</p>
            <div className="relative rounded-lg overflow-hidden mb-3 bg-gray-100" style={{ height: 120 }}>
              {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-70" />}
              <div style={{
                position: "absolute",
                left: `${hotspot.xPercent}%`,
                top: `${hotspot.yPercent}%`,
                transform: "translate(-50%, -50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#F59E0B",
                border: "2px solid white",
                boxShadow: "0 0 0 6px rgba(245,158,11,0.3)",
              }} />
            </div>
            <div className={`border-2 rounded-xl p-3 flex items-center gap-3 ${selectedProduct ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-gray-50"}`}>
              <img src={selectedProduct?.featured_image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=60"} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {selectedProduct ? (
                  <>
                    <p className="text-[10px] font-bold text-amber-600">⭐ SPONSORED — Appears FIRST</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{selectedProduct.title || selectedProduct.name}</p>
                    <p className="text-xs text-orange-600 font-bold">{(selectedProduct.price_amount || 0).toLocaleString("en-EG")} EGP</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Select a product to preview</p>
                )}
              </div>
            </div>
          </div>

          {/* Launch */}
          <button
            onClick={handleLaunch}
            disabled={!selectedProduct || launching}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-black text-base py-4 rounded-xl transition-colors"
          >
            {launching ? "Launching…" : "🚀 Launch Sponsorship"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HOTSPOT ROW ──────────────────────────────────────────────────────────────
function HotspotRow({ hotspot, sellerId, sellerProducts, property, imageUrl, onSponsor }) {
  const isOwnSponsored = hotspot.isSponsored && hotspot.sponsoredBySellerId === sellerId;
  const isOtherSponsored = hotspot.isSponsored && hotspot.sponsoredBySellerId !== sellerId;
  const isAvailable = !hotspot.isSponsored;

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div style={{
        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
        background: isOwnSponsored ? "#F59E0B" : isOtherSponsored ? "#EF4444" : "#0A6EBD",
        border: "2px solid white",
        boxShadow: "0 0 0 2px " + (isOwnSponsored ? "#F59E0B" : isOtherSponsored ? "#EF4444" : "#0A6EBD"),
      }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-bold text-gray-900">{hotspot.itemLabel}</span>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{hotspot.kemetroCategorySlug}</span>
        </div>
        {isOwnSponsored && (
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-amber-600 font-bold">⭐ Your sponsorship active</span>
            <span className="text-[10px] text-gray-400">Until {hotspot.sponsorshipEndDate}</span>
          </div>
        )}
        {isOtherSponsored && (
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] text-red-500 font-semibold">⭐ Sponsored by another seller</span>
            <span className="text-[10px] text-gray-400">Until {hotspot.sponsorshipEndDate}</span>
          </div>
        )}
        {isAvailable && (
          <span className="text-[11px] text-green-600 font-semibold">🟢 Available to sponsor</span>
        )}
      </div>
      <div className="flex-shrink-0">
        {isAvailable && (
          <button
            onClick={() => onSponsor(hotspot)}
            className="text-xs font-bold px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
          >
            Sponsor →
          </button>
        )}
        {isOtherSponsored && (
          <button className="text-xs font-bold px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
            Waitlist
          </button>
        )}
        {isOwnSponsored && (
          <span className="text-xs font-bold px-3 py-1.5 border border-amber-400 text-amber-600 rounded-lg">Managing</span>
        )}
      </div>
    </div>
  );
}

// ── SHOPPABLE PROPERTY CARD ───────────────────────────────────────────────────
function ShoppablePropertyCard({ property, sellerId, sellerProducts, onLaunch }) {
  const [expanded, setExpanded] = useState(false);
  const [analyzedImages, setAnalyzedImages] = useState([]);
  const [hotspotsByImage, setHotspotsByImage] = useState({});
  const [sponsorTarget, setSponsorTarget] = useState(null); // { hotspot, imageUrl }
  const [loadingExpand, setLoadingExpand] = useState(false);

  const totalTagged = property._hotspotCount || 0;
  const thumb = property.featured_image || (property.image_gallery?.[0]) || "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=70";

  const handleExpand = async () => {
    if (!expanded && analyzedImages.length === 0) {
      setLoadingExpand(true);
      try {
        const imgs = await apiClient.list("/api/v1/analyzedpropertyimage", 
          { propertyId: property.id, isAnalyzed: true, isShoppable: true }, "-created_date", 10
        );
        setAnalyzedImages(imgs || []);
        const map = {};
        await Promise.all((imgs || []).map(async img => {
          const hotspots = await apiClient.list("/api/v1/imagehotspot", { imageId: img.id, isActive: true }, "sortOrder", 20);
          map[img.id] = hotspots || [];
        }));
        setHotspotsByImage(map);
      } catch (e) { console.error(e); }
      finally { setLoadingExpand(false); }
    }
    setExpanded(e => !e);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="cursor-pointer" onClick={handleExpand}>
          <div className="relative" style={{ height: 160 }}>
            <img src={thumb} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-teal-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              ✨ {totalTagged} shoppable items
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{property.title}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin size={10} /> {[property.city_name, property.district_name].filter(Boolean).join(", ")}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Eye size={10} /> {(property._totalViews || Math.floor(Math.random() * 3000 + 500)).toLocaleString()} views/month
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-teal-600 font-bold">Tap to see hotspots</span>
              {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </div>
          </div>
        </div>

        {/* Expanded hotspot list */}
        {expanded && (
          <div className="border-t border-gray-100 px-4 py-3">
            {loadingExpand && <p className="text-xs text-gray-400 text-center py-4">Loading hotspots…</p>}
            {!loadingExpand && analyzedImages.map(img => (
              <div key={img.id} className="mb-4">
                <div className="relative rounded-xl overflow-hidden mb-2" style={{ height: 180 }}>
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  {(hotspotsByImage[img.id] || []).map(h => (
                    <div key={h.id} style={{
                      position: "absolute",
                      left: `${h.xPercent}%`,
                      top: `${h.yPercent}%`,
                      transform: "translate(-50%, -50%)",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: h.isSponsored ? "#F59E0B" : "#0A6EBD",
                      border: "2px solid white",
                      boxShadow: "0 0 0 3px " + (h.isSponsored ? "rgba(245,158,11,0.4)" : "rgba(10,110,189,0.3)"),
                    }} />
                  ))}
                  {img.roomStyle && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{img.roomStyle}</div>
                  )}
                </div>
                {(hotspotsByImage[img.id] || []).map(h => (
                  <HotspotRow
                    key={h.id}
                    hotspot={h}
                    sellerId={sellerId}
                    sellerProducts={sellerProducts}
                    property={property}
                    imageUrl={img.imageUrl}
                    onSponsor={(hotspot) => setSponsorTarget({ hotspot, imageUrl: img.imageUrl })}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {sponsorTarget && (
        <SponsorshipModal
          hotspot={sponsorTarget.hotspot}
          property={property}
          imageUrl={sponsorTarget.imageUrl}
          sellerId={sellerId}
          sellerProducts={sellerProducts}
          onClose={() => setSponsorTarget(null)}
          onLaunch={() => { setSponsorTarget(null); onLaunch(); }}
        />
      )}
    </>
  );
}

// ── MAIN TAB ─────────────────────────────────────────────────────────────────
export default function SponsorRoomTab({ sellerId }) {
  const [section, setSection] = useState("browse"); // browse | active | analytics
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCity, setFilterCity] = useState("");
  const [sellerProducts, setSellerProducts] = useState([]);
  const [activeSponsorships, setActiveSponsorships] = useState([]);
  const [logStats, setLogStats] = useState({ impressions: 0, clicks: 0, carts: 0, spent: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Load seller's products
    if (sellerId) {
      apiClient.list("/api/v1/kemetroproduct", { store_owner_id: sellerId, is_active: true }, "-created_date", 50)
        .then(setSellerProducts)
        .catch(() => {});
    }
  }, [sellerId]);

  useEffect(() => {
    if (section === "active") loadActiveSponsorships();
    if (section === "analytics") loadAnalytics();
  }, [section]);

  const loadShoppableProperties = async () => {
    setLoadingProps(true);
    try {
      // Get analyzed shoppable images
      const images = await apiClient.list("/api/v1/analyzedpropertyimage", 
        { isAnalyzed: true, isShoppable: true }, "-totalHotspotClicks", 50
      );
      // Unique property IDs
      const propIds = [...new Set((images || []).map(img => img.propertyId))].slice(0, 20);
      // Fetch properties
      const propList = await Promise.all(
        propIds.map(id => apiClient.list("/api/v1/property", { id }).then(res => res?.[0]).catch(() => null))
      );
      const valid = propList.filter(Boolean);
      // Annotate with hotspot count
      const annotated = valid.map(p => ({
        ...p,
        _hotspotCount: images.filter(img => img.propertyId === p.id).reduce((s, img) => s + (img.hotspotCount || 0), 0),
        _totalViews: images.filter(img => img.propertyId === p.id).reduce((s, img) => s + (img.totalViews || 0), 0),
      }));
      setProperties(annotated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProps(false);
    }
  };

  const loadActiveSponsorships = async () => {
    if (!sellerId) return;
    try {
      const hotspots = await apiClient.list("/api/v1/imagehotspot", 
        { sponsoredBySellerId: sellerId }, "-created_date", 50
      );
      // Enrich with image / property data
      const enriched = await Promise.all((hotspots || []).map(async h => {
        const [imgs, logs] = await Promise.all([
          apiClient.list("/api/v1/analyzedpropertyimage", { id: h.imageId }).catch(() => []),
          apiClient.list("/api/v1/hotspotsponsorshiplog", { hotspotId: h.id }).catch(() => []),
        ]);
        const img = imgs?.[0];
        const property = img ? await apiClient.list("/api/v1/property", { id: img.propertyId }).then(r => r?.[0]).catch(() => null) : null;
        const impressions = logs.filter(l => l.eventType === "impression").length;
        const clicks = logs.filter(l => l.eventType === "click").length;
        const carts = logs.filter(l => l.eventType === "add_to_cart").length;
        const spent = logs.reduce((s, l) => s + (l.costEGP || 0), 0);
        return { ...h, _property: property, _imageUrl: img?.imageUrl, impressions, clicks, carts, spent };
      }));
      setActiveSponsorships(enriched);
    } catch (e) { console.error(e); }
  };

  const loadAnalytics = async () => {
    if (!sellerId) return;
    try {
      const logs = await apiClient.list("/api/v1/hotspotsponsorshiplog", { sellerId }, "-recordedAt", 500);
      const impressions = (logs || []).filter(l => l.eventType === "impression").length;
      const clicks = (logs || []).filter(l => l.eventType === "click").length;
      const carts = (logs || []).filter(l => l.eventType === "add_to_cart").length;
      const spent = (logs || []).reduce((s, l) => s + (l.costEGP || 0), 0);
      setLogStats({ impressions, clicks, carts, spent });

      // Group clicks by day for chart
      const dayMap = {};
      (logs || []).filter(l => l.eventType === "click").forEach(l => {
        const day = (l.recordedAt || "").split("T")[0];
        if (day) dayMap[day] = (dayMap[day] || 0) + 1;
      });
      const sorted = Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b)).slice(-30);
      setChartData(sorted.map(([day, clicks]) => ({ day: day.slice(5), clicks })));
    } catch (e) { console.error(e); }
  };

  const handleToggleStatus = async (hotspot) => {
    const newStatus = hotspot.sponsorshipStatus === "active" ? "paused" : "active";
    await apiClient.put("/api/v1/imagehotspot/", hotspot.id, { sponsorshipStatus: newStatus });
    loadActiveSponsorships();
  };

  const handleEndCampaign = async (hotspot) => {
    await apiClient.put("/api/v1/imagehotspot/", hotspot.id, {
      isSponsored: false,
      sponsorshipStatus: "ended",
    });
    loadActiveSponsorships();
  };

  return (
    <div>
      {/* Section nav */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: "browse", label: "🏠 Browse Properties" },
          { key: "active", label: "📌 My Sponsorships" },
          { key: "analytics", label: "📊 Analytics" },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => { setSection(s.key); if (s.key === "browse" && properties.length === 0) loadShoppableProperties(); if (s.key === "active") loadActiveSponsorships(); if (s.key === "analytics") loadAnalytics(); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${section === s.key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── BROWSE ── */}
      {section === "browse" && (
        <div>
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-5">
            <p className="text-sm font-bold text-teal-800">💡 Buyers browsing luxury properties are already thinking about furniture. Get in front of them at the exact moment of inspiration.</p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-5">
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 bg-white">
              <option value="all">All Categories</option>
              {CATEGORY_SLUGS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              placeholder="Filter by city…"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 w-40"
            />
            <button
              onClick={loadShoppableProperties}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm rounded-xl transition-colors"
            >
              <Search size={14} /> Search
            </button>
          </div>

          {loadingProps && (
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingProps && properties.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🏠</p>
              <p className="font-bold">No shoppable properties found yet</p>
              <p className="text-sm mt-1">Click Search to load available properties</p>
            </div>
          )}

          {!loadingProps && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties
                .filter(p => !filterCity || (p.city_name || "").toLowerCase().includes(filterCity.toLowerCase()))
                .map(p => (
                  <ShoppablePropertyCard
                    key={p.id}
                    property={p}
                    sellerId={sellerId}
                    sellerProducts={sellerProducts}
                    onLaunch={loadActiveSponsorships}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* ── MY SPONSORSHIPS ── */}
      {section === "active" && (
        <div>
          {activeSponsorships.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📌</p>
              <p className="font-bold">No sponsorships yet</p>
              <p className="text-sm mt-1">Browse properties to sponsor a hotspot</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Property", "Item Tagged", "Product Pinned", "Impressions", "Clicks", "Add to Carts", "Spent (EGP)", "Status", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeSponsorships.map(h => (
                    <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 max-w-[160px]">
                          {h._imageUrl && <img src={h._imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />}
                          <span className="text-xs text-gray-700 line-clamp-2">{h._property?.title || "Property"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-gray-900">{h.itemLabel}</span>
                        <br /><span className="text-[10px] text-gray-400">{h.kemetroCategorySlug}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-teal-700 font-bold">{h.sponsoredProductId ? "✓ Linked" : "—"}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-700">{(h.impressions || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-700">{(h.clicks || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-700">{(h.carts || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs font-bold text-orange-600">{(h.spent || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          h.sponsorshipStatus === "active" ? "bg-teal-100 text-teal-700" :
                          h.sponsorshipStatus === "paused" ? "bg-orange-100 text-orange-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          {h.sponsorshipStatus || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleToggleStatus(h)}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                            title={h.sponsorshipStatus === "active" ? "Pause" : "Resume"}
                          >
                            {h.sponsorshipStatus === "active" ? <Pause size={13} /> : <Play size={13} />}
                          </button>
                          <button
                            onClick={() => handleEndCampaign(h)}
                            className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500"
                            title="End Campaign"
                          >
                            <StopCircle size={13} />
                          </button>
                          {h._property && (
                            <a
                              href={`/property/${h._property.id}`}
                              target="_blank" rel="noreferrer"
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                              title="View Property"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {section === "analytics" && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Impressions", value: logStats.impressions.toLocaleString(), icon: "👁️", color: "bg-blue-50 text-blue-700" },
              { label: "Total Clicks", value: `${logStats.clicks.toLocaleString()} (CTR: ${logStats.impressions ? ((logStats.clicks / logStats.impressions) * 100).toFixed(1) : 0}%)`, icon: "🖱️", color: "bg-teal-50 text-teal-700" },
              { label: "Add to Carts", value: logStats.carts.toLocaleString(), icon: "🛒", color: "bg-purple-50 text-purple-700" },
              { label: "Total Spent", value: `${logStats.spent.toLocaleString()} EGP`, icon: "💳", color: "bg-orange-50 text-orange-700" },
              { label: "Orders Attributed", value: "—", icon: "📦", color: "bg-green-50 text-green-700" },
            ].map((k, i) => (
              <div key={i} className={`${k.color} rounded-2xl p-4`}>
                <p className="text-2xl mb-1">{k.icon}</p>
                <p className="text-xl font-black leading-tight">{k.value}</p>
                <p className="text-xs font-bold mt-1">{k.label}</p>
                {k.label === "Orders Attributed" && (
                  <p className="text-[10px] opacity-70 mt-0.5">Orders where buyer clicked your pin first</p>
                )}
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Clicks per Campaign (Last 30 Days)</h3>
            {chartData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No click data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}