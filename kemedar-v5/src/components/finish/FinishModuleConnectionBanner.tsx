// @ts-nocheck
/**
 * Shows the 6-module integration diagram for Kemedar Finish™
 * Used on the Finish landing page and BOQ page
 */
export default function FinishModuleConnectionBanner() {
  const MODULES = [
    {
      icon: "🏠", name: "Kemedar", color: "border-orange-300 bg-orange-50 text-orange-700",
      points: ["Property linked", "FO supervision", "Finish™ badge", "Better listing after"],
    },
    {
      icon: "👷", name: "Kemework", color: "border-blue-300 bg-blue-50 text-blue-700",
      points: ["Pros hired per phase", "Tasks per phase", "Order tracking", "Phase reviews"],
    },
    {
      icon: "🛒", name: "Kemetro", color: "border-cyan-300 bg-cyan-50 text-cyan-700",
      points: ["BOQ → catalog match", "Bulk orders", "Delivery tracking", "Price comparison"],
    },
    {
      icon: "🔒", name: "Escrow™", color: "border-purple-300 bg-purple-50 text-purple-700",
      points: ["Project escrow", "Milestone payments", "FO gates releases", "Dispute resolution"],
    },
    {
      icon: "✨", name: "Vision™", color: "border-pink-300 bg-pink-50 text-pink-700",
      points: ["Daily photo AI", "Quality score", "Issue detection", "Snagging AI"],
    },
    {
      icon: "📈", name: "Predict™", color: "border-green-300 bg-green-50 text-green-700",
      points: ["New valuation", "Before/after", "Grade upgrade", "Negotiate position"],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <p className="font-black text-gray-900 mb-1">🔗 All 6 Modules Connected</p>
      <p className="text-xs text-gray-400 mb-4">Kemedar Finish™ orchestrates all platform modules into one seamless workflow</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MODULES.map(m => (
          <div key={m.name} className={`rounded-xl border-2 p-3 ${m.color}`}>
            <p className="font-black text-sm mb-1">{m.icon} {m.name}</p>
            <ul className="space-y-0.5">
              {m.points.map(p => (
                <li key={p} className="text-[10px] flex items-start gap-1">
                  <span className="mt-0.5">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}