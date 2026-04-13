import { useState, useEffect } from "react";
import { Eye, ExternalLink, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const URGENCY_BADGE = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-orange-100 text-orange-600",
  high: "bg-red-100 text-red-600",
  emergency: "bg-red-600 text-white",
};

const STATUS_BADGE = {
  uploading: "bg-blue-50 text-blue-600",
  analyzing: "bg-yellow-50 text-yellow-600",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-600",
  converted: "bg-teal-50 text-teal-700",
  dismissed: "bg-gray-100 text-gray-500",
};

const CATEGORIES = [
  "All", "plumbing-services", "electrical-services", "ac-hvac", "carpentry",
  "painting-decoration", "tiling-flooring", "general-maintenance", "appliance-repair",
];

function SessionDetailModal({ session, onClose }) {
  if (!session) return null;
  const materials = session.requiredMaterials || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-black text-gray-900">Session Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {session.originalImageUrl && (
            <img src={session.originalImageUrl} alt="Snapped" className="w-full rounded-xl object-cover max-h-64" />
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-gray-400">Diagnosed Issue</p><p className="font-bold text-gray-900">{session.diagnosedIssue || "—"}</p></div>
            <div><p className="text-xs text-gray-400">Category</p><p className="font-bold text-gray-900">{session.kemeworkCategorySlug || "—"}</p></div>
            <div><p className="text-xs text-gray-400">Urgency</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full capitalize ${URGENCY_BADGE[session.urgencyLevel] || "bg-gray-100 text-gray-600"}`}>{session.urgencyLevel || "—"}</span>
            </div>
            <div><p className="text-xs text-gray-400">Status</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[session.status] || "bg-gray-100 text-gray-600"}`}>{session.status}</span>
            </div>
            <div><p className="text-xs text-gray-400">Est. Labor Hours</p><p className="font-bold">{session.estimatedLaborHoursMin}–{session.estimatedLaborHoursMax} hrs</p></div>
            <div><p className="text-xs text-gray-400">Est. Labor Cost</p><p className="font-bold">{session.estimatedLaborCostEGPMin?.toLocaleString()}–{session.estimatedLaborCostEGPMax?.toLocaleString()} EGP</p></div>
            <div><p className="text-xs text-gray-400">Skill Required</p><p className="font-bold">{session.professionalSkillRequired || "—"}</p></div>
            <div><p className="text-xs text-gray-400">Location</p><p className="font-bold">{session.locationText || "—"}</p></div>
          </div>
          {session.technicalDescription && (
            <div><p className="text-xs text-gray-400 mb-1">Technical Description</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{session.technicalDescription}</p>
            </div>
          )}
          {session.safetyWarning && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-bold text-red-700 mb-1">⚠️ Safety Warning</p>
              <p className="text-sm text-red-600">{session.safetyWarning}</p>
            </div>
          )}
          {materials.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2">Required Materials ({materials.length})</p>
              <div className="space-y-2">
                {materials.map((m, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="font-medium text-gray-800">{m.itemName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs">{m.quantity} {m.unit}</span>
                      {m.estimatedCostEGP && <span className="font-bold text-gray-700">{m.estimatedCostEGP} EGP</span>}
                      <a href={`/kemetro/search?q=${encodeURIComponent(m.kemetroSearchKeywords || m.itemName)}`}
                        target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {session.resultingTaskId && (
            <a href={`/kemework/task/${session.resultingTaskId}`} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-colors">
              <ExternalLink size={14} /> View Resulting Task
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SnapFixSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterUserType, setFilterUserType] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.SnapSession.list("-created_date", 200)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s => {
    if (filterStatus !== "All" && s.status !== filterStatus.toLowerCase()) return false;
    if (filterUrgency !== "All" && s.urgencyLevel !== filterUrgency.toLowerCase()) return false;
    if (filterCategory !== "All" && s.kemeworkCategorySlug !== filterCategory) return false;
    if (filterUserType === "Registered" && !s.userId) return false;
    if (filterUserType === "Guest" && s.userId) return false;
    if (dateFrom && new Date(s.created_date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(s.created_date) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ["Date", "Issue", "Category", "Urgency", "Status", "Materials", "User"];
    const rows = filtered.map(s => [
      new Date(s.created_date).toLocaleDateString(),
      s.diagnosedIssue || "", s.kemeworkCategorySlug || "",
      s.urgencyLevel || "", s.status,
      (s.requiredMaterials || []).length,
      s.userId ? "Registered" : "Guest",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "snap_fix_sessions.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📋 Sessions Log</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} sessions matching filters</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs">
            {["All", "Completed", "Converted", "Failed", "Dismissed"].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Urgency</label>
          <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs">
            {["All", "Emergency", "High", "Medium", "Low"].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs">
            {CATEGORIES.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">User Type</label>
          <select value={filterUserType} onChange={e => setFilterUserType(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs">
            {["All", "Registered", "Guest"].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs" />
        </div>
        <button onClick={handleExportCSV} className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Image", "Diagnosed Issue", "Category", "Urgency", "Materials", "Status", "User", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No sessions found</td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {s.originalImageUrl ? (
                      <img src={s.originalImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover cursor-pointer" onClick={() => setSelected(s)} />
                    ) : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-lg">📷</div>}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="font-semibold text-gray-800 line-clamp-2">{s.diagnosedIssue || "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.kemeworkCategorySlug?.replace(/-/g, " ") || "—"}</td>
                  <td className="px-4 py-3">
                    {s.urgencyLevel && (
                      <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${URGENCY_BADGE[s.urgencyLevel]}`}>{s.urgencyLevel}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{(s.requiredMaterials || []).length}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold capitalize ${STATUS_BADGE[s.status] || "bg-gray-100 text-gray-600"}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.userId ? "👤 Registered" : "👻 Guest"}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(s.created_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(s)} className="flex items-center gap-1 px-2 py-1 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-bold">
                        <Eye size={12} /> View
                      </button>
                      {s.resultingTaskId && (
                        <a href={`/kemework/task/${s.resultingTaskId}`} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-1 border border-teal-200 text-teal-600 rounded-lg hover:bg-teal-50 font-bold">
                          <ExternalLink size={12} /> Task
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <SessionDetailModal session={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}