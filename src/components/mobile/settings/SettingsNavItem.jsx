import { ChevronRight } from "lucide-react";

export default function SettingsNavItem({ emoji, label, value, onPress }) {
  return (
    <button
      onClick={onPress}
      className="flex items-center gap-3 px-4 py-3 w-full active:bg-[#F9FAFB] transition-colors"
    >
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <span className="flex-1 font-semibold text-[#1F2937] text-sm text-left">{label}</span>
      {value && (
        <span className="text-xs text-[#6B7280] font-medium mr-1 max-w-[120px] truncate">{value}</span>
      )}
      <ChevronRight size={16} className="text-[#D1D5DB] flex-shrink-0" />
    </button>
  );
}