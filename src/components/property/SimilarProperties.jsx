import { useRef } from "react";
import { ChevronLeft, ChevronRight, BedDouble, Bath, Maximize2, MapPin } from "lucide-react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

function MiniCard({ property, index }) {
  const img = property.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  return (
    <a href={`/property/${property.id}`} className="flex-shrink-0 w-60 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all group cursor-pointer">
      <div className="relative h-40 overflow-hidden">
        <img src={img} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {(property.purpose || "FOR SALE").toUpperCase()}
        </span>
      </div>
      <div className="p-3">
        <p className="font-black text-[#FF6B00] text-base">
          {property.price_amount ? `${Number(property.price_amount).toLocaleString()} ${property.currency || "USD"}` : "Price on Request"}
        </p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{property.title}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
          <MapPin size={10} className="text-[#FF6B00]" />
          {property.city_name || property.address || "—"}
        </p>
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          {property.beds != null && <span className="flex items-center gap-1"><BedDouble size={11} className="text-[#FF6B00]" />{property.beds}</span>}
          {property.baths != null && <span className="flex items-center gap-1"><Bath size={11} className="text-[#FF6B00]" />{property.baths}</span>}
          {property.area_size && <span className="flex items-center gap-1"><Maximize2 size={11} className="text-[#FF6B00]" />{property.area_size} m²</span>}
        </div>
      </div>
    </a>
  );
}

export default function SimilarProperties({ title, properties }) {
  const sliderRef = useRef(null);
  const scroll = (dir) => sliderRef.current?.scrollBy({ left: dir * 270, behavior: "smooth" });

  if (!properties?.length) return null;

  return (
    <div className="mb-8">
      <h3 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> {title}
      </h3>
      <div className="relative">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div ref={sliderRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {properties.map((p, i) => <MiniCard key={p.id} property={p} index={i} />)}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}