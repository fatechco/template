// @ts-nocheck
const OPTIONS = [
  { value: 5, label: "5 stars only", stars: "⭐⭐⭐⭐⭐" },
  { value: 4, label: "4+ stars", stars: "⭐⭐⭐⭐" },
  { value: 3, label: "3+ stars", stars: "⭐⭐⭐" },
];

export default function RatingFilterSheet({ open, onClose, value, onApply }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end items-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl overflow-hidden w-full max-w-lg pointer-events-auto">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
        <p className="font-black text-gray-900 text-base px-5 py-3 border-b border-gray-100">Rating</p>
        <div className="py-2" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          <button
            onClick={() => onApply(null)}
            className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50"
          >
            <span className="text-sm font-semibold text-gray-700">Any Rating</span>
            {!value && <span className="text-orange-600 font-black">✓</span>}
          </button>
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onApply(opt.value)}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{opt.stars}</span>
                <span className={`text-sm font-semibold ${value === opt.value ? "text-orange-600" : "text-gray-700"}`}>{opt.label}</span>
              </div>
              {value === opt.value && <span className="text-orange-600 font-black">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}