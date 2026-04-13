import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const VERDICT_COLORS = {
  pass: "bg-green-500 text-white",
  fail: "bg-red-500 text-white",
  partial: "bg-amber-400 text-white",
  inconclusive: "bg-gray-300 text-gray-700",
};

const CHECKLIST_LABELS = [
  "Property exists at address",
  "Property matches listing photos",
  "Property matches listing specs",
  "Seller or representative present",
  "No major structural issues",
  "Utilities functional",
  "Legal notices / encumbrances visible",
  "GPS location confirmed",
];

function InspectionCard({ report, onAction }) {
  const [acting, setActing] = useState(false);
  const [note, setNote] = useState("");

  const checklist = report.checklist || {};
  const passedItems = Object.values(checklist).filter(Boolean).length;

  const handleAction = async (action) => {
    setActing(true);
    const data = {
      adminReviewStatus: action === "approve" ? "approved" : action === "reinspect" ? "needs_revision" : "rejected",
      adminReviewNotes: note,
      adminReviewedAt: new Date().toISOString(),
    };
    await base44.entities.FOInspectionReport.update(report.id, data).catch(() => {});
    if (action === "approve") {
      await base44.functions.invoke("advanceVerificationLevel", {
        tokenId: report.tokenId, newLevel: 4, actorUserId: "admin",
      }).catch(() => {});
    }
    setActing(false);
    onAction();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Left: Map + FO Info */}
        <div className="lg:col-span-2 p-5 bg-gray-50">
          {/* GPS Match */}
          <div className={`rounded-xl p-4 mb-4 text-center ${
            report.gpsMatchesListing ? "bg-green-50 border border-green-200" :
            (report.gpsDistanceMeters || 0) < 500 ? "bg-yellow-50 border border-yellow-200" :
            "bg-red-50 border border-red-200"
          }`}>
            <p className="text-2xl mb-1">{report.gpsMatchesListing ? "🟢" : (report.gpsDistanceMeters || 0) < 500 ? "🟡" : "🔴"}</p>
            <p className="text-sm font-black text-gray-900">GPS Distance: {Math.round(report.gpsDistanceMeters || 0)}m</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {report.gpsMatchesListing ? "Excellent match" : (report.gpsDistanceMeters || 0) < 500 ? "Good match" : "Large mismatch — review"}
            </p>
          </div>

          {/* FO Info */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">FO:</span><span className="font-bold text-gray-900">{report.foUserId?.slice(0, 8)}...</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-bold">{report.scheduledDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time:</span><span className="font-bold">{report.scheduledTime || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Checklist:</span><span className="font-bold">{passedItems}/8 passed</span></div>
          </div>
        </div>

        {/* Right: Verdict + Details */}
        <div className="lg:col-span-3 p-5">
          {report.overallVerdict && (
            <div className={`rounded-xl px-5 py-3 mb-4 text-center font-black text-lg ${VERDICT_COLORS[report.overallVerdict] || "bg-gray-100"}`}>
              {report.overallVerdict === "pass" ? "✅ CLEAN PASS" :
               report.overallVerdict === "fail" ? "❌ FAILED" :
               report.overallVerdict === "partial" ? "⚠️ MINOR ISSUES" : "❓ INCONCLUSIVE"}
            </div>
          )}

          {/* Checklist */}
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {CHECKLIST_LABELS.map((label, i) => {
              const key = Object.keys(checklist)[i];
              const passed = key ? checklist[key] : false;
              return (
                <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  <span>{passed ? "✅" : "❌"}</span>
                  <span className="truncate">{label}</span>
                </div>
              );
            })}
          </div>

          {report.verdictNotes && (
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500 font-bold mb-1">FO Notes:</p>
              <p className="text-xs text-gray-700 italic">"{report.verdictNotes}"</p>
            </div>
          )}

          {/* Photos */}
          {report.inspectionPhotos?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {report.inspectionPhotos.slice(0, 6).map((photo, i) => (
                <img key={i} src={photo.photoUrl} alt={photo.label} className="w-full h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}

          {/* Admin Decision */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Admin Decision</p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Admin notes..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none mb-3 h-16 resize-none" />
            <div className="flex gap-2">
              <button onClick={() => handleAction("approve")} disabled={acting}
                className="flex-1 bg-green-500 text-white font-black py-2 rounded-xl text-xs hover:bg-green-600 disabled:opacity-50">
                ✅ Approve Level 4
              </button>
              <button onClick={() => handleAction("reinspect")} disabled={acting}
                className="flex-1 border-2 border-amber-400 text-amber-700 font-bold py-2 rounded-xl text-xs hover:bg-amber-50 disabled:opacity-50">
                🔄 Re-inspect
              </button>
              <button onClick={() => handleAction("reject")} disabled={acting}
                className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2 rounded-xl text-xs hover:bg-red-50 disabled:opacity-50">
                ❌ Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyProInspections() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("awaiting");

  const load = async () => {
    const data = await base44.entities.FOInspectionReport.list("-scheduledDate", 100).catch(() => []);
    setReports(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const byTab = {
    awaiting: reports.filter(r => r.adminReviewStatus === "pending" && r.inspectionStatus === "completed"),
    scheduled: reports.filter(r => r.inspectionStatus === "scheduled" || r.inspectionStatus === "confirmed"),
    completed: reports.filter(r => r.adminReviewStatus === "approved"),
    disputed: reports.filter(r => r.adminReviewStatus === "needs_revision"),
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">🔍 FO Inspections</h1>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm flex-wrap">
        {Object.entries({ awaiting: "Awaiting Review", scheduled: "Scheduled", completed: "Completed", disputed: "Disputed" }).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === k ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}>
            {v} ({byTab[k]?.length || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : (byTab[tab] || []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold text-gray-500">No inspections in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(byTab[tab] || []).map(r => <InspectionCard key={r.id} report={r} onAction={load} />)}
        </div>
      )}
    </div>
  );
}