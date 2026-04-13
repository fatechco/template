import { Check } from "lucide-react";

export default function StepProgressBar({ currentStep, steps }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 z-0" style={{ left: "20px", right: "20px" }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[#FF6B00] z-0 transition-all duration-500"
          style={{ left: "20px", width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 0px)` }}
        />
        {steps.map((s, i) => {
          const num = i + 1;
          const done = num < currentStep;
          const active = num === currentStep;
          return (
            <div key={i} className="flex flex-col items-center z-10 gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all duration-300 ${
                done ? "bg-[#FF6B00] border-[#FF6B00] text-white" :
                active ? "bg-white border-[#FF6B00] text-[#FF6B00] shadow-md" :
                "bg-white border-gray-200 text-gray-400"
              }`}>
                {done ? <Check size={16} /> : num}
              </div>
              <span className={`text-[10px] font-bold whitespace-nowrap hidden sm:block ${active ? "text-[#FF6B00]" : done ? "text-gray-500" : "text-gray-300"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}