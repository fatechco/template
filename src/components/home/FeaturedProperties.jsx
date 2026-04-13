import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, BedDouble, Bath, Maximize2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "./SectionHeader";
import PriceDisplay from "@/components/ui/PriceDisplay";

const PURPOSES = ["For Sale", "For Daily Booking", "For Rent", "For Auction", "For Investment and Partnership"];

const PURPOSE_COLORS = {
  "For Sale": "bg-blue-600",
  "For Daily Booking": "bg-purple-600",
  "For Rent": "bg-green-600",
  "For Auction": "bg-red-600",
  "For Investment and Partnership": "bg-yellow-600",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

function PropertyCard({ property, index }) {
  const [saved, setSaved] = useState(false);
  const image = property.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const badgeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";

  return (
    <Link to={`/property/${property.id}`} className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={property.title || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <span className={`absolute top-2 left-2 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
          {(property.purpose || "FOR SALE").toUpperCase()}
        </span>
        {/* Promo overlay */}
        {property.is_featured && (
          <span className="absolute top-2 right-8 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            FEATURED
          </span>
        )}
        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={14} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      {/* Content */}
      <div className="p-3">
        <PriceDisplay amountEGP={property.price_min || property.price_amount} />
        <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{property.title || "Property Listing"}</p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{property.address || "—"}</p>
        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1"><BedDouble size={12} className="text-[#FF6B00]" />{property.beds ?? "—"}</span>
          <span className="flex items-center gap-1"><Bath size={12} className="text-[#FF6B00]" />{property.baths ?? "—"}</span>
          <span className="flex items-center gap-1"><Maximize2 size={12} className="text-[#FF6B00]" />{property.area_size ? `${property.area_size} m²` : "—"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState("For Sale");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const autoRef = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Property.filter({ is_featured: true, is_active: true }, "-created_date", 20)
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.length > 0
    ? properties
    : Array.from({ length: 6 }, (_, i) => ({
        id: `mock-${i}`,
        title: `Beautiful ${["Apartment", "Villa", "Townhouse", "Condo", "Office", "Studio"][i % 6]}`,
        purpose: PURPOSES[i % PURPOSES.length],
        price_min: [250000, 1200000, 450000, 85000, 320000, 600000][i % 6],
        currency: "USD",
        beds: [2, 4, 3, 1, 0, 2][i % 6],
        baths: [1, 3, 2, 1, 1, 2][i % 6],
        area_size: [120, 350, 200, 65, 90, 150][i % 6],
        address: ["New Cairo, Egypt", "Sheikh Zayed, Giza", "5th Settlement", "Downtown Cairo", "Maadi", "Heliopolis"][i % 6],
        is_featured: i % 2 === 0,
      }));

  const scroll = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  useEffect(() => {
    autoRef.current = setInterval(() => {
      if (!hovering.current && sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
      }
    }, 5000);
    return () => clearInterval(autoRef.current);
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Featured Properties" />

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {PURPOSES.map((p) => (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                activeTab === p
                  ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
        >
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filtered.map((prop, i) => (
              <PropertyCard key={prop.id} property={prop} index={i} />
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link to="/search-properties" className="inline-flex items-center gap-1 text-[#FF6B00] font-semibold hover:underline text-sm">
            View All Properties <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}