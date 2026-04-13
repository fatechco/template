import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Phone, MapPin, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import InspectionWizard from "@/components/fo/InspectionWizard";

function timeUntil(dateStr) {
  const diff = new Date(dateStr) - Date.now();
  if (diff < 0) return "Today";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

function RequestCard({ report, onAccept, onDecline }) {
  const [acting, setActing] = useState(false);
  const fee = 400;

  const handleAccept = async () => {
    setActing(true);
    await base44.entities.FOInspectionReport.update(report.id, {
      inspectionStatus: "confirmed",
      confirmedByFO: true,
    }).catch(() => {});
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: report.tokenId,
      recordType: "fo_inspection_scheduled",
      actorType: "franchise_owner",
      actorLabel: "Franchise Owner",
      title: "FO accepted inspection request",
    }).catch(() => {});
    setActing(false);
    onAccept();
  };

  const handleDecline = async () => {
    setActing(true);
    await base44.entities.FOInspectionReport.update(report.id, {
      inspectionStatus: "cancelled",
      confirmedByFO: false,
    }).catch(() => {});
    setActing(false);
    onDecline();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex gap-3 mb-4">
        <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
          <span className="text-3xl">🏠</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm line-clamp-1">{report.propertyId || "Property Inspection"}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10} className="text-orange-500" /> Address loading...</p>
          <p className="text-xs text-gray-400 mt-0.5">📅 {report.scheduledDate} · {report.scheduledTime}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">💰 {fee} EGP</span>
            <span className="text-[10px] text-gray-400">Token: {report.tokenId?.slice(0, 12)}...</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleAccept} disabled={acting}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
          ✅ Accept Inspection
        </button>
        <button onClick={handleDecline} disabled={acting}
          className="px-4 border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-xl text-sm hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50">
          ❌
        </button>
      </div>
    </div>
  );
}

function ScheduledCard({ report, onStartInspection }) {
  const isToday = report.scheduledDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${report.confirmedBySeller ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {report.confirmedBySeller ? "Confirmed ✅" : "Pending seller confirm"}
        </span>
        <span className="text-xs text-gray-400">{timeUntil(report.scheduledDate)}</span>
      </div>
      <p className="font-black text-gray-900 mb-2 flex items-center gap-2">
        <span>📅</span> {report.scheduledDate} at {report.scheduledTime || "TBD"}
      </p>
      <button onClick={() => {}} className="text-sm text-orange-500 flex items-center gap-1 mb-2 font-semibold">
        <MapPin size={13} /> {report.propertyId?.slice(0, 16) || "View on Maps"} <ChevronRight size={12} />
      </button>
      <p className="text-xs text-gray-500 mb-1"><Phone size={10} className="inline mr-1" />Seller phone: — </p>
      <p className="text-xs text-gray-400 font-mono">Token: {report.tokenId}</p>

      {isToday && (
        <button onClick={() => onStartInspection(report)}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm transition-colors">
          🔍 Start Inspection
        </button>
      )}
      {!isToday && (
        <div className="mt-3 bg-gray-50 rounded-xl px-4 py-2 text-center text-xs text-gray-400">
          Available on inspection day
        </div>
      )}
    </div>
  );
}

function CompletedCard({ report }) {
  const verdict = report.overallVerdict || "—";
  const colors = { pass: "text-green-600", fail: "text-red-600", partial: "text-amber-600", inconclusive: "text-gray-600" };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <p className="font-black text-gray-900 text-sm">{report.tokenId?.slice(0, 12)}...</p>
        <span className={`text-xs font-black uppercase ${colors[verdict]}`}>{verdict}</span>
      </div>
      <p className="text-xs text-gray-500">📅 {report.scheduledDate}</p>
      <p className="text-xs text-gray-400 mt-1">Submitted: {report.reportSubmittedAt ? new Date(report.reportSubmittedAt).toLocaleDateString() : "—"}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          report.adminReviewStatus === "approved" ? "bg-green-100 text-green-700" :
          report.adminReviewStatus === "rejected" ? "bg-red-100 text-red-600" :
          "bg-gray-100 text-gray-500"
        }`}>
          Admin: {report.adminReviewStatus || "pending"}
        </span>
        {report.adminReviewStatus === "approved" && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">💰 Payment: Processing</span>
        )}
      </div>
    </div>
  );
}

export default function FOInspections() {
  const [tab, setTab] = useState("new");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeInspection, setActiveInspection] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    load();
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const load = async () => {
    const data = await base44.entities.FOInspectionReport.list("-scheduledDate", 100).catch(() => []);
    setReports(data);
    setLoading(false);
  };

  if (activeInspection) {
    return <InspectionWizard report={activeInspection} user={user} onClose={() => { setActiveInspection(null); load(); }} />;
  }

  const byTab = {
    new: reports.filter(r => r.inspectionStatus === "scheduled" && !r.confirmedByFO),
    scheduled: reports.filter(r => ["scheduled", "confirmed"].includes(r.inspectionStatus) && r.confirmedByFO),
    completed: reports.filter(r => ["completed", "no_show", "cancelled", "rescheduled"].includes(r.inspectionStatus)),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-bold px-4 py-2 text-center">
          📵 Working offline — data will sync when connected
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-safe-top">
        <div className="max-w-lg mx-auto py-4">
          <h1 className="text-xl font-black text-gray-900">My Inspections</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kemedar Verify Pro™ · Franchise Owner</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto">
          <div className="flex">
            {[
              { key: "new", label: "New Requests" },
              { key: "scheduled", label: "Scheduled" },
              { key: "completed", label: "Completed" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${tab === t.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                {t.label}
                {byTab[t.key]?.length > 0 && (
                  <span className={`ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {byTab[t.key].length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />)}</div>
        ) : byTab[tab]?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mt-4">
            <p className="text-4xl mb-3">{tab === "new" ? "📬" : tab === "scheduled" ? "📅" : "✅"}</p>
            <p className="font-bold text-gray-500 text-sm">No {tab} inspections</p>
          </div>
        ) : (
          <div>
            {tab === "new" && byTab.new.map(r => (
              <RequestCard key={r.id} report={r} onAccept={load} onDecline={load} />
            ))}
            {tab === "scheduled" && byTab.scheduled.map(r => (
              <ScheduledCard key={r.id} report={r} onStartInspection={setActiveInspection} />
            ))}
            {tab === "completed" && byTab.completed.map(r => (
              <CompletedCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}