import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const STEPS = [
  { label: "Intent", time: 1 },
  { label: "Type", time: 0.5 },
  { label: "Usage", time: 0.5 },
  { label: "Household", time: 1 },
  { label: "Budget", time: 1 },
  { label: "Location", time: 1 },
  { label: "Lifestyle", time: 1 },
  { label: "Wishes", time: 0.5 },
];

export default function AdvisorStepShell({ currentStep, answers, onBack, onContinue, canContinue, children, onGoToStep }) {
  const navigate = useNavigate();
  const remaining = STEPS.slice(currentStep - 1).reduce((a, s) => a + s.time, 0);
  const pct = ((currentStep - 1) / 8) * 100;

  const exit = () => {
    localStorage.setItem("kemedar_advisor_draft", JSON.stringify({ ...answers, currentStep }));
    navigate("/kemedar/advisor");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-black">K</div>
            <span className="font-black text-gray-900 text-sm hidden sm:block">Kemedar Advisor</span>
          </div>

          {/* Steps */}
          <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = n < currentStep;
              const active = n === currentStep;
              return (
                <button key={n} onClick={() => done && onGoToStep && onGoToStep(n)}
                  className={`flex items-center gap-1 flex-shrink-0 ${done ? "cursor-pointer" : "cursor-default"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${done ? "bg-orange-500 text-white" : active ? "bg-orange-500 text-white ring-2 ring-orange-200" : "bg-gray-200 text-gray-500"}`}>
                    {done ? "✓" : n}
                  </div>
                  <span className={`text-[10px] font-bold hidden md:block ${active ? "text-orange-600" : done ? "text-gray-500" : "text-gray-400"}`}>{s.label}</span>
                  {i < 7 && <div className={`w-4 h-0.5 ${done ? "bg-orange-400" : "bg-gray-200"}`} />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[11px] text-gray-400 hidden sm:block">⏱ ~{remaining.toFixed(0)} min</span>
            <button onClick={exit} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <X size={14} /> Save & Exit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main question area */}
        <div className="lg:col-span-2">
          {children}
        </div>

        {/* Summary panel */}
        <div className="hidden lg:block">
          <AdvisorSummaryPanel answers={answers} currentStep={currentStep} onGoToStep={onGoToStep} />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button onClick={onBack} disabled={currentStep === 1}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
            ← Back
          </button>
          <span className="text-xs text-gray-400">Step {currentStep} of 8</span>
          <button onClick={onContinue} disabled={!canContinue}
            className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm transition-all">
            {currentStep === 8 ? "Generate My Report →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdvisorSummaryPanel({ answers, currentStep, onGoToStep }) {
  const SUMMARY_LABELS = [
    { step: 1, label: "Intent", value: () => [answers.purpose, answers.urgency].filter(Boolean).join(" · ") },
    { step: 2, label: "Type", value: () => (answers.propertyTypes || []).join(", ") },
    { step: 3, label: "Usage", value: () => answers.usageCategory?.replace(/_/g, " ") },
    { step: 4, label: "Household", value: () => answers.householdCount ? `${answers.householdCount} people` : null },
    { step: 5, label: "Budget", value: () => answers.budgetMin && answers.budgetMax ? `${(answers.budgetMin / 1000000).toFixed(1)}M – ${(answers.budgetMax / 1000000).toFixed(1)}M ${answers.currency || "EGP"}` : null },
    { step: 6, label: "Location", value: () => answers.preferredLocationsOpen ? "Open to suggestions" : answers.preferredLocationIds?.length ? `${answers.preferredLocationIds.length} areas` : null },
    { step: 7, label: "Priorities", value: () => (answers.prioritiesRanked || []).slice(0, 2).map(p => p.replace(/_/g, " ")).join(", ") },
    { step: 8, label: "Must-haves", value: () => (answers.mustHaveFeatures || []).filter(f => f !== "none").length ? `${(answers.mustHaveFeatures || []).filter(f => f !== "none").length} features` : null },
  ];

  const answered = SUMMARY_LABELS.filter(s => s.value()).length;
  const pct = Math.round((answered / 8) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black text-orange-500">Your Selections</p>
        <span className="text-xs text-gray-400">{pct}% complete</span>
      </div>

      <div className="space-y-2 mb-4">
        {SUMMARY_LABELS.map(item => {
          const val = item.value();
          const done = item.step < currentStep && val;
          return (
            <div key={item.step} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0 ${done ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>{item.step}</span>
                <span className="text-xs font-bold text-gray-700">{item.label}:</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 truncate max-w-[100px]">{val || "—"}</span>
                {done && (
                  <button onClick={() => onGoToStep && onGoToStep(item.step)} className="text-gray-300 hover:text-orange-500">
                    <span className="text-[10px]">✏️</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-center">{8 - answered} questions remaining</p>
    </div>
  );
}