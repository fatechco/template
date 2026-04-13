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

export default function PropertyCardGrid({ property, index }) {
  const [saved, setSaved] = useState(false);
  const image = property.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const purposeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";

  const level = property.verification_level || (property.is_verified ? 3 : 1);

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border group cursor-pointer
      ${level >= 5 ? "border-yellow-400 border-2" : "border-gray-100"}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={property.title || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-2 left-2 ${purposeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
          {(property.purpose || "FOR SALE").toUpperCase()}
        </span>
        {property.is_featured && (
          <span className="absolute top-2 left-24 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            FEATURED
          </span>
        )}
        {level >= 5 && (
          <div className="absolute top-0 left-0">
            <div className="bg-yellow-400 text-white font-black text-[9px] px-3 py-1"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}>
              VERIFIED
            </div>
          </div>
        )}
        {level >= 2 && level < 5 && (
          <div className="absolute top-2 right-10">
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

      {/* Content */}
      <div className="p-4">
        <PriceDisplay
          amountEGP={property.price_amount}
          contactForPrice={property.is_contact_for_price}
        />
        <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{property.title || "Property Listing"}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
          <MapPin size={11} className="text-[#FF6B00] flex-shrink-0" />
          {[property.city_name, property.district_name].filter(Boolean).join(", ") || property.address || "Location N/A"}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {property.beds != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={12} className="text-[#FF6B00]" /> {property.beds} Beds
            </span>
          )}
          {property.baths != null && (
            <span className="flex items-center gap-1">
              <Bath size={12} className="text-[#FF6B00]" /> {property.baths} Baths
            </span>
          )}
          {property.area_size && (
            <span className="flex items-center gap-1">
              <Maximize2 size={12} className="text-[#FF6B00]" /> {property.area_size} m²
            </span>
          )}
          {property.view_count > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Eye size={11} className="text-gray-300" /> {property.view_count}
            </span>
          )}
        </div>

        {/* Publisher + CTA */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-[#FF6B00]">
              {(property.publisher_name || "U")[0].toUpperCase()}
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[80px]">{property.publisher_name || "Agent"}</span>
          </div>
          <a
            href={`/property/${property.id}`}
            className="text-xs font-bold text-[#FF6B00] hover:underline flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </a>
        </div>
      </div>
    </div>
  );
}