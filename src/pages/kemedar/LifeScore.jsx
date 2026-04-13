import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, TrendingUp, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import LifeScoreCard from "@/components/life-score/LifeScoreCard";
import LifeScoreCompareWidget from "@/components/life-score/LifeScoreCompareWidget";

export default function LifeScore() {
  const [scores, setScores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("overall");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await base44.entities.NeighborhoodLifeScore.filter(
          { isPublished: true },
          "-overallLifeScore",
          100
        );
        setScores(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching life scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  useEffect(() => {
    let results = scores;

    if (search) {
      results = results.filter(s =>
        s.displayName.toLowerCase().includes(search.toLowerCase()) ||
        s.displayNameAr.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "safety") results = [...results].sort((a, b) => b.safetyScore - a.safetyScore);
    else if (sortBy === "green") results = [...results].sort((a, b) => b.greenScore - a.greenScore);
    else if (sortBy === "walkable") results = [...results].sort((a, b) => b.walkabilityScore - a.walkabilityScore);
    else if (sortBy === "schools") results = [...results].sort((a, b) => b.educationScore - a.educationScore);
    else if (sortBy === "transport") results = [...results].sort((a, b) => b.connectivityScore - a.connectivityScore);

    setFiltered(results);
  }, [search, sortBy, scores]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-4">🏙️</div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            Kemedar Life Score™
          </h1>
          <p className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Find out what it's really like to live in any neighborhood
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              🇦🇪 Data-Driven
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              🤖 AI-Powered
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              👥 Community-Verified
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search any neighborhood, district or city in Egypt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Popular Areas */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-sm opacity-75">Try:</span>
            {["New Cairo", "Maadi", "Sheikh Zayed", "Heliopolis"].map(area => (
              <button
                key={area}
                onClick={() => setSearch(area)}
                className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm font-semibold transition-colors"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Sort Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
          <button
            onClick={() => setSortBy("overall")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "overall"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌟 Highest Rated
          </button>
          <button
            onClick={() => setSortBy("safety")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "safety"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🔒 Safest
          </button>
          <button
            onClick={() => setSortBy("green")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "green"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌳 Most Green
          </button>
          <button
            onClick={() => setSortBy("walkable")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "walkable"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🚶 Most Walkable
          </button>
          <button
            onClick={() => setSortBy("schools")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "schools"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏫 Best Schools
          </button>
          <button
            onClick={() => setSortBy("transport")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === "transport"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🚇 Best Transport
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading neighborhoods...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No neighborhoods found matching your search.</p>
            </div>
          ) : (
            filtered.map(score => (
              <LifeScoreCard key={score.id} score={score} />
            ))
          )}
        </div>

        {/* Compare Widget */}
        <LifeScoreCompareWidget allScores={scores} />
      </div>

      <SiteFooter />
    </div>
  );
}