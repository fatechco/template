// @ts-nocheck
import { QuestionCard } from "../AdvisorOptionCard";

const MUST_HAVES = [
  { value: "elevator", label: "🛗 Elevator" },
  { value: "parking", label: "🅿️ Dedicated parking" },
  { value: "security", label: "🛡️ 24/7 Security" },
  { value: "pool", label: "🏊 Swimming pool" },
  { value: "gym", label: "🏋️ Gym in building" },
  { value: "garden", label: "🌳 Garden / Outdoor space" },
  { value: "balcony", label: "☀️ Balcony / Terrace" },
  { value: "laundry", label: "🧺 Laundry room" },
  { value: "separate_kitchen", label: "🍳 Separate kitchen" },
  { value: "ac", label: "📡 Central AC / Heating" },
  { value: "pet_friendly", label: "🐕 Pet-friendly policy" },
  { value: "wheelchair", label: "♿ Wheelchair accessible" },
  { value: "generator", label: "🔌 Backup generator" },
  { value: "water_tank", label: "🚰 Water tank / Pump" },
  { value: "gas", label: "💧 Natural gas connection" },
  { value: "none", label: "— None — I'm flexible" },
];

const NO_GOS = [
  { value: "noisy_road", label: "🚫 On a noisy main road" },
  { value: "no_elevator_5f", label: "🚫 Above 5th floor without elevator" },
  { value: "no_security", label: "🚫 Building without security" },
  { value: "industrial", label: "🚫 Near industrial / factory area" },
  { value: "flood_prone", label: "🚫 Flood-prone area" },
  { value: "old_building", label: "🚫 Old building (15+ years)" },
  { value: "shared_commercial", label: "🚫 Shared walls with commercial" },
  { value: "no_transport", label: "🚫 No nearby public transport" },
  { value: "far_hospital", label: "🚫 Far from hospitals" },
  { value: "none", label: "— None — I'm open to everything" },
];

const WISHLIST = [
  "🧒 Kids' play area", "🏖️ Rooftop / Shared terrace", "📦 Storage room",
  "🏪 Services in building", "🚗 Covered parking", "🌿 Roof garden",
  "🏓 Sports facilities", "🎭 Community events hall", "📹 Smart security",
  "🔑 Smart home features", "🏗️ Unfinished (design myself)"
];

export default function Step8Wishes({ answers, onChange }) {
  const { mustHaveFeatures = [], noGoFeatures = [], wishlistFeatures = [], freeTextNotes = "" } = answers;

  const toggleMust = (val) => {
    if (val === "none") { onChange({ mustHaveFeatures: ["none"] }); return; }
    const cur = mustHaveFeatures.filter(v => v !== "none");
    onChange({ mustHaveFeatures: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] });
  };

  const toggleNoGo = (val) => {
    if (val === "none") { onChange({ noGoFeatures: ["none"] }); return; }
    const cur = noGoFeatures.filter(v => v !== "none");
    onChange({ noGoFeatures: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] });
  };

  const toggleWish = (val) => {
    onChange({ wishlistFeatures: wishlistFeatures.includes(val) ? wishlistFeatures.filter(v => v !== val) : [...wishlistFeatures, val] });
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Almost done! Any must-haves or absolute no-gos?</h2>
        <p className="text-gray-500 text-sm">This ensures we never suggest something that doesn't work for you</p>
      </div>

      <QuestionCard number="1" question="Must-Have Features" subtitle="I will NOT consider a property without these:">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MUST_HAVES.map(o => (
            <label key={o.value} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${mustHaveFeatures.includes(o.value) ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="checkbox" checked={mustHaveFeatures.includes(o.value)} onChange={() => toggleMust(o.value)} className="accent-orange-500" />
              <span className="text-xs font-semibold text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number="2" question="Absolute No-Gos" subtitle="I do NOT want a property that is:">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {NO_GOS.map(o => (
            <label key={o.value} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${noGoFeatures.includes(o.value) ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-200"}`}>
              <input type="checkbox" checked={noGoFeatures.includes(o.value)} onChange={() => toggleNoGo(o.value)} className="accent-red-500" />
              <span className="text-xs font-semibold text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number="3" question="Nice-to-Have Wishlist" subtitle="It would be great if the property also had:">
        <div className="flex flex-wrap gap-2">
          {WISHLIST.map(w => (
            <button key={w} onClick={() => toggleWish(w)}
              className={`px-3 py-2 rounded-full border-2 text-xs font-bold transition-all ${wishlistFeatures.includes(w) ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-700 hover:border-orange-300"}`}>
              {wishlistFeatures.includes(w) ? "✓ " : ""}{w}
            </button>
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number="4" question="Anything else?" optional>
        <textarea value={freeTextNotes} onChange={e => onChange({ freeTextNotes: e.target.value.slice(0, 500) })}
          rows={4} placeholder="Special requirements, cultural preferences, specific concerns, location restrictions, or anything else that matters to you..."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
        <p className="text-xs text-gray-400 text-right mt-1">{freeTextNotes.length}/500</p>
      </QuestionCard>
    </div>
  );
}