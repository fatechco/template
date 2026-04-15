// @ts-nocheck
export default function MobilePropertyStep6({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Title (English) *</label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="e.g. Luxury Villa in Sheikh Zayed"
          maxLength={100}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{(data.title || "").length}/100</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Title (Arabic)</label>
        <input
          type="text"
          value={data.title_ar || ""}
          onChange={(e) => onChange({ ...data, title_ar: e.target.value })}
          placeholder="مثال: فيلا فاخرة في الشيخ زايد"
          maxLength={100}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          dir="rtl"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{(data.title_ar || "").length}/100</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Description (English)</label>
        <textarea
          value={data.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Describe your property in detail..."
          rows={6}
          maxLength={1000}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] resize-none"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{(data.description || "").length}/1000</p>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Description (Arabic)</label>
        <textarea
          value={data.description_ar || ""}
          onChange={(e) => onChange({ ...data, description_ar: e.target.value })}
          placeholder="صف العقار بالتفصيل..."
          rows={6}
          maxLength={1000}
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] resize-none"
          dir="rtl"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{(data.description_ar || "").length}/1000</p>
      </div>
    </div>
  );
}