"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const CAT_LABELS = {
  transport: "🚇 Transport", education: "🎓 Education", health: "🏥 Health",
  shopping: "🛒 Shopping", recreation: "🌳 Recreation", services: "🏛️ Services", religion: "🕌 Religion",
};
const CAT_ORDER = ["transport", "education", "health", "shopping", "recreation", "services", "religion"];

export default function NearbyDistancesInput({ distances, onChange, mode = "property" }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    apiClient.get("/api/v1/" + "distancefield", "sortOrder", 200).then(data => {
      const filtered = (data || []).filter(f =>
        f.isActive !== false &&
        (mode === "property" ? f.enableForProperty !== false : f.enableForProject !== false)
      );
      setFields(filtered);
      // Auto-expand first category
      if (filtered.length > 0) {
        setExpanded({ [filtered[0].category]: true });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [mode]);

  const grouped = CAT_ORDER
    .map(cat => ({ cat, items: fields.filter(f => f.category === cat) }))
    .filter(g => g.items.length > 0);

  const getVal = (fieldId) => (distances || {})[fieldId] || {};
  const setVal = (fieldId, patch) => {
    const cur = { ...((distances || {})[fieldId] || {}) };
    const next = { ...cur, ...patch };
    // Remove empty
    if (!next.value && next.value !== 0) {
      const copy = { ...(distances || {}) };
      delete copy[fieldId];
      onChange(copy);
    } else {
      onChange({ ...(distances || {}), [fieldId]: next });
    }
  };

  const filledCount = (cat) => {
    const catFields = fields.filter(f => f.category === cat);
    return catFields.filter(f => (distances || {})[f.id]?.value).length;
  };

  if (loading) return (
    <div className="flex items-center gap-2 py-4 justify-center">
      <div className="w-4 h-4 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-gray-400">Loading distances...</span>
    </div>
  );

  if (fields.length === 0) return null;

  return (
    <div className="bg-white rounded-[14px] border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeft: "3px solid #FF6B00" }}>
      <div className="p-5">
        <h3 className="font-bold text-base text-gray-900 mb-1">📍 Nearby Distances</h3>
        <p className="text-[13px] text-gray-500">Enter distances to nearby landmarks and services (optional)</p>
      </div>
      <div className="px-5 pb-5 space-y-2">
        {grouped.map(({ cat, items }) => {
          const open = expanded[cat];
          const filled = filledCount(cat);
          return (
            <div key={cat} className="rounded-xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setExpanded(e => ({ ...e, [cat]: !e[cat] }))}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-gray-100 transition-colors"
              >
                <span className="text-[13px] font-bold text-gray-800">{CAT_LABELS[cat]}</span>
                <div className="flex items-center gap-2">
                  {filled > 0 && (
                    <span className="text-[11px] text-gray-400">{filled} of {items.length} filled</span>
                  )}
                  {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </div>
              </button>
              {open && (
                <div className="p-3 space-y-2.5">
                  {items.map(field => {
                    const val = getVal(field.id);
                    const hasValue = val.value > 0;
                    return (
                      <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        {/* Label */}
                        <div className="sm:w-[40%] flex items-center gap-2 min-w-0">
                          <span className="text-lg flex-shrink-0">{field.icon}</span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-800 truncate">{field.name}</p>
                            {field.nameAr && <p className="text-[11px] text-gray-400 truncate" dir="rtl">{field.nameAr}</p>}
                          </div>
                          {hasValue && <Check size={14} className="text-green-500 flex-shrink-0" />}
                        </div>
                        {/* Inputs */}
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="e.g. 2.5"
                            value={val.value || ""}
                            onChange={e => setVal(field.id, { value: parseFloat(e.target.value) || "", unit: val.unit || "km" })}
                            className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:border-orange-400"
                          />
                          <select
                            value={val.unit || "km"}
                            onChange={e => setVal(field.id, { unit: e.target.value })}
                            className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 w-16"
                          >
                            <option value="km">km</option>
                            <option value="m">m</option>
                            <option value="min">min</option>
                          </select>
                          {(val.unit === "min") && (
                            <select
                              value={val.transportMode || "driving"}
                              onChange={e => setVal(field.id, { transportMode: e.target.value })}
                              className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 w-24"
                            >
                              <option value="walking">🚶 Walk</option>
                              <option value="driving">🚗 Drive</option>
                              <option value="public_transport">🚌 Transit</option>
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}