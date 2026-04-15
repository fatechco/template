"use client";
// @ts-nocheck
import { useState } from "react";
import { CheckCircle } from "lucide-react";

const MODULE_META = {
  kemedar:  { icon: "🏠", label: "Kemedar",  color: "bg-orange-100 text-orange-700" },
  kemework: { icon: "🔧", label: "Kemework", color: "bg-teal-100 text-teal-700" },
  kemetro:  { icon: "🛒", label: "Kemetro",  color: "bg-blue-100 text-blue-700" },
};

const TYPE_CONFIG = {
  one_time:     { label: "One-Time",    color: "bg-purple-100 text-purple-700" },
  recurring:    { label: "Recurring",   color: "bg-blue-100 text-blue-700" },
  custom_quote: { label: "Custom Quote",color: "bg-yellow-100 text-yellow-700" },
};

export default function SOStepSelectService({ modules, services, selectedService, onSelect }) {
  const [moduleFilter, setModuleFilter] = useState("all");
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const filtered = services.filter(s => {
    if (!s.isActive && s.isActive !== undefined) return false;
    if (moduleFilter === "all") return true;
    return moduleById[s.moduleId]?.slug === moduleFilter;
  });

  return (
    <div className="space-y-4">
      {/* Module Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[{ key: "all", label: "All" }, ...modules.map(m => ({ key: m.slug, label: m.name }))].map(tab => (
          <button key={tab.key} onClick={() => setModuleFilter(tab.key)}
            className={`px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              moduleFilter === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-10">No active services found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {filtered.map(svc => {
            const mod = moduleById[svc.moduleId];
            const modMeta = MODULE_META[mod?.slug] || { icon: "📦", label: mod?.name || "—", color: "bg-gray-100 text-gray-600" };
            const typeCfg = TYPE_CONFIG[svc.serviceType] || { label: svc.serviceType, color: "bg-gray-100 text-gray-600" };
            const isSelected = selectedService?.id === svc.id;
            return (
              <button key={svc.id} onClick={() => onSelect(svc)}
                className={`border-2 rounded-xl p-4 text-left transition-all ${isSelected ? "border-orange-400 bg-orange-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{svc.icon || "📦"}</span>
                    <div>
                      <p className="font-black text-gray-900 text-sm leading-tight">{svc.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${modMeta.color}`}>{modMeta.icon} {modMeta.label}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${typeCfg.color}`}>{typeCfg.label}</span>
                </div>
                {svc.shortDescription && (
                  <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">{svc.shortDescription}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-black text-orange-600 text-sm">
                    {svc.serviceType === "custom_quote"
                      ? "Custom Price"
                      : svc.basePrice != null
                        ? `$${svc.basePrice}${svc.priceUnit ? ` / ${svc.priceUnit}` : ""}`
                        : svc.pricingTiers?.length > 0
                          ? `From $${svc.pricingTiers[0].price}`
                          : "—"
                    }
                  </span>
                  {isSelected && <CheckCircle size={14} className="text-orange-500" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}