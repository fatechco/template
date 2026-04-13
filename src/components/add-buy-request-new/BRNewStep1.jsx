import { Minus, Plus } from "lucide-react";

const CATEGORIES = [
  { id: "apartment", emoji: "🏢", label: "Apartment" },
  { id: "villa", emoji: "🏡", label: "Villa" },
  { id: "office", emoji: "🏛", label: "Office" },
  { id: "shop", emoji: "🛍", label: "Shop" },
  { id: "land", emoji: "🌍", label: "Land" },
  { id: "warehouse", emoji: "🏭", label: "Warehouse" },
  { id: "chalet", emoji: "🏖", label: "Chalet" },
  { id: "building", emoji: "🏗", label: "Building" },
  { id: "farm", emoji: "🌾", label: "Farm" },
];

const PURPOSES = ["For Sale", "For Rent", "Either"];
const UNITS = ["SqM", "SqFt", "Feddan"];

function Stepper({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-bold w-6 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center"
        >
          <Plus size={14} color="white" />
        </button>
      </div>
    </div>
  );
}

export default function BRNewStep1({ form, update }) {
  const toggleCat = (id) => {
    const ids = form.category_ids.includes(id)
      ? form.category_ids.filter((c) => c !== id)
      : [...form.category_ids, id];
    update({ category_ids: ids });
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <p className="font-black text-gray-900 text-base mb-3">What are you looking for?</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const selected = form.category_ids.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCat(cat.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 transition-all ${
                  selected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <span className={`text-xs font-bold ${selected ? "text-orange-600" : "text-gray-600"}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <p className="font-bold text-gray-800 text-sm mb-2">Purpose</p>
        <div className="flex gap-2">
          {PURPOSES.map((p) => (
            <button
              key={p}
              onClick={() => update({ purpose: p })}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                form.purpose === p
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <p className="font-bold text-gray-800 text-sm mb-2">Budget (optional)</p>
        <div className="flex gap-2 items-center">
          <select
            value={form.currency_id}
            onChange={(e) => update({ currency_id: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 bg-white w-24"
          >
            {["USD", "EGP", "AED", "SAR", "EUR"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min"
            value={form.budget_min}
            onChange={(e) => update({ budget_min: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={form.budget_max}
            onChange={(e) => update({ budget_max: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Preferences */}
      <div>
        <p className="font-bold text-gray-800 text-sm mb-1">Preferences (optional)</p>
        <div className="bg-gray-50 rounded-2xl px-4">
          <Stepper label="Bedrooms" value={form.beds} onChange={(v) => update({ beds: v })} />
          <Stepper label="Bathrooms" value={form.baths} onChange={(v) => update({ baths: v })} />
          <Stepper label="Rooms" value={form.rooms} onChange={(v) => update({ rooms: v })} />
          <div className="flex items-center gap-2 py-3">
            <span className="text-sm font-medium text-gray-700 flex-1">Size</span>
            <input
              type="number"
              placeholder="0"
              value={form.area_size}
              onChange={(e) => update({ area_size: e.target.value })}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:border-orange-400"
            />
            <select
              value={form.area_unit}
              onChange={(e) => update({ area_unit: e.target.value })}
              className="border border-gray-200 rounded-xl px-2 py-2 text-sm bg-white"
            >
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}