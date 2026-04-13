import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SwapMatchCard from "@/components/swap/SwapMatchCard";
import SwapNegotiationCard from "@/components/swap/SwapNegotiationCard";
import SwapMatchAnimation from "@/components/swap/SwapMatchAnimation";

const TABS = [
  { key: "matches", label: "🔄 New Matches" },
  { key: "negotiations", label: "💬 Negotiations" },
  { key: "completed", label: "✅ Completed" },
  { key: "passed", label: "👁️ Passed" },
];

const SORT_OPTIONS = ["Best Match", "Newest", "Gap Size"];

export default function SwapHub() {
  const [user, setUser] = useState(null);
  const [intent, setIntent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [passed, setPassed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("matches");
  const [sort, setSort] = useState("Best Match");
  const [matchAnimation, setMatchAnimation] = useState(null); // SwapMatch record for animation

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.find(t => t.key === tabParam)) setTab(tabParam);
  }, [location.search]);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load active intent
      const intents = await base44.entities.SwapIntent.filter({ userId: user.id, status: "active" }, "-created_date", 1);
      const activeIntent = intents[0] || null;
      setIntent(activeIntent);

      if (!activeIntent) { setLoading(false); return; }

      // Load all matches for this user
      const [asA, asB] = await Promise.all([
        base44.entities.SwapMatch.filter({ userAId: user.id }, "-created_date", 50),
        base44.entities.SwapMatch.filter({ userBId: user.id }, "-created_date", 50),
      ]);
      const allMatches = [...(asA || []), ...(asB || [])];

      setMatches(allMatches.filter(m => m.status === "suggested" || m.status === "a_seen" || m.status === "b_seen" || m.status === "a_interested" || m.status === "b_interested"));
      setNegotiations(allMatches.filter(m => ["both_interested", "negotiating", "terms_agreed", "legal_review", "escrow_active"].includes(m.status)));
      setCompleted(allMatches.filter(m => m.status === "completed"));
      setPassed(allMatches.filter(m => m.status === "rejected" || m.status === "expired"));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleInterestSent = (matchId) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, _interestSent: true } : m));
  };

  const handleBothInterested = (match) => {
    setMatchAnimation(match);
    // Move to negotiations
    setMatches(prev => prev.filter(m => m.id !== match.id));
    setNegotiations(prev => [{ ...match, status: "both_interested" }, ...prev]);
  };

  const handlePassed = (matchId) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sort === "Best Match") return (b.matchScore || 0) - (a.matchScore || 0);
    if (sort === "Newest") return new Date(b.created_date) - new Date(a.created_date);
    if (sort === "Gap Size") return (a.valuationGapEGP || 0) - (b.valuationGapEGP || 0);
    return 0;
  });

  const tabCounts = {
    matches: matches.length,
    negotiations: negotiations.length,
    completed: completed.length,
    passed: passed.length,
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0A1628 0%, #2D1B69 100%)",
        minHeight: 200,
        padding: "40px",
      }}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-5">
            <span className="text-5xl" style={{ animation: "spin 8s linear infinite", display: "inline-block" }}>🔄</span>
            <div>
              <h1 className="text-white font-black text-3xl leading-tight">Kemedar Swap™</h1>
              <p className="text-gray-300 text-sm mt-1.5 max-w-md leading-relaxed">
                Trade your property directly with another verified owner.<br />AI finds your perfect match.
              </p>
            </div>
          </div>

          {/* Right: intent summary card */}
          <div className="bg-white rounded-2xl p-5 min-w-[280px] max-w-sm shadow-xl">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
              </div>
            ) : intent ? (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Swap Intent</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏠</div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">Property #{intent.offeredPropertyId?.slice(0,8)}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-0.5">
                      🟢 Active in Pool
                    </span>
                  </div>
                </div>
                <p className="text-purple-700 font-bold text-sm mb-3">
                  {matches.length} potential match{matches.length !== 1 ? "es" : ""} found
                </p>
                <Link to="/dashboard/swap/intent"
                  className="block text-center border-2 border-[#7C3AED] text-[#7C3AED] font-bold text-xs py-2 rounded-xl hover:bg-purple-50 transition-colors">
                  Edit My Intent →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm mb-4">You haven't listed a property for swap yet.</p>
                <Link to="/kemedar/add/property"
                  className="block text-center bg-[#7C3AED] text-white font-bold text-sm py-2.5 rounded-xl hover:bg-purple-700 transition-colors">
                  + List a Property for Swap →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                tab === t.key
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
              {tabCounts[t.key] > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  tab === t.key ? "bg-[#7C3AED] text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {tabCounts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* TAB: New Matches */}
        {tab === "matches" && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
                ))}
              </div>
            ) : sortedMatches.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-7xl mb-4">🏠↔️🏠</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">No matches yet — but we're looking!</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  We scan the pool daily. You'll be notified the moment we find a compatible swap.
                </p>
                <Link to="/dashboard/swap/intent"
                  className="inline-flex items-center gap-2 border-2 border-[#7C3AED] text-[#7C3AED] font-bold px-6 py-2.5 rounded-xl hover:bg-purple-50 transition-colors">
                  Edit My Swap Criteria →
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <p className="font-bold text-gray-900 text-base">{sortedMatches.length} swap suggestion{sortedMatches.length !== 1 ? "s" : ""} found</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Sort by:</span>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#7C3AED]"
                    >
                      {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-5">
                  {sortedMatches.map(match => (
                    <SwapMatchCard
                      key={match.id}
                      match={match}
                      userId={user.id}
                      onInterestSent={handleInterestSent}
                      onBothInterested={handleBothInterested}
                      onPassed={handlePassed}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Negotiations */}
        {tab === "negotiations" && (
          <div>
            {negotiations.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-black text-gray-800 mb-2">No active negotiations</h3>
                <p className="text-gray-500 text-sm">When you and a match both express interest, a negotiation room opens here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {negotiations.map(match => (
                  <SwapNegotiationCard key={match.id} match={match} userId={user.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Completed */}
        {tab === "completed" && (
          <div>
            {completed.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-black text-gray-800 mb-2">No completed swaps yet</h3>
                <p className="text-gray-500 text-sm">Completed swap deals will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completed.map(match => (
                  <SwapNegotiationCard key={match.id} match={match} userId={user.id} readOnly />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Passed */}
        {tab === "passed" && (
          <div>
            {passed.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👁️</div>
                <h3 className="text-lg font-black text-gray-800 mb-2">No passed matches</h3>
                <p className="text-gray-500 text-sm">Matches you declined will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {passed.map(match => (
                  <SwapNegotiationCard key={match.id} match={match} userId={user.id} readOnly />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Animation Overlay */}
      {matchAnimation && (
        <SwapMatchAnimation
          match={matchAnimation}
          userId={user?.id}
          onClose={() => setMatchAnimation(null)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}