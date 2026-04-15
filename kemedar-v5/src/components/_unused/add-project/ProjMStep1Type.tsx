// @ts-nocheck
const PROJ_CATEGORIES = [
  { icon: "🏙", label: "Residential Compound" }, { icon: "🏡", label: "Villas Compound" },
  { icon: "🏢", label: "Apartment Tower" }, { icon: "🏖", label: "Resort / Chalet" },
  { icon: "🏪", label: "Commercial Center" }, { icon: "🏬", label: "Mixed Use" },
  { icon: "🏭", label: "Industrial" }, { icon: "🏥", label: "Medical Complex" },
  { icon: "🎓", label: "Educational" }, { icon: "🏨", label: "Hotel" },
];

const SUITABLE = ["Residential", "Commercial", "Administrative", "Tourism", "Industrial", "Medical"];
const PURPOSES = [
  { key: "sale", icon: "🏷", label: "For Sale" },
  { key: "rent", icon: "🔑", label: "For Rent" },
  { key: "both", icon: "🔑🏷", label: "Sale & Rent" },
];

export default function ProjMStep1Type({ form, update, onNext, canProceed }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">What type of project?</h2>
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {PROJ_CATEGORIES.map(cat => (
          <button key={cat.label} onClick={() => update({ category: cat.label })}
            className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${form.category === cat.label ? "bg-orange-600 border-orange-600" : "bg-white border-gray-200"}`}
            style={{ minHeight: 80 }}>
            <span className="text-3xl">{cat.icon}</span>
            <span className={`text-[11px] font-bold mt-1.5 text-center leading-tight ${form.category === cat.label ? "text-white" : "text-gray-600"}`}>{cat.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-black text-gray-700 mb-2">Suitable for:</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {SUITABLE.map(s => (
          <button key={s} onClick={() => {
            const cur = form.suitable_for || [];
            update({ suitable_for: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
          }}
            className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${(form.suitable_for || []).includes(s) ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <p className="text-sm font-black text-gray-700 mb-2">Purpose:</p>
      <div className="space-y-2 mb-6">
        {PURPOSES.map(p => (
          <button key={p.key} onClick={() => update({ purpose: p.key })}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border-2 ${form.purpose === p.key ? "border-orange-600 bg-orange-50" : "border-gray-200"}`}>
            <span className="text-xl">{p.icon}</span>
            <span className={`text-base font-black ${form.purpose === p.key ? "text-orange-600" : "text-gray-800"}`}>{p.label}</span>
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