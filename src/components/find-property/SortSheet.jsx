const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: "🕒" },
  { id: "price_asc", label: "Price: Low to High", icon: "💰↑" },
  { id: "price_desc", label: "Price: High to Low", icon: "💰↓" },
  { id: "most_viewed", label: "Most Viewed", icon: "👁" },
  { id: "featured", label: "Featured First", icon: "⭐" },
];

export default function SortSheet({ open, onClose, value, onChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end items-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl overflow-hidden pointer-events-auto w-full max-w-lg">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-1" />
        <p className="font-black text-gray-900 text-base px-5 py-3 border-b border-gray-100">Sort By</p>
        <div className="py-2" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{opt.icon}</span>
                <span className={`text-sm font-semibold ${value === opt.id ? "text-orange-600" : "text-gray-800"}`}>{opt.label}</span>
              </div>
              {value === opt.id && <span className="text-orange-600 font-black text-lg">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}