"use client";
// @ts-nocheck
import { useState } from "react";
import { CheckCircle, XCircle, Copy, Check } from "lucide-react";

const DEMO = { length: 3, width: 2, height: 2.8, doors: 1, windows: 1 };
const DEMO_BIG = { length: 5, width: 4 };

function calcDemoTotal(items, length, width) {
  const height = DEMO.height;
  const floor = length * width;
  const grossWall = (2 * length * height) + (2 * width * height);
  const netWall = grossWall - (DEMO.doors * 1.6) - (DEMO.windows * 1.4);
  const ceil = floor;
  const perim = (2 * (length + width)) - (DEMO.doors * 0.9);
  let total = 0;
  const itemQtys = new Map();

  for (const item of items.filter(i => i.calculationRule !== "ratio_to_parent")) {
    const cov = item.coveragePerUnit || 1;
    let base = 0;
    switch (item.calculationRule) {
      case "floor_sqm": base = floor / cov; break;
      case "wall_sqm": base = netWall / cov; break;
      case "ceiling_sqm": base = ceil / cov; break;
      case "floor_wall_sqm": base = (floor + netWall) / cov; break;
      case "linear_meter": base = perim / cov; break;
      case "fixed_quantity": base = item.fixedQuantity || 0; break;
    }
    const finalQty = Math.ceil(base * (1 + (item.wasteMarginPercent || 0) / 100));
    itemQtys.set(item.id, finalQty);
    if (!item.isOptional) total += finalQty * (item.productPriceEGP || 0);
  }
  for (const item of items.filter(i => i.calculationRule === "ratio_to_parent")) {
    const parentQty = itemQtys.get(item.parentItemId) || 0;
    const finalQty = Math.ceil(parentQty * (item.ratioMultiplier || 0) * (1 + (item.wasteMarginPercent || 0) / 100));
    itemQtys.set(item.id, finalQty);
    if (!item.isOptional) total += finalQty * (item.productPriceEGP || 0);
  }
  return total;
}

export default function Step4Publish({ data, items, commissionPercent, slug, onSubmit, submitting }) {
  const [copied, setCopied] = useState(false);
  const [testLength, setTestLength] = useState(3);
  const [testWidth, setTestWidth] = useState(2);

  const total3x2 = calcDemoTotal(items, 3, 2);
  const total5x4 = calcDemoTotal(items, 5, 4);
  const liveTotal = calcDemoTotal(items, testLength, testWidth);

  const commission3x2 = (total3x2 * (commissionPercent || 3)) / 100;
  const commission5x4 = (total5x4 * (commissionPercent || 3)) / 100;

  const shareUrl = `${window.location.origin}/kemetro/kemekits/${slug || "my-kit"}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CHECKLIST = [
    { label: "Hero image uploaded", ok: !!data.heroImageUrl },
    { label: "Title and room type set", ok: !!(data.title && data.roomType) },
    { label: "At least 3 products added", ok: items.length >= 3 },
    { label: "All required items have calculation rules", ok: items.filter(i => !i.isOptional).every(i => i.calculationRule) },
    { label: "Labor rate per sqm set", ok: !!(data.baseLaborRatePerSqmEGP > 0) },
  ];

  const allOk = CHECKLIST.every(c => c.ok);

  return (
    <div className="space-y-5">
      {/* Live Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" /> Live Kit Preview
        </h3>
        <p className="text-xs text-gray-500 mb-4">Test with different dimensions to see how your kit calculates</p>
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-600 font-bold">Length (m)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={testLength}
              onChange={e => setTestLength(parseFloat(e.target.value) || 1)}
              className="block field-input mt-1 w-24"
            />
          </div>
          <div className="mt-4 text-gray-400 font-bold">×</div>
          <div>
            <label className="text-xs text-gray-600 font-bold">Width (m)</label>
            <input
              type="number"
              step="0.5"
              min="1"
              value={testWidth}
              onChange={e => setTestWidth(parseFloat(e.target.value) || 1)}
              className="block field-input mt-1 w-24"
            />
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">Est. materials:</p>
            <p className="text-xl font-black text-blue-600">{liveTotal.toLocaleString()} EGP</p>
          </div>
        </div>
        {items.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 max-h-48 overflow-y-auto space-y-1">
            {items.map(item => {
              const floor = testLength * testWidth;
              const grossWall = (2 * testLength * DEMO.height) + (2 * testWidth * DEMO.height);
              const netWall = grossWall - (DEMO.doors * 1.6) - (DEMO.windows * 1.4);
              const ceil = floor;
              const perim = (2 * (testLength + testWidth)) - (DEMO.doors * 0.9);
              let base = 0;
              const cov = item.coveragePerUnit || 1;
              switch (item.calculationRule) {
                case "floor_sqm": base = floor / cov; break;
                case "wall_sqm": base = netWall / cov; break;
                case "ceiling_sqm": base = ceil / cov; break;
                case "floor_wall_sqm": base = (floor + netWall) / cov; break;
                case "linear_meter": base = perim / cov; break;
                case "fixed_quantity": base = item.fixedQuantity || 0; break;
                default: base = 0;
              }
              const finalQty = Math.ceil(base * (1 + (item.wasteMarginPercent || 0) / 100));
              return (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 truncate">{item.productName}</span>
                  <span className="font-bold text-gray-900 ml-2 flex-shrink-0">
                    {item.calculationRule ? `${finalQty} units` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Commission Card */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <h3 className="font-black text-green-800 text-sm mb-3">💰 Your Earning Potential</h3>
        <p className="text-xs text-green-600 mb-3">You earn {commissionPercent || 3}% on every material sale</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">3m × 2m room</p>
            <p className="text-lg font-black text-green-600">~{commission3x2.toLocaleString()} EGP</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">5m × 4m room</p>
            <p className="text-lg font-black text-green-600">~{commission5x4.toLocaleString()} EGP</p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-500 rounded-full" /> Publication Checklist
        </h3>
        <div className="space-y-2.5">
          {CHECKLIST.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              {c.ok ? (
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              ) : (
                <XCircle size={18} className="text-red-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${c.ok ? "text-gray-700" : "text-red-500"}`}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!allOk || submitting}
        className={`w-full py-4 rounded-2xl font-black text-base transition-all ${
          allOk && !submitting
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {submitting ? "Submitting..." : "🚀 Submit for Admin Approval"}
      </button>

      {/* Affiliate link */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <p className="text-xs font-black text-blue-700 mb-1">🔗 Your affiliate link is ready now:</p>
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-blue-200 mb-3">
          <span className="text-xs text-gray-600 flex-1 truncate">{shareUrl}</span>
          <button onClick={copyLink} className="flex-shrink-0 text-blue-600 hover:text-blue-700">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Check out my KemeKit design! ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-green-600 transition-colors"
        >
          💬 Share on WhatsApp
        </a>
      </div>
    </div>
  );
}