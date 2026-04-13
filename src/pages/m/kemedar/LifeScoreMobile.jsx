import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";

const gradeEmojis = {
  exceptional: "🌟",
  excellent: "⭐",
  very_good: "👍",
  good: "🙂",
  average: "😐",
  below_average: "⚠️",
  poor: "🔴"
};

const gradeColors = {
  exceptional: "bg-yellow-500",
  excellent: "bg-orange-500",
  very_good: "bg-blue-500",
  good: "bg-teal-500",
  average: "bg-gray-500",
  below_average: "bg-red-400",
  poor: "bg-red-600"
};

const DIMENSIONS = ["🚶", "🔇", "🌳", "🔒", "📶", "🏫", "🛒", "🏥"];

export default function LifeScoreMobile() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await base44.entities.NeighborhoodLifeScore.filter(
          { isPublished: true },
          "-overallLifeScore",
          50
        );
        setScores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = scores.filter(s =>
    !search || s.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const dimensionValues = (score) => [
    score.walkabilityScore,
    score.noiseScore,
    score.greenScore,
    score.safetyScore,
    score.connectivityScore,
    score.educationScore,
    score.convenienceScore,
    score.healthcareScore
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-gray-900 flex-1">🏙️ Life Score™</h1>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-8 px-4">
        <h2 className="text-xl font-black mb-1">Find Your Ideal Neighborhood</h2>
        <p className="text-sm opacity-80 mb-4">AI-powered neighborhood intelligence</p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search any neighborhood..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {["New Cairo", "Maadi", "Sheikh Zayed", "Heliopolis"].map(area => (
            <button
              key={area}
              onClick={() => setSearch(area)}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Area Cards */}
      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filtered.map(score => (
          <button
            key={score.id}
            className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md active:scale-[0.99] transition-all text-left"
            onClick={() => navigate(`/kemedar/life-score/${score.cityId}/${score.districtId || score.id}`)}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-base">{score.displayName}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {gradeEmojis[score.overallGrade]} {score.overallGrade.replace("_", " ")}
                </p>
                {/* Dimension Dots */}
                <div className="flex gap-1">
                  {dimensionValues(score).map((val, idx) => {
                    const pct = Math.min(val || 0, 100);
                    const color = pct >= 80 ? "bg-green-400" : pct >= 60 ? "bg-orange-400" : "bg-red-400";
                    return (
                      <div key={idx} className="text-center">
                        <div className="text-xs">{DIMENSIONS[idx]}</div>
                        <div className={`w-1.5 h-1.5 rounded-full ${color} mx-auto mt-0.5`}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-full ${gradeColors[score.overallGrade]} flex items-center justify-center flex-shrink-0`}>
                <div className="text-center">
                  <div className="text-xl font-black text-white">{Math.round(score.overallLifeScore)}</div>
                </div>
              </div>
            </div>
          </button>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">🏙️</p>
            <p>No neighborhoods found</p>
          </div>
        )}
      </div>
    </div>
  );
}