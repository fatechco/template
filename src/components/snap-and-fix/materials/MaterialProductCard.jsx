import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function MaterialProductCard({ product, materialIndex, session, onAdded }) {
  const [status, setStatus] = useState("idle"); // idle | adding | added

  const handleAddToCart = async () => {
    if (status === "added") return;
    setStatus("adding");
    try {
      await base44.entities.SnapMaterialCartItem.create({
        snapSessionId: session.id,
        userId: session.userId || null,
        sessionToken: session.sessionToken,
        materialIndex,
        itemName: product.name || product.title || "",
        kemetroSearchKeywords: product._searchKeywords || "",
        kemetroProductId: product.id,
        productName: product.name || product.title || "",
        productImageUrl: product.featured_image || product.image || "",
        productPriceEGP: product.price || product.price_amount || 0,
        quantity: 1,
        addedAt: new Date().toISOString(),
        isOrdered: false,
      });

      // Increment cart count on session
      await base44.entities.SnapSession.update(session.id, {
        kemetroItemsAddedToCart: (session.kemetroItemsAddedToCart || 0) + 1,
      });

      setStatus("added");
      onAdded?.(product);
      setTimeout(() => setStatus("added"), 1500);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {/* Image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {product.featured_image || product.image ? (
          <img
            src={product.featured_image || product.image}
            alt={product.name || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {product.store_name && (
          <p className="text-[10px] font-bold text-blue-600 mb-0.5 flex items-center gap-1">
            {product.store_name}
            {product.is_verified && <span className="text-green-500">✅</span>}
          </p>
        )}
        <p className="text-[13px] font-bold text-gray-800 leading-snug line-clamp-2">
          {product.name || product.title || "Product"}
        </p>
        <p className="text-[15px] font-black text-orange-500 mt-0.5">
          {Number(product.price || product.price_amount || 0).toLocaleString()} EGP
        </p>
      </div>

      {/* Add button */}
      <button
        onClick={handleAddToCart}
        disabled={status === "adding"}
        className="flex-shrink-0 px-3 py-2 rounded-xl text-[12px] font-bold transition-all"
        style={{
          background: status === "added" ? "#22C55E" : "#0A6EBD",
          color: "white",
          minWidth: 70,
        }}
      >
        {status === "adding" ? (
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        ) : status === "added" ? (
          "✅ Added!"
        ) : (
          "🛒 Add"
        )}
      </button>
    </div>
  );
}