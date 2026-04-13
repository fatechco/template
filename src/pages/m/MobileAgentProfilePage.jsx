import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Award, CheckCircle, Languages, Phone, MessageCircle, BedDouble, Bath, Maximize2, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MOCK = {
  full_name: "Ahmed Hassan", role: "agent", agency_name: "Coldwell Banker Egypt",
  city_name: "New Cairo, Cairo", direct_phone: "+20 100 123 4567",
  bio: "A seasoned real estate professional with over 12 years of experience in the Egyptian property market. Specializing in luxury residential properties in New Cairo, 5th Settlement, and surrounding areas.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  cover_image: "https://images.unsplash.com/photo-1582407947304-fd86f28f3d8b?w=800&q=80",
  is_verified: true, rating: 4.8, review_count: 47, properties_count: 58, deals_count: 124, years_experience: 12,
  specializations: ["Luxury Apartments", "Villas", "Investment Properties", "Off-Plan"],
  languages: ["Arabic", "English", "French"],
  areas_covered: ["New Cairo", "5th Settlement", "Mostakbal City", "Shorouk City"],
  certifications: ["RERA Certified", "Certified Residential Specialist (CRS)", "Accredited Buyer Representative (ABR)"],
};
const REVIEWS = [
  { name: "Sara K.", rating: 5, text: "Ahmed was incredibly professional and helped us find our dream home.", date: "Jan 2026" },
  { name: "Karim M.", rating: 5, text: "Very knowledgeable about the market and negotiated a great price.", date: "Dec 2025" },
  { name: "Nour A.", rating: 4, text: "Great experience overall. Quick response and thorough follow-up.", date: "Nov 2025" },
];

const MOCK_LISTINGS = [
  { id: "l1", title: "Luxury Apartment New Cairo", purpose: "For Sale", price: "3,500,000 EGP", beds: 3, baths: 2, area: 185, city: "New Cairo", img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: "l2", title: "Modern Villa Sheikh Zayed", purpose: "For Sale", price: "12,000,000 EGP", beds: 5, baths: 4, area: 450, city: "Sheikh Zayed", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: "l3", title: "Studio Apartment Maadi", purpose: "For Rent", price: "85,000 EGP/yr", beds: 1, baths: 1, area: 55, city: "Maadi", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80" },
  { id: "l4", title: "Family Home Heliopolis", purpose: "For Sale", price: "4,200,000 EGP", beds: 4, baths: 3, area: 280, city: "Heliopolis", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
];

const TABS = ["about", "listings", "reviews"];

export default function MobileAgentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    base44.entities.User.filter({ id }).then(u => setAgent(u?.[0] || MOCK)).catch(() => setAgent(MOCK));
  }, [id]);

  const a = agent || MOCK;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Cover + Back */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img src={a.cover_image || MOCK.cover_image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        {a.is_verified && (
          <span className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> Verified
          </span>
        )}
      </div>

      {/* Avatar + Header */}
      <div className="px-4 -mt-12 mb-4 relative z-10">
        <div className="flex items-end gap-3 mb-3">
          <img src={a.avatar} alt={a.full_name} className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg flex-shrink-0" />
          <div className="mb-1">
            <span className="bg-[#FF6B00] text-white text-[9px] font-black px-2 py-0.5 rounded-full">AGENT</span>
          </div>
        </div>
        <h1 className="font-black text-gray-900 text-xl leading-tight">{a.full_name}</h1>
        {a.agency_name && <p className="text-sm text-gray-500 mt-0.5">{a.agency_name}</p>}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} className="text-[#FF6B00]" />{a.city_name}</span>
          <span className="flex items-center gap-1 text-xs text-gray-700 font-bold"><Star size={11} className="fill-yellow-400 text-yellow-400" />{a.rating} ({a.review_count})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm grid grid-cols-4 divide-x divide-gray-100 mb-4">
        {[
          { label: "Props", value: a.properties_count },
          { label: "Deals", value: a.deals_count },
          { label: "Exp.", value: `${a.years_experience}yr` },
          { label: "Rating", value: a.rating },
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
            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize ${activeTab === t ? "bg-[#FF6B00] text-white" : "text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {activeTab === "about" && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{a.bio || MOCK.bio}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Award size={13} className="text-[#FF6B00]" />Specializations</h4>
              <div className="flex flex-wrap gap-1.5">
                {(a.specializations || MOCK.specializations).map(s => (
                  <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Languages size={13} className="text-[#FF6B00]" />Languages</h4>
              <div className="flex flex-wrap gap-1.5">
                {(a.languages || MOCK.languages).map(l => (
                  <span key={l} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{l}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><MapPin size={13} className="text-[#FF6B00]" />Areas Covered</h4>
              <div className="flex flex-wrap gap-1.5">
                {(a.areas_covered || MOCK.areas_covered).map(area => (
                  <span key={area} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{area}</span>
                ))}
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
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-3">Client Reviews</h3>
            <div className="space-y-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-[#FF6B00]">{r.name[0]}</div>
                      <span className="font-bold text-sm text-gray-900">{r.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-1 ml-9">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className={r.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />)}
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
          <Phone size={16} /> {showPhone ? (a.direct_phone || MOCK.direct_phone) : "Show Phone"}
        </button>
      </div>
    </div>
  );
}