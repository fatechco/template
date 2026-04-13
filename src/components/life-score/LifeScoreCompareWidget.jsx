import { useState } from "react";

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

export default function LifeScoreCompareWidget({ allScores }) {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleAreaSelect = (scoreId) => {
    if (selectedAreas.includes(scoreId)) {
      setSelectedAreas(selectedAreas.filter(id => id !== scoreId));
    } else if (selectedAreas.length < 4) {
      setSelectedAreas([...selectedAreas, scoreId]);
    }
  };

  const selectedScores = allScores.filter(s => selectedAreas.includes(s.id));

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">⚖️ Compare Neighborhoods</h2>
      <p className="text-gray-500 mb-6">Pick 2-4 areas to compare side by side</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {allScores.slice(0, 8).map(area => (
          <button
            key={area.id}
            onClick={() => handleAreaSelect(area.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedAreas.includes(area.id)
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            } ${selectedAreas.length >= 4 && !selectedAreas.includes(area.id) ? "opacity-40 pointer-events-none" : ""}`}
          >
            <p className="font-bold text-sm text-gray-900">{area.displayName}</p>
            <p className="text-orange-500 font-black text-xl">{Math.round(area.overallLifeScore)}</p>
          </button>
        ))}
      </div>

      {selectedAreas.length >= 2 && (
        <button
          onClick={() => setShowComparison(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors mb-8"
        >
          Compare {selectedAreas.length} Areas →
        </button>
      )}

      {showComparison && selectedScores.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-900">Dimension</th>
                {selectedScores.map(score => (
                  <th key={score.id} className="text-center py-3 px-4 font-bold text-gray-900">
                    {score.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 bg-orange-50">
                <td className="py-4 px-4 font-bold text-gray-900">Overall Life Score</td>
                {selectedScores.map(score => (
                  <td key={score.id} className="text-center py-4 px-4">
                    <span className="text-2xl font-black text-orange-500">
                      {Math.round(score.overallLifeScore)}
                    </span>
                  </td>
                ))}
              </tr>
              {DIMENSIONS.map(dim => {
                const maxVal = Math.max(...selectedScores.map(s => s[dim.key] || 0));
                return (
                  <tr key={dim.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {dim.icon} {dim.label}
                    </td>
                    {selectedScores.map(score => {
                      const val = Math.round(score[dim.key] || 0);
                      const isWinner = val === maxVal;
                      return (
                        <td key={score.id} className="text-center py-3 px-4">
                          <span className={`font-bold ${isWinner ? "text-green-600" : "text-gray-700"}`}>
                            {val}
                          </span>
                          {isWinner && <span className="ml-1 text-xs">🏆</span>}
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className={`h-full ${isWinner ? "bg-green-500" : "bg-orange-400"}`}
                              style={{ width: `${val}%` }}
                            ></div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}