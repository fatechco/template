import { QuestionCard, OptionCard, PillOption } from "../AdvisorOptionCard";

const PURPOSE_OPTIONS = [
  { value: "buy", icon: "🏠", label: "I want to Buy a property", sublabel: "Purchase ownership of a home, apartment, or investment unit" },
  { value: "rent", icon: "🔑", label: "I want to Rent a property", sublabel: "Find a place to live on a monthly or yearly lease" },
  { value: "invest", icon: "📈", label: "I want to Invest in real estate", sublabel: "Purchase for income or capital growth" },
];

const FIRST_TIME_BUY = [
  { value: "yes", label: "Yes, first time buying" },
  { value: "no", label: "No, I've bought before" },
  { value: "renting_want_to_buy", label: "Currently renting, want to buy" },
];

const FIRST_TIME_RENT = [
  { value: "yes", label: "Yes, first time renting" },
  { value: "no", label: "No, I've rented before" },
  { value: "owning_want_to_rent", label: "I own property, want to rent elsewhere" },
];

const URGENCY = [
  { value: "immediate", icon: "🔴", label: "Very Urgent", sub: "Within 1 month" },
  { value: "soon", icon: "🟡", label: "Soon", sub: "Within 3 months" },
  { value: "planning", icon: "🟢", label: "Planning Ahead", sub: "Within 6 months" },
  { value: "exploring", icon: "🔵", label: "Just Exploring", sub: "No timeline yet" },
];

export default function Step1Intent({ answers, onChange }) {
  const { purpose, isFirstTime, urgency } = answers;

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Let's start with what you're looking for</h2>
        <p className="text-gray-500 text-sm">This helps us understand your goal so we can ask the right questions</p>
      </div>

      <QuestionCard number="1" question="What do you need?">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PURPOSE_OPTIONS.map(o => (
            <OptionCard key={o.value} icon={o.icon} label={o.label} sublabel={o.sublabel}
              selected={purpose === o.value} onClick={() => onChange({ purpose: o.value, isFirstTime: null })} />
          ))}
        </div>
      </QuestionCard>

      {purpose && purpose !== "invest" && (
        <QuestionCard number="2" question="Is this your first time?">
          <div className="flex flex-wrap gap-2">
            {(purpose === "buy" ? FIRST_TIME_BUY : FIRST_TIME_RENT).map(o => (
              <PillOption key={o.value} label={o.label} selected={isFirstTime === o.value}
                onClick={() => onChange({ isFirstTime: o.value })} />
            ))}
          </div>
          {isFirstTime === "yes" && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              ℹ️ First-time {purpose === "buy" ? "buyers" : "renters"} get extra guidance tips in their report
            </div>
          )}
        </QuestionCard>
      )}

      <QuestionCard number={purpose && purpose !== "invest" ? "3" : "2"} question="How urgent is your need?">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {URGENCY.map(o => (
            <button key={o.value} onClick={() => onChange({ urgency: o.value })}
              className={`border-2 rounded-2xl p-4 text-center transition-all hover:border-orange-400 hover:bg-orange-50 ${urgency === o.value ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"}`}>
              <p className="text-2xl mb-1">{o.icon}</p>
              <p className="font-bold text-sm text-gray-900">{o.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{o.sub}</p>
            </button>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}