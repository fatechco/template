// @ts-nocheck
import { MapPin, Home, Maximize2, Tag } from "lucide-react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80";

export default function VerifyCertPropertyDetails({ token, property }) {
  const attrs = token?.tokenAttributes || [];

  const pills = [
    property?.category_name && { label: `Category: ${property.category_name}` },
    property?.city_name && { label: `City: ${property.city_name}` },
    property?.area_size && { label: `Area: ${property.area_size} sqm` },
    token?.verificationLevel && { label: `Level: ${token.verificationLevel} — ${token.verificationLevel >= 5 ? "Fully Verified" : "Partial"}` },
    token?.mintedAt && { label: `Issued: ${new Date(token.mintedAt).getFullYear()}` },
    token?.chainLength && { label: `Chain: ${token.chainLength} records` },
  ].filter(Boolean);

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
        {/* Image */}
        <div className="w-full md:w-2/5 flex-shrink-0">
          <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]">
            <img
              src={property?.featured_image || property?.images?.[0] || FALLBACK_IMG}
              alt={property?.title || "Property"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-black text-gray-900 mb-3">{property?.title || "Kemedar Verified Property"}</h2>
          <div className="flex flex-col gap-2 mb-5 text-sm text-gray-600">
            {(property?.city_name || property?.district_name || property?.area_name) && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FF6B00] flex-shrink-0" />
                <span>{[property.city_name, property.district_name, property.area_name].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {property?.category_name && (
              <div className="flex items-center gap-2">
                <Home size={14} className="text-[#FF6B00] flex-shrink-0" />
                <span>{property.category_name}</span>
              </div>
            )}
            {property?.area_size && (
              <div className="flex items-center gap-2">
                <Maximize2 size={14} className="text-[#FF6B00] flex-shrink-0" />
                <span>{property.area_size} sqm</span>
              </div>
            )}
            {property?.purpose && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-[#FF6B00] flex-shrink-0" />
                <span>{property.purpose}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[#FF6B00]">👤</span>
              <span className="text-gray-500 italic">Verified Owner (name masked for privacy)</span>
            </div>
          </div>

          {/* Token attribute pills */}
          {pills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pills.map((p, i) => (
                <span key={i} className="bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}