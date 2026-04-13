const BUDGET_TYPES = [
  { id: "fixed", label: "Fixed Budget" },
  { id: "open",  label: "Open to Quotes" },
];

export default function TaskStep2({ form, update }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <p className="font-black text-gray-900 text-base">Budget & Timeline</p>

      {/* Budget type */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Budget Type</label>
        <div className="flex gap-3">
          {BUDGET_TYPES.map((b) => (
            <button
              key={b.id}
              onClick={() => update({ budget_type: b.id })}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                form.budget_type === b.id
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {form.budget_type === "fixed" && (
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">Budget Amount</label>
          <div className="flex gap-2">
            <select
              value={form.currency_id}
              onChange={(e) => update({ currency_id: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white w-24"
            >
              {["USD", "EGP", "AED", "SAR"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="Your budget"
              value={form.budget}
              onChange={(e) => update({ budget: e.target.value })}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>
      )}

      {/* Deadline */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Deadline</label>
        <input
          type="date"
          min={minDate}
          value={form.deadline}
          onChange={(e) => update({ deadline: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 bg-white"
        />
      </div>

      {/* Toggles */}
      {[
        { key: "is_urgent",   label: "Urgent Task",       sub: "Adds an urgent badge — gets faster responses" },
        { key: "is_private",  label: "Private Task",      sub: "Only visible to accredited professionals" },
        { key: "is_biddable", label: "Allow Bidding",     sub: "Professionals can submit quotes for this task" },
      ].map(({ key, label, sub }) => (
        <div key={key} className="flex items-center justify-between py-3 border-t border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
          <button
            onClick={() => update({ [key]: !form[key] })}
            className={`w-12 h-6 rounded-full transition-colors relative ${form[key] ? "bg-orange-600" : "bg-gray-200"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? "left-7" : "left-1"}`} />
          </button>
        </div>
      ))}

      <div className="bg-green-50 rounded-2xl p-4 text-sm text-green-700 font-medium">
        🎯 Once posted, professionals near your location will see your task and reach out.
      </div>
    </div>
  );
}