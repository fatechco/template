const CATEGORIES = [
  "Building Materials", "Furniture", "Lighting", "Electrical",
  "Plumbing", "HVAC", "Flooring", "Paint & Coating",
  "Hardware & Tools", "Sanitary Ware", "Glass & Aluminum", "Other",
];

const SUBCATS = {
  "Building Materials": ["Cement", "Steel", "Bricks", "Sand", "Gravel"],
  "Furniture": ["Sofas", "Tables", "Chairs", "Beds", "Wardrobes"],
  "Lighting": ["Indoor Lights", "Outdoor Lights", "LED Panels", "Chandeliers"],
  "Electrical": ["Cables & Wires", "Switches", "Panels", "Outlets"],
  "Plumbing": ["Pipes", "Fittings", "Valves", "Pumps"],
};

const UNITS = ["pieces", "sqm", "kg", "ton", "meter", "liter", "box", "roll", "set"];
const CURRENCIES = ["USD", "EGP", "AED", "SAR", "EUR"];

export default function RFQStep1({ form, update }) {
  const subcats = SUBCATS[form.category] || [];

  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">What product do you need?</p>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Category <span className="text-red-500">*</span></label>
        <select
          value={form.category}
          onChange={(e) => update({ category: e.target.value, subcategory: "" })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {subcats.length > 0 && (
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Subcategory</label>
          <select
            value={form.subcategory}
            onChange={(e) => update({ subcategory: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
          >
            <option value="">Select subcategory</option>
            {subcats.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Product Description <span className="text-red-500">*</span></label>
        <textarea
          rows={4}
          placeholder="Describe exactly what you need, including specifications, quality, standards, etc."
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Quantity <span className="text-red-500">*</span></label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0"
            value={form.quantity}
            onChange={(e) => update({ quantity: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
          <select
            value={form.unit}
            onChange={(e) => update({ unit: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400 w-28"
          >
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Budget (optional)</label>
        <div className="flex gap-2">
          <select
            value={form.currency_id}
            onChange={(e) => update({ currency_id: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white w-24"
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="Max budget"
            value={form.budget}
            onChange={(e) => update({ budget: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Delivery Location</label>
        <input
          type="text"
          placeholder="City / Address"
          value={form.delivery_city}
          onChange={(e) => update({ delivery_city: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>
    </div>
  );
}