import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

const MOCK = {
  id: "1",
  title: "Looking for 3-bed apartment in New Cairo",
  status: "Active",
  postedAgo: "2h",
  anonymous: false,
  buyerName: "Ahmed K.",
  avatar: "https://i.pravatar.cc/150?img=20",
  categories: ["Apartment", "Duplex"],
  purpose: "For Sale",
  locations: ["New Cairo", "5th Settlement", "Rehab City"],
  budgetMin: 800000,
  budgetMax: 1500000,
  beds: 3,
  baths: 2,
  area: 180,
  furnished: "Semi-Furnished",
  floor: "3rd floor or above",
  finishing: "Super Lux",
  amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Elevator", "Garden View", "Children's Area"],
  description: "Looking for a spacious 3-bedroom apartment in New Cairo or 5th Settlement area. Prefer a modern building with good security. Ready to move in unit is preferred but off-plan considered if developer is reputable. Budget is flexible for the right property.",
};

const AMENITY_ICONS = { "Swimming Pool": "🏊", "Gym": "🏋️", "Parking": "🅿️", "Security": "🔐", "Elevator": "🛗", "Garden View": "🌿", "Children's Area": "🎠" };

function PropertySelectorSheet({ open, onClose }) {
  const MOCK_MY_PROPS = [
    { id: "1", title: "3-Bed Apartment, New Cairo", price: "EGP 1.2M", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=80" },
    { id: "2", title: "Luxury Penthouse, Zamalek", price: "EGP 4.5M", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=80" },
    { id: "3", title: "Modern Studio, Downtown", price: "EGP 650K", image: "https://images.unsplash.com/photo-1513694203232-719a280e0f73?w=200&q=80" },
  ];
  const [selected, setSelected] = useState(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl" style={{ maxHeight: "75vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3" />
        <p className="font-black text-gray-900 text-base px-5 py-4 border-b border-gray-100">Select a Property to Match</p>
        <div className="overflow-y-auto px-5 py-3 space-y-3" style={{ maxHeight: "50vh" }}>
          {MOCK_MY_PROPS.map(prop => (
            <button key={prop.id} onClick={() => setSelected(prop.id)}
              className={`w-full flex gap-3 items-center p-3 rounded-2xl border-2 transition-colors ${selected === prop.id ? "border-orange-600 bg-orange-50" : "border-gray-100"}`}>
              <img src={prop.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">{prop.title}</p>
                <p className="text-orange-600 text-xs font-black mt-0.5">{prop.price}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={!selected}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm disabled:opacity-40">
            Send Match Request →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const req = MOCK;

  const fmt = n => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : `${(n / 1000).toFixed(0)}K`;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white flex items-center px-4 gap-3" style={{ height: 52, boxShadow: "0 1px 0 #E5E7EB" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={22} className="text-gray-900" /></button>
        <span className="flex-1 text-center font-black text-gray-900 text-base">Buy Request</span>
        <button className="p-1"><Share2 size={20} className="text-gray-700" /></button>
      </div>

      {/* Header card */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <img src={req.avatar} className="w-12 h-12 rounded-full object-cover" alt={req.buyerName} />
          <div className="flex-1">
            <p className="font-black text-gray-900 text-base">{req.buyerName}</p>
            <p className="text-xs text-gray-400">Posted {req.postedAgo} ago</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">● Active</span>
        </div>
        <p className="font-bold text-gray-800 text-[15px] leading-snug mt-3">{req.title}</p>
      </div>

      {/* Details */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-3">Request Details</p>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="text-xs text-gray-400 w-24 flex-shrink-0 pt-0.5">Categories</span>
            <div className="flex flex-wrap gap-1">
              {req.categories.map(c => <span key={c} className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{c}</span>)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-24 flex-shrink-0">Purpose</span>
            <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{req.purpose}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs text-gray-400 w-24 flex-shrink-0 pt-0.5">Location</span>
            <div className="flex flex-wrap gap-1">
              {req.locations.map(l => <span key={l} className="text-xs text-gray-700 font-semibold">📍 {l}</span>)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-24 flex-shrink-0">Budget</span>
            <span className="font-black text-orange-600 text-base">EGP {fmt(req.budgetMin)} – {fmt(req.budgetMax)}</span>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-3" />
        <p className="font-black text-gray-900 text-sm mb-2.5">Specifications</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Bedrooms", value: req.beds ? `${req.beds} beds` : "Any" },
            { label: "Bathrooms", value: req.baths ? `${req.baths} baths` : "Any" },
            { label: "Area", value: req.area ? `${req.area}+ sqm` : "Any" },
            { label: "Furnished", value: req.furnished },
            { label: "Floor", value: req.floor },
            { label: "Finishing", value: req.finishing },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400">{s.label}</p>
              <p className="text-xs font-bold text-gray-800 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-3">Desired Amenities</p>
        <div className="grid grid-cols-2 gap-2">
          {req.amenities.map(a => (
            <div key={a} className="flex items-center gap-2">
              <span className="text-base">{AMENITY_ICONS[a] || "✅"}</span>
              <span className="text-xs font-semibold text-gray-700">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-2">Description</p>
        <p className="text-sm text-gray-600 leading-relaxed">{req.description}</p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3" style={{ paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}>
        <button onClick={() => setSelectorOpen(true)} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm">
          Match One of My Properties →
        </button>
      </div>

      <PropertySelectorSheet open={selectorOpen} onClose={() => setSelectorOpen(false)} />
    </div>
  );
}