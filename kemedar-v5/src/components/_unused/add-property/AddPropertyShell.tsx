// @ts-nocheck
export default function AddPropertyShell({ step, totalSteps, onBack, onSaveDraft, children }) {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={onBack} className="p-1 -ml-1 text-gray-700 text-xl">←</button>
          <span className="flex-1 text-center font-black text-gray-900 text-sm">
            Add Property — Step {step} of {totalSteps}
          </span>
          <button onClick={onSaveDraft} className="text-xs text-gray-400 font-semibold">Save Draft</button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`rounded-full transition-all ${i + 1 <= step ? "w-2 h-2 bg-orange-600" : "w-2 h-2 bg-gray-200"} ${i + 1 === step ? "w-4" : ""}`} />
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 py-5">
        {children}
      </div>
    </div>
  );
}