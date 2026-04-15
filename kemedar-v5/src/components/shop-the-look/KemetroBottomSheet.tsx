"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, FileText, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-3" style={{ width: "85vw" }}>
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse mt-3" />
    </div>
  );
}

function MobileProductCard({ product, hotspotId, userId, sessionId, onCartUpdate }) {
  const [cartState, setCartState] = useState("idle");

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setCartState("loading");
    try {
      const res = await apiClient.post("/api/v1/ai/addToShopTheLookCart", {
        hotspotId,
        productId: product.id,
        userId: userId || null,
        sessionId,
      });
      setCartState("added");
      if (onCartUpdate) onCartUpdate(res?.data?.cartCount);
      setTimeout(() => setCartState("idle"), 1500);
    } catch {
      setCartState("idle");
    }
  };

  const price = product.price_amount || product.price || 0;
  const priceFormatted = price.toLocaleString("en-EG");
  const productName = product.title || product.name || "Product";
  const imageUrl = product.featured_image || product.avatar_image || product.image;
  const storeVerified = product.is_verified_seller || product._isVerifiedSeller;
  const isSponsored = product._isSponsored;

  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-3 flex flex-col"
      style={{
        width: "85vw",
        scrollSnapAlign: "start",
        borderTop: isSponsored ? "3px solid #F59E0B" : undefined,
        position: "relative",
      }}
    >
      {isSponsored && (
        <div className="absolute top-2 right-3 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
          ⭐ Sponsored
        </div>
      )}

      <div className="flex gap-3 mb-3">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70"}
          alt={productName}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <span className="text-[10px] font-bold text-[#0A6EBD] truncate">{product.store_name || "Kemetro"}</span>
            {storeVerified && (
              <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 py-0.5 rounded-full flex-shrink-0">✅</span>
            )}
          </div>
          <p className="text-[14px] font-bold text-gray-900 leading-tight line-clamp-2">{productName}</p>
          <p className="text-[18px] font-black text-[#FF6B00] mt-1">{priceFormatted} EGP</p>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={cartState === "loading"}
        className={`w-full font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all ${
          cartState === "added"
            ? "bg-green-500 text-white"
            : "bg-[#0A6EBD] hover:bg-[#085fa8] text-white"
        }`}
        style={{ height: 48 }}
      >
        <ShoppingCart size={16} />
        {cartState === "added" ? "✅ Added!" : cartState === "loading" ? "Adding..." : "Add to Kemetro Cart"}
      </button>
    </div>
  );
}

export default function KemetroBottomSheet({ hotspot, isOpen, onClose, userId, sessionId, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);

  useEffect(() => {
    if (!hotspot || !isOpen) return;
    setLoading(true);
    setLoaded(false);
    setProducts([]);
    apiClient.post("/api/v1/ai/searchKemetroProducts", { hotspotId: hotspot.id })
      .then(res => {
        setProducts(res?.data?.products || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true))
      .finally(() => setLoading(false));
  }, [hotspot?.id, isOpen]);

  // Swipe down to close
  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (dragStartY.current === null) return;
    const diff = e.changedTouches[0].clientY - dragStartY.current;
    if (diff > 80) onClose();
    dragStartY.current = null;
  };

  if (!hotspot) return null;

  const rfqUrl = `/kemetro/rfq/create?title=${encodeURIComponent(`Looking for: ${hotspot.itemLabel}`)}&category=${hotspot.kemetroCategorySlug}&description=${encodeURIComponent(hotspot.searchKeywords || "")}`;

  return (
    <>
      {/* Dark overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[350] bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "75vh",
          background: "white",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -8px 32px rgba(0,0,0,0.15)",
          zIndex: 400,
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 300ms ease-out",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>

        {/* Header */}
        <div style={{ background: "#0A1628", padding: "14px 20px", flexShrink: 0, borderRadius: "24px 24px 0 0", marginTop: -1 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 }}>Found in this photo:</p>
          <p style={{ color: "white", fontWeight: 900, fontSize: 18, lineHeight: 1.2, marginBottom: hotspot.isSponsored ? 4 : 0 }}>
            {hotspot.itemLabel}
          </p>
          {hotspot.isSponsored && (
            <p style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700 }}>⭐ Exact Match Available</p>
          )}
        </div>

        {/* Product carousel — horizontal scroll */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            className="flex gap-3 overflow-x-auto px-4 pt-4 pb-2 no-scrollbar"
            style={{ scrollSnapType: "x mandatory", flexShrink: 0 }}
          >
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {!loading && loaded && products.length > 0 && products.map((product, i) => (
              <MobileProductCard
                key={product.id || i}
                product={product}
                hotspotId={hotspot.id}
                userId={userId}
                sessionId={sessionId}
                onCartUpdate={onCartUpdate}
              />
            ))}

            {!loading && loaded && products.length === 0 && (
              <div
                className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center"
                style={{ width: "85vw" }}
              >
                <Search size={32} className="text-gray-300 mb-3" />
                <p className="font-bold text-gray-700 text-sm">No exact matches found</p>
                <p className="text-xs text-gray-400 mt-1">Sellers are adding products daily</p>
                <a
                  href={rfqUrl}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-[#0A6EBD] text-[#0A6EBD] font-bold text-sm"
                >
                  <FileText size={14} /> Post a Request →
                </a>
              </div>
            )}
          </div>

          {/* Bottom fallback CTA */}
          {!loading && loaded && (
            <div className="px-4 pb-4 pt-2">
              <div className="p-4 rounded-2xl" style={{ background: "#EFF6FF" }}>
                <p className="text-sm text-gray-700 font-medium mb-3 text-center">
                  Can't find it? Let sellers come to you.
                </p>
                <a
                  href={rfqUrl}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#0A6EBD] text-[#0A6EBD] font-bold text-sm"
                >
                  <FileText size={14} /> Post a Request to Kemetro Sellers
                </a>
              </div>
            </div>
          )}

          <div style={{ height: 16 }} />
        </div>
      </div>
    </>
  );
}