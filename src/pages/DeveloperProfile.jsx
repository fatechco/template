import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Home, ChevronRight, Globe, CheckCircle, Award, Building2, TrendingUp, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileContactSidebar from "@/components/profiles/ProfileContactSidebar";
import ProfilePropertiesGrid from "@/components/profiles/ProfilePropertiesGrid";
import DeveloperEcoSection from "@/components/surplus/DeveloperEcoSection";

const MOCK_DEV = {
  id: "mock-dev",
  name: "Palm Hills Developments",
  logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80",
  city_name: "Sheikh Zayed, Giza, Egypt",
  phone: "+20 2 3827 8000",
  website: "https://palmhills.com",
  description: "Palm Hills Developments is one of Egypt's leading real estate developers, with a portfolio of over 30 premium projects spanning more than 27 million square meters. Founded in 2005, we have been creating integrated mixed-use communities that redefine the standards of modern living in Egypt.\n\nOur flagship communities include Palm Hills October, Palm Hills New Cairo, and Village Gate, each offering world-class amenities, green spaces, and architectural excellence. We are committed to sustainable development and community-focused design.",
  is_verified: true,
  is_featured: true,
  rating: 4.9,
  review_count: 234,
  projects_count: 30,
  properties_count: 12000,
  years_active: 20,
  total_sqm: "27M+",
  specializations: ["Residential Communities", "Mixed-Use Developments", "Luxury Villas", "Golf Communities", "Commercial Hubs"],
  areas_covered: ["Sheikh Zayed", "6th October", "New Cairo", "North Coast", "Cairo-Alex Desert Road"],
  certifications: ["Egyptian Stock Exchange Listed", "ISO 14001 Environmental", "EDGE Green Building Certified", "Africa Best Developer Award 2024"],
  milestones: [
    { year: "2005", label: "Company Founded" },
    { year: "2008", label: "Palm Hills October Launched" },
    { year: "2012", label: "Listed on EGX" },
    { year: "2018", label: "Village Gate New Cairo" },
    { year: "2024", label: "30th Project Launched" },
  ],
};

const MOCK_PROJECTS = Array.from({ length: 4 }, (_, i) => ({
  id: `proj-${i}`,
  title: ["Palm Hills October", "Palm Hills New Cairo", "Village Gate", "Golf Views"][i],
  units: [5000, 3200, 1800, 900][i],
  area: ["6th October", "New Cairo", "New Cairo", "Sheikh Zayed"][i],
  img: [
    "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&q=80",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80",
  ][i],
}));

const REVIEWS = [
  { name: "Hesham A.", rating: 5, text: "Palm Hills delivered beyond expectations. Our villa in Palm Hills October is everything we dreamed of.", date: "Feb 2026" },
  { name: "Rana K.", rating: 5, text: "High quality construction and excellent community management. Very satisfied.", date: "Jan 2026" },
  { name: "Sherif M.", rating: 5, text: "The best developer in Egypt by far. Professional team and on-time delivery.", date: "Dec 2025" },
];

