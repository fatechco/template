"use client";
// @ts-nocheck
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function KemetroProductCard({ product, badge = null, badgeType = "featured" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const badgeColors = {
    featured: "bg-yellow-400 text-yellow-900",
    new: "bg-green-400 text-green-900",
  };

  return (
    <div className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
      {/* Image container */}
      <Link href={`/kemetro/product/${product.slug || product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-3 left-3 ${badgeColors[badgeType]} px-2 py-1 rounded-lg text-xs font-bold`}>
            {badge}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all group/heart"
        >
          <Heart
            size={16}
            className={`transition-all ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500"}`}
          />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Eye size={18} className="text-gray-900" />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Link href={`/kemetro/store/${product.storeId}`} className="text-xs text-blue-600 font-semibold hover:underline">
          {product.storeName}
        </Link>
        <Link href={`/kemetro/product/${product.slug || product.id}`} className="block font-bold text-gray-900 text-sm line-clamp-2 hover:text-[#FF6B00] transition-colors">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="font-bold text-gray-900">
          ${product.price}{" "}
          <span className="text-xs text-gray-500 font-normal">/ {product.priceUnit}</span>
        </div>

        {/* Add to cart */}
        <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
          <ShoppingCart size={14} /> Add
        </button>
      </div>
    </div>
  );
}