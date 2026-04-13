export default function MobilePropertyStep7({ data }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-bold text-[#1F2937] mb-3">✅ Review Your Listing</h3>
        <p className="text-sm text-[#6B7280]">Everything looks good! Tap "Publish" to make your property live on Kemedar.</p>
      </div>

      {/* Property Summary */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-xs text-[#6B7280]">Title</span>
          <span className="text-sm font-bold text-[#1F2937]">{data.title || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#6B7280]">Location</span>
          <span className="text-sm font-bold text-[#1F2937]">{data.address || "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-[#6B7280]">Price</span>
          <span className="text-sm font-bold text-[#1F2937]">
            {data.is_contact_for_price ? "Contact for Price" : `${data.currency_id} ${data.price_amount || "—"}`}
          </span>
        </div>
        {data.beds && (
          <div className="flex justify-between">
            <span className="text-xs text-[#6B7280]">Beds / Baths</span>
            <span className="text-sm font-bold text-[#1F2937]">{data.beds} / {data.baths || "—"}</span>
          </div>
        )}
        {data.area_size && (
          <div className="flex justify-between">
            <span className="text-xs text-[#6B7280]">Area</span>
            <span className="text-sm font-bold text-[#1F2937]">{data.area_size} {data.area_unit}</span>
          </div>
        )}
      </div>

      {/* Checklist */}
      <div className="bg-[#F3F4F6] rounded-xl p-4">
        <h4 className="font-bold text-[#1F2937] mb-3 text-sm">Before Publishing:</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-[#6B7280]">
            <input type="checkbox" className="rounded accent-[#FF6B00]" defaultChecked />
            All required fields are filled
          </label>
          <label className="flex items-center gap-2 text-xs text-[#6B7280]">
            <input type="checkbox" className="rounded accent-[#FF6B00]" />
            Photos are clear and well-lit
          </label>
          <label className="flex items-center gap-2 text-xs text-[#6B7280]">
            <input type="checkbox" className="rounded accent-[#FF6B00]" />
            Description is accurate
          </label>
        </div>
      </div>
    </div>
  );
}