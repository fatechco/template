import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TABS = ["All", "Interior Design", "Electrical", "Plumbing", "Carpentry", "Landscaping"];

const PROS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Designer", city: "Cairo", country: "Egypt", rating: 4.9, reviews: 127, from: 50, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=70", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", tab: "Interior Design" },
  { id: 2, name: "Sara Mohamed", category: "Electrical Engineer", city: "Dubai", country: "UAE", rating: 4.8, reviews: 89, from: 35, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", tab: "Electrical" },
  { id: 3, name: "Omar Khalid", category: "Plumber", city: "Riyadh", country: "Saudi Arabia", rating: 4.7, reviews: 203, from: 25, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=70", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70", tab: "Plumbing" },
  { id: 4, name: "Layla Nour", category: "Landscape Designer", city: "Amman", country: "Jordan", rating: 4.9, reviews: 64, from: 80, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70", tab: "Landscaping" },
  { id: 5, name: "Kareem Saad", category: "Carpenter", city: "Alexandria", country: "Egypt", rating: 4.6, reviews: 156, from: 30, verified: false, accredited: false, cover: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=70", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70", tab: "Carpentry" },
  { id: 6, name: "Nadia Ali", category: "Interior Designer", city: "Kuwait City", country: "Kuwait", rating: 5.0, reviews: 42, from: 120, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=70", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=70", tab: "Interior Design" },
];

export default function KWFeaturedProfessionals() {
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(0);
  const filtered = activeTab === "All" ? PROS : PROS.filter(p => p.tab === activeTab);
  const perPage = 4;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="py-16 px-4" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Featured Professionals</h2>
        <p className="text-gray-500 text-center mb-8">Verified experts ready to help you</p>

        {/* Tab filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setPage(0); }}
              className="px-4 py-2 rounded-full text-xs font-bold border transition-colors"
              style={{
                background: activeTab === tab ? "#C41230" : "#fff",
                color: activeTab === tab ? "#fff" : "#374151",
                borderColor: activeTab === tab ? "#C41230" : "#e5e7eb",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards + arrows */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visible.map(pro => (
              <div key={pro.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
                {/* Cover */}
                <div className="relative h-20 bg-gray-200">
                  <img src={pro.cover} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>
                {/* Avatar */}
                <div className="relative flex justify-center -mt-8 mb-2">
                  <img src={pro.avatar} alt={pro.name} className="w-16 h-16 rounded-full border-4 border-white object-cover shadow" />
                </div>
                {/* Badges */}
                <div className="flex justify-center gap-1 mb-2">
                  {pro.verified && <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Verified</span>}
                  {pro.accredited && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅 Accredited</span>}
                </div>
                {/* Info */}
                <div className="text-center px-4 pb-4 flex-1 flex flex-col">
                  <p className="font-black text-gray-900 text-base">{pro.name}</p>
                  <p className="text-gray-500 text-xs mb-1">{pro.category}</p>
                  <p className="text-xs text-gray-400 mb-1">⭐ {pro.rating} ({pro.reviews} reviews)</p>
                  <p className="text-xs text-gray-400 mb-1">📍 {pro.city}, {pro.country}</p>
                  <p className="text-xs text-gray-500 mb-3">Starting from: <span className="font-bold text-gray-800">${pro.from}</span></p>
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">💬 Message</button>
                    <Link to={`/kemework/profile/${pro.id}`} className="flex-1 py-2 rounded-lg text-xs font-bold text-white text-center transition-all hover:opacity-90" style={{ background: "#C41230" }}>👤 View Profile</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} className="w-2 h-2 rounded-full transition-colors" style={{ background: i === page ? "#C41230" : "#d1d5db" }} />
                ))}
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/kemework/find-professionals" className="text-sm font-bold" style={{ color: "#C41230" }}>
            View All Professionals →
          </Link>
        </div>
      </div>
    </div>
  );
}