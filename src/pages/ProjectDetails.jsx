import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, Building2, Home, ChevronRight, Download, MessageCircle, Share2, Heart, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import PropertyInvestmentWidget from "@/components/valuation/PropertyInvestmentWidget";
import NearbyDistancesDisplay from "@/components/distance/NearbyDistancesDisplay";

const STATUS_COLORS = {
  "Ready to Move": "bg-green-100 text-green-700",
  "Under Construction": "bg-orange-100 text-orange-700",
  "Off Plan": "bg-blue-100 text-blue-700",
};

const MOCK_PROJECT = {
  id: "mock-1",
  name: "Marassi North Coast",
  developer_name: "EMAAR Misr",
  city_name: "North Coast",
  area_name: "Sidi Abd El Rahman",
  status: "Under Construction",
  delivery_year: 2026,
  total_units: 3500,
  total_area: 6000000,
  built_area: 2100000,
  green_area: 900000,
  area_from: 55,
  area_to: 700,
  min_price: 4500000,
  max_price: 32000000,
  currency: "EGP",
  is_featured: true,
  unit_types: ["Apartment", "Villa", "Chalet", "Penthouse", "Shop"],
  description: "Marassi is a world-class integrated resort community on Egypt's stunning North Coast. Spread over 6.5 million sqm of pristine Mediterranean coastline, Marassi features five distinctive villages each with its own character and personality.\n\nResidents enjoy access to a Marina, a championship golf course, five-star hotels, retail centres, and a vibrant beach club. With 6.5km of beachfront, it's the ultimate Mediterranean lifestyle destination.",
  amenities: ["Pool", "Gym", "Golf Course", "Garden", "Mall", "Tennis", "Marina", "Beach", "Clinic", "School", "Parking", "Security 24/7", "Kids Area", "Restaurant", "Hotel"],
  units: [
    { type: "Studio", area: "55 sqm", price: "EGP 4.5M", available: true },
    { type: "1 Bedroom", area: "85 sqm", price: "EGP 7M", available: true },
    { type: "2 Bedrooms", area: "130 sqm", price: "EGP 11M", available: true },
    { type: "3 Bedrooms", area: "200 sqm", price: "EGP 16M", available: false },
    { type: "Villa", area: "350 sqm", price: "EGP 28M", available: true },
  ],
  image_gallery: [
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    "https://images.unsplash.com/photo-1582407947304-d0b8a61e3a41?w=600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  ],
  latitude: 30.8714,
  longitude: 28.9546,
};

function Gallery({ images }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex gap-3">
      <div className="flex-1 rounded-2xl overflow-hidden h-[420px] bg-gray-100">
        <img src={images[active]} alt="project" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-2 w-[100px]">
        {images.slice(0, 4).map((img, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`rounded-xl overflow-hidden h-[100px] border-2 transition-all ${active === i ? "border-[#FF6B00]" : "border-transparent"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
        {images.length > 4 && (
          <button onClick={() => setActive(4)}
            className="rounded-xl overflow-hidden h-[100px] border-2 border-transparent relative">
            <img src={images[4]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
              +{images.length - 4}
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Project.filter({ id })
      .then(data => setProject(data?.length > 0 ? data[0] : MOCK_PROJECT))
      .catch(() => setProject(MOCK_PROJECT))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-[1400px] mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-[420px] bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );

  if (!project) return null;

  const images = project.image_gallery?.length > 0 ? project.image_gallery : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"];
  const descShort = (project.description || "").length > 400;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#FF6B00] flex items-center gap-1"><Home size={12} /> Home</Link>
          <ChevronRight size={12} />
          <Link to="/search-projects" className="hover:text-[#FF6B00]">Projects</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-xs">{project.name}</span>
        </nav>

        {/* Gallery */}
        <div className="mb-6">
          <Gallery images={images} />
        </div>

        {/* Title + Actions */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {project.is_featured && <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Featured</span>}
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[project.status] || "bg-gray-100 text-gray-700"}`}>{project.status}</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">📅 Delivery {project.delivery_year}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-1">{project.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1"><Building2 size={14} className="text-[#FF6B00]" /> {project.developer_name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5"><MapPin size={14} className="text-[#FF6B00]" /> {[project.area_name, project.city_name].filter(Boolean).join(", ")}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-4xl font-black text-[#FF6B00]">{(project.min_price / 1000000).toFixed(1)}M</p>
            <p className="text-sm font-bold text-gray-500">{project.currency}</p>
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setSaved(s => !s)}
                className={`p-2.5 rounded-xl border-2 transition-all ${saved ? "border-red-400 text-red-500" : "border-gray-200 text-gray-500 hover:border-[#FF6B00]"}`}>
                <Heart size={16} fill={saved ? "#EF4444" : "none"} />
              </button>
              <button onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="p-2.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-[#FF6B00] transition-all">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main two-col */}
        <div className="flex gap-6 items-start">

          {/* LEFT */}
          <div className="flex-[2.3] min-w-0 space-y-5">

            {/* Key Numbers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Key Numbers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: "🏗", label: "Total Units", value: project.total_units?.toLocaleString() || "—" },
                  { icon: "📐", label: "Area From", value: project.area_from ? `${project.area_from} m²` : "—" },
                  { icon: "📐", label: "Area To", value: project.area_to ? `${project.area_to} m²` : "—" },
                  { icon: "📅", label: "Delivery", value: project.delivery_year || "—" },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center bg-orange-50 rounded-xl p-4 text-center">
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <p className="font-black text-gray-900 text-base">{item.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Unit Types */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Price Range & Unit Types</h3>
              <div className="flex gap-8 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="font-black text-orange-600 text-xl">{(project.min_price / 1000000).toFixed(1)}M {project.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Up to</p>
                  <p className="font-black text-orange-600 text-xl">{(project.max_price / 1000000).toFixed(1)}M {project.currency}</p>
                </div>
              </div>
              {project.unit_types?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.unit_types.map(t => (
                    <span key={t} className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> About the Project</h3>
              <p className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${!descExpanded && descShort ? "line-clamp-5" : ""}`}>
                {project.description || "No description available."}
              </p>
              {descShort && (
                <button onClick={() => setDescExpanded(e => !e)} className="text-[#FF6B00] text-sm font-bold mt-2 hover:underline">
                  {descExpanded ? "Show Less ↑" : "Read More ↓"}
                </button>
              )}
            </div>

            {/* Amenities */}
            {project.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {project.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <CheckCircle size={13} className="text-[#FF6B00] flex-shrink-0" /> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Distances */}
            <NearbyDistancesDisplay entityType="project" entityId={project.id} />

            {/* Available Units */}
            {project.units?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Available Units</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 rounded-xl">
                      <tr>
                        {["Type", "Area", "Price", "Status", ""].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {project.units.map(u => (
                        <tr key={u.type} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-900">{u.type}</td>
                          <td className="px-4 py-3 text-gray-500">{u.area}</td>
                          <td className="px-4 py-3 font-black text-orange-600">{u.price}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                              {u.available ? "Available" : "Sold Out"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {u.available && (
                              <button onClick={() => setShowInquiry(true)} className="text-xs font-bold text-[#FF6B00] border border-[#FF6B00] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                                Inquire
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Location Map */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2"><span className="w-1 h-5 bg-[#FF6B00] rounded-full" /> Location</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4"><MapPin size={13} className="text-[#FF6B00]" />{[project.area_name, project.city_name, "Egypt"].filter(Boolean).join(", ")}</p>
              <div className="rounded-xl overflow-hidden border border-gray-100 h-64">
                <iframe
                  title="Project Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent([project.name, project.city_name, "Egypt"].filter(Boolean).join(" "))}&output=embed`}
                  className="block"
                />
              </div>
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="w-[300px] flex-shrink-0 sticky top-[90px] space-y-4">
            {/* Inquiry Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-1">Interested in this project?</p>
              <p className="text-xs text-gray-500 mb-4">Contact the developer for pricing and availability</p>
              <button onClick={() => setShowInquiry(true)}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-colors mb-2 flex items-center justify-center gap-2">
                <MessageCircle size={15} /> Send Inquiry
              </button>
              <button className="w-full border border-gray-200 hover:border-[#FF6B00] text-gray-700 hover:text-[#FF6B00] font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <Download size={15} /> Download Brochure
              </button>
            </div>

            {/* Developer Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 text-sm mb-3">Developer</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center font-black text-[#FF6B00] text-lg flex-shrink-0">
                  {project.developer_name?.[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{project.developer_name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-[9px] font-bold">✓</span></span>
                    <span className="text-xs text-gray-400">Verified Developer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Widget */}
            <PropertyInvestmentWidget />

            {/* VERI CTA */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 text-white">
              <p className="font-black text-sm mb-1">KEMEDAR VERI</p>
              <p className="text-xs text-gray-300 mb-4">Get an on-site verification report for this project before you invest.</p>
              <button className="w-full bg-[#FF6B00] hover:bg-orange-500 text-white font-bold text-sm py-2.5 rounded-xl transition-colors">
                Request Verification
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInquiry(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <p className="font-black text-gray-900 text-lg mb-4">Inquire About {project.name}</p>
            <div className="space-y-3">
              <input placeholder="Your Name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <input placeholder="Phone Number" type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <input placeholder="Email (optional)" type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400" />
              <textarea placeholder="Message (optional)" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 resize-none" />
              <button onClick={() => setShowInquiry(false)} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm">Send Inquiry</button>
              <button onClick={() => setShowInquiry(false)} className="w-full text-gray-500 font-bold py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}