import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function MatchHistory() {
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
      } catch (err) {}
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
    { id: "passed", label: `✗ Passed (${passes.length})` },
    { id: "superliked", label: `⭐ Super Liked (${superLikes.length})` },
  ];

  const daysLeft = (expiresAt) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt) - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-black text-gray-900">Match History</h1>
        </div>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <>
            {tab === "matches" && (
              matches.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="font-bold text-gray-700 text-lg">No matches yet</p>
                  <p className="text-gray-500 mb-6">Start swiping to find your match!</p>
                  <Link to="/kemedar/match" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
                    💘 Start Swiping
                  </Link>
                </div>
              ) : matches.map(match => {
                const days = daysLeft(match.expiresAt);
                return (
                  <div key={match.id} className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl">🏠</div>
                      <span className="text-orange-500">❤️</span>
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">👤</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">Match #{match.id?.slice(-6)}</p>
                        <p className="text-xs text-gray-400">Score: {match.matchScore}%</p>
                      </div>
                      <div>
                        <span className={`text-xs font-black px-2 py-1 rounded-full ${
                          match.status === "matched" ? "bg-orange-100 text-orange-700" :
                          match.status === "negotiation_started" ? "bg-blue-100 text-blue-700" :
                          match.status === "deal_closed" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>{match.status?.replace("_", " ").toUpperCase()}</span>
                      </div>
                    </div>
                    {days !== null && (
                      <p className={`text-xs mb-3 ${days < 2 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                        ⏰ {days > 0 ? `Expires in ${days} day${days !== 1 ? "s" : ""}` : "Expires today"}
                      </p>
                    )}
                    <Link to={`/kemedar/negotiate/${match.id}`} className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                      💬 Open Negotiate™
                    </Link>
                  </div>
                );
              })
            )}

            {(tab === "liked" || tab === "superliked") && (
              (tab === "liked" ? likes : superLikes).length === 0 ? (
                <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">{tab === "liked" ? "❤️" : "⭐"}</p><p>Nothing here yet</p></div>
              ) : (tab === "liked" ? likes : superLikes).map(swipe => (
                <div key={swipe.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 mb-3 shadow-sm">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">🏠</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">Property {swipe.propertyId?.slice(-6)}</p>
                    <p className="text-xs text-gray-400">⏳ Waiting for seller · {new Date(swipe.swipedAt || swipe.created_date).toLocaleDateString()}</p>
                  </div>
                  {tab === "superliked" && <span className="text-yellow-500 text-xl">⭐</span>}
                </div>
              ))
            )}

            {tab === "passed" && (
              passes.length === 0 ? (
                <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">✗</p><p>No passes yet</p></div>
              ) : passes.map(swipe => (
                <div key={swipe.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 mb-3 shadow-sm opacity-70">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">🏠</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-600 text-sm">Passed property</p>
                    <p className="text-xs text-gray-400">{new Date(swipe.swipedAt || swipe.created_date).toLocaleDateString()}</p>
                  </div>
                  <button className="border border-gray-200 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50">↩ Reconsider</button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}