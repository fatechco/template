import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TYPES = ["Residential", "Mixed Use", "Apartments", "Villas", "Commercial", "Chalets"];
const PRICES = ["Under 3M", "3M – 5M", "5M – 10M", "Above 10M"];
const DELIVERIES = ["2025", "2026", "2027", "2028+"];

export default function ProjectFiltersSheet({ open, activeKey, onClose, filters, setFilters }) {
  const [citySearch, setCitySearch] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    if (activeKey !== "city" || !open) return;
    if (citySearch.trim().length < 1) {
      // Load defaults
      base44.entities.City.list("-created_date", 50)
        .then(data => setLocationOptions(data.map(c => ({ label: c.name, type: "City" }))))
        .catch(() => {});
      return;
    }
    setLoadingLocations(true);
    const q = citySearch.toLowerCase();
    Promise.all([
      base44.entities.City.list(undefined, 200),
      base44.entities.District.list(undefined, 200),
      base44.entities.Area.list(undefined, 200),
    ]).then(([cities, districts, areas]) => {
      const matches = [
        ...cities.filter(c => c.name?.toLowerCase().includes(q)).map(c => ({ label: c.name, type: "City" })),
        ...districts.filter(d => d.name?.toLowerCase().includes(q)).map(d => ({ label: d.name, type: "District" })),
        ...areas.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ label: a.name, type: "Area" })),
      ].slice(0, 20);
      setLocationOptions(matches);
    }).catch(() => {}).finally(() => setLoadingLocations(false));
  }, [citySearch, activeKey, open]);
  if (!open) return null;

  const applyAndClose = (key, value) => {
    setFilters(f => ({ ...f, [key]: value === filters[key] ? null : value }));
    onClose();
  };

  const renderOptions = (key, options) => (
    <div className="py-2" style={{ paddingBottom: "max(16px,env(safe-area-inset-bottom))" }}>
      <button onClick={() => applyAndClose(key, null)} className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50">
        <span className="text-sm font-semibold text-gray-700">Any</span>
        {!filters[key] && <span className="text-orange-600 font-black">✓</span>}
      </button>
      {options.map(opt => (
        <button key={opt} onClick={() => applyAndClose(key, opt)} className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50">
          <span className={`text-sm font-semibold ${filters[key] === opt ? "text-orange-600" : "text-gray-700"}`}>{opt}</span>
          {filters[key] === opt && <span className="text-orange-600 font-black">✓</span>}
        </button>
      ))}
    </div>
  );

  const renderLocationOptions = () => (
    <div className="py-2" style={{ paddingBottom: "max(16px,env(safe-area-inset-bottom))" }}>
      <button onClick={() => applyAndClose("city", null)} className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50">
        <span className="text-sm font-semibold text-gray-700">Any</span>
        {!filters.city && <span className="text-orange-600 font-black">✓</span>}
      </button>
      {loadingLocations && <p className="text-xs text-gray-400 px-5 py-2">Loading...</p>}
      {locationOptions.map((opt, i) => (
        <button key={i} onClick={() => applyAndClose("city", opt.label)} className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50">
          <span className={`text-sm font-semibold ${filters.city === opt.label ? "text-orange-600" : "text-gray-700"}`}>{opt.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{opt.type}</span>
            {filters.city === opt.label && <span className="text-orange-600 font-black">✓</span>}
          </div>
        </button>
      ))}
    </div>
  );

  const titles = { city: "City", type: "Project Type", price: "Price Range", delivery: "Delivery Year", more: "More Filters" };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl overflow-hidden w-full" style={{ maxWidth: 480, maxHeight: "70vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
        <p className="font-black text-gray-900 text-base px-5 py-3 border-b border-gray-100">
          {titles[activeKey] || "Filters"}
        </p>
        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {activeKey === "type" && renderOptions("type", TYPES)}
          {activeKey === "price" && renderOptions("price", PRICES)}
          {activeKey === "delivery" && renderOptions("delivery", DELIVERIES)}
          {activeKey === "city" && (
            <div>
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                  <Search size={14} className="text-gray-400 flex-shrink-0" />
                  <input
                    value={citySearch}
                    onChange={e => setCitySearch(e.target.value)}
                    placeholder="Search city, district or area..."
                    autoFocus
                    className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
              {renderLocationOptions()}
            </div>
          )}
          {activeKey === "more" && (
            <div className="px-5 py-4 space-y-5">
              <div>
                <p className="font-black text-gray-900 text-sm mb-3">Project Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setFilters(f => ({ ...f, type: f.type === t ? null : t }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filters.type === t ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm mb-3">Delivery Year</p>
                <div className="flex gap-2 flex-wrap">
                  {DELIVERIES.map(d => (
                    <button key={d} onClick={() => setFilters(f => ({ ...f, delivery: f.delivery === d ? null : d }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border ${filters.delivery === d ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm">
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}