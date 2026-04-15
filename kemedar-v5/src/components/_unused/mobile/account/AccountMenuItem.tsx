// @ts-nocheck
import { ChevronRight } from "lucide-react";

export default function AccountMenuItem({ emoji, label, action }) {
  return (
    <button
      onClick={action}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
    >
      <span className="text-lg">{emoji}</span>
      <span className="flex-1 text-left text-sm font-bold text-[#1F2937]">{label}</span>
      <ChevronRight size={16} className="text-[#9CA3AF] flex-shrink-0" />
    </button>
  );
}