import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function MaterialsDecisionToggle({ value, onChange, session, onAddAllToCart }) {
  const [addingAll, setAddingAll] = useState(false);
  const [allAdded, setAllAdded] = useState(false);

  const handleAddAll = async () => {
    if (addingAll || allAdded) return;
    setAddingAll(true);
    try {
      await onAddAllToCart?.();
      setAllAdded(true);
    } finally {
      setAddingAll(false);
    }
  };

  const OPTIONS = [
    {
      key: "customer",
      icon: "🛒",
      label: "I will buy them on Kemetro",
      sub: "Pros only quote for labor — reduces bids significantly",
      activeColor: "#14B8A6",
      activeText: "white",
    },
    {
      key: "professional",
      icon: "👷",
      label: "Professional supplies materials",
      sub: "Contractor brings parts — included in their bid",
      activeColor: "#0A6EBD",
      activeText: "white",
    },
  ];

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
    >
      <div className="px-4 pt-4 pb-3">
        <p className="text-[14px] font-black text-gray-900 mb-0.5">
          Who will provide the materials?
        </p>
        <p className="text-[12px] text-gray-400">
          This is shown to bidding professionals
        </p>
      </div>

      <div className="px-4 pb-4 flex gap-3">
        {OPTIONS.map((opt) => {
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className="flex-1 rounded-xl p-3 text-left transition-all border"
              style={{
                background: active ? opt.activeColor : "#F9FAFB",
                borderColor: active ? opt.activeColor : "#E5E7EB",
                color: active ? opt.activeText : "#374151",
              }}
            >
              <p className="text-xl mb-1">{opt.icon}</p>
              <p className="text-[13px] font-black leading-snug mb-1">{opt.label}</p>
              <p className="text-[11px] leading-snug opacity-75">{opt.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Add all to cart CTA — only shown when customer selected */}
      {value === "customer" && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAddAll}
            disabled={addingAll || allAdded}
            className="w-full py-3 rounded-xl font-black text-white text-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{ background: allAdded ? "#22C55E" : "#0A6EBD" }}
          >
            {addingAll ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding parts...
              </>
            ) : allAdded ? (
              "✅ All Parts Added to Cart!"
            ) : (
              "🛒 Add All Parts to Cart"
            )}
          </button>
        </div>
      )}
    </div>
  );
}