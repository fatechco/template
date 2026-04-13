import { useState } from "react";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";

const CURRENCIES = ["EGP", "USD", "EUR", "AED", "SAR"];
const QUICK_RANGES = [
  { label: "Under 100K", min: 0, max: 100000 },
  { label: "100K–500K", min: 100000, max: 500000 },
  { label: "500K–1M", min: 500000, max: 1000000 },
  { label: "1M+", min: 1000000, max: null },
];

export default function PriceFilterSheet({ open, onClose, value, onApply }) {
  const [currency, setCurrency] = useState(value?.currency || "EGP");
  const [minPrice, setMinPrice] = useState(value?.min || "");
  const [maxPrice, setMaxPrice] = useState(value?.max || "");

  const applyQuick = (range) => {
    setMinPrice(range.min || "");
    setMaxPrice(range.max || "");
  };

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => onApply(minPrice || maxPrice ? { currency, min: minPrice, max: maxPrice } : null)}
      onReset={() => { setMinPrice(""); setMaxPrice(""); }}
    >
      <p className="font-black text-gray-900 text-base mb-4">Price Range</p>

      {/* Currency */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Currency</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CURRENCIES.map(c => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${currency === c ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Quick ranges */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Quick Select</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_RANGES.map((r) => (
            <button key={r.label} onClick={() => applyQuick(r)}
              className={`py-2.5 rounded-xl text-sm font-bold border transition-colors ${minPrice === (r.min || "") && maxPrice === (r.max || "") ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manual inputs */}
      <div>
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Custom Range</p>
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <input
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="Min Price"
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>
          <span className="text-gray-400 font-bold">—</span>
          <div className="flex-1">
            <input
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="Max Price"
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>
        </div>
      </div>
    </MobileFilterBottomSheet>
  );
}