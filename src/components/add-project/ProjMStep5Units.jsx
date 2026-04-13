import { useState } from "react";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";

const AMENITIES_GROUPS = [
  { label: "Recreation", items: ["Gym", "Swimming Pool", "Kids Area", "Club House", "Sports Courts", "Cycling Track"] },
  { label: "Utilities", items: ["Parking", "Generator", "Central AC", "Solar Power", "Elevators"] },
  { label: "Security", items: ["24hr Security", "CCTV", "Gated Community", "Smart Access"] },
  { label: "Lifestyle", items: ["Mall", "Mosque", "School", "Hospital", "Restaurants", "Hotel"] },
];

const UNIT_TYPES = ["Apartment", "Villa", "Townhouse", "Duplex", "Penthouse", "Studio", "Chalet", "Retail", "Office", "Warehouse"];

function UnitTypeCard({ unit, onRemove, onUpdate }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="font-black text-gray-800 text-sm">{unit.type}</span>
        <button onClick={onRemove}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Count", field: "count", placeholder: "Units" },
          { label: "Area from (sqm)", field: "area_min", placeholder: "Min" },
          { label: "Area to (sqm)", field: "area_max", placeholder: "Max" },
          { label: "Price from", field: "price_min", placeholder: "Min price" },
          { label: "Price to", field: "price_max", placeholder: "Max price" },
        ].map(f => (
          <div key={f.field}>
            <p className="text-[10px] text-gray-500 mb-1">{f.label}</p>
            <input value={unit[f.field] || ""} onChange={e => onUpdate({ [f.field]: e.target.value })}
              placeholder={f.placeholder} type="number"
              className="w-full border border-gray-200 rounded-xl px-2.5 py-2 text-xs outline-none focus:border-orange-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjMStep5Units({ form, update, onNext }) {
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const units = form.unit_types || [];
  const amenities = form.amenities || [];

  const addUnit = (type) => {
    update({ unit_types: [...units, { type, count: "", area_min: "", area_max: "", price_min: "", price_max: "" }] });
    setShowUnitPicker(false);
  };
  const removeUnit = (i) => update({ unit_types: units.filter((_, idx) => idx !== i) });
  const updateUnit = (i, data) => update({ unit_types: units.map((u, idx) => idx === i ? { ...u, ...data } : u) });
  const toggleAmenity = (a) => update({ amenities: amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a] });

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Unit Types & Amenities</h2>

      <p className="text-sm font-black text-gray-700 mb-3">Unit Types</p>
      <div className="space-y-3 mb-4">
        {units.map((unit, i) => (
          <UnitTypeCard key={i} unit={unit} onRemove={() => removeUnit(i)} onUpdate={data => updateUnit(i, data)} />
        ))}
        <button onClick={() => setShowUnitPicker(s => !s)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-orange-300 text-orange-600 text-sm font-black flex items-center justify-center gap-2">
          <Plus size={16} /> Add Unit Type
        </button>
        {showUnitPicker && (
          <div className="grid grid-cols-3 gap-2">
            {UNIT_TYPES.map(t => (
              <button key={t} onClick={() => addUnit(t)} className="py-2.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700">{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <button onClick={() => setAmenitiesOpen(o => !o)}
        className="w-full flex items-center justify-between bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-4 mb-2">
        <div className="text-left">
          <p className="font-black text-orange-700 text-sm">✅ Project Amenities</p>
          {amenities.length > 0 && <p className="text-xs text-orange-500 mt-0.5">{amenities.length} selected</p>}
        </div>
        {amenitiesOpen ? <ChevronUp size={18} className="text-orange-600" /> : <ChevronDown size={18} className="text-orange-600" />}
      </button>

      {amenitiesOpen && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 space-y-4">
          {AMENITIES_GROUPS.map(g => (
            <div key={g.label}>
              <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-wide">{g.label}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${amenities.includes(a) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 80 }} />
      <button onClick={onNext}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}