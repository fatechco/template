export default function MobilePropertyStep3({ data, onChange }) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F3F4F6]">
        <input
          type="checkbox"
          checked={data.is_contact_for_price || false}
          onChange={(e) => onChange({ ...data, is_contact_for_price: e.target.checked })}
          className="accent-[#FF6B00]"
        />
        <span className="text-sm font-medium text-[#1F2937]">Contact for price</span>
      </label>

      {!data.is_contact_for_price && (
        <>
          <div>
            <label className="block text-xs font-bold text-[#6B7280] mb-2">Price Amount *</label>
            <input
              type="number"
              value={data.price_amount || ""}
              onChange={(e) => onChange({ ...data, price_amount: e.target.value })}
              placeholder="Enter price"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B7280] mb-2">Currency</label>
            <select
              value={data.currency_id || "EGP"}
              onChange={(e) => onChange({ ...data, currency_id: e.target.value })}
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
            >
              <option value="EGP">EGP (Egypt)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="AED">AED (UAE)</option>
              <option value="SAR">SAR (Saudi)</option>
              <option value="KWD">KWD (Kuwait)</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-xl cursor-pointer hover:bg-[#F3F4F6]">
            <input
              type="checkbox"
              checked={data.is_negotiable === "yes"}
              onChange={(e) => onChange({ ...data, is_negotiable: e.target.checked ? "yes" : "no" })}
              className="accent-[#FF6B00]"
            />
            <span className="text-sm font-medium text-[#1F2937]">Price is negotiable</span>
          </label>
        </>
      )}

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Area (m²)</label>
        <input
          type="number"
          value={data.area_size || ""}
          onChange={(e) => onChange({ ...data, area_size: e.target.value })}
          placeholder="e.g. 250"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Bedrooms</label>
          <input
            type="number"
            value={data.beds || ""}
            onChange={(e) => onChange({ ...data, beds: e.target.value })}
            placeholder="0"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Bathrooms</label>
          <input
            type="number"
            value={data.baths || ""}
            onChange={(e) => onChange({ ...data, baths: e.target.value })}
            placeholder="0"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
      </div>
    </div>
  );
}