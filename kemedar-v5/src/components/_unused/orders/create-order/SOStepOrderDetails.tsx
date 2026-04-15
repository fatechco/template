// @ts-nocheck
const ENTITY_TYPES = ["Property", "Project", "Product", "Profile"];

export default function SOStepOrderDetails({ service, details, onChange, totalPrice }) {
  const set = (key, val) => onChange(d => ({ ...d, [key]: val }));
  const hasTiers = service?.pricingTiers?.length > 0;
  const isCustom = service?.serviceType === "custom_quote";

  return (
    <div className="space-y-4">
      {/* Pricing Tier Selector */}
      {hasTiers && (
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-2">Select Pricing Tier *</label>
          <div className="space-y-2">
            {service.pricingTiers.map((tier, i) => (
              <label key={i}
                className={`flex items-center justify-between border-2 rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  details.pricingTierLabel === tier.label ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="tier" checked={details.pricingTierLabel === tier.label}
                    onChange={() => { set("pricingTierLabel", tier.label); set("unitPrice", tier.price || 0); }}
                    className="accent-orange-500" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{tier.label}</p>
                    {tier.description && <p className="text-xs text-gray-500">{tier.description}</p>}
                  </div>
                </div>
                <span className="font-black text-orange-600">${tier.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Custom Price Input */}
      {isCustom && (
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Quoted Price (USD) *</label>
          <input type="number" min="0" step="0.01"
            value={details.unitPrice}
            onChange={e => set("unitPrice", Number(e.target.value))}
            placeholder="Enter negotiated price…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      )}

      {/* Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Quantity</label>
          <input type="number" min="1"
            value={details.quantity}
            onChange={e => set("quantity", Math.max(1, Number(e.target.value)))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Total Price</label>
          <div className="border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
            <span className="font-black text-orange-600 text-base">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Related Entity */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Related Entity (optional)</label>
        <div className="grid grid-cols-2 gap-3">
          <select value={details.relatedEntityType} onChange={e => set("relatedEntityType", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
            <option value="">None</option>
            {ENTITY_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>
          {details.relatedEntityType && (
            <input type="text"
              value={details.relatedEntityId}
              onChange={e => set("relatedEntityId", e.target.value)}
              placeholder={`Enter ${details.relatedEntityType} ID…`}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          )}
        </div>
      </div>

      {/* Buyer Notes */}
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">Buyer Notes</label>
        <textarea value={details.buyerNotes} onChange={e => set("buyerNotes", e.target.value)}
          placeholder="Any special requirements from the buyer…"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>
    </div>
  );
}