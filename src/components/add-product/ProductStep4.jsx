const CITIES = [
  "Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Hurghada",
  "Mansoura", "Tanta", "Assiut", "Luxor", "Aswan",
];

export default function ProductStep4({ form, update }) {
  const toggleCity = (city) => {
    const arr = form.shipping_zones.includes(city)
      ? form.shipping_zones.filter((c) => c !== city)
      : [...form.shipping_zones, city];
    update({ shipping_zones: arr });
  };

  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">Shipping & Publishing</p>

      {/* Weight */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="0"
            value={form.weight}
            onChange={(e) => update({ weight: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
          <select
            value={form.weight_unit}
            onChange={(e) => update({ weight_unit: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white w-20"
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
          </select>
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Dimensions (cm, optional)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="L"
            value={form.dim_l}
            onChange={(e) => update({ dim_l: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-orange-400"
          />
          <span className="text-gray-400">×</span>
          <input
            type="number"
            placeholder="W"
            value={form.dim_w}
            onChange={(e) => update({ dim_w: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-orange-400"
          />
          <span className="text-gray-400">×</span>
          <input
            type="number"
            placeholder="H"
            value={form.dim_h}
            onChange={(e) => update({ dim_h: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm text-center focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Shipping zones */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Shipping Zones {form.shipping_zones.length > 0 && <span className="text-orange-600">({form.shipping_zones.length})</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => {
            const sel = form.shipping_zones.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  sel ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
                }`}
              >
                {sel ? "✓ " : ""}{city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Free shipping toggle */}
      <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">Free Shipping</p>
          <p className="text-xs text-gray-400">Offer free delivery to buyers</p>
        </div>
        <button
          onClick={() => update({ free_shipping: !form.free_shipping })}
          className={`w-12 h-6 rounded-full transition-colors relative ${form.free_shipping ? "bg-orange-600" : "bg-gray-200"}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.free_shipping ? "left-7" : "left-1"}`} />
        </button>
      </div>

      {!form.free_shipping && (
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Shipping Cost</label>
          <input
            type="number"
            placeholder="Cost per order"
            value={form.shipping_cost}
            onChange={(e) => update({ shipping_cost: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      )}

      <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 font-medium">
        📋 Your product will be reviewed by our team within 24 hours before going live.
      </div>
    </div>
  );
}