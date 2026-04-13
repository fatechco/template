import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Grid3X3, List, X } from "lucide-react";
import { KEMEWORK_CATEGORIES } from "@/lib/kemeworkCategories";
import LocationAutocomplete from "@/components/kemework/LocationAutocomplete";

const PROS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Designer", city: "Cairo", country: "Egypt", rating: 4.9, reviews: 127, tasks: 84, from: 50, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=70", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", skills: ["Interior Design", "3D Rendering", "Furniture"], available: true, experience: 8, lang: ["Arabic", "English"] },
  { id: 2, name: "Sara Mohamed", category: "Electrical Engineer", city: "Dubai", country: "UAE", rating: 4.8, reviews: 89, tasks: 62, from: 35, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", skills: ["Electrical", "Wiring", "Safety"], available: true, experience: 5, lang: ["Arabic", "English"] },
  { id: 3, name: "Omar Khalid", category: "Plumber", city: "Riyadh", country: "Saudi Arabia", rating: 4.7, reviews: 203, tasks: 145, from: 25, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=70", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70", skills: ["Plumbing", "Pipe Fitting", "Maintenance"], available: false, experience: 12, lang: ["Arabic"] },
  { id: 4, name: "Layla Nour", category: "Landscape Designer", city: "Amman", country: "Jordan", rating: 4.9, reviews: 64, tasks: 41, from: 80, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd58w=400&q=70", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70", skills: ["Landscaping", "Garden Design", "Irrigation"], available: true, experience: 6, lang: ["Arabic", "English", "French"] },
  { id: 5, name: "Kareem Saad", category: "Carpenter", city: "Alexandria", country: "Egypt", rating: 4.6, reviews: 156, tasks: 112, from: 30, verified: false, accredited: false, cover: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=70", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70", skills: ["Carpentry", "Woodwork", "Furniture"], available: true, experience: 9, lang: ["Arabic"] },
  { id: 6, name: "Nadia Ali", category: "Interior Designer", city: "Kuwait City", country: "Kuwait", rating: 5.0, reviews: 42, tasks: 30, from: 120, verified: true, accredited: true, cover: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=70", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=70", skills: ["Interior Design", "Color Theory", "Space Planning"], available: true, experience: 15, lang: ["Arabic", "English"] },
  { id: 7, name: "Youssef Reda", category: "HVAC Technician", city: "Dubai", country: "UAE", rating: 4.5, reviews: 78, tasks: 55, from: 40, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=70", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70", skills: ["AC Installation", "HVAC", "Maintenance"], available: false, experience: 7, lang: ["Arabic", "English"] },
  { id: 8, name: "Rania Hassan", category: "Painting Specialist", city: "Cairo", country: "Egypt", rating: 4.8, reviews: 91, tasks: 73, from: 20, verified: true, accredited: false, cover: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=70", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=70", skills: ["Painting", "Decorating", "Finishing"], available: true, experience: 4, lang: ["Arabic", "French"] },
];

const SORT_OPTIONS = ["Relevance", "Rating", "Price ↑", "Price ↓"];



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
        <p className="text-xs text-gray-400 mb-0.5">⭐ {pro.rating} ({pro.reviews}) · {pro.tasks} tasks</p>
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
        {pro.available && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-black text-gray-900 text-sm">{pro.name}</p>
          {pro.accredited && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FFF8E1", color: "#B8860B" }}>🏅</span>}
          {pro.verified && <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✅</span>}
        </div>
        <p className="text-xs text-gray-500">{pro.category} · {pro.city}</p>
        <p className="text-xs text-gray-400 mt-0.5">⭐ {pro.rating} ({pro.reviews}) · {pro.tasks} tasks</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-black text-sm mb-2" style={{ color: "#C41230" }}>From ${pro.from}/hr</p>
        <Link to={`/kemework/profile/${pro.id}`} className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all" style={{ borderColor: "#C41230", color: "#C41230" }}>View →</Link>
      </div>
    </div>
  );
}

