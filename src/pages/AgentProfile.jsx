import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Award, Home, ChevronRight, CheckCircle, Languages, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileContactSidebar from "@/components/profiles/ProfileContactSidebar";
import ProfilePropertiesGrid from "@/components/profiles/ProfilePropertiesGrid";

const MOCK_AGENT = {
  id: "mock-agent",
  full_name: "Ahmed Hassan",
  role: "agent",
  agency_name: "Coldwell Banker Egypt",
  city_name: "New Cairo, Cairo",
  direct_phone: "+20 100 123 4567",
  bio: "A seasoned real estate professional with over 12 years of experience in the Egyptian property market. Specializing in luxury residential properties in New Cairo, 5th Settlement, and surrounding areas. Known for expert negotiation skills and deep market knowledge.\n\nHolding international certifications in real estate and committed to providing clients with transparent, professional service from search to closing.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  cover_image: "https://images.unsplash.com/photo-1582407947304-fd86f28f3d8b?w=1400&q=80",
  is_verified: true,
  is_featured: true,
  rating: 4.8,
  review_count: 47,
  properties_count: 58,
  deals_count: 124,
  years_experience: 12,
  specializations: ["Luxury Apartments", "Villas", "Investment Properties", "Off-Plan"],
  languages: ["Arabic", "English", "French"],
  areas_covered: ["New Cairo", "5th Settlement", "Mostakbal City", "Shorouk City"],
  certifications: ["RERA Certified", "Certified Residential Specialist (CRS)", "Accredited Buyer Representative (ABR)"],
};

const REVIEWS = [
  { name: "Sara K.", rating: 5, text: "Ahmed was incredibly professional and helped us find our dream home in New Cairo. Highly recommend!", date: "Jan 2026" },
  { name: "Karim M.", rating: 5, text: "Very knowledgeable about the market and negotiated a great price for us.", date: "Dec 2025" },
  { name: "Nour A.", rating: 4, text: "Great experience overall. Quick response and thorough follow-up.", date: "Nov 2025" },
];

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    Promise.all([
      base44.entities.User.filter({ id }).catch(() => []),
      base44.entities.Property.filter({ created_by: id }, "-created_date", 50).catch(() => []),
    ]).then(([users, props]) => {
      setAgent(users?.[0] || MOCK_AGENT);
      setProperties(props || []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50"><SiteHeader /><div className="max-w-[1400px] mx-auto px-4 py-10 animate-pulse"><div className="h-72 bg-gray-200 rounded-2xl" /></div></div>;

  const a = agent;
  const TABS = ["about", "listings", "reviews"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1"><Home size={12} /> Home</Link>
          <ChevronRight size={12} />
          <Link to="/find-profile/real-estate-agents" className="hover:text-[#FF6B00]">Agents</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{a.full_name}</span>
        </nav>

        <ProfileHero
          name={a.full_name}
          subtitle={a.agency_name ? `Agent at ${a.agency_name}` : "Independent Real Estate Agent"}
          avatar={a.avatar}
          coverImage={a.cover_image}
          isCircle
          location={a.city_name}
          rating={a.rating}
          reviewCount={a.review_count}
          isVerified={a.is_verified}
          isFeatured={a.is_featured}
          roleBadge="AGENT"
          phone={a.direct_phone}
          showPhone={showPhone}
          onShowPhone={() => setShowPhone(true)}
          stats={[
            { label: "Properties", value: properties.length || a.properties_count || 0 },
            { label: "Deals Closed", value: a.deals_count || 124 },
            { label: "Years Exp.", value: a.years_experience || 12 },
            { label: "Rating", value: a.rating || "4.8", color: "text-yellow-500" },
          ]}
        />

        {/* Tabs + content */}
        <div className="flex gap-6 items-start">
          <div className="flex-[2.3] min-w-0">
            {/* Tab nav */}
            <div className="flex gap-1 mb-5 bg-white rounded-xl border border-gray-100 p-1 w-fit shadow-sm">
              {TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === t ? "bg-[#FF6B00] text-white shadow" : "text-gray-500 hover:text-[#FF6B00]"}`}>
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="flex flex-col gap-5">
                {/* Bio */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{a.bio || "No bio provided."}</p>
                </div>

                {/* Specializations + Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Award size={14} className="text-[#FF6B00]" />Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {(a.specializations || MOCK_AGENT.specializations).map(s => (
                        <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Languages size={14} className="text-[#FF6B00]" />Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {(a.languages || MOCK_AGENT.languages).map(l => (
                        <span key={l} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Areas Covered */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><MapPin size={14} className="text-[#FF6B00]" />Areas Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {(a.areas_covered || MOCK_AGENT.areas_covered).map(area => (
                      <span key={area} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <MapPin size={10} className="text-[#FF6B00]" />{area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} className="text-green-600" />Certifications</h4>
                  <div className="flex flex-col gap-2">
                    {(a.certifications || MOCK_AGENT.certifications).map(c => (
                      <div key={c} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />{c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <ProfilePropertiesGrid title="Agent's Listings" properties={properties} emptyMsg="This agent has no active listings." />
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />Client Reviews</h3>
                <div className="flex flex-col gap-4">
                  {REVIEWS.map((r, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-[#FF6B00]">{r.name[0]}</div>
                          <span className="font-bold text-sm text-gray-900">{r.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} size={11} className={r.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />)}
                          <span className="text-xs text-gray-400 ml-1">{r.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-10">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-[300px] flex-shrink-0 sticky top-[90px]">
            <ProfileContactSidebar name={a.full_name} phone={a.direct_phone} roleBadge="Real Estate Agent" avatar={a.avatar} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}