import { QuestionCard, Stepper, PillOption, OptionCard } from "../AdvisorOptionCard";

const PET_OPTIONS = [
  { value: "none", icon: "🚫", label: "No pets" },
  { value: "cat", icon: "🐱", label: "Yes — Cat(s)" },
  { value: "dog", icon: "🐕", label: "Yes — Dog(s)" },
  { value: "other", icon: "🐾", label: "Yes — Other pets" },
  { value: "planning", icon: "🐶", label: "Planning to get a pet" },
];

const ACCESS_OPTIONS = [
  { value: "none", label: "✅ No special needs" },
  { value: "wheelchair", label: "♿ Wheelchair accessibility" },
  { value: "limited_mobility", label: "🦽 Limited mobility" },
  { value: "vision", label: "👁️ Vision impairment" },
  { value: "hearing", label: "👂 Hearing impairment" },
  { value: "respiratory", label: "🫁 Respiratory / fresh air" },
  { value: "quiet", label: "🧠 Quiet environment" },
];

const WFH_OPTIONS = [
  { value: "no", label: "🏢 Go to work daily" },
  { value: "yes", label: "🏠 Full-time remote" },
  { value: "hybrid", label: "🔄 Hybrid" },
  { value: "multiple", label: "👥 Multiple members WFH" },
];

const CAR_OPTIONS = [
  { value: "one", icon: "🚗", label: "Yes — 1 car" },
  { value: "multiple", icon: "🚗", label: "2+ cars" },
  { value: "public_transport", icon: "🚇", label: "Public transport" },
  { value: "alternative", icon: "🚲", label: "Bike / Walk" },
];

export default function Step4Household({ answers, onChange }) {
  const {
    householdCount = 2, householdComposition = { infants: 0, youngChildren: 0, teenagers: 0, adults: 2, seniors: 0 },
    hasPets, accessibilityNeeds = [], worksFromHome, carOwnership
  } = answers;

  const comp = { infants: 0, youngChildren: 0, teenagers: 0, adults: 2, seniors: 0, ...householdComposition };
  const compTotal = Object.values(comp).reduce((a, b) => a + b, 0);

  const updateComp = (key, val) => {
    const updated = { ...comp, [key]: Math.max(0, val) };
    onChange({ householdComposition: updated });
  };

  const toggleAccess = (val) => {
    if (val === "none") { onChange({ accessibilityNeeds: ["none"] }); return; }
    const cur = accessibilityNeeds.filter(v => v !== "none");
    onChange({ accessibilityNeeds: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] });
  };

  const COMP_ROWS = [
    { key: "infants", icon: "👶", label: "Infants (0–3 years)" },
    { key: "youngChildren", icon: "🧒", label: "Young Children (4–10)" },
    { key: "teenagers", icon: "🧑", label: "Teenagers (11–17)" },
    { key: "adults", icon: "👨", label: "Adults (18–59)" },
    { key: "seniors", icon: "👴", label: "Seniors (60+)" },
  ];

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Tell us about who will use this property</h2>
        <p className="text-gray-500 text-sm">No names needed — just the basics to match the right size and features</p>
      </div>

      <QuestionCard number="1" question="How many people will live here?">
        <div className="flex justify-center py-4">
          <Stepper value={householdCount} onChange={v => onChange({ householdCount: v })} min={1} max={15} label="people total" />
        </div>
      </QuestionCard>

      <QuestionCard number="2" question="Household Composition" subtitle="How many of each age group?">
        <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
          {COMP_ROWS.map((row, i) => (
            <div key={row.key} className={`flex items-center justify-between px-4 py-3 ${i < 4 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{row.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{row.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateComp(row.key, comp[row.key] - 1)}
                  className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 font-black text-lg flex items-center justify-center hover:bg-orange-50">−</button>
                <span className="w-6 text-center font-black text-gray-900">{comp[row.key]}</span>
                <button onClick={() => updateComp(row.key, comp[row.key] + 1)}
                  className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 font-black text-lg flex items-center justify-center hover:bg-orange-50">+</button>
              </div>
            </div>
          ))}
        </div>
        {Math.abs(compTotal - householdCount) > 0 && compTotal > 0 && (
          <p className="text-xs text-orange-500 mt-2 font-semibold">⚠️ Total is {compTotal}, you said {householdCount} people — please adjust</p>
        )}
        {comp.infants > 0 && <p className="text-xs text-blue-600 mt-2">💡 Safe balconies and ground/low floors will be prioritized</p>}
        {comp.seniors > 0 && <p className="text-xs text-blue-600 mt-2">💡 Elevator access and nearby medical facilities will be boosted</p>}
        {comp.youngChildren > 0 && <p className="text-xs text-blue-600 mt-2">💡 School proximity questions coming up in Step 6</p>}
      </QuestionCard>

      <QuestionCard number="3" question="Do you have pets?">
        <div className="flex flex-wrap gap-2">
          {PET_OPTIONS.map(o => (
            <PillOption key={o.value} label={`${o.icon} ${o.label}`} selected={hasPets === o.value}
              onClick={() => onChange({ hasPets: o.value })} />
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number="4" question="Special Accessibility Needs?" subtitle="Select all that apply">
        <div className="grid grid-cols-1 gap-2">
          {ACCESS_OPTIONS.map(o => (
            <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${accessibilityNeeds.includes(o.value) ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="checkbox" checked={accessibilityNeeds.includes(o.value)} onChange={() => toggleAccess(o.value)} className="accent-orange-500" />
              <span className="text-sm font-semibold text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
        {accessibilityNeeds.includes("wheelchair") && (
          <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            🤖 AI will filter to buildings with ramp access, wide elevators, ground floor units
          </div>
        )}
      </QuestionCard>

      <QuestionCard number="5" question="Do you work from home?">
        <div className="flex flex-wrap gap-2">
          {WFH_OPTIONS.map(o => (
            <PillOption key={o.value} label={o.label} selected={worksFromHome === o.value}
              onClick={() => onChange({ worksFromHome: o.value })} />
          ))}
        </div>
      </QuestionCard>

      <QuestionCard number="6" question="Do you own a car?">
        <div className="grid grid-cols-2 gap-3">
          {CAR_OPTIONS.map(o => (
            <OptionCard key={o.value} icon={o.icon} label={o.label}
              selected={carOwnership === o.value} onClick={() => onChange({ carOwnership: o.value })} />
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}