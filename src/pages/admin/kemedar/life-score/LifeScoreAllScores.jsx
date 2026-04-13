import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, RefreshCw, Eye, Edit, Globe } from "lucide-react";

export default function LifeScoreAllScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(null);
  const [search, setSearch] = useState("");

  const fetchScores = async () => {
    setLoading(true);
    const data = await base44.entities.NeighborhoodLifeScore.list("-overallLifeScore", 200);
    setScores(data);
    setLoading(false);
  };

  useEffect(() => { fetchScores(); }, []);

  const handlePublish = async (score) => {
    await base44.entities.NeighborhoodLifeScore.update(score.id, { isPublished: !score.isPublished });
    fetchScores();
  };

  const handleRegenerateNarrative = async (score) => {
    setRecalculating(score.id);
    await base44.functions.invoke("generateLifeScoreNarrative", {
      lifeScoreId: score.id,
      districtName: score.displayName,
      cityName: "",
      scoreData: score,
      reviewSummary: {}
    });
    setRecalculating(null);
    fetchScores();
  };

  const filtered = scores.filter(s =>
    !search || s.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-gray-900">📊 All Scores</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search area..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
          <button onClick={fetchScores} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Area</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Overall</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">🚶</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">🔒</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">🌳</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">📶</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">🏫</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Data %</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Published</th>
              <th className="text-right py-3 px-4 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-12">
                  <Loader2 className="animate-spin mx-auto text-gray-400" size={24} />
                </td>
              </tr>
            ) : filtered.map(score => (
              <tr key={score.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{score.displayName}</p>
                  <p className="text-xs text-gray-400 capitalize">{score.overallGrade?.replace("_", " ")}</p>
                </td>
                <td className="text-center py-3 px-4">
                  <span className="font-black text-orange-500">{Math.round(score.overallLifeScore || 0)}</span>
                </td>
                <td className="text-center py-3 px-4 text-xs">{Math.round(score.walkabilityScore || 0)}</td>
                <td className="text-center py-3 px-4 text-xs">{Math.round(score.safetyScore || 0)}</td>
                <td className="text-center py-3 px-4 text-xs">{Math.round(score.greenScore || 0)}</td>
                <td className="text-center py-3 px-4 text-xs">{Math.round(score.connectivityScore || 0)}</td>
                <td className="text-center py-3 px-4 text-xs">{Math.round(score.educationScore || 0)}</td>
                <td className="text-center py-3 px-4">
                  <span className={`text-xs font-bold ${(score.dataCompleteness || 0) >= 60 ? "text-green-600" : "text-red-500"}`}>
                    {Math.round(score.dataCompleteness || 0)}%
                  </span>
                </td>
                <td className="text-center py-3 px-4">
                  <button
                    onClick={() => handlePublish(score)}
                    className={`w-10 h-5 rounded-full transition-colors ${score.isPublished ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full transition-transform mx-auto ${score.isPublished ? "translate-x-2" : "-translate-x-1"}`}></span>
                  </button>
                </td>
                <td className="text-right py-3 px-4">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => handleRegenerateNarrative(score)}
                      disabled={recalculating === score.id}
                      className="text-xs text-purple-600 hover:bg-purple-50 px-2 py-1 rounded font-semibold flex items-center gap-1"
                      title="Regenerate AI Narrative"
                    >
                      {recalculating === score.id ? <Loader2 size={12} className="animate-spin" /> : "🤖"}
                    </button>
                    <button className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded font-semibold" title="View">
                      <Eye size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}