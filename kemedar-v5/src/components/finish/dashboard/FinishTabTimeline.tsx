"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

const STATUS_STYLES = {
  not_started: "bg-gray-100 text-gray-500",
  materials_pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-orange-100 text-orange-700",
  awaiting_inspection: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  blocked: "bg-red-100 text-red-600",
};

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

export default function FinishTabTimeline({ project, phases, setPhases }) {
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [notes, setNotes] = useState("");

  const activePhase = phases.find(p => p.status === "in_progress") || phases.find(p => p.status === "not_started");

  const handleUploadProgress = async () => {
    if (!notes.trim()) return;
    setUploading(true);
    await apiClient.post("/api/v1/finishprogressupdate", {
      projectId: project.id,
      phaseId: activePhase?.id,
      submittedBy: "owner",
      submitterRole: "owner",
      progressNotes: notes,
      photos: [],
      submittedAt: new Date().toISOString(),
    });
    setNotes("");
    setShowUpload(false);
    setUploading(false);
  };

  return (
    <div>
      {/* Active Phase */}
      {activePhase && (
        <div className="bg-white rounded-2xl border-2 border-orange-300 p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-full">ACTIVE</span>
            <h2 className="font-black text-gray-900">Phase {activePhase.phaseNumber}: {activePhase.phaseName}</h2>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Completion</span>
              <span>{activePhase.completionPercent || 0}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${activePhase.completionPercent || 0}%` }} />
            </div>
          </div>

          {/* Today's requirements */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-orange-800 mb-2">📸 Today's Requirements</p>
            <p className="text-xs text-orange-700 mb-2">{activePhase.requiredPhotos || 5} progress photos needed by end of day</p>
            <button onClick={() => setShowUpload(!showUpload)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm transition-colors">
              📸 Upload Progress Photos
            </button>
          </div>

          {showUpload && (
            <div className="border border-gray-200 rounded-xl p-3 mb-3">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe work done today..."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none mb-2"
              />
              <button onClick={handleUploadProgress} disabled={uploading} className="w-full bg-green-500 text-white font-bold py-2 rounded-xl text-sm disabled:opacity-60">
                {uploading ? "Submitting..." : "✅ Submit Update"}
              </button>
            </div>
          )}

          {/* Phase checklist */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">PHASE CHECKLIST:</p>
            {["Materials delivered", "Work started", "Rough work complete", "Owner inspection", "Phase sign-off"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-1">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${i < 2 ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                  {i < 2 && <span className="text-white text-[9px]">✓</span>}
                </div>
                <span className={`text-xs ${i < 2 ? "text-gray-500 line-through" : "text-gray-700"}`}>{item}</span>
                {i === activePhase.phaseNumber - 1 && <span className="text-xs text-orange-500 font-bold">(pending)</span>}
              </div>
            ))}
          </div>

          {/* Payment */}
          {activePhase.phasePaymentAmount > 0 && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-800">💰 Phase Payment: {fmt(activePhase.phasePaymentAmount)} EGP</p>
              <p className="text-xs text-blue-600">Held in Escrow — releases on phase sign-off</p>
            </div>
          )}
        </div>
      )}

      {/* All phases */}
      <p className="font-black text-gray-900 mb-3">All Phases</p>
      <div className="space-y-3">
        {phases.map(ph => (
          <div key={ph.id} className={`bg-white rounded-2xl border p-4 ${ph.status === "in_progress" ? "border-orange-200" : "border-gray-100"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${ph.status === "completed" ? "bg-green-500 text-white" : ph.status === "in_progress" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                {ph.phaseNumber}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{ph.phaseName}</p>
                <p className="text-xs text-gray-400">{ph.estimatedDays} days estimated</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[ph.status] || "bg-gray-100 text-gray-500"}`}>
                {ph.status?.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            {ph.status !== "not_started" && (
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${ph.completionPercent || 0}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}