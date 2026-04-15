"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import DistanceFromFilter from "@/components/distance/DistanceFromFilter";

const PURPOSES = ["For Sale", "For Rent", "For Investment", "For Daily Booking", "In Auction"];
const SUITABLE_FOR = ["Residential", "Commercial", "Administrative", "Agriculture", "Touristic", "Industrial", "Medical", "Educational", "Sportive", "Co-working Space"];
const CURRENCIES = ["USD", "EGP", "EUR", "AED", "SAR", "GBP"];
const SIZE_UNITS = ["SqM", "SqF"];
const AMENITIES = ["Gym", "Swimming Pool", "Parking", "Security", "Elevator", "Garden", "Balcony", "Central A/C", "Internet", "Mosque", "Kids Area", "BBQ Area"];
const FINISHING = ["Fully Finished", "Semi Finished", "Core & Shell", "Furnished", "Unfurnished"];
const PAYMENT_METHODS = ["In Cash only", "Credit Only"];
const RADIUS_RANGES = [1, 5, 10, 25, 50];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="font-bold text-sm text-gray-800 group-hover:text-[#FF6B00] transition-colors">{title}</span>
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function CounterBtn({ value, onClick, label }) {
  const nums = Array.from({ length: 9 }, (_, i) => i + 1);
  return (
    <div className="flex flex-wrap gap-1.5">
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onClick(value === n ? "" : n)}
          className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
            value === n
              ? "bg-[#FF6B00] text-white border-[#FF6B00]"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    setCategoriesLoading(true);
    apiClient.get("/api/v1/" + "propertycategory", undefined, 100).then(cats => {
      setCategories(cats.filter(c => !c.deleted_at));
      setCategoriesLoading(false);
    }).catch(() => setCategoriesLoading(false));
    apiClient.list("/api/v1/country").then(setCountries).catch(() => {});
    setProjectsLoading(true);
    apiClient.get("/api/v1/" + "project", undefined, 100).then(projs => {
      setProjects(projs.filter(p => !p.deleted_at));
      setProjectsLoading(false);
    }).catch(() => setProjectsLoading(false));
  }, []);

  useEffect(() => {
    setProvinces([]); setCities([]); setDistricts([]); setAreas([]);
    if (filters.country) apiClient.list("/api/v1/province", { country_id: filters.country }).then(setProvinces).catch(() => {});
  }, [filters.country]);

  useEffect(() => {
    setCities([]); setDistricts([]); setAreas([]);
    if (filters.province) apiClient.list("/api/v1/city", { province_id: filters.province }).then(setCities).catch(() => {});
  }, [filters.province]);

  useEffect(() => {
    setDistricts([]); setAreas([]);
    if (filters.city) apiClient.list("/api/v1/district", { city_id: filters.city }).then(setDistricts).catch(() => {});
  }, [filters.city]);

  useEffect(() => {
    setAreas([]);
    if (filters.district) apiClient.list("/api/v1/area", { district_id: filters.district }).then(setAreas).catch(() => {});
  }, [filters.district]);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  const toggleArr = (key, val) => {
    const arr = filters[key] || [];
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] });
  };

  const resetFilters = () =>
    onChange({ 
      keyword: "", propertyCode: "", purpose: "", categories: [], suitableFor: [], frontage: [], sceneView: [], 
      country: "", province: "", city: "", district: "", area: "", priceMin: "", priceMax: "", currency: "USD", 
      sizeMin: "", sizeMax: "", sizeUnit: "SqM", beds: "", baths: "", amenities: [], finishing: [], paymentMethods: [], 
      yearFrom: "", yearTo: "",
      advancedSearch: {
        fromOwnersOnly: false, videoShowingOnly: false, addedByKemedarOnly: false, residencyNationalityOnly: false,
        withVROnly: false, withVoiceDescriptionOnly: false, verifiedByKemedarOnly: false, keyWithKemedarOnly: false,
        alwaysOpenForShowing: false,
      }
    });

  return (
    <aside className="w-[280px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-[90px]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black text-base text-gray-900">Filters</h2>
        <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF6B00] transition-colors">
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>

        {/* Location - First */}
        <FilterSection title="Location" defaultOpen={true}>
          <div className="flex flex-col gap-2">
            {[
              { label: "Country", key: "country", options: countries, disabled: false },
              { label: "Province", key: "province", options: provinces, disabled: !filters.country },
              { label: "City", key: "city", options: cities, disabled: !filters.province },
              { label: "District", key: "district", options: districts, disabled: !filters.city },
              { label: "Area", key: "area", options: areas, disabled: !filters.district },
            ].map(({ label, key, options, disabled }) => (
              <select
                key={key}
                value={filters[key] || ""}
                onChange={(e) => {
                  const updates = { [key]: e.target.value };
                  if (key === "country") { updates.province = ""; updates.city = ""; updates.district = ""; updates.area = ""; }
                  if (key === "province") { updates.city = ""; updates.district = ""; updates.area = ""; }
                  if (key === "city") { updates.district = ""; updates.area = ""; }
                  if (key === "district") { updates.area = ""; }
                  onChange({ ...filters, ...updates });
                }}
                disabled={disabled}
                className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-all ${disabled ? "opacity-40 bg-gray-50 cursor-not-allowed" : "cursor-pointer"} ${!filters[key] ? "text-gray-400" : "text-gray-800"}`}
              >
                <option value="">{label}</option>
                {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            ))}
            
            {/* Only in projects */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!filters.projectId}
                  onChange={(e) => onChange({ ...filters, projectId: e.target.checked ? "" : "" })}
                  className="accent-orange-600"
                />
                <span className="text-xs font-bold text-gray-800">Only in projects</span>
              </label>
              {filters.projectId !== "" && (
                <input
                  type="text"
                  placeholder="Select project"
                  value={filters.projectName || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const project = projects.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
                    onChange({ ...filters, projectName: name, projectId: project?.id || "" });
                  }}
                  disabled={!filters.projectId && filters.projectId === ""}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  list="projects-list"
                />
              )}
              <datalist id="projects-list">
                {projects
                  .filter(p => !filters.projectName || p.name.toLowerCase().includes(filters.projectName.toLowerCase()))
                  .map(p => <option key={p.id} value={p.name} />)
                }
              </datalist>
            </div>

            {/* Search by google map link */}
            <div>
              <label className="text-xs font-bold text-gray-800 mb-1 block">Search by google map link</label>
              <input
                type="text"
                placeholder="Search by google map link"
                value={filters.googleMapLink || ""}
                onChange={(e) => onChange({ ...filters, googleMapLink: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Search near my location */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={filters.searchNearLocation || false}
                  onChange={(e) => onChange({ ...filters, searchNearLocation: e.target.checked })}
                  className="accent-orange-600"
                />
                <span className="text-xs font-bold text-gray-800">Search near my location</span>
              </label>
              {filters.searchNearLocation && (
                <div className="space-y-2 pl-3 border-l-2 border-orange-400">
                  <p className="text-xs text-gray-500">Radius: {filters.locationRadius || 10} Km</p>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.locationRadius || 10}
                    onChange={(e) => onChange({ ...filters, locationRadius: parseInt(e.target.value) })}
                    className="w-full accent-orange-600"
                  />
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition-colors text-xs">
                    📍 Search near my location
                  </button>
                </div>
              )}
            </div>
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Property Category">
          <div className="flex flex-col gap-1.5">
            {categoriesLoading ? (
              <p className="text-xs text-gray-500">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-xs text-gray-500">No categories available</p>
            ) : (
              categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={(filters.categories || []).includes(c.id)}
                    onChange={() => toggleArr("categories", c.id)}
                    className="accent-[#FF6B00]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{c.name}</span>
                </label>
              ))
            )}
          </div>
        </FilterSection>

        {/* Purpose */}
        <FilterSection title="Purpose">
          <div className="flex flex-col gap-2">
            {PURPOSES.map((p) => (
              <label key={p} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="purpose"
                  checked={filters.purpose === p}
                  onChange={() => set("purpose", p)}
                  className="accent-[#FF6B00]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{p}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Suitable For */}
        <FilterSection title="Suitable For" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
            {SUITABLE_FOR.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.suitableFor || []).includes(s)}
                  onChange={() => toggleArr("suitableFor", s)}
                  className="accent-[#FF6B00]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{s}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Max */}
        <FilterSection title="Price Max">
          <div className="flex gap-2 items-end">
            <input type="number" placeholder="Max Price" value={filters.priceMax || ""} onChange={(e) => set("priceMax", e.target.value)} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <select value={filters.currency || "USD"} onChange={(e) => set("currency", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </FilterSection>

        {/* Area Size Min */}
        <FilterSection title="Area Size Min" defaultOpen={false}>
          <input type="number" placeholder="Min Area Size" value={filters.sizeMin || ""} onChange={(e) => set("sizeMin", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 mb-2" />
          <div className="flex gap-2">
            {SIZE_UNITS.map((u) => (
              <button key={u} onClick={() => set("sizeUnit", u)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${filters.sizeUnit === u ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "bg-white text-gray-600 border-gray-200 hover:border-[#FF6B00]"}`}>{u}</button>
            ))}
          </div>
        </FilterSection>

        {/* Beds */}
        <FilterSection title="Bedrooms" defaultOpen={false}>
          <CounterBtn value={filters.beds} onClick={(v) => set("beds", v)} />
        </FilterSection>

        {/* Baths */}
        <FilterSection title="Bathrooms" defaultOpen={false}>
          <CounterBtn value={filters.baths} onClick={(v) => set("baths", v)} />
        </FilterSection>

        {/* Amenities */}
        <FilterSection title="Amenities" defaultOpen={false}>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.amenities || []).includes(a)} onChange={() => toggleArr("amenities", a)} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{a}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Finishing */}
        <FilterSection title="Finishing Status" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
            {FINISHING.map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.finishing || []).includes(f)} onChange={() => toggleArr("finishing", f)} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{f}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Year Built */}
        <FilterSection title="Year Built" defaultOpen={false}>
          <div className="flex gap-2">
            <input type="number" placeholder="From" value={filters.yearFrom || ""} onChange={(e) => set("yearFrom", e.target.value)} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-orange-400" />
            <input type="number" placeholder="To" value={filters.yearTo || ""} onChange={(e) => set("yearTo", e.target.value)} className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-orange-400" />
          </div>
        </FilterSection>

        {/* Payment Methods */}
        <FilterSection title="Payment" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
            {PAYMENT_METHODS.map((pm) => (
              <label key={pm} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.paymentMethods || []).includes(pm)} onChange={() => toggleArr("paymentMethods", pm)} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{pm}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Frontage */}
        <FilterSection title="Frontage" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
            {["North", "South", "East", "West"].map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.frontage || []).includes(f)} onChange={() => toggleArr("frontage", f)} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{f}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Scene & View */}
        <FilterSection title="Scene & View" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
            {["Garden View", "City View", "Beach View", "Park View", "Street View"].map((v) => (
              <label key={v} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.sceneView || []).includes(v)} onChange={() => toggleArr("sceneView", v)} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{v}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Distance From */}
        <FilterSection title="📍 Distance From" defaultOpen={false}>
          <DistanceFromFilter filters={filters} onChange={onChange} />
        </FilterSection>

        {/* Search by Keyword */}
        <FilterSection title="Search by Keyword" defaultOpen={false}>
          <input type="text" placeholder="Enter keyword" value={filters.keyword || ""} onChange={(e) => set("keyword", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </FilterSection>

        {/* Search by Property Code */}
        <FilterSection title="Search by Property Code" defaultOpen={false}>
          <input type="text" placeholder="Enter property code" value={filters.propertyCode || ""} onChange={(e) => set("propertyCode", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </FilterSection>

        {/* Advanced Search */}
        <FilterSection title="Advanced Search" defaultOpen={false}>
          <div className="flex flex-col gap-1.5">
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
              <label key={key} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={(filters.advancedSearch || {})[key]} onChange={(e) => onChange({ ...filters, advancedSearch: { ...(filters.advancedSearch || {}), [key]: e.target.checked } })} className="accent-[#FF6B00]" />
                <span className="text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Apply Button */}
        <button onClick={() => onChange({ ...filters, _apply: Date.now() })} className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl transition-colors text-sm mt-2 shadow-md shadow-orange-200">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="w-full text-center text-xs text-gray-400 hover:text-[#FF6B00] transition-colors mt-3 py-1">
          Reset All Filters
        </button>
      </div>
    </aside>
  );
}