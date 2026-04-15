// @ts-nocheck
const PAYMENT_TERMS = ["Cash", "Bank Transfer", "Installment", "Open to discuss"];

export default function RFQStep2({ form, update }) {
  const togglePayment = (t) => {
    const arr = form.payment_terms.includes(t)
      ? form.payment_terms.filter((x) => x !== t)
      : [...form.payment_terms, t];
    update({ payment_terms: arr });
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">Timeline & Notes</p>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Required By Date</label>
        <input
          type="date"
          min={minDate}
          value={form.required_by}
          onChange={(e) => update({ required_by: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 bg-white"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Payment Terms Preference</label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_TERMS.map((t) => {
            const sel = form.payment_terms.includes(t);
            return (
              <button
                key={t}
                onClick={() => togglePayment(t)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                  sel ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Additional Notes (optional)</label>
        <textarea
          rows={4}
          placeholder="Any special requirements, certifications needed, packaging preferences, etc."
          value={form.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Specification Document (optional)</label>
        <label className="flex items-center gap-3 w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer bg-gray-50 active:bg-gray-100">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-bold text-gray-700">
              {form.spec_doc_url ? "Document attached ✓" : "Upload specification document"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX, Excel up to 10MB</p>
          </div>
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={(e) => {
            if (e.target.files[0]) update({ spec_doc_url: e.target.files[0].name });
          }} />
        </label>
      </div>
    </div>
  );
}