export default function DeveloperProfile() {
  const { id } = useParams();
  const [dev, setDev] = useState(null);
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    Promise.all([
      base44.entities.User.filter({ id }).catch(() => []),
      base44.entities.Property.filter({ created_by: id }, "-created_date", 50).catch(() => []),
      base44.entities.Project.filter({ created_by: id }, "-created_date", 20).catch(() => []),
    ]).then(([users, props, projs]) => {
      setDev(users?.[0] || MOCK_DEV);
      setProperties(props || []);
      setProjects(projs || []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50"><SiteHeader /></div>;

  const TABS = ["about", "projects", "listings", "reviews"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1"><Home size={12} /> Home</Link>
          <ChevronRight size={12} />
          <Link to="/find-profile/developer" className="hover:text-[#FF6B00]">Developers</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{dev.name}</span>
        </nav>

        <ProfileHero
          name={dev.name}
          subtitle="Real Estate Developer"
          avatar={dev.logo}
          isCircle={false}
          coverImage={dev.cover}
          location={dev.city_name}
          rating={dev.rating}
          reviewCount={dev.review_count}
          isVerified={dev.is_verified}
          isFeatured={dev.is_featured}
          roleBadge="DEVELOPER"
          phone={dev.phone}
          showPhone={false}
          onShowPhone={() => {}}
          stats={[
            { label: "Projects", value: projects.length || dev.projects_count || 0 },
            { label: "Properties", value: properties.length || dev.properties_count || 0 },
            { label: "Years Active", value: dev.years_active },
            { label: "Total Area", value: dev.total_sqm, color: "text-blue-600" },
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
                <DeveloperEcoSection developerUserId={id} />
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />About</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{dev.description}</p>
                  {dev.website && <a href={dev.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-[#FF6B00] text-sm font-bold hover:underline"><Globe size={13} />{dev.website}</a>}
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h4 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-[#FF6B00]" />Company Milestones</h4>
                  <div className="relative pl-4 border-l-2 border-[#FF6B00]/20 flex flex-col gap-4">
                    {dev.milestones.map((m, i) => (
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
                      {dev.specializations.map(s => <span key={s} className="bg-orange-50 text-[#FF6B00] text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>)}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><MapPin size={14} className="text-[#FF6B00]" />Areas of Operation</h4>
                    <div className="flex flex-wrap gap-2">
                      {dev.areas_covered.map(a => <span key={a} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">{a}</span>)}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h4 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><CheckCircle size={14} className="text-green-600" />Awards & Certifications</h4>
                  <div className="flex flex-col gap-2">
                    {dev.certifications.map(c => <div key={c} className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />{c}</div>)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (() => {
              const MOCK_PROJECTS = [
                { id: "p1", title: "Palm Hills October", city_name: "6th October", total_units: 5000, status: "Completed", img: "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&q=80", year: "2010" },
                { id: "p2", title: "Palm Hills New Cairo", city_name: "New Cairo", total_units: 3200, status: "Completed", img: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=80", year: "2015" },
                { id: "p3", title: "Village Gate", city_name: "New Cairo", total_units: 1800, status: "Completed", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", year: "2018" },
                { id: "p4", title: "Golf Views", city_name: "Sheikh Zayed", total_units: 900, status: "Under Construction", img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80", year: "2022" },
                { id: "p5", title: "Hacienda Bay", city_name: "North Coast", total_units: 2400, status: "Completed", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80", year: "2016" },
                { id: "p6", title: "Palm Parks", city_name: "6th October", total_units: 1200, status: "Off-Plan", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", year: "2024" },
              ];
              const displayProjects = projects.length > 0
                ? projects.map(p => ({ id: p.id, title: p.title, city_name: p.city_name || p.area, total_units: p.total_units, status: "Active", img: p.cover_image || p.images?.[0] }))
                : MOCK_PROJECTS;
              const statusColor = { "Completed": "bg-green-500", "Under Construction": "bg-amber-500", "Off-Plan": "bg-blue-500", "Active": "bg-green-500" };
              return (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#FF6B00] rounded-full" />Projects
                    <span className="ml-auto text-sm font-normal text-gray-400">{displayProjects.length} projects</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayProjects.map((p, i) => (
                      <a key={p.id} href={`/project-details/${p.id}`} className="rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
                        <div className="relative h-44 overflow-hidden">
                          <img src={p.img || `https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&q=80`} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white font-black text-sm truncate">{p.title}</p>
                            <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5"><MapPin size={9} />{p.city_name || "—"}</p>
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            {p.total_units && <span className="bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">{Number(p.total_units).toLocaleString()} Units</span>}
                            {p.status && <span className={`${statusColor[p.status] || "bg-gray-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>{p.status}</span>}
                          </div>
                          {p.year && <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">{p.year}</span>}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {activeTab === "listings" && <ProfilePropertiesGrid title="Developer Properties" properties={properties} emptyMsg="No properties listed yet." />}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" />Reviews</h3>
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
            <ProfileContactSidebar name={dev.name} phone={dev.phone} roleBadge="Real Estate Developer" avatar={dev.logo} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}