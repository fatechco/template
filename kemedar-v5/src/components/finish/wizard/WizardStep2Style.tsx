// @ts-nocheck
const STYLES = [
  { id: "modern", icon: "🏙️", label: "Modern", desc: "Clean lines, minimal, contemporary", color: "#1a1a2e" },
  { id: "classic", icon: "🏛️", label: "Classic", desc: "Timeless, ornate, traditional", color: "#8B7355" },
  { id: "scandinavian", icon: "🌿", label: "Scandinavian", desc: "Light, natural, cozy", color: "#C8D8C8" },
  { id: "luxury", icon: "💎", label: "Luxury", desc: "Premium materials, statement pieces", color: "#2D2D2D" },
  { id: "industrial", icon: "🏭", label: "Industrial", desc: "Raw, urban, exposed", color: "#555" },
  { id: "custom", icon: "🎨", label: "Custom", desc: "I'll describe my vision", color: "#6C63FF" },
];

const LEVELS = [
  { id: "economy", icon: "💰", label: "Economy", range: "1,500 – 3,000 EGP/m²", desc: "Good quality local materials", pct: 35 },
  { id: "standard", icon: "⭐", label: "Standard", range: "3,000 – 5,500 EGP/m²", desc: "Mix of local and imported", pct: 60, popular: true },
  { id: "premium", icon: "⭐⭐", label: "Premium", range: "5,500 – 9,000 EGP/m²", desc: "Mostly imported materials", pct: 80 },
  { id: "luxury", icon: "💎", label: "Luxury", range: "9,000+ EGP/m²", desc: "All premium, bespoke", pct: 100 },
];

export default function WizardStep2Style({ form, update }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Choose your style</h2>
      <p className="text-gray-500 text-sm mb-6">Select a design direction and finishing quality level</p>

      {/* Style Gallery */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="font-bold text-gray-900 mb-3 text-sm">Design Style</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button
              key={s.id}
              onClick={() => update({ designStyle: s.id })}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${form.designStyle === s.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
            >
              {form.designStyle === s.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
              )}
              <span className="text-3xl block mb-2">{s.icon}</span>
              <p className="font-bold text-gray-900 text-sm">{s.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Finishing Level */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="font-bold text-gray-900 mb-3 text-sm">Finishing Level</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {LEVELS.map(lv => (
            <button
              key={lv.id}
              onClick={() => update({ finishingLevel: lv.id })}
              className={`flex-1 relative p-4 rounded-xl border-2 text-left transition-all ${form.finishingLevel === lv.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
            >
              {lv.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">MOST POPULAR</div>
              )}
              <span className="text-xl block mb-2">{lv.icon}</span>
              <p className="font-black text-gray-900 text-xs">{lv.label}</p>
              <p className="text-[10px] text-orange-600 font-bold mt-0.5">{lv.range}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{lv.desc}</p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${lv.pct}%` }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color hint */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <p className="font-bold text-orange-800 text-sm mb-1">🎨 Color Palette</p>
        <p className="text-xs text-orange-700">AI will suggest a color palette based on your style selection. You can customize it later in the project dashboard.</p>
      </div>
    </div>
  );
}