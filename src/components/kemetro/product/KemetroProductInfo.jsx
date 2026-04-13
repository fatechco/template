import { useState } from "react";
import { Heart, Share2, Facebook, Copy, MessageCircle, Truck, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";

export default function KemetroProductInfo({ product }) {
  const [quantity, setQuantity] = useState(product.minOrderQuantity || 1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const variants = product.imageGallery?.length > 0
    ? ["Red", "Blue", "Green"].slice(0, Math.min(3, product.imageGallery.length))
    : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <p className="text-xs text-gray-500">
        Home &gt; {product.categoryId || "Category"} &gt; {product.name}
      </p>

      {/* Title and Store */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">{product.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <a href={`/kemetro/store/${product.storeId}`} className="text-[#0077B6] hover:underline font-semibold text-sm">
            {product.storeId || "Store Name"}
          </a>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">✓ Verified</span>
        </div>
        <p className="text-sm text-gray-600">
          ⭐ {product.rating || 0} ({product.totalReviews || 0} reviews) • {product.totalSold || 0} sold
        </p>
      </div>

      {/* SKU, Brand, Origin */}
      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 border-b pb-4">
        <div>
          <p className="text-gray-500">SKU</p>
          <p className="font-semibold">{product.sku || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Brand</p>
          <p className="font-semibold">{product.brand || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Origin</p>
          <p className="font-semibold">{product.origin || "N/A"}</p>
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <div className="text-4xl font-black text-[#0077B6]">
            ${product.salePrice || product.price}
          </div>
          {product.salePrice && (
            <>
              <div className="text-lg text-gray-400 line-through">${product.price}</div>
              <div className="text-sm font-black text-red-500 bg-red-50 px-2 py-1 rounded">
                -{discount}%
              </div>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600">{product.priceUnit || "per piece"}</p>
      </div>

      {/* Min Order */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-[#0077B6]">
          <span className="font-semibold">Minimum order:</span> {product.minOrderQuantity || 1} pieces
        </p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.isInStock ? (
          <>
            <CheckCircle size={18} className="text-green-600" />
            <span className="font-semibold text-green-600">In Stock</span>
          </>
        ) : (
          <>
            <AlertCircle size={18} className="text-red-600" />
            <span className="font-semibold text-red-600">Out of Stock</span>
          </>
        )}
      </div>

      {/* Variants */}
      {variants.length > 0 && (
        <div>
          <p className="text-sm font-bold text-gray-900 mb-3">Available Colors</p>
          <div className="flex gap-2">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedVariant === variant
                    ? "bg-[#FF6B00] text-white"
                    : "border border-gray-300 text-gray-700 hover:border-[#FF6B00]"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-900">Quantity</p>
        <div className="flex items-center gap-3 w-fit">
          <button
            onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg hover:border-[#FF6B00] transition-colors font-bold"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(product.minOrderQuantity || 1, parseInt(e.target.value) || 1))}
            className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-center font-bold focus:outline-none focus:border-[#FF6B00]"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-lg hover:border-[#FF6B00] transition-colors font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3 rounded-lg transition-colors text-lg">
          Add to Cart
        </button>
        <button className="w-full border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">
          Add to Wishlist
        </button>
        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors">
          Buy Now
        </button>
      </div>

      {/* Delivery Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Truck size={20} className="text-[#0077B6]" />
          <div>
            <p className="text-xs text-gray-500">Delivery to</p>
            <p className="font-semibold text-gray-900">Cairo, Egypt</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck size={20} className="text-[#0077B6]" />
          <div>
            <p className="text-xs text-gray-500">Estimated Delivery</p>
            <p className="font-semibold text-gray-900">3-7 Business Days</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw size={20} className="text-[#0077B6]" />
          <div>
            <p className="text-xs text-gray-500">Returns</p>
            <p className="font-semibold text-gray-900">Accepted within 14 days</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="border-t pt-4">
        <p className="text-sm font-bold text-gray-900 mb-3">Share</p>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-[#0077B6] text-white rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center">
            <Facebook size={18} />
          </button>
          <button className="w-10 h-10 bg-green-500 text-white rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center">
            <MessageCircle size={18} />
          </button>
          <button className="w-10 h-10 bg-gray-300 text-gray-700 rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center">
            <Copy size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}