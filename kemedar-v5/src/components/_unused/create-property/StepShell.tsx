// @ts-nocheck
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StepShell({ title, subtitle, onNext, onBack, isFirst, isLast, nextLabel, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-black text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">
        {children}
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
        {!isFirst ? (
          <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors bg-white">
            <ChevronLeft size={15} /> Back
          </button>
        ) : <div />}
        <button onClick={onNext} className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B00] hover:bg-[#e55f00] text-white rounded-xl text-sm font-bold transition-colors shadow-md">
          {nextLabel || (isLast ? "Submit Listing" : "Next Step")} <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}