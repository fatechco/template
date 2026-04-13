import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Download, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_PROJECT = {
  slug: "marassi-north-coast",
  name: "Marassi North Coast",
  developer: "Emaar Misr",
  developerLogo: "https://ui-avatars.com/api/?name=EM&background=FF6B00&color=fff&size=80",
  developerProjects: 8,
  developerUsername: "developer-1",
  city: "North Coast",
  area: "Sidi Abd El Rahman",
  status: "Under Construction",
  delivery: "2026",
  images: [
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    "https://images.unsplash.com/photo-1582407947304-d0b8a61e3a41?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  ],
  totalUnits: 3500,
  totalArea: 6000000,
  builtArea: 2100000,
  greenArea: 900000,
  priceFrom: "EGP 4,500,000",
  priceTo: "EGP 32,000,000",
  unitTypes: ["Apartment", "Villa", "Chalet", "Penthouse", "Shop"],
  description: "Marassi is a world-class integrated resort community on Egypt's stunning North Coast. Spread over 6.5 million sqm of pristine Mediterranean coastline, Marassi features five distinctive villages each with its own character and personality.\n\nResidents enjoy access to a Marina, a championship golf course, five-star hotels, retail centres, and a vibrant beach club. With 6.5km of beachfront, it's the ultimate Mediterranean lifestyle destination.",
  amenities: [
    { icon: "🏊", label: "Pool" }, { icon: "🏋", label: "Gym" }, { icon: "🏌", label: "Golf" },
    { icon: "🌿", label: "Garden" }, { icon: "🛍", label: "Mall" }, { icon: "🎾", label: "Tennis" },
    { icon: "⛵", label: "Marina" }, { icon: "🏖", label: "Beach" }, { icon: "🏥", label: "Clinic" },
    { icon: "🏫", label: "School" }, { icon: "🅿", label: "Parking" }, { icon: "🔒", label: "Security" },
  ],
  mapEmbed: "https://maps.google.com/maps?q=Marassi+North+Coast&output=embed",
  units: [
    { type: "Studio", area: "55 sqm", price: "EGP 4.5M", available: true },
    { type: "1 Bedroom", area: "85 sqm", price: "EGP 7M", available: true },
    { type: "2 Bedrooms", area: "130 sqm", price: "EGP 11M", available: true },
    { type: "3 Bedrooms", area: "200 sqm", price: "EGP 16M", available: false },
    { type: "Villa", area: "350 sqm", price: "EGP 28M", available: true },
  ],
};

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 40 && current < images.length - 1) setCurrent(c => c + 1);
    if (diff < -40 && current > 0) setCurrent(c => c - 1);
    touchStart.current = null;
  };

  return (
    <div
      className="relative overflow-hidden bg-gray-900"
      style={{ height: 260 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={images[current]}
        alt="project"
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      {/* Counter */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 mx-4 mb-3 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function KeyNumber({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center py-3 px-2">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="font-black text-gray-900 text-sm">{value}</span>
      <span className="text-xs text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const project = MOCK_PROJECT;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Image Slider */}
      <div className="relative">
        <ImageSlider images={project.images} />
        {/* Overlay buttons */}
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
            <Heart size={16} color={saved ? "#EF4444" : "white"} fill={saved ? "#EF4444" : "none"} />
          </button>
          <button className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
            <Share2 size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Card 1 — Header */}
      <Card className="mt-3">
        <div className="p-4">
          <p className="font-black text-gray-900 text-[22px] leading-tight">{project.name}</p>
          <button onClick={() => navigate(`/m/profile/${project.developerUsername}`)} className="text-sm text-blue-600 font-semibold mt-0.5">
            {project.developer}
          </button>
          <p className="text-xs text-gray-400 mt-1">📍 {project.city}, {project.area}</p>
          <div className="flex gap-2 mt-2.5 flex-wrap">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{project.status}</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">📅 Delivery {project.delivery}</span>
          </div>
        </div>
      </Card>

      {/* Card 2 — Key Numbers */}
      <Card>
        <p className="font-black text-gray-900 text-sm px-4 pt-4 pb-2">Key Numbers</p>
        <div className="grid grid-cols-4 divide-x divide-gray-100 border-t border-gray-100">
          <KeyNumber icon="🏗" label="Total Units" value={project.totalUnits.toLocaleString()} />
          <KeyNumber icon="📐" label="Total Area" value={`${(project.totalArea / 1e6).toFixed(1)}M sqm`} />
          <KeyNumber icon="🏢" label="Built Area" value={`${(project.builtArea / 1e6).toFixed(1)}M sqm`} />
          <KeyNumber icon="🌿" label="Green Area" value={`${(project.greenArea / 1e6).toFixed(1)}M sqm`} />
        </div>
      </Card>

      {/* Card 3 — Price Range */}
      <Card>
        <div className="p-4">
          <p className="font-black text-gray-900 text-sm mb-3">Price Range</p>
          <div className="flex gap-6 mb-3">
            <div>
              <p className="text-xs text-gray-400">Starting from</p>
              <p className="font-black text-orange-600 text-base">{project.priceFrom}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Up to</p>
              <p className="font-black text-orange-600 text-base">{project.priceTo}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2">Available unit types:</p>
          <div className="flex flex-wrap gap-1.5">
            {project.unitTypes.map(t => (
              <span key={t} className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Card 4 — About */}
      <Card>
        <div className="p-4">
          <p className="font-black text-gray-900 text-sm mb-2">About the Project</p>
          <p className={`text-sm text-gray-600 leading-relaxed ${!expanded ? "line-clamp-4" : ""}`}>
            {project.description}
          </p>
          <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 text-orange-600 text-xs font-bold mt-2">
            {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
          </button>
        </div>
      </Card>

      {/* Card 5 — Amenities */}
      <Card>
        <div className="p-4">
          <p className="font-black text-gray-900 text-sm mb-3">Amenities</p>
          <div className="grid grid-cols-4 gap-3">
            {project.amenities.map(a => (
              <div key={a.label} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-xl">{a.icon}</div>
                <span className="text-[10px] text-gray-500 font-medium">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Card 6 — Location */}
      <Card>
        <div className="p-4 pb-0">
          <p className="font-black text-gray-900 text-sm mb-1">Location</p>
          <p className="text-xs text-gray-400 mb-3">📍 {project.area}, {project.city}, Egypt</p>
        </div>
        <div className="h-48 bg-gray-200 overflow-hidden">
          <iframe
            title="map"
            src={project.mapEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </Card>

      {/* Card 7 — Units */}
      <div className="mx-4 mb-3">
        <p className="font-black text-gray-900 text-sm mb-2.5">Available Units</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {project.units.map(unit => (
            <div key={unit.type} className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm" style={{ minWidth: 140 }}>
              <p className="font-black text-gray-900 text-sm">{unit.type}</p>
              <p className="text-xs text-gray-400 mt-0.5">📐 {unit.area}</p>
              <p className="font-bold text-orange-600 text-sm mt-1">{unit.price}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${unit.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                {unit.available ? "Available" : "Sold Out"}
              </span>
              {unit.available && (
                <button className="w-full mt-2 py-1.5 rounded-lg border border-orange-600 text-orange-600 text-xs font-bold">
                  Inquire
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card 8 — Developer */}
      <Card>
        <div className="p-4 flex items-center gap-3">
          <img src={project.developerLogo} alt={project.developer} className="w-14 h-14 rounded-xl border border-gray-100 object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-black text-gray-900">{project.developer}</p>
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Verified Developer</p>
            <button onClick={() => navigate(`/m/profile/${project.developerUsername}`)} className="text-xs text-orange-600 font-bold mt-1">
              {project.developerProjects} Other Projects →
            </button>
          </div>
        </div>
      </Card>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-gray-300 text-gray-700 text-sm font-bold">
          <Download size={15} /> Brochure
        </button>
        <button onClick={() => setShowInquiry(true)} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-600 text-white text-sm font-bold">
          <MessageCircle size={15} /> Inquire Now
        </button>
      </div>

      {/* Inquiry modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInquiry(false)} />
          <div className="relative bg-white rounded-t-3xl p-5" style={{ paddingBottom: "max(24px,env(safe-area-inset-bottom))" }}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <p className="font-black text-gray-900 text-lg mb-4">Inquire About {project.name}</p>
            <div className="space-y-3">
              <input placeholder="Your Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <input placeholder="Phone Number" type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <input placeholder="Email (optional)" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <textarea placeholder="Message (optional)" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" />
              <button onClick={() => setShowInquiry(false)} className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl text-sm">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}