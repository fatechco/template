const QUESTIONS = [
  { key: "propertyExistsAtAddress", label: "Property exists at this exact address?" },
  { key: "propertyMatchesPhotos", label: "Property matches the listing photos?" },
  { key: "specsMatchDescription", label: "Size and specs match the description?" },
  { key: "sellerRepresentativePresent", label: "Seller or representative was present?" },
  { key: "noLegalOccupancyIssues", label: "No visible legal or occupancy issues?" },
  { key: "buildingConditionAcceptable", label: "Building condition is acceptable?" },
  { key: "neighbourhoodMatchesDescription", label: "Neighbourhood matches the description?" },
  { key: "ownershipDocsShown", label: "Ownership documents were shown to you?" },
];

export default function InspectionChecklist({ checklist, onChange, onNext }) {
  const answered = Object.keys(checklist).length;
  const passed = Object.values(checklist).filter(Boolean).length;
  const allAnswered = answered >= QUESTIONS.length;

  const toggle = (key, val) => onChange(prev => ({ ...prev, [key]: val }));

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-2xl mb-1">📋</p>
        <h2 className="text-xl font-black text-gray-900">Inspection Checklist</h2>
        <p className="text-sm text-gray-500 mt-1">Answer all 8 questions honestly</p>
        {allAnswered && (
          <p className="mt-2 font-black text-lg text-orange-500">{passed}/8 passed</p>
        )}
      </div>

      <div className="space-y-3 mb-8">
        {QUESTIONS.map(q => {
          const val = checklist[q.key];
          return (
            <div key={q.key} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">{q.label}</p>
              <div className="flex gap-3">
                <button onClick={() => toggle(q.key, true)}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${val === true ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-green-100"}`}>
                  ✅ Yes
                </button>
                <button onClick={() => toggle(q.key, false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${val === false ? "bg-red-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-red-100"}`}>
                  ❌ No
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onNext} disabled={!allAnswered}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl text-base transition-colors">
        {allAnswered ? `Continue to Verdict (${passed}/8 passed) →` : `Answer all ${QUESTIONS.length - answered} remaining`}
      </button>
    </div>
  );
}