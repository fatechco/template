import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, ChevronDown, ChevronUp, Plus } from "lucide-react";

const REQUIRED_DOCS = [
  { key: "title_deed", label: "Title Deed (Shaqa/Tabu)", icon: "📜", required: true, desc: "Official ownership document from notary or real estate registry" },
  { key: "national_id", label: "National ID", icon: "🪪", required: true, desc: "Pre-filled from Level 2 if already uploaded" },
  { key: "utility_bill", label: "Utility Bill", icon: "💡", required: false, desc: "Recent electricity or water bill showing property address" },
  { key: "tax_certificate", label: "Tax Certificate", icon: "📋", required: false, desc: "Property tax clearance from Tax Authority" },
];

const EXTRA_DOC_TYPES = [
  { key: "building_permit", label: "Building Permit" },
  { key: "survey_report", label: "Survey Report" },
  { key: "noc_letter", label: "NOC Letter" },
  { key: "inheritance_doc", label: "Inheritance Document" },
  { key: "power_of_attorney", label: "Power of Attorney" },
  { key: "other", label: "Other" },
];

const DECISION_COLORS = {
  authentic: "text-green-600 bg-green-50 border-green-200",
  likely_authentic: "text-green-600 bg-green-50 border-green-200",
  suspicious: "text-orange-600 bg-orange-50 border-orange-200",
  likely_fraudulent: "text-red-600 bg-red-50 border-red-200",
  unreadable: "text-gray-600 bg-gray-50 border-gray-200",
};

function StatusBadge({ doc }) {
  if (!doc) return <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Not uploaded</span>;
  if (doc.uploading) return <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />Uploading...</span>;
  if (doc.analyzing) return <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1"><span className="w-3 h-3 border border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />AI Analyzing...</span>;
  if (doc.aiScore !== undefined) {
    const colorClass = DECISION_COLORS[doc.aiDecision] || "text-gray-600 bg-gray-50 border-gray-200";
    const icon = doc.aiScore >= 75 ? "✅" : doc.aiScore >= 50 ? "⚠️" : "🚨";
    return <span className={`text-xs px-2 py-1 rounded-full border font-bold ${colorClass}`}>{icon} Score: {doc.aiScore}/100 — {doc.aiDecision?.replace(/_/g, " ")}</span>;
  }
  if (doc.foApproved) return <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full font-bold">✅ FO Approved</span>;
  return null;
}

function DocCard({ docType, docData, tokenId, propertyId, userId, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showDropzone, setShowDropzone] = useState(!docData);

  const handleUpload = async (file) => {
    if (!file) return;
    onUpdate(docType.key, { uploading: true });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Create VerificationDocument record
    const docRecord = await base44.entities.VerificationDocument.create({
      tokenId, propertyId, submittedByUserId: userId,
      documentType: docType.key, fileUrl: file_url,
      fileType: file.name.split(".").pop().toLowerCase(),
      overallStatus: "pending",
    });

    onUpdate(docType.key, { fileUrl: file_url, analyzing: true, docId: docRecord.id });

    // Append upload record
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId, recordType: "document_uploaded",
      actorType: "seller", actorUserId: userId,
      title: `${docType.label} uploaded`,
      metaData: { documentType: docType.key, fileUrl: file_url },
    });

    // Trigger AI analysis
    const result = await base44.functions.invoke("analyzeDocumentWithAI", { documentId: docRecord.id });
    const analysis = result.data?.analysis || {};
    onUpdate(docType.key, {
      fileUrl: file_url, analyzing: false,
      aiScore: analysis.aiScore, aiDecision: analysis.aiDecision,
      aiFindings: analysis.aiFindings || [], aiSummary: analysis.aiSummary,
    });
  };

  const hasFindings = docData?.aiFindings?.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="text-2xl flex-shrink-0">{docType.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-gray-900 text-sm">{docType.label}</p>
            {docType.required && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">REQUIRED</span>}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{docType.desc}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <StatusBadge doc={docData} />
          {hasFindings && (
            <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
              Findings {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          )}
        </div>
      </div>

      {expanded && hasFindings && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-t border-gray-50">
          {docData.aiFindings.map((f, i) => {
            const sev = { info: "text-blue-600", warning: "text-orange-600", critical: "text-red-600" };
            return (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`font-bold flex-shrink-0 ${sev[f.severity] || "text-gray-500"}`}>{f.severity?.toUpperCase()}</span>
                <span className="text-gray-600">{f.finding}: {f.detail}</span>
              </div>
            );
          })}
        </div>
      )}

      {!docData && (
        <div className="px-5 pb-5">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-5 text-center cursor-pointer hover:border-[#FF6B00] transition-colors relative">
            <span className="text-2xl mb-1">📁</span>
            <p className="text-xs text-gray-500">Drag & drop or tap to upload</p>
            <p className="text-[10px] text-gray-300 mt-0.5">JPG, PNG or PDF — max 5MB</p>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={e => handleUpload(e.target.files?.[0])} />
          </label>
        </div>
      )}
    </div>
  );
}

export default function VerifyLevel3({ token, property, currentLevel, onComplete }) {
  const [docs, setDocs] = useState({});
  const [extraDocs, setExtraDocs] = useState([]);
  const [showExtraMenu, setShowExtraMenu] = useState(false);
  const locked = currentLevel < 2;

  const updateDoc = (key, data) => setDocs(p => ({ ...p, [key]: { ...(p[key] || {}), ...data } }));

  const uploadedCount = Object.values(docs).filter(d => d && !d.uploading && !d.analyzing).length;
  const allDocs = [...REQUIRED_DOCS, ...extraDocs];

  return (
    <div className={`flex flex-col gap-4 ${locked ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📄</span>
          <p className="font-black text-gray-900">Upload Verification Documents</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">Documents are AI-analyzed automatically. Franchise Owner gives final approval (24–48 hrs).</p>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-600">{uploadedCount} of {allDocs.length} documents uploaded</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#FF6B00] rounded-full transition-all" style={{ width: `${Math.min(100, (uploadedCount / allDocs.length) * 100)}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {allDocs.map(dt => (
            <DocCard
              key={dt.key}
              docType={dt}
              docData={docs[dt.key]}
              tokenId={token?.id}
              propertyId={property?.id}
              userId={null}
              onUpdate={updateDoc}
            />
          ))}
        </div>

        {/* Add More */}
        <div className="relative mt-3">
          <button
            onClick={() => setShowExtraMenu(!showExtraMenu)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
          >
            <Plus size={16} /> Add More Documents
          </button>
          {showExtraMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {EXTRA_DOC_TYPES.filter(et => !allDocs.find(d => d.key === et.key)).map(et => (
                <button key={et.key} onClick={() => { setExtraDocs(p => [...p, { key: et.key, label: et.label, icon: "📄", required: false, desc: "" }]); setShowExtraMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors">
                  {et.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {uploadedCount >= 2 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⏳</span>
          <div>
            <p className="font-bold text-orange-800 text-sm">Documents submitted for Franchise Owner review</p>
            <p className="text-sm text-orange-600">Expected: 24–48 hours</p>
            <p className="text-xs text-orange-500 mt-0.5">You will be notified when approved</p>
          </div>
        </div>
      )}
    </div>
  );
}