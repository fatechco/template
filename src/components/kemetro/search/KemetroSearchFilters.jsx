import { useState } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";

const CATEGORIES = [
  {
    id: "construction",
    name: "Construction",
    icon: "🏗️",
    subcategories: [
      "Ladders & Scaffoldings", "Heat Insulation", "Waterproofing", "Fireproofing",
      "Timber", "Multifunctional Materials", "Plastic Building Materials",
      "Building Glass", "Metal Building Materials", "Aluminum Composite Panels",
    ],
  },
  {
    id: "masonry",
    name: "Masonry Materials",
    icon: "🧱",
    subcategories: [
      "Cement", "Sand & Gravels", "Bricks & Blocks", "Steel",
      "Gypsum", "Manufactured Concrete",
    ],
  },
  {
    id: "architectural",
    name: "Architectural",
    icon: "🏛️",
    subcategories: [
      "Doors & Windows", "Fiberglass Meshes", "Mosaics", "Gates & Fences",
      "Stairs & Stair Parts", "Mouldings", "Wallpapers/Wall Coating", "Boards",
      "Paints", "Flooring & Accessories", "Tiles & Accessories", "Ceilings",
      "Natural Stone", "Granite", "Marble",
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "⚡",
    subcategories: [
      "Cables & Wires", "Switches & Sockets", "Lighting", "Circuit Breakers",
      "Solar Panels", "Generators", "Distribution Boards",
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing & HVAC",
    icon: "🔧",
    subcategories: [
      "Pipes & Fittings", "Water Heaters", "Sanitary Ware", "Valves",
      "Air Conditioning", "Ventilation", "Water Pumps",
    ],
  },
  {
    id: "finishing",
    name: "Finishing & Decoration",
    icon: "🎨",
    subcategories: [
      "Interior Paints", "Exterior Paints", "Putty & Primers", "Adhesives & Sealants",
      "Decorative Panels", "False Ceilings", "Carpets & Rugs",
    ],
  },
  {
    id: "tools",
    name: "Tools & Equipment",
    icon: "🛠️",
    subcategories: [
      "Power Tools", "Hand Tools", "Safety Equipment", "Measuring Tools",
      "Concrete Mixers", "Welding Equipment",
    ],
  },
  {
    id: "furniture",
    name: "Furniture & Interior",
    icon: "🛋️",
    subcategories: [
      "Living Room", "Bedroom", "Kitchen", "Bathroom",
      "Office Furniture", "Outdoor Furniture",
    ],
  },
];

const PRICE_RANGE_MAX = 50000;
const BRANDS = ["LafargeHolcim", "Boral", "Cemex", "SCG", "Knauf", "Saint-Gobain", "Hilti", "Bosch", "3M"];
const COUNTRIES = ["Egypt", "Saudi Arabia", "UAE", "China", "Germany", "Turkey", "India", "Italy"];
const UNIT_TYPES = ["Per Piece", "Per Meter", "Per m²", "Per KG", "Per Ton", "Per Box", "Per Bag", "Per Liter"];
const SHIPPING_LOCATIONS = {
  "Egypt": ["Cairo", "Giza", "Alexandria", "Aswan", "Luxor"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
  "Jordan": ["Amman", "Zarqa", "Irbid", "Aqaba"],
  "Lebanon": ["Beirut", "Tripoli", "Sidon", "Tyre"],
  "Kuwait": ["Kuwait City", "Al Ahmadi", "Safat"],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah"],
  "Bahrain": ["Manama", "Muharraq", "Riffa"],
};

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-3">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left py-1">
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

export default function KemetroSearchFilters({ filters, setFilters }) {
  const [expandedCategory, setExpandedCategory] = useState("masonry");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedCountry, setExpandedCountry] = useState(null);

  const handleSubcategory = (sub) => {
    const arr = filters.subcategories || [];
    setFilters({
      ...filters,
      subcategories: arr.includes(sub) ? arr.filter((v) => v !== sub) : [...arr, sub],
    });
  };

  const handleCheckbox = (key, value) => {
    const arr = filters[key] || [];
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat.id === selectedCategory ? null : cat.id);
    setExpandedCategory(cat.id);
    setFilters({ ...filters, category: cat.id === selectedCategory ? null : cat.id, subcategories: [] });
  };

  const activeCategory = CATEGORIES.find((c) => c.id === expandedCategory);
  const filteredBrands = BRANDS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));

  const activeCount = (filters.subcategories?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.origin?.length || 0) +
    (filters.unitType?.length || 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.verifiedSellersOnly ? 1 : 0) +
    (filters.shippingLocations?.length || 0);

  const clearAll = () => setFilters({
    category: null, subcategories: [], priceMin: 0, priceMax: PRICE_RANGE_MAX,
    brands: [], sellers: [], rating: 0, inStockOnly: false, origin: [], unitType: [], verifiedSellersOnly: false, shippingLocations: [],
  });

  return (
    <div className="w-[270px] flex-shrink-0 sticky top-24 h-fit">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 className="font-black text-gray-900 text-sm">Filters {activeCount > 0 && <span className="ml-1 bg-[#FF6B00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>}</h2>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-[#FF6B00] font-bold hover:underline flex items-center gap-1">
              <X size={12} /> Clear all
            </button>
          )}
        </div>

        <div className="px-4 max-h-[calc(100vh-180px)] overflow-y-auto">

          {/* ── Categories ── */}
          <FilterSection title="Category" defaultOpen={true}>
            <div className="space-y-0.5">
              {CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  {/* Category row */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight size={13} className={`transition-transform ${expandedCategory === cat.id ? "rotate-90" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleSelectCategory(cat)}
                      className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                        selectedCategory === cat.id
                          ? "bg-orange-50 text-[#FF6B00] font-bold"
                          : "hover:bg-gray-50 text-gray-700 font-medium"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  </div>

                  {/* Subcategories */}
                  {expandedCategory === cat.id && (
                    <div className="ml-8 mt-1 mb-2 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <label key={sub} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.subcategories?.includes(sub) || false}
                            onChange={() => handleSubcategory(sub)}
                            className="w-3.5 h-3.5 rounded accent-[#FF6B00] flex-shrink-0"
                          />
                          <span className={`text-xs transition-colors ${
                            filters.subcategories?.includes(sub)
                              ? "text-[#FF6B00] font-semibold"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}>
                            {sub}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FilterSection>

          {/* ── Price Range ── */}
          <FilterSection title="Price Range (USD)">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Min</p>
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#FF6B00]"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Max</p>
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#FF6B00]"
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilters({ ...filters, priceMax: v })}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      filters.priceMax === v
                        ? "border-[#FF6B00] bg-orange-50 text-[#FF6B00] font-bold"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    Up to ${v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* ── Brand ── */}
          <FilterSection title="Brand" defaultOpen={false}>
            <div className="relative mb-2">
              <Search size={13} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full pl-7 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {filteredBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands?.includes(brand) || false}
                    onChange={() => handleCheckbox("brands", brand)}
                    className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
                  />
                  <span className="text-xs text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* ── Rating ── */}
          <FilterSection title="Minimum Rating" defaultOpen={false}>
            {[5, 4, 3, 2].map((stars) => (
              <label key={stars} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === stars}
                  onChange={() => setFilters({ ...filters, rating: stars })}
                  className="w-3.5 h-3.5 accent-[#FF6B00]"
                />
                <span className="text-xs text-gray-700 flex items-center gap-1">
                  <span className="text-yellow-400">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
                  <span className="text-gray-500">& above</span>
                </span>
              </label>
            ))}
            {filters.rating > 0 && (
              <button onClick={() => setFilters({ ...filters, rating: 0 })} className="text-xs text-[#FF6B00] hover:underline mt-1">
                Clear rating
              </button>
            )}
          </FilterSection>

          {/* ── Availability ── */}
          <FilterSection title="Availability" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly || false}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
              />
              <span className="text-xs text-gray-700">In Stock Only</span>
            </label>
          </FilterSection>

          {/* ── Origin ── */}
          <FilterSection title="Country of Origin" defaultOpen={false}>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {COUNTRIES.map((country) => (
                <label key={country} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.origin?.includes(country) || false}
                    onChange={() => handleCheckbox("origin", country)}
                    className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
                  />
                  <span className="text-xs text-gray-700">{country}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* ── Unit Type ── */}
          <FilterSection title="Unit Type" defaultOpen={false}>
            {UNIT_TYPES.map((unit) => (
              <label key={unit} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.unitType?.includes(unit) || false}
                  onChange={() => handleCheckbox("unitType", unit)}
                  className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
                />
                <span className="text-xs text-gray-700">{unit}</span>
              </label>
            ))}
          </FilterSection>

          {/* ── Verified Sellers Only ── */}
          <FilterSection title="Seller Verification" defaultOpen={false}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedSellersOnly || false}
                onChange={(e) => setFilters({ ...filters, verifiedSellersOnly: e.target.checked })}
                className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
              />
              <span className="text-xs text-gray-700">Verified Sellers Only</span>
            </label>
          </FilterSection>

          {/* ── Shipping Location ── */}
          <FilterSection title="Shipping Location" defaultOpen={false}>
            <div className="space-y-1.5">
              {Object.entries(SHIPPING_LOCATIONS).map(([country, cities]) => (
                <div key={country}>
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <span className="text-xs font-medium text-gray-700">{country}</span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform ${expandedCountry === country ? "rotate-180" : ""}`} />
                  </button>
                  {expandedCountry === country && (
                    <div className="ml-4 mt-1 space-y-1">
                      {cities.map((city) => (
                        <label key={city} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.shippingLocations?.includes(city) || false}
                            onChange={() => handleCheckbox("shippingLocations", city)}
                            className="w-3.5 h-3.5 rounded accent-[#FF6B00]"
                          />
                          <span className="text-xs text-gray-700">{city}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Apply button */}
          <div className="py-4">
            <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-orange-100">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}