// @ts-nocheck
import { QuestionCard, OptionCard, PillOption } from "../AdvisorOptionCard";

const TYPE_OPTIONS = {
  residential: [
    { value: "apartment", icon: "🏢", label: "Apartment" },
    { value: "villa", icon: "🏡", label: "Villa / House" },
    { value: "townhouse", icon: "🏘️", label: "Townhouse / Duplex" },
    { value: "studio", icon: "🛏️", label: "Studio" },
    { value: "off_plan", icon: "🏗️", label: "Off-Plan / Under Construction", buyOnly: true },
    { value: "land", icon: "🌍", label: "Land / Plot", buyOnly: true },
  ],
  invest: [
    { value: "residential_invest", icon: "🏢", label: "Residential Unit (to rent out)" },
    { value: "commercial", icon: "🏪", label: "Commercial Unit" },
    { value: "off_plan", icon: "🏗️", label: "Under Construction / Off-Plan" },
    { value: "land", icon: "🌍", label: "Land / Plot" },
    { value: "hotel_unit", icon: "🏨", label: "Hotel Unit / Serviced Apartment" },
  ],
};

const FURNISHING = [
  { value: "fully_furnished", icon: "🪑", label: "Fully Furnished" },
  { value: "semi_furnished", icon: "🛋️", label: "Semi-Furnished" },
  { value: "unfurnished", icon: "📦", label: "Unfurnished" },
  { value: "no_preference", icon: "💭", label: "No Preference" },
];

export default function Step2Type({ answers, onChange }) {
  const { purpose, propertyTypes = [], furnishingPreference } = answers;
  const isInvest = purpose === "invest";
  const isRent = purpose === "rent";

  const availableTypes = isInvest ? TYPE_OPTIONS.invest :
    TYPE_OPTIONS.residential.filter(t => !isRent || !t.buyOnly);

  const toggleType = (val) => {
    const current = propertyTypes || [];
    onChange({ propertyTypes: current.includes(val) ? current.filter(v => v !== val) : [...current, val] });
  };

  const landOnly = propertyTypes.length > 0 && propertyTypes.every(t => t === "land");

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">What type of property are you looking for?</h2>
        <p className="text-gray-500 text-sm">Select all that you'd consider</p>
      </div>

      <QuestionCard number="1" question="Property Type" subtitle="Select all that apply">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableTypes.map(o => {
            const selected = propertyTypes.includes(o.value);
            return (
              <button key={o.value} onClick={() => toggleType(o.value)}
                className={`relative border-2 rounded-2xl p-4 text-left transition-all hover:border-orange-400 hover:bg-orange-50 ${selected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"}`}>
                {selected && <span className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full text-white text-[10px] flex items-center justify-center">✓</span>}
                <p className="text-2xl mb-1">{o.icon}</p>
                <p className="font-bold text-sm text-gray-900">{o.label}</p>
              </button>
            );
          })}
        </div>
        {propertyTypes.length > 1 && <p className="text-xs text-gray-400 mt-2">{propertyTypes.length} types selected</p>}
      </QuestionCard>

      {!landOnly && propertyTypes.length > 0 && (
        <QuestionCard number="2" question="Furnishing Preference">
          <div className="flex flex-wrap gap-2">
            {FURNISHING.map(f => (
              <PillOption key={f.value} label={`${f.icon} ${f.label}`} selected={furnishingPreference === f.value}
                onClick={() => onChange({ furnishingPreference: f.value })} />
            ))}
          </div>
        </QuestionCard>
      )}
    </div>
  );
}