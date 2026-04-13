import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Star, MapPin, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const GRADE_CONFIG = {
  exceptional: { gradient: "from-yellow-600 to-orange-500", badge: "bg-yellow-100 text-yellow-700", emoji: "🌟", label: "Exceptional" },
  excellent:   { gradient: "from-orange-500 to-orange-600", badge: "bg-orange-100 text-orange-700", emoji: "⭐", label: "Excellent" },
  very_good:   { gradient: "from-blue-500 to-blue-700",    badge: "bg-blue-100 text-blue-700",    emoji: "👍", label: "Very Good" },
  good:        { gradient: "from-teal-500 to-teal-700",    badge: "bg-teal-100 text-teal-700",    emoji: "🙂", label: "Good" },
  average:     { gradient: "from-gray-500 to-gray-700",    badge: "bg-gray-100 text-gray-700",    emoji: "😐", label: "Average" },
  below_average:{ gradient: "from-red-400 to-red-500",    badge: "bg-red-100 text-red-600",      emoji: "⚠️", label: "Below Avg" },
  poor:        { gradient: "from-red-600 to-red-700",      badge: "bg-red-100 text-red-700",      emoji: "🔴", label: "Poor" },
};

const DIMENSION_ICONS = {
  transportScore: "🚇", schoolsScore: "🏫", hospitalsScore: "🏥",
  shoppingScore: "🛍️", safetyScore: "🛡️", parksScore: "🌳",
  restaurantsScore: "🍽️", nightlifeScore: "🌙", airQualityScore: "💨",
  communityScore: "🤝",
};

const DIMENSION_LABELS = {
  transportScore: "Transport", schoolsScore: "Schools", hospitalsScore: "Healthcare",
  shoppingScore: "Shopping", safetyScore: "Safety", parksScore: "Parks & Green",
  restaurantsScore: "Dining", nightlifeScore: "Nightlife", airQualityScore: "Air Quality",
  communityScore: "Community",
};

function ScoreBar({ value, color = "bg-orange-500" }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex-1">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, value || 0)}%` }} />
    </div>
  );
}

// Mock data for when no DB record exists
const MOCK_SCORE = {
  displayName: "Maadi",
  cityName: "Cairo",
  overallLifeScore: 78,
  overallGrade: "very_good",
  neighborhoodPersonality: "Cairo's Green Lung — calm, expat-friendly, leafy streets",
  bestFor: ["Families", "Expats", "Professionals"],
  transportScore: 72, schoolsScore: 85, hospitalsScore: 80,
  shoppingScore: 75, safetyScore: 82, parksScore: 90,
  restaurantsScore: 78, nightlifeScore: 60, airQualityScore: 70,
  communityScore: 84,
  aiNarrative: "Maadi consistently ranks as one of Cairo's most livable neighborhoods. Its tree-lined streets, international schools, and strong expat community make it ideal for families relocating to Egypt. The metro connectivity provides excellent access to central Cairo while maintaining a suburban calm.",
  prosAndCons: {
    pros: ["Abundant greenery and parks", "Strong international school network", "Excellent safety record", "Vibrant expat & social scene"],
    cons: ["Higher rental prices vs. other areas", "Traffic bottlenecks at peak hours", "Limited nightlife options"],
  },
  avgRentPerSqm: 850,
  avgSalePerSqm: 18000,
  totalListings: 243,
  averageRating: 4.3,
  totalReviews: 89,
};

