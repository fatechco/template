// @ts-nocheck
import AIPriceWidget from "@/components/ai/AIPriceWidget";

const CURRENCIES = ["EGP", "USD", "EUR", "SAR", "AED"];
const AREA_UNITS = ["sqm", "sqft", "Feddan", "Hectare"];

export default function PropStep4Price({ form, update, onNext, canProceed }) {
  const fmt = v => v ? parseInt(v.replace(/,/g, "") || 0).toLocaleString() : "";
  const parse = v => v.replace(/,/g, "");

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Price & Size</h2>

      {/* AI Price Suggestion */}
      <AIPriceWidget
        formType="property"
        formData={form}
        onPriceSelected={(price) => update({ price: String(price) })}
        requiredFields={["city_id", "purpose"]}
      />

      {/* Contact for price toggle */}
      <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-5">
        <div>
          <p className="font-bold text-gray-800 text-sm">Contact for price</p>
          {form.is_contact_for_price && <p className="text-xs text-orange-600 mt-0.5">Price hidden — buyers must contact</p>}
        </div>
        <button onClick={() => update({ is_contact_for_price: !form.is_contact_for_price })}
          className={`w-12 h-6 rounded-full transition-colors relative ${form.is_contact_for_price ? "bg-orange-600" : "bg-gray-300"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_contact_for_price ? "left-6" : "left-0.5"}`} />
        </button>
      </div>

      {!form.is_contact_for_price && (
        <>
          {/* Currency */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 mb-1.5">Currency</p>
            <div className="flex gap-2 flex-wrap">
              {CURRENCIES.map(c => (
                <button key={c} onClick={() => update({ currency: c })}
                  className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 ${form.currency === c ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 mb-1.5">Price</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{form.currency}</span>
              <input
                type="text" inputMode="numeric"
                value={fmt(form.price)}
                onChange={e => update({ price: parse(e.target.value) })}
                placeholder="0"
                className="w-full border-2 border-gray-200 rounded-2xl pl-16 pr-4 text-2xl font-black text-gray-900 outline-none focus:border-orange-400"
                style={{ height: 64 }}
              />
            </div>
          </div>

          {/* Negotiable */}
          <div className="mb-5">
            <p className="text-sm font-bold text-gray-700 mb-1.5">Negotiable?</p>
            <div className="flex gap-2">
              {[{ k: "fixed", l: "Fixed" }, { k: "negotiable", l: "Negotiable" }, { k: "prefer_not", l: "Prefer not to say" }].map(o => (
                <button key={o.k} onClick={() => update({ negotiable: o.k })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 ${form.negotiable === o.k ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Installments */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-gray-800 text-sm">Enable installments</p>
              <button onClick={() => update({ installments: !form.installments })}
                className={`w-12 h-6 rounded-full transition-colors relative ${form.installments ? "bg-orange-600" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.installments ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            {form.installments && (
              <div className="space-y-2 mt-3">
                {[{ k: "upfront", l: "Upfront (%)" }, { k: "monthly", l: `Monthly (${form.currency})` }, { k: "period", l: "Period (months)" }].map(f => (
                  <div key={f.k} className="flex items-center gap-3">
                    <p className="text-xs text-gray-500 w-28">{f.l}</p>
                    <input type="number" value={form[f.k] || ""} onChange={e => update({ [f.k]: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Area */}
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Property Size</p>
        <div className="flex gap-2 items-center">
          <input type="number" value={form.property_area || ""} onChange={e => update({ property_area: e.target.value })}
            placeholder="0" inputMode="numeric"
            className="flex-1 border-2 border-gray-200 rounded-2xl px-4 text-2xl font-black text-gray-900 outline-none focus:border-orange-400"
            style={{ height: 64 }} />
          <div className="flex flex-col gap-1">
            {AREA_UNITS.map(u => (
              <button key={u} onClick={() => update({ area_unit: u })}
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${form.area_unit === u ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200"}`}>
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Net Area <span className="text-gray-400 font-normal">(optional)</span></p>
        <input type="number" value={form.net_area || ""} onChange={e => update({ net_area: e.target.value })}
          placeholder="0"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}