"use client";
// @ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";

const URGENCY_COLORS = {
  low: { bg: "#F0FDF4", text: "#16A34A", label: "Low" },
  medium: { bg: "#FFFBEB", text: "#D97706", label: "Medium" },
  high: { bg: "#FEF2F2", text: "#DC2626", label: "High" },
  emergency: { bg: "#FEF2F2", text: "#B91C1C", label: "🚨 Emergency" },
};

export default function SnapDiagnosisInfoCard({ task }) {
  const [lightbox, setLightbox] = useState(false);
  const snap = task._snapData; // hydrated from SnapSession

  if (!snap) return null;

  const urgency = URGENCY_COLORS[snap.urgencyLevel] || URGENCY_COLORS.medium;

  return (
    <div className="space-y-3">
      {/* Diagnostic Photo */}
      {snap.originalImageUrl && (
        <div
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
          style={{ borderLeft: "4px solid #14B8A6" }}
        >
          <p className="text-[14px] font-black text-gray-800 mb-2">🔍 Diagnostic Photo</p>
          <div
            className="rounded-xl overflow-hidden cursor-pointer relative group"
            style={{ maxHeight: 200 }}
            onClick={() => setLightbox(true)}
          >
            <img
              src={snap.originalImageUrl}
              alt="Homeowner diagnostic photo"
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: 200 }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full">🔍 View Full Size</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">📷 Photo submitted by homeowner</p>
        </div>
      )}

      {/* AI Diagnosis Summary */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        style={{ borderLeft: "4px solid #14B8A6" }}
      >
        <p className="text-[14px] font-black text-gray-800 mb-3">🩺 AI Diagnosis</p>
        <div className="space-y-2">
          {snap.diagnosedIssue && (
            <p className="text-[16px] font-black text-gray-900">{snap.diagnosedIssue}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {snap.urgencyLevel && (
              <span
                className="text-[11px] font-black px-2.5 py-1 rounded-full"
                style={{ background: urgency.bg, color: urgency.text }}
              >
                ⚡ Urgency: {urgency.label}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {(snap.estimatedLaborHoursMin || snap.estimatedLaborHoursMax) && (
              <p className="text-[13px] text-gray-600">
                ⏱️ Est. time: <span className="font-bold">{snap.estimatedLaborHoursMin}–{snap.estimatedLaborHoursMax} hours</span>
              </p>
            )}
            {snap.professionalSkillRequired && (
              <p className="text-[13px] text-gray-600">
                👷 Skill required: <span className="font-bold">{snap.professionalSkillRequired}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && snap.originalImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <img src={snap.originalImageUrl} alt="" className="max-h-[90vh] max-w-full rounded-xl" />
          <button className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-1.5">
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
}