export default function LifeScoreDetailMobile() {
  const { citySlug, districtSlug } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const fetch = async () => {
      const data = await base44.entities.NeighborhoodLifeScore.filter({ isPublished: true }, undefined, 1).catch(() => []);
      setScore(data.length ? data[0] : MOCK_SCORE);
      setLoading(false);
    };
    fetch();
  }, [citySlug, districtSlug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  const cfg = GRADE_CONFIG[score.overallGrade] || GRADE_CONFIG.good;
  const cityLabel = score.cityName || citySlug?.replace(/-/g, " ") || "City";
  const districtLabel = score.displayName || districtSlug?.replace(/-/g, " ") || "Area";

  const dimensions = Object.keys(DIMENSION_LABELS)
    .filter(k => score[k] !== undefined)
    .map(k => ({ key: k, label: DIMENSION_LABELS[k], icon: DIMENSION_ICONS[k], value: score[k] }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${cfg.gradient} text-white px-5 pt-14 pb-8 relative`}>
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Share2 size={16} className="text-white" />
        </button>

        <div className="flex items-end justify-between gap-4 mt-2">
          <div className="flex-1">
            <p className="text-white/60 text-xs flex items-center gap-1 mb-1">
              <MapPin size={10} /> {cityLabel}
            </p>
            <h1 className="text-3xl font-black leading-tight">{districtLabel}</h1>
            {score.neighborhoodPersonality && (
              <p className="text-white/70 text-xs italic mt-1 leading-relaxed">{score.neighborhoodPersonality}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(score.bestFor || []).slice(0, 3).map(b => (
                <span key={b} className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{b}</span>
              ))}
            </div>
          </div>

          {/* Score Circle */}
          <div className="flex-shrink-0 text-center">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex flex-col items-center justify-center mb-2">
              <span className="text-3xl font-black">{Math.round(score.overallLifeScore)}</span>
              <span className="text-[10px] text-white/70">Life Score™</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white`}>
              {cfg.emoji} {cfg.label}
            </span>
          </div>
        </div>

        {/* Rating row */}
        {score.averageRating && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(n => <Star key={n} size={11} className={n <= Math.round(score.averageRating) ? "fill-yellow-300 text-yellow-300" : "text-white/30 fill-white/20"} />)}
            </div>
            <span className="text-white/70 text-xs">{score.averageRating} · {score.totalReviews || 0} reviews</span>
            {score.totalListings && <span className="text-white/60 text-xs ml-auto">{score.totalListings} properties</span>}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100 sticky top-0 z-10">
        {[{ id: "overview", label: "Overview" }, { id: "scores", label: "Scores" }, { id: "reviews", label: "Reviews" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overview Tab */}
        {tab === "overview" && (
          <>
            {/* AI Narrative */}
            {score.aiNarrative && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs font-black text-purple-600 mb-2">🤖 AI Neighborhood Analysis</p>
                <p className="text-sm text-gray-700 leading-relaxed">{score.aiNarrative}</p>
              </div>
            )}

            {/* Top scores preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-black text-gray-900 text-sm mb-3">Top Strengths</h3>
              <div className="space-y-2">
                {dimensions.slice(0, 4).map(d => (
                  <div key={d.key} className="flex items-center gap-3">
                    <span className="text-base w-6 flex-shrink-0">{d.icon}</span>
                    <span className="text-xs text-gray-600 w-20 flex-shrink-0">{d.label}</span>
                    <ScoreBar value={d.value} />
                    <span className="text-xs font-black text-gray-700 w-8 text-right flex-shrink-0">{Math.round(d.value)}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab("scores")} className="mt-3 text-xs text-orange-500 font-bold">See all scores →</button>
            </div>

            {/* Pros & Cons */}
            {score.prosAndCons && (
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <h4 className="font-black text-green-700 text-sm mb-2">✅ Pros</h4>
                  <ul className="space-y-1.5">
                    {(score.prosAndCons.pros || []).map((p, i) => (
                      <li key={i} className="text-xs text-green-800 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <h4 className="font-black text-red-700 text-sm mb-2">⚠️ Cons</h4>
                  <ul className="space-y-1.5">
                    {(score.prosAndCons.cons || []).map((c, i) => (
                      <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Price snapshot */}
            {(score.avgRentPerSqm || score.avgSalePerSqm) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-black text-gray-900 text-sm mb-3">💰 Property Prices</h3>
                <div className="grid grid-cols-2 gap-3">
                  {score.avgRentPerSqm && (
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-blue-600 font-bold">Avg Rent/m²</p>
                      <p className="font-black text-blue-700">{Number(score.avgRentPerSqm).toLocaleString()} EGP</p>
                    </div>
                  )}
                  {score.avgSalePerSqm && (
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-orange-600 font-bold">Avg Sale/m²</p>
                      <p className="font-black text-orange-700">{Number(score.avgSalePerSqm).toLocaleString()} EGP</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link to={`/search-properties?district=${districtSlug}`}
              className="block w-full text-center bg-orange-500 text-white font-black py-4 rounded-2xl">
              🔍 View Properties in {districtLabel}
            </Link>
          </>
        )}

        {/* Scores Tab */}
        {tab === "scores" && (
          <>
            {/* Overall */}
            <div className={`bg-gradient-to-br ${cfg.gradient} rounded-2xl p-5 text-white text-center`}>
              <p className="text-white/60 text-xs mb-1">Overall Life Score™</p>
              <p className="text-6xl font-black">{Math.round(score.overallLifeScore)}</p>
              <p className="text-white/70 text-sm mt-1">{cfg.emoji} {cfg.label}</p>
            </div>

            {/* All dimensions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-black text-gray-900 text-sm mb-4">All Categories</h3>
              <div className="space-y-3">
                {dimensions.map(d => (
                  <div key={d.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <span>{d.icon}</span>{d.label}
                      </span>
                      <span className={`text-xs font-black px-1.5 py-0.5 rounded-full ${d.value >= 80 ? "bg-green-100 text-green-700" : d.value >= 60 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-600"}`}>
                        {Math.round(d.value)}
                      </span>
                    </div>
                    <ScoreBar value={d.value} color={d.value >= 80 ? "bg-green-500" : d.value >= 60 ? "bg-orange-500" : "bg-red-400"} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Reviews Tab */}
        {tab === "reviews" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="text-center">
                <p className="text-3xl font-black text-yellow-500">{score.averageRating || "—"}</p>
                <div className="flex gap-0.5 justify-center">
                  {[1,2,3,4,5].map(n => <Star key={n} size={11} className={n <= Math.round(score.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />)}
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{score.totalReviews || 0} reviews</p>
                <p className="text-xs text-gray-400">Community ratings for {districtLabel}</p>
              </div>
            </div>
            <div className="text-center py-8 text-gray-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm">Be the first to review {districtLabel}</p>
              <button className="mt-3 bg-orange-500 text-white font-bold px-5 py-2 rounded-xl text-sm">
                + Write a Review
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}