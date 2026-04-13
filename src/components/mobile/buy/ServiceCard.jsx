import { ChevronRight } from "lucide-react";

export default function ServiceCard({ emoji, title, subtitle, price, buttonText, buttonColor, buttonAction }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mx-4 mb-3 flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
        style={{ backgroundColor: buttonColor + "22" }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1F2937] leading-tight">{title}</p>
        <p className="text-xs text-[#6B7280] mt-0.5 leading-tight">{subtitle}</p>
        {price && <p className="text-xs font-bold text-[#1F2937] mt-1">{price}</p>}
      </div>
      <button
        onClick={buttonAction}
        className="text-white font-bold px-4 py-2 rounded-lg text-xs flex-shrink-0 transition-opacity active:opacity-80 whitespace-nowrap"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  );
}