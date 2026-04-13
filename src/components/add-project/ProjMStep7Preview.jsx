import QRGeneratorWidget from '@/components/qr/QRGeneratorWidget';

export default function ProjMStep7Preview({ form, onGoToStep, onSubmit, canProceed, update }) {
  const SECTIONS = [
    { step: 1, label: "Project Type", value: `${form.category || "—"}` },
    { step: 2, label: "Location", value: [form.city, form.country].filter(Boolean).join(", ") || "—" },
    { step: 3, label: "Media", value: `${form.featured_image ? "✅" : "❌"} Hero · ${(form.gallery || []).length} gallery` },
    { step: 4, label: "Scale & Timeline", value: `${form.total_units || "—"} units · Delivery: ${form.delivery_date || "—"}` },
    { step: 5, label: "Unit Types & Amenities", value: `${(form.unit_types || []).length} types · ${(form.amenities || []).length} amenities` },
    { step: 6, label: "Project Name", value: form.title || "—" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center">Review Project</h2>
      <p className="text-sm text-gray-400 text-center mt-1 mb-5">Check all details before submitting</p>

      {/* Preview card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
        <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-6xl">🏙</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{form.category || "Project"}</span>
          </div>
          <p className="font-black text-gray-900 text-lg">{form.title || "Project Name"}</p>
          <p className="text-xs text-gray-400 mt-1">📍 {[form.city, form.country].filter(Boolean).join(", ") || "Location not set"}</p>
          <div className="flex gap-3 mt-2">
            {form.total_units && <span className="text-xs text-gray-500">🏠 {form.total_units} units</span>}
            {form.total_area && <span className="text-xs text-gray-500">📐 {parseInt(form.total_area).toLocaleString()} sqm</span>}
            {form.delivery_date && <span className="text-xs text-gray-500">📅 {form.delivery_date}</span>}
          </div>
          {(form.unit_types || []).length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {form.unit_types.map(u => (
                <span key={u.type} className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{u.type}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2 mb-5">
        {SECTIONS.map(s => (
          <div key={s.step} className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3.5">
            <div>
              <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{s.value}</p>
            </div>
            <button onClick={() => onGoToStep(s.step)} className="text-orange-600 text-lg ml-3">✏️</button>
          </div>
        ))}
      </div>

      {/* Project QR Code */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4" style={{ borderLeft: '3px solid #FF6B00' }}>
        <p className="font-black text-gray-900 text-sm">📱 Project QR Code</p>
        <p className="text-gray-500 text-xs mt-1">Save and publish your project first to generate a QR code for marketing materials.</p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 mb-8 cursor-pointer">
        <div onClick={() => update({ terms_agreed: !form.terms_agreed })}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.terms_agreed ? "bg-orange-600 border-orange-600" : "border-gray-300"}`}>
          {form.terms_agreed && <span className="text-white text-xs font-black">✓</span>}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          I confirm all project information is accurate and I agree to{" "}
          <span className="text-orange-600 font-bold">Kemedar's Terms & Conditions</span>
        </p>
      </label>

      <button onClick={onSubmit} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40 flex items-center justify-center gap-2"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        🚀 Submit Project
      </button>
    </div>
  );
}