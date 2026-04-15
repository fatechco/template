"use client";
// @ts-nocheck
import { useState, useRef } from "react";

const FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70",
];

export default function SwapPropertySheet({ match, userId, onClose, onInterest, onPass }) {
  const [visible, setVisible] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  const sheetRef = useRef(null);
  const dragStart = useRef(null);

  const isUserA = match.userAId === userId;
  const myValueEGP = isUserA ? match.propertyAValueEGP : match.propertyBValueEGP;
  const theirValueEGP = isUserA ? match.propertyBValueEGP : match.propertyAValueEGP;
  const gapEGP = match.valuationGapEGP;
  const iPayGap = match.gapPayerUserId === userId;
  const aiHighlights = isUserA ? (match.aiHighlightsForA || []) : (match.aiHighlightsForB || []);
  const aiReasoning = isUserA ? match.aiReasoningForA : match.aiReasoningForB;
  const theirPropertyId = isUserA ? match.propertyBId : match.propertyAId;

  const closeSheet = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleTouchStart = (e) => { dragStart.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (dragStart.current === null) return;
    const dy = e.changedTouches[0].clientY - dragStart.current;
    if (dy > 80) closeSheet();
    dragStart.current = null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.5)", opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
        onClick={closeSheet}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed left-0 right-0 bottom-0 bg-white z-50 overflow-hidden flex flex-col"
        style={{
          height: "85vh",
          borderRadius: "24px 24px 0 0",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Image gallery */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3" style={{ height: 200 }}>
            {FALLBACK_IMGS.map((img, i) => (
              <img key={i} src={img} alt="" className="flex-shrink-0 h-full w-auto rounded-xl object-cover" style={{ minWidth: 140 }} />
            ))}
          </div>

          <div className="px-4 space-y-4 pb-28">
            {/* Title + specs */}
            <div>
              <h2 className="font-black text-gray-900 text-lg leading-snug mb-1">
                {match._theirPropertyTitle || `Property #${theirPropertyId?.slice(0, 8)}`}
              </h2>
              <p className="text-gray-500 text-sm mb-3">
                📍 {match._theirCity || "Cairo, Egypt"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["🛏", match._theirBeds || "—", "Beds"],
                  ["🚿", match._theirBaths || "—", "Baths"],
                  ["📐", match._theirArea ? `${match._theirArea}m²` : "—", "Area"],
                  ["🏢", match._theirFloor || "—", "Floor"],
                  ["✨", match._theirFinishing || "—", "Finishing"],
                  ["🔐", `Level ${match._theirVerifyLevel || 1}`, "Verify Pro"],
                ].map(([icon, val, label]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-base">{icon}</p>
                    <p className="font-black text-gray-900 text-sm">{String(val)}</p>
                    <p className="text-[10px] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {match._theirDescription && (
              <div>
                <p className={`text-sm text-gray-600 leading-relaxed ${!descExpanded ? "line-clamp-3" : ""}`}>
                  {match._theirDescription}
                </p>
                <button onClick={() => setDescExpanded(e => !e)} className="text-[#7C3AED] text-sm font-bold mt-1">
                  {descExpanded ? "Show less" : "Read more"}
                </button>
              </div>
            )}

            {/* Financial Gap card */}
            <div className="rounded-xl p-4 text-white" style={{ background: "#7C3AED" }}>
              <p className="text-[11px] font-bold text-purple-200 uppercase tracking-wider mb-3">AI Market Gap Estimate</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Your property:</span>
                  <span className="font-black">{myValueEGP ? `${Number(myValueEGP).toLocaleString()} EGP` : "Estimating..."}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Their property:</span>
                  <span className="font-black">{theirValueEGP ? `${Number(theirValueEGP).toLocaleString()} EGP` : "Estimating..."}</span>
                </div>
                <div className="border-t border-purple-500 pt-1.5 flex justify-between text-sm">
                  <span className="text-purple-200">Difference:</span>
                  <span className="font-black">{gapEGP ? `${Number(gapEGP).toLocaleString()} EGP` : "Equal"}</span>
                </div>
                <p className="text-sm font-bold text-yellow-300 pt-1">
                  {!gapEGP || gapEGP === 0
                    ? "⚖️ Equal value swap"
                    : iPayGap
                      ? "You pay the difference"
                      : "You receive the difference"}
                </p>
              </div>
            </div>

            {/* AI Match Reasoning */}
            <div>
              <p className="text-sm font-bold text-gray-800 mb-3">🤖 Why Kemedar AI thinks this works:</p>
              <div className="space-y-2">
                {aiHighlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700 leading-relaxed">{h}</span>
                  </div>
                ))}
                {aiReasoning && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{aiReasoning}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-0 border-t border-gray-100 bg-white"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <button
            onClick={onPass}
            className="flex-1 py-4 text-gray-600 font-bold text-sm border-r border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            ❌ Pass
          </button>
          <button
            onClick={onInterest}
            className="flex-1 py-4 font-bold text-sm text-white transition-colors hover:bg-purple-700 active:bg-purple-800"
            style={{ background: "#7C3AED" }}
          >
            💚 I'm Interested!
          </button>
        </div>
      </div>
    </>
  );
}