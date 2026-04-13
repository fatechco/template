import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Download, MapPin, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import LifeScoreDetailWidget from "@/components/life-score/LifeScoreDetailWidget";
import LifeScoreReviews from "@/components/life-score/LifeScoreReviews";
import LifeScoreNearbyAreas from "@/components/life-score/LifeScoreNearbyAreas";

export default function LifeScoreDetail() {
  const { citySlug, districtSlug } = useParams();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        // Query by location slugs
        const data = await base44.entities.NeighborhoodLifeScore.filter(
          { isPublished: true },
          undefined,
          1
        );
        if (data.length > 0) {
          setScore(data[0]);
        }
      } catch (error) {
        console.error("Error fetching life score:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [citySlug, districtSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Neighborhood not found</h1>
            <Link to="/kemedar/life-score" className="text-orange-500 hover:underline">
              ← Back to Life Score
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const gradeColors = {
    exceptional: "from-yellow-400 to-orange-500",
    excellent: "from-orange-400 to-orange-500",
    very_good: "from-blue-400 to-blue-500",
    good: "from-teal-400 to-teal-500",
    average: "from-gray-400 to-gray-500",
    below_average: "from-red-300 to-red-400",
    poor: "from-red-500 to-red-600"
  };

  const gradeEmojis = {
    exceptional: "🌟",
    excellent: "⭐",
    very_good: "👍",
    good: "🙂",
    average: "😐",
    below_average: "⚠️",
    poor: "🔴"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <SiteHeader />

      {/* Header */}
      <div className={`bg-gradient-to-r ${gradeColors[score.overallGrade]} text-white py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <Link to="/kemedar/life-score" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Life Scores</span>
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <p className="text-sm opacity-90 mb-1">
                📍 {score.displayName}
              </p>
              <h1 className="text-4xl lg:text-5xl font-black mb-2">
                {score.displayName}
              </h1>
              <p className="text-lg opacity-90 italic">
                ✨ {score.neighborhoodPersonality}
              </p>
              <div className="flex gap-2 mt-4">
                {score.bestFor?.slice(0, 2).map(item => (
                  <span key={item} className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Score Circle */}
            <div className="text-center">
              <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <div>
                  <div className="text-5xl font-black text-white">
                    {Math.round(score.overallLifeScore)}
                  </div>
                  <p className="text-white text-sm font-semibold">Life Score™</p>
                </div>
              </div>
              <div className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-lg inline-block">
                {gradeEmojis[score.overallGrade]} {score.overallGrade.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
              🔍 View Properties Here
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
              ⚖️ Compare with Another Area
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-colors">
              <Share2 size={20} />
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
        {/* AI Summary */}
        <LifeScoreDetailWidget score={score} />

        {/* Reviews */}
        <div className="mt-12">
          <LifeScoreReviews areaId={score.areaId || score.districtId} />
        </div>

        {/* Nearby Areas */}
        <div className="mt-12">
          <LifeScoreNearbyAreas cityId={score.cityId} currentAreaId={score.id} />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}