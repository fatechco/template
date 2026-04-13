import { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";

const TABS = ["For Sale", "For Rent", "Auction", "Investment", "Daily"];

const PURPOSE_COLORS = {
  "For Sale": "bg-blue-500",
  "For Rent": "bg-green-500",
  "Auction": "bg-purple-500",
  "Investment": "bg-orange-500",
  "Daily": "bg-teal-500",
};

const MOCK_PROPERTIES = [
  {
    id: 1,
    purpose: "For Sale",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    price: "$450,000",
    title: "Modern 3BR Apartment with Sea View",
    city: "Cairo", district: "Zamalek",
    beds: 3, baths: 2, area: 180,
  },
  {
    id: 2,
    purpose: "For Rent",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    price: "$1,200/mo",
    title: "Luxury Villa in Prime Location",
    city: "Alexandria", district: "Smouha",
    beds: 5, baths: 4, area: 420,
  },
  {
    id: 3,
    purpose: "For Sale",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
    price: "$280,000",
    title: "Studio Apartment Near Metro",
    city: "Cairo", district: "Maadi",
    beds: 1, baths: 1, area: 65,
  },
  {
    id: 4,
    purpose: "Investment",
    image: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=600&q=80",
    price: "$950,000",
    title: "Commercial Space — Ground Floor",
    city: "Cairo", district: "Downtown",
    beds: 0, baths: 2, area: 300,
  },
];

function PropertyCard({ property }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]"
      style={{ width: "72vw", maxWidth: 280 }}
    >
      <div className="relative">
        <img src={property.image} alt={property.title} className="w-full object-cover" style={{ height: 160 }} />
        <span className={`absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${PURPOSE_COLORS[property.purpose] || "bg-gray-500"}`}>
          {property.purpose}
        </span>
        <button
          onClick={() => setSaved(s => !s)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Heart size={15} fill={saved ? "#EF4444" : "none"} color={saved ? "#EF4444" : "#6B7280"} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[#FF6B00] font-black text-base">{property.price}</p>
        <p className="text-[#1F2937] text-xs font-semibold mt-0.5 line-clamp-2 leading-snug">{property.title}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin size={11} className="text-[#6B7280]" />
          <p className="text-[#6B7280] text-[11px]">{property.city}, {property.district}</p>
        </div>
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#F3F4F6]">
          {property.beds > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble size={12} className="text-[#6B7280]" />
              <span className="text-[11px] text-[#6B7280]">{property.beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath size={12} className="text-[#6B7280]" />
            <span className="text-[11px] text-[#6B7280]">{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 size={12} className="text-[#6B7280]" />
            <span className="text-[11px] text-[#6B7280]">{property.area} sqm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileFeaturedProperties() {
  const [tab, setTab] = useState("For Sale");

  return (
    <div className="mb-6">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="text-[#1F2937] font-black text-base">Featured Properties</span>
        <button className="text-[#FF6B00] text-sm font-semibold">View All →</button>
      </div>

      {/* Tab row */}
      <div className="px-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              tab === t ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "bg-white text-[#6B7280] border-[#E5E7EB]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
        {MOCK_PROPERTIES.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}