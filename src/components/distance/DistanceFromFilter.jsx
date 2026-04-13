import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function DistanceFromFilter({ filters, onChange }) {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    base44.entities.DistanceField.list("sortOrder", 200).then(data => {
      setFields((data || []).filter(f => f.isActive !== false));
    }).catch(() => {});
  }, []);

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="space-y-2.5">
      <select
        value={filters.distanceFieldId || ""}
        onChange={e => set("distanceFieldId", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
      >
        <option value="">Select distance type</option>
        {fields.map(f => (
          <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
        ))}
      </select>
      {filters.distanceFieldId && (
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Max distance"
            value={filters.distanceMax || ""}
            onChange={e => set("distanceMax", e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
          <select
            value={filters.distanceUnit || "km"}
            onChange={e => set("distanceUnit", e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white focus:outline-none focus:border-orange-400 w-16"
          >
            <option value="km">km</option>
            <option value="m">m</option>
            <option value="min">min</option>
          </select>
        </div>
      )}
    </div>
  );
}