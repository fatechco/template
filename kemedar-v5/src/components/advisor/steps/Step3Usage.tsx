// @ts-nocheck
import { QuestionCard, OptionCard } from "../AdvisorOptionCard";

const RESIDENTIAL_USES = [
  { value: "family_living", icon: "👨‍👩‍👧‍👦", label: "Family Living", sub: "Main home for a family" },
  { value: "solo_living", icon: "👤", label: "Single / Solo Living", sub: "Living alone or with partner" },
  { value: "retirement", icon: "👴", label: "Retirement / Senior Living", sub: "Peaceful, accessible home" },
  { value: "student", icon: "🎓", label: "Student Housing", sub: "Near university or college" },
  { value: "work_relocation", icon: "👔", label: "Work Relocation", sub: "Temporary, work-related move" },
  { value: "vacation", icon: "🏖️", label: "Vacation / Seasonal Home", sub: "Weekend or holiday use" },
];

const COMMERCIAL_USES = [
  { value: "medical_clinic", icon: "🏥", label: "Medical Clinic / Practice" },
  { value: "office", icon: "📋", label: "Office / Business Space" },
  { value: "retail", icon: "🏪", label: "Retail / Shop" },
  { value: "restaurant", icon: "🍽️", label: "Restaurant / Café" },
  { value: "warehouse", icon: "🏭", label: "Warehouse / Storage" },
  { value: "educational", icon: "📚", label: "Educational / Training Center" },
];

const INVEST_USES = [
  { value: "rental_income", icon: "💰", label: "Rental Income", sub: "Long-term tenant" },
  { value: "flip_resale", icon: "🔄", label: "Flip / Resale", sub: "Buy low, sell high" },
  { value: "development", icon: "🏗️", label: "Development", sub: "Build and sell" },
  { value: "capital_appreciation", icon: "📈", label: "Capital Appreciation", sub: "Hold and grow" },
];

export default function Step3Usage({ answers, onChange }) {
  const { purpose, propertyTypes = [], usageCategory } = answers;
  const isInvest = purpose === "invest";
  const hasCommercial = propertyTypes.some(t => ["commercial", "office", "retail"].includes(t));

  const options = isInvest ? INVEST_USES : hasCommercial ? COMMERCIAL_USES : RESIDENTIAL_USES;

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">What will this property be used for?</h2>
        <p className="text-gray-500 text-sm">This helps us match the right features and locations</p>
      </div>

      <QuestionCard number="1" question="Primary Use">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {options.map(o => (
            <OptionCard key={o.value} icon={o.icon} label={o.label} sublabel={o.sub}
              selected={usageCategory === o.value} onClick={() => onChange({ usageCategory: o.value })} />
          ))}
        </div>
      </QuestionCard>
    </div>
  );
}