import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const FOLLOW_UP_OPTIONS = [
  { value: "not_reviewed", label: "Not reviewed", className: "bg-red-50 text-red-600" },
  { value: "reviewed", label: "Reviewed", className: "bg-green-50 text-green-700" },
  { value: "contacted_user", label: "Contacted user", className: "bg-blue-50 text-blue-700" },
  { value: "no_action_needed", label: "No action needed", className: "bg-gray-100 text-gray-500" },
];

function getFollowUpStyle(val) {
  return FOLLOW_UP_OPTIONS.find(o => o.value === val) || FOLLOW_UP_OPTIONS[0];
}

export default function SnapFixSafetyLog() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [followUpMap, setFollowUpMap] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    base44.entities.SnapSession.filter({ urgencyLevel: "emergency" }, "-created_date", 200)
      .then(emergency => {
        base44.entities.SnapSession.filter({ urgencyLevel: "high" }, "-created_date", 200)
          .then(high => {
            const all = [...emergency, ...high].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
            setSessions(all);
          });
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = sessions.filter(s => {
    if (filter === "Emergency" && s.urgencyLevel !== "emergency") return false;
    if (filter === "High" && s.urgencyLevel !== "high") return false;
    if (dateFrom && new Date(s.created_date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(s.created_date) > new Date(dateTo + "T23:59:59")) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.diagnosedIssue?.toLowerCase().includes(q) && !s.locationText?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markAllReviewed = () => {
    const next = { ...followUpMap };
    selected.forEach(id => { next[id] = "reviewed"; });
    setFollowUpMap(next);
    setSelected(new Set());
  };

  const setFollowUp = (id, val) => {
    setSaving(id);
    setFollowUpMap(prev => ({ ...prev, [id]: val }));
    setTimeout(() => setSaving(null), 800);
  };

  const emergencyCount = sessions.filter(s => s.urgencyLevel === "emergency").length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">🚨 Emergency & High Urgency Diagnoses</h1>
        <p className="text-sm text-gray-500 mt-1">All cases where AI flagged immediate safety risk. Monitor these for user wellbeing.</p>
      </div>

      {/* Banner */}
      {emergencyCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <span className="text-3xl">🚨</span>
          <div>
            <p className="font-black text-red-700">{emergencyCount} Emergency diagnosis{emergencyCount > 1 ? "es" : ""} requiring review</p>
            <p className="text-sm text-red-500">These users received an immediate safety alert. Please review and follow up.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Urgency</label>
          <div className="flex gap-1">
            {["All", "Emergency", "High"].map(v => (
              <button key={v} onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === v ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-xs" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold text-gray-500 block mb-1">Search</label>
          <input type="text" placeholder="Search by issue or location…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" />
        </div>
        {selected.size > 0 && (
          <button onClick={markAllReviewed}
            className="px-4 py-2 bg-green-600 text-white font-bold text-xs rounded-lg hover:bg-green-700 transition-colors">
            ✅ Mark {selected.size} as Reviewed
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-8 px-4 py-3">
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(s => s.id)) : new Set())}
                    checked={selected.size === filtered.length && filtered.length > 0} className="rounded" />
                </th>
                {["Date", "Diagnosed Issue", "Safety Warning", "User", "City", "Urgency", "Follow-Up", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={9} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No safety cases found 🎉</td></tr>
              ) : filtered.map(s => {
                const followUp = followUpMap[s.id] || "not_reviewed";
                const style = getFollowUpStyle(followUp);
                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${s.urgencyLevel === "emergency" ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(s.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <p className="font-semibold text-gray-800 line-clamp-2">{s.diagnosedIssue || "—"}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      {s.safetyWarning ? (
                        <p className="text-red-600 text-xs line-clamp-2">{s.safetyWarning}</p>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{s.userId ? "👤 Registered" : "👻 Guest"}</td>
                    <td className="px-4 py-3 text-gray-500">{s.locationText || s.cityId || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold capitalize text-xs ${s.urgencyLevel === "emergency" ? "bg-red-600 text-white" : "bg-red-100 text-red-600"}`}>
                        {s.urgencyLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={followUp} onChange={e => setFollowUp(s.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer ${style.className}`}>
                        {FOLLOW_UP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      {saving === s.id && <span className="text-xs text-green-600 ml-1">✓</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={`/admin/kemework/snap-fix/sessions`}
                          className="px-2 py-1 border border-gray-200 text-gray-700 rounded-lg font-bold text-xs hover:bg-gray-50">
                          View
                        </a>
                        <button onClick={() => setFollowUp(s.id, "reviewed")}
                          className="px-2 py-1 border border-green-200 text-green-700 rounded-lg font-bold text-xs hover:bg-green-50">
                          ✅ Reviewed
                        </button>
                        {s.userId && (
                          <button onClick={() => setFollowUp(s.id, "contacted_user")}
                            className="px-2 py-1 border border-blue-200 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-50">
                            📧 Contact
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}