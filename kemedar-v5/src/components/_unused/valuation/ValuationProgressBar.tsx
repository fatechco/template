// @ts-nocheck
const STEPS = ['Goal', 'Location', 'Details', 'Results'];

export default function ValuationProgressBar({ currentStep }) {
  const pct = Math.round((currentStep / 4) * 100);
  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-semibold">Step {currentStep} of 4</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="relative flex items-center gap-0">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className={`relative flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                isDone ? 'bg-blue-600 text-white' : isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-400'
              }`}>
                {isDone ? '✓' : stepNum}
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-1 mx-1 rounded-full overflow-hidden bg-gray-200">
                  <div className={`h-full rounded-full transition-all ${isDone ? 'bg-blue-600 w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        {STEPS.map((label, i) => (
          <span key={label} className={`text-[10px] font-medium ${i + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'} ${i === STEPS.length - 1 ? 'text-right' : ''}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}