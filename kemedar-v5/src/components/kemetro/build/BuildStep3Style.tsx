// @ts-nocheck
export default function BuildStep3Style({ form, update }) {
  const LEVELS = [
    { id: "economy", label: "💰 Economy", desc: "Budget-friendly materials, functional finish" },
    { id: "standard", label: "⭐ Standard", desc: "Good quality, most popular choice" },
    { id: "premium", label: "💎 Premium", desc: "High-end materials and finishes" },
  ];

  const FLOORING = [
    { id: "ceramic_tiles", label: "Ceramic Tiles" },
    { id: "porcelain_tiles", label: "Porcelain Tiles" },
    { id: "marble", label: "Marble" },
    { id: "engineered_wood", label: "Engineered Wood" },
    { id: "vinyl", label: "Vinyl / SPC" },
  ];

  const WALL = [
    { id: "paint_only", label: "Paint Only" },
    { id: "paint_with_tiles_wet_areas", label: "Paint + Tiles (Wet Areas)" },
    { id: "wallpaper_accent", label: "Wallpaper Accent" },
    { id: "full_tiles", label: "Full Wall Tiles" },
  ];

  const KITCHEN = [
    { id: "standard_ready_made", label: "Standard Ready-Made" },
    { id: "semi_custom", label: "Semi-Custom" },
    { id: "fully_custom", label: "Fully Custom" },
  ];

  const BATHROOM = [
    { id: "standard_branded", label: "Standard Branded" },
    { id: "premium_branded", label: "Premium Branded" },
    { id: "luxury", label: "Luxury" },
  ];

  const updatePref = (key, val) => update({ finishingPreferences: { ...form.finishingPreferences, [key]: val } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Style & Preferences</h2>
        <p className="text-gray-500 text-sm">Choose your finishing level and material preferences.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Finishing Level</label>
        <div className="space-y-2">
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => update({ finishingLevel: l.id })}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.finishingLevel === l.id ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-teal-300"}`}>
              <p className="font-bold text-gray-900 text-sm">{l.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Flooring Material</label>
        <div className="flex flex-wrap gap-2">
          {FLOORING.map(f => (
            <button key={f.id} onClick={() => updatePref("flooringMaterial", f.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.finishingPreferences?.flooringMaterial === f.id ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Wall Finish</label>
        <div className="flex flex-wrap gap-2">
          {WALL.map(w => (
            <button key={w.id} onClick={() => updatePref("wallFinish", w.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.finishingPreferences?.wallFinish === w.id ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Kitchen Style</label>
        <div className="flex flex-wrap gap-2">
          {KITCHEN.map(k => (
            <button key={k.id} onClick={() => updatePref("kitchenStyle", k.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.finishingPreferences?.kitchenStyle === k.id ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Bathroom Style</label>
        <div className="flex flex-wrap gap-2">
          {BATHROOM.map(b => (
            <button key={b.id} onClick={() => updatePref("bathroomStyle", b.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${form.finishingPreferences?.bathroomStyle === b.id ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-700 hover:border-teal-300"}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {[
          { key: "includeLabor", label: "Include labor cost estimates", desc: "Add estimated contractor rates to BOQ" },
          { key: "includeContingency", label: "Include 10% contingency buffer", desc: "Recommended for unexpected costs" },
        ].map(o => (
          <label key={o.key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={!!form[o.key]} onChange={e => update({ [o.key]: e.target.checked })} className="accent-teal-500 mt-0.5 w-4 h-4" />
            <div>
              <p className="font-bold text-gray-800 text-sm">{o.label}</p>
              <p className="text-xs text-gray-500">{o.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}