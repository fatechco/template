import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ChevronDown, X } from "lucide-react";
import MobileSearchBar from "@/components/mobile-v2/MobileSearchBar";

const CATEGORIES = [
  { icon: "🔧", label: "Handyman" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🔩", label: "Plumber" },
  { icon: "🎨", label: "Painter" },
  { icon: "🪟", label: "Carpenter" },
  { icon: "❄️", label: "AC Tech" },
  { icon: "🏗", label: "Contractor" },
  { icon: "🏢", label: "Finishing Co" },
];

const MOCK_SERVICES = Array.from({ length: 16 }, (_, i) => ({
  id: String(i + 1),
  slug: `service-${i + 1}`,
  name: ["Ahmed Fathy", "Hassan Nour", "Karim Saleh", "Wael Mahmoud", "Sami Ibrahim", "Bassem Ali", "Maged Farouk", "Tarek Sobhi"][i % 8],
  serviceTitle: ["Home Electrician – Full Wiring", "Plumbing & Sanitary Works", "Interior Painting & Finishing", "Custom Carpentry", "AC Installation & Maintenance", "Contractor – Full Renovation", "Handyman – General Repairs", "Gypsum Ceiling Specialist"][i % 8],
  specializations: [["Wiring","Panels","Lighting"],["Pipes","Fixtures","Leak Fix"],["Interior","Exterior","Texture"],["Kitchen","Doors","Furniture"],["Split AC","Ducted","VRF"],["Renovation","New Build","Extensions"],["General","Furniture","Plumbing"],["Gypsum","Cornices","Artwork"]][i % 8],
  rating: (4.0 + (i % 9) * 0.11).toFixed(1),
  reviews: 15 + i * 4,
  jobs: 30 + i * 8,
  city: ["Cairo", "Giza", "New Cairo", "Alexandria"][i % 4],
  available: i % 3 !== 1,
  verified: i % 4 !== 3,
  avatar: `https://i.pravatar.cc/150?img=${i + 50}`,
}));

export default function FindServicePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState({ verified: false, available: false, location: null, price: null, rating: null });
  const [activeFilterSheet, setActiveFilterSheet] = useState(null);

  const filtered = MOCK_SERVICES.filter(s => {
    if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.serviceTitle.toLowerCase().includes(query.toLowerCase())) return false;
    if (activeCategory && !s.specializations.flat().some(sp => sp.toLowerCase().includes(activeCategory.toLowerCase())) && s.serviceTitle.split(" ")[0] !== activeCategory) return false;
    if (filters.verified && !s.verified) return false;
    if (filters.available && !s.available) return false;
    if (filters.location && s.city !== filters.location) return false;
    if (filters.rating && parseFloat(s.rating) < filters.rating) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">Find Services</span>
          <Star size={20} className="text-gray-700" />
        </div>

        <div className="px-4 pb-2">
          <MobileSearchBar placeholder="Search services, professionals..." value={query} onChange={setQuery} />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {[{ key: "location", label: "📍 Location" }, { key: "price", label: "💰 Price" }, { key: "rating", label: "⭐ Rating" }].map(f => {
            const active = !!filters[f.key];
            return (
              <button key={f.key}
                onClick={() => setActiveFilterSheet(activeFilterSheet === f.key ? null : f.key)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${active ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                {f.label} <ChevronDown size={10} />
              </button>
            );
          })}
          <button onClick={() => setFilters(f => ({ ...f, verified: !f.verified }))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.verified ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}>
            ✅ Verified
          </button>
          <button onClick={() => setFilters(f => ({ ...f, available: !f.available }))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.available ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200"}`}>
            🟢 Available Now
          </button>
        </div>

        <div className="px-4 pb-2">
          <span className="text-[13px] text-gray-500">{filtered.length} professionals found</span>
        </div>
      </div>

      {/* Category grid */}
      <div className="px-4 pt-3 mb-3">
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-colors ${activeCategory === cat.label ? "bg-orange-600" : "bg-white border border-gray-100"}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className={`text-[10px] font-bold leading-tight text-center ${activeCategory === cat.label ? "text-white" : "text-gray-600"}`}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Sheets */}
      {activeFilterSheet && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end items-center pointer-events-none">
          <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={() => setActiveFilterSheet(null)} />
          <div className="relative bg-white rounded-t-3xl pointer-events-auto w-full max-w-lg">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />

            {/* Location Filter */}
            {activeFilterSheet === "location" && (
              <div className="px-5 py-4">
                <p className="font-black text-gray-900 text-base mb-4">Filter by City</p>
                <div className="flex flex-wrap gap-2">
                  {["Cairo", "Giza", "New Cairo", "Alexandria"].map(city => (
                    <button key={city}
                      onClick={() => setFilters(f => ({ ...f, location: f.location === city ? null : city }))}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${filters.location === city ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      📍 {city}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setFilters(f => ({ ...f, location: null })); setActiveFilterSheet(null); }} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm">Reset</button>
                  <button onClick={() => setActiveFilterSheet(null)} className="flex-[2] py-3 rounded-xl bg-orange-600 text-white font-bold text-sm">Apply</button>
                </div>
              </div>
            )}

            {/* Price Filter */}
            {activeFilterSheet === "price" && (
              <div className="px-5 py-4">
                <p className="font-black text-gray-900 text-base mb-4">Price Range (per hour)</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ label: "Under EGP 100", key: "under100" }, { label: "EGP 100–300", key: "100-300" }, { label: "EGP 300–600", key: "300-600" }, { label: "EGP 600+", key: "600plus" }].map(r => (
                    <button key={r.key}
                      onClick={() => setFilters(f => ({ ...f, price: f.price === r.key ? null : r.key }))}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${filters.price === r.key ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setFilters(f => ({ ...f, price: null })); setActiveFilterSheet(null); }} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm">Reset</button>
                  <button onClick={() => setActiveFilterSheet(null)} className="flex-[2] py-3 rounded-xl bg-orange-600 text-white font-bold text-sm">Apply</button>
                </div>
              </div>
            )}

            {/* Rating Filter */}
            {activeFilterSheet === "rating" && (
              <div className="px-5 py-4">
                <p className="font-black text-gray-900 text-base mb-4">Minimum Rating</p>
                <div className="flex gap-2">
                  {[4.5, 4.0, 3.5, 3.0].map(r => (
                    <button key={r}
                      onClick={() => setFilters(f => ({ ...f, rating: f.rating === r ? null : r }))}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${filters.rating === r ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      ⭐ {r}+
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => { setFilters(f => ({ ...f, rating: null })); setActiveFilterSheet(null); }} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm">Reset</button>
                  <button onClick={() => setActiveFilterSheet(null)} className="flex-[2] py-3 rounded-xl bg-orange-600 text-white font-bold text-sm">Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service cards */}
      <div className="px-4 space-y-3 pb-24">
        {filtered.map(service => (
          <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <img src={service.avatar} alt={service.name} className="w-14 h-14 rounded-full object-cover" />
                {service.verified && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-[7px]">✓</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm">{service.name}</p>
                    <p className="text-[13px] text-gray-500 truncate">{service.serviceTitle}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/m/service/${service.slug}`)}
                    className="flex-shrink-0 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    Book Now
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {service.specializations.slice(0, 3).map(s => (
                    <span key={s} className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-amber-500 font-bold">⭐ {service.rating}</span>
                  <span className="text-xs text-gray-400">({service.reviews}) · {service.jobs} jobs</span>
                  <span className="text-xs text-gray-400">📍 {service.city}</span>
                </div>
                <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${service.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {service.available ? "🟢 Available" : "🔴 Busy"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}