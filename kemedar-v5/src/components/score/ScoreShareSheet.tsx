"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

const EXPIRY_OPTIONS = [
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
  { label: "90 days", days: 90 },
];

const DIMENSION_OPTIONS = [
  { key: "overallScore", label: "Overall score and grade", default: true },
  { key: "buyerScore", label: "Buyer score", default: true },
  { key: "verificationLevel", label: "Verification level", default: true },
  { key: "transactionHistory", label: "Transaction history", default: false },
  { key: "earnedBadges", label: "Badges", default: true },
];

export default function ScoreShareSheet({ score, onClose }) {
  const [expiryDays, setExpiryDays] = useState(30);
  const [dimensions, setDimensions] = useState(
    Object.fromEntries(DIMENSION_OPTIONS.map(d => [d.key, d.default]))
  );
  const [shareLink, setShareLink] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDim = key => setDimensions(p => ({ ...p, [key]: !p[key] }));

  const generate = async () => {
    setGenerating(true);
    const token = Math.random().toString(36).substring(2, 12).toUpperCase();
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString();
    const selectedDimensions = Object.entries(dimensions).filter(([, v]) => v).map(([k]) => k);

    await apiClient.post("/api/v1/scoresharerequest", {
      userId: score.userId,
      shareToken: token,
      scoreAtTimeOfShare: score.overallScore,
      gradeAtTimeOfShare: score.overallGrade,
      dimensionsShared: selectedDimensions,
      expiresAt,
    });

    setShareLink(`${window.location.origin}/score/${token}`);
    setGenerating(false);
  };

  const copy = () => {
    navigator.clipboard?.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <h3 className="font-black text-gray-900">📤 Share My Score</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
        </div>

        <div className="p-5 space-y-5">
          {/* Score preview */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl p-4 text-white text-center">
            <p className="text-3xl mb-1">🎯</p>
            <p className="font-black text-2xl">{score?.overallScore} / 1000</p>
            <p className="font-bold">{score?.overallGrade}</p>
          </div>

          {/* Expiry */}
          <div>
            <p className="font-bold text-gray-900 text-sm mb-2">Link expiry</p>
            <div className="flex gap-2">
              {EXPIRY_OPTIONS.map(opt => (
                <button key={opt.days} onClick={() => setExpiryDays(opt.days)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${expiryDays === opt.days ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <p className="font-bold text-gray-900 text-sm mb-2">Include in share</p>
            <div className="space-y-2">
              {DIMENSION_OPTIONS.map(dim => (
                <label key={dim.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!dimensions[dim.key]} onChange={() => toggleDim(dim.key)} className="w-4 h-4 accent-orange-500" />
                  <span className="text-sm text-gray-700">{dim.label}</span>
                </label>
              ))}
            </div>
          </div>

          {!shareLink ? (
            <button onClick={generate} disabled={generating}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {generating ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</> : "🔗 Generate Share Link"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-3 font-mono text-xs text-gray-700 break-all">{shareLink}</div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={copy} className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-all ${copied ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent("View my Kemedar Score™ certificate: " + shareLink)}`} target="_blank" rel="noreferrer"
                  className="py-2.5 text-xs font-bold rounded-xl border-2 border-green-500 bg-green-50 text-green-700 text-center hover:bg-green-100">
                  💬 WhatsApp
                </a>
                <a href={`mailto:?subject=My Kemedar Score&body=${encodeURIComponent(shareLink)}`}
                  className="py-2.5 text-xs font-bold rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-700 text-center hover:bg-blue-100">
                  📧 Email
                </a>
              </div>
              <p className="text-xs text-gray-400 text-center">Expires in {expiryDays} days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}