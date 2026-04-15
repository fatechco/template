"use client";
// @ts-nocheck
import { useState } from "react";

const RECORD_META = {
  property_listed:          { icon: "🏠", color: "bg-gray-400" },
  seller_identity_verified: { icon: "👤", color: "bg-blue-500" },
  seller_signed_pledge:     { icon: "✍️",  color: "bg-blue-500" },
  document_uploaded:        { icon: "📤", color: "bg-orange-400" },
  document_ai_analyzed:     { icon: "🤖", color: "bg-orange-400" },
  document_fo_verified:     { icon: "👁️",  color: "bg-orange-400" },
  fo_inspection_scheduled:  { icon: "📅", color: "bg-purple-500" },
  fo_inspection_completed:  { icon: "🔍", color: "bg-purple-500" },
  certificate_issued:       { icon: "🏅", color: "bg-yellow-500" },
  ownership_transferred:    { icon: "🔄", color: "bg-green-500" },
  fraud_flag_raised:        { icon: "🚨", color: "bg-red-500" },
  fraud_flag_cleared:       { icon: "✅", color: "bg-green-500" },
  level_upgraded:           { icon: "⬆️",  color: "bg-green-500" },
};

export default function DealTimeline({ records, deal }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...records].reverse();
  const displayed = expanded ? sorted : sorted.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-black text-gray-900 text-base mb-4">📜 Deal Timeline</h3>
      {displayed.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No events yet.</p>
      ) : (
        <div>
          {displayed.map((rec, i) => {
            const meta = RECORD_META[rec.recordType] || { icon: "📌", color: "bg-gray-400" };
            const isLast = i === displayed.length - 1;
            return (
              <div key={rec.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${meta.color} mt-1`} />
                  {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm">{meta.icon}</span>
                    <p className="text-sm font-bold text-gray-900">{rec.title || rec.recordType?.replace(/_/g, " ")}</p>
                  </div>
                  <div className="flex gap-2 text-[10px] text-gray-400 mt-0.5 flex-wrap">
                    <span>{rec.actorLabel || rec.actorType}</span>
                    <span>·</span>
                    <span>{rec.recordedAt ? new Date(rec.recordedAt).toLocaleString() : ""}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {records.length > 5 && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-[#FF6B00] font-bold mt-1 hover:underline">
              {expanded ? "Show less ▲" : `Show all ${records.length} events ▼`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}