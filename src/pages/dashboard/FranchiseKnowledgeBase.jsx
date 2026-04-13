import { useState } from "react";
import { Search, ChevronRight, ThumbsUp, ThumbsDown, ArrowLeft } from "lucide-react";

const CATEGORIES = [
  { emoji: "📋", title: "Getting Started", articles: 8 },
  { emoji: "🏠", title: "Managing Properties", articles: 14 },
  { emoji: "👥", title: "Managing Users", articles: 6 },
  { emoji: "💰", title: "Finance & Payments", articles: 10 },
  { emoji: "🔧", title: "Kemework Guide", articles: 7 },
  { emoji: "🛒", title: "Kemetro Guide", articles: 9 },
  { emoji: "📢", title: "Marketing Guide", articles: 5 },
  { emoji: "⚙️", title: "System Settings", articles: 4 },
];

const MOCK_ARTICLES = {
  "Getting Started": [
    { title: "Welcome to the Franchise Owner Area Dashboard", readTime: "5 min", updated: "Mar 10" },
    { title: "How to complete your business profile", readTime: "3 min", updated: "Mar 8" },
    { title: "Understanding your coverage area", readTime: "4 min", updated: "Feb 28" },
    { title: "Setting up your payment methods", readTime: "3 min", updated: "Feb 25" },
    { title: "Onboarding checklist walkthrough", readTime: "6 min", updated: "Feb 20" },
    { title: "How to invite and manage employees", readTime: "4 min", updated: "Feb 18" },
    { title: "Understanding your commission structure", readTime: "5 min", updated: "Feb 15" },
    { title: "Getting your first client", readTime: "4 min", updated: "Feb 12" },
  ],
  "Managing Properties": [
    { title: "How to verify a property listing", readTime: "6 min", updated: "Mar 12" },
    { title: "Understanding property statuses", readTime: "3 min", updated: "Mar 9" },
    { title: "Featuring a property in your area", readTime: "3 min", updated: "Mar 7" },
  ],
};

const SAMPLE_ARTICLE = {
  title: "Welcome to the Franchise Owner Area Dashboard",
  content: `## Introduction

As a Franchise Owner, you are the most important role in the Kemedar ecosystem. You are responsible for managing a specific geographic area, verifying users and listings, and growing the Kemedar brand in your coverage zone.

## What You Can Do

Your dashboard gives you full control over:
- **All users** registered in your area
- **All properties and projects** listed in your area  
- **Kemework tasks** posted by property owners
- **Kemetro sellers** operating in your zone
- **Your own business** — employees, leads, clients, finances

## Getting Started

1. Complete your business profile
2. Define your coverage area precisely
3. Review and verify existing listings
4. Welcome users with a bulk message
5. Build your team by inviting employees

## Support

If you need help at any time, use the **Contact Kemedar** section from the Help menu.`,
  readTime: "5 min",
  updated: "Mar 10",
};

export default function FranchiseKnowledgeBase() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredCategories = CATEGORIES.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="bg-[#1a1a2e] rounded-2xl px-6 py-5">
        <h1 className="text-2xl font-black text-white">📚 Knowledge Base</h1>
        <p className="text-white/60 text-sm mt-1">Find answers, guides, and training resources</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search the knowledge base..."
          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-orange-400 shadow-sm bg-white"
        />
      </div>

      {!activeCategory && !activeArticle && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredCategories.map(cat => (
            <button key={cat.title} onClick={() => setActiveCategory(cat.title)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-left hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <p className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">{cat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{cat.articles} articles</p>
            </button>
          ))}
        </div>
      )}

      {activeCategory && !activeArticle && (
        <div className="space-y-4">
          <button onClick={() => setActiveCategory(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold">
            <ArrowLeft size={14} /> Back to categories
          </button>
          <h2 className="text-lg font-black text-gray-900">{CATEGORIES.find(c => c.title === activeCategory)?.emoji} {activeCategory}</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {(MOCK_ARTICLES[activeCategory] || MOCK_ARTICLES["Getting Started"]).map((a, i) => (
              <button key={i} onClick={() => setActiveArticle(a)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.readTime} read · Updated {a.updated}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {activeArticle && (
        <div className="space-y-4">
          <button onClick={() => setActiveArticle(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold">
            <ArrowLeft size={14} /> Back to articles
          </button>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4 max-w-2xl">
            <div>
              <h2 className="text-xl font-black text-gray-900">{SAMPLE_ARTICLE.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{SAMPLE_ARTICLE.readTime} read · Updated {SAMPLE_ARTICLE.updated}</p>
            </div>
            <div className="prose prose-sm text-gray-700 max-w-none">
              {SAMPLE_ARTICLE.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h3 key={i} className="font-black text-gray-900 text-base mt-4 mb-2">{line.replace("## ", "")}</h3>;
                if (line.startsWith("- **")) return <li key={i} className="text-sm ml-4" dangerouslySetInnerHTML={{ __html: line.replace("- **", "<strong>").replace("**", "</strong>").replace("- ", "") }} />;
                if (line.match(/^\d\. /)) return <li key={i} className="text-sm ml-4">{line.replace(/^\d\. /, "")}</li>;
                if (line.trim()) return <p key={i} className="text-sm text-gray-700">{line}</p>;
                return null;
              })}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-3">Was this article helpful?</p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"><ThumbsUp size={14} /> Yes, helpful</button>
                <button className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"><ThumbsDown size={14} /> Not helpful</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}