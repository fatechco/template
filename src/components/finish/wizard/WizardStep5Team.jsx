export default function WizardStep5Team({ form, update }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Add a Franchise Owner (Optional)</h2>
      <p className="text-gray-500 text-sm mb-6">A local FO provides on-site quality control and dispute mediation</p>

      {/* Recommendation */}
      <div className="bg-white rounded-2xl border-2 border-orange-300 p-5 mb-4">
        <p className="font-black text-gray-900 mb-3 text-sm">🗺️ We recommend adding a Franchise Owner for this project</p>
        <div className="space-y-2 mb-4">
          {["On-site quality inspections", "Local contractor verification", "Dispute mediation", "Keys handover witness", "Faster issue resolution"].map(b => (
            <div key={b} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500 font-bold">✅</span> {b}
            </div>
          ))}
        </div>

        {/* Mock FO card */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">👤</div>
            <div className="flex-1">
              <p className="font-black text-gray-900">Ahmed Franchise Owner</p>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">Franchise Owner — New Cairo</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">⭐ 4.9</p>
              <p className="text-xs text-gray-500">24 projects</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Response time: ~2 hours</span>
            <span>FO fee: 3% of project value</span>
          </div>
          <button
            onClick={() => update({ requiresFOSupervision: true, franchiseOwnerId: "fo_mock_001" })}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${form.requiresFOSupervision ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
          >
            {form.requiresFOSupervision ? "✅ FO Added to Project" : "✅ Add This FO to My Project"}
          </button>
        </div>

        <button
          onClick={() => update({ requiresFOSupervision: false, franchiseOwnerId: null })}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Skip — Handle Myself
        </button>
      </div>

      {form.requiresFOSupervision && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
          <p className="font-bold">✅ FO supervision added</p>
          <p className="text-xs mt-1">Ahmed will be notified once your project is created and will contact you to schedule the first inspection.</p>
        </div>
      )}
    </div>
  );
}