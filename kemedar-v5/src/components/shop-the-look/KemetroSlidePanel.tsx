"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { X, ShoppingCart, Eye, FileText, Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

function SkeletonCard() {
  return (
    <div className="flex gap-3 p-3 border-b border-gray-100">
      <div className="w-[88px] h-[88px] rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3 mt-2" />
      </div>
    </div>
  );
}

function ProductCard({ product, hotspotId, userId, sessionId, onCartUpdate }) {
  const [cartState, setCartState] = useState("idle"); // idle | loading | added

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
    <div className={`relative flex gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSponsored ? "border-t-[3px] border-t-amber-400" : ""}`}>
      {isSponsored && (
        <div className="absolute top-2 right-3 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
          ⭐ Sponsored
        </div>
      )}

      {/* Product image */}
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70"}
        alt={productName}
        className="w-[88px] h-[88px] rounded-lg object-cover flex-shrink-0"
      />

      {/* Product info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[10px] font-bold text-[#0A6EBD] truncate">{product.store_name || "Kemetro Seller"}</span>
            {storeVerified && (
              <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 py-0.5 rounded-full flex-shrink-0">✅ Verified</span>
            )}
          </div>
          <p className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-2">{productName}</p>
          <p className="text-[16px] font-black text-[#FF6B00] mt-1">{priceFormatted} EGP</p>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <button
            onClick={handleAddToCart}
            disabled={cartState === "loading"}
            className={`w-full h-8 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              cartState === "added"
                ? "bg-green-500 text-white"
                : "bg-[#0A6EBD] hover:bg-[#085fa8] text-white"
            }`}
          >
            <ShoppingCart size={13} />
            {cartState === "added" ? "✅ Added!" : cartState === "loading" ? "Adding..." : "Add to Cart"}
          </button>

          <a
            href={`/kemetro/product/${product.slug || product.id}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={11} /> View on Kemetro
          </a>
        </div>
      </div>
    </div>
  );
}

export default function KemetroSlidePanel({ hotspot, isOpen, onClose, userId, sessionId, onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load products when hotspot changes
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

  if (!hotspot) return null;

  const rfqUrl = `/kemetro/rfq/create?title=${encodeURIComponent(`Looking for: ${hotspot.itemLabel}`)}&category=${hotspot.kemetroCategorySlug}&description=${encodeURIComponent(hotspot.searchKeywords || "")}`;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[350]"
          style={{ background: "transparent" }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 400,
          height: "100vh",
          background: "white",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          zIndex: 400,
          transform: isOpen ? "translateX(0)" : "translateX(400px)",
          transition: "transform 300ms ease",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#0A1628", padding: "16px 20px", flexShrink: 0 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-[15px]">Kemetro</span>
              <ShoppingCart size={15} className="text-white opacity-70" />
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <X size={22} />
            </button>
          </div>
          <p className="text-white font-bold text-[18px] leading-tight">Shop Similar Items</p>
          <p className="text-[#00C896] text-[13px] mt-0.5 truncate">{hotspot.itemLabel}</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          )}

          {!loading && loaded && products.length > 0 && products.map((product, i) => (
            <ProductCard
              key={product.id || i}
              product={product}
              hotspotId={hotspot.id}
              userId={userId}
              sessionId={sessionId}
              onCartUpdate={onCartUpdate}
            />
          ))}

          {!loading && loaded && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Search size={32} className="text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">No exact matches found yet</p>
              <p className="text-sm text-gray-400 mt-1">Kemetro sellers are adding new products daily.</p>
            </div>
          )}

          {/* Fallback CTA */}
          {!loading && loaded && (
            <div className="m-4 p-4 rounded-xl" style={{ background: "#EFF6FF" }}>
              <p className="text-sm text-gray-700 font-medium mb-3">Can't find what you're looking for?</p>
              <a
                href={rfqUrl}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-[#0A6EBD] text-[#0A6EBD] font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                <FileText size={14} /> Post a Request to Kemetro Sellers
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-3 text-center flex-shrink-0">
          <p className="text-[11px] text-gray-400">Shop the Look powered by Kemetro × Kemedar AI</p>
        </div>
      </div>
    </>
  );
}