import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, CheckCircle, Phone, MessageCircle, BedDouble, Bath, Maximize2 } from "lucide-react";

const PRO = {
  id: 1, username: "ahmed-hassan",
  name: "Ahmed Hassan", city: "Cairo", country: "Egypt",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  bio: "I'm a passionate Interior Designer with over 8 years of experience transforming residential and commercial spaces across Egypt and the broader MENA region.\n\nMy design philosophy centers on creating spaces that are not just beautiful, but deeply functional. I work with a curated team of craftsmen and suppliers to deliver projects on time and within budget.",
  rating: 4.9, totalReviews: 127, tasksCompleted: 84,
  responseTime: "< 2 hours", memberSince: "Jan 2022",
  verified: true, accredited: true, available: true,
  skills: ["Interior Design", "3D Visualization", "Space Planning", "Color Theory", "Furniture Selection", "Lighting Design", "AutoCAD", "Project Management"],
  languages: ["Arabic", "English", "French"],
  hourlyRate: 50,
  categories: ["Interior Design", "Home Remodeling", "Architecture"],
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
    { user: "Fatima Al-Zahra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70", rating: 5, date: "Feb 2025", comment: "Ahmed transformed my apartment beyond my expectations. Professional and attentive to every detail." },
    { user: "Khalid Al-Mansoori", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 5, date: "Jan 2025", comment: "Stunning design for our villa. He understood our vision immediately." },
    { user: "Nora Hassan", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70", rating: 4, date: "Dec 2024", comment: "Great service overall. Minor delays but excellent final result." },
  ],
};

const SKILL_COLORS = ["bg-red-50 text-red-700", "bg-blue-50 text-blue-700", "bg-green-50 text-green-700", "bg-purple-50 text-purple-700", "bg-orange-50 text-orange-700", "bg-teal-50 text-teal-700"];

const MOCK_LISTINGS = [
  { id: "l1", title: "Luxury Apartment New Cairo", purpose: "For Sale", price: "3,500,000 EGP", beds: 3, baths: 2, area: 185, city: "New Cairo", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: "l2", title: "Modern Studio Maadi", purpose: "For Rent", price: "85,000 EGP/yr", beds: 1, baths: 1, area: 55, city: "Maadi", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" },
];

const TABS = ["about", "portfolio", "listings", "services", "reviews"];

export default function MobileProfessionalProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const pro = PRO;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img src={pro.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="absolute top-4 right-4 flex gap-1.5">
          {pro.accredited && <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🏅 Accredited</span>}
          {pro.verified && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5"><CheckCircle size={9} /> Verified</span>}
        </div>
      </div>

      {/* Avatar + Header */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img src={pro.avatar} alt={pro.name} className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg" />
            {pro.available && <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
          </div>
          <div className="mb-1">
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${pro.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
              {pro.available ? "🟢 Available" : "🔴 Busy"}
            </span>
          </div>
        </div>
        <h1 className="font-black text-gray-900 text-xl leading-tight">{pro.name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{pro.categories.join(" · ")}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} className="text-[#FF6B00]" />{pro.city}, {pro.country}</span>
          <span className="flex items-center gap-1 text-xs text-gray-700 font-bold"><Star size={11} className="fill-yellow-400 text-yellow-400" />{pro.rating} ({pro.totalReviews})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm grid grid-cols-4 divide-x divide-gray-100 mb-4">
        {[
          { label: "Tasks", value: pro.tasksCompleted },
          { label: "Reviews", value: pro.totalReviews },
          { label: "Rate", value: `$${pro.hourlyRate}/h` },
          { label: "Response", value: "< 2h" },
        ].map(s => (
          <div key={s.label} className="text-center py-3">
            <p className="font-black text-gray-900 text-sm">{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-4 bg-white rounded-xl border border-gray-100 p-1 shadow-sm overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold capitalize ${activeTab === t ? "bg-[#FF6B00] text-white" : "text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {activeTab === "about" && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-2">About Me</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{pro.bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                {pro.languages.map(l => <span key={l} className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">🌐 {l}</span>)}
                <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">💰 From ${pro.hourlyRate}/hr</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {pro.skills.map((s, i) => <span key={s} className={`text-xs font-bold px-2.5 py-1 rounded-full ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>{s}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2">Verifications</h4>
              <div className="space-y-1.5">
                {pro.verified && <div className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-600">✅</span> Identity Verified</div>}
                {pro.accredited && <div className="flex items-center gap-2 text-sm text-gray-700"><span>🏅</span> Kemedar Accredited</div>}
              </div>
            </div>
          </>
        )}
        {activeTab === "portfolio" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-3">Portfolio ({pro.portfolio.length})</h3>
            <div className="grid grid-cols-2 gap-2">
              {pro.portfolio.map(item => (
                <div key={item.id} className="relative rounded-xl overflow-hidden" style={{ height: 110 }}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2">
                    <p className="text-white text-[10px] font-bold line-clamp-1">{item.title}</p>
                    <p className="text-white/60 text-[9px]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "services" && (
          <div className="space-y-3">
            {pro.services.map(s => (
              <Link key={s.id} to={`/kemework/service/${s.id}`} className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex gap-3 p-3">
                  <img src={s.image} alt={s.title} className="w-20 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{s.title}</p>
                    <p className="font-black text-[#FF6B00] text-sm">From ${s.from}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="text-center">
                <p className="text-3xl font-black text-yellow-500">{pro.rating}</p>
                <div className="flex gap-0.5 justify-center">
                  {[1,2,3,4,5].map(n => <Star key={n} size={11} className={n <= Math.round(pro.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
                </div>
              </div>
              <p className="text-sm text-gray-500">{pro.totalReviews} reviews</p>
            </div>
            <div className="space-y-4">
              {pro.reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-sm text-gray-900">{r.user}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={10} className={n <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}</div>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm">
          <MessageCircle size={16} /> Message
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold py-3 rounded-xl text-sm">
          💼 Hire Me
        </button>
      </div>
    </div>
  );
}