// @ts-nocheck
const STEPS = [
  { num: 1, label: "Listed" },
  { num: 2, label: "Seller" },
  { num: 3, label: "Docs" },
  { num: 4, label: "FO" },
  { num: 5, label: "Full" },
];

export default function VerifyProgressBar({ currentLevel }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const done = currentLevel > step.num;
          const active = currentLevel === step.num;
          const locked = currentLevel < step.num;
          return (
            <div key={step.num} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-center w-full">
                {/* Left line */}
                {i > 0 && (
                  <div className={`flex-1 h-0.5 ${done || active ? "bg-[#FF6B00]" : "bg-gray-200"}`} />
                )}
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all
                    ${done ? "bg-[#FF6B00] text-white" : ""}
                    ${active ? "bg-[#FF6B00] text-white ring-4 ring-orange-200 animate-pulse" : ""}
                    ${locked ? "bg-gray-200 text-gray-400" : ""}
                  `}
                >
                  {done ? "✓" : step.num}
                </div>
                {/* Right line */}
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${done ? "bg-[#FF6B00]" : "bg-gray-200"}`} />
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 ${active ? "text-[#FF6B00]" : done ? "text-gray-700" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}