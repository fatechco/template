"use client";
// @ts-nocheck
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function InspectionSubmit({ report, gpsData, photos, checklist, verdict, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const passedItems = Object.values(checklist).filter(Boolean).length;
  const photoCount = Object.keys(photos).length;
  const distance = gpsData?.distance;
  const gpsOk = distance === null || distance <= 500;

  const verdictLabels = {
    pass: "✅ Clean", partial: "⚠️ Minor Issues", fail_major: "❌ Major Issues", fail: "❌ Failed",
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
  };

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-6">
        <p className="text-2xl mb-1">📤</p>
        <h2 className="text-xl font-black text-gray-900">Review before submitting</h2>
        <p className="text-sm text-gray-400 mt-1">Token: {report.tokenId}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">📍 GPS Match</span>
          <span className={`text-sm font-black ${gpsOk ? "text-green-600" : "text-amber-600"}`}>
            {distance !== null && distance !== undefined ? `${distance}m from property` : "GPS recorded"}
            {gpsOk ? " ✅" : " ⚠️"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">📸 Photos</span>
          <span className={`text-sm font-black ${photoCount >= 8 ? "text-green-600" : "text-amber-600"}`}>
            {photoCount} captured {photoCount >= 8 ? "✅" : "⚠️"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">📋 Checklist</span>
          <span className="text-sm font-black text-gray-900">{passedItems}/8 passed</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">📝 Verdict</span>
          <span className="text-sm font-black text-gray-900">{verdictLabels[verdict.overall] || "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">⚠️ Issues</span>
          <span className="text-sm font-black text-gray-900">{verdict.issues?.length || 0} found</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">💡 Recommendation</span>
          <span className="text-sm font-black text-gray-900 capitalize">{verdict.recommendation?.replace(/_/g, " ") || "—"}</span>
        </div>
      </div>

      {verdict.notes && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-gray-500 mb-1">Your Notes:</p>
          <p className="text-sm text-gray-700 italic">"{verdict.notes}"</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-blue-700">Once submitted, admin will review within 24 hours.</p>
        <p className="text-xs text-blue-600 mt-0.5">💰 400 EGP payment processed on approval.</p>
      </div>

      <button onClick={handleSubmit} disabled={submitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-5 rounded-2xl text-lg transition-colors shadow-lg">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : "📤 Submit Inspection Report"}
      </button>
    </div>
  );
}