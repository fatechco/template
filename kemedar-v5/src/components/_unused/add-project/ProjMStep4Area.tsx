// @ts-nocheck
export default function ProjMStep4Area({ form, update, onNext }) {
  const Field = ({ label, field, placeholder, optional }) => (
    <div className="mb-4">
      <p className="text-sm font-bold text-gray-700 mb-1.5">{label} {optional && <span className="text-gray-400 font-normal">(optional)</span>}</p>
      <input type="number" value={form[field] || ""} onChange={e => update({ [field]: e.target.value })}
        placeholder={placeholder || "0"} inputMode="numeric"
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-xl font-black text-gray-900 outline-none focus:border-orange-400" />
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Project Scale & Timeline</h2>

      <Field label="Total Area (sqm)" field="total_area" placeholder="e.g. 50000" />
      <Field label="Built Area (sqm)" field="built_area" placeholder="e.g. 20000" optional />
      <Field label="Green / Landscape Area (sqm)" field="green_area" placeholder="e.g. 15000" optional />
      <Field label="Total Units" field="total_units" placeholder="e.g. 500" />

      <div className="mb-6">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Delivery Date</p>
        <input type="date" value={form.delivery_date || ""} onChange={e => update({ delivery_date: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
      </div>

      <button onClick={onNext}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}