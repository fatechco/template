import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

const COMMUNITY_GROUPS = [
  { code: "AE", flag: "🇦🇪", name: "In UAE", members: 3421, online: 142 },
  { code: "SA", flag: "🇸🇦", name: "In KSA", members: 2187, online: 89 },
  { code: "GB", flag: "🇬🇧", name: "In UK", members: 891, online: 34 },
  { code: "US", flag: "🇺🇸", name: "In USA", members: 1243, online: 56 },
  { code: "QA", flag: "🇶🇦", name: "In Gulf", members: 1567, online: 78 },
  { code: "ALL", flag: "🌍", name: "All", members: 12400, online: 421 },
];

const MOCK_POSTS = [
  { id: 1, type: "market_intel", flag: "🇦🇪", name: "Khaled M.", location: "Dubai, UAE", badge: "🏠 Property Owner", time: "2 hours ago", title: "Just closed my deal in New Cairo!", content: "After 3 months of searching remotely, I finally purchased a 3BR apartment in 5th Settlement. My FO Ahmed was incredible — he visited 4 properties for me, sent detailed reports each time, and negotiated 8% off the asking price. Happy to answer any questions about the process.", likes: 47, comments: 12 },
  { id: 2, type: "question", flag: "🇬🇧", name: "Sara A.", location: "London, UK", badge: null, time: "5 hours ago", title: "ADIB mortgage for Egyptian property — anyone done this?", content: "Has anyone successfully gotten a mortgage from ADIB or any UAE-based bank for buying property in Egypt? Looking at New Cairo, budget around 500K AED. FO says it's possible but complex.", likes: 23, comments: 18 },
  { id: 3, type: "recommendation", flag: "🇸🇦", name: "Tarek H.", location: "Riyadh, KSA", badge: "🏠 Property Owner", time: "1 day ago", title: "⭐ FO Recommendation — Omar in Sheikh Zayed", content: "Just completed my second property purchase via Omar (Franchise Owner, Sheikh Zayed). He is thorough, honest, and speaks perfect English. He spotted a legal issue in property #1 that saved me from a bad deal. Highly recommend.", likes: 89, comments: 7 },
  { id: 4, type: "legal", flag: "🇦🇪", name: "Mona S.", location: "Abu Dhabi, UAE", badge: null, time: "2 days ago", title: "Power of Attorney at Egyptian Embassy UAE — how long does it take?", content: "I'm planning to visit the Egyptian Consulate in Dubai to sign my POA next week. Has anyone done this recently? They said it takes 3 business days. Is that accurate?", likes: 31, comments: 24 },
];

const TYPE_STYLES = {
  market_intel: { bg: "bg-blue-50", border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", label: "📊 Market Intel" },
  question: { bg: "bg-white", border: "border-l-purple-400", badge: "bg-purple-100 text-purple-700", label: "❓ Question" },
  recommendation: { bg: "bg-amber-50", border: "border-l-amber-500", badge: "bg-amber-100 text-amber-700", label: "⭐ Recommendation" },
  legal: { bg: "bg-gray-50", border: "border-l-gray-400", badge: "bg-gray-100 text-gray-600", label: "⚖️ Legal/Tax" },
};

export default function ExpatCommunity() {
  const [activeGroup, setActiveGroup] = useState("ALL");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">🌍 Expat Community</h1>
          <p className="text-gray-500">Connect with fellow Egyptians abroad investing back home</p>
        </div>

        {/* Group tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {COMMUNITY_GROUPS.map(g => (
            <button key={g.code} onClick={() => setActiveGroup(g.code)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${activeGroup === g.code ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
              {g.flag} {g.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeGroup === g.code ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>{g.members.toLocaleString()}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Main feed */}
          <div className="flex-1 space-y-4">
            {/* Compose */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black">E</div>
                <input className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Share with expat community..." />
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {["📊 Market Update", "❓ Question", "⭐ Recommend", "✅ Deal Closed", "⚖️ Legal/Tax"].map(tag => (
                  <button key={tag} className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-50 font-semibold">{tag}</button>
                ))}
              </div>
            </div>

            {MOCK_POSTS.map(post => {
              const style = TYPE_STYLES[post.type] || TYPE_STYLES.question;
              return (
                <div key={post.id} className={`${style.bg} border border-gray-100 border-l-4 ${style.border} rounded-2xl shadow-sm p-5`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">{post.flag}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{post.name}</span>
                        <span className="text-xs text-gray-400">Egyptian in {post.location}</span>
                        {post.badge && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{post.badge}</span>}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{post.time}</p>
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">👍 {post.likes}</button>
                    <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">💬 {post.comments} comments</button>
                    <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">🔗 Share</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="font-black text-gray-900 text-sm mb-3">📊 Community Stats</p>
              {COMMUNITY_GROUPS.filter(g => g.code !== "ALL").slice(0, 5).map(g => (
                <div key={g.code} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm">{g.flag} {g.name}</span>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{g.members.toLocaleString()}</p>
                    <p className="text-[10px] text-green-500">{g.online} online</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="font-black text-orange-800 text-sm mb-2">📹 Monthly Webinar</p>
              <p className="text-xs text-orange-700 mb-1">Investing from Dubai — Tax, Legal & ROI 2026</p>
              <p className="text-[10px] text-orange-500 mb-3">April 15 · 7 PM UAE time</p>
              <button className="w-full text-xs bg-orange-500 text-white font-bold py-2 rounded-xl hover:bg-orange-600">Register Free →</button>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}