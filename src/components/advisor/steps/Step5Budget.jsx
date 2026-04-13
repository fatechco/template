import { QuestionCard, PillOption, OptionCard } from "../AdvisorOptionCard";
import { useState } from "react";

const INCOME_RANGES = [
  { value: "under_10k", label: "Under 10,000 EGP" },
  { value: "10k_20k", label: "10,000 – 20,000 EGP" },
  { value: "20k_35k", label: "20,000 – 35,000 EGP" },
  { value: "35k_50k", label: "35,000 – 50,000 EGP" },
  { value: "50k_75k", label: "50,000 – 75,000 EGP" },
  { value: "75k_100k", label: "75,000 – 100,000 EGP" },
  { value: "100k_150k", label: "100,000 – 150,000 EGP" },
  { value: "150k_plus", label: "150,000+ EGP" },
  { value: "prefer_not", label: "🤐 Prefer not to say" },
];

const PAYMENT_METHODS = [
  { value: "cash", icon: "💵", label: "Cash" },
  { value: "mortgage", icon: "🏦", label: "Bank Mortgage" },
  { value: "installment", icon: "📋", label: "Developer Installment" },
  { value: "any", icon: "🤝", label: "Any option works" },
  { value: "unsure", icon: "❓", label: "Not sure — advise me" },
];

const RENT_FREQ = ["Monthly", "Quarterly", "Semi-annually", "Annually", "Flexible"];
const LEASE_DUR = ["Short-term (1–6 mo)", "1 year", "2–3 years", "Long-term (3+ years)", "Flexible"];
const DOWN_PAYMENT = ["Less than 10%", "10% – 20%", "20% – 30%", "30% – 50%", "More than 50%"];
const INVEST_RETURN = [
  { value: "5_8", label: "📈 5–8% (conservative)" },
  { value: "8_12", label: "📈📈 8–12% (moderate)" },
  { value: "12_18", label: "📈📈📈 12–18% (aggressive)" },
  { value: "18_plus", label: "🚀 18%+ (high risk/reward)" },
  { value: "unsure", label: "❓ Not sure — advise me" },
];

function BudgetSlider({ min, max, value, onChange, currency, step = 100000 }) {
  const PRESETS_BUY = [
    { label: "Under 1M", min: 0, max: 1000000 },
    { label: "1M–2M", min: 1000000, max: 2000000 },
    { label: "2M–3M", min: 2000000, max: 3000000 },
    { label: "3M–5M", min: 3000000, max: 5000000 },
    { label: "5M+", min: 5000000, max: 10000000 },
  ];

  const fmt = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`;

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{fmt(value[0])} {currency}</span>
        <span>{fmt(value[1])} {currency}</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full mb-4">
        <div className="absolute h-full bg-orange-500 rounded-full"
          style={{ left: `${((value[0] - min) / (max - min)) * 100}%`, right: `${100 - ((value[1] - min) / (max - min)) * 100}%` }} />
        <input type="range" min={min} max={max} step={step} value={value[0]}
          onChange={e => onChange([Math.min(+e.target.value, value[1] - step), value[1]])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
        <input type="range" min={min} max={max} step={step} value={value[1]}
          onChange={e => onChange([value[0], Math.max(+e.target.value, value[0] + step)])}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS_BUY.map(p => (
          <button key={p.label} onClick={() => onChange([p.min, p.max])}
            className={`px-2.5 py-1 rounded-full border text-xs font-bold transition-all ${value[0] === p.min && value[1] === p.max ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Step5Budget({ answers, onChange }) {
  const { purpose, incomeRange, budgetMin = 500000, budgetMax = 2500000, currency = "EGP",
    paymentMethod, installmentMax = 5000, downPaymentRange,
    rentFrequency, leaseDuration, expectedReturn } = answers;

  const needsInstallment = ["mortgage", "installment"].includes(paymentMethod);

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Let's find what fits your budget</h2>
        <p className="text-gray-500 text-sm">We use ranges only — your exact numbers stay private</p>
      </div>

      <QuestionCard number="1" question="Monthly Household Income Range">
        <div className="grid grid-cols-1 gap-2">
          {INCOME_RANGES.map(r => (
            <button key={r.value} onClick={() => onChange({ incomeRange: r.value })}
              className={`text-left px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all ${incomeRange === r.value ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-orange-300"}`}>
              {r.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-2">🔒 Only used to calculate comfortable installment ranges — never stored with your identity</p>
      </QuestionCard>

      {purpose === "buy" && (
        <>
          <QuestionCard number="2" question="Total Property Budget">
            <BudgetSlider min={0} max={10000000} value={[budgetMin, budgetMax]} currency={currency}
              onChange={([mn, mx]) => onChange({ budgetMin: mn, budgetMax: mx })} />
          </QuestionCard>

          <QuestionCard number="3" question="Payment Method">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map(o => (
                <OptionCard key={o.value} icon={o.icon} label={o.label}
                  selected={paymentMethod === o.value} onClick={() => onChange({ paymentMethod: o.value })} />
              ))}
            </div>
          </QuestionCard>

          {needsInstallment && (
            <>
              <QuestionCard number="4" question="Comfortable Monthly Installment">
                <BudgetSlider min={1000} max={50000} step={500} value={[2000, installmentMax || 10000]} currency={currency}
                  onChange={([, mx]) => onChange({ installmentMax: mx })} />
              </QuestionCard>

              <QuestionCard number="5" question="Down Payment Available">
                <div className="flex flex-wrap gap-2">
                  {DOWN_PAYMENT.map(d => (
                    <PillOption key={d} label={d} selected={downPaymentRange === d} onClick={() => onChange({ downPaymentRange: d })} />
                  ))}
                </div>
              </QuestionCard>
            </>
          )}
        </>
      )}

      {purpose === "rent" && (
        <>
          <QuestionCard number="2" question="Monthly Rent Budget">
            <BudgetSlider min={0} max={50000} step={500} value={[budgetMin || 2000, budgetMax || 10000]} currency={currency}
              onChange={([mn, mx]) => onChange({ budgetMin: mn, budgetMax: mx })} />
          </QuestionCard>
          <QuestionCard number="3" question="Payment Frequency">
            <div className="flex flex-wrap gap-2">
              {RENT_FREQ.map(f => (
                <PillOption key={f} label={f} selected={rentFrequency === f} onClick={() => onChange({ rentFrequency: f })} />
              ))}
            </div>
          </QuestionCard>
          <QuestionCard number="4" question="Lease Duration">
            <div className="flex flex-wrap gap-2">
              {LEASE_DUR.map(d => (
                <PillOption key={d} label={d} selected={leaseDuration === d} onClick={() => onChange({ leaseDuration: d })} />
              ))}
            </div>
          </QuestionCard>
        </>
      )}

      {purpose === "invest" && (
        <>
          <QuestionCard number="2" question="Investment Budget">
            <BudgetSlider min={0} max={15000000} value={[budgetMin || 500000, budgetMax || 5000000]} currency={currency}
              onChange={([mn, mx]) => onChange({ budgetMin: mn, budgetMax: mx })} />
          </QuestionCard>
          <QuestionCard number="3" question="Expected Annual Return">
            <div className="grid grid-cols-1 gap-3">
              {INVEST_RETURN.map(o => (
                <OptionCard key={o.value} label={o.label}
                  selected={expectedReturn === o.value} onClick={() => onChange({ expectedReturn: o.value })} />
              ))}
            </div>
          </QuestionCard>
        </>
      )}
    </div>
  );
}