import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  waitlisted: "bg-purple-100 text-purple-700",
};

const COMPANY_LABELS = {
  agency: "RE Agency", developer: "Developer", bank: "Bank",
  mortgage: "Mortgage Co.", investment_fund: "Investment Fund",
  proptech: "PropTech", government: "Government", other: "Other"
};

export default function AdminThinkDar() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    base44.entities.ThinkDarAPIRequest.list("-created_date", 200)
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    const updateData = { status };
    // Auto-generate API key on approval if not already issued
    if (status === 'approved') {
      const existing = requests.find(r => r.id === id);
      if (!existing?.apiKeyIssued) {
        updateData.apiKeyIssued = `TDK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      }
    }
    await base44.entities.ThinkDarAPIRequest.update(id, updateData);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updateData } : r));
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...updateData }));
  };

  const total = requests.length;
  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;

  const filtered = statusFilter === "all" ? requests : requests.filter(r => r.status === statusFilter);

  const KPI = ({ label, value, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl" style={{ background: "#1E1B4B" }}>🧠</div>
        <div>
          <h1 className="font-black text-gray-900 text-xl">ThinkDar™ API Requests</h1>
          <p className="text-gray-500 text-sm">Manage enterprise API access requests</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI label="Total Requests" value={total} color="#6366F1" />
        <KPI label="Pending Review" value={pending} color="#F59E0B" />
        <KPI label="Approved (Active)" value={approved} color="#10B981" />
        <KPI label="API Calls This Month" value="—" color="#06B6D4" />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "reviewing", "approved", "rejected", "waitlisted"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusFilter === s ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            style={statusFilter === s ? { background: "#6366F1" } : {}}>
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading requests...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No requests yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Company", "Type", "Country", "APIs", "Volume", "Status", "Date", "Actions"].map(h => (
                      <th key={h} className="text-left text-[10px] font-black text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 text-xs">{req.companyName}</p>
                        <p className="text-gray-400 text-[10px]">{req.contactName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {COMPANY_LABELS[req.companyType] || req.companyType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{req.country || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{req.apisRequested?.length || 0} APIs</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{req.expectedMonthlyCalls || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-600"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-gray-400">{new Date(req.created_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(req)} className="px-2 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">View</button>
                          {req.status === "pending" && <>
                            <button onClick={() => updateStatus(req.id, "approved")} className="px-2 py-1 text-[10px] font-bold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">Approve</button>
                            <button onClick={() => updateStatus(req.id, "rejected")} className="px-2 py-1 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Reject</button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-sm">Request Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-lg">×</button>
            </div>
            <div className="space-y-3 text-xs">
              <div><p className="text-gray-400 font-medium">Company</p><p className="font-bold text-gray-900">{selected.companyName}</p></div>
              <div><p className="text-gray-400 font-medium">Contact</p><p className="font-bold text-gray-900">{selected.contactName}</p></div>
              <div><p className="text-gray-400 font-medium">Email</p><p className="font-bold text-indigo-600">{selected.workEmail}</p></div>
              <div><p className="text-gray-400 font-medium">Phone</p><p className="font-bold text-gray-900">{selected.phone || "—"}</p></div>
              <div><p className="text-gray-400 font-medium">Type</p><p className="font-bold text-gray-900">{COMPANY_LABELS[selected.companyType]}</p></div>
              <div><p className="text-gray-400 font-medium">Country</p><p className="font-bold text-gray-900">{selected.country || "—"}</p></div>
              <div><p className="text-gray-400 font-medium">APIs Requested</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(selected.apisRequested || []).map(a => (
                    <span key={a} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold text-[10px]">{a}</span>
                  ))}
                </div>
              </div>
              <div><p className="text-gray-400 font-medium">Volume</p><p className="font-bold text-gray-900">{selected.expectedMonthlyCalls || "—"}</p></div>
              <div><p className="text-gray-400 font-medium">Use Case</p><p className="text-gray-700 leading-relaxed">{selected.useCase || "—"}</p></div>
              <div><p className="text-gray-400 font-medium">Status</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
              </div>
              {selected.apiKeyIssued && (
                <div>
                  <p className="text-gray-400 font-medium">API Key Issued</p>
                  <p className="font-mono font-bold text-green-700 text-[11px] bg-green-50 px-2 py-1 rounded-lg mt-1 break-all">{selected.apiKeyIssued}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {selected.status !== "approved" && <button onClick={() => updateStatus(selected.id, "approved")} className="w-full py-2 rounded-xl text-xs font-black text-white" style={{ background: "#10B981" }}>✅ Approve + Issue Key</button>}
              {selected.status !== "reviewing" && <button onClick={() => updateStatus(selected.id, "reviewing")} className="w-full py-2 rounded-xl text-xs font-black text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors">🔍 Mark Reviewing</button>}
              {selected.status !== "rejected" && <button onClick={() => updateStatus(selected.id, "rejected")} className="w-full py-2 rounded-xl text-xs font-black text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors">❌ Reject</button>}
              {selected.status !== "waitlisted" && <button onClick={() => updateStatus(selected.id, "waitlisted")} className="w-full py-2 rounded-xl text-xs font-black text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors">⏳ Waitlist</button>}
              <a href={`mailto:${selected.workEmail}`} className="w-full py-2 rounded-xl text-xs font-black text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-center">✉️ Contact</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}