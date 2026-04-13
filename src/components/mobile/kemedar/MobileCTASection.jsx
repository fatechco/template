export default function MobileCTASection() {
  return (
    <div className="px-4 mb-6">
      <div className="flex gap-3">
        {/* Free card */}
        <div className="flex-1 bg-[#10B981] rounded-2xl p-4 flex flex-col">
          <span className="text-3xl mb-2">🎁</span>
          <p className="text-white font-black text-sm leading-tight">Free Services</p>
          <p className="text-white/80 text-[11px] mt-0.5 mb-3">List your property free</p>
          <ul className="space-y-1 mb-4 flex-1">
            {["Add up to 3 properties", "Basic listing", "Search & find"].map((f) => (
              <li key={f} className="text-white text-[11px] flex items-start gap-1">
                <span className="text-white font-bold mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            className="w-full border-2 border-white text-white font-black text-xs rounded-xl"
            style={{ minHeight: 36 }}
          >
            Start Free
          </button>
        </div>

        {/* Premium card */}
        <div className="flex-1 bg-[#FF6B00] rounded-2xl p-4 flex flex-col">
          <span className="text-3xl mb-2">👑</span>
          <p className="text-white font-black text-sm leading-tight">Premium</p>
          <p className="text-white/80 text-[11px] mt-0.5 mb-3">Grow faster with premium</p>
          <ul className="space-y-1 mb-4 flex-1">
            {["Up to 25–unlimited listings", "Featured placement", "Verification badge"].map((f) => (
              <li key={f} className="text-white text-[11px] flex items-start gap-1">
                <span className="text-white font-bold mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            className="w-full border-2 border-white text-white font-black text-xs rounded-xl"
            style={{ minHeight: 36 }}
          >
            Upgrade →
          </button>
        </div>
      </div>
    </div>
  );
}