// @ts-nocheck
export default function SettingsToggleItem({ emoji, label, value, onChange }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <span className="flex-1 font-semibold text-[#1F2937] text-sm">{label}</span>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          value ? "bg-[#FF6B00]" : "bg-[#D1D5DB]"
        }`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            value ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}