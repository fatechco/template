"use client";
// @ts-nocheck
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FURNISHED = ["Not Furnished", "Semi", "Fully", "Luxury"];
const FINISHING = ["Half Finishing", "Complete", "High Luxe", "Raw"];
const CONDITIONS = ["New", "Old", "Off-Plan", "Under Construction"];

const AMENITIES_GROUPS = [
  { label: "Recreation", items: ["Gym", "Swimming Pool", "Children's Play Area", "Club House", "Sports Court"] },
  { label: "Utilities", items: ["Parking", "Generator", "Water Storage", "Solar Power", "Elevator"] },
  { label: "Security", items: ["24hr Security", "CCTV", "Gated Community", "Smart Lock"] },
  { label: "Lifestyle", items: ["Garden", "Concierge", "Smart Home", "Mosque", "Commercial Area"] },
  { label: "Nearby", items: ["School Nearby", "Hospital Nearby", "Metro Station", "Mall Nearby"] },
];

function Stepper({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <p className="text-sm font-bold text-gray-700">{label}</p>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-9 h-9 bg-gray-100 rounded-xl text-gray-700 font-black text-xl flex items-center justify-center">−</button>
        <span className="font-black text-gray-900 text-lg w-6 text-center">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-9 h-9 bg-orange-600 rounded-xl text-white font-black text-xl flex items-center justify-center">+</button>
      </div>
    </div>
  );
}

function ChipGroup({ label, options, value, onSelect }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-black text-gray-700 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} onClick={() => onSelect(o)}
            className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${value === o ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropStep5Details({ form, update, onNext }) {
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenities = form.amenities || [];
  const toggleAmenity = (a) => update({ amenities: amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a] });
  const isResidential = ["Apartment", "House", "Villa", "Condo", "Chalet", "Twinhouse", "Townhouse", "Duplex", "Penthouse"].includes(form.category);

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Property Details</h2>

      <ChipGroup label="Furnished" options={FURNISHED} value={form.furnished} onSelect={v => update({ furnished: v })} />
      <ChipGroup label="Finishing" options={FINISHING} value={form.finishing} onSelect={v => update({ finishing: v })} />
      <ChipGroup label="Condition" options={CONDITIONS} value={form.condition} onSelect={v => update({ condition: v })} />

      {form.condition === "Off-Plan" && (
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-700 mb-1.5">Delivery Date</p>
          <input type="date" value={form.delivery_date || ""} onChange={e => update({ delivery_date: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
        </div>
      )}

      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Year Built <span className="text-gray-400 font-normal">(optional)</span></p>
        <input type="number" value={form.year_built || ""} onChange={e => update({ year_built: e.target.value })}
          placeholder="e.g. 2020" className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
      </div>

      {isResidential && (
        <div className="bg-gray-50 rounded-2xl px-4 py-2 mb-5">
          <Stepper label="Bedrooms" value={form.beds || 0} onChange={v => update({ beds: v })} />
          <Stepper label="Bathrooms" value={form.baths || 0} onChange={v => update({ baths: v })} />
          <Stepper label="Receptions" value={form.receptions || 0} onChange={v => update({ receptions: v })} />
          <Stepper label="Floor Number" value={form.floor || 0} onChange={v => update({ floor: v })} />
          <div className="flex items-center justify-between py-3">
            <p className="text-sm font-bold text-gray-700">Total Floors in Building</p>
            <input type="number" value={form.total_floors || ""} onChange={e => update({ total_floors: e.target.value })}
              className="w-20 border border-gray-200 rounded-xl text-center py-2 font-bold outline-none focus:border-orange-400" />
          </div>
        </div>
      )}

      {/* Amenities */}
      <button onClick={() => setAmenitiesOpen(o => !o)}
        className="w-full flex items-center justify-between bg-orange-50 border-2 border-orange-200 rounded-2xl px-4 py-4 mb-2">
        <div className="text-left">
          <p className="font-black text-orange-700 text-sm">✅ Add Amenities</p>
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