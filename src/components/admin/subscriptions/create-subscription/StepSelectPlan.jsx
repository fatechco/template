import { CheckCircle } from "lucide-react";

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  color: "border-orange-400 bg-orange-50",  text: "text-orange-600" },
  kemework: { icon: "🔧", label: "Kemework", color: "border-teal-400 bg-teal-50",      text: "text-teal-600" },
  kemetro:  { icon: "🛒", label: "Kemetro",  color: "border-blue-400 bg-blue-50",      text: "text-blue-600" },
};

const TIER_COLORS = {
  free: "bg-gray-100 text-gray-600",
  basic: "bg-blue-100 text-blue-700",
  starter: "bg-cyan-100 text-cyan-700",
  bronze: "bg-yellow-100 text-yellow-700",
  silver: "bg-gray-100 text-gray-600",
  gold: "bg-amber-100 text-amber-700",
  professional: "bg-purple-100 text-purple-700",
  enterprise: "bg-red-100 text-red-700",
};

export default function StepSelectPlan({ modules, plans, selectedModule, selectedPlan, onSelectModule, onSelectPlan }) {
  const filteredPlans = selectedModule
    ? plans.filter(p => p.moduleId === selectedModule.id && p.isActive !== false)
    : [];

  return (
    <div className="space-y-5">
      {/* Module Selector */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">1. Select Module</p>
        <div className="grid grid-cols-3 gap-3">
          {modules.map(mod => {
            const meta = MODULE_META[mod.slug] || { icon: "📦", label: mod.name, color: "border-gray-300 bg-gray-50", text: "text-gray-700" };
            const isSelected = selectedModule?.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => onSelectModule(mod)}
                className={`border-2 rounded-xl p-4 text-center transition-all ${isSelected ? meta.color + " shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <div className="text-3xl mb-2">{meta.icon}</div>
                <p className={`text-sm font-black ${isSelected ? meta.text : "text-gray-700"}`}>{meta.label}</p>
                {isSelected && <CheckCircle size={14} className={`mx-auto mt-1 ${meta.text}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Plan Selector */}
      {selectedModule && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">2. Select Plan</p>
          {filteredPlans.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No active plans for this module</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredPlans.map(plan => {
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => onSelectPlan(plan)}
                    className={`border-2 rounded-xl p-4 text-left transition-all ${isSelected ? "border-orange-400 bg-orange-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-black text-gray-900 text-sm">{plan.name}</p>
                        {plan.tier && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TIER_COLORS[plan.tier] || "bg-gray-100 text-gray-600"}`}>
                            {plan.tier}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-600 text-lg">${plan.priceUSD}</p>
                        <p className="text-[10px] text-gray-400">/{plan.billingCycle || "mo"}</p>
                      </div>
                    </div>
                    {plan.features?.length > 0 && (
                      <ul className="space-y-0.5 mt-2">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">✓</span> {f}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-[10px] text-gray-400">+{plan.features.length - 3} more…</li>
                        )}
                      </ul>
                    )}
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1 text-orange-500 text-xs font-bold">
                        <CheckCircle size={12} /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}