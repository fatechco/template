const STEP_LABELS = ["Category", "Location", "Media", "Price", "Details", "About"];

export default function PropStep7Preview({ form, onGoToStep, onSubmit, canProceed, update }) {
  const purpose = { sale: "For Sale", rent: "For Rent", sale_rent: "Sale or Rent" }[form.purpose] || form.purpose;
  const price = form.is_contact_for_price ? "Contact for price" : `${form.currency} ${parseInt(form.price || 0).toLocaleString()}`;

  const SECTIONS = [
    { step: 1, label: "Category & Purpose", value: `${form.category || "—"} · ${purpose || "—"}` },
    { step: 2, label: "Location", value: [form.city, form.province, form.country].filter(Boolean).join(", ") || "—" },
    { step: 3, label: "Photos", value: `${form.main_photo ? 1 : 0} main + ${(form.gallery || []).length} gallery photos` },
    { step: 4, label: "Price & Area", value: `${price} · ${form.property_area || "—"} ${form.area_unit || "sqm"}` },
    { step: 5, label: "Details", value: `${form.condition || "—"} · ${form.furnished || "—"} · ${(form.amenities || []).length} amenities` },
    { step: 6, label: "About & Title", value: form.title || "—" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center">Review Your Listing</h2>
      <p className="text-sm text-gray-400 text-center mt-1 mb-5">This is how buyers will see it</p>

      {/* Preview card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          {form.main_photo
            ? <span className="text-6xl">📷</span>
            : <div className="text-center"><span className="text-4xl">🏠</span><p className="text-orange-600 text-sm font-bold mt-2">No photo yet</p></div>
          }
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{purpose || "For Sale"}</span>
          </div>
          <p className="font-black text-orange-600 text-xl">{price}</p>
          <p className="font-black text-gray-900 text-base mt-0.5 line-clamp-2">{form.title || "Your property title"}</p>
          <p className="text-xs text-gray-400 mt-1">📍 {[form.city, form.country].filter(Boolean).join(", ") || "Location not set"}</p>
          {(form.beds || form.baths || form.property_area) && (
            <div className="flex gap-3 mt-2">
              {form.beds > 0 && <span className="text-xs text-gray-500">🛏 {form.beds}</span>}
              {form.baths > 0 && <span className="text-xs text-gray-500">🚿 {form.baths}</span>}
              {form.property_area && <span className="text-xs text-gray-500">📐 {form.property_area} {form.area_unit}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Edit sections */}
      <div className="space-y-2 mb-5">
        {SECTIONS.map(s => (
          <div key={s.step} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3.5">
            <div>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5 leading-tight">{s.value}</p>
            </div>
            <button onClick={() => onGoToStep(s.step)} className="text-orange-600 text-lg ml-3">✏️</button>
          </div>
        ))}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-8 cursor-pointer">
        <div onClick={() => update({ terms_agreed: !form.terms_agreed })}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.terms_agreed ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}>
          {form.terms_agreed && <span className="text-white text-xs font-black">✓</span>}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          I confirm all information is accurate and I agree to{" "}
          <span className="text-orange-600 font-bold">Kemedar's Terms & Conditions</span>
        </p>
      </label>

      <button onClick={onSubmit} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40 flex items-center justify-center gap-2"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        🚀 Submit Listing
      </button>
    </div>
  );
}