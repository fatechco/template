"use client";
// @ts-nocheck
import { useState } from "react";

const STATUS_OPTS = ["New", "Ready", "Off-Plan", "Under Construction"];
const FINISHING_OPTS = ["Half Finished", "Complete", "Luxury"];
const FURNISHED_OPTS = ["Yes", "No", "Semi"];
const SUITABLE_OPTS = ["Residential", "Commercial", "Administrative", "Medical"];
const AMENITIES_LIST = ["Gym", "Pool", "Parking", "Garden", "Security", "Elevator", "AC", "Balcony", "Storage", "Maid Room", "BBQ Area", "Kids Area", "Tennis Court", "Mosque"];

function ChipGroup({ label, options, selected, onToggle }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-black text-gray-900 mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              selected.includes(opt) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MoreFiltersSheet({ open, onClose, value, onApply, onReset }) {
  const [status, setStatus] = useState(value?.status || []);
  const [finishing, setFinishing] = useState(value?.finishing || []);
  const [furnished, setFurnished] = useState(value?.furnished || []);
  const [suitableFor, setSuitableFor] = useState(value?.suitableFor || []);
  const [amenities, setAmenities] = useState(value?.amenities || []);
  const [yearFrom, setYearFrom] = useState(value?.yearFrom || "");
  const [yearTo, setYearTo] = useState(value?.yearTo || "");

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleReset = () => {
    setStatus([]); setFinishing([]); setFurnished([]);
    setSuitableFor([]); setAmenities([]); setYearFrom(""); setYearTo("");
    onReset?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end items-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl flex flex-col pointer-events-auto w-full max-w-lg" style={{ maxHeight: "92vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <p className="font-black text-gray-900 text-base">All Filters</p>
          <div className="w-10 h-1 bg-gray-200 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ChipGroup label="Property Status" options={STATUS_OPTS} selected={status} onToggle={v => toggle(status, setStatus, v)} />
          <ChipGroup label="Finishing" options={FINISHING_OPTS} selected={finishing} onToggle={v => toggle(finishing, setFinishing, v)} />
          <ChipGroup label="Furnished" options={FURNISHED_OPTS} selected={furnished} onToggle={v => toggle(furnished, setFurnished, v)} />

          {/* Year built */}
          <div className="mb-5">
            <p className="text-sm font-black text-gray-900 mb-2.5">Year Built</p>
            <div className="flex gap-3">
              <input value={yearFrom} onChange={e => setYearFrom(e.target.value)} placeholder="From" type="number"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" />
              <input value={yearTo} onChange={e => setYearTo(e.target.value)} placeholder="To" type="number"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" />
            </div>
          </div>

          <ChipGroup label="Suitable For" options={SUITABLE_OPTS} selected={suitableFor} onToggle={v => toggle(suitableFor, setSuitableFor, v)} />

          {/* Amenities */}
          <div className="mb-5">
            <p className="text-sm font-black text-gray-900 mb-2.5">Amenities</p>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_LIST.map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => toggle(amenities, setAmenities, a)}
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${amenities.includes(a) ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}
                  >
                    {amenities.includes(a) && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700">{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100 flex-shrink-0" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <button onClick={handleReset} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold text-sm">
            Reset All
          </button>
          <button
            onClick={() => onApply({ status, finishing, furnished, suitableFor, amenities, yearFrom, yearTo })}
            className="flex-[2] py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}