import { useState, useEffect } from "react";
import { Search, ChevronDown, MapPin, Tag, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PURPOSES = ["For Sale", "For Rent", "For Daily Booking"];
const CURRENCIES = ["USD", "EGP", "EUR", "AED", "SAR", "GBP"];

function Select({ label, value, onChange, options, disabled }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none bg-white/8 border rounded-xl px-3 py-2.5 text-sm pr-8 focus:outline-none transition-all
          border-white/15 focus:border-[#FF6B00] focus:bg-white/15 text-white
          ${disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer hover:bg-white/15 hover:border-white/25"}`}
        style={{ background: disabled ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.08)" }}
      >
        <option value="" style={{ background: "#c45200", color: "#ffddcc" }}>{label}</option>
        {options.map((opt) => (
          <option key={opt.id || opt} value={opt.id || opt} style={{ background: "#c45200", color: "#ffffff" }}>
            {opt.name || opt}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}

function FieldLabel({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5">
      <Icon size={11} className="text-[#FF6B00]" />
      <span className="text-[10px] font-bold text-white uppercase tracking-widest">{text}</span>
    </div>
  );
}

export default function SearchForm() {
  const [purpose, setPurpose] = useState("For Sale");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currency, setCurrency] = useState("USD");

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    base44.entities.PropertyCategory.list().then(setCategories).catch(() => {});
    base44.entities.Country.list().then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    setProvince(""); setCity(""); setDistrict(""); setArea("");
    setProvinces([]); setCities([]); setDistricts([]); setAreas([]);
    if (country) base44.entities.Province.filter({ country_id: country }).then(setProvinces).catch(() => {});
  }, [country]);

  useEffect(() => {
    setCity(""); setDistrict(""); setArea("");
    setCities([]); setDistricts([]); setAreas([]);
    if (province) base44.entities.City.filter({ province_id: province }).then(setCities).catch(() => {});
  }, [province]);

  useEffect(() => {
    setDistrict(""); setArea("");
    setDistricts([]); setAreas([]);
    if (city) base44.entities.District.filter({ city_id: city }).then(setDistricts).catch(() => {});
  }, [city]);

  useEffect(() => {
    setArea([]); setAreas([]);
    if (district) base44.entities.Area.filter({ district_id: district }).then(setAreas).catch(() => {});
  }, [district]);

  return (
    <div
      className="rounded-2xl overflow-hidden w-full border border-white/15"
      style={{ background: "rgba(10,10,25,0.85)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,107,0,0.1)" }}
    >
      {/* Purpose Tabs */}
      <div className="flex border-b border-white/10 p-1 gap-1 bg-white/5">
        {PURPOSES.map((p) => (
          <button
            key={p}
            onClick={() => setPurpose(p)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
              purpose === p
                ? "bg-[#FF6B00] text-white shadow-md shadow-orange-900/40"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="p-4 flex flex-col gap-3.5">
        {/* Property Type */}
        <div>
          <FieldLabel icon={Tag} text="Property Type" />
          <Select label="All Categories" value={category} onChange={setCategory} options={categories} />
        </div>

        {/* Location */}
        <div>
          <FieldLabel icon={MapPin} text="Location" />
          <div className="grid grid-cols-2 gap-2">
            <Select label="Country" value={country} onChange={setCountry} options={countries} />
            <Select label="Province" value={province} onChange={setProvince} options={provinces} disabled={!country} />
            <Select label="City" value={city} onChange={setCity} options={cities} disabled={!province} />
            <Select label="District" value={district} onChange={setDistrict} options={districts} disabled={!city} />
          </div>
          {/* Area — only show when district is selected */}
          {district && (
            <div className="mt-2">
              <Select label="Area / Neighborhood" value={area} onChange={setArea} options={areas} disabled={!district} />
            </div>
          )}
        </div>

        {/* Budget */}
        <div>
          <FieldLabel icon={DollarSign} text="Budget" />
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B00] transition-all border border-white/15"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <span className="text-white/40 text-xs font-bold">—</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B00] transition-all border border-white/15"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div className="relative flex-shrink-0">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="appearance-none bg-[#FF6B00] border-0 text-white font-bold rounded-xl px-3 py-2.5 text-xs pr-6 focus:outline-none cursor-pointer shadow-md"
              >
                {CURRENCIES.map((c) => <option key={c} value={c} style={{ background: "#c45200", color: "#ffffff" }}>{c}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button className="w-full flex items-center justify-center gap-2.5 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/40 hover:shadow-orange-900/60 hover:scale-[1.01] active:scale-[0.99] text-sm tracking-wide mt-0.5">
          <Search size={16} />
          Search Properties
        </button>
      </div>
    </div>
  );
}