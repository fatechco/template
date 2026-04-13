import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const DIMENSIONS = [
  { key: "walkabilityScore", label: "Walk", icon: "🚶" },
  { key: "noiseScore", label: "Quiet", icon: "🔇" },
  { key: "greenScore", label: "Green", icon: "🌳" },
  { key: "safetyScore", label: "Safe", icon: "🔒" },
  { key: "connectivityScore", label: "Net", icon: "📶" },
  { key: "educationScore", label: "Edu", icon: "🏫" },
  { key: "convenienceScore", label: "Conv", icon: "🛒" },
  { key: "healthcareScore", label: "Health", icon: "🏥" }
];

const gradeColors = {
  exceptional: "text-yellow-600 bg-yellow-100",
  excellent: "text-orange-600 bg-orange-100",
  very_good: "text-blue-600 bg-blue-100",
  good: "text-teal-600 bg-teal-100",
  average: "text-gray-600 bg-gray-100",
  below_average: "text-red-500 bg-red-100",
  poor: "text-red-700 bg-red-200"
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

export default function LifeScorePropertyWidget({ districtId, areaId, cityId }) {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const query = { isPublished: true };
        if (areaId) query.areaId = areaId;
        else if (districtId) query.districtId = districtId;
        else if (cityId) query.cityId = cityId;

        const data = await base44.entities.NeighborhoodLifeScore.filter(query, undefined, 1);
        if (data.length > 0) setScore(data[0]);
      } catch (err) {
        console.error("LifeScore widget error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (districtId || areaId || cityId) fetchScore();
    else setLoading(false);
  }, [districtId, areaId, cityId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
      </div>
    );
  }

  if (!score) return null;

  const gradeClass = gradeColors[score.overallGrade] || gradeColors.average;
  const gradeEmoji = gradeEmojis[score.overallGrade] || "😐";
  const detailUrl = `/kemedar/life-score/${score.cityId}/${score.districtId || score.id}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-black text-gray-900 text-base">🏙️ Neighborhood Life Score™</h3>
          </div>
          {score.neighborhoodPersonality && (
            <p className="text-xs text-gray-500 italic mb-1">{score.neighborhoodPersonality}</p>
          )}
          <Link to={detailUrl} className="text-sm text-orange-500 hover:underline flex items-center gap-1">
            📍 {score.displayName}
          </Link>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-500 flex items-center justify-center">
            <div>
              <div className="text-xl font-black text-orange-500">{Math.round(score.overallLifeScore)}</div>
              <div className="text-xs text-gray-400 leading-tight">Life Score</div>
            </div>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${gradeClass}`}>
            {gradeEmoji} {score.overallGrade.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* 8 Mini Dimension Scores */}
      <div className="grid grid-cols-4 gap-2 px-5 pb-3">
        {DIMENSIONS.map(dim => {
          const val = Math.round(score[dim.key] || 0);
          const color = val >= 80 ? "bg-green-500" : val >= 60 ? "bg-orange-500" : "bg-red-500";
          return (
            <div key={dim.key} className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-lg mb-1">{dim.icon}</div>
              <div className="h-1 bg-gray-200 rounded-full mb-1 overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${val}%` }}></div>
              </div>
              <p className="text-xs text-gray-400">{dim.label}</p>
              <p className="text-xs font-bold text-gray-700">{val}</p>
            </div>
          );
        })}
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 border-t border-gray-100"
      >
        {expanded ? "▲ Collapse" : "▼ View Neighborhood Details"}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          {/* AI Summary Preview */}
          {score.aiSummary && (
            <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
              {score.aiSummary.split(".")[0]}.
              <Link to={detailUrl} className="text-orange-500 hover:underline ml-1">
                Read more about this neighborhood →
              </Link>
            </p>
          )}

          {/* Best For */}
          {score.bestFor && score.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs text-gray-500 font-semibold">Best for:</span>
              {score.bestFor.map(item => (
                <span key={item} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          )}

          <Link to={detailUrl} className="block w-full text-center text-sm font-bold text-orange-500 border-2 border-orange-500 py-2 rounded-xl hover:bg-orange-50 transition-colors mt-2">
            📊 See Full Neighborhood Report →
          </Link>
        </div>
      )}
    </div>
  );
}