import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const GROUPS = [
  { code: "ALL", flag: "🌍", name: "All", members: 12400, online: 421 },
  { code: "AE", flag: "🇦🇪", name: "UAE", members: 3421, online: 142 },
  { code: "SA", flag: "🇸🇦", name: "KSA", members: 2187, online: 89 },
  { code: "GB", flag: "🇬🇧", name: "UK", members: 891, online: 34 },
  { code: "US", flag: "🇺🇸", name: "USA", members: 1243, online: 56 },
];

const POSTS = [
  { id: 1, type: "market_intel", flag: "🇦🇪", name: "Khaled M.", location: "Dubai", time: "2h ago", title: "Just closed my deal in New Cairo!", content: "After 3 months of searching remotely, I purchased a 3BR in 5th Settlement. My FO Ahmed negotiated 8% off asking price. Happy to answer any questions about the process.", likes: 47, comments: 12 },
  { id: 2, type: "question", flag: "🇬🇧", name: "Sara A.", location: "London", time: "5h ago", title: "ADIB mortgage for Egyptian property?", content: "Has anyone gotten a mortgage from ADIB for buying in Egypt? Looking at New Cairo, budget 500K AED. FO says it's possible but complex.", likes: 23, comments: 18 },
  { id: 3, type: "recommendation", flag: "🇸🇦", name: "Tarek H.", location: "Riyadh", time: "1d ago", title: "⭐ FO Recommendation — Omar, Sheikh Zayed", content: "Just completed my second purchase via Omar. He is thorough, honest, speaks perfect English, and spotted a legal issue that saved me from a bad deal.", likes: 89, comments: 7 },
  { id: 4, type: "legal", flag: "🇦🇪", name: "Mona S.", location: "Abu Dhabi", time: "2d ago", title: "POA at Egyptian Embassy UAE — how long?", content: "Planning to visit the Egyptian Consulate in Dubai to sign my POA. They said 3 business days. Is that accurate?", likes: 31, comments: 24 },
];

const TYPE_STYLES = {
  market_intel: { badge: "bg-blue-100 text-blue-700", label: "📊 Market Intel", border: "border-l-blue-500" },
  question: { badge: "bg-purple-100 text-purple-700", label: "❓ Question", border: "border-l-purple-400" },
  recommendation: { badge: "bg-amber-100 text-amber-700", label: "⭐ Recommendation", border: "border-l-amber-500" },
  legal: { badge: "bg-gray-100 text-gray-600", label: "⚖️ Legal/Tax", border: "border-l-gray-400" },
};

export default function ExpatCommunityMobile() {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState("ALL");

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <p className="font-black text-gray-900 text-sm">🌍 Expat Community</p>
          <p className="text-xs text-gray-400">Egyptians abroad investing back home</p>
        </div>
      </div>

      {/* Group tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
        {GROUPS.map(g => (
          <button key={g.code} onClick={() => setActiveGroup(g.code)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activeGroup === g.code ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white text-gray-600"}`}>
            {g.flag} {g.name}
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeGroup === g.code ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              {(g.members / 1000).toFixed(1)}K
            </span>
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Upcoming Webinar */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="font-black text-orange-800 text-sm mb-1">📹 Monthly Webinar</p>
          <p className="text-xs text-orange-700 mb-1">Investing from Dubai — Tax, Legal & ROI 2026</p>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-orange-500">April 15 · 7 PM UAE time</p>
            <button className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg">Register Free →</button>
          </div>
        </div>

        {/* Compose */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black text-sm flex-shrink-0">E</div>
            <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
              placeholder="Share with expat community..." />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {["📊 Update", "❓ Question", "⭐ Recommend", "✅ Deal Closed"].map(tag => (
              <button key={tag} className="flex-shrink-0 text-xs border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-full font-semibold">{tag}</button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {POSTS.map(post => {
          const style = TYPE_STYLES[post.type] || TYPE_STYLES.question;
          return (
            <div key={post.id} className={`bg-white border border-gray-100 border-l-4 ${style.border} rounded-2xl shadow-sm p-4`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">{post.flag}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-gray-900 text-sm">{post.name}</span>
                    <span className="text-[10px] text-gray-400">in {post.location}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">{post.time}</p>
                </div>
              </div>
              <h3 className="font-black text-gray-900 text-sm mb-2">{post.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">👍 {post.likes}</button>
                <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">💬 {post.comments}</button>
                <button className="flex items-center gap-1 hover:text-orange-500 font-semibold">🔗 Share</button>
              </div>
            </div>
          );
        })}
      </div>

      <MobileBottomNav />
    </div>
  );
}