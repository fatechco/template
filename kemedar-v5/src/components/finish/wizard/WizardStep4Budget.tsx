// @ts-nocheck
const PRESETS = [
  { label: "Under 200K", value: 150000 },
  { label: "200K–500K", value: 350000 },
  { label: "500K–1M", value: 750000 },
  { label: "1M+", value: 1500000 },
];

const LEVEL_RATES = {
  economy: { min: 1500, max: 3000 },
  standard: { min: 3000, max: 5500 },
  premium: { min: 5500, max: 9000 },
  luxury: { min: 9000, max: 15000 },
};

function formatNum(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function WizardStep4Budget({ form, update }) {
  const rates = LEVEL_RATES[form.finishingLevel] || LEVEL_RATES.standard;
  const minEst = form.totalAreaSqm * rates.min;
  const maxEst = form.totalAreaSqm * rates.max;
  const midEst = (minEst + maxEst) / 2;
  const budgetOk = form.estimatedBudget >= midEst * 0.8;

  const today = new Date();
  const defaultStart = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Set your budget & timeline</h2>
      <p className="text-gray-500 text-sm mb-6">Help us plan the right scope for your project</p>

      {/* Budget */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="font-bold text-gray-900 mb-4 text-sm">My Total Budget (EGP)</p>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => update({ estimatedBudget: p.value })}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${form.estimatedBudget === p.value ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-orange-200"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-bold text-gray-500">EGP</span>
          <input
            type="number"
            value={form.estimatedBudget}
            onChange={e => update({ estimatedBudget: Number(e.target.value) })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-orange-400 text-gray-900"
          />
        </div>

        {/* AI Estimate preview */}
        <div className={`rounded-xl border p-4 mt-3 ${budgetOk ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
          <p className="text-xs font-bold text-gray-600 mb-2">AI BOQ Estimate for {form.finishingLevel} level ({form.totalAreaSqm}m²):</p>
          <div className="space-y-1 mb-2">
            {Object.entries(LEVEL_RATES).map(([level, r]) => (
              <div key={level} className={`flex items-center gap-2 text-xs ${level === form.finishingLevel ? "font-black text-orange-700" : "text-gray-500"}`}>
                <span className={`w-2 h-2 rounded-full ${level === form.finishingLevel ? "bg-orange-500" : "bg-gray-300"}`} />
                {level.charAt(0).toUpperCase() + level.slice(1)}: {formatNum(form.totalAreaSqm * r.min)} – {formatNum(form.totalAreaSqm * r.max)} EGP
                {level === form.finishingLevel && " ← your level"}
              </div>
            ))}
          </div>
          <p className={`text-xs font-bold ${budgetOk ? "text-green-700" : "text-yellow-700"}`}>
            {budgetOk ? "✅ Budget looks sufficient for your selections" : `⚠️ Budget may be tight. Minimum realistic: ${formatNum(minEst)} EGP`}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="font-bold text-gray-900 mb-4 text-sm">Project Timeline</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Start Date</label>
            <input
              type="date"
              value={form.startDate || defaultStart}
              onChange={e => update({ startDate: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Target End Date</label>
            <input
              type="date"
              value={form.estimatedEndDate || ""}
              onChange={e => update({ estimatedEndDate: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
          <p className="font-bold mb-1">📅 AI Timeline Estimate:</p>
          <p>Based on your {form.totalAreaSqm}m² property ({form.finishingLevel} finish), estimated duration: <strong>{form.finishingLevel === "luxury" ? "16–20" : form.finishingLevel === "premium" ? "12–16" : form.finishingLevel === "standard" ? "8–12" : "6–10"} weeks</strong></p>
        </div>
      </div>
    </div>
  );
}