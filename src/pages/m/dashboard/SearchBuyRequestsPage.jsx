import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings, X, ChevronDown, MessageCircle, Home } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const MOCK_REQUESTS = [
  { id: 1, buyerName: "Ahmed T.", buyerInitials: "AT", categories: ["Apartment", "Studio"], location: "New Cairo or Maadi", budgetMin: 150000, budgetMax: 300000, beds: 3, baths: 2, area: 120, postedAgo: "2h ago" },
  { id: 2, buyerName: "Sara M.", buyerInitials: "SM", categories: ["Villa"], location: "Sheikh Zayed", budgetMin: 500000, budgetMax: 900000, beds: 5, baths: 4, area: 350, postedAgo: "5h ago" },
  { id: 3, buyerName: "Omar K.", buyerInitials: "OK", categories: ["Penthouse", "Apartment"], location: "Heliopolis, Korba", budgetMin: 400000, budgetMax: 700000, beds: 4, baths: 3, area: 250, postedAgo: "1d ago" },
  { id: 4, buyerName: "Layla N.", buyerInitials: "LN", categories: ["Chalet"], location: "North Coast, Ain Sukhna", budgetMin: 200000, budgetMax: 500000, beds: 3, baths: 2, area: 160, postedAgo: "2d ago" },
  { id: 5, buyerName: "Kareem S.", buyerInitials: "KS", categories: ["Apartment"], location: "Maadi, Zamalek", budgetMin: 80000, budgetMax: 180000, beds: 2, baths: 1, area: 90, postedAgo: "3d ago" },
];

const FILTER_CHIPS = ["🏘 Category ▼", "📍 Location ▼", "💰 Budget ▼", "📅 Recent ▼"];
const SORT_OPTIONS = ["Newest", "Budget ↑", "Budget ↓"];

const MY_PROPERTIES = [
  { id: 1, title: "Modern Apartment in New Cairo", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=70" },
  { id: 2, title: "Studio in Maadi", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&q=70" },
];

function MatchModal({ request, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 mb-1">Match My Property</p>
        <p className="text-xs text-gray-500 mb-4">Which property matches this request?</p>
        <div className="space-y-3">
          {MY_PROPERTIES.map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img src={p.image} alt={p.title} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
              <p className="flex-1 text-sm font-bold text-gray-900 line-clamp-1">{p.title}</p>
              <button onClick={onClose} className="text-xs font-bold text-white bg-orange-600 px-3 py-1.5 rounded-lg">
                Match →
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 text-sm text-gray-500 font-bold py-2">Cancel</button>
      </div>
    </div>
  );
}

function RequestCard({ req, onMatch }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-sm font-black text-orange-600 flex-shrink-0">
          {req.buyerInitials}
        </div>
        <div className="flex-1 min-w-0">
          {/* Category chips */}
          <div className="flex gap-1.5 flex-wrap mb-1">
            {req.categories.slice(0, 3).map(c => (
              <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">{c}</span>
            ))}
          </div>
          <p className="text-[12px] text-gray-500">📍 {req.location}</p>
          <p className="text-[14px] font-black text-orange-600">
            💰 ${req.budgetMin.toLocaleString()} — ${req.budgetMax.toLocaleString()}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            🛏 {req.beds} · 🚿 {req.baths} · 📐 {req.area} sqm
          </p>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">Posted {req.postedAgo}</p>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={onMatch}
          className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
          <Home size={13} /> Match My Property
        </button>
        <button className="px-4 border border-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center gap-1.5">
          <MessageCircle size={13} /> Message
        </button>
      </div>
    </div>
  );
}

export default function SearchBuyRequestsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest");
  const [showBanner, setShowBanner] = useState(true);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [matchingRequest, setMatchingRequest] = useState(null);

  const filtered = MOCK_REQUESTS.filter(r =>
    !search || r.location.toLowerCase().includes(search.toLowerCase()) ||
    r.categories.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Search Requests" showBack
        rightAction={<button><Settings size={20} className="text-gray-700" /></button>} />

      {/* Info Banner */}
      {showBanner && (
        <div className="mx-4 mt-3 bg-orange-600 rounded-xl p-4 flex items-start justify-between">
          <div>
            <p className="text-white text-xs font-black mb-0.5">🔒 For property sellers & agents only</p>
            <p className="text-orange-100 text-[11px]">Find buyers actively looking for properties matching yours</p>
          </div>
          <button onClick={() => setShowBanner(false)} className="ml-2 flex-shrink-0">
            <X size={16} className="text-orange-200" />
          </button>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 py-2.5">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by category, location..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400" />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_CHIPS.map(chip => (
            <button key={chip}
              className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {chip}
            </button>
          ))}
        </div>

        {/* Count + Sort */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{filtered.length} active buy requests</p>
          <button onClick={() => setShowSortSheet(true)} className="flex items-center gap-1 text-[13px] font-bold text-gray-700">
            Sort <ChevronDown size={14} />
          </button>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-gray-700">No matching requests found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map(req => (
            <RequestCard key={req.id} req={req} onMatch={() => setMatchingRequest(req)} />
          ))
        )}
      </div>

      {/* Sort sheet */}
      {showSortSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSortSheet(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-black text-gray-900 mb-3">Sort By</p>
            {SORT_OPTIONS.map(opt => (
              <button key={opt} onClick={() => { setSort(opt); setShowSortSheet(false); }}
                className={`w-full text-left py-3 px-2 text-sm font-semibold border-b border-gray-100 flex items-center justify-between ${sort === opt ? "text-orange-600" : "text-gray-700"}`}>
                {opt}
                {sort === opt && <span className="text-orange-600 font-black">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {matchingRequest && <MatchModal request={matchingRequest} onClose={() => setMatchingRequest(null)} />}
    </div>
  );
}