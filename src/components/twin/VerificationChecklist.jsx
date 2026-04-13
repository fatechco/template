import { useState } from "react";
import { Check, Camera, AlertCircle } from "lucide-react";

const VERIFICATION_ITEMS = [
  { id: "exterior", label: "✅ Exterior Matches Photos", category: "Structure" },
  { id: "lighting", label: "✅ Natural Lighting Good", category: "Structure" },
  { id: "rooms", label: "✅ All Rooms Present", category: "Structure" },
  { id: "condition", label: "✅ Property Condition Good", category: "Condition" },
  { id: "amenities", label: "✅ Key Amenities Visible", category: "Condition" },
  { id: "cleanliness", label: "✅ Property Clean & Tidy", category: "Condition" },
  { id: "no_damage", label: "✅ No Visible Damage", category: "Issues" },
  { id: "utilities", label: "✅ Utilities Functional", category: "Issues" },
];

export default function VerificationChecklist({ onScreenshot, screenshots = [], onItemToggle, checkedItems = {} }) {
  const categories = [...new Set(VERIFICATION_ITEMS.map(i => i.category))];
  const completionRate = Math.round((Object.values(checkedItems).filter(Boolean).length / VERIFICATION_ITEMS.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-gray-900">📋 Verification Checklist</h3>
          <span className="text-sm font-bold text-orange-600">{completionRate}% Complete</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {categories.map(category => (
          <div key={category}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{category}</p>
            <div className="space-y-2">
              {VERIFICATION_ITEMS.filter(item => item.category === category).map(item => (
                <button
                  key={item.id}
                  onClick={() => onItemToggle?.(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                    checkedItems[item.id]
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    checkedItems[item.id]
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}>
                    {checkedItems[item.id] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm font-semibold ${checkedItems[item.id] ? "text-green-700" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Screenshot Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Camera className="w-4 h-4" />
          📸 Evidence Screenshots
        </p>
        <p className="text-xs text-blue-700 mb-3">Take 3-5 photos as evidence of verification</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {screenshots.map((screenshot, idx) => (
            <div key={idx} className="aspect-square rounded-lg overflow-hidden border-2 border-blue-300">
              <img src={screenshot} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {Array.from({ length: 4 - screenshots.length }).map((_, idx) => (
            <button
              key={`empty-${idx}`}
              onClick={() => onScreenshot?.()}
              className="aspect-square rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 flex items-center justify-center bg-white hover:bg-blue-50 transition-all"
            >
              <Camera className="w-5 h-5 text-blue-400" />
            </button>
          ))}
        </div>
        <p className="text-xs text-blue-600">{screenshots.length}/4 screenshots taken</p>
      </div>

      {/* Issues Section */}
      {Object.values(checkedItems).some(v => v === false) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Issues Found
          </p>
          <p className="text-xs text-red-700">Some checklist items were not verified. You'll be asked to note these in your final report.</p>
        </div>
      )}
    </div>
  );
}