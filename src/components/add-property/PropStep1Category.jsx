import { useState } from "react";

const CATEGORIES = [
  { icon: "🏠", label: "Apartment" }, { icon: "🏡", label: "House" }, { icon: "🌾", label: "Land" },
  { icon: "🏘", label: "Condo" }, { icon: "🏖", label: "Chalet" }, { icon: "🏰", label: "Villa" },
  { icon: "🏗", label: "Twinhouse" }, { icon: "🏚", label: "Townhouse" }, { icon: "👑", label: "Palace" },
  { icon: "🏪", label: "Shop" }, { icon: "📦", label: "Warehouse" }, { icon: "🏢", label: "Office" },
  { icon: "🏥", label: "Clinic" }, { icon: "🌱", label: "Farm" }, { icon: "🏭", label: "Factory" },
  { icon: "🏬", label: "Multiple Units" }, { icon: "🛏", label: "Room" }, { icon: "🏗", label: "Building" },
  { icon: "🍽", label: "Restaurant" }, { icon: "🏬", label: "Mall" }, { icon: "🏗", label: "Complex" },
];

const SUITABLE_FOR = ["Residential", "Commercial", "Administrative", "Medical", "Industrial", "Tourism", "Investment"];

const PURPOSES = [
  { key: "sale", icon: "🏷", label: "For Sale" },
  { key: "rent", icon: "🔑", label: "For Rent" },
  { key: "sale_rent", icon: "🔑🏷", label: "Sale or Rent" },
];

export default function PropStep1Category({ form, update, onNext, canProceed }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? CATEGORIES : CATEGORIES.slice(0, 12);

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">What type of property?</h2>

      {/* Category grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-2">
        {displayed.map(cat => (
          <button key={cat.label} onClick={() => update({ category: cat.label })}
            className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${form.category === cat.label ? "bg-orange-600 border-orange-600" : "bg-white border-gray-200"}`}
            style={{ minHeight: 80 }}>
            <span className="text-3xl">{cat.icon}</span>
            <span className={`text-[11px] font-bold mt-1.5 text-center leading-tight ${form.category === cat.label ? "text-white" : "text-gray-600"}`}>{cat.label}</span>
            {form.category === cat.label && <span className="text-white text-xs mt-0.5">✓</span>}
          </button>
        ))}
      </div>
      {!showAll && (
        <button onClick={() => setShowAll(true)} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-bold mb-5">
          + More categories
        </button>
      )}

      {/* Suitable for */}
      <div className="mb-5">
        <p className="text-sm font-black text-gray-700 mb-2">Suitable for:</p>
        <div className="flex flex-wrap gap-2">
          {SUITABLE_FOR.map(s => (
            <button key={s} onClick={() => {
              const cur = form.suitable_for || [];
              update({ suitable_for: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
            }}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${(form.suitable_for || []).includes(s) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <p className="text-sm font-black text-gray-700 mb-2">Purpose:</p>
      <div className="space-y-2 mb-6">
        {PURPOSES.map(p => (
          <button key={p.key} onClick={() => update({ purpose: p.key })}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all text-left ${form.purpose === p.key ? "border-orange-600 bg-orange-50" : "border-gray-200 bg-white"}`}>
            <span className="text-xl">{p.icon}</span>
            <span className={`text-base font-black ${form.purpose === p.key ? "text-orange-600" : "text-gray-800"}`}>{p.label}</span>
            {form.purpose === p.key && <span className="ml-auto text-orange-600 font-black">✓</span>}
          </button>
        ))}
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}