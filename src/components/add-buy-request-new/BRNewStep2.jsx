const COUNTRIES = ["Egypt", "UAE", "Saudi Arabia", "Jordan", "Kuwait", "Qatar", "Bahrain", "Oman"];

export default function BRNewStep2({ form, update }) {
  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">Where are you looking?</p>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Country</label>
        <select
          value={form.country_id}
          onChange={(e) => update({ country_id: e.target.value, province_id: "", city_id: "" })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white focus:outline-none focus:border-orange-400"
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Province / State</label>
        <input
          type="text"
          placeholder="e.g. Cairo Governorate"
          value={form.province_id}
          onChange={(e) => update({ province_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">City</label>
        <input
          type="text"
          placeholder="e.g. New Cairo"
          value={form.city_id}
          onChange={(e) => update({ city_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">District (optional)</label>
        <input
          type="text"
          placeholder="e.g. 5th Settlement"
          value={form.district_id}
          onChange={(e) => update({ district_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Area / Neighborhood (optional)</label>
        <input
          type="text"
          placeholder="e.g. Rehab City"
          value={form.area_id}
          onChange={(e) => update({ area_id: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Address (optional)</label>
        <input
          type="text"
          placeholder="Street address"
          value={form.address}
          onChange={(e) => update({ address: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Landmark (optional)</label>
        <input
          type="text"
          placeholder="e.g. Near Carrefour"
          value={form.landmark}
          onChange={(e) => update({ landmark: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>
    </div>
  );
}