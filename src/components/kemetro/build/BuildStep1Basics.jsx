export default function BuildStep1Basics({ form, update }) {
  const PROJECT_TYPES = [
    { id: "apartment_finishing", label: "🏠 Apartment Finishing" },
    { id: "villa_finishing", label: "🏡 Villa Finishing" },
    { id: "office_fitting", label: "🏢 Office Fitting" },
    { id: "retail_fitout", label: "🏪 Retail Fit-out" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Project Basics</h2>
        <p className="text-gray-500 text-sm">Tell us about your project so we can generate an accurate BOQ.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Name <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. My New Apartment – New Cairo"
          value={form.projectName}
          onChange={e => update({ projectName: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Project Type</label>
        <div className="grid grid-cols-2 gap-3">
          {PROJECT_TYPES.map(t => (
            <button key={t.id} onClick={() => update({ projectType: t.id })}
              className={`py-3 px-4 rounded-xl border-2 text-sm font-bold text-left transition-all ${form.projectType === t.id ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Total Area (m²)</label>
        <input
          type="number" min={30} max={2000}
          value={form.totalAreaSqm}
          onChange={e => update({ totalAreaSqm: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Bedrooms", key: "numberOfRooms", min: 1, max: 10 },
          { label: "Bathrooms", key: "numberOfBathrooms", min: 1, max: 8 },
          { label: "Living Rooms", key: "numberOfLivingRooms", min: 1, max: 4 },
          { label: "Kitchens", key: "numberOfKitchens", min: 1, max: 3 },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
            <input
              type="number" min={f.min} max={f.max}
              value={form[f.key]}
              onChange={e => update({ [f.key]: Number(e.target.value) })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">Floor Number</label>
        <input
          type="number" min={0} max={50}
          value={form.floorNumber}
          onChange={e => update({ floorNumber: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        <p className="text-xs text-gray-400 mt-1">Used to estimate material transport costs</p>
      </div>
    </div>
  );
}