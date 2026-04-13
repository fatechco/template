import { Heart, MapPin, BedDouble, Bath, Maximize2 } from "lucide-react";
import { useState } from "react";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

function MiniPropCard({ p, index }) {
  const [saved, setSaved] = useState(false);
  return (
    <a href={`/property/${p.id}`} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className="relative h-36 overflow-hidden">
        <img src={p.featured_image || FALLBACK_IMGS[index % FALLBACK_IMGS.length]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">{(p.purpose || "FOR SALE").toUpperCase()}</span>
        <button onClick={e => { e.preventDefault(); setSaved(!saved); }} className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
          <Heart size={11} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3">
        <p className="font-black text-[#FF6B00] text-sm">{p.price_amount ? `${Number(p.price_amount).toLocaleString()} ${p.currency || "USD"}` : "Price on Request"}</p>
        <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{p.title}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate"><MapPin size={10} className="text-[#FF6B00]" />{p.city_name || p.address || "—"}</p>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
          {p.beds != null && <span className="flex items-center gap-0.5"><BedDouble size={10} className="text-[#FF6B00]" />{p.beds}</span>}
          {p.baths != null && <span className="flex items-center gap-0.5"><Bath size={10} className="text-[#FF6B00]" />{p.baths}</span>}
          {p.area_size && <span className="flex items-center gap-0.5"><Maximize2 size={10} className="text-[#FF6B00]" />{p.area_size}m²</span>}
        </div>
      </div>
    </a>
  );
}

export default function ProfilePropertiesGrid({ title, properties, emptyMsg = "No listings yet." }) {
  const MOCK = Array.from({ length: 6 }, (_, i) => ({
    id: `mock-p-${i}`,
    title: ["Luxury Apartment New Cairo", "Modern Villa Sheikh Zayed", "Studio Maadi", "Family Home Heliopolis", "Duplex 6th Oct", "Penthouse Downtown"][i],
    purpose: ["For Sale", "For Sale", "For Rent", "For Sale", "For Rent", "For Sale"][i],
    price_amount: [3500000, 12000000, 85000, 4200000, 2800000, 18000000][i],
    currency: "EGP",
    beds: [3, 5, 1, 4, 4, 4][i],
    baths: [2, 4, 1, 3, 3, 3][i],
    area_size: [185, 450, 55, 280, 220, 350][i],
    city_name: ["New Cairo", "Sheikh Zayed", "Maadi", "Heliopolis", "6th October", "Downtown"][i],
  }));

  const items = properties?.length > 0 ? properties : MOCK;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> {title}
        <span className="ml-auto text-sm font-normal text-gray-400">{items.length} listings</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((p, i) => <MiniPropCard key={p.id || i} p={p} index={i} />)}
      </div>
    </div>
  );
}