import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DIMENSIONS = [
  { key: "walkabilityScore", label: "Walkability", icon: "🚶" },
  { key: "noiseScore", label: "Noise", icon: "🔇" },
  { key: "greenScore", label: "Green", icon: "🌳" },
  { key: "safetyScore", label: "Safety", icon: "🔒" },
  { key: "connectivityScore", label: "Connectivity", icon: "📶" },
  { key: "educationScore", label: "Education", icon: "🏫" },
  { key: "convenienceScore", label: "Convenience", icon: "🛒" },
  { key: "healthcareScore", label: "Healthcare", icon: "🏥" }
];

export default function LifeScoreDetailWidget({ score }) {
  const [expandedDimension, setExpandedDimension] = useState(null);

  const radarData = DIMENSIONS.map(dim => ({
    name: dim.label,
    value: score[dim.key] || 0
  }));

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      {score.aiSummary && (
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">🤖 Neighborhood Overview</h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
              ✨ AI-Analyzed
            </span>
          </div>
          
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            {score.aiSummary}
          </p>

          {/* Hidden Gem */}
          {score.topHighlights && score.topHighlights[0] && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-orange-600">💎 Top Highlight: </span>
                {score.topHighlights[0]}
              </p>
            </div>
          )}

          {/* Top Challenges */}
          {score.topChallenges && score.topChallenges.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-red-600">⚠️ Important: </span>
                {score.topChallenges[0]}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Life Score Breakdown */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Life Score Breakdown</h2>

        {/* Radar Chart */}
        <div className="mb-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={radarData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${Math.round(value)}`} />
              <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIMENSIONS.map(dim => (
            <div
              key={dim.key}
              className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all"
              onClick={() => setExpandedDimension(expandedDimension === dim.key ? null : dim.key)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{dim.icon}</span>
                <h3 className="font-bold text-gray-900">{dim.label}</h3>
                <span className="ml-auto text-2xl font-black text-orange-500">
                  {Math.round(score[dim.key] || 0)}
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
                  style={{ width: `${Math.min(score[dim.key] || 0, 100)}%` }}
                ></div>
              </div>

              {/* Quality Label */}
              <p className="text-xs text-gray-500 mt-2">
                {score[dim.key] >= 80 ? "Excellent" : score[dim.key] >= 60 ? "Good" : score[dim.key] >= 40 ? "Average" : "Limited"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* All Highlights and Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Highlights */}
        {score.topHighlights && score.topHighlights.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4">✅ Top Highlights</h3>
            <ul className="space-y-2">
              {score.topHighlights.map((highlight, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Challenges */}
        {score.topChallenges && score.topChallenges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-4">⚠️ Things to Know</h3>
            <ul className="space-y-2">
              {score.topChallenges.map((challenge, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}