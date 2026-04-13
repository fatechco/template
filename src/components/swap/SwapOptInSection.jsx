import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Twin House", "Chalet", "House", "Land", "Office", "Shop"];

const EGYPTIAN_CITIES = [
  "New Cairo", "Sheikh Zayed", "6th of October", "Maadi", "Heliopolis",
  "Nasr City", "Zamalek", "Dokki", "Giza", "Mohandessin",
  "Downtown Cairo", "North Coast", "Ain Sokhna", "Hurghada", "Sharm El Sheikh",
  "Alexandria", "El Gouna", "New Capital", "Shorouk", "Obour",
];

function PillButton({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
        selected
          ? "bg-[#7C3AED] text-white border-[#7C3AED]"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED]"
      }`}
    >
      {label}
    </button>
  );
}

function DirectionCard({ value, selected, emoji, title, subtitle, children, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? "border-[#7C3AED] bg-purple-50" : "border-gray-200 bg-white hover:border-purple-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
          selected ? "border-[#7C3AED] bg-[#7C3AED]" : "border-gray-300"
        }`}>
          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900">{emoji} {title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          {selected && children && (
            <div className="mt-3">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SwapOptInSection({ swapData, onChange }) {
  const [enabled, setEnabled] = useState(swapData?.enabled ?? false);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const data = swapData || {
    enabled: false,
    desiredCategories: [],
    desiredCities: [],
    desiredMinBedrooms: 1,
    desiredMinAreaSqm: "",
    desiredKeywords: "",
    swapDirection: "equal",
    cashGapAvailableEGP: "",
    cashGapExpectedEGP: "",
  };

  const update = (fields) => onChange({ ...data, ...fields, enabled });

  const toggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    onChange({ ...data, enabled: next });
  };

  const toggleCategory = (cat) => {
    const current = data.desiredCategories || [];
    const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
    update({ desiredCategories: next });
  };

  const addCity = (city) => {
    const current = data.desiredCities || [];
    if (!current.includes(city)) update({ desiredCities: [...current, city] });
    setCitySearch("");
    setShowCityDropdown(false);
  };

  const removeCity = (city) => {
    update({ desiredCities: (data.desiredCities || []).filter(c => c !== city) });
  };

  const filteredCities = EGYPTIAN_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase()) &&
    !(data.desiredCities || []).includes(c)
  );

  return (
    <div
      className="rounded-2xl p-6 mt-6"
      style={{
        background: "#F5F3FF",
        borderLeft: "4px solid #7C3AED",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🔄</span>
          <div>
            <p className="font-black text-[#0A1628] text-lg leading-tight">
              Kemedar Swap™ — Trade Without Selling First
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Swap this property directly for another one. No need to sell for cash first. AI finds your perfect match.
            </p>
          </div>
        </div>
        <span className="flex-shrink-0 bg-[#7C3AED] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          Kemedar Swap™
        </span>
      </div>

      {/* Toggle Card */}
      <div
        className={`bg-white rounded-xl p-4 flex items-center justify-between transition-all ${
          enabled ? "border-2 border-[#7C3AED]" : "border border-gray-200"
        }`}
      >
        <div>
          <p className="font-bold text-[15px] text-gray-900">List this property in the Swap Pool</p>
          <p className="text-xs text-gray-500 mt-0.5">Verified owners in your area will see your property as a potential swap partner</p>
        </div>
        <button
          type="button"
          onClick={toggleEnabled}
          className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
            enabled ? "bg-[#7C3AED]" : "bg-gray-200"
          }`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`} />
        </button>
      </div>

      {/* Expanded Form */}
      {enabled && (
        <div className="mt-5 space-y-5">
          <p className="text-sm font-bold text-gray-800">What are you looking for in return?</p>

          {/* Property Types */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Property type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map(type => (
                <PillButton
                  key={type}
                  label={type}
                  selected={(data.desiredCategories || []).includes(type)}
                  onClick={() => toggleCategory(type)}
                />
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Preferred locations <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(data.desiredCities || []).map(city => (
                <span key={city} className="flex items-center gap-1.5 bg-[#7C3AED] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {city}
                  <button type="button" onClick={() => removeCity(city)} className="hover:opacity-70">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Type city or area name..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] bg-white"
              />
              {showCityDropdown && citySearch && filteredCities.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {filteredCities.slice(0, 8).map(city => (
                    <button
                      key={city}
                      type="button"
                      onMouseDown={() => addCity(city)}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-[#7C3AED] font-medium transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Size & Bedrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Min. bedrooms</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update({ desiredMinBedrooms: Math.max(0, (data.desiredMinBedrooms || 1) - 1) })}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-lg font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
                >−</button>
                <span className="flex-1 text-center font-bold text-gray-900">{data.desiredMinBedrooms ?? 1}</span>
                <button
                  type="button"
                  onClick={() => update({ desiredMinBedrooms: (data.desiredMinBedrooms || 1) + 1 })}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-lg font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
                >+</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Min. area (sqm)</label>
              <input
                type="number"
                value={data.desiredMinAreaSqm || ""}
                onChange={e => update({ desiredMinAreaSqm: e.target.value })}
                placeholder="e.g. 120"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED] bg-white"
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Tell us more <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={data.desiredKeywords || ""}
              onChange={e => update({ desiredKeywords: e.target.value.slice(0, 300) })}
              placeholder="e.g. Looking for a villa in New Cairo with a garden, close to international schools..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C3AED] bg-white resize-none"
            />
            <div className="flex justify-between mt-1">
              <p className="text-[11px] text-gray-400">AI uses this to find better matches</p>
              <p className="text-[11px] text-gray-400">{(data.desiredKeywords || "").length}/300</p>
            </div>
          </div>

          {/* Financial Goal */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-3">
              What is your financial goal? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <DirectionCard
                value="upgrade"
                selected={data.swapDirection === "upgrade"}
                emoji="⬆️"
                title="Upgrade — I'll pay the difference"
                subtitle="Your new property can be worth more. You cover the gap in cash."
                onClick={() => update({ swapDirection: "upgrade" })}
              >
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Maximum extra cash I can pay:</label>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-2 rounded-lg">EGP</span>
                    <input
                      type="number"
                      value={data.cashGapAvailableEGP || ""}
                      onChange={e => update({ cashGapAvailableEGP: e.target.value })}
                      placeholder="e.g. 500000"
                      onClick={e => e.stopPropagation()}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
              </DirectionCard>

              <DirectionCard
                value="downsize"
                selected={data.swapDirection === "downsize"}
                emoji="⬇️"
                title="Downsize — I want cash back"
                subtitle="Trade for a smaller property and pocket the difference in cash."
                onClick={() => update({ swapDirection: "downsize" })}
              >
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Minimum cash I expect to receive:</label>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-2 rounded-lg">EGP</span>
                    <input
                      type="number"
                      value={data.cashGapExpectedEGP || ""}
                      onChange={e => update({ cashGapExpectedEGP: e.target.value })}
                      placeholder="e.g. 200000"
                      onClick={e => e.stopPropagation()}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
              </DirectionCard>

              <DirectionCard
                value="equal"
                selected={data.swapDirection === "equal"}
                emoji="⚖️"
                title="Equal Swap — Similar value only"
                subtitle="Properties should be roughly the same value. No large cash transfers."
                onClick={() => update({ swapDirection: "equal" })}
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-3 pt-1">
            <div className="flex gap-3 p-3 bg-purple-100 rounded-xl">
              <span className="text-base flex-shrink-0">ℹ️</span>
              <p className="text-xs text-purple-800">
                Your property's estimated market value will be calculated by AI and shown to potential swap partners. You can review this before going live.
              </p>
            </div>
            <div className="flex gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-base flex-shrink-0">⚡</span>
              <p className="text-xs text-amber-800">
                Kemedar Swap™ requires <strong>Verify Pro Level 2+</strong>. Properties with higher verification attract more swap partners.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}