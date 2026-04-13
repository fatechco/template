import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Home, ChevronRight, Globe, CheckCircle, Award, TrendingUp, Users, Phone, ShieldCheck, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileContactSidebar from "@/components/profiles/ProfileContactSidebar";
import ProfilePropertiesGrid from "@/components/profiles/ProfilePropertiesGrid";

const MOCK_FRANCHISE = {
  id: "mock-franchise",
  full_name: "Mohamed Samy",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  province_name: "Cairo Governorate",
  city_name: "New Cairo",
  area_covered: "New Cairo, Mostakbal City, Shorouk City, El Obour",
  phone: "+20 100 987 6543",
  is_verified: true,
  is_featured: true,
  rating: 4.7,
  review_count: 38,
  years_partner: 5,
  agents_count: 12,
  properties_count: 87,
  deals_count: 210,
  bio: "An authorized Kemedar franchise owner covering New Cairo and surrounding areas. Mohamed brings 10+ years of real estate experience and a deep understanding of the East Cairo market. As a certified Kemedar partner since 2020, he operates a full-service real estate office with a dedicated team of 12 agents.\n\nHis mission is to connect buyers, sellers, and investors with the best properties in the region using Kemedar's cutting-edge platform and tools.",
  specializations: ["Residential Sales & Rental", "Investment Properties", "Property Management", "Off-Plan Consultancy", "Commercial Spaces"],
  areas_covered: ["New Cairo", "Mostakbal City", "Shorouk City", "El Obour", "El Rehab City"],
  certifications: ["Kemedar Certified Franchise Partner", "RERA Licensed Broker", "Certified Real Estate Professional (CREP)"],
  milestones: [
    { year: "2015", label: "Started Real Estate Career" },
    { year: "2018", label: "Opened Independent Agency" },
    { year: "2020", label: "Became Kemedar Franchise Owner" },
    { year: "2022", label: "Expanded to Mostakbal City" },
    { year: "2025", label: "Top Kemedar Franchise Partner Award" },
  ],
  team: Array.from({ length: 4 }, (_, i) => ({
    id: `tm-${i}`,
    name: ["Sara Ali", "Tarek Hassan", "Nour Kamel", "Walid Omar"][i],
    role: ["Senior Agent", "Sales Consultant", "Leasing Specialist", "Junior Agent"][i],
    avatar: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    ][i],
  })),
};

const REVIEWS = [
  { name: "Dina M.", rating: 5, text: "Mohamed helped us find the perfect apartment in New Cairo. Very professional and responsive.", date: "Jan 2026" },
  { name: "Amr H.", rating: 5, text: "Excellent service, great knowledge of the local market. Highly recommended franchise partner!", date: "Dec 2025" },
  { name: "Rana S.", rating: 4, text: "The team was helpful and guided us through the entire buying process.", date: "Nov 2025" },
];

export default function FranchiseOwnerProfile() {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    setOwner(MOCK_FRANCHISE);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50"><SiteHeader /></div>;

  const o = owner;
  const TABS = ["about", "team", "listings", "reviews"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1"><Home size={12} /> Home</Link>
          <ChevronRight size={12} />
          <Link to="/find-profile/franchise-owner" className="hover:text-[#FF6B00]">Franchise Owners</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{o.full_name}</span>
        </nav>

        {/* Franchise badge banner */}
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] rounded-2xl p-4 mb-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">KEMEDAR® CERTIFIED FRANCHISE PARTNER</p>
            <p className="text-gray-400 text-xs">Authorized since 2020 · {o.area_covered}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} className={o.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-600 fill-gray-600"} />)}
            <span className="text-white font-black text-sm ml-1">{o.rating}</span>
          </div>
        </div>

        <ProfileHero
          name={o.full_name}
          subtitle={`Kemedar Franchise Owner · ${o.province_name}`}
          avatar={o.avatar}
          isCircle
          coverImage={o.cover_image || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1400&q=80"}
          location={`${o.city_name}, ${o.province_name}`}
          rating={o.rating}
          reviewCount={o.review_count}
          isVerified={o.is_verified}
          isFeatured={o.is_featured}
          roleBadge="FRANCHISE OWNER"
          phone={o.phone}
          showPhone={false}
          onShowPhone={() => {}}
          stats={[
            { label: "Properties", value: o.properties_count },
            { label: "Team Agents", value: o.agents_count },
            { label: "Years Partner", value: o.years_partner },
            { label: "Deals Closed", value: o.deals_count },
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
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{o.bio}</p>
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h4 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[#FF6B00]" />Career Milestones</h4>
                  <div className="relative pl-4 border-l-2 border-[#FF6B00]/20 flex flex-col gap-4">
                    {o.milestones.map((m, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-[#FF6B00] border-2 border-white shadow" />
                        <span className="text-xs font-black text-[#FF6B00]">{m.year}</span>
                        <p className="text-sm text-gray-700 font-semibold">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Award size={14} className="text-[#FF6B00]" />Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {o.specializations.map(s => <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>)}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><MapPin size={14} className="text-[#FF6B00]" />Coverage Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {o.areas_covered.map(a => <span key={a} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">{a}</span>)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} className="text-green-600" />Certifications</h4>
                  <div className="flex flex-col gap-2">
                    {o.certifications.map(c => <div key={c} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />{c}</div>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /><Users size={15} className="text-[#FF6B00]" />Our Team</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {o.team.map(m => (
                    <div key={m.id} className="flex flex-col items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
                      <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow mb-2" />
                      <p className="font-bold text-xs text-gray-900 text-center">{m.name}</p>
                      <span className="text-[10px] text-gray-500 text-center mt-0.5">{m.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "listings" && <ProfilePropertiesGrid title="Our Listings" properties={[]} />}

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
            <ProfileContactSidebar name={o.full_name} phone={o.phone} roleBadge="Franchise Owner" avatar={o.avatar} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}