import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Grid3X3, List, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  { name: "Interior Design", count: 628 },
  { name: "Electrical Services", count: 934 },
  { name: "Plumbing Services", count: 756 },
  { name: "Painting & Decorating", count: 688 },
  { name: "Carpentry & Woodwork", count: 445 },
  { name: "Landscaping", count: 391 },
  { name: "HVAC & AC", count: 823 },
  { name: "Cleaning Services", count: 1102 },
];

const COUNTRIES = ["Egypt", "UAE", "Saudi Arabia", "Jordan", "Kuwait", "Qatar"];
const CITIES = {
  Egypt: ["Cairo", "Alexandria", "Giza"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Dammam"],
  Jordan: ["Amman", "Irbid", "Zarqa"],
  Kuwait: ["Kuwait City"],
  Qatar: ["Doha"],
};

const PROS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Designer", city: "Cairo", country: "Egypt", rating: 4.9, reviews: 127, tasks: 84, from: 50, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=70", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", skills: ["Interior Design", "3D Rendering", "Furniture"], available: true, experience: 8, lang: ["Arabic", "English"] },
  { id: 2, name: "Sara Mohamed", category: "Electrical Engineer", city: "Dubai", country: "UAE", rating: 4.8, reviews: 89, tasks: 62, from: 35, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", skills: ["Electrical", "Wiring", "Safety"], available: true, experience: 5, lang: ["Arabic", "English"] },
  { id: 3, name: "Omar Khalid", category: "Plumber", city: "Riyadh", country: "Saudi Arabia", rating: 4.7, reviews: 203, tasks: 145, from: 25, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=70", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70", skills: ["Plumbing", "Pipe Fitting", "Maintenance"], available: false, experience: 12, lang: ["Arabic"] },
  { id: 4, name: "Layla Nour", category: "Landscape Designer", city: "Amman", country: "Jordan", rating: 4.9, reviews: 64, tasks: 41, from: 80, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70", skills: ["Landscaping", "Garden Design", "Irrigation"], available: true, experience: 6, lang: ["Arabic", "English", "French"] },
  { id: 5, name: "Kareem Saad", category: "Carpenter", city: "Alexandria", country: "Egypt", rating: 4.6, reviews: 156, tasks: 112, from: 30, verified: false, accredited: false, cover: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=70", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70", skills: ["Carpentry", "Woodwork", "Furniture"], available: true, experience: 9, lang: ["Arabic"] },
  { id: 6, name: "Nadia Ali", category: "Interior Designer", city: "Kuwait City", country: "Kuwait", rating: 5.0, reviews: 42, tasks: 30, from: 120, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=70", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=70", skills: ["Interior Design", "Color Theory", "Space Planning"], available: true, experience: 15, lang: ["Arabic", "English"] },
  { id: 7, name: "Youssef Reda", category: "HVAC Technician", city: "Dubai", country: "UAE", rating: 4.5, reviews: 78, tasks: 55, from: 40, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=70", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70", skills: ["AC Installation", "HVAC", "Maintenance"], available: false, experience: 7, lang: ["Arabic", "English"] },
  { id: 8, name: "Rania Hassan", category: "Painting Specialist", city: "Cairo", country: "Egypt", rating: 4.8, reviews: 91, tasks: 73, from: 20, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=70", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=70", skills: ["Painting", "Decorating", "Finishing"], available: true, experience: 4, lang: ["Arabic", "French"] },
  { id: 9, name: "Tariq Al-Farsi", category: "General Contractor", city: "Doha", country: "Qatar", rating: 4.7, reviews: 134, tasks: 98, from: 60, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=70", skills: ["Construction", "Project Management", "Renovation"], available: true, experience: 20, lang: ["Arabic", "English"] },
];

const SORT_OPTIONS = ["Relevance", "Rating", "Price ↑", "Price ↓", "Newest", "Most Reviews"];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left">
        <span className="font-bold text-gray-900 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function ProCardGrid({ pro }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative h-16 bg-gray-200">
        <img src={pro.cover} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative flex justify-center -mt-7 mb-1">
        <div className="relative">
          <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-full border-4 border-white object-cover shadow" />
          {pro.available && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
        </div>
      </div>
      <div className="flex justify-center gap-1 mb-1">
        {pro.accredited && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅 Accredited</span>}
        {pro.verified && <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Verified</span>}
      </div>
      <div className="px-4 pb-4 text-center flex flex-col flex-1">
        <p className="font-black text-gray-900 text-sm">{pro.name}</p>
        <p className="text-gray-500 text-xs mb-1">{pro.category}</p>
        <p className="text-xs text-gray-400 mb-0.5">⭐ {pro.rating} ({pro.reviews} reviews) · {pro.tasks} tasks</p>
        <p className="text-xs text-gray-400 mb-2">📍 {pro.city}, {pro.country}</p>
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {pro.skills.slice(0, 3).map(s => <span key={s} className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{s}</span>)}
        </div>
        <p className="text-sm font-black mb-3 mt-auto" style={{ color: "#C41230" }}>From ${pro.from}/hr</p>
        <div className="flex gap-2">
          <button className="flex-1 py-1.5 rounded-lg border text-xs font-bold text-gray-700 border-gray-200 hover:bg-gray-50">💬 Message</button>
          <Link to={`/kemework/profile/${pro.id}`} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-center border-2 transition-all" style={{ borderColor: "#C41230", color: "#C41230" }}>View →</Link>
        </div>
      </div>
    </div>
  );
}

function ProCardList({ pro }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
        {pro.available && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black text-gray-900 text-sm">{pro.name}</p>
          {pro.accredited && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅</span>}
          {pro.verified && <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✅</span>}
        </div>
        <p className="text-xs text-gray-500">{pro.category} · 📍 {pro.city}, {pro.country}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
          <span>⭐ {pro.rating} ({pro.reviews})</span>
          <span>{pro.tasks} tasks</span>
          <div className="flex gap-1">{pro.skills.slice(0, 2).map(s => <span key={s} className="bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{s}</span>)}</div>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-black text-sm mb-2" style={{ color: "#C41230" }}>From ${pro.from}/hr</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border text-xs font-bold text-gray-700 border-gray-200 hover:bg-gray-50">💬</button>
          <Link to={`/kemework/profile/${pro.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold border-2" style={{ borderColor: "#C41230", color: "#C41230" }}>View →</Link>
        </div>
      </div>
    </div>
  );
}

export default function KemeworkFindProfessionals() {
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("Relevance");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(500);
  const [filters, setFilters] = useState({ accredited: false, verified: false, available: false });
  const [rating, setRating] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const pros = PROS;

  const sidebar = (
    <div className="flex flex-col gap-0">
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(c => (
            <label key={c.name} className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded accent-red-700" />
                {c.name}
              </span>
              <span className="text-xs text-gray-400">{c.count}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <div className="flex flex-col gap-2">
          <select value={country} onChange={e => { setCountry(e.target.value); setCity(""); }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={city} onChange={e => setCity(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" disabled={!country}>
            <option value="">All Cities</option>
            {(CITIES[country] || []).map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        {[5, 4, 3].map(r => (
          <label key={r} className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="radio" name="rating" checked={rating === r} onChange={() => setRating(r)} className="accent-red-700" />
            <span className="text-sm text-yellow-500">{"★".repeat(r)}{"☆".repeat(5 - r)}</span>
            <span className="text-xs text-gray-500">{r === 5 ? "5 stars only" : `${r}+ stars`}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Professional Type">
        {[
          { key: "accredited", label: "🏅 Kemedar Accredited" },
          { key: "verified", label: "✅ Verified" },
          { key: "available", label: "🟢 Available Now" },
        ].map(f => (
          <label key={f.key} className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" checked={filters[f.key]} onChange={() => setFilters(p => ({ ...p, [f.key]: !p[f.key] }))} className="rounded accent-red-700" />
            <span className="text-sm text-gray-700">{f.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Hourly Rate ($/hr)">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500">${minRate}</span>
          <span className="flex-1 text-center text-xs text-gray-400">—</span>
          <span className="text-xs text-gray-500">${maxRate}</span>
        </div>
        <input type="range" min={0} max={500} value={maxRate} onChange={e => setMaxRate(+e.target.value)} className="w-full accent-red-700" />
      </FilterSection>

      <FilterSection title="Experience">
        <div className="flex flex-wrap gap-2">
          {["Any", "1-3 yrs", "3-5 yrs", "5+ yrs"].map(e => (
            <button key={e} className="px-3 py-1.5 rounded-full border text-xs font-semibold border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-700 transition-colors">{e}</button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Languages">
        {["Arabic", "English", "French", "Others"].map(lang => (
          <label key={lang} className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" className="rounded accent-red-700" />
            <span className="text-sm text-gray-700">{lang}</span>
          </label>
        ))}
      </FilterSection>

      <div className="pt-4 flex flex-col gap-2">
        <button className="w-full py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Apply Filters</button>
        <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-black text-gray-900">Find Professionals</h1>
          <p className="text-gray-500 text-sm">Discover skilled professionals for your home projects</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 text-sm">Filter Professionals</h3>
                <SlidersHorizontal size={16} className="text-gray-400" />
              </div>
              {sidebar}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-gray-700">{pros.length} Professionals found</p>
                <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700">
                  <SlidersHorizontal size={13} /> Filters
                </button>
              </div>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
                  {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setView("grid")} className={`px-2.5 py-1.5 ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}><Grid3X3 size={14} /></button>
                  <button onClick={() => setView("list")} className={`px-2.5 py-1.5 ${view === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}><List size={14} /></button>
                </div>
              </div>
            </div>

            {/* Results */}
            {view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {pros.map(p => <ProCardGrid key={p.id} pro={p} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pros.map(p => <ProCardList key={p.id} pro={p} />)}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {[1, 2, 3, 4, 5].map(pg => (
                <button key={pg} className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${pg === 1 ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`} style={pg === 1 ? { background: "#C41230" } : {}}>{pg}</button>
              ))}
              <span className="text-gray-400 text-sm">...</span>
              <button className="w-9 h-9 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">12</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Filter Professionals</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-400 text-lg">✕</button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}