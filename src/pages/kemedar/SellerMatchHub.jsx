import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Mock pending likes to demo the UI (enriched with extra fields)
const MOCK_LIKES = [
  { id: "l1", buyerLabel: "Verified Buyer #1", memberSince: "2023", likedAt: "2 hours ago", budget: "2M – 3M EGP", propertyName: "Luxury Apartment New Cairo", isSuperLike: false, buyerId: "buyer1", propertyId: "m1" },
  { id: "l2", buyerLabel: "Verified Buyer #2", memberSince: "2022", likedAt: "5 hours ago", budget: "1.5M – 2.5M EGP", propertyName: "Luxury Apartment New Cairo", isSuperLike: true, buyerId: "buyer2", propertyId: "m1" },
  { id: "l3", buyerLabel: "Verified Buyer #3", memberSince: "2024", likedAt: "1 day ago", budget: "1M – 2M EGP", propertyName: "Modern Villa Sheikh Zayed", isSuperLike: false, buyerId: "buyer3", propertyId: "m2" },
];

function LikeCard({ like, onLikeBack, onPass, liking }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 border transition-all ${like.isSuperLike ? "border-yellow-300 bg-yellow-50/30" : "border-gray-100"}`}>
      {/* Blurred avatar — revealed after match */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl flex-shrink-0 select-none" style={{ filter: "blur(4px)" }}>
        👤
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <p className="font-bold text-gray-900 text-sm">{like.buyerLabel}</p>
          {like.isSuperLike && <span className="text-yellow-600 text-xs font-black bg-yellow-100 px-1.5 py-0.5 rounded-full">⭐ Super Like!</span>}
        </div>
        <p className="text-xs text-gray-400">Member since {like.memberSince} • {like.likedAt}</p>
        {like.budget && <p className="text-xs text-gray-500 mt-0.5">💰 Budget: ~{like.budget}</p>}
        <p className="text-xs text-gray-400 truncate">🏠 {like.propertyName}</p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => onLikeBack(like)}
          disabled={liking === like.id}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
        >
          {liking === like.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "❤️"}
          Like Back
        </button>
        <button
          onClick={() => onPass(like.id)}
          className="border border-gray-200 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Pass
        </button>
      </div>
    </div>
  );
}

function InsightsTab() {
  const [insights, setInsights] = useState(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    // Try to get insights for seller's first property
    const result = await base44.functions.invoke("generateMatchInsights", { propertyId: "mock" }).catch(() => null);
    if (result?.data?.insight) setInsights(result.data.insight);
    setGenerating(false);
  };

  const data = insights || {
    totalSwipes: 312, totalLikes: 52, totalSuperLikes: 8, likeRate: 17, avgViewDuration: 14,
    aiTopStrengths: ["Premium location in high-demand area", "Competitive price vs market", "3+ bedrooms appeals to families"],
    aiTopWeaknesses: ["No virtual tour available", "Limited parking information", "Older photos"],
    aiPriceAssessment: "Price is well-positioned at ~8% below comparable listings. Average 14s view time suggests buyers engage meaningfully.",
    aiRecommendations: [
      { action: "Add a virtual tour", impact: "+35% likes" },
      { action: "Refresh photos with professional shots", impact: "+20% likes" },
      { action: "Highlight parking availability", impact: "+8% likes" }
    ]
  };

  const likeRateConfig = data.likeRate >= 15 ? { label: "🔥 High Interest", color: "text-green-600", bg: "bg-green-50" }
    : data.likeRate >= 10 ? { label: "👍 Good Interest", color: "text-blue-600", bg: "bg-blue-50" }
    : data.likeRate >= 5 ? { label: "📊 Average", color: "text-yellow-600", bg: "bg-yellow-50" }
    : { label: "📉 Low Interest", color: "text-red-600", bg: "bg-red-50" };

  return (
    <div className="space-y-5">
      {/* Like rate gauge */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`text-5xl font-black ${likeRateConfig.color}`}>{data.likeRate}%</p>
            <p className="text-gray-500 text-sm mt-1">Like Rate</p>
          </div>
          <span className={`${likeRateConfig.bg} ${likeRateConfig.color} font-bold text-sm px-3 py-1.5 rounded-full`}>{likeRateConfig.label}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${Math.min(100, data.likeRate * 3)}%` }} />
        </div>
        <p className="text-xs text-gray-400">Similar properties average: 12%</p>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: "Swipes", value: data.totalSwipes },
            { label: "Likes", value: data.totalLikes },
            { label: "Super ⭐", value: data.totalSuperLikes },
            { label: "Avg View", value: `${data.avgViewDuration}s` }
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="font-black text-gray-900 text-lg">{stat.value}</p>
              <p className="text-[10px] text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">🤖 Kemedar AI Insights</p>
          <button onClick={generate} disabled={generating} className="flex items-center gap-1.5 text-xs text-purple-600 font-bold hover:text-purple-700">
            {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Refresh
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-green-600 mb-2">✅ Why people LIKE your property:</p>
            {data.aiTopStrengths.map((s, i) => (
              <p key={i} className="text-sm text-gray-700 flex items-start gap-2 mb-1.5">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✅</span>{s}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-red-500 mb-2">⚠️ Why people PASS:</p>
            {data.aiTopWeaknesses.map((w, i) => (
              <p key={i} className="text-sm text-gray-700 flex items-start gap-2 mb-1.5">
                <span className="text-yellow-500 mt-0.5 flex-shrink-0">⚠️</span>{w}
              </p>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-1">💰 Price Analysis</p>
            <p className="text-sm text-blue-800">{data.aiPriceAssessment}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2">💡 Actions to increase matches:</p>
            {data.aiRecommendations.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2">
                <span className="text-sm font-semibold text-gray-800">{i + 1}. {r.action}</span>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{r.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerMatchHub() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("likes");
  const [pendingLikes, setPendingLikes] = useState(MOCK_LIKES);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(null); // ID of like being processed

  useEffect(() => {
    const load = async () => {
      try {
        const user = await base44.auth.me();
        // Load matches where this user is seller
        const sellerMatches = await base44.entities.PropertyMatch.filter({ sellerId: user.id });
        setMatches(sellerMatches.filter(m => m.sellerAction)); // confirmed matches

        // Load swipes on seller's properties (likes/super_likes from buyers)
        const props = await base44.entities.Property.filter({ created_by: user.id });
        if (props.length > 0) {
          const propIds = props.map(p => p.id);
          const allSwipes = await base44.entities.PropertySwipe.list('-created_date', 200);
          const relevant = allSwipes.filter(s => propIds.includes(s.propertyId) && (s.action === "like" || s.action === "super_like"));
          // Map to display format
          const mapped = relevant.map((s, i) => ({
            id: s.id,
            swipeId: s.id,
            buyerId: s.userId,
            propertyId: s.propertyId,
            buyerLabel: `Verified Buyer #${i + 1}`,
            memberSince: new Date(s.created_date).getFullYear().toString(),
            likedAt: timeAgo(s.swipedAt || s.created_date),
            propertyName: props.find(p => p.id === s.propertyId)?.title || "Your Property",
            isSuperLike: s.action === "super_like",
            budget: null
          }));
          if (mapped.length > 0) setPendingLikes(mapped);
        }
      } catch (err) {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  function timeAgo(dateStr) {
    if (!dateStr) return "recently";
    const diff = Date.now() - new Date(dateStr);
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const handleLikeBack = async (like) => {
    setLiking(like.id);
    try {
      const user = await base44.auth.me();
      // Create match record (buyer already liked = mutual match)
      const newMatch = await base44.entities.PropertyMatch.create({
        buyerId: like.buyerId,
        sellerId: user.id,
        propertyId: like.propertyId,
        sellerAction: "like_back",
        sellerActionAt: new Date().toISOString(),
        matchType: "mutual_like",
        status: "matched",
        matchScore: Math.floor(75 + Math.random() * 25),
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
      }).catch(() => null);

      setPendingLikes(prev => prev.filter(l => l.id !== like.id));
      if (newMatch) setMatches(prev => [...prev, newMatch]);
      setTab("matches"); // Switch to matches tab to show the new match
    } catch (err) {
      // Handle gracefully
    } finally {
      setLiking(null);
    }
  };

  const handlePass = (likeId) => setPendingLikes(prev => prev.filter(l => l.id !== likeId));

  const superLikes = pendingLikes.filter(l => l.isSuperLike);
  const daysLeft = (expiresAt) => {
    if (!expiresAt) return null;
    return Math.max(0, Math.ceil((new Date(expiresAt) - Date.now()) / 86400000));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">💘 Match Activity</h1>
            <p className="text-gray-500 text-sm">See who's interested in your properties</p>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "New Likes", value: pendingLikes.length, icon: "❤️", color: "bg-red-50 text-red-600" },
            { label: "Super Likes", value: superLikes.length, icon: "⭐", color: "bg-yellow-50 text-yellow-600" },
            { label: "Matches", value: matches.length, icon: "🎉", color: "bg-orange-50 text-orange-600" },
            { label: "Like Rate", value: "17%", icon: "📊", color: "bg-blue-50 text-blue-600" },
          ].map(kpi => (
            <div key={kpi.label} className={`rounded-2xl p-4 ${kpi.color}`}>
              <p className="text-2xl mb-1">{kpi.icon}</p>
              <p className="text-3xl font-black">{kpi.value}</p>
              <p className="text-xs font-semibold opacity-70">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 mb-6">
          {[
            { id: "likes", label: `🔥 New Likes (${pendingLikes.length})` },
            { id: "superlikes", label: `⭐ Super Likes (${superLikes.length})` },
            { id: "matches", label: `🎉 Matches (${matches.length})` },
            { id: "insights", label: "📊 Insights" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "likes" && (
          <div className="space-y-4">
            {pendingLikes.length > 0 && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="font-bold text-teal-800">{pendingLikes.length} {pendingLikes.length === 1 ? "person" : "people"} liked your {pendingLikes.length === 1 ? "property" : "properties"} recently</p>
                <p className="text-sm text-teal-600">Like them back to create a Match and open Negotiate™</p>
              </div>
            )}
            {loading ? (
              <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" /></div>
            ) : pendingLikes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-2">❤️</p>
                <p className="text-gray-500 font-semibold">No new likes yet</p>
                <p className="text-gray-400 text-sm mt-1">When buyers like your properties, they'll appear here</p>
              </div>
            ) : (
              pendingLikes.map(like => (
                <LikeCard key={like.id} like={like} onLikeBack={handleLikeBack} onPass={handlePass} liking={liking} />
              ))
            )}
            <p className="text-xs text-gray-400 text-center mt-4">🔒 Buyer identity revealed only after mutual match</p>
          </div>
        )}

        {tab === "superlikes" && (
          <div className="space-y-4">
            {superLikes.length === 0 ? (
              <div className="text-center py-16"><p className="text-4xl mb-2">⭐</p><p className="text-gray-500">No super likes yet</p></div>
            ) : superLikes.map(like => (
              <div key={like.id} className="border-2 border-yellow-300 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-yellow-50 px-4 py-2 flex items-center gap-2">
                  <span className="text-yellow-600 font-black text-sm">⭐ This buyer was really impressed with your property!</span>
                </div>
                <div className="p-1">
                  <LikeCard like={like} onLikeBack={handleLikeBack} onPass={handlePass} liking={liking} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "matches" && (
          <div className="space-y-4">
            {matches.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-gray-600 font-semibold">No matches yet</p>
                <p className="text-gray-400 text-sm mt-1">Like buyers back to create a match</p>
              </div>
            ) : matches.map(match => {
              const days = daysLeft(match.expiresAt);
              return (
                <div key={match.id} className="bg-white border-2 border-orange-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full">🎉 Match!</span>
                    <span className="text-xs text-gray-400">{match.sellerActionAt ? timeAgo(match.sellerActionAt) : "Recently"}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🏠</div>
                    <span className="text-orange-500 text-xl">❤️</span>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">👤</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">Verified Buyer</p>
                      <p className="text-xs text-gray-400">Match score: {match.matchScore || 85}%</p>
                    </div>
                  </div>
                  {days !== null && (
                    <p className={`text-xs mb-3 flex items-center gap-1 ${days < 2 ? "text-red-500 font-bold" : "text-gray-400"}`}>
                      ⏰ {days > 0 ? `Match expires in ${days} day${days !== 1 ? "s" : ""}` : "Expires today!"}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Link to={`/kemedar/negotiate/${match.id}`}
                      className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                      💬 Open Negotiate™
                    </Link>
                    <button className="border border-gray-200 text-gray-600 font-bold px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                      💬 Quick Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "insights" && <InsightsTab />}
      </div>
    </div>
  );

  function timeAgo(dateStr) {
    if (!dateStr) return "recently";
    const diff = Date.now() - new Date(dateStr);
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }
}