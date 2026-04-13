import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 1, icon: "🚀", name: "Getting Started", count: 12 },
  { id: 2, icon: "🏠", name: "Managing Properties", count: 18 },
  { id: 3, icon: "👥", name: "Managing Users", count: 9 },
  { id: 4, icon: "🔧", name: "Kemework Guide", count: 14 },
  { id: 5, icon: "🛒", name: "Kemetro Guide", count: 16 },
  { id: 6, icon: "💰", name: "Revenue & Earnings", count: 11 },
  { id: 7, icon: "💼", name: "Business Manager", count: 8 },
  { id: 8, icon: "🎯", name: "Marketing Guide", count: 10 },
  { id: 9, icon: "📋", name: "Franchise Duties", count: 7 },
  { id: 10, icon: "⚙️", name: "Technical Help", count: 13 },
];

const FEATURED_ARTICLES = [
  { id: 1, title: "How to Verify Properties in Your Area", category: "Managing Properties", date: "Mar 20", readTime: "5 min", slug: "verify-properties" },
  { id: 2, title: "Franchise Owner Duties & Responsibilities", category: "Franchise Duties", date: "Mar 19", readTime: "8 min", slug: "franchise-duties" },
  { id: 3, title: "Revenue Streams for Area Owners", category: "Revenue & Earnings", date: "Mar 18", readTime: "6 min", slug: "revenue-streams" },
  { id: 4, title: "Accrediting Professionals for Kemework", category: "Kemework Guide", date: "Mar 17", readTime: "4 min", slug: "accredit-professionals" },
  { id: 5, title: "Managing Your Kemetro Sellers", category: "Kemetro Guide", date: "Mar 16", readTime: "7 min", slug: "manage-sellers" },
  { id: 6, title: "Quick Start: Setting Up Your Area", category: "Getting Started", date: "Mar 15", readTime: "5 min", slug: "quick-start" },
];

export default function FranchiseOwnerKnowledge() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-6 text-center">
        <h1 className="text-4xl font-black text-white mb-4">📚 Kemedar Knowledge Base</h1>
        <p className="text-orange-100 mb-6 text-lg">Find guides, FAQs, and tutorials to help you succeed</p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search guides, FAQs, tutorials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full border-0 rounded-lg pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex justify-center gap-3 flex-wrap">
          {["How to verify property", "Franchise duties", "Revenue streams", "Accredit handyman"].map(chip => (
            <button key={chip} className="bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-5 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:border-orange-600 hover:shadow-md transition-all">
                <p className="text-4xl mb-3">{cat.icon}</p>
                <p className="font-bold text-gray-900 mb-1 text-sm">{cat.name}</p>
                <p className="text-xs text-gray-600">{cat.count} articles</p>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-3 gap-6">
            {FEATURED_ARTICLES.map(article => (
              <Link key={article.id} to={`/kemedar/franchise/knowledge/${article.slug}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group"
              >
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700 mb-3">{article.category}</span>
                <h3 className="font-black text-gray-900 text-lg mb-3 group-hover:text-orange-600 transition-colors">{article.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1 text-orange-600 font-bold text-sm mt-4 group-hover:gap-2 transition-all">
                  <span>Read Article</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}