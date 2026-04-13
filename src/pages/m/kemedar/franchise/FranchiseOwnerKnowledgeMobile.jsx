import { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const CATEGORIES = [
  { icon: "🚀", name: "Getting Started", count: 12 },
  { icon: "🏠", name: "Properties", count: 18 },
  { icon: "👥", name: "Users", count: 9 },
  { icon: "🔧", name: "Kemework", count: 14 },
  { icon: "🛒", name: "Kemetro", count: 16 },
  { icon: "💰", name: "Revenue", count: 11 },
];

const ARTICLES = [
  { slug: "verify-properties", title: "How to Verify Properties", time: "5 min" },
  { slug: "franchise-duties", title: "Franchise Duties", time: "8 min" },
  { slug: "revenue-streams", title: "Revenue Streams", time: "6 min" },
];

export default function FranchiseOwnerKnowledgeMobile() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Knowledge Base</h1>
        <div className="flex-1" />
        <Search size={22} className="text-gray-600" />
      </div>

      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search articles..." className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>

        {!selectedCategory ? (
          /* Categories Grid */
          <>
            <p className="text-sm font-black text-gray-900 mb-3">Categories</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat, i) => (
                <button key={i} onClick={() => setSelectedCategory(cat.name)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all active:bg-orange-50"
                >
                  <p className="text-3xl mb-2">{cat.icon}</p>
                  <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                  <p className="text-[10px] text-gray-600">{cat.count}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Articles List */
          <>
            <button onClick={() => setSelectedCategory(null)} className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-1">
              ← {selectedCategory}
            </button>
            <div className="space-y-2">
              {ARTICLES.map(article => (
                <Link key={article.slug} to={`/m/kemedar/franchise/knowledge/${article.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 block hover:shadow-md transition-all active:bg-orange-50"
                >
                  <p className="font-bold text-gray-900 text-sm mb-1">{article.title}</p>
                  <p className="text-xs text-gray-600">⏱ {article.time}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}