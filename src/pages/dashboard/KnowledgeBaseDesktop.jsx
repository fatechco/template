import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, BookOpen, AlertCircle, HelpCircle } from "lucide-react";
import VideoLibrary from "@/components/about/VideoLibrary";

const ARTICLES = [
  {
    id: 1,
    category: "Getting Started",
    icon: "🚀",
    title: "How to Create Your First Property Listing",
    excerpt: "Step-by-step guide to posting a property on Kemedar",
    views: 2400,
  },
  {
    id: 2,
    category: "Getting Started",
    icon: "🚀",
    title: "Understanding Property Categories",
    excerpt: "Learn about different property types and their classifications",
    views: 1800,
  },
  {
    id: 3,
    category: "Buying & Selling",
    icon: "💰",
    title: "Best Practices for Selling Property Fast",
    excerpt: "Tips and strategies to increase property visibility and sales",
    views: 3200,
  },
  {
    id: 4,
    category: "Buying & Selling",
    icon: "💰",
    title: "How to Make a Buy Request",
    excerpt: "Post your property requirements and find matches",
    views: 1600,
  },
  {
    id: 5,
    category: "Payments & Billing",
    icon: "💳",
    title: "Payment Methods and Security",
    excerpt: "Safe and secure payment options for your transactions",
    views: 2100,
  },
  {
    id: 6,
    category: "Payments & Billing",
    icon: "💳",
    title: "Understanding Subscription Plans",
    excerpt: "Compare our subscription tiers and choose the best for you",
    views: 2800,
  },
  {
    id: 7,
    category: "Account Management",
    icon: "👤",
    title: "Protecting Your Account",
    excerpt: "Security tips and best practices for account safety",
    views: 1400,
  },
  {
    id: 8,
    category: "Account Management",
    icon: "👤",
    title: "How to Update Your Profile",
    excerpt: "Edit profile information and preferences",
    views: 950,
  },
];

const FAQ = [
  { question: "How long does it take to sell a property?", answer: "It typically takes 2-8 weeks depending on the property type and market conditions." },
  { question: "What are the listing fees?", answer: "Basic listing is free. Premium features are available with our subscription plans." },
  { question: "Can I edit my listing after posting?", answer: "Yes, you can edit your listing anytime from your dashboard." },
  { question: "How do I delete my account?", answer: "Visit Account Settings and select 'Delete Account' in the Danger Zone." },
  { question: "Is there a mobile app?", answer: "Yes, our mobile app is available on iOS and Android platforms." },
];

export default function KnowledgeBaseDesktop() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(ARTICLES.map(a => a.category))];
  const filtered = ARTICLES.filter(a =>
    (activeCategory === "All" || a.category === activeCategory) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Knowledge Base</h1>
          <p className="text-gray-500">Find answers to common questions and learn how to use Kemedar</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {filtered.map(article => (
            <button
              key={article.id}
              onClick={() => navigate(`/cp/user/knowledge/${article.id}`)}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group text-left"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{article.icon}</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{article.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{article.views} views</span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-semibold">No articles found</p>
          </div>
        )}

        {/* Video Library */}
        <div className="mt-16 bg-[#1a1a2e] rounded-2xl p-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black px-4 py-1.5 rounded-full mb-3 tracking-wider">VIDEO LIBRARY</span>
            <h2 className="text-2xl font-black text-white mb-2">Learn How Kemedar Works</h2>
            <p className="text-gray-400 text-sm">Watch our educational videos and get the most out of the platform</p>
          </div>
          <VideoLibrary />
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-lg border border-gray-100 p-4 hover:border-blue-200 transition-colors group"
              >
                <summary className="flex items-center gap-3 cursor-pointer font-semibold text-gray-900">
                  <span className="text-blue-600 group-open:rotate-90 transition-transform">▶</span>
                  {faq.question}
                </summary>
                <p className="text-gray-600 mt-3 ml-6">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <BookOpen size={32} className="mx-auto text-blue-600 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Didn't find what you're looking for?</h3>
          <p className="text-gray-600 mb-4">Our support team is here to help you.</p>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}