import { useState, useEffect, useRef } from "react";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";
import { base44 } from "@/api/base44Client";
import { Search } from "lucide-react";

const COUNTRIES = ["Egypt", "UAE", "Saudi Arabia", "Kuwait", "Qatar"];
const PROVINCES = { Egypt: ["Cairo", "Giza", "Alexandria", "Aswan"], UAE: ["Dubai", "Abu Dhabi", "Sharjah"], "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"] };
const CITIES = { Cairo: ["New Cairo", "Maadi", "Zamalek", "Downtown", "Heliopolis"], Giza: ["Sheikh Zayed", "6th October", "Dokki"], Dubai: ["Downtown", "Marina", "JBR", "Business Bay"] };

function DistrictAutocomplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const timeoutRef = useRef(null);

  const handleInput = (val) => {
    onChange(val);
    if (val.trim().length < 2) { setSuggestions([]); setShowSugg(false); return; }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const q = val.toLowerCase();
      const [cities, districts, areas] = await Promise.all([
        base44.entities.City.list(undefined, 200),
        base44.entities.District.list(undefined, 200),
        base44.entities.Area.list(undefined, 200),
      ]);
      const matches = [
        ...cities.filter(c => c.name?.toLowerCase().includes(q)).map(c => ({ label: c.name, type: "City" })),
        ...districts.filter(d => d.name?.toLowerCase().includes(q)).map(d => ({ label: d.name, type: "District" })),
        ...areas.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ label: a.name, type: "Area" })),
      ].slice(0, 12);
      setSuggestions(matches);
      setShowSugg(matches.length > 0);
    }, 300);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-orange-400">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={value}
          onChange={e => handleInput(e.target.value)}
          onBlur={() => setTimeout(() => setShowSugg(false), 150)}
          onFocus={() => value.length >= 2 && setShowSugg(suggestions.length > 0)}
          placeholder="Search city, district or area..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {value && <button onClick={() => { onChange(""); setSuggestions([]); setShowSugg(false); }} className="text-gray-400 text-xs">✕</button>}
      </div>
      {showSugg && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button key={i} onMouseDown={() => { onChange(s.label); setShowSugg(false); }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between border-b border-gray-50 last:border-0">
              <span className="font-semibold text-gray-800">{s.label}</span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{s.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationFilterSheet({ open, onClose, value, onApply }) {
  const [country, setCountry] = useState(value?.country || "");
  const [province, setProvince] = useState(value?.province || "");
  const [city, setCity] = useState(value?.city || "");
  const [district, setDistrict] = useState(value?.district || "");

  const provinces = PROVINCES[country] || [];
  const cities = CITIES[province] || [];

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => onApply({ country, province, city, district })}
      onReset={() => { setCountry(""); setProvince(""); setCity(""); setDistrict(""); }}
    >
      <p className="font-black text-gray-900 text-base mb-4">Select Location</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Country</p>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => { setCountry(c); setProvince(""); setCity(""); }}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${country === c ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {provinces.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Province / State</p>
            <div className="flex flex-wrap gap-2">
              {provinces.map(p => (
                <button key={p} onClick={() => { setProvince(p); setCity(""); }}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${province === p ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {cities.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">City</p>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${city === c ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">District / Area (Optional)</p>
          <DistrictAutocomplete value={district} onChange={setDistrict} />
        </div>
      </div>
    </MobileFilterBottomSheet>
  );
}