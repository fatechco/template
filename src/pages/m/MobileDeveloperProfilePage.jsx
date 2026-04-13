import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Award, CheckCircle, Globe, Phone, MessageCircle, TrendingUp, BedDouble, Bath, Maximize2 } from "lucide-react";

const MOCK = {
  name: "Palm Hills Developments",
  logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  city_name: "Sheikh Zayed, Giza, Egypt", phone: "+20 2 3827 8000",
  website: "https://palmhills.com",
  description: "Palm Hills Developments is one of Egypt's leading real estate developers, with a portfolio of over 30 premium projects spanning more than 27 million square meters. Founded in 2005, we have been creating integrated mixed-use communities that redefine modern living.\n\nOur flagship communities include Palm Hills October, Palm Hills New Cairo, and Village Gate.",
  is_verified: true, rating: 4.9, review_count: 234,
  projects_count: 30, properties_count: 12000, years_active: 20, total_sqm: "27M+",
  specializations: ["Residential Communities", "Mixed-Use Developments", "Luxury Villas", "Golf Communities"],
  areas_covered: ["Sheikh Zayed", "6th October", "New Cairo", "North Coast"],
  certifications: ["Egyptian Stock Exchange Listed", "ISO 14001 Environmental", "EDGE Green Building Certified"],
  milestones: [
    { year: "2005", label: "Company Founded" },
    { year: "2008", label: "Palm Hills October Launched" },
    { year: "2012", label: "Listed on EGX" },
    { year: "2024", label: "30th Project Launched" },
  ],
};

const MOCK_PROJECTS = [
  { id: "p1", title: "Palm Hills October", city: "6th October", units: 5000, status: "Completed", img: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=400&q=70" },
  { id: "p2", title: "Palm Hills New Cairo", city: "New Cairo", units: 3200, status: "Completed", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=70" },
  { id: "p3", title: "Village Gate", city: "New Cairo", units: 1800, status: "Completed", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=70" },
  { id: "p4", title: "Golf Views", city: "Sheikh Zayed", units: 900, status: "Under Construction", img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&q=70" },
];

const REVIEWS = [
  { name: "Hesham A.", rating: 5, text: "Palm Hills delivered beyond expectations. Our villa is everything we dreamed of.", date: "Feb 2026" },
  { name: "Rana K.", rating: 5, text: "High quality construction and excellent community management.", date: "Jan 2026" },
  { name: "Sherif M.", rating: 5, text: "The best developer in Egypt by far. On-time delivery.", date: "Dec 2025" },
];

const STATUS_COLOR = { "Completed": "bg-green-500", "Under Construction": "bg-amber-500", "Off-Plan": "bg-blue-500" };

const MOCK_LISTINGS = [
  { id: "l1", title: "Luxury Apartment New Cairo", purpose: "For Sale", price: "3,500,000 EGP", beds: 3, baths: 2, area: 185, city: "New Cairo", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: "l2", title: "Modern Villa Sheikh Zayed", purpose: "For Sale", price: "12,000,000 EGP", beds: 5, baths: 4, area: 450, city: "Sheikh Zayed", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: "l3", title: "Golf Views Unit", purpose: "For Sale", price: "5,200,000 EGP", beds: 4, baths: 3, area: 230, city: "Sheikh Zayed", img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80" },
];

const TABS = ["about", "projects", "listings", "reviews"];

export default function MobileDeveloperProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [showPhone, setShowPhone] = useState(false);
  const dev = MOCK;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img src={dev.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        {dev.is_verified && (
          <span className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Verified
          </span>
        )}
      </div>

      {/* Logo + Header */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <img src={dev.logo} alt={dev.name} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg flex-shrink-0" />
          <div className="mb-1">
            <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">DEVELOPER</span>
          </div>
        </div>
        <h1 className="font-black text-gray-900 text-xl leading-tight">{dev.name}</h1>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} className="text-[#FF6B00]" />{dev.city_name}</span>
          <span className="flex items-center gap-1 text-xs text-gray-700 font-bold"><Star size={11} className="fill-yellow-400 text-yellow-400" />{dev.rating} ({dev.review_count})</span>
        </div>
        {dev.website && (
          <a href={dev.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-1 text-xs text-[#FF6B00] font-bold">
            <Globe size={11} /> {dev.website}
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm grid grid-cols-4 divide-x divide-gray-100 mb-4">
        {[
          { label: "Projects", value: dev.projects_count },
          { label: "Units", value: "12K+" },
          { label: "Years", value: dev.years_active },
          { label: "Area", value: dev.total_sqm },
        ].map(s => (
          <div key={s.label} className="text-center py-3">
            <p className="font-black text-gray-900 text-base">{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-4 bg-white rounded-xl border border-gray-100 p-1 shadow-sm w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${activeTab === t ? "bg-[#FF6B00] text-white" : "text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {activeTab === "about" && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{dev.description}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-1.5"><TrendingUp size={13} className="text-[#FF6B00]" />Milestones</h4>
              <div className="relative pl-4 border-l-2 border-orange-100 space-y-3">
                {dev.milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-[#FF6B00] border-2 border-white shadow" />
                    <span className="text-xs font-black text-[#FF6B00]">{m.year}</span>
                    <p className="text-sm text-gray-700 font-semibold">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Award size={13} className="text-[#FF6B00]" />Specializations</h4>
              <div className="flex flex-wrap gap-1.5">
                {dev.specializations.map(s => <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-2.5 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><CheckCircle size={13} className="text-green-600" />Awards & Certifications</h4>
              <div className="space-y-1.5">
                {dev.certifications.map(c => <div key={c} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={12} className="text-green-500 flex-shrink-0" />{c}</div>)}
              </div>
            </div>
          </>
        )}
        {activeTab === "projects" && (
          <div className="space-y-3">
            {MOCK_PROJECTS.map(p => (
              <Link key={p.id} to={`/project-details/${p.id}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative h-36 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-black text-sm">{p.title}</p>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin size={9} />{p.city}</p>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">{p.units.toLocaleString()} Units</span>
                    <span className={`${STATUS_COLOR[p.status] || "bg-gray-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>{p.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {activeTab === "listings" && (
          <div className="space-y-3">
            {MOCK_LISTINGS.map(p => (
              <Link key={p.id} to={`/m/property/${p.id}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative h-36 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">{p.purpose}</span>
                </div>
                <div className="p-3">
                  <p className="font-black text-[#FF6B00] text-sm">{p.price}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={10} className="text-[#FF6B00]" />{p.city}</p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-400">
                    <span className="flex items-center gap-0.5"><BedDouble size={10} className="text-[#FF6B00]" />{p.beds}</span>
                    <span className="flex items-center gap-0.5"><Bath size={10} className="text-[#FF6B00]" />{p.baths}</span>
                    <span className="flex items-center gap-0.5"><Maximize2 size={10} className="text-[#FF6B00]" />{p.area}m²</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-3">Reviews</h3>
            <div className="space-y-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-[#FF6B00]">{r.name[0]}</div>
                      <span className="font-bold text-sm">{r.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1 ml-9">
                    {[1,2,3,4,5].map(s => <span key={s} className={`text-[10px] ${r.rating >= s ? "text-yellow-400" : "text-gray-200"}`}>★</span>)}
                  </div>
                  <p className="text-sm text-gray-600 ml-9">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-sm">
          <MessageCircle size={16} /> Chat
        </button>
        <button onClick={() => setShowPhone(!showPhone)} className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold py-3 rounded-xl text-sm">
          <Phone size={16} /> {showPhone ? dev.phone : "Show Phone"}
        </button>
      </div>
    </div>
  );
}