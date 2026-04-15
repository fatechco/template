"use client";
// @ts-nocheck
import { useState, useRef } from "react";
import { Camera, Upload, Plus, X, ChevronDown, ChevronUp, Sparkles, Star, Pencil, Trash2, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const AREA_PHOTOS = [
  { key: "street", label: "Street view", icon: "🏙" },
  { key: "entrance", label: "Building entrance", icon: "🚪" },
  { key: "living", label: "Living room", icon: "🛋" },
  { key: "kitchen", label: "Kitchen", icon: "🍳" },
  { key: "bathroom", label: "Bathroom", icon: "🛁" },
  { key: "bedroom", label: "Bedroom", icon: "🛏" },
  { key: "balcony", label: "Balcony/View", icon: "🌅" },
];

const SCORE_COLOR = (s) =>
  s >= 90 ? "bg-green-700" : s >= 75 ? "bg-green-500" : s >= 60 ? "bg-yellow-400" : s >= 40 ? "bg-orange-500" : "bg-red-500";

const ANALYSIS_STEPS = [
  "Detecting room type…",
  "Checking finishing quality…",
  "Scoring photo quality…",
  "Looking for improvement tips…",
];

function AnalyzingOverlay() {
  const [step, setStep] = useState(0);
  useState(() => {
    const t = setInterval(() => setStep(s => (s + 1) % ANALYSIS_STEPS.length), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-1 z-10">
      <Sparkles size={18} className="text-purple-500 animate-pulse" />
      <span className="text-purple-600 text-[9px] font-bold text-center px-1 leading-tight">{ANALYSIS_STEPS[step]}</span>
    </div>
  );
}

function PhotoCard({ photo, analysis, isMain, onRemove, onSetMain, onEditLabel, onStage }) {
  const [showStaged, setShowStaged] = useState(false);
  const isAnalyzing = analysis?.analysisStatus === "processing";
  const isDone = analysis?.analysisStatus === "completed";
  const hasStaging = isDone && analysis?.stagingStatus === "completed" && analysis?.stagedPhotoUrl;
  const hasIssues = isDone && analysis?.hasIssues;
  const critical = hasIssues && analysis.issues?.some(i => i.severity === "critical");

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square group">
      {/* Photo */}
      <img
        src={(showStaged && analysis?.stagedPhotoUrl) ? analysis.stagedPhotoUrl : photo.url}
        alt="property"
        className="w-full h-full object-cover"
      />

      {/* Analyzing overlay */}
      {isAnalyzing && <AnalyzingOverlay />}

      {/* Quality score badge */}
      {isDone && analysis.qualityScore != null && (
        <div className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-full ${SCORE_COLOR(analysis.qualityScore)} flex items-center justify-center shadow z-20`}>
          <span className="text-white text-[9px] font-black">{analysis.qualityScore}</span>
        </div>
      )}

      {/* Room label */}
      {isDone && analysis.suggestedLabel && (
        <div className="absolute top-1.5 right-1.5 bg-white/90 text-gray-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow z-20 max-w-[70px] truncate">
          {analysis.suggestedLabel}
        </div>
      )}

      {/* Main badge */}
      {isMain && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow">⭐ Cover</span>
        </div>
      )}

      {/* Staged toggle */}
      {hasStaging && (
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex">
          <button onClick={() => setShowStaged(false)}
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-l-full transition-colors ${!showStaged ? 'bg-gray-800 text-white' : 'bg-white/80 text-gray-500'}`}>
            Original
          </button>
          <button onClick={() => setShowStaged(true)}
            className={`text-[8px] font-bold px-1.5 py-0.5 rounded-r-full transition-colors ${showStaged ? 'bg-purple-600 text-white' : 'bg-white/80 text-gray-500'}`}>
            ✨ Staged
          </button>
        </div>
      )}

      {/* Issues strip */}
      {hasIssues && (
        <div className={`absolute bottom-0 left-0 right-0 py-0.5 px-1 z-20 ${critical ? 'bg-red-500' : 'bg-orange-400'}`}>
          <span className="text-white text-[8px] font-bold">{critical ? '🔴 Critical' : `⚠️ ${analysis.issues.length}`}</span>
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 flex items-center justify-around opacity-0 group-hover:opacity-100 transition-opacity z-30">
        {isDone && analysis?.isEligibleForStaging && analysis?.stagingStatus === 'not_requested' && (
          <button onClick={() => onStage?.(photo, analysis)} title="Stage" className="text-purple-300">
            <span className="text-xs">🪑</span>
          </button>
        )}
        {isDone && (
          <button onClick={() => onEditLabel?.(photo, analysis)} className="text-white"><Pencil size={11} /></button>
        )}
        <button onClick={() => onSetMain?.(photo)} className="text-yellow-300"><Star size={11} /></button>
        <button onClick={() => onRemove(photo)} className="text-red-300"><Trash2 size={11} /></button>
      </div>

      {/* Upload progress shimmer */}
      {photo.uploading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-20">
          <Loader2 size={20} className="text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
}

function VisionPanel({ analyses, onRequestStaging }) {
  const done = analyses.filter(a => a.analysisStatus === 'completed');
  if (done.length === 0) return null;

  const avgScore = Math.round(done.reduce((s, a) => s + (a.qualityScore || 0), 0) / done.length);
  const issues = done.flatMap(a => a.issues || []);
  const critical = issues.filter(i => i.severity === 'critical').length;
  const tips = done.flatMap(a => a.improvementTips || []).sort((a, b) => a.priority - b.priority).slice(0, 3);
  const eligible = done.filter(a => a.isEligibleForStaging && a.stagingStatus === 'not_requested');

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-3 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-purple-500" />
          <span className="font-black text-purple-800 text-sm">Kemedar Vision™</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-lg font-black ${avgScore >= 70 ? 'text-green-600' : avgScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>{avgScore}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 text-[10px]">
        <span className="bg-white rounded-lg px-2 py-1 font-semibold text-gray-600">{done.length} analyzed</span>
        {critical > 0 && (
          <span className="bg-red-100 text-red-700 rounded-lg px-2 py-1 font-semibold">🔴 {critical} critical</span>
        )}
        {issues.length === 0 && (
          <span className="bg-green-100 text-green-700 rounded-lg px-2 py-1 font-semibold">✅ No issues</span>
        )}
        {eligible.length > 0 && (
          <span className="bg-purple-100 text-purple-700 rounded-lg px-2 py-1 font-semibold">🪑 {eligible.length} stageable</span>
        )}
      </div>

      {/* Top tips */}
      {tips.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-black text-purple-700 uppercase tracking-wide">Top Tips</p>
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5 bg-white rounded-xl px-2.5 py-2">
              <span className="text-orange-400 font-black text-[9px] flex-shrink-0 mt-0.5">P{tip.priority}</span>
              <p className="text-[10px] text-gray-700 leading-tight">{tip.tip}</p>
            </div>
          ))}
        </div>
      )}

      {/* Staging CTA */}
      {eligible.length > 0 && (
        <button onClick={() => onRequestStaging?.(eligible[0])}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
          <Sparkles size={11} /> Stage a Room (1 credit)
        </button>
      )}
    </div>
  );
}

export default function PropStep3Media({ form, update, propertyId, onNext }) {
  const [areaExpanded, setAreaExpanded] = useState(false);
  const [docsExpanded, setDocsExpanded] = useState(false);
  const [analyses, setAnalyses] = useState([]);
  const [stagingLoading, setStagingLoading] = useState(false);
  const fileInputRef = useRef();
  const gallery = form.gallery || [];

  const triggerAnalysis = async (photoUrl) => {
    if (!propertyId) return;
    // Mark as processing locally
    const tempId = `temp-${Date.now()}`;
    setAnalyses(prev => [...prev, { id: tempId, photoUrl, analysisStatus: 'processing' }]);

    apiClient.post('/api/v1/ai/analyzePropertyPhoto', {
      photoUrl,
      propertyId,
      photoIndex: gallery.length,
      propertyData: {
        category: form.category,
        totalArea: form.total_area,
        price: form.price,
        city: form.city,
        district: form.district,
        furnished: form.furnished
      }
    }).then(res => {
      if (res.data?.analysis) {
        setAnalyses(prev => prev.map(a => a.id === tempId ? res.data.analysis : a));
      } else {
        setAnalyses(prev => prev.filter(a => a.id !== tempId));
      }
    }).catch(() => {
      setAnalyses(prev => prev.filter(a => a.id !== tempId));
    });
  };

  const handleFileUpload = async (files) => {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      // Add placeholder
      const tempUrl = URL.createObjectURL(file);
      const placeholder = { url: tempUrl, uploading: true };
      const newGallery = [...gallery, placeholder];
      update({ gallery: newGallery });

      // Upload
      const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
      const uploadedPhoto = { url: file_url };

      // Replace placeholder
      update(prev => {
        const g = (prev.gallery || []).map(p => p.url === tempUrl ? uploadedPhoto : p);
        return { gallery: g };
      });

      // Trigger Vision analysis
      triggerAnalysis(file_url);
    }
  };

  const handleMainPhotoUpload = async (files) => {
    const file = files[0];
    if (!file) return;
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
    update({ main_photo: file_url });
    triggerAnalysis(file_url);
  };

  const removeGallery = (photo) => {
    update({ gallery: gallery.filter(p => p.url !== photo.url) });
    setAnalyses(prev => prev.filter(a => a.photoUrl !== photo.url));
  };

  const handleSetMain = (photo) => {
    update({ main_photo: photo.url });
    setAnalyses(prev => prev.map(a => ({ ...a, isMainPhoto: a.photoUrl === photo.url })));
  };

  const handleRequestStaging = async (analysis) => {
    if (!analysis?.id || stagingLoading) return;
    setStagingLoading(true);
    await apiClient.post('/api/v1/ai/generateVirtualStaging', {
      photoAnalysisId: analysis.id,
      style: 'modern',
      propertyId
    }).catch(() => {});
    // Reload analyses from DB
    if (propertyId) {
      const fresh = await apiClient.list("/api/v1/propertyphotoanalysis", { propertyId }).catch(() => []);
      setAnalyses(fresh);
    }
    setStagingLoading(false);
  };

  const analysisMap = Object.fromEntries(analyses.map(a => [a.photoUrl, a]));
  const allPhotos = form.main_photo ? [{ url: form.main_photo }, ...gallery.filter(p => p.url !== form.main_photo)] : gallery;
  const analyzedCount = analyses.filter(a => a.analysisStatus === 'completed').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-black text-gray-900">Show it off! 📸</h2>
        <span className="flex items-center gap-1 bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded-full">
          <Sparkles size={9} /> Vision™ AI
        </span>
      </div>
      <p className="text-sm text-gray-400 text-center mt-1 mb-6">Great photos get 3× more inquiries · AI analyzes each photo instantly</p>

      {/* Main photo */}
      <p className="text-sm font-black text-gray-700 mb-2">Main Photo <span className="text-red-500">*</span></p>
      <div className="mb-5">
        {form.main_photo ? (
          <div className="relative rounded-2xl overflow-hidden h-40">
            <img src={form.main_photo} alt="main" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 z-10 flex gap-1.5">
              {analysisMap[form.main_photo]?.analysisStatus === 'completed' && (
                <div className={`w-8 h-8 rounded-full ${SCORE_COLOR(analysisMap[form.main_photo].qualityScore)} flex items-center justify-center shadow`}>
                  <span className="text-white text-[10px] font-black">{analysisMap[form.main_photo].qualityScore}</span>
                </div>
              )}
              {analysisMap[form.main_photo]?.analysisStatus === 'processing' && (
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <Sparkles size={12} className="text-white animate-pulse" />
                </div>
              )}
            </div>
            <button onClick={() => update({ main_photo: null })}
              className="absolute top-2 left-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center z-10">
              <X size={12} color="white" />
            </button>
          </div>
        ) : (
          <label className="w-full h-40 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors">
            <Camera size={32} className="text-orange-400" />
            <span className="text-xs text-gray-500 font-semibold">Tap to add main photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => handleMainPhotoUpload(e.target.files)} />
          </label>
        )}
      </div>

      {/* Gallery */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-black text-gray-700">Photo Gallery</p>
        {analyzedCount > 0 && (
          <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5">
            <CheckCircle size={10} /> {analyzedCount} analyzed
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {gallery.map((photo, i) => (
          <PhotoCard
            key={photo.url || i}
            photo={photo}
            analysis={analysisMap[photo.url]}
            isMain={form.main_photo === photo.url}
            onRemove={removeGallery}
            onSetMain={handleSetMain}
            onStage={handleRequestStaging}
          />
        ))}
        {gallery.length < 20 && (
          <label className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-orange-100 transition-colors">
            <Plus size={22} className="text-orange-400" />
            <span className="text-[10px] text-gray-400 mt-1">Add photo</span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => handleFileUpload(e.target.files)} />
          </label>
        )}
      </div>

      {/* Vision AI Panel */}
      <VisionPanel analyses={analyses} onRequestStaging={handleRequestStaging} />

      {/* Area-specific photos */}
      <button onClick={() => setAreaExpanded(e => !e)}
        className="w-full flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3.5 mb-2 mt-4">
        <span className="text-sm font-black text-gray-700">📋 Add specific area photos</span>
        {areaExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {areaExpanded && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {AREA_PHOTOS.map(ap => (
            <div key={ap.key}>
              <p className="text-xs text-gray-500 font-semibold mb-1">{ap.icon} {ap.label}</p>
              {form[`area_${ap.key}`] ? (
                <div className="relative rounded-2xl overflow-hidden h-24">
                  <img src={form[`area_${ap.key}`]} alt={ap.label} className="w-full h-full object-cover" />
                  <button onClick={() => update({ [`area_${ap.key}`]: null })}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                    <X size={12} color="white" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                  <Plus size={20} className="text-gray-400" />
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
                      update({ [`area_${ap.key}`]: file_url });
                      triggerAnalysis(file_url);
                    }} />
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Documents */}
      <button onClick={() => setDocsExpanded(e => !e)}
        className="w-full flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3.5 mb-2">
        <span className="text-sm font-black text-gray-700">📄 Add documents & video links</span>
        {docsExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      {docsExpanded && (
        <div className="space-y-3 mb-4">
          {[{ key: "floor_plan", label: "📄 Floor Plan" }, { key: "brochure", label: "📋 Brochure" }].map(d => (
            <button key={d.key} onClick={() => update({ [d.key]: "file" })}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 ${form[d.key] ? "border-orange-600 bg-orange-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
              <Upload size={18} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">{form[d.key] ? `✅ ${d.label} uploaded` : d.label}</span>
            </button>
          ))}
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-500">YouTube links (optional)</p>
            {(form.youtube_links || ["", "", ""]).map((link, i) => (
              <input key={i} value={link} onChange={e => {
                const links = [...(form.youtube_links || ["", "", ""])];
                links[i] = e.target.value;
                update({ youtube_links: links });
              }}
                placeholder={`YouTube URL ${i + 1}`}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
            ))}
            <input value={form.vr_link || ""} onChange={e => update({ vr_link: e.target.value })}
              placeholder="VR / 360° tour link"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
      <button onClick={onNext}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>
    </div>
  );
}