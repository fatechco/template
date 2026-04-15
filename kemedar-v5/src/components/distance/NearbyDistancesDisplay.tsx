"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { queueRequest } from "@/lib/api-queue";

const CAT_LABELS = {
  transport: "🚇 TRANSPORT", education: "🎓 EDUCATION", health: "🏥 HEALTH",
  shopping: "🛒 SHOPPING", recreation: "🌳 RECREATION", services: "🏛️ SERVICES", religion: "🕌 RELIGION",
};
const CAT_ORDER = ["transport", "education", "health", "shopping", "recreation", "services", "religion"];
const MODE_LABELS = { walking: "🚶 Walking", driving: "🚗 Driving", public_transport: "🚌 Transit" };

export default function NearbyDistancesDisplay({ entityType = "property", entityId, staticItems }) {
  const [items, setItems] = useState([]);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (staticItems) { setItems(staticItems); setLoading(false); return; }
  }, [staticItems]);

  useEffect(() => {
    if (staticItems || !entityId) { setLoading(false); return; }

    // Dynamic entity replaced with API call
    const endpoint = entityType === "property" ? "/api/v1/properties" : "/api/v1/construction/projects";
    const filterKey = entityType === "property" ? "propertyId" : "projectId";

    Promise.all([
      queueRequest(() => Entity.filter({ [filterKey]: entityId })),
      queueRequest(() => apiClient.get("/api/v1/" + "distancefield", "sortOrder", 200)),
    ]).then(([distItems, distFields]) => {
      setItems(distItems || []);
      const map = {};
      (distFields || []).forEach(f => { map[f.id] = f; });
      setFields(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [entityId, entityType]);

  if (loading || items.length === 0) return null;

  // Enrich items with field data — staticItems already have field embedded
  const enriched = items
    .map(it => ({ ...it, field: it.field || fields[it.distanceFieldId] }))
    .filter(it => it.field);

  if (enriched.length === 0) return null;

  const grouped = CAT_ORDER
    .map(cat => ({ cat, items: enriched.filter(it => it.field.category === cat) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 text-lg mb-1">📍 Nearby Distances</h3>
      <div className="w-[30px] h-[2px] bg-[#FF6B00] rounded mb-5" />

      <div className="space-y-5">
        {grouped.map(({ cat, items: catItems }) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2 pl-2" style={{ borderLeft: "2px solid #FF6B00" }}>
              <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{CAT_LABELS[cat]}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {catItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-[#F8FAFC] rounded-[10px] px-3.5 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl flex-shrink-0">{item.field.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-gray-800 truncate">{item.field.name}</p>
                      {item.field.nameAr && <p className="text-[11px] text-gray-400 truncate" dir="rtl">{item.field.nameAr}</p>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-[15px] font-bold text-[#FF6B00]">
                      {item.distanceValue} {item.distanceUnit}
                    </p>
                    {item.distanceUnit === "min" && item.transportMode && (
                      <p className="text-[11px] text-gray-400">{MODE_LABELS[item.transportMode] || item.transportMode}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}