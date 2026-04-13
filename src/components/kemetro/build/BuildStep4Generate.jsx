export default function BuildStep4Generate({ form, onGenerate }) {
  const fmt = v => v?.toString().replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";

  const rows = [
    { label: "Project Name", value: form.projectName || `${fmt(form.projectType)} – ${form.totalAreaSqm}m²` },
    { label: "Type", value: fmt(form.projectType) },
    { label: "Total Area", value: `${form.totalAreaSqm} m²` },
    { label: "Bedrooms / Bathrooms", value: `${form.numberOfRooms} / ${form.numberOfBathrooms}` },
    { label: "Floor Plan", value: fmt(form.floorPlanType) },
    { label: "Finishing Level", value: fmt(form.finishingLevel) },
    { label: "Flooring", value: fmt(form.finishingPreferences?.flooringMaterial) },
    { label: "Wall Finish", value: fmt(form.finishingPreferences?.wallFinish) },
    { label: "Labor Estimates", value: form.includeLabor ? "Yes" : "No" },
    { label: "Contingency Buffer", value: form.includeContingency ? "10%" : "None" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Ready to Generate!</h2>
        <p className="text-gray-500 text-sm">Review your project details before we create your full BOQ with 3 budget scenarios.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {rows.map((r, i) => (
          <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-gray-500 font-medium">{r.label}</span>
            <span className="font-bold text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <p className="font-black text-teal-800 mb-2">🤖 What happens next?</p>
        <ul className="space-y-1.5 text-sm text-teal-700">
          <li>✅ AI calculates exact material quantities per room</li>
          <li>✅ Matches items to Kemetro product catalog</li>
          <li>✅ Generates Economy, Standard & Premium scenarios</li>
          <li>✅ Provides saving tips and contractor estimates</li>
        </ul>
        <p className="text-xs text-teal-500 mt-3">Takes about 20–30 seconds</p>
      </div>
    </div>
  );
}