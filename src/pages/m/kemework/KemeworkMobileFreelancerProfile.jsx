import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const PRO = {
  name: "Ahmed Hassan", cat: "Interior Designer", city: "Cairo", country: "Egypt",
  rating: 4.9, reviewCount: 127, tasks: 84, since: "2019", responseTime: "< 1hr",
  accredited: true, verified: true, available: true,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70",
  cover: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=70",
  bio: "Interior designer with 8+ years of experience transforming homes across Egypt and UAE. Specialized in modern minimalist and contemporary styles. I work closely with clients to bring their vision to life within budget.",
  skills: ["Interior Design", "3D Rendering", "Space Planning", "AutoCAD", "Furniture Selection", "Color Theory"],
  services: [
    { title: "Full Home Interior Design Package", from: 500, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=200&q=70" },
    { title: "Room Design Consultation", from: 120, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=70" },
  ],
  portfolio: [
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=200&q=70",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=70",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=70",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=200&q=70",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=200&q=70",
  ],
  reviewList: [
    { name: "Mona H.", rating: 5, text: "Ahmed transformed our apartment beyond expectations. Professional and creative.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=70" },
    { name: "Khaled R.", rating: 5, text: "Excellent work, detail-oriented and on time. Would hire again!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=70" },
    { name: "Sara T.", rating: 4, text: "Great space solutions, very responsive communication.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=70" },
  ],
};

const CONTENT_TABS = ["About", "Services", "Portfolio", "Reviews"];

export default function KemeworkMobileFreelancerProfile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [tab, setTab] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 280);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5"><ChevronLeft size={22} className="text-gray-700" /></button>
        <p className="font-black text-gray-900 text-sm">Profile</p>
        <button className="p-1.5"><Share2 size={18} className="text-gray-500" /></button>
      </div>

      {/* Cover */}
      <div className="h-24 bg-gray-200 overflow-hidden" ref={headerRef}>
        <img src={PRO.cover} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-10 pb-4 bg-white border-b border-gray-100 px-4">
        <div className="relative mb-2">
          <img src={PRO.avatar} alt={PRO.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
          {PRO.available && <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
        </div>
        {PRO.accredited && (
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full mb-2" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅 Kemedar Accredited</span>
        )}
        <p className="font-black text-gray-900 text-xl">{PRO.name}</p>
        <p className="text-gray-500 text-sm mt-0.5">{PRO.cat}</p>
        <p className="text-xs text-gray-400 mt-0.5">⭐ {PRO.rating} ({PRO.reviewCount} reviews) · 📍 {PRO.city}</p>
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 w-full">
          <button onClick={() => navigate("/m/kemework/post-task")} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "#C41230" }}>💼 Hire Me</button>
          <button onClick={() => navigate("/m/dashboard/messages")} className="flex-1 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700">💬 Message</button>
          <button className="px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700">➕</button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {[
            { label: "Tasks", value: PRO.tasks },
              { label: "Reviews", value: PRO.reviewCount },
              { label: "Response", value: PRO.responseTime },
            { label: "Since", value: PRO.since },
          ].map((s, i) => (
            <div key={s.label} className={`flex-shrink-0 text-center px-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
              <p className="font-black text-gray-900 text-base">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-1">
          {CONTENT_TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ background: tab === i ? "#C41230" : "transparent", color: tab === i ? "#fff" : "#6b7280" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* About */}
        {tab === 0 && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-black text-gray-900 text-sm mb-2">Bio</p>
              <p className="text-sm text-gray-600 leading-relaxed">{PRO.bio}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-black text-gray-900 text-sm mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {PRO.skills.map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-black text-gray-900 text-sm mb-3">Verifications</p>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "✅", label: "Identity Verified", ok: PRO.verified },
                  { icon: "🏅", label: "Kemedar Accredited", ok: PRO.accredited },
                  { icon: "📧", label: "Email Verified", ok: true },
                ].map(v => (
                  <div key={v.label} className="flex items-center gap-2 text-sm">
                    <span>{v.icon}</span>
                    <span className={v.ok ? "text-gray-700 font-semibold" : "text-gray-300"}>{v.label}</span>
                    {v.ok && <span className="ml-auto text-green-500 text-xs font-bold">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services */}
        {tab === 1 && (
          <div className="flex flex-col gap-3">
            {PRO.services.map(s => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                <div className="w-24 h-20 flex-shrink-0 bg-gray-100">
                  <img src={s.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex-1">
                  <p className="text-xs font-black text-gray-900 line-clamp-2 mb-1">{s.title}</p>
                  <p className="text-sm font-black" style={{ color: "#C41230" }}>From ${s.from}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio */}
        {tab === 2 && (
          <div className="grid grid-cols-3 gap-1.5">
            {PRO.portfolio.map((img, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === 3 && (
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <p className="text-4xl font-black" style={{ color: "#C41230" }}>{PRO.rating}</p>
              <div>
                <p className="text-amber-400 text-lg">{"★".repeat(Math.round(PRO.rating))}</p>
                <p className="text-xs text-gray-400">{PRO.reviewCount} reviews</p>
              </div>
            </div>
            {PRO.reviewList.map(r => (
              <div key={r.name} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="ml-auto text-amber-400 text-xs">{"★".repeat(r.rating)}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky bottom hire button */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <div className="flex gap-2">
            <button onClick={() => navigate("/m/dashboard/messages")} className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-700">💬 Message</button>
            <button onClick={() => navigate("/m/kemework/post-task")} className="flex-1 py-3 rounded-2xl font-bold text-white text-sm" style={{ background: "#C41230" }}>💼 Hire {PRO.name.split(" ")[0]}</button>
          </div>
        </div>
      )}
      <MobileBottomNav />
    </div>
  );
}