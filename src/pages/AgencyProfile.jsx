import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Home, ChevronRight, Users, Building2, Globe, CheckCircle, Award } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileContactSidebar from "@/components/profiles/ProfileContactSidebar";
import ProfilePropertiesGrid from "@/components/profiles/ProfilePropertiesGrid";

const MOCK_AGENCY = {
  id: "mock-agency",
  name: "Coldwell Banker Egypt",
  logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  city_name: "New Cairo, Cairo, Egypt",
  phone: "+20 2 1234 5678",
  website: "https://coldwellbanker.com.eg",
  description: "Coldwell Banker Egypt is the leading franchise of the world's most recognized real estate brand. With offices across Cairo and Alexandria, we offer unparalleled expertise in residential and commercial properties.\n\nOur team of over 28 certified agents brings decades of combined experience and a commitment to delivering exceptional results for buyers, sellers, landlords, and tenants.",
  is_verified: true,
  is_featured: true,
  rating: 4.7,
  review_count: 112,
  properties_count: 142,
  agents_count: 28,
  years_active: 15,
  deals_count: 850,
  specializations: ["Residential Sales", "Luxury Properties", "Commercial Real Estate", "Property Management", "Off-Plan"],
  areas_covered: ["New Cairo", "5th Settlement", "Sheikh Zayed", "Heliopolis", "Maadi", "Downtown Cairo"],
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
  { name: "Tarek F.", rating: 5, text: "Coldwell Banker Egypt found us a perfect villa in Sheikh Zayed. The whole team was professional and responsive.", date: "Feb 2026" },
  { name: "Mona S.", rating: 5, text: "Excellent service and very transparent pricing. Highly recommend this agency.", date: "Jan 2026" },
  { name: "Walid N.", rating: 4, text: "Great selection of properties and knowledgeable agents. Will use again.", date: "Dec 2025" },
];

export default function AgencyProfile() {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    setAgency(MOCK_AGENCY);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50"><SiteHeader /><div className="max-w-[1400px] mx-auto px-4 py-10 animate-pulse"><div className="h-72 bg-gray-200 rounded-2xl" /></div></div>;

  const ag = agency;
  const TABS = ["about", "listings", "agents", "reviews"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1"><Home size={12} /> Home</Link>
          <ChevronRight size={12} />
          <Link to="/find-profile/agency" className="hover:text-[#FF6B00]">Agencies</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{ag.name}</span>
        </nav>

        <ProfileHero
          name={ag.name}
          subtitle="Real Estate Agency"
          avatar={ag.logo}
          isCircle={false}
          coverImage={ag.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80"}
          location={ag.city_name}
          rating={ag.rating}
          reviewCount={ag.review_count}
          isVerified={ag.is_verified}
          isFeatured={ag.is_featured}
          roleBadge="AGENCY"
          phone={ag.phone}
          showPhone={false}
          onShowPhone={() => {}}
          stats={[
            { label: "Properties", value: ag.properties_count },
            { label: "Agents", value: ag.agents_count },
            { label: "Years Active", value: ag.years_active },
            { label: "Deals Closed", value: ag.deals_count },
          ]}
        />

        <div className="flex gap-6 items-start">
          <div className="flex-[2.3] min-w-0">
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{ag.description}</p>
                  {ag.website && (
                    <a href={ag.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-[#FF6B00] text-sm font-bold hover:underline">
                      <Globe size={13} /> {ag.website}
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Award size={14} className="text-[#FF6B00]" />Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {ag.specializations.map(s => <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>)}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><MapPin size={14} className="text-[#FF6B00]" />Areas Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {ag.areas_covered.map(a => <span key={a} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">{a}</span>)}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} className="text-green-600" />Certifications & Accreditations</h4>
                  <div className="flex flex-col gap-2">
                    {ag.certifications.map(c => <div key={c} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />{c}</div>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "listings" && <ProfilePropertiesGrid title="Agency Listings" properties={[]} />}

            {activeTab === "agents" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />Our Agents</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {MOCK_AGENTS.map(ag => (
                    <div key={ag.id} className="flex flex-col items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer">
                      <img src={ag.avatar} alt={ag.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow mb-2" />
                      <p className="font-bold text-xs text-gray-900 text-center">{ag.name}</p>
                      <span className="text-[10px] text-[#FF6B00] font-bold mt-0.5">{ag.properties} Props</span>
                    </div>
                  ))}
                </div>
              </div>
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
                          <span className="font-bold text-sm">{r.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${r.rating >= s ? "text-yellow-400" : "text-gray-200"}`}>★</span>)}
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

          <div className="w-[300px] flex-shrink-0 sticky top-[90px]">
            <ProfileContactSidebar name={ag.name} phone={ag.phone} roleBadge="Real Estate Agency" avatar={ag.logo} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}