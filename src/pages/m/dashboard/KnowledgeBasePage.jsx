import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import VideoLibrary from "@/components/about/VideoLibrary";

const CATEGORIES = [
  { id: "getting-started", icon: "🏠", name: "Getting Started", count: 12, color: "bg-orange-100" },
  { id: "properties", icon: "🏗", name: "Managing Properties", count: 18, color: "bg-blue-100" },
  { id: "billing", icon: "💳", name: "Billing & Plans", count: 9, color: "bg-green-100" },
  { id: "account", icon: "👤", name: "Account & Profile", count: 7, color: "bg-sky-100" },
  { id: "kemework", icon: "🔧", name: "Kemework Guide", count: 14, color: "bg-teal-100" },
  { id: "kemetro", icon: "🛒", name: "Kemetro Guide", count: 11, color: "bg-indigo-100" },
  { id: "marketing", icon: "📢", name: "Marketing Services", count: 6, color: "bg-red-100" },
  { id: "technical", icon: "⚙️", name: "Technical Help", count: 8, color: "bg-gray-100" },
];

const POPULAR_SEARCHES = [
  "How to add property", "Subscription plans", "Verify my account",
  "Contact support", "Upload documents", "Cancel order",
];

const ARTICLES = [
  { slug: "how-to-add-property", title: "How to Add Your First Property Listing", category: "Getting Started", readMin: 3 },
  { slug: "subscription-plans", title: "Understanding Subscription Plans & Pricing", category: "Billing & Plans", readMin: 5 },
  { slug: "verify-account", title: "How to Verify Your Account Identity", category: "Account & Profile", readMin: 4 },
  { slug: "upload-documents", title: "Uploading Documents and Media Files", category: "Getting Started", readMin: 2 },
  { slug: "kemework-post-task", title: "How to Post a Task on Kemework", category: "Kemework Guide", readMin: 4 },
  { slug: "kemetro-order", title: "Placing Your First Kemetro Order", category: "Kemetro Guide", readMin: 3 },
  { slug: "boost-listing", title: "Boosting Your Listing with VERI & LIST Services", category: "Marketing Services", readMin: 6 },
  { slug: "contact-support", title: "How to Contact Kemedar Support", category: "Account & Profile", readMin: 2 },
];

// Knowledge Base Home Page
export default function KnowledgeBasePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  const handleArticleClick = (slug) => {
    navigate(`/m/cp/user/knowledge/${slug}`)
  };

  const handleSearch = () => {
    if (search.trim()) navigate(`/m/dashboard/knowledge/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Knowledge Base" showBack
        rightAction={<button><Search size={20} className="text-gray-700" /></button>} />

      {/* Hero */}
      <div className="mx-4 mt-3 rounded-2xl p-5 bg-gradient-to-br from-orange-500 to-orange-700">
        <p className="text-white font-black text-lg mb-3">📚 How can we help you?</p>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search articles, guides..."
            className="flex-1 bg-white rounded-xl px-3 py-2.5 text-sm focus:outline-none text-gray-800" />
          <button onClick={handleSearch}
            className="bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1 flex-shrink-0">
            <Search size={14} /> Search
          </button>
        </div>
      </div>

      {/* Popular searches */}
      <div className="mt-3 px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {POPULAR_SEARCHES.map(s => (
            <button key={s}
              onClick={() => navigate(`/m/dashboard/knowledge/search?q=${encodeURIComponent(s)}`)}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm whitespace-nowrap">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Categories */}
        <p className="text-base font-black text-gray-900 mb-3">Browse by Category</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 text-left h-[80px]">
              <div className={`w-10 h-10 rounded-full ${cat.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {cat.icon}
              </div>
              <div>
                <p className="text-[13px] font-black text-gray-900">{cat.name}</p>
                <p className="text-[11px] text-gray-400">{cat.count} articles</p>
              </div>
            </button>
          ))}
        </div>

        {/* Popular articles */}
        <p className="text-base font-black text-gray-900 mb-3">Popular Articles</p>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {ARTICLES.map((a, i) => (
            <button key={a.slug}
              onClick={() => handleArticleClick(a.slug)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition ${i < ARTICLES.length - 1 ? "border-b border-gray-50" : ""}`}>
              <span className="text-xl text-gray-400">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900 truncate">{a.title}</p>
                <p className="text-[11px] text-gray-400">{a.category}</p>
              </div>
              <p className="text-[11px] text-gray-400 flex-shrink-0 mr-1">{a.readMin}m</p>
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Video Library */}
      <div className="mx-4 mb-6 bg-[#1a1a2e] rounded-2xl p-5">
        <div className="text-center mb-5">
          <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-[10px] font-black px-3 py-1 rounded-full mb-2 tracking-wider">VIDEO LIBRARY</span>
          <h2 className="text-base font-black text-white mb-1">Learn How Kemedar Works</h2>
          <p className="text-gray-400 text-xs">Watch our educational videos and get the most out of the platform</p>
        </div>
        <VideoLibrary />
      </div>
    </div>
  );
}