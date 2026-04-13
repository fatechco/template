import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const TABS = ["All", "Stalled", "Legal Review", "Escrow Active", "Completed"];

const STATUS_CONFIG = {
  both_interested: { label: "🔄 Opening Room", color: "bg-purple-100 text-purple-700" },
  negotiating: { label: "💬 Negotiating", color: "bg-orange-100 text-orange-700" },
  terms_agreed: { label: "✅ Terms Agreed", color: "bg-green-100 text-green-700" },
  legal_review: { label: "⚖️ Legal Review", color: "bg-blue-100 text-blue-700" },
  escrow_active: { label: "🔒 Escrow Active", color: "bg-purple-100 text-purple-700" },
  completed: { label: "✅ Completed", color: "bg-emerald-100 text-emerald-700" },
};

const MOCK_REPS = [
  { id: "rep1", name: "Sara Ahmed" },
  { id: "rep2", name: "Mohamed Karim" },
  { id: "rep3", name: "Nour Hassan" },
];

function NegCard({ match, onAssignRep }) {
  const [assigning, setAssigning] = useState(false);
  const [repDropdown, setRepDropdown] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const statusInfo = STATUS_CONFIG[match.status] || { label: match.status, color: "bg-gray-100 text-gray-500" };

  const daysAgo = match.negotiationStartedAt
    ? Math.floor((Date.now() - new Date(match.negotiationStartedAt)) / 86400000)
    : null;
  const isStalled = daysAgo !== null && daysAgo >= 7 && match.status === "negotiating";

  const handleAssign = async (rep) => {
    setAssigning(true);
    setRepDropdown(false);
    await base44.entities.SwapMatch.update(match.id, { assignedSalesRepId: rep.id, salesRepAssignedAt: new Date().toISOString() });
    onAssignRep(match.id, rep);
    setAssigning(false);
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${isStalled ? "border-orange-200" : "border-gray-100"}`}>
      {/* Property thumbnails */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-12 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🏠</div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Property A</p>
            <p className="text-xs font-bold text-gray-800 truncate">#{match.propertyAId?.slice(0,10)}</p>
          </div>
        </div>
        <span className="text-gray-400 font-bold text-sm flex-shrink-0">⇄</span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-12 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🏠</div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Property B</p>
            <p className="text-xs font-bold text-gray-800 truncate">#{match.propertyBId?.slice(0,10)}</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${statusInfo.color}`}>{statusInfo.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Gap:</span>
          <span className="font-bold text-gray-800">{match.agreedGapEGP ? `${Number(match.agreedGapEGP).toLocaleString()} EGP` : "Pending"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last activity:</span>
          <span className={`font-bold ${isStalled ? "text-orange-600" : "text-gray-800"}`}>{daysAgo !== null ? `${daysAgo}d ago` : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Escrow:</span>
          <span className="font-bold text-gray-800">{match.xeedWalletEscrowReference ? "Active" : match.status === "completed" ? "Completed" : "Not started"}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="text-gray-400">Kemework task:</span>
          <span className="font-bold text-gray-800">{match.kemeworkLegalTaskId ? <a href="/kemework/tasks" className="text-[#7C3AED] hover:underline">{match.kemeworkLegalTaskId.slice(0,12)}</a> : "Not assigned"}</span>
        </div>
        {match.assignedSalesRepId && (
          <div className="flex justify-between col-span-2">
            <span className="text-gray-400">Sales rep:</span>
            <span className="font-bold text-gray-800">{MOCK_REPS.find(r => r.id === match.assignedSalesRepId)?.name || match.assignedSalesRepId}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setRepDropdown(!repDropdown)}
            disabled={assigning}
            className="text-xs font-bold text-white bg-[#7C3AED] hover:bg-purple-700 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {assigning ? "Assigning…" : "📞 Assign Sales Rep"}
          </button>
          {repDropdown && (
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px]">
              {MOCK_REPS.map(rep => (
                <button key={rep.id} onClick={() => handleAssign(rep)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-[#7C3AED] font-medium transition-colors">
                  {rep.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link to={`/dashboard/swap/negotiation/${match.id}`}
          className="text-xs font-bold text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          👁️ Enter Room
        </Link>
        <button
          onClick={() => setFlagging(!flagging)}
          className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors ${flagging ? "bg-red-100 text-red-700 border border-red-200" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
        >
          ⚠️ Flag Issue
        </button>
      </div>
    </div>
  );
}

export default function SwapNegotiations() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.SwapMatch.filter(
          { status: ["both_interested","negotiating","terms_agreed","legal_review","escrow_active","completed"] },
          "-created_date", 100
        );
        setMatches(data || []);
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleAssignRep = (matchId, rep) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, assignedSalesRepId: rep.id } : m));
  };

  const isStalled = (m) => {
    if (m.status !== "negotiating" || !m.negotiationStartedAt) return false;
    return (Date.now() - new Date(m.negotiationStartedAt)) > 7 * 86400000;
  };

  const filtered = matches.filter(m => {
    if (activeTab === "All") return true;
    if (activeTab === "Stalled") return isStalled(m);
    if (activeTab === "Legal Review") return m.status === "legal_review";
    if (activeTab === "Escrow Active") return m.status === "escrow_active";
    if (activeTab === "Completed") return m.status === "completed";
    return true;
  });

  const stalledCount = matches.filter(isStalled).length;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Active Negotiations</h1>
        <p className="text-sm text-gray-500">{matches.length} total negotiation rooms</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all ${activeTab === tab ? "border-[#7C3AED] text-[#7C3AED]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
            {tab === "Stalled" && stalledCount > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{stalledCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No negotiations found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(m => (
            <NegCard key={m.id} match={m} onAssignRep={handleAssignRep} />
          ))}
        </div>
      )}
    </div>
  );
}