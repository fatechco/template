import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Check, Copy, Star, Share2, MessageCircle, Phone } from "lucide-react";

const PRO = {
  id: 1, username: "ahmed-hassan",
  name: "Ahmed Hassan", city: "Cairo", country: "Egypt", flag: "🇪🇬",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  bio: `I'm a passionate Interior Designer with over 8 years of experience transforming residential and commercial spaces across Egypt and the broader MENA region.

My design philosophy centers on creating spaces that are not just beautiful, but deeply functional and reflective of each client's unique personality. I believe that great design should enhance daily life, not complicate it.

My expertise spans full home renovations, kitchen and bathroom redesigns, commercial fit-outs, and furniture selection. I work with a curated team of craftsmen and suppliers to deliver projects on time and within budget.

Notable projects include luxury villa interiors in New Cairo, modern apartment refits in Dubai, and boutique hotel lobbies in Sharm El-Sheikh.`,
  rating: 4.9, totalReviews: 127, tasksCompleted: 84,
  responseTime: "< 2 hours", memberSince: "Jan 2022",
  verified: true, accredited: true, emailVerified: true, identityVerified: true,
  available: true,
  skills: ["Interior Design", "3D Visualization", "Space Planning", "Color Theory", "Furniture Selection", "Lighting Design", "AutoCAD", "SketchUp", "Project Management", "Kitchen Design", "Bathroom Design", "Commercial Interiors"],
  categories: ["Interior Design", "Home Remodeling", "Architecture"],
  languages: ["Arabic", "English", "French"],
  hourlyRate: 50,
  portfolio: [
    { id: 1, title: "Modern Villa - New Cairo", date: "Mar 2025", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70" },
    { id: 2, title: "Luxury Apartment Redesign", date: "Jan 2025", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=70" },
    { id: 3, title: "Open Kitchen Concept", date: "Nov 2024", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70" },
    { id: 4, title: "Minimalist Bedroom Suite", date: "Oct 2024", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&q=70" },
    { id: 5, title: "Boutique Hotel Lobby", date: "Aug 2024", image: "https://images.unsplash.com/photo-1584738766473-61c083514bf4?w=400&q=70" },
    { id: 6, title: "Home Office Design", date: "Jun 2024", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70" },
  ],
  services: [
    { id: 1, title: "Full Home Interior Design Package", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=300&q=70", from: 500 },
    { id: 2, title: "3D Room Visualization", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&q=70", from: 150 },
    { id: 3, title: "Kitchen Design & Renovation", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=70", from: 300 },
  ],
  reviews: [
    { id: 1, user: "Fatima Al-Zahra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70", rating: 5, date: "Feb 2025", comment: "Ahmed transformed my apartment beyond my expectations. Professional, creative, and attentive to every detail." },
    { id: 2, user: "Khalid Al-Mansoori", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 5, date: "Jan 2025", comment: "Stunning design for our villa. He understood our vision immediately and delivered on time." },
    { id: 3, user: "Nora Hassan", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70", rating: 4, date: "Dec 2024", comment: "Great service overall. Minor delays but excellent final result." },
  ],
};

function ShareRow({ label = "Share Profile:" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {["📧", "f", "🐦", "in", "💬"].map((icon, i) => (
          <button key={i} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 transition-colors">{icon}</button>
        ))}
        <button onClick={copy} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} className="text-gray-600" />}
        </button>
      </div>
    </div>
  );
}

const SKILL_COLORS = ["bg-red-50 text-red-700", "bg-blue-50 text-blue-700", "bg-green-50 text-green-700", "bg-purple-50 text-purple-700", "bg-orange-50 text-orange-700", "bg-teal-50 text-teal-700"];

export default function KemeworkFreelancerProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const pro = PRO;
  const [followed, setFollowed] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Cover + Profile Header */}
      <div className="relative" style={{ height: 200, background: "#e5e7eb" }}>
        <img src={pro.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        {/* Avatar floats at cover edge */}
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end gap-5 mb-4">
            <div className="relative flex-shrink-0">
              <img src={pro.avatar} alt={pro.name} className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg" />
              {pro.available && <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />}
            </div>
          </div>
          {/* Name + badges below cover — like agency page */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-3xl font-black text-gray-900">{pro.name}</h1>
                {pro.accredited && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅 ACCREDITED</span>}
                {pro.verified && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">✅ VERIFIED</span>}
              </div>
              <p className="text-sm text-gray-500 mb-0.5">{pro.categories.join(" · ")}</p>
              <p className="text-sm text-gray-500">📍 {pro.city}, {pro.country} · ⭐ {pro.rating} ({pro.totalReviews} reviews)</p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <button onClick={() => navigate("/kemework/post-task")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "#C41230" }}>💼 Hire Me</button>
              <button onClick={() => navigate("/m/dashboard/messages")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400">💬 Message</button>
              <button onClick={() => setShowShareMenu(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400"><Share2 size={14} /> Share</button>
              <button onClick={() => setFollowed(f => !f)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${followed ? "border-red-600 text-red-600" : "border-gray-300 text-gray-700"}`}>
                {followed ? "✓ Following" : "＋ Follow"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {[
            { label: "Tasks Completed", value: pro.tasksCompleted },
            { label: "Reviews", value: pro.totalReviews },
            { label: "Response Time", value: pro.responseTime },
            { label: "Member Since", value: pro.memberSince },
          ].map(s => (
            <div key={s.label} className="text-center py-4">
              <p className="font-black text-gray-900 text-lg">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Bio */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-3">About Me</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{pro.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                {pro.languages.map(l => <span key={l} className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">🌐 {l}</span>)}
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">⏱ {pro.responseTime}</span>
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">💰 From ${pro.hourlyRate}/hr</span>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Portfolio ({pro.portfolio.length} items)</h2>
              <div className="grid grid-cols-3 gap-3">
                {pro.portfolio.map(item => (
                  <div key={item.id} className="relative rounded-xl overflow-hidden group cursor-pointer" style={{ height: 120 }}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                      <p className="text-white text-xs font-bold line-clamp-2">{item.title}</p>
                      <p className="text-white/70 text-[10px] mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm font-bold" style={{ color: "#C41230" }}>View All Portfolio →</button>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Services I Offer</h2>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                {pro.services.map(s => (
                  <Link key={s.id} to={`/kemework/service/${s.id}`} className="flex-shrink-0 w-52 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow block">
                    <img src={s.image} alt={s.title} className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <p className="font-bold text-gray-900 text-xs line-clamp-2 mb-2">{s.title}</p>
                      <p className="font-black text-sm" style={{ color: "#C41230" }}>From ${s.from}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-gray-900 text-base mb-4">Client Reviews ({pro.totalReviews})</h2>
              <div className="flex items-center gap-4 mb-5">
                <div className="text-center">
                  <p className="text-4xl font-black text-yellow-500">{pro.rating}</p>
                  <div className="flex gap-0.5 justify-center">
                    {[1, 2, 3, 4, 5].map(n => <Star key={n} size={12} className={n <= Math.round(pro.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  {[5, 4, 3].map(r => (
                    <div key={r} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{r}★</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full"><div className="h-full rounded-full bg-yellow-400" style={{ width: `${r === 5 ? 76 : r === 4 ? 16 : 8}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {pro.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{r.user}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(n => <Star key={n} size={11} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                          <span className="text-xs text-gray-400">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {pro.skills.map((s, i) => (
                  <span key={s} className={`text-xs font-bold px-3 py-1.5 rounded-full ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{s}</span>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {pro.categories.map(c => (
                  <span key={c} className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">{c}</span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-2">Availability</h3>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${pro.available ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm font-semibold text-gray-700">{pro.available ? "Available for new tasks" : "Currently unavailable"}</span>
              </div>
            </div>

            {/* Verifications */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-sm mb-3">Verifications</h3>
              <div className="flex flex-col gap-2">
                {pro.identityVerified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600">✅</span> Identity Verified</div>}
                {pro.emailVerified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600">✅</span> Email Verified</div>}
                {pro.accredited && <div className="flex items-center gap-2 text-sm text-gray-700"><span>🏅</span> Kemedar Accredited</div>}
              </div>
            </div>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 w-96">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Share Profile</h3>
                    <button onClick={() => setShowShareMenu(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                  <ShareRow label="Share with:" />
                </div>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}