import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Bookmark, SlidersHorizontal } from "lucide-react";
import { KEMEWORK_CATEGORIES } from "@/lib/kemeworkCategories";
import LocationAutocomplete from "@/components/kemework/LocationAutocomplete";

const TASKS = [
  { id: 1, title: "Full Kitchen Renovation with New Cabinets and Countertops", category: "Home Design & Remodeling", desc: "Looking for experienced contractor to renovate our 15sqm kitchen. Work includes removing old cabinets, installing new ones, new countertops, tiling floor and walls.", city: "Cairo", country: "Egypt", hoursAgo: 2, budgetMin: 2000, budgetMax: 5000, skills: ["Kitchen", "Carpentry", "Tiling", "Renovation"], bids: 7, views: 143, deadline: "Apr 15, 2026", status: "Open", biddable: true, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70" },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedroom", category: "Electrical Services", desc: "Need complete electrical rewiring for a 120sqm apartment. All rooms including kitchen and 2 bathrooms. Must be certified electrician.", city: "Dubai", country: "UAE", hoursAgo: 5, budgetMin: 800, budgetMax: 1500, skills: ["Electrical", "Wiring", "Safety"], bids: 12, views: 289, deadline: "Mar 30, 2026", status: "Open", biddable: true, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&q=70" },
  { id: 3, title: "Garden Landscaping & Irrigation System Installation", category: "Landscaping & Gardening", desc: "Design and implement a complete landscaping solution for 200sqm villa garden. Includes lawn, plants, irrigation system and outdoor lighting.", city: "Riyadh", country: "Saudi Arabia", hoursAgo: 8, budgetMin: 3000, budgetMax: 8000, skills: ["Landscaping", "Irrigation", "Lighting", "Garden Design"], bids: 4, views: 97, deadline: "May 1, 2026", status: "Open", biddable: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70" },
  { id: 4, title: "Bathroom Tiles Installation - 2 Bathrooms", category: "Flooring & Tiling", desc: "Need professional tiler to install new tiles in 2 bathrooms. Total area approximately 30sqm. Materials will be provided by client.", city: "Amman", country: "Jordan", hoursAgo: 12, budgetMin: 300, budgetMax: 600, skills: ["Tiling", "Grouting", "Waterproofing"], bids: 9, views: 201, deadline: "Apr 5, 2026", status: "Open", biddable: true, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70" },
  { id: 5, title: "AC Units Installation - 5 Split Units", category: "HVAC & Air Conditioning", desc: "Installation of 5 new split AC units in a villa. Includes all piping and electrical connections. Must be certified HVAC technician.", city: "Kuwait City", country: "Kuwait", hoursAgo: 18, budgetMin: 500, budgetMax: 1000, skills: ["HVAC", "Electrical", "Installation"], bids: 6, views: 164, deadline: "Apr 10, 2026", status: "Open", biddable: true, image: null },
  { id: 6, title: "Interior Painting - Full Villa 4 Bedrooms", category: "Painting & Decorating", desc: "Professional painting for entire villa. 4 bedrooms, living room, dining, 3 bathrooms and corridors. Total area ~350sqm.", city: "Alexandria", country: "Egypt", hoursAgo: 24, budgetMin: 1200, budgetMax: 2500, skills: ["Painting", "Finishing", "Prep Work"], bids: 15, views: 318, deadline: "Apr 20, 2026", status: "Open", biddable: true, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=200&q=70" },
];

const SORT_OPTIONS = ["Newest", "Budget ↑", "Budget ↓", "Most Bids", "Deadline"];

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

function TaskCard({ task }) {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
      {task.image && (
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img src={task.image} alt={task.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700">{task.status}</span>
          </div>
          <button onClick={() => setBookmarked(b => !b)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Bookmark size={16} className={bookmarked ? "fill-amber-500 text-amber-500" : "text-gray-400"} />
          </button>
        </div>
        <Link to={`/kemework/task/${task.id}`} className="font-black text-gray-900 text-base leading-snug hover:text-red-700 transition-colors block mb-2">{task.title}</Link>
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{task.desc}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {task.skills.map(s => <span key={s} className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{s}</span>)}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span>📍 {task.city}, {task.country}</span>
          <span>⏰ {task.hoursAgo}h ago</span>
          <span>👁 {task.views} views</span>
          <span>📬 {task.bids} bids</span>
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end justify-between min-w-[120px]">
        <div className="text-right">
          <p className="font-black text-lg" style={{ color: "#C41230" }}>${task.budgetMin.toLocaleString()}</p>
          <p className="text-xs text-gray-400">— ${task.budgetMax.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">🗓 {task.deadline}</p>
        </div>
        <Link to={`/kemework/task/${task.id}`} className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 mt-2" style={{ background: "#C41230" }}>
          View Task →
        </Link>
      </div>
    </div>
  );
}

export default function KemeworkBrowseTasks() {
  const [sort, setSort] = useState("Newest");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Open");
  const [posted, setPosted] = useState("All");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const sidebar = (
    <div>
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {KEMEWORK_CATEGORIES.map(c => (
            <label key={c.label} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-red-700" />
              <span className="text-sm text-gray-700">{c.icon} {c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <LocationAutocomplete value={location} onChange={setLocation} placeholder="Search city or area..." />
      </FilterSection>

      <FilterSection title="Budget Range ($)">
        <div className="flex gap-2">
          <input type="number" placeholder="Min" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
          <input type="number" placeholder="Max" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
        </div>
      </FilterSection>

      <FilterSection title="Status">
        <div className="flex gap-2">
          {["All", "Open", "In Progress"].map(s => (
            <button key={s} onClick={() => setStatus(s)} className="flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors" style={{ background: status === s ? "#C41230" : "#fff", color: status === s ? "#fff" : "#374151", borderColor: status === s ? "#C41230" : "#e5e7eb" }}>{s}</button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Posted">
        <div className="flex flex-col gap-2">
          {["Today", "This Week", "This Month"].map(p => (
            <label key={p} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="posted" checked={posted === p} onChange={() => setPosted(p)} className="accent-red-700" />
              <span className="text-sm text-gray-700">{p}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Biddable">
        <div className="flex gap-2">
          {["Yes", "No"].map(b => (
            <button key={b} className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-700 transition-colors">{b}</button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Skills Required" defaultOpen={false}>
        <input type="text" placeholder="Search skills..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
      </FilterSection>

      <div className="pt-4 flex flex-col gap-2">
        <button className="w-full py-2.5 rounded-xl font-bold text-white text-sm" style={{ background: "#C41230" }}>Apply Filters</button>
        <button className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">Reset</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-black text-gray-900">Browse Tasks</h1>
          <p className="text-gray-500 text-sm">Find tasks and submit your best bid</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-sm">Filter Tasks</h3>
              <SlidersHorizontal size={16} className="text-gray-400" />
            </div>
            {sidebar}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold text-gray-700">{TASKS.length} Tasks found</p>
              <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700">
                <SlidersHorizontal size={13} /> Filters
              </button>
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none">
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-4">
            {TASKS.map(t => <TaskCard key={t.id} task={t} />)}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            {[1, 2, 3, 4, 5].map(pg => (
              <button key={pg} className="w-9 h-9 rounded-lg text-sm font-bold transition-colors border border-gray-200 text-gray-600 hover:bg-gray-50" style={pg === 1 ? { background: "#C41230", color: "#fff", border: "none" } : {}}>{pg}</button>
            ))}
          </div>
        </div>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Filter Tasks</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-gray-400 text-lg">✕</button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}