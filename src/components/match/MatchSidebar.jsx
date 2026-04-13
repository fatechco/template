import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function MatchSidebar({ userId, matchCount = 0 }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("matches");
  const [swipes, setSwipes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    Promise.all([
      base44.entities.PropertySwipe.filter({ userId }, '-created_date', 20),
      base44.entities.PropertyMatch.filter({ buyerId: userId }, '-created_date', 10)
    ]).then(([sw, ma]) => {
      setSwipes(sw);
      setMatches(ma);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [userId]);

  const likes = swipes.filter(s => s.action === "like");
  const superLikes = swipes.filter(s => s.action === "super_like");

  function daysLeft(expiresAt) {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt) - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  const tabs = [
    { id: "likes", label: "❤️", count: likes.length, title: "Likes" },
    { id: "super", label: "⭐", count: superLikes.length, title: "Super" },
    { id: "matches", label: "🎉", count: matches.length, title: "Matches" },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h3 className="text-white font-black text-sm">My Activity</h3>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-white/10 flex-shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-2.5 text-xs font-bold transition-colors flex flex-col items-center gap-0.5 ${tab === t.id ? "text-orange-400 bg-white/10" : "text-white/40 hover:text-white/70"}`}>
            <span>{t.label}</span>
            <span className={`text-[10px] ${tab === t.id ? "text-orange-300" : "text-white/30"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <p className="text-white/30 text-xs text-center py-6">Loading...</p>
        ) : (
          <>
            {tab === "matches" && (
              matches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="text-white/40 text-xs">Matches appear here</p>
                  <p className="text-white/25 text-[10px] mt-1">Like properties to start</p>
                </div>
              ) : matches.map(match => {
                const days = daysLeft(match.expiresAt);
                return (
                  <div key={match.id} className="bg-white/10 border border-orange-500/30 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 bg-orange-500/30 rounded-lg flex items-center justify-center text-lg">🏠</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">Matched Property</p>
                        <p className="text-white/40 text-[10px]">{match.matchScore}% match</p>
                      </div>
                      <span className="text-orange-400 text-[10px] font-black bg-orange-500/20 px-1.5 py-0.5 rounded-full">New!</span>
                    </div>
                    {days !== null && (
                      <p className={`text-[10px] mb-2 ${days < 2 ? "text-red-400 font-bold" : "text-white/30"}`}>
                        ⏰ {days > 0 ? `${days}d left` : "Expires today"}
                      </p>
                    )}
                    <button
                      onClick={() => navigate(`/kemedar/negotiate/${match.id}`)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 rounded-lg text-xs transition-colors"
                    >
                      💬 Negotiate
                    </button>
                  </div>
                );
              })
            )}

            {(tab === "likes" || tab === "super") && (
              (tab === "likes" ? likes : superLikes).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">{tab === "likes" ? "❤️" : "⭐"}</p>
                  <p className="text-white/40 text-xs">No {tab === "likes" ? "likes" : "super likes"} yet</p>
                </div>
              ) : (tab === "likes" ? likes : superLikes).map(swipe => (
                <div key={swipe.id} className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🏠</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-[11px] font-bold truncate">Liked property</p>
                    <p className="text-white/30 text-[9px]">Waiting for seller</p>
                  </div>
                  {tab === "super" && <span className="text-yellow-400">⭐</span>}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* View all link */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <button onClick={() => navigate("/kemedar/match/history")}
          className="w-full text-center text-white/40 hover:text-white/70 text-xs transition-colors py-1">
          View full history →
        </button>
      </div>
    </div>
  );
}