import { useState } from "react";

const RULE_OPTIONS = [
  { value: "floor_sqm", label: "Floor Area", emoji: "📐", desc: "Qty depends on floor length × width", eg: "tiles, flooring, waterproofing" },
  { value: "wall_sqm", label: "Wall Area", emoji: "🧱", desc: "Qty depends on net wall area (minus doors and windows)", eg: "wall tiles, wall paint" },
  { value: "fixed_quantity", label: "Fixed Quantity", emoji: "🔢", desc: "Always the same qty — e.g. 1 toilet", eg: "fixtures, single items" },
  { value: "linear_meter", label: "Perimeter (Linear Meter)", emoji: "📏", desc: "Qty depends on room perimeter", eg: "skirting boards, edge trims" },
  { value: "ratio_to_parent", label: "Ratio to Another Item", emoji: "🔗", desc: "Qty depends on another item's final qty", eg: "grout depends on tile qty" },
  { value: "floor_wall_sqm", label: "Floor + Wall Area", emoji: "🔲", desc: "Combined floor and wall area", eg: "waterproof membrane" },
  { value: "ceiling_sqm", label: "Ceiling Area", emoji: "⬆️", desc: "Qty depends on ceiling area", eg: "ceiling paint" },
];

const COVERAGE_LABELS = {
  floor_sqm: "sqm per unit",
  wall_sqm: "sqm per unit",
  ceiling_sqm: "sqm per unit",
  floor_wall_sqm: "sqm per unit",
  linear_meter: "linear meters per unit",
};

const DEMO = { length: 3, width: 2, height: 2.8, doors: 1, windows: 1 };

function calcPreview(item, allItems) {
  const floor = DEMO.length * DEMO.width;
  const grossWall = (2 * DEMO.length * DEMO.height) + (2 * DEMO.width * DEMO.height);
  const netWall = grossWall - (DEMO.doors * 1.6) - (DEMO.windows * 1.4);
  const ceil = floor;
  const perim = (2 * (DEMO.length + DEMO.width)) - (DEMO.doors * 0.9);

  let base = 0;
  const cov = item.coveragePerUnit || 1;
  switch (item.calculationRule) {
    case "floor_sqm": base = floor / cov; break;
    case "wall_sqm": base = netWall / cov; break;
    case "ceiling_sqm": base = ceil / cov; break;
    case "floor_wall_sqm": base = (floor + netWall) / cov; break;
    case "linear_meter": base = perim / cov; break;
    case "fixed_quantity": base = item.fixedQuantity || 0; break;
    case "ratio_to_parent": {
      const parent = allItems.find(i => i.id === item.parentItemId);
      if (parent) {
        const parentPreview = calcPreview(parent, allItems);
        base = parentPreview.finalQty * (item.ratioMultiplier || 0);
      }
      break;
    }
  }
  const withWaste = base * (1 + (item.wasteMarginPercent || 0) / 100);
  const finalQty = Math.ceil(withWaste);
  const subtotal = finalQty * (item.productPriceEGP || 0);
  return { finalQty, subtotal };
}

