import { useState, useEffect, useRef } from "react";
import { MapPin, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { queueRequest } from "@/lib/api-queue";
import StepShell from "./StepShell";
import DraggableMapPicker from "./DraggableMapPicker";

const CATEGORY_ICONS = {
  "Apartment": "🏢",
  "Villa": "🏡",
  "Office": "🏛️",
  "Shop": "🏪",
  "Land": "🌍",
  "Warehouse": "🏭",
  "Townhouse": "🏘️",
  "Duplex": "🏠",
  "Chalet": "⛺",
  "Hotel Apt": "🏨",
  "Clinic": "🏥",
  "Building": "🏗️",
  "Condo": "🏢",
  "Factory": "🏭",
  "Oil Station": "⛽",
  "Workspace": "💼",
  "Festival Halls": "🎪",
  "Mansion": "👑",
  "House": "🏡",
  "Hospital": "🏥",
  "Multiple Units": "🏗️",
  "Restaurant or Cafe": "🍽️",
  "Hotel or Motel": "🏨",
  "Training Room": "📚",
  "Conference Room": "🤝",
  "Palace": "🏛️",
  "Farm": "🌾",
  "Mall": "🛍️",
  "Sports or Play": "⚽",
  "Meeting Room": "🤝",
  "Playground": "🎡",
};

const SUITABLE_FOR = ["Residential", "Commercial", "Administrative", "Industrial", "Tourism", "Medical", "Educational"];
const PURPOSES = [
  { value: "For Sale", label: "For Sale" },
  { value: "For Rent", label: "For Rent" },
  { value: "For Daily Booking", label: "For Daily Booking" },
  { value: "For Fractional Investment", label: "For Fractional Investment" },
  { value: "For Swap", label: "For Swap" },
  { value: "In Auction", label: "In Auction" },
];

function FieldLabel({ children, required }) {
  return (
    <label className="text-sm font-bold text-gray-700 mb-1 block">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function Step1Location({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const update = (patch) => updateForm(patch);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cityNames, setCityNames] = useState({});
  const [districtNames, setDistrictNames] = useState({});
  const [areaNames, setAreaNames] = useState({});
  const [loadingInit, setLoadingInit] = useState(true);

  const EGYPT_COUNTRY_ID = "69d0b93e19cff6ef7d6a38a7";
  const EGYPT_PROVINCE_ID = "69d0ba78b2324457d06b088f";

  // Load data using global queue to prevent rate limiting
  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setLoadingInit(true);

      // 1) Categories — most important
      try {
        const cats = await queueRequest(() => base44.entities.PropertyCategory.list('name', 100));
        if (!cancelled) setCategories(cats || []);
      } catch { if (!cancelled) setCategories([]); }

      // 2) Countries
      try {
        const ctrs = await queueRequest(() => base44.entities.Country.list('-name', 200));
        if (!cancelled) setCountries(ctrs || []);
      } catch { if (!cancelled) setCountries([]); }

      // 3) Provinces for Egypt
      try {
        const provs = await queueRequest(() => base44.entities.Province.filter({ country_id: EGYPT_COUNTRY_ID }));
        if (!cancelled) setProvinces(provs || []);
      } catch { if (!cancelled) setProvinces([]); }

      // 4) Cities for default province
      try {
        const cits = await queueRequest(() => base44.entities.City.filter({ province_id: EGYPT_PROVINCE_ID }));
        if (!cancelled) {
          setCities(cits || []);
          const names = {}; (cits || []).forEach(x => names[x.id] = x.name); setCityNames(names);
        }
      } catch { if (!cancelled) setCities([]); }

      if (!cancelled) setLoadingInit(false);
    }

    loadInitial();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Location cascading fetches — use global queue
  const loadProvinces = async (countryId) => {
    if (!countryId) { setProvinces([]); return; }
    try { setProvinces(await queueRequest(() => base44.entities.Province.filter({ country_id: countryId }))); } catch { setProvinces([]); }
  };
  const loadCities = async (provinceId) => {
    if (!provinceId) { setCities([]); return; }
    try {
      const c = await queueRequest(() => base44.entities.City.filter({ province_id: provinceId }));
      setCities(c);
      const names = {}; c.forEach(x => names[x.id] = x.name); setCityNames(names);
    } catch { setCities([]); }
  };
  const loadDistricts = async (cityId) => {
    if (!cityId) { setDistricts([]); return; }
    try {
      const d = await queueRequest(() => base44.entities.District.filter({ city_id: cityId }));
      setDistricts(d);
      const names = {}; d.forEach(x => names[x.id] = x.name); setDistrictNames(names);
    } catch { setDistricts([]); }
  };
  const loadAreas = async (districtId) => {
    if (!districtId) { setAreas([]); return; }
    try {
      const a = await queueRequest(() => base44.entities.Area.filter({ district_id: districtId }));
      setAreas(a);
      const names = {}; a.forEach(x => names[x.id] = x.name); setAreaNames(names);
    } catch { setAreas([]); }
  };

  const toggleSuitable = (val) => {
    const cur = form.suitable_for_ids || [];
    update({ suitable_for_ids: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
  };

  const handleMapLocationChange = (lat, lng) => {
    update({ latitude: lat, longitude: lng });
  };

  const validate = () => {
    const e = {};
    if (!form.category_id) e.category_id = "Please select a category";
    if (!form.purpose) e.purpose = "Please select a purpose";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <StepShell title="Step 1 — Location & Property Type" subtitle="Tell us about your property's type and location." onNext={handleNext} onBack={onBack} isFirst>
      {/* Category */}
      <div>
        <FieldLabel required>Property Category</FieldLabel>
        {errors.category_id && <p className="text-red-500 text-xs mb-2">{errors.category_id}</p>}
        {categories.length === 0 && loadingInit ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <div className="w-5 h-5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading categories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => update({ category_id: cat.id })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                  form.category_id === cat.id
                    ? "border-[#FF6B00] bg-orange-50 shadow"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
                }`}
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat.name] || "📍"}</span>
                <span className={`text-[11px] font-bold ${form.category_id === cat.id ? "text-[#FF6B00]" : "text-gray-600"}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suitable For */}
      <div>
        <FieldLabel>Suitable For</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SUITABLE_FOR.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSuitable(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                (form.suitable_for_ids || []).includes(s)
                  ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                  : "border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <FieldLabel required>Purpose</FieldLabel>
        {errors.purpose && <p className="text-red-500 text-xs mb-2">{errors.purpose}</p>}
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => update({ purpose: p.value })}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                form.purpose === p.value
                  ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country */}
        <div>
          <FieldLabel>Country</FieldLabel>
          <select
            value={form.country_id || EGYPT_COUNTRY_ID}
            onChange={e => {
              const v = e.target.value;
              update({ country_id: v, province_id: "", city_id: "", district_id: "", area_id: "" });
              setCities([]); setDistricts([]); setAreas([]); setProvinces([]);
              loadProvinces(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Country</option>
            {countries.length === 0 && (
              <option value={EGYPT_COUNTRY_ID}>Egypt</option>
            )}
            {countries.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Province */}
        <div>
          <FieldLabel>Province / State</FieldLabel>
          <select
            value={form.province_id || EGYPT_PROVINCE_ID}
            onChange={e => {
              const v = e.target.value;
              update({ province_id: v, city_id: "", district_id: "", area_id: "" });
              setDistricts([]); setAreas([]); setCities([]);
              loadCities(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Province / State</option>
            {provinces.length === 0 && (
              <option value={EGYPT_PROVINCE_ID}>Egypt</option>
            )}
            {provinces.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <FieldLabel>City</FieldLabel>
          <select
            value={form.city_id || ""}
            onChange={e => {
              const v = e.target.value;
              update({ city_id: v, district_id: "", area_id: "" });
              setAreas([]); loadDistricts(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select City</option>
            {cities.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* District */}
        <div>
          <FieldLabel>District</FieldLabel>
          <select
            value={form.district_id || ""}
            onChange={e => {
              const v = e.target.value;
              update({ district_id: v, area_id: "" });
              loadAreas(v);
            }}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select District</option>
            {districts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        {/* Area */}
        <div>
          <FieldLabel>Area / Neighborhood</FieldLabel>
          <select
            value={form.area_id || ""}
            onChange={e => update({ area_id: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
          >
            <option value="">Select Area / Neighborhood</option>
            {areas.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>

        <div>
          <FieldLabel>Address</FieldLabel>
          <input
            type="text"
            placeholder="e.g. 12 El Nasr Street, 5th Settlement"
            value={form.address}
            onChange={e => update({ address: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Map picker */}
      <div>
        <FieldLabel>Set Location on Map</FieldLabel>
        <DraggableMapPicker
          lat={form.latitude ? parseFloat(form.latitude) : null}
          lng={form.longitude ? parseFloat(form.longitude) : null}
          onLocationChange={handleMapLocationChange}
          cityName={cityNames[form.city_id] || ""}
          districtName={districtNames[form.district_id] || ""}
          areaName={areaNames[form.area_id] || ""}
          address={form.address}
        />
      </div>

      {/* Direct Phone */}
      <div>
        <FieldLabel>Direct Phone Number <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="+20 100 000 0000"
            value={form.direct_phone}
            onChange={e => update({ direct_phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>
    </StepShell>
  );
}