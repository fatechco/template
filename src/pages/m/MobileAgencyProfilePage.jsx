import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Award, CheckCircle, Globe, Phone, MessageCircle, Users, BedDouble, Bath, Maximize2 } from "lucide-react";

const MOCK = {
  name: "Coldwell Banker Egypt",
  logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  city_name: "New Cairo, Cairo, Egypt", phone: "+20 2 1234 5678",
  website: "https://coldwellbanker.com.eg",
  description: "Coldwell Banker Egypt is the leading franchise of the world's most recognized real estate brand. With offices across Cairo and Alexandria, we offer unparalleled expertise in residential and commercial properties.\n\nOur team of over 28 certified agents brings decades of combined experience and a commitment to delivering exceptional results.",
  is_verified: true, rating: 4.7, review_count: 112,
  properties_count: 142, agents_count: 28, years_active: 15, deals_count: 850,
  specializations: ["Residential Sales", "Luxury Properties", "Commercial Real Estate", "Property Management", "Off-Plan"],
  areas_covered: ["New Cairo", "5th Settlement", "Sheikh Zayed", "Heliopolis", "Maadi"],
  certifications: ["Coldwell Banker International Franchise", "RERA Certified Brokerage", "ISO 9001:2015"],
};

const MOCK_AGENTS = Array.from({ length: 4 }, (_, i) => ({
  id: `ag-${i}`,
  name: ["Ahmed Hassan", "Sara Mohamed", "Omar Khalil", "Layla Farouk"][i],
  properties: [34, 21, 58, 27][i],
  avatar: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
  ][i],
}));

const REVIEWS = [
  { name: "Tarek F.", rating: 5, text: "Coldwell Banker Egypt found us a perfect villa in Sheikh Zayed.", date: "Feb 2026" },
  { name: "Mona S.", rating: 5, text: "Excellent service and very transparent pricing.", date: "Jan 2026" },
  { name: "Walid N.", rating: 4, text: "Great selection of properties and knowledgeable agents.", date: "Dec 2025" },
];

const MOCK_LISTINGS = [
  { id: "l1", title: "Luxury Apartment New Cairo", purpose: "For Sale", price: "3,500,000 EGP", beds: 3, baths: 2, area: 185, city: "New Cairo", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: "l2", title: "Modern Villa Sheikh Zayed", purpose: "For Sale", price: "12,000,000 EGP", beds: 5, baths: 4, area: 450, city: "Sheikh Zayed", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: "l3", title: "Studio Apartment Maadi", purpose: "For Rent", price: "85,000 EGP/yr", beds: 1, baths: 1, area: 55, city: "Maadi", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" },
  { id: "l4", title: "Penthouse Downtown", purpose: "For Sale", price: "18,000,000 EGP", beds: 4, baths: 3, area: 350, city: "Downtown", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
];

const TABS = ["about", "listings", "agents", "reviews"];

export default function MobileAgencyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [showPhone, setShowPhone] = useState(false);
  const ag = MOCK;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img src={ag.cover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        {ag.is_verified && (
          <span className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Verified
          </span>
        )}
      </div>

      {/* Logo + Header */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <img src={ag.logo} alt={ag.name} className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-lg flex-shrink-0" />
          <div className="mb-1">
            <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">AGENCY</span>
          </div>
        </div>
        <h1 className="font-black text-gray-900 text-xl leading-tight">{ag.name}</h1>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} className="text-[#FF6B00]" />{ag.city_name}</span>
          <span className="flex items-center gap-1 text-xs text-gray-700 font-bold"><Star size={11} className="fill-yellow-400 text-yellow-400" />{ag.rating} ({ag.review_count})</span>
        </div>
        {ag.website && (
          <a href={ag.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 mt-1 text-xs text-[#FF6B00] font-bold">
            <Globe size={11} /> {ag.website}
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm grid grid-cols-4 divide-x divide-gray-100 mb-4">
        {[
          { label: "Props", value: ag.properties_count },
          { label: "Agents", value: ag.agents_count },
          { label: "Years", value: ag.years_active },
          { label: "Deals", value: ag.deals_count },
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
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ag.description}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Award size={13} className="text-[#FF6B00]" />Specializations</h4>
              <div className="flex flex-wrap gap-1.5">
                {ag.specializations.map(s => <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-2.5 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><MapPin size={13} className="text-[#FF6B00]" />Areas Covered</h4>
              <div className="flex flex-wrap gap-1.5">
                {ag.areas_covered.map(a => <span key={a} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{a}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><CheckCircle size={13} className="text-green-600" />Certifications</h4>
              <div className="space-y-1.5">
                {ag.certifications.map(c => <div key={c} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={12} className="text-green-500 flex-shrink-0" />{c}</div>)}
              </div>
            </div>
          </>
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
        {activeTab === "agents" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-1.5"><Users size={13} className="text-[#FF6B00]" />Our Agents</h3>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_AGENTS.map(a => (
                <div key={a.id} className="flex flex-col items-center bg-gray-50 rounded-xl p-3">
                  <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow mb-2" />
                  <p className="font-bold text-xs text-gray-900 text-center">{a.name}</p>
                  <span className="text-[10px] text-[#FF6B00] font-bold">{a.properties} Props</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-3">Client Reviews</h3>
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
          <Phone size={16} /> {showPhone ? ag.phone : "Show Phone"}
        </button>
      </div>
    </div>
  );
}