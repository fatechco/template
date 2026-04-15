"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";

const ROLE_GROUPS = {
  "Floor Materials": ["primary_floor_tile", "accent_floor_tile"],
  "Wall Materials": ["primary_wall_tile", "accent_wall_tile", "paint_wall", "waterproofing"],
  "Ceiling": ["paint_ceiling"],
  "Adhesives & Grout": ["adhesive", "grout"],
  "Fixtures": ["fixture_toilet", "fixture_sink", "fixture_bathtub", "fixture_shower", "fixture_vanity", "fixture_mirror", "fixture_lighting"],
  "Finishing": ["skirting_baseboard"],
  "Consumables": ["consumable"],
  "Optional Decor": ["decor_optional"],
};

function groupItems(boq) {
  const groups = {};
  const usedIds = new Set();
  for (const [groupName, roles] of Object.entries(ROLE_GROUPS)) {
    const matching = boq.filter(item => roles.includes(item.role) && !usedIds.has(item.id));
    if (matching.length > 0) {
      groups[groupName] = matching;
      matching.forEach(i => usedIds.add(i.id));
    }
  }
  const uncategorized = boq.filter(i => !usedIds.has(i.id));
  if (uncategorized.length > 0) groups["Other"] = uncategorized;
  return groups;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=80&q=60";

function BOQItemRow({ item, excluded, onToggle, prevQty }) {
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(item.finalQty);

  useEffect(() => {
    if (prevRef.current !== item.finalQty) {
      setFlash(true);
      prevRef.current = item.finalQty;
      const t = setTimeout(() => setFlash(false), 400);
      return () => clearTimeout(t);
    }
  }, [item.finalQty]);

  const isExcluded = excluded[item.id];

  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 transition-opacity ${isExcluded ? "opacity-40" : ""}`}>
      {item.isOptional && (
        <input
          type="checkbox"
          checked={!isExcluded}
          onChange={() => onToggle(item.id)}
          className="w-4 h-4 rounded accent-blue-600 flex-shrink-0 cursor-pointer"
        />
      )}
      <img
        src={item.productImageUrl || FALLBACK_IMG}
        alt={item.productName}
        className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-gray-100"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-gray-900 truncate">{item.productName}</p>
          {item.isOptional && (
            <span className="text-[9px] bg-gray-100 text-gray-400 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
              Optional
            </span>
          )}
        </div>
        <p className="text-blue-500 text-[11px] italic mt-0.5 truncate">{item.breakdown}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-bold text-sm text-gray-900 transition-all ${flash ? "text-blue-600 scale-110" : ""}`}>
          {item.finalQty} <span className="text-gray-400 font-normal text-xs">units</span>
        </p>
        <p className={`font-bold text-sm text-blue-600 transition-all ${flash ? "opacity-0" : ""}`}
          style={{ transition: flash ? "none" : "opacity 0.4s" }}>
          {item.subtotal.toLocaleString()} EGP
        </p>
      </div>
    </div>
  );
}

export default function KemeKitBOQList({ boq, excluded, onToggle }) {
  const [collapsed, setCollapsed] = useState({});
  const groups = groupItems(boq);

  const toggle = (group) => setCollapsed(c => ({ ...c, [group]: !c[group] }));

  return (
    <div className="divide-y divide-gray-100">
      {Object.entries(groups).map(([groupName, groupItems]) => {
        const groupTotal = groupItems
          .filter(i => !excluded[i.id])
          .reduce((s, i) => s + i.subtotal, 0);
        const isCollapsed = collapsed[groupName];

        return (
          <div key={groupName}>
            <button
              onClick={() => toggle(groupName)}
              className="w-full flex items-center justify-between px-0 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{isCollapsed ? "▶" : "▼"}</span>
                <span className="font-bold text-sm text-gray-700">
                  {groupName} <span className="text-gray-400 font-normal text-xs">({groupItems.length})</span>
                </span>
              </div>
              <span className="text-sm font-bold text-blue-600">{groupTotal.toLocaleString()} EGP</span>
            </button>

            {!isCollapsed && (
              <div className="pl-2">
                {groupItems.map(item => (
                  <BOQItemRow
                    key={item.id}
                    item={item}
                    excluded={excluded}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}