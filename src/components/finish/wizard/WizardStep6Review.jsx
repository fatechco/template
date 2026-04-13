import { Loader2 } from "lucide-react";

const WHAT_HAPPENS = [
  { icon: "🤖", title: "AI generates complete BOQ", sub: "2–3 minutes" },
  { icon: "📋", title: "You review and approve the plan", sub: "At your pace" },
  { icon: "🛒", title: "Materials ordered from Kemetro", sub: "With one click" },
  { icon: "👷", title: "Professionals matched from Kemework", sub: "AI-ranked" },
  { icon: "🏠", title: "Work begins!", sub: "FO-supervised" },
];

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value || "—"}</span>
    </div>
  );
}

function formatMoney(n) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-EG").format(n) + " EGP";
}

export default function WizardStep6Review({ form, onLaunch }) {
  const LEVEL_RATES = { economy: 2250, standard: 4250, premium: 7250, luxury: 12000 };
  const estCost = (form.totalAreaSqm || 100) * (LEVEL_RATES[form.finishingLevel] || 4250);

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Ready to generate your project plan</h2>
      <p className="text-gray-500 text-sm mb-6">Review your details, then launch AI planning</p>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="font-black text-gray-900 mb-3 text-sm">📋 Project Summary</p>
        <Row label="Project Name" value={form.projectName} />
        <Row label="Address" value={form.propertyAddress} />
        <Row label="Type" value={`${form.projectType?.replace(/_/g, " ")} · ${form.propertyType}`} />
        <Row label="Area" value={`${form.totalAreaSqm} m²`} />
        <Row label="Rooms" value={`${form.numberOfRooms} beds · ${form.numberOfBathrooms} baths`} />
        <Row label="Style" value={form.designStyle?.charAt(0).toUpperCase() + form.designStyle?.slice(1)} />
        <Row label="Level" value={form.finishingLevel?.charAt(0).toUpperCase() + form.finishingLevel?.slice(1)} />
        <Row label="Budget" value={formatMoney(form.estimatedBudget)} />
        <Row label="AI Cost Estimate" value={`~${formatMoney(estCost)}`} />
        <Row label="FO Supervision" value={form.requiresFOSupervision ? "✅ Yes" : "Self-managed"} />
      </div>

      {/* What happens next */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <p className="font-black text-gray-900 mb-4 text-sm">What happens next:</p>
        <div className="space-y-3">
          {WHAT_HAPPENS.map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm">{w.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{w.title}</p>
                <p className="text-xs text-gray-400">{w.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onLaunch}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg"
      >
        🚀 Generate My Project Plan
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">This will create your project and generate a complete BOQ using AI</p>
    </div>
  );
}