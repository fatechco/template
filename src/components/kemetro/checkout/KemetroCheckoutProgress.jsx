import { Check } from "lucide-react";

const STEPS = ["Shipping", "Payment", "Review & Confirm"];

export default function KemetroCheckoutProgress({ currentStep = 1 }) {
  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  idx < currentStep
                    ? "bg-green-500 text-white"
                    : idx === currentStep - 1
                    ? "bg-[#FF6B00] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx < currentStep ? <Check size={16} /> : idx + 1}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-semibold ml-2 ${
                  idx < currentStep
                    ? "text-green-600"
                    : idx === currentStep - 1
                    ? "text-[#FF6B00]"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>

              {/* Line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ml-4 transition-colors ${
                    idx < currentStep - 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}