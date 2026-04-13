import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, RotateCcw, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PURPOSES = ["For Sale", "For Rent", "For Daily Booking", "For Fractional Investment", "For Swap", "In Auction"];
const SUITABLE_FOR = ["Residential", "Commercial", "Administrative", "Agriculture", "Touristic", "Industrial", "Medical", "Educational", "Sportive"];
const AMENITIES = ["Gym", "Swimming Pool", "Parking", "Security", "Elevator", "Garden", "Balcony", "Central A/C", "Internet", "Mosque"];
const FINISHING = ["Fully Finished", "Semi Finished", "Core & Shell", "Furnished", "Unfurnished"];
const PAYMENT_METHODS = ["In Cash only", "Credit Only"];
const CURRENCIES = ["USD", "EGP", "EUR", "AED"];
const RADIUS_RANGES = [1, 5, 10, 25, 50];

function FilterCollapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-4 font-bold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function CounterGroup({ value, onChange, max = 9 }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {Array.from({ length: max }, (_, i) => i).map((n) => (
        <button
          key={n}
          onClick={() => onChange(value === n ? "" : n)}
          className={`w-9 h-9 rounded-lg text-xs font-bold border transition-all ${
            value === n
              ? "bg-orange-600 text-white border-orange-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
          }`}
        >
          {n + 1}
        </button>
      ))}
    </div>
  );
}

