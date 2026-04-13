const CATEGORIES = [
  { emoji: "🏠", label: "Apartment" },
  { emoji: "🏡", label: "Villa" },
  { emoji: "🏢", label: "Office" },
  { emoji: "🏗", label: "Project" },
  { emoji: "🏪", label: "Shop" },
  { emoji: "🏨", label: "Hotel" },
  { emoji: "🌾", label: "Farm" },
  { emoji: "🏭", label: "Factory" },
];

export default function MobileCategoryGrid() {
  return (
    <div className="px-4 mb-6">
      <p className="text-[#1F2937] font-black text-base mb-3">Browse by Category</p>
      <div className="grid grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            className="flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E5E7EB] shadow-sm py-3 active:bg-orange-50 transition-colors"
            style={{ minHeight: 72 }}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-[10px] font-semibold text-[#6B7280] mt-1 text-center leading-tight">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
      <button className="w-full text-center text-[#FF6B00] text-sm font-semibold mt-3">
        See all categories →
      </button>
    </div>
  );
}