function RuleCard({ item, index, onChange, allItems }) {
  const [open, setOpen] = useState(!item.calculationRule);
  const preview = item.calculationRule ? calcPreview(item, allItems) : null;

  const set = (key, val) => onChange(index, key, val);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
      >
        <img
          src={item.productImageUrl || "https://images.unsplash.com/photo-1585770536735-27993a252541?w=80&q=60"}
          alt=""
          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-gray-900">{item.productName}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {item.role?.replace(/_/g, " ") || "No role set"}
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.calculationRule ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          {item.calculationRule ? "✅ Rules set" : "⚠️ Needs rules"}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
          {/* Rule Type */}
          <div>
            <label className="text-xs font-black text-gray-700 block mb-2">Calculation Rule *</label>
            <div className="grid grid-cols-2 gap-2">
              {RULE_OPTIONS.map(rule => (
                <button
                  key={rule.value}
                  onClick={() => set("calculationRule", rule.value)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    item.calculationRule === rule.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <p className="text-sm font-bold text-gray-900">{rule.emoji} {rule.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{rule.desc}</p>
                  <p className="text-[10px] text-blue-500 mt-0.5">e.g. {rule.eg}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Coverage */}
          {["floor_sqm","wall_sqm","ceiling_sqm","floor_wall_sqm","linear_meter"].includes(item.calculationRule) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Coverage per unit ({COVERAGE_LABELS[item.calculationRule]})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.coveragePerUnit || ""}
                  onChange={e => set("coveragePerUnit", parseFloat(e.target.value) || null)}
                  placeholder="e.g. 1.44"
                  className="field-input"
                />
                <p className="text-[10px] text-gray-400 mt-1">e.g. 1.44 sqm per box of 60×60 tiles</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Waste margin: <span className="text-blue-600">{item.wasteMarginPercent || 10}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={item.wasteMarginPercent ?? 10}
                  onChange={e => set("wasteMarginPercent", parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <p className="text-[10px] text-gray-400 mt-1">Adding {item.wasteMarginPercent ?? 10}% buffer — industry standard</p>
              </div>
            </div>
          )}

          {/* Fixed Quantity */}
          {item.calculationRule === "fixed_quantity" && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Fixed Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => set("fixedQuantity", Math.max(1, (item.fixedQuantity || 1) - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >−</button>
                <span className="text-xl font-black">{item.fixedQuantity || 1}</span>
                <button
                  onClick={() => set("fixedQuantity", (item.fixedQuantity || 1) + 1)}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >+</button>
              </div>
              <p className="text-xs text-gray-400 mt-1">This quantity is always added regardless of room size</p>
            </div>
          )}

          {/* Ratio to Parent */}
          {item.calculationRule === "ratio_to_parent" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Parent Item</label>
                <select
                  value={item.parentItemId || ""}
                  onChange={e => set("parentItemId", e.target.value)}
                  className="field-input"
                >
                  <option value="">Select parent item...</option>
                  {allItems.filter(i => i.id !== item.id && i.calculationRule !== "ratio_to_parent").map(i => (
                    <option key={i.id} value={i.id}>{i.productName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Ratio Multiplier</label>
                <input
                  type="number"
                  step="0.01"
                  value={item.ratioMultiplier || ""}
                  onChange={e => set("ratioMultiplier", parseFloat(e.target.value) || null)}
                  placeholder="e.g. 0.25"
                  className="field-input"
                />
                <p className="text-[10px] text-gray-400 mt-1">e.g. 0.25 bags per 1 unit of parent</p>
              </div>
            </div>
          )}

          {/* Optional Toggle */}
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-800">🔘 This item is optional</p>
              <p className="text-[10px] text-gray-400">Buyers can uncheck this if they don't need it</p>
            </div>
            <button
              onClick={() => set("isOptional", !item.isOptional)}
              className={`w-10 h-6 rounded-full transition-colors ${item.isOptional ? "bg-blue-500" : "bg-gray-200"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${item.isOptional ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Live Preview */}
          {preview && item.calculationRule && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-700 mb-1">
                For a {DEMO.length}×{DEMO.width}m room, this item would be:
              </p>
              <p className="text-lg font-black text-blue-800">{preview.finalQty} units</p>
              <p className="text-xs text-orange-500 font-bold">= {preview.subtotal.toLocaleString()} EGP</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Step3Rules({ items, onChange }) {
  const updateItem = (index, key, val) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  };

  const allRulesSet = items.every(i => i.calculationRule);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-blue-800">
          ℹ️ Quantities are calculated using pure architectural math — no guessing.
          Set the rule once and the system does the rest forever.
        </p>
      </div>

      {!allRulesSet && (
        <p className="text-xs text-orange-500 font-bold">
          ⚠️ {items.filter(i => !i.calculationRule).length} item(s) still need calculation rules
        </p>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => (
          <RuleCard
            key={item.id}
            item={item}
            index={idx}
            onChange={updateItem}
            allItems={items}
          />
        ))}
      </div>
    </div>
  );
}