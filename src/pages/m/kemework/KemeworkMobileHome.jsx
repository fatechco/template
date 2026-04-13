import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, ArrowRight, Plus, ChevronRight } from "lucide-react";
import HamburgerMenu from "@/components/mobile/HamburgerMenu";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const CATEGORIES = [
  { icon: "⚡", label: "Electrical" },
  { icon: "🔧", label: "Plumbing" },
  { icon: "🎨", label: "Painting" },
  { icon: "🏠", label: "Interior" },
  { icon: "🌿", label: "Garden" },
  { icon: "❄️", label: "AC" },
  { icon: "🪵", label: "Carpentry" },
  { icon: "🧹", label: "Cleaning" },
];

const PROS = [
  { name: "Ahmed Hassan", cat: "Interior Designer", rating: 4.9, reviews: 127, from: 50, verified: true, accredited: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", cover: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=300&q=70" },
  { name: "Sara Mohamed", cat: "Electrical Engineer", rating: 4.8, reviews: 89, from: 35, verified: true, accredited: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70" },
  { name: "Layla Nour", cat: "Landscape Designer", rating: 4.9, reviews: 64, from: 80, verified: true, accredited: true, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70", cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
  { name: "Youssef Reda", cat: "HVAC Technician", rating: 4.5, reviews: 78, from: 40, verified: true, accredited: false, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70", cover: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=70" },
];

const SERVICES = [
  { title: "Full Home Interior Design Package", pro: "Ahmed Hassan", rating: 4.9, reviews: 64, from: 500, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=300&q=70" },
  { title: "Electrical Wiring & Panel Installation", pro: "Sara Mohamed", rating: 4.8, reviews: 89, from: 80, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70" },
  { title: "Deep Home Cleaning Package", pro: "Nadia Ali", rating: 5.0, reviews: 203, from: 40, image: "https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=300&q=70" },
];

const TASKS = [
  { title: "Full Kitchen Renovation with New Cabinets", category: "Remodeling", budgetMin: 2000, budgetMax: 5000, bids: 7, city: "Cairo", hoursAgo: 2 },
  { title: "Apartment Electrical Rewiring - 3BR", category: "Electrical", budgetMin: 800, budgetMax: 1500, bids: 12, city: "Dubai", hoursAgo: 5 },
  { title: "Garden Landscaping & Irrigation System", category: "Landscaping", budgetMin: 3000, budgetMax: 8000, bids: 4, city: "Riyadh", hoursAgo: 8 },
];

const HOW_TRACK1 = [
  { n: 1, icon: "📋", t: "Post Your Task", d: "Describe what you need and set your budget" },
  { n: 2, icon: "📬", t: "Receive Offers", d: "Qualified professionals submit competitive bids" },
  { n: 3, icon: "✅", t: "Choose & Complete", d: "Select the best offer and get the job done" },
];
const HOW_TRACK2 = [
  { n: 1, icon: "📝", t: "Contact Kemedar", d: "Our team reviews your requirements" },
  { n: 2, icon: "👷", t: "Expert Execution", d: "Certified professionals handle the work" },
  { n: 3, icon: "🔍", t: "Supervised Delivery", d: "Engineers supervise quality at every stage" },
];

const QUICK_LINKS = [
  { label: "🔍 Find Pro", path: "/m/kemework/find-professionals" },
  { label: "📋 Post Task", path: "/m/kemework/post-task" },
  { label: "🔧 Services", path: "/m/kemework/browse-services" },
  { label: "📂 Tasks", path: "/m/kemework/tasks" },
  { label: "🏅 Accreditation", path: "/m/kemework/be-accredited" },
  { label: "📸 Snap & Fix", path: "/kemework/snap" },
];

function SectionHeader({ title, viewAllPath, navigate }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-black text-gray-900 text-base">{title}</h2>
      {viewAllPath && (
        <button onClick={() => navigate(viewAllPath)} className="text-[#C41230] text-sm font-semibold flex items-center gap-0.5">
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

export default function KemeworkMobileHome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState(1);
  const [search, setSearch] = useState("");

  const howSteps = activeTrack === 1 ? HOW_TRACK1 : HOW_TRACK2;

  return (
    <div className="min-h-full bg-gray-50 pb-28">

      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}

      {/* Hero — same pattern as MobileHomePage */}
      <div className="relative overflow-hidden" style={{ minHeight: 230 }}>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0005]/90 via-[#3d0010]/80 to-[#1a0005]/70" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#C41230] via-[#C41230]/50 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex flex-col items-center justify-center gap-1"
        >
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
        </button>

        <div className="relative z-10 px-4 pt-5 pb-6">
          <div className="inline-flex items-center gap-2 bg-[#C41230]/20 border border-[#C41230]/40 rounded-full px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 bg-[#C41230] rounded-full animate-pulse" />
            <span className="text-[#ff6b7a] text-[10px] font-bold tracking-wide">KEMEWORK® PROFESSIONALS PLATFORM</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-1">
            Find Your Perfect Pro.<br />
            <span className="text-[#ff6b7a]">Get Any Job Done.</span>
          </h1>
          <p className="text-gray-300 text-xs leading-relaxed mb-4">
            Connect with skilled professionals for any home task, renovation, or repair.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-5">
            {[{ v: "5K+", l: "Professionals" }, { v: "20+", l: "Categories" }, { v: "🏅", l: "Accredited" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-base font-black text-[#C41230]">{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search professionals, tasks..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              onKeyDown={e => e.key === "Enter" && navigate(`/m/kemework/find-professionals?q=${search}`)}
            />
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate("/m/kemework/find-professionals")}
              className="flex-1 flex items-center justify-center gap-1.5 text-white font-bold text-xs py-2.5 rounded-xl"
              style={{ background: "#C41230" }}>
              <ArrowRight size={14} /> Find Professional
            </button>
            <button onClick={() => navigate("/m/kemework/post-task")}
              className="flex-1 flex items-center justify-center gap-1.5 border-2 border-white/50 text-white font-bold text-xs py-2.5 rounded-xl">
              <Plus size={14} /> Post a Task
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pt-5">

        {/* Quick Links */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_LINKS.map(link => (
            <button key={link.path} onClick={() => navigate(link.path)}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              {link.label}
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div>
          <SectionHeader title="Browse by Category" viewAllPath="/m/kemework/find-professionals" navigate={navigate} />
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map(c => (
              <button key={c.label} onClick={() => navigate("/m/kemework/find-professionals")}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Professionals */}
        <div>
          <SectionHeader title="Top Professionals" viewAllPath="/m/kemework/find-professionals" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {PROS.map(pro => (
              <div key={pro.name} className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ width: "72vw", maxWidth: 240 }}>
                <div className="h-24 bg-gray-100">
                  <img src={pro.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex items-center gap-3">
                  <img src={pro.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white -mt-5 flex-shrink-0 shadow" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-black text-gray-900 truncate">{pro.name}</p>
                      {pro.accredited && <span className="text-xs">🏅</span>}
                    </div>
                    <p className="text-[10px] text-gray-400">{pro.cat}</p>
                  </div>
                </div>
                <div className="px-3 pb-3 flex items-center justify-between">
                  <p className="text-[10px] text-gray-500">⭐ {pro.rating} ({pro.reviews})</p>
                  <p className="text-xs font-black" style={{ color: "#C41230" }}>From ${pro.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div>
          <SectionHeader title="Popular Services" viewAllPath="/m/kemework/browse-services" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {SERVICES.map(s => (
              <div key={s.title} className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ width: "72vw", maxWidth: 240 }}>
                <div className="h-28 bg-gray-100">
                  <img src={s.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 line-clamp-2 mb-1">{s.title}</p>
                  <p className="text-[10px] text-gray-400 mb-2">By {s.pro} · ⭐ {s.rating}</p>
                  <p className="text-sm font-black" style={{ color: "#C41230" }}>From ${s.from}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="font-black text-gray-900 mb-3">How It Works</p>
          <div className="flex gap-2 mb-4">
            {[1, 2].map(t => (
              <button key={t} onClick={() => setActiveTrack(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ background: activeTrack === t ? "#C41230" : "#f3f4f6", color: activeTrack === t ? "#fff" : "#374151" }}>
                {t === 1 ? "Self-Manage" : "Kemedar Managed"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {howSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: activeTrack === 1 ? "#FEE2E2" : "#FEF3C7" }}>
                  {s.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">{s.t}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Tasks */}
        <div>
          <SectionHeader title="Latest Tasks" viewAllPath="/m/kemework/tasks" navigate={navigate} />
          <div className="flex flex-col gap-2">
            {TASKS.map(t => (
              <div key={t.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-900 line-clamp-1">{t.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">📍 {t.city} · ⏰ {t.hoursAgo}h ago · 📬 {t.bids} bids</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black" style={{ color: "#C41230" }}>${t.budgetMin.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">–${t.budgetMax.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/m/kemework/tasks")}
            className="w-full mt-3 py-3 rounded-xl font-bold text-sm border-2 text-center block"
            style={{ borderColor: "#C41230", color: "#C41230" }}>
            View All Tasks →
          </button>
        </div>

        {/* Preferred Program Banner */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)" }}>
          <div className="p-5">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 rounded-full px-3 py-1 mb-3">
              <span className="text-yellow-400 text-[10px] font-bold tracking-wide">KEMEWORK® PREFERRED PROGRAM</span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight mb-1">
              Get Accredited.<br />
              <span className="text-yellow-400">Earn More.</span>
            </h3>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Join thousands of accredited professionals earning more through Kemedar's verified network.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/m/kemework/be-accredited")}
                className="flex items-center justify-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm"
                style={{ background: "#D4A017", color: "#1a1a2e" }}>
                🏅 Get Accredited
              </button>
              <button onClick={() => navigate("/m/kemework/find-professionals")}
                className="flex items-center justify-center gap-2 border-2 border-yellow-500/40 text-yellow-400 font-bold px-5 py-2.5 rounded-xl text-sm">
                Browse Professionals <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>

      <MobileBottomNav />
    </div>
  );
}