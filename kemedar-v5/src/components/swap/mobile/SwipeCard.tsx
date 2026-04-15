"use client";
// @ts-nocheck
import { useRef, useState, useEffect } from "react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80";

export default function SwipeCard({ match, userId, swipeState, onSwipeLeft, onSwipeRight, onDetails }) {
  const cardRef = useRef(null);
  const startX = useRef(null);
  const startY = useRef(null);
  const currentX = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [flyOut, setFlyOut] = useState(null); // 'left' | 'right'

  const isUserA = match.userAId === userId;
  const score = match.matchScore || 0;
  const scoreBg = score >= 90 ? "#16a34a" : "#7C3AED";
  const gapEGP = match.valuationGapEGP;
  const iPayGap = match.gapPayerUserId === userId;
  const aiHighlights = isUserA ? (match.aiHighlightsForA || []) : (match.aiHighlightsForB || []);
  const imgUrl = FALLBACK_IMG;

  // Trigger fly-out when swipeState changes
  useEffect(() => {
    if (swipeState) {
      setFlyOut(swipeState.direction);
    }
  }, [swipeState]);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = 0;
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!startX.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = Math.abs(e.touches[0].clientY - startY.current);
    if (dy > 30 && Math.abs(dx) < dy) return; // vertical scroll
    currentX.current = dx;
    setDragX(dx);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    const dx = currentX.current;
    if (dx < -80) {
      setFlyOut("left");
      setTimeout(onSwipeLeft, 350);
    } else if (dx > 80) {
      setFlyOut("right");
      setTimeout(onSwipeRight, 350);
    } else {
      setDragX(0);
    }
    currentX.current = 0;
  };

  const rotation = dragging ? (dragX / 15) : (flyOut === "right" ? 25 : flyOut === "left" ? -25 : 0);
  const translateX = flyOut === "right" ? "120%" : flyOut === "left" ? "-120%" : dragging ? `${dragX}px` : "0";
  const opacity = flyOut ? 0 : 1;
  const overlayOpacity = Math.min(Math.abs(dragX) / 100, 0.6);
  const overlayColor = dragX > 0 ? `rgba(34,197,94,${overlayOpacity})` : `rgba(239,68,68,${overlayOpacity})`;

  const gapPill = !gapEGP || gapEGP === 0
    ? { text: "⚖️ Equal value swap", color: "#7C3AED" }
    : iPayGap
      ? { text: `You pay ${Number(gapEGP).toLocaleString()} EGP difference`, color: "#111" }
      : { text: `You receive ${Number(gapEGP).toLocaleString()} EGP`, color: "#16a34a" };

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 rounded-3xl overflow-hidden select-none"
      style={{
        zIndex: 10,
        transform: `translateX(${translateX}) rotate(${rotation}deg)`,
        transition: flyOut ? "transform 0.35s ease, opacity 0.35s ease" : dragging ? "none" : "transform 0.2s ease",
        opacity,
        boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        cursor: "grab",
        touchAction: "pan-y",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-bleed image */}
      <img src={imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Drag color overlay */}
      {dragging && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: overlayColor }} />
      )}

      {/* Swipe indicator labels */}
      {swipeState && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
          <span className="text-4xl font-black" style={{
            color: swipeState.direction === "right" ? "#22c55e" : "#ef4444",
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            animation: "fadeIn 0.15s ease",
          }}>
            {swipeState.label}
          </span>
        </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.5) 30%, transparent 55%)"
      }} />

      {/* Top-right: match score badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-white font-black text-xs px-3 py-1.5 rounded-full shadow"
          style={{ background: scoreBg }}>
          {score}% Match
        </span>
      </div>

      {/* Gap pill (center of image) */}
      <div className="absolute left-1/2 z-10" style={{ top: "40%", transform: "translate(-50%, -50%)" }}>
        <div className="bg-white rounded-full shadow-lg px-4 py-2 whitespace-nowrap">
          <span className="text-sm font-bold" style={{ color: gapPill.color }}>{gapPill.text}</span>
        </div>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-24 z-10">
        {/* Spec badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-white text-[11px] font-bold border border-white/40 px-2 py-0.5 rounded-full">
            {match._categoryName || "Apartment"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-white font-black text-xl leading-snug mb-1 line-clamp-2">
          {match._theirPropertyTitle || `Property #${(isUserA ? match.propertyBId : match.propertyAId)?.slice(0, 8)}`}
        </h2>

        {/* Location */}
        <p className="text-white/80 text-sm mb-2">📍 {match._theirCity || "Cairo, Egypt"}</p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-white text-sm mb-4">
          {match._theirBeds && <span>🛏 {match._theirBeds}</span>}
          {match._theirBaths && <span>🚿 {match._theirBaths}</span>}
          {match._theirArea && <span>📐 {match._theirArea}m²</span>}
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-3" />

        {/* AI Highlights */}
        {aiHighlights.length > 0 && (
          <div className="space-y-1 mb-3">
            {aiHighlights.slice(0, 3).map((h, i) => (
              <p key={i} className="text-white text-[13px] leading-snug flex items-start gap-1.5">
                <span className="text-green-400 flex-shrink-0">✓</span>
                {h}
              </p>
            ))}
          </div>
        )}

        {/* Tap hint */}
        <div className="text-center mt-2">
          <button
            onTouchEnd={(e) => { e.stopPropagation(); onDetails(); }}
            className="text-white/50 text-[11px]"
          >
            tap 👁️ for details
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}