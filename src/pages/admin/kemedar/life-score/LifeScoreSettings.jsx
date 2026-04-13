import { useState } from "react";

const DEFAULT_WEIGHTS = {
  walkability: 12,
  noise: 10,
  green: 12,
  safety: 20,
  connectivity: 15,
  education: 12,
  convenience: 12,
  healthcare: 7
};

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

export default function LifeScoreSettings() {
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });
  const [thresholds, setThresholds] = useState({
    exceptional: 90,
    excellent: 80,
    very_good: 70,
    good: 60,
    average: 50,
    below_average: 40
  });
  const [displaySettings, setDisplaySettings] = useState({
    showOnPropertyPages: true,
    showOnSearchCards: true,
    showInAdvisorReports: true,
    minCompletenessToPublish: 60,
    minReviewsForCommunityRating: 3
  });
  const [saved, setSaved] = useState(false);

  const total = Object.values(weights).reduce((sum, v) => sum + Number(v), 0);

  const handleReset = () => setWeights({ ...DEFAULT_WEIGHTS });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-2xl font-black text-gray-900">⚙️ Life Score Settings</h1>

      {/* Scoring Weights */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-900">Dimension Weights</h2>
          <div className="flex items-center gap-4">
            <span className={`font-black text-lg ${total === 100 ? "text-green-600" : "text-red-500"}`}>
              Total: {total}% {total === 100 ? "✅" : "⚠️"}
            </span>
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {Object.entries(weights).map(([dim, val]) => (
            <div key={dim} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-40">
                <span className="text-lg">{DIMENSION_ICONS[dim]}</span>
                <span className="font-semibold text-sm text-gray-700 capitalize">{dim}</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={val}
                onChange={e => setWeights({ ...weights, [dim]: Number(e.target.value) })}
                className="flex-1 accent-orange-500"
              />
              <span className="text-sm font-bold text-gray-900 w-12 text-right">{val}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Thresholds */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-6">Grade Thresholds</h2>
        <div className="space-y-3">
          {Object.entries(thresholds).map(([grade, val]) => (
            <div key={grade} className="flex items-center gap-4">
              <span className="font-semibold text-sm text-gray-700 capitalize w-36">{grade.replace("_", " ")}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={val}
                onChange={e => setThresholds({ ...thresholds, [grade]: Number(e.target.value) })}
                className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-center font-bold"
              />
              <span className="text-sm text-gray-400">and above</span>
            </div>
          ))}
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-6">Display Settings</h2>
        <div className="space-y-4">
          {[
            { key: "showOnPropertyPages", label: "Show Life Score on property pages" },
            { key: "showOnSearchCards", label: "Show on search result cards" },
            { key: "showInAdvisorReports", label: "Show in Advisor reports" }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button
                onClick={() => setDisplaySettings({ ...displaySettings, [item.key]: !displaySettings[item.key] })}
                className={`w-12 h-6 rounded-full transition-colors ${displaySettings[item.key] ? "bg-green-500" : "bg-gray-200"}`}
              >
                <span className={`block w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${displaySettings[item.key] ? "translate-x-6" : "translate-x-0"}`}></span>
              </button>
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-700">Minimum data completeness to publish (%)</span>
            <input
              type="number"
              value={displaySettings.minCompletenessToPublish}
              onChange={e => setDisplaySettings({ ...displaySettings, minCompletenessToPublish: Number(e.target.value) })}
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-center font-bold"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Minimum reviews to show community rating</span>
            <input
              type="number"
              value={displaySettings.minReviewsForCommunityRating}
              onChange={e => setDisplaySettings({ ...displaySettings, minReviewsForCommunityRating: Number(e.target.value) })}
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-center font-bold"
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
          saved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        {saved ? "✅ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}