export default function MobileSearchFiltersPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);
  const [onlyInProjects, setOnlyInProjects] = useState(false);
  const areaInputRef = useRef(null);

  const [filters, setFilters] = useState({
    keyword: "",
    propertyCode: "",
    country: "",
    province: "",
    city: "",
    district: "",
    area: "",
    areaName: "",
    projectId: "",
    projectName: "",
    googleMapLink: "",
    searchNearLocation: false,
    locationRadius: 10,
    purpose: [],
    categories: [],
    suitableFor: [],
    frontage: [],
    sceneView: [],
    priceMin: "",
    priceMax: "",
    currency: "USD",
    sizeMin: "",
    sizeMax: "",
    beds: "",
    baths: "",
    amenities: [],
    finishing: [],
    paymentMethods: [],
    yearFrom: "",
    yearTo: "",
    advancedSearch: {
      fromOwnersOnly: false,
      videoShowingOnly: false,
      addedByKemedarOnly: false,
      residencyNationalityOnly: false,
      withVROnly: false,
      withVoiceDescriptionOnly: false,
      verifiedByKemedarOnly: false,
      keyWithKemedarOnly: false,
      alwaysOpenForShowing: false,
    },
  });

  useEffect(() => {
    base44.entities.PropertyCategory.list(undefined, 100).then(cats => {
      setCategories(cats.filter(c => !c.deleted_at));
    }).catch(() => {});
    base44.entities.Country.list().then(allCountries => {
      setCountries(allCountries);
      // Default to Egypt
      const egypt = allCountries.find(c => c.name?.toLowerCase().includes('egypt') || c.code === 'EG');
      if (egypt) {
        setFilters(prev => ({ ...prev, country: egypt.id }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setProvinces([]); setCities([]); setDistricts([]); setAreas([]);
    if (filters.country) {
      base44.entities.Province.filter({ country_id: filters.country }).then(provs => {
        setProvinces(provs);
        // Default to first province (Egypt)
        if (provs.length > 0 && !filters.province) {
          setFilters(prev => ({ ...prev, province: provs[0].id }));
        }
      }).catch(() => {});
    }
  }, [filters.country]);

  useEffect(() => {
    setCities([]); setDistricts([]); setAreas([]);
    if (filters.province) base44.entities.City.filter({ province_id: filters.province }).then(setCities).catch(() => {});
  }, [filters.province]);

  useEffect(() => {
    setDistricts([]); setAreas([]);
    if (filters.city) base44.entities.District.filter({ city_id: filters.city }).then(setDistricts).catch(() => {});
  }, [filters.city]);

  useEffect(() => {
    setAreas([]);
    if (filters.district) base44.entities.Area.filter({ district_id: filters.district }).then(setAreas).catch(() => {});
  }, [filters.district]);

  const handleAreaNameChange = async (val) => {
    set("areaName", val);
    if (val.trim().length < 2) { setAreaSuggestions([]); setShowAreaSuggestions(false); return; }
    try {
      const [cities, districts, areas] = await Promise.all([
        base44.entities.City.list(undefined, 300),
        base44.entities.District.list(undefined, 300),
        base44.entities.Area.list(undefined, 300),
      ]);
      const q = val.toLowerCase();
      const cityMatches = cities.filter(c => c.name?.toLowerCase().includes(q)).map(c => ({ id: c.id, name: c.name, type: 'City', typeKey: 'city' }));
      const districtMatches = districts.filter(d => d.name?.toLowerCase().includes(q)).map(d => ({ id: d.id, name: d.name, type: 'District', typeKey: 'district' }));
      const areaMatches = areas.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ id: a.id, name: a.name, type: 'Area', typeKey: 'area' }));
      const combined = [...cityMatches, ...districtMatches, ...areaMatches].slice(0, 10);
      setAreaSuggestions(combined);
      setShowAreaSuggestions(combined.length > 0);
    } catch { setAreaSuggestions([]); }
  };

  const handleProjectNameChange = async (val) => {
    set("projectName", val);
    if (val.trim().length < 2) { setProjectSuggestions([]); setShowProjectSuggestions(false); return; }
    try {
      const results = await base44.entities.Project.list(undefined, 200);
      const filtered = results.filter(p => p.title?.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
      setProjectSuggestions(filtered);
      setShowProjectSuggestions(filtered.length > 0);
    } catch { setProjectSuggestions([]); }
  };

  const set = (key, val) => setFilters({ ...filters, [key]: val });
  const toggle = (key, val) => {
    const arr = filters[key] || [];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    (filters.purpose || []).forEach((p) => params.append("purpose", p));
    (filters.categories || []).forEach((c) => params.append("category", c));
    if (filters.country) params.set("country", filters.country);
    if (filters.city) params.set("city", filters.city);
    if (filters.priceMin) params.set("price_min", filters.priceMin);
    if (filters.priceMax) params.set("price_max", filters.priceMax);
    if (filters.currency) params.set("currency", filters.currency);
    if (filters.beds) params.set("beds", filters.beds);
    navigate(`/m/find/property?${params.toString()}`);
  };

  const handleReset = () => {
    setOnlyInProjects(false);
    setAreaSuggestions([]);
    setProjectSuggestions([]);
    setFilters({
      keyword: "",
      propertyCode: "",
      country: "",
      province: "",
      city: "",
      district: "",
      area: "",
      areaName: "",
      projectId: "",
      projectName: "",
      googleMapLink: "",
      searchNearLocation: false,
      locationRadius: 10,
      purpose: [],
      categories: [],
      suitableFor: [],
      frontage: [],
      sceneView: [],
      priceMin: "",
      priceMax: "",
      currency: "USD",
      sizeMin: "",
      sizeMax: "",
      beds: "",
      baths: "",
      amenities: [],
      finishing: [],
      paymentMethods: [],
      yearFrom: "",
      yearTo: "",
      advancedSearch: {
        fromOwnersOnly: false,
        videoShowingOnly: false,
        addedByKemedarOnly: false,
        residencyNationalityOnly: false,
        withVROnly: false,
        withVoiceDescriptionOnly: false,
        verifiedByKemedarOnly: false,
        keyWithKemedarOnly: false,
        alwaysOpenForShowing: false,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Filters</h1>
        <button onClick={handleReset} className="text-xs text-gray-400 hover:text-orange-600 font-bold">
          Reset
        </button>
      </div>

      {/* Navigation Tabs - REMOVED */}

      {/* Scrollable Filters */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="bg-white">
          {/* Location Filter - First */}
          <FilterCollapsible title="📍 Location" defaultOpen={true}>
            <div className="space-y-4">
              {/* Search by area name */}
              <div className="relative">
                <label className="text-xs font-bold text-gray-800 mb-1 block">Search by area name</label>
                <input
                  ref={areaInputRef}
                  type="text"
                  placeholder="Select Area"
                  value={filters.areaName}
                  onChange={(e) => handleAreaNameChange(e.target.value)}
                  onBlur={() => setTimeout(() => setShowAreaSuggestions(false), 150)}
                  className="w-full border border-orange-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                />
                {showAreaSuggestions && (
                  <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {areaSuggestions.map((a, i) => (
                      <button key={`${a.typeKey}-${a.id}`} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 text-gray-800 flex items-center justify-between"
                        onMouseDown={() => { set("areaName", a.name); set(a.typeKey, a.id); setShowAreaSuggestions(false); }}>
                        <span>{a.name}</span>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{a.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Dropdowns */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-800 mb-1 block">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => { set("country", e.target.value); set("province", ""); set("city", ""); set("district", ""); set("area", ""); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="">Please select country</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-800 mb-1 block">Province</label>
                    <select
                      value={filters.province}
                      onChange={(e) => { set("province", e.target.value); set("city", ""); set("district", ""); set("area", ""); }}
                      disabled={!filters.country}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-800 mb-1 block">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => { set("city", e.target.value); set("district", ""); set("area", ""); }}
                      disabled={!filters.province}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-800 mb-1 block">District</label>
                    <select
                      value={filters.district}
                      onChange={(e) => { set("district", e.target.value); set("area", ""); }}
                      disabled={!filters.city}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-800 mb-1 block">Area</label>
                    <select
                      value={filters.area}
                      onChange={(e) => set("area", e.target.value)}
                      disabled={!filters.district}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 disabled:opacity-50"
                    >
                      <option value="">Select</option>
                      {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Only in projects */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInProjects}
                    onChange={(e) => { setOnlyInProjects(e.target.checked); if (!e.target.checked) { set("projectId", ""); set("projectName", ""); } }}
                    className="accent-orange-600"
                  />
                  <span className="text-xs font-bold text-gray-800">Only in projects</span>
                </label>
                {onlyInProjects && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search project name..."
                      value={filters.projectName || ""}
                      onChange={(e) => handleProjectNameChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowProjectSuggestions(false), 150)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    />
                    {showProjectSuggestions && (
                      <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {projectSuggestions.map(p => (
                          <button key={p.id} className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 text-gray-800"
                            onMouseDown={() => { set("projectName", p.title); set("projectId", p.id); setShowProjectSuggestions(false); }}>
                            {p.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search by google map link */}
              <div>
                <label className="text-xs font-bold text-gray-800 mb-1 block">Search by google map link</label>
                <p className="text-xs text-gray-500 mb-1">Search by google map link</p>
                <input
                  type="text"
                  placeholder="Search by google map link"
                  value={filters.googleMapLink}
                  onChange={(e) => set("googleMapLink", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>

              {/* Search near my location */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={filters.searchNearLocation}
                    onChange={(e) => set("searchNearLocation", e.target.checked)}
                    className="accent-orange-600"
                  />
                  <span className="text-xs font-bold text-gray-800">Search near my location</span>
                </label>
                {filters.searchNearLocation && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Radius: {filters.locationRadius} Km</p>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={filters.locationRadius}
                      onChange={(e) => set("locationRadius", parseInt(e.target.value))}
                      className="w-full accent-orange-600"
                    />
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                      <span>📍</span>
                      Search near my location
                    </button>
                  </div>
                )}
              </div>
            </div>
          </FilterCollapsible>

          {/* Category */}
          <FilterCollapsible title="Property Category">
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.categories || []).includes(c.id)}
                    onChange={() => toggle("categories", c.id)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{c.name}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Purpose */}
          <FilterCollapsible title="Purpose">
            <div className="space-y-2">
              {PURPOSES.map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.purpose || []).includes(p)}
                    onChange={() => toggle("purpose", p)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{p}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Price Max */}
          <FilterCollapsible title="Price Max">
            <div className="space-y-2">
              <div className="flex gap-2 items-end">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceMax}
                  onChange={(e) => set("priceMax", e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
                <select
                  value={filters.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FilterCollapsible>

          {/* Bedrooms & Bathrooms */}
          <FilterCollapsible title="Bedrooms">
            <CounterGroup value={filters.beds} onChange={(v) => set("beds", v)} />
          </FilterCollapsible>

          <FilterCollapsible title="Bathrooms">
            <CounterGroup value={filters.baths} onChange={(v) => set("baths", v)} />
          </FilterCollapsible>

          {/* Area Size */}
          <FilterCollapsible title="Area Size Min">
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Min Area Size"
                value={filters.sizeMin}
                onChange={(e) => set("sizeMin", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </FilterCollapsible>

          {/* Suitable For */}
          <FilterCollapsible title="Suitable For">
            <div className="space-y-2">
              {SUITABLE_FOR.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.suitableFor || []).includes(s)}
                    onChange={() => toggle("suitableFor", s)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{s}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Frontage */}
          <FilterCollapsible title="Frontage">
            <div className="space-y-2">
              {["North", "South", "East", "West"].map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.frontage || []).includes(f)}
                    onChange={() => toggle("frontage", f)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{f}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Scene & View */}
          <FilterCollapsible title="Scene & View">
            <div className="space-y-2">
              {["Garden View", "City View", "Beach View", "Park View", "Street View"].map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.sceneView || []).includes(v)}
                    onChange={() => toggle("sceneView", v)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{v}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Amenities */}
          <FilterCollapsible title="Amenities">
            <div className="space-y-2">
              {AMENITIES.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.amenities || []).includes(a)}
                    onChange={() => toggle("amenities", a)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{a}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Finishing Status */}
          <FilterCollapsible title="Finishing Status">
            <div className="space-y-2">
              {FINISHING.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.finishing || []).includes(f)}
                    onChange={() => toggle("finishing", f)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{f}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Payment Methods */}
          <FilterCollapsible title="Payment">
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <label key={pm} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.paymentMethods || []).includes(pm)}
                    onChange={() => toggle("paymentMethods", pm)}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{pm}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>

          {/* Year Built */}
          <FilterCollapsible title="Year Built">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="From"
                value={filters.yearFrom}
                onChange={(e) => set("yearFrom", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
              <input
                type="number"
                placeholder="To"
                value={filters.yearTo}
                onChange={(e) => set("yearTo", e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </FilterCollapsible>

          {/* Search by Keyword */}
          <FilterCollapsible title="Search by Keyword">
            <input
              type="text"
              placeholder="Enter keyword"
              value={filters.keyword}
              onChange={(e) => set("keyword", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </FilterCollapsible>

          {/* Search by Property Code */}
          <FilterCollapsible title="Search by Property Code">
            <input
              type="text"
              placeholder="Enter property code"
              value={filters.propertyCode}
              onChange={(e) => set("propertyCode", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </FilterCollapsible>

          {/* Advanced Search */}
          <FilterCollapsible title="Advanced Search">
            <div className="space-y-2">
              {[
                { key: "fromOwnersOnly", label: "From owners only" },
                { key: "videoShowingOnly", label: "Video Showing Only" },
                { key: "addedByKemedarOnly", label: "Added by Kemedar franchise owners only" },
                { key: "residencyNationalityOnly", label: "Suitable for residency and nationality only" },
                { key: "withVROnly", label: "With VR only" },
                { key: "withVoiceDescriptionOnly", label: "With Voice description only" },
                { key: "verifiedByKemedarOnly", label: "Verified By Kemedar only" },
                { key: "keyWithKemedarOnly", label: "The key with Kemedar only" },
                { key: "alwaysOpenForShowing", label: "Always Open for showing only" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.advancedSearch[key]}
                    onChange={(e) => setFilters({
                      ...filters,
                      advancedSearch: { ...filters.advancedSearch, [key]: e.target.checked }
                    })}
                    className="accent-orange-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </FilterCollapsible>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 space-y-2">
        <button
          onClick={handleApply}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}