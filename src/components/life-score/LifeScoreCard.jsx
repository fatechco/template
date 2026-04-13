import { Link } from "react-router-dom";

const DIMENSION_ICONS = {
  walkability: "🚶",
  noise: "🔇",
  green: "🌳",
  safety: "🔒",
  connectivity: "📶",
  education: "🏫",
  convenience: "🛒",
  healthcare: "🏥"
};

const gradeGradients = {
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

export default function LifeScoreCard({ score }) {
  if (!score) return null;

  const dimensions = [
    { name: "walkability", label: "Walk", value: score.walkabilityScore },
    { name: "noise", label: "Quiet", value: score.noiseScore },
    { name: "green", label: "Green", value: score.greenScore },
    { name: "safety", label: "Safe", value: score.safetyScore },
    { name: "connectivity", label: "Net", value: score.connectivityScore },
    { name: "education", label: "Edu", value: score.educationScore },
    { name: "convenience", label: "Conv", value: score.convenienceScore },
    { name: "healthcare", label: "Health", value: score.healthcareScore }
  ];

  const scoreUrl = `/kemedar/life-score/${score.cityId || 'all'}/${score.districtId || score.areaId}`;

  return (
    <Link to={scoreUrl}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:border-orange-500 transition-all duration-300 border border-gray-100 overflow-hidden group h-full">
        {/* Top Strip with Gradient */}
        <div className={`bg-gradient-to-r ${gradeGradients[score.overallGrade]} h-32 relative p-6 flex flex-col justify-end`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white font-bold text-xl">{score.displayName}</h3>
              <p className="text-white/80 text-sm">{score.cityId ? "District" : "City"}</p>
            </div>
            <div className="bg-white text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
              {gradeEmojis[score.overallGrade]} {score.overallGrade.replace("_", " ").toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Personality Tag */}
          {score.neighborhoodPersonality && (
            <p className="text-sm text-orange-600 bg-orange-50 rounded-full px-3 py-1 inline-block mb-4 font-semibold">
              {score.neighborhoodPersonality.substring(0, 40)}...
            </p>
          )}

          {/* 8 Dimension Mini Scores */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {dimensions.map(dim => (
              <div key={dim.name} className="text-center">
                <div className="text-2xl mb-1">{DIMENSION_ICONS[dim.name]}</div>
                <div className="h-1 bg-gray-200 rounded-full mb-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
                    style={{ width: `${Math.min(dim.value, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs font-bold text-gray-700">{Math.round(dim.value)}</p>
              </div>
            ))}
          </div>

          {/* Best For Chips */}
          {score.bestFor && score.bestFor.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {score.bestFor.slice(0, 3).map(item => (
                <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer */}
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
            <p className="text-gray-500">View details →</p>
            <div className="text-center">
              <div className="text-2xl font-black text-orange-500">
                {Math.round(score.overallLifeScore)}
              </div>
              <p className="text-xs text-gray-400">/100</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}