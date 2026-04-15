"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Sparkles, AlertTriangle, CheckCircle } from "lucide-react";

export default function FinishTabProgress({ project, phases, updates, setUpdates }) {
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const activePhase = phases.find(p => p.status === "in_progress") || phases[0];

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    const update = await apiClient.post("/api/v1/finishprogressupdate", {
      projectId: project.id,
      phaseId: activePhase?.id,
      submittedBy: "professional",
      submitterRole: "professional",
      progressNotes: notes,
      workCompletedToday: workDone,
      photos: photoUrls.map(url => ({ photoUrl: url })),
      aiAnalysisStatus: "pending",
      submittedAt: new Date().toISOString(),
    });

    setUpdates(prev => [update, ...prev]);

    // Trigger AI analysis if photos
    if (photoUrls.length > 0) {
      setAnalyzing(true);
      try {
        const result = await /* integration Core.InvokeLLM TODO */ ({
          prompt: `You are a construction quality inspector. Analyze this progress update for a ${project.designStyle || "standard"} finishing project (Phase: ${activePhase?.phaseName || "active phase"}).
          
Work done today: "${workDone}"
Notes: "${notes}"

Rate this update and provide:
1. qualityScore (0-100)
2. detectedProgress (1 sentence describing what was accomplished)
3. phaseCompletion estimate (0-100%)
4. issues (array of any concerns)
5. recommendation (1 sentence for the owner)`,
          response_json_schema: {
            type: "object",
            properties: {
              qualityScore: { type: "number" },
              detectedProgress: { type: "string" },
              phaseCompletion: { type: "number" },
              issues: { type: "array", items: { type: "string" } },
              recommendation: { type: "string" },
            }
          }
        });

        await apiClient.put("/api/v1/finishprogressupdate/", update.id, {
          aiAnalysisStatus: "analyzed",
          aiQualityScore: result.qualityScore,
          aiDetectedProgress: result.detectedProgress,
          aiPhaseCompletion: result.phaseCompletion,
          aiIssuesDetected: (result.issues || []).map(iss => ({ description: iss })),
        });

        setUpdates(prev => prev.map(u => u.id === update.id ? {
          ...u,
          aiAnalysisStatus: "analyzed",
          aiQualityScore: result.qualityScore,
          aiDetectedProgress: result.detectedProgress,
          aiPhaseCompletion: result.phaseCompletion,
        } : u));
      } catch(e) {
        // silent
      }
      setAnalyzing(false);
    }

    setNotes("");
    setWorkDone("");
    setPhotoUrls([]);
    setShowForm(false);
    setSubmitting(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
    setPhotoUrls(prev => [...prev, file_url]);
  };

  const displayUpdates = updates.length > 0 ? updates : [
    {
      id: "demo1",
      submitterRole: "professional",
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      progressNotes: "Completed floor tile installation in living room and dining area. 85% of tiles placed, grout work starts tomorrow.",
      workCompletedToday: "Living room floor tiling complete",
      aiQualityScore: 88,
      aiDetectedProgress: "Excellent progress. Tiles appear level and properly aligned. No visible lippage detected.",
      aiPhaseCompletion: 65,
      aiIssuesDetected: [],
    }
  ];

  return (
    <div>
      {/* Upload CTA */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full mb-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Sparkles size={16} /> Upload Today's Progress (AI Vision™ Analysis)
      </button>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <p className="font-bold text-gray-900 text-sm">Submit Progress Update</p>
            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full ml-auto">🤖 AI Vision™ Ready</span>
          </div>

          <div className="mb-3">
            <label className="text-xs font-bold text-gray-600 mb-1 block">What did you complete today? *</label>
            <textarea value={workDone} onChange={e => setWorkDone(e.target.value)} rows={2}
              placeholder="e.g. Finished floor tiling in master bedroom..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>
          <div className="mb-3">
            <label className="text-xs font-bold text-gray-600 mb-1 block">Progress notes *</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Any issues, material needs, or observations..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>

          {/* Photo upload */}
          <div className="mb-3">
            <label className="text-xs font-bold text-gray-600 mb-1 block">Photos (optional — triggers AI Vision™ quality check)</label>
            <div className="flex gap-2 flex-wrap">
              {photoUrls.map((url, i) => (
                <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 relative">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setPhotoUrls(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">×</button>
                </div>
              ))}
              <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors text-gray-400">
                <span className="text-2xl">+</span>
                <span className="text-[9px]">Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            {photoUrls.length > 0 && (
              <p className="text-[10px] text-purple-600 mt-1">✨ AI Vision™ will analyze these photos for quality & progress</p>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting || !notes.trim()}
              className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl text-sm disabled:opacity-60">
              {submitting ? (analyzing ? "Analyzing..." : "Submitting...") : "✅ Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Feed */}
      <p className="font-black text-gray-900 mb-3">📸 Progress Feed</p>
      <div className="space-y-4">
        {displayUpdates.map((upd, i) => (
          <div key={upd.id || i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full capitalize">{upd.submitterRole}</span>
              {upd.workCompletedToday && <span className="text-xs font-bold text-gray-700 truncate flex-1">{upd.workCompletedToday}</span>}
              <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{new Date(upd.submittedAt).toLocaleDateString()}</span>
            </div>

            {/* Photos */}
            {upd.photos?.length > 0 && (
              <div className="flex gap-2 p-3 overflow-x-auto border-b border-gray-100">
                {upd.photos.map((ph, pi) => (
                  <img key={pi} src={ph.photoUrl || ph} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-200" />
                ))}
              </div>
            )}

            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">{upd.progressNotes}</p>

              {/* Vision™ AI Analysis */}
              {upd.aiQualityScore !== undefined && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-purple-600" />
                    <p className="text-xs font-black text-purple-800">Kemedar Vision™ AI Analysis</p>
                    <span className={`ml-auto text-xs font-black px-2 py-0.5 rounded-full ${
                      upd.aiQualityScore >= 80 ? "bg-green-100 text-green-700" :
                      upd.aiQualityScore >= 60 ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{upd.aiQualityScore}/100</span>
                  </div>
                  {upd.aiPhaseCompletion !== undefined && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-purple-600">Phase Completion:</span>
                      <div className="flex-1 h-1.5 bg-purple-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${upd.aiPhaseCompletion}%` }} />
                      </div>
                      <span className="text-xs font-bold text-purple-700">{upd.aiPhaseCompletion}%</span>
                    </div>
                  )}
                  <p className="text-xs text-purple-700">{upd.aiDetectedProgress}</p>

                  {/* AI detected issues */}
                  {upd.aiIssuesDetected?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {upd.aiIssuesDetected.map((iss, j) => (
                        <div key={j} className="flex items-start gap-1 text-xs text-red-700">
                          <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" />
                          <span>{iss.description || iss}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {upd.aiAnalysisStatus === "pending" && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-2 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <p className="text-xs text-gray-500">Vision™ AI analyzing photos...</p>
                </div>
              )}

              {/* FO Inspection gate */}
              {upd.requiresFOInspection && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
                  <p className="text-xs font-bold text-blue-800">🗺️ FO Inspection Required</p>
                  <p className="text-xs text-blue-600">Payment held until Franchise Owner completes site visit</p>
                </div>
              )}

              {/* Owner reaction */}
              <div className="flex gap-2">
                <button className="flex-1 border border-green-200 text-green-700 font-bold py-1.5 rounded-xl text-xs hover:bg-green-50 flex items-center justify-center gap-1">
                  <CheckCircle size={11} /> Approve
                </button>
                <button className="flex-1 border border-gray-200 text-gray-600 font-bold py-1.5 rounded-xl text-xs hover:bg-gray-50">❓ Question</button>
                <button className="flex-1 border border-red-200 text-red-600 font-bold py-1.5 rounded-xl text-xs hover:bg-red-50 flex items-center justify-center gap-1">
                  <AlertTriangle size={11} /> Issue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}