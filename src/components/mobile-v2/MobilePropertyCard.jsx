import { Heart, MapPin, Bed, Bath, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PURPOSE_COLORS = {
  "For Sale":          { bg: "#FEF3C7", text: "#92400E" },
  "For Rent":          { bg: "#DBEAFE", text: "#1E40AF" },
  "Daily Booking":     { bg: "#D1FAE5", text: "#065F46" },
  default:             { bg: "#F3F4F6", text: "#374151" },
};

function PurposeBadge({ label, small }) {
  const colors = PURPOSE_COLORS[label] || PURPOSE_COLORS.default;
  return (
    <span
      className={`font-bold rounded-full ${small ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-1"}`}
      style={{ background: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}

/* ── VERTICAL card (grid) ── */
function VerticalCard({ property, onFavoriteToggle }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
      onClick={() => navigate(`/m/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative" style={{ height: 180 }}>
        <img
          src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <PurposeBadge label={property.purpose || "For Sale"} />
        </div>
        <button
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); setFav(!fav); onFavoriteToggle?.(property); }}
        >
          <Heart size={16} fill={fav ? "#EF4444" : "none"} color={fav ? "#EF4444" : "#374151"} />
        </button>
      </div>
      {/* Content */}
      <div className="p-3">
        <p className="font-bold text-orange-600 text-lg leading-tight">
          {property.price || "Contact for price"}
        </p>
        <p className="font-bold text-gray-900 text-sm mt-0.5 line-clamp-2 leading-tight">
          {property.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-400 truncate">{property.city || "—"}</span>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {property.beds !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Bed size={12} /> {property.beds}
            </span>
          )}
          {property.baths !== undefined && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Bath size={12} /> {property.baths}
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Maximize2 size={12} /> {property.area} sqm
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── HORIZONTAL card (list) ── */
function HorizontalCard({ property, onFavoriteToggle }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex active:scale-[0.98] transition-transform cursor-pointer"
      style={{ height: 100 }}
      onClick={() => navigate(`/m/property/${property.id}`)}
    >
      {/* Image */}
      <div className="relative flex-shrink-0" style={{ width: 120 }}>
        <img
          src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content */}
      <div className="flex-1 p-2.5 flex flex-col justify-between overflow-hidden">
        <div>
          <PurposeBadge label={property.purpose || "For Sale"} small />
          <p className="font-bold text-gray-900 text-[13px] mt-0.5 line-clamp-2 leading-tight">
            {property.title}
          </p>
        </div>
        <div>
          <p className="font-bold text-orange-600 text-sm">{property.price || "—"}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
              <MapPin size={10} /> {property.city || "—"}
            </span>
            {property.beds !== undefined && (
              <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                <Bed size={10} /> {property.beds}
              </span>
            )}
            {property.baths !== undefined && (
              <span className="flex items-center gap-0.5 text-[11px] text-gray-400">
                <Bath size={10} /> {property.baths}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobilePropertyCard({ property = {}, variant = "vertical", onFavoriteToggle }) {
  if (variant === "horizontal") {
    return <HorizontalCard property={property} onFavoriteToggle={onFavoriteToggle} />;
  }
  return <VerticalCard property={property} onFavoriteToggle={onFavoriteToggle} />;
}