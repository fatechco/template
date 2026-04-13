import { useState } from "react";
import { base44 } from "@/api/base44Client";

function ScoreBar({ label, value, color = "#7C3AED" }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value || 0}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right">{value || 0}%</span>
    </div>
  );
}

function PropMini({ label, imageUrl, title, city, beds, baths, area, valueEGP }) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-shrink-0 rounded-xl bg-gray-100 overflow-hidden"
        style={{ width: 120, height: 90 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{title || "Property"}</p>
        {city && <p className="text-xs text-gray-500 mt-0.5">📍 {city}</p>}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {beds && <span>🛏 {beds}</span>}
          {baths && <span>🚿 {baths}</span>}
          {area && <span>📐 {area} m²</span>}
        </div>
        {valueEGP && (
          <p className="text-xs font-bold text-[#7C3AED] mt-1">Est. Value: {Number(valueEGP).toLocaleString()} EGP</p>
        )}
      </div>
    </div>
  );
}

export default function SwapMatchCard({ match, userId, onInterestSent, onBothInterested, onPassed }) {
  const [interestState, setInterestState] = useState(
    match._interestSent ||
    (match.userAId === userId && (match.status === "a_interested" || match.status === "both_interested")) ||
    (match.userBId === userId && (match.status === "b_interested" || match.status === "both_interested"))
      ? "sent" : "idle"
  );
  const [passing, setPassing] = useState(false);
  const [removing, setRemoving] = useState(false);

  const isUserA = match.userAId === userId;
  const score = match.matchScore || 0;
  const scoreBg = score >= 90 ? "#16a34a" : "#7C3AED";
  const scoreLabel = score >= 90 ? "✨" : "🔄";

  const myPropertyId = isUserA ? match.propertyAId : match.propertyBId;
  const theirPropertyId = isUserA ? match.propertyBId : match.propertyAId;
  const myValueEGP = isUserA ? match.propertyAValueEGP : match.propertyBValueEGP;
  const theirValueEGP = isUserA ? match.propertyBValueEGP : match.propertyAValueEGP;
  const gapEGP = match.valuationGapEGP;
  const iPayGap = match.gapPayerUserId === userId;
  const aiHighlights = isUserA ? (match.aiHighlightsForA || []) : (match.aiHighlightsForB || []);
  const aiReasoning = isUserA ? match.aiReasoningForA : match.aiReasoningForB;

  const hoursAgo = match.generatedAt
    ? Math.floor((Date.now() - new Date(match.generatedAt)) / 3600000)
    : null;
  const timeLabel = hoursAgo !== null
    ? hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`
    : "";

  const handleInterest = async () => {
    setInterestState("loading");
    const res = await base44.functions.invoke("expressInterest", { matchId: match.id });
    const updated = res?.data;
    if (updated?.status === "both_interested") {
      onBothInterested({ ...match, status: "both_interested" });
    } else {
      setInterestState("sent");
      onInterestSent(match.id);
    }
  };

  const handlePass = async () => {
    setPassing(true);
    await base44.functions.invoke("passOnMatch", { matchId: match.id });
    setRemoving(true);
    setTimeout(() => onPassed(match.id), 400);
  };

  const gapColor = gapEGP === 0
    ? "#7C3AED"
    : iPayGap ? "#ea580c" : "#16a34a";
  const gapBg = gapEGP === 0
    ? "#F5F3FF"
    : iPayGap ? "#FFF7ED" : "#F0FDF4";

  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-400 ${removing ? "opacity-0 scale-95" : "opacity-100"}`}
    >
      {/* Card Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <span className="flex items-center gap-2 text-white font-bold text-sm px-3 py-1 rounded-full" style={{ background: scoreBg }}>
          {scoreLabel} {score}% Match
        </span>
        <span className="text-xs text-gray-400">{timeLabel && `Found ${timeLabel}`}</span>
      </div>

      {/* Card Body */}
      <div className="flex">
        {/* LEFT: My Property */}
        <div className="w-[35%] flex-shrink-0 p-4" style={{ background: "#F8FAFC" }}>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Property</p>
          <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
            <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
          </div>
          <p className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">Property #{myPropertyId?.slice(0,8)}</p>
          <div className="text-xs text-gray-500 space-y-0.5">
            {myValueEGP && <p className="font-bold text-[#7C3AED]">Est: {Number(myValueEGP).toLocaleString()} EGP</p>}
          </div>
        </div>

        {/* RIGHT: Their property + gap + AI */}
        <div className="flex-1 p-5 flex flex-col gap-4">
          {/* Their property mini */}
          <PropMini
            label="Swap Opportunity"
            title={`Property #${theirPropertyId?.slice(0,8)}`}
            valueEGP={theirValueEGP}
          />

          <hr className="border-gray-100" />

          {/* Gap Box */}
          <div className="rounded-xl p-3" style={{ background: gapBg }}>
            <p className="text-xs text-gray-500 mb-1">⚖️ AI-Calculated Fair Market Gap:</p>
            {!gapEGP || gapEGP === 0 ? (
              <p className="font-black text-lg" style={{ color: gapColor }}>⚖️ Equal Value Swap</p>
            ) : iPayGap ? (
              <>
                <p className="font-black text-xl" style={{ color: gapColor }}>You pay: {Number(gapEGP).toLocaleString()} EGP difference</p>
                <p className="text-xs text-gray-500 mt-0.5">Their property is worth more by this amount</p>
              </>
            ) : (
              <>
                <p className="font-black text-xl" style={{ color: gapColor }}>You receive: {Number(gapEGP).toLocaleString()} EGP + new property</p>
                <p className="text-xs text-gray-500 mt-0.5">Your property is worth more by this amount</p>
              </>
            )}
          </div>

          {/* AI Reasoning */}
          {aiHighlights.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">🤖 Why this is a match for you:</p>
              <div className="space-y-1.5">
                {aiHighlights.slice(0, 3).map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold text-sm flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-800 leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match Quality Bars */}
          <div className="space-y-2">
            <ScoreBar label="Criteria match" value={match.criteriaMatchScore} />
            <ScoreBar label="Financial fit" value={match.financialCompatibilityScore} />
            <ScoreBar label="Overall score" value={match.matchScore} />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>👤 Owner: {isUserA ? "Party B" : "Party A"}</span>
          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Verified
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/property/${theirPropertyId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#7C3AED] text-[#7C3AED] font-bold text-xs rounded-xl hover:bg-purple-50 transition-colors"
          >
            👁️ View Property
          </a>
          <button
            onClick={handlePass}
            disabled={passing}
            className="flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            ❌ Pass
          </button>
          <button
            onClick={handleInterest}
            disabled={interestState === "sent" || interestState === "loading"}
            className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl transition-all ${
              interestState === "sent"
                ? "bg-green-100 text-green-700 border-2 border-green-200 cursor-default"
                : "bg-[#7C3AED] hover:bg-purple-700 text-white border-2 border-[#7C3AED]"
            } disabled:opacity-60`}
          >
            {interestState === "loading" ? (
              <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
            ) : interestState === "sent" ? (
              "✅ Interest Sent"
            ) : (
              "👋 I'm Interested →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}