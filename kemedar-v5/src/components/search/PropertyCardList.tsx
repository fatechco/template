"use client";
// @ts-nocheck
import { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Maximize2, Eye } from "lucide-react";
import VerifyProBadge from "@/components/verify/VerifyProBadge";
import PriceDisplay from "@/components/ui/PriceDisplay";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

const PURPOSE_COLORS = {
  "For Sale": "bg-blue-600",
  "For Rent": "bg-green-600",
  "For Investment": "bg-purple-600",
  "For Daily Booking": "bg-pink-600",
  "In Auction": "bg-red-600",
};

export default function PropertyCardList({ property, index }) {
  const [saved, setSaved] = useState(false);
  const image = property.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const purposeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";

  const level = property.verification_level || (property.is_verified ? 3 : 1);

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex group cursor-pointer border
      ${level >= 5 ? "border-yellow-400 border-2" : "border-gray-100"}`}>
      {/* Image — 30% */}
      <div className="relative w-[30%] flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={property.title || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[180px]"
        />
        <span className={`absolute top-2 left-2 ${purposeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
          {(property.purpose || "FOR SALE").toUpperCase()}
        </span>
        {level >= 5 && (
          <div className="absolute top-0 left-0">
            <div className="bg-yellow-400 text-white font-black text-[9px] px-3 py-1"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}>
              VERIFIED
            </div>
          </div>
        )}
        {level >= 2 && level < 5 && (
          <div className="absolute bottom-2 left-2">
            <VerifyProBadge level={level} size="sm" />
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
        >
          <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Details — 70% */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <PriceDisplay
                amountEGP={property.price_amount}
                contactForPrice={property.is_contact_for_price}
                size="lg"
              />
              <p className="font-bold text-gray-900 text-base mt-0.5">{property.title || "Property Listing"}</p>
            </div>
            {property.is_featured && (
              <span className="bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0">FEATURED</span>
            )}
          </div>

          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin size={13} className="text-[#FF6B00]" />
            {[property.city_name, property.district_name].filter(Boolean).join(", ") || property.address || "Location N/A"}
          </p>

          {/* Specs */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            {property.beds != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={14} className="text-[#FF6B00]" /> {property.beds} Bedrooms
              </span>
            )}
            {property.baths != null && (
              <span className="flex items-center gap-1.5">
                <Bath size={14} className="text-[#FF6B00]" /> {property.baths} Bathrooms
              </span>
            )}
            {property.area_size && (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={14} className="text-[#FF6B00]" /> {property.area_size} m²
              </span>
            )}
            {property.view_count > 0 && (
              <span className="flex items-center gap-1.5 ml-auto text-gray-300">
                <Eye size={13} /> {property.view_count} views
              </span>
            )}
          </div>

          {property.description && (
            <p className="text-sm text-gray-400 mt-3 line-clamp-2 leading-relaxed">{property.description}</p>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#FF6B00]">
              {(property.publisher_name || "U")[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-500">{property.publisher_name || "Agent"}</span>
          </div>
          <a
            href={`/property/${property.id}`}
            className="bg-[#FF6B00] hover:bg-[#e55f00] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
}