export default function KemeworkMobileFindProfessionals() {
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("Relevance");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showAreaSheet, setShowAreaSheet] = useState(false);
  const [filterAccredited, setFilterAccredited] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);

  const filteredPros = PROS.filter(pro => {
    const categoryMatch = !selectedCategory || pro.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const areaMatch = !selectedArea || pro.city === selectedArea;
    const accreditedMatch = !filterAccredited || pro.accredited;
    const verifiedMatch = !filterVerified || pro.verified;
    const availableMatch = !filterAvailable || pro.available;
    return categoryMatch && areaMatch && accreditedMatch && verifiedMatch && availableMatch;
  });
  
  const pros = filteredPros;

  return (
    <div className="min-h-full bg-gray-50 pb-6">
      {/* Header with back icon */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Find Professionals</h1>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setShowCategorySheet(true)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedCategory ? "bg-orange-600 text-white border-orange-600" : "border-gray-300 text-gray-700 bg-white"}`}>
            {selectedCategory || "Category"}
          </button>
          <button onClick={() => setShowAreaSheet(true)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selectedArea ? "bg-orange-600 text-white border-orange-600" : "border-gray-300 text-gray-700 bg-white"}`}>
            {selectedArea || "📍 Area"}
          </button>
          <button onClick={() => { setFilterAccredited(!filterAccredited); setFilterVerified(false); setFilterAvailable(false); }} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1 ${filterAccredited || filterVerified || filterAvailable ? "bg-orange-600 text-white border-orange-600" : "border-gray-300 text-gray-700 bg-white"}`}>
            Type {filterAccredited || filterVerified || filterAvailable ? "✓" : ""}
          </button>
          {(selectedCategory || selectedArea || filterAccredited || filterVerified || filterAvailable) && (
            <button onClick={() => { setSelectedCategory(""); setSelectedArea(""); setFilterAccredited(false); setFilterVerified(false); setFilterAvailable(false); }} className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
              Clear
            </button>
          )}
        </div>

        {/* Top bar with sort and view toggle */}
        <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-gray-700">{pros.length} found</p>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none bg-white">
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setView("grid")} className={`px-2 py-1 ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-500"}`}><Grid3X3 size={14} /></button>
              <button onClick={() => setView("list")} className={`px-2 py-1 ${view === "list" ? "bg-gray-900 text-white" : "text-gray-500"}`}><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* Results */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pros.map(p => <ProCardGrid key={p.id} pro={p} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pros.map(p => <ProCardList key={p.id} pro={p} />)}
          </div>
        )}

      {/* Category Sheet */}
      {showCategorySheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCategorySheet(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[75vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Select Category</h3>
              <button onClick={() => setShowCategorySheet(false)} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={() => { setSelectedCategory(""); setShowCategorySheet(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${!selectedCategory ? "bg-orange-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
                All Categories
              </button>
              {KEMEWORK_CATEGORIES.map(cat => (
                <button key={cat.label} onClick={() => { setSelectedCategory(cat.label); setShowCategorySheet(false); }} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${selectedCategory === cat.label ? "bg-orange-600 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Area Sheet */}
      {showAreaSheet && (
        <div className="fixed inset-0 z-50 flex items-start pt-20">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAreaSheet(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh]">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-black text-gray-900 text-lg">Search Area</h2>
                <p className="text-xs text-gray-500 mt-1">Find professionals by location</p>
              </div>
              <button onClick={() => setShowAreaSheet(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">📍 Location</label>
                <LocationAutocomplete
                  value={selectedArea}
                  onChange={v => { setSelectedArea(v); if (v) setShowAreaSheet(false); }}
                  placeholder="Type city, district, or area name..."
                />
              </div>
              {selectedArea && (
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                  <span className="text-xs text-blue-600 font-semibold flex-1">Selected: {selectedArea}</span>
                  <button onClick={() => { setSelectedArea(""); }} className="text-blue-600 font-bold text-sm hover:text-blue-700">✕ Clear</button>
                </div>
              )}
              <p className="text-xs text-gray-500 leading-relaxed">💡 Start typing to see available cities, districts, and areas from our database. Results will auto-close when you select a location.</p>
            </div>
          </div>
        </div>
      )}

      {/* Professional Type Sheet */}
      {filterAccredited || filterVerified || filterAvailable ? (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setFilterAccredited(false); setFilterVerified(false); setFilterAvailable(false); }} />
          <div className="relative bg-white rounded-t-3xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Professional Type</h3>
              <button onClick={() => { setFilterAccredited(false); setFilterVerified(false); setFilterAvailable(false); }} className="text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-wrap gap-4 justify-center">
              <button onClick={() => { setFilterAccredited(!filterAccredited); }} className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${filterAccredited ? "opacity-100" : "opacity-60"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${filterAccredited ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {filterAccredited && <span className="text-sm font-bold">✓</span>}
                  <span className="text-xl">🏅</span>
                </div>
                <span className="text-xs font-bold text-gray-700 text-center">Kemedar<br/>Accredited</span>
              </button>
              <button onClick={() => { setFilterVerified(!filterVerified); }} className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${filterVerified ? "opacity-100" : "opacity-60"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${filterVerified ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {filterVerified && <span className="text-sm font-bold">✓</span>}
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-xs font-bold text-gray-700 text-center">Verified</span>
              </button>
              <button onClick={() => { setFilterAvailable(!filterAvailable); }} className={`flex flex-col items-center gap-2 cursor-pointer transition-all ${filterAvailable ? "opacity-100" : "opacity-60"}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${filterAvailable ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {filterAvailable && <span className="text-sm font-bold">✓</span>}
                  <span className="text-xl">🟢</span>
                </div>
                <span className="text-xs font-bold text-gray-700 text-center">Available<br/>Now</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}