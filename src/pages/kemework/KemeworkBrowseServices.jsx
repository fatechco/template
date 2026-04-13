import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { KEMEWORK_CATEGORY_LABELS } from "@/lib/kemeworkCategories";
import LocationAutocomplete from "@/components/kemework/LocationAutocomplete";

const SERVICES = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70", pro: { name: "Ahmed Hassan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=70" }, rating: 4.9, reviews: 64, city: "Cairo", country: "Egypt", delivery: 30, from: 500, category: "Interior Designers & Decorators" },
  { id: 2, title: "Electrical Wiring & Panel Installation Service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", pro: { name: "Sara Mohamed", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=70" }, rating: 4.8, reviews: 89, city: "Dubai", country: "UAE", delivery: 3, from: 80, category: "Electrical Services" },
  { id: 3, title: "Bathroom Renovation & Plumbing Upgrade", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=70", pro: { name: "Omar Khalid", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=70" }, rating: 4.7, reviews: 112, city: "Riyadh", country: "Saudi Arabia", delivery: 7, from: 150, category: "Plumbing Services" },
  { id: 4, title: "Garden Landscaping & Outdoor Lighting Design", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", pro: { name: "Layla Nour", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&q=70" }, rating: 4.9, reviews: 41, city: "Amman", country: "Jordan", delivery: 14, from: 200, category: "Landscaping & Gardening" },
  { id: 5, title: "Custom Built-in Wardrobes & Kitchen Cabinets", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70", pro: { name: "Kareem Saad", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=70" }, rating: 4.6, reviews: 78, city: "Alexandria", country: "Egypt", delivery: 21, from: 300, category: "Carpentry & Woodwork" },
  { id: 6, title: "Deep Home Cleaning & Sanitization Package", image: "https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=400&q=70", pro: { name: "Nadia Ali", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=70" }, rating: 5.0, reviews: 203, city: "Kuwait City", country: "Kuwait", delivery: 1, from: 40, category: "Cleaning Services" },
  { id: 7, title: "Split AC Installation & Maintenance Service", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=70", pro: { name: "Youssef Reda", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&q=70" }, rating: 4.5, reviews: 56, city: "Dubai", country: "UAE", delivery: 2, from: 120, category: "HVAC & Air Conditioning" },
  { id: 8, title: "Professional Interior Wall Painting — Full Apartment", image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=70", pro: { name: "Rania Hassan", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&q=70" }, rating: 4.8, reviews: 91, city: "Cairo", country: "Egypt", delivery: 5, from: 60, category: "Painting & Decorating" },
  { id: 9, title: "Luxury Flooring & Porcelain Tile Installation", image: "https://images.unsplash.com/photo-1562092086-c3dc5e94f1f0?w=400&q=70", pro: { name: "Tariq Al-Farsi", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&q=70" }, rating: 4.7, reviews: 67, city: "Doha", country: "Qatar", delivery: 10, from: 180, category: "Flooring & Tiling" },
];

const SORT_OPTIONS = ["Relevance", "Price ↑", "Price ↓", "Rating", "Newest", "Most Popular"];
const DELIVERY_OPTIONS = ["Any Time", "Within 24 hours", "Within 7 days", "Within 21 days"];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="font-bold text-gray-900 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function ServiceCard({ svc }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
      <div className="relative h-44 bg-gray-200">
        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-1">
          <img src={svc.pro.avatar} alt={svc.pro.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="text-white text-[10px] font-semibold">{svc.pro.name}</span>
        </div>
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1">
          <span className="text-[10px] font-bold text-gray-700">📦 {svc.delivery}d delivery</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 flex-1">{svc.title}</p>
        <p className="text-xs text-gray-400 mb-1">⭐ {svc.rating} ({svc.reviews} reviews)</p>
        <p className="text-xs text-gray-400 mb-3">📍 {svc.city}, {svc.country}</p>
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-gray-400 text-[10px]">Starting from</p>
            <p className="font-black text-lg" style={{ color: "#C41230" }}>${svc.from}</p>
          </div>
          <Link to={`/kemework/service/${svc.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all" style={{ borderColor: "#C41230", color: "#C41230" }}>
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function KemeworkBrowseServices() {
  const [sort, setSort] = useState("Relevance");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [delivery, setDelivery] = useState("Any Time");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const sidebar = (
    <div>
      <FilterSection title="Category">
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
          {KEMEWORK_CATEGORY_LABELS.map(c => <option key={c} value={c === "All Categories" ? "" : c}>{c}</option>)}
        </select>
      </FilterSection>

      <FilterSection title="Location">
        <LocationAutocomplete value={city} onChange={setCity} placeholder="Search city or area..." />
      </FilterSection>

      <FilterSection title="Delivery Time">
        <div className="flex flex-col gap-2">
          {DELIVERY_OPTIONS.map(d => (
            <label key={d} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="delivery" checked={delivery === d} onChange={() => setDelivery(d)} className="accent-red-700" />
              <span className="text-sm text-gray-700">{d}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Starting Price ($0 — $1000)">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">$0</span>
          <span className="text-xs font-bold text-gray-700">${maxPrice}</span>
        </div>
        <input type="range" min={0} max={1000} step={10} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full accent-red-700" />
      </FilterSection>

      <div className="pt-4 flex flex-col gap-2">
        <button className="w-full py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Apply Filters</button>
        <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-black text-gray-900">Browse Services</h1>
          <p className="text-gray-500 text-sm">Explore services offered by skilled professionals</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-sm">Filter Services</h3>
              <SlidersHorizontal size={16} className="text-gray-400" />
            </div>
            {sidebar}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-gray-700">{SERVICES.length} Services found</p>
              <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700">
                <SlidersHorizontal size={13} /> Filters
              </button>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {SERVICES.map(s => <ServiceCard key={s.id} svc={s} />)}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            {[1, 2, 3, 4, 5].map(pg => (
              <button key={pg} className="w-9 h-9 rounded-lg text-sm font-bold transition-colors border border-gray-200 text-gray-600 hover:bg-gray-50" style={pg === 1 ? { background: "#C41230", color: "#fff", border: "none" } : {}}>{pg}</button>
            ))}
          </div>
        </div>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Filter Services</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-400 text-lg">✕</button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}