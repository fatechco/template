import { useState, useRef } from "react";
import SwipeCard from "./SwipeCard";
import SwapPropertySheet from "./SwapPropertySheet";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80";

export default function SwipeCardStack({ matches, userId, onInterest, onPass, onBothInterested }) {
  const [index, setIndex] = useState(0);
  const [sheetMatch, setSheetMatch] = useState(null);
  const [swipeState, setSwipeState] = useState(null); // { direction: 'left'|'right', label }
  const cardRef = useRef(null);

  const visibleMatches = matches.slice(index, index + 3);
  const current = matches[index];

  const advance = () => {
    setSwipeState(null);
    setIndex(i => i + 1);
  };

  const handleSwipeLeft = async () => {
    if (!current) return;
    setSwipeState({ direction: "left", label: "❌ PASSED" });
    onPass(current);
    setTimeout(advance, 500);
  };

  const handleSwipeRight = async () => {
    if (!current) return;
    setSwipeState({ direction: "right", label: "💚 INTERESTED!" });
    onInterest(current);
    setTimeout(advance, 500);
  };

  const handleDetails = () => {
    setSheetMatch(current);
  };

  // No more cards
  if (index >= matches.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-6xl mb-5">🏠❓🏠</div>
        <h2 className="text-white font-black text-xl mb-2">You've seen all your matches!</h2>
        <p className="text-gray-400 text-sm mb-1">We'll keep scanning and notify you of new ones.</p>
        <p className="text-gray-500 text-xs mb-8">Matches refresh weekly.</p>
        <div className="space-y-3 w-full max-w-xs">
          <Link
            to="/dashboard/swap/intent"
            className="block w-full text-center border-2 border-[#7C3AED] text-[#7C3AED] font-bold py-3 rounded-2xl text-sm"
          >
            Edit My Swap Criteria →
          </Link>
          <Link
            to="/dashboard/swap?tab=negotiations"
            className="block w-full text-center bg-[#7C3AED] text-white font-bold py-3 rounded-2xl text-sm"
          >
            View Negotiation Rooms →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Card stack */}
      <div className="relative h-full">
        {/* Background cards (depth effect) */}
        {visibleMatches.slice(1).reverse().map((m, i) => {
          const depth = visibleMatches.length - 1 - i; // 2 or 1
          const scale = depth === 1 ? 0.95 : 0.90;
          const translateY = depth === 1 ? 10 : 20;
          return (
            <div
              key={m.id}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "bottom center",
                zIndex: depth,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                backgroundImage: `url(${FALLBACK_IMG})`,
                backgroundSize: "cover",
              }}
            />
          );
        })}

        {/* Front card */}
        <SwipeCard
          key={current.id}
          match={current}
          userId={userId}
          swipeState={swipeState}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onDetails={handleDetails}
        />
      </div>

      {/* Bottom action buttons */}
      <div className="flex items-center justify-center gap-8 py-4 flex-shrink-0" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        {/* Pass */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleSwipeLeft}
            className="w-[60px] h-[60px] rounded-full border-2 border-red-400 flex items-center justify-center text-2xl bg-transparent hover:bg-red-50/10 transition-colors active:scale-95"
          >
            ❌
          </button>
          <span className="text-white/60 text-[11px]">Pass</span>
        </div>

        {/* Details */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleDetails}
            className="w-[52px] h-[52px] rounded-full bg-white shadow-lg flex items-center justify-center text-xl hover:bg-gray-100 transition-colors active:scale-95"
          >
            👁️
          </button>
          <span className="text-white/60 text-[11px]">Details</span>
        </div>

        {/* Interested */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleSwipeRight}
            className="w-[60px] h-[60px] rounded-full bg-green-500 flex items-center justify-center text-2xl hover:bg-green-600 transition-colors active:scale-95 shadow-lg"
          >
            💚
          </button>
          <span className="text-white/60 text-[11px]">Interested</span>
        </div>
      </div>

      {/* Property detail bottom sheet */}
      {sheetMatch && (
        <SwapPropertySheet
          match={sheetMatch}
          userId={userId}
          onClose={() => setSheetMatch(null)}
          onInterest={() => { setSheetMatch(null); handleSwipeRight(); }}
          onPass={() => { setSheetMatch(null); handleSwipeLeft(); }}
        />
      )}
    </>
  );
}