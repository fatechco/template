import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function MatchHistoryMobile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [swipes, setSwipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = await base44.auth.me();
        const [ma, sw] = await Promise.all([
          base44.entities.PropertyMatch.filter({ buyerId: user.id }),
          base44.entities.PropertySwipe.filter({ userId: user.id })
        ]);
        setMatches(ma);
        setSwipes(sw);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const likes = swipes.filter(s => s.action === "like");
  const passes = swipes.filter(s => s.action === "pass");
  const superLikes = swipes.filter(s => s.action === "super_like");

  const tabs = [
    { id: "matches", label: `🎉 Matches (${matches.length})` },
    { id: "liked", label: `❤️ Liked (${likes.length})` },
    { id: "superliked", label: `⭐ Super (${superLikes.length})` },
    { id: "passed", label: `✗ Passed (${passes.length})` },
  ];

  const daysLeft = (expiresAt) => {
    if (!expiresAt) return null;
    return Math.max(0, Math.ceil((new Date(expiresAt) - Date.now()) / 86400000));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <h1 className="text-xl font-black text-white">💘 Match History</h1>
        <p className="text-white/40 text-xs mt-0.5">{matches.length} matches · {likes.length} liked</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar px-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-3 text-[11px] font-bold border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${tab === t.id ? "border-orange-500 text-orange-400" : "border-transparent text-white/40"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <div className="text-center py-12 text-white/30">Loading...</div>
        ) : (
          <>
            {tab === "matches" && (
              matches.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">🎉</p>
                  <p className="font-bold text-white text-lg">No matches yet</p>
                  <p className="text-white/40 mb-6 text-sm">Start swiping to find your match!</p>
                  <Link to="/m/kemedar/match" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl inline-block">💘 Start Swiping</Link>
                </div>
              ) : matches.map(match => {
                const days = daysLeft(match.expiresAt);
                return (
                  <div key={match.id} className="bg-white/10 rounded-2xl border border-white/10 p-4 mb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-2xl">🏠</div>
                      <span className="text-orange-400">❤️</span>
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">Match #{match.id?.slice(-6)}</p>
                        <p className="text-xs text-white/40">Score: {match.matchScore}%</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                        match.status === "matched" ? "bg-orange-500/20 text-orange-400" :
                        match.status === "deal_closed" ? "bg-green-500/20 text-green-400" :
                        "bg-white/10 text-white/40"
                      }`}>{match.status?.replace("_", " ").toUpperCase()}</span>
                    </div>
                    {days !== null && (
                      <p className={`text-xs mb-3 ${days < 2 ? "text-red-400 font-bold" : "text-white/30"}`}>
                        ⏰ {days > 0 ? `Expires in ${days} day${days !== 1 ? "s" : ""}` : "Expires today"}
                      </p>
                    )}
                    <Link to={`/kemedar/negotiate/${match.id}`}
                      className="block w-full text-center bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm">
                      💬 Open Negotiate™
                    </Link>
                  </div>
                );
              })
            )}

            {(tab === "liked" || tab === "superliked") && (
              (tab === "liked" ? likes : superLikes).length === 0 ? (
                <div className="text-center py-16 text-white/30">
                  <p className="text-4xl mb-2">{tab === "liked" ? "❤️" : "⭐"}</p>
                  <p>Nothing here yet</p>
                </div>
              ) : (tab === "liked" ? likes : superLikes).map(swipe => (
                <div key={swipe.id} className="bg-white/10 rounded-xl border border-white/10 p-4 flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl">🏠</div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">Property {swipe.propertyId?.slice(-6)}</p>
                    <p className="text-xs text-white/30">⏳ Waiting for seller · {new Date(swipe.swipedAt || swipe.created_date).toLocaleDateString()}</p>
                  </div>
                  {tab === "superliked" && <span className="text-yellow-400 text-lg">⭐</span>}
                </div>
              ))
            )}

            {tab === "passed" && (
              passes.length === 0 ? (
                <div className="text-center py-16 text-white/30"><p className="text-4xl mb-2">✗</p><p>No passes yet</p></div>
              ) : passes.map(swipe => (
                <div key={swipe.id} className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center gap-3 mb-3 opacity-60">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">🏠</div>
                  <div className="flex-1">
                    <p className="font-semibold text-white/60 text-sm">Passed property</p>
                    <p className="text-xs text-white/30">{new Date(swipe.swipedAt || swipe.created_date).toLocaleDateString()}</p>
                  </div>
                  <button className="border border-white/20 text-white/50 text-xs font-bold px-3 py-1.5 rounded-lg">↩</button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Back to swiping */}
      <div className="fixed bottom-20 left-4 right-4">
        <Link to="/m/kemedar/match"
          className="block w-full text-center bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black py-3.5 rounded-2xl shadow-lg">
          💘 Back to Swiping
        </Link>
      </div>
    </div>
  );
}