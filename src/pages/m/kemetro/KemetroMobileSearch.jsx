import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, SlidersHorizontal, ChevronDown, X, Plus, Home, MapPin, ShoppingCart, User } from "lucide-react";

const MOCK_PRODUCTS = [
  { id: 1, title: "Modern Office Chair", price: 450, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&q=70", rating: 4.8, store: "Furniture Plus" },
  { id: 2, title: "Ergonomic Desk Lamp", price: 85, image: "https://images.unsplash.com/photo-1565636192335-14f6b16eaefb?w=300&q=70", rating: 4.6, store: "Light Store" },
  { id: 3, title: "Wooden Storage Cabinet", price: 320, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70", rating: 4.7, store: "Home Essentials" },
  { id: 4, title: "Comfort Sofa", price: 890, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70", rating: 4.9, store: "Luxury Furniture" },
];

const CATEGORIES = [
  { id: "construction", name: "Construction", icon: "🏗️", subcategories: ["Ladders & Scaffoldings", "Heat Insulation", "Waterproofing", "Fireproofing", "Timber", "Multifunctional Materials", "Plastic Building Materials", "Building Glass", "Metal Building Materials", "Aluminum Composite Panels"] },
  { id: "masonry", name: "Masonry Materials", icon: "🧱", subcategories: ["Cement", "Sand & Gravels", "Bricks & Blocks", "Steel", "Gypsum", "Manufactured Concrete"] },
  { id: "architectural", name: "Architectural", icon: "🏛️", subcategories: ["Doors & Windows", "Fiberglass Meshes", "Mosaics", "Gates & Fences", "Stairs & Stair Parts", "Mouldings", "Wallpapers/Wall Coating", "Boards", "Paints", "Flooring & Accessories", "Tiles & Accessories", "Ceilings", "Natural Stone", "Granite", "Marble"] },
  { id: "electrical", name: "Electrical", icon: "⚡", subcategories: ["Cables & Wires", "Switches & Sockets", "Lighting", "Circuit Breakers", "Solar Panels", "Generators", "Distribution Boards"] },
  { id: "plumbing", name: "Plumbing & HVAC", icon: "🔧", subcategories: ["Pipes & Fittings", "Water Heaters", "Sanitary Ware", "Valves", "Air Conditioning", "Ventilation", "Water Pumps"] },
  { id: "finishing", name: "Finishing & Decoration", icon: "🎨", subcategories: ["Interior Paints", "Exterior Paints", "Putty & Primers", "Adhesives & Sealants", "Decorative Panels", "False Ceilings", "Carpets & Rugs"] },
  { id: "tools", name: "Tools & Equipment", icon: "🛠️", subcategories: ["Power Tools", "Hand Tools", "Safety Equipment", "Measuring Tools", "Concrete Mixers", "Welding Equipment"] },
  { id: "furniture", name: "Furniture & Interior", icon: "🛋️", subcategories: ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office Furniture", "Outdoor Furniture"] },
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

export default function KemetroMobileSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: null, subcategories: [], priceMin: 0, priceMax: PRICE_RANGE_MAX, brands: [], rating: 0, inStockOnly: false, origin: [], unitType: [], verifiedSellersOnly: false, shippingLocations: [] });
  const [expandedCategory, setExpandedCategory] = useState("masonry");
  const [brandSearch, setBrandSearch] = useState("");
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [filtered, setFiltered] = useState(MOCK_PRODUCTS);

  const filteredBrands = BRANDS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  const activeCategory = CATEGORIES.find((c) => c.id === expandedCategory);
  const activeCount = (filters.subcategories?.length || 0) + (filters.brands?.length || 0) + (filters.origin?.length || 0) + (filters.unitType?.length || 0) + (filters.inStockOnly ? 1 : 0) + (filters.rating > 0 ? 1 : 0) + (filters.verifiedSellersOnly ? 1 : 0) + (filters.shippingLocations?.length || 0);

  const handleSubcategory = (sub) => {
    const arr = filters.subcategories || [];
    setFilters({ ...filters, subcategories: arr.includes(sub) ? arr.filter((v) => v !== sub) : [...arr, sub] });
  };

  const handleCheckbox = (key, value) => {
    const arr = filters[key] || [];
    setFilters({ ...filters, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] });
  };

  const clearAll = () => setFilters({ category: null, subcategories: [], priceMin: 0, priceMax: PRICE_RANGE_MAX, brands: [], sellers: [], rating: 0, inStockOnly: false, origin: [], unitType: [], verifiedSellersOnly: false, shippingLocations: [] });

  useEffect(() => {
    let results = MOCK_PRODUCTS;
    if (search) {
      results = results.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(results);
  }, [search]);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate("/m/kemetro")} className="p-1">
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm py-2 outline-none placeholder-gray-400"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="p-2 hover:bg-gray-100 rounded-lg">
          <SlidersHorizontal size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <p className="text-xs text-gray-500">{filtered.length} products found</p>
      </div>

      {/* Filter Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-black text-gray-900 text-sm">Filters {activeCount > 0 && <span className="ml-1 bg-[#FF6B00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>}</h2>
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="px-4 pb-20">
              {/* Categories */}
              <FilterSection title="Category" defaultOpen={true}>
                <div className="space-y-0.5">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => setFilters({ ...filters, category: filters.category === cat.id ? null : cat.id, subcategories: [] })}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors text-left ${
                          filters.category === cat.id
                            ? "bg-orange-50 text-[#FF6B00] font-bold"
                            : "hover:bg-gray-50 text-gray-700 font-medium"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </button>
                      {filters.category === cat.id && (
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

              {/* Price Range */}
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

              {/* Brand */}
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

              {/* Rating */}
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

              {/* Availability */}
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

              {/* Origin */}
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

              {/* Unit Type */}
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

              {/* Verified Sellers Only */}
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

              {/* Shipping Location */}
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

              {/* Apply & Clear Buttons */}
              <div className="py-4 space-y-2 sticky bottom-0 bg-white border-t border-gray-200">
                {activeCount > 0 && (
                  <button onClick={clearAll} className="w-full text-[#FF6B00] font-bold py-2.5 rounded-xl border border-[#FF6B00] transition-colors text-sm">
                    Clear All
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-orange-100">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4 py-4 pb-28">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => navigate(`/m/product/${product.id}`)}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow text-left active:opacity-80"
              >
                <img src={product.image} alt={product.title} className="w-full h-32 object-cover bg-gray-200" />
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">{product.title}</p>
                  <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-orange-600">${product.price}</p>
                    <span className="text-[10px] text-gray-500">⭐ {product.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-4xl mb-2">🔍</p>
            <p className="font-bold text-gray-700">No products found</p>
            <p className="text-xs text-gray-500 mt-1">Try a different search</p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around gap-2">
          {/* Settings */}
          <button onClick={() => navigate("/m/settings")} className="flex flex-col items-center gap-1 py-2 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <Search size={20} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Settings</span>
          </button>

          {/* Find */}
          <button onClick={() => navigate("/m/find")} className="flex flex-col items-center gap-1 py-2 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <MapPin size={20} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Find</span>
          </button>

          {/* Add (FAB) */}
          <button onClick={() => navigate("/m/add")} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-4" style={{ boxShadow: "0 4px 16px rgba(255, 107, 0, 0.3)" }}>
              <Plus size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Add</span>
          </button>

          {/* Buy */}
          <button onClick={() => navigate("/m/buy")} className="flex flex-col items-center gap-1 py-2 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <ShoppingCart size={20} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Buy</span>
          </button>

          {/* Account */}
          <button onClick={() => navigate("/m/account")} className="flex flex-col items-center gap-1 py-2 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
              <User size={20} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}