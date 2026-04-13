import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function AuctionPropertyCard({ property, auction }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-black text-gray-900 mb-2">
        {property.title}
      </h2>
      <p className="text-gray-600 flex items-center gap-2 mb-6">
        <MapPin size={16} />
        {property.city_name || "Location"}, {property.district_id || "District"}
      </p>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-100">
        {property.beds && (
          <div>
            <p className="text-sm text-gray-500 font-bold">Beds</p>
            <p className="text-xl font-black text-gray-900">{property.beds}</p>
          </div>
        )}
        {property.baths && (
          <div>
            <p className="text-sm text-gray-500 font-bold">Baths</p>
            <p className="text-xl font-black text-gray-900">{property.baths}</p>
          </div>
        )}
        {property.area_size && (
          <div>
            <p className="text-sm text-gray-500 font-bold">Area</p>
            <p className="text-xl font-black text-gray-900">{property.area_size} sqm</p>
          </div>
        )}
        {property.verification_level && (
          <div>
            <p className="text-sm text-gray-500 font-bold">Verify Level</p>
            <p className="text-xl font-black text-green-600">L{property.verification_level}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {property.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {property.description}
        </p>
      )}

      {/* Link to full property */}
      <Link
        to={`/property/${property.id}`}
        className="inline-block text-red-600 font-bold hover:text-red-700 transition-colors"
      >
        View Full Property Details →
      </Link>
    </div>
  );
}