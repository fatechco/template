"use client";
// @ts-nocheck
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddFormShell({
  title,
  steps,
  currentStep,
  onNext,
  onPrev,
  canProceed,
  onSubmit,
  submitLabel = "Submit",
  children,
}) {
  const router = useRouter();
  const step = steps.find((s) => s.id === currentStep);
  const progress = (currentStep / steps.length) * 100;
  const isLast = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={onPrev} className="p-1 -ml-1 text-gray-900">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 text-center">
            <p className="font-black text-gray-900 text-sm">{title} — Step {currentStep} of {steps.length}</p>
            <p className="text-xs text-gray-400">{step?.label}</p>
          </div>
          <div className="w-16" />
        </div>
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 py-6 w-full">
        {children}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
        <button
          onClick={onPrev}
          disabled={currentStep === 1}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-900 font-bold py-3.5 rounded-xl disabled:opacity-40"
        >
          <ChevronLeft size={18} /> Back
        </button>
        {!isLast ? (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            className="flex-1 bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            {submitLabel}
          </button>
        )}
      </div>
    </div>
  );
}