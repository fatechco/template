"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, Circle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import VisionUploadZone from "./VisionUploadZone";
import VisionPhotoGrid from "./VisionPhotoGrid";
import VisionAnalysisPanel from "./VisionAnalysisPanel";
import LabelEditorModal from "./LabelEditorModal";

const PHOTO_CHECKLIST_APARTMENT = [
  "Building facade / Entrance",
  "Living room (2 angles)",
  "Kitchen",
  "Master bedroom",
  "Additional bedroom(s)",
  "Bathroom(s)",
  "Balcony / View",
  "Parking space"
];

const PHOTO_TIPS = [
  { icon: "🌅", tip: "Shoot during daytime with natural light" },
  { icon: "📐", tip: "Stand in corners for wider angle shots" },
  { icon: "🧹", tip: "Clear clutter before every photo" },
  { icon: "📱", tip: "Hold phone landscape (horizontal)" },
  { icon: "🚪", tip: "Shoot from doorway into the room" },
  { icon: "🏠", tip: "Include exterior + all rooms" }
];

export default function VisionPhotoStep({ propertyId, propertyData, photos, onChange }) {
  const [analyses, setAnalyses] = useState([]);
  const [report, setReport] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [labelModal, setLabelModal] = useState(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);

  // Load existing analyses
  useEffect(() => {
    if (!propertyId) return;
    apiClient.list("/api/v1/propertyphotoanalysis", { propertyId }).then(setAnalyses).catch(() => {});
    apiClient.list("/api/v1/propertyvisionreport", { propertyId }).then(r => r[0] && setReport(r[0])).catch(() => {});
  }, [propertyId]);

  const selectedAnalysis = analyses.find(a => a.photoUrl === selectedPhoto?.url);

  const handleFilesSelected = async (files) => {
    setUploading(true);
    for (const file of files) {
      // Upload file
      const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
      const newPhoto = { url: file_url, name: file.name };
      onChange([...(photos || []), newPhoto]);

      // Trigger analysis
      if (propertyId) {
        apiClient.post('/api/v1/ai/analyzePropertyPhoto', {
          photoUrl: file_url,
          propertyId,
          photoIndex: (photos?.length || 0),
          propertyData: propertyData || {}
        }).then(res => {
          if (res.data?.analysis) {
            setAnalyses(prev => {
              const filtered = prev.filter(a => a.photoUrl !== file_url);
              return [...filtered, res.data.analysis];
            });
          }
        }).catch(() => {});
      }
    }
    setUploading(false);
  };

  const handleRemovePhoto = (photo) => {
    onChange((photos || []).filter(p => p.url !== photo.url));
    setAnalyses(prev => prev.filter(a => a.photoUrl !== photo.url));
    if (selectedPhoto?.url === photo.url) setSelectedPhoto(null);
  };

  const handleSetMain = (photo) => {
    setAnalyses(prev => prev.map(a => ({ ...a, isMainPhoto: a.photoUrl === photo.url })));
  };

  const handleLabelSave = async (data) => {
    if (!labelModal?.analysis) return;
    const updated = await apiClient.put("/api/v1/propertyphotoanalysis/", labelModal.analysis.id, data);
    setAnalyses(prev => prev.map(a => a.id === updated.id ? updated : a));
    setLabelModal(null);
  };

  const handleRequestStaging = async (analysisId, style) => {
    await apiClient.post('/api/v1/ai/generateVirtualStaging', { photoAnalysisId: analysisId, style, propertyId });
    // Reload analyses
    if (propertyId) {
      const fresh = await apiClient.list("/api/v1/propertyphotoanalysis", { propertyId });
      setAnalyses(fresh);
    }
  };

  const handleGenerateReport = async () => {
    if (!propertyId) return;
    const res = await apiClient.post('/api/v1/ai/generateVisionReport', { propertyId });
    if (res.data?.report) setReport(res.data.report);
  };

  const checkedCount = (photos || []).filter(p =>
    analyses.some(a => a.photoUrl === p.url && a.analysisStatus === 'completed')
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900">📸 Property Photos</h2>
            <span className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-black px-2.5 py-1 rounded-full">
              <Sparkles size={11} /> Kemedar Vision™ AI
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Upload photos and our AI will analyze quality, label rooms, and help you get more views</p>
        </div>
        {(photos?.length || 0) >= 3 && (
          <button onClick={handleGenerateReport}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm">
            <Sparkles size={13} /> Generate Vision Report
          </button>
        )}
      </div>

      {/* Photo Tips Accordion */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          onClick={() => setTipsOpen(!tipsOpen)}>
          <span>📷 How to take great property photos</span>
          {tipsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {tipsOpen && (
          <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PHOTO_TIPS.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <p className="text-xs text-gray-600 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Required photos checklist */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          onClick={() => setChecklistOpen(!checklistOpen)}>
          <span>✅ Recommended photos for your property</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500 font-bold">{photos?.length || 0} / {PHOTO_CHECKLIST_APARTMENT.length}</span>
            {checklistOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        {checklistOpen && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {PHOTO_CHECKLIST_APARTMENT.map((item, i) => {
                const done = i < (photos?.length || 0);
                return (
                  <div key={i} className={`flex items-center gap-2 text-xs py-1.5 ${done ? 'text-green-700' : 'text-gray-500'}`}>
                    {done ? <CheckCircle size={13} className="text-green-500 flex-shrink-0" /> : <Circle size={13} className="text-gray-300 flex-shrink-0" />}
                    {item}
                  </div>
                );
              })}
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full transition-all"
                style={{ width: `${Math.min(((photos?.length || 0) / PHOTO_CHECKLIST_APARTMENT.length) * 100, 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Upload zone */}
      <VisionUploadZone onFilesSelected={handleFilesSelected} uploading={uploading} />

      {/* Photo grid + analysis panel */}
      {(photos?.length || 0) > 0 && (
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <VisionPhotoGrid
              photos={photos || []}
              analyses={analyses}
              selectedPhoto={selectedPhoto}
              onSelectPhoto={setSelectedPhoto}
              onRemovePhoto={handleRemovePhoto}
              onEditLabel={(photo, analysis) => setLabelModal({ photo, analysis })}
              onSetMain={handleSetMain}
              onStage={(photo, analysis) => {
                setSelectedPhoto(photo);
              }}
            />
          </div>
          <div className="hidden lg:block">
            <VisionAnalysisPanel
              selectedPhoto={selectedPhoto}
              selectedAnalysis={selectedAnalysis}
              report={report}
              onRequestStaging={handleRequestStaging}
            />
          </div>
        </div>
      )}

      {/* Label editor modal */}
      {labelModal && (
        <LabelEditorModal
          photo={labelModal.photo}
          analysis={labelModal.analysis}
          onSave={handleLabelSave}
          onClose={() => setLabelModal(null)}
        />
      )}
    </div>
  );
}