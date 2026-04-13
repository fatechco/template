import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { X, ChevronRight, Camera, CheckCircle2, AlertCircle } from "lucide-react";
import InspectionCheckin from "./InspectionCheckin";
import InspectionPhotos from "./InspectionPhotos";
import InspectionChecklist from "./InspectionChecklist";
import InspectionVerdict from "./InspectionVerdict";
import InspectionSubmit from "./InspectionSubmit";

const STEPS = [
  { id: 1, label: "Check In" },
  { id: 2, label: "Photos" },
  { id: 3, label: "Checklist" },
  { id: 4, label: "Verdict" },
  { id: 5, label: "Submit" },
];

export default function InspectionWizard({ report, user, onClose }) {
  const [step, setStep] = useState(1);
  const [gpsData, setGpsData] = useState(null);
  const [photos, setPhotos] = useState({});
  const [checklist, setChecklist] = useState({});
  const [verdict, setVerdict] = useState({ overall: "", issues: [], notes: "", recommendation: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    const report_data = {
      inspectionStatus: "completed",
      completedAt: new Date().toISOString(),
      gpsLat: gpsData?.lat,
      gpsLng: gpsData?.lng,
      gpsAccuracy: gpsData?.accuracy,
      gpsMatchesListing: (gpsData?.distance || 999) <= 500,
      gpsDistanceMeters: gpsData?.distance || 0,
      photosCount: Object.keys(photos).length,
      inspectionPhotos: Object.entries(photos).map(([label, url]) => ({ label, photoUrl: url, takenAt: new Date().toISOString(), gpsLat: gpsData?.lat, gpsLng: gpsData?.lng })),
      checklist,
      overallVerdict: verdict.overall,
      verdictNotes: verdict.notes,
      issuesFound: verdict.issues,
      issuesCount: verdict.issues.length,
      recommendedVerificationLevel: verdict.recommendation === "approve" ? 4 : 3,
      reportSubmittedAt: new Date().toISOString(),
    };
    await base44.entities.FOInspectionReport.update(report.id, report_data).catch(() => {});
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: report.tokenId,
      recordType: "fo_inspection_completed",
      actorType: "franchise_owner",
      actorLabel: user?.full_name || "Franchise Owner",
      title: `Inspection completed — Verdict: ${verdict.overall}`,
      metaData: { checklist_score: checkedCount, issues_count: verdict.issues.length, gps_match: (gpsData?.distance || 999) <= 500 },
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Report Submitted!</h2>
        <p className="text-gray-500 mb-1">Thank you, {user?.full_name || "Franchise Owner"}</p>
        <p className="text-sm text-gray-400 mb-1">Admin will review within 24 hours</p>
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mt-4 mb-8">
          <p className="text-sm font-bold text-green-700">💰 Payment of 400 EGP will be processed on approval</p>
        </div>
        <button onClick={onClose}
          className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-base transition-colors">
          Back to My Inspections
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <X size={16} />
          </button>
          <div className="text-center">
            <p className="text-xs font-black text-gray-900">Step {step} of {STEPS.length}</p>
            <p className="text-[10px] text-gray-400">{STEPS[step-1]?.label}</p>
          </div>
          <div className="w-8" />
        </div>
        {/* Progress */}
        <div className="max-w-lg mx-auto mt-3">
          <div className="flex gap-1">
            {STEPS.map(s => (
              <div key={s.id} className={`flex-1 h-1 rounded-full transition-all ${s.id <= step ? "bg-orange-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {step === 1 && <InspectionCheckin report={report} onComplete={(gps) => { setGpsData(gps); setStep(2); }} />}
          {step === 2 && <InspectionPhotos photos={photos} onChange={setPhotos} onNext={() => setStep(3)} />}
          {step === 3 && <InspectionChecklist checklist={checklist} onChange={setChecklist} onNext={() => setStep(4)} />}
          {step === 4 && <InspectionVerdict verdict={verdict} onChange={setVerdict} onNext={() => setStep(5)} photos={photos} />}
          {step === 5 && <InspectionSubmit report={report} gpsData={gpsData} photos={photos} checklist={checklist} verdict={verdict} onSubmit={handleSubmit} />}
        </div>
      </div>
    </div>
  );
}