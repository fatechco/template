import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import KemedarAISlider from "@/components/home/KemedarAISlider";
import HamburgerMenu from "@/components/mobile/HamburgerMenu";
import { Search, Heart, BedDouble, Bath, Maximize2, MessageCircle, User, MapPin, Users, ArrowRight, Plus, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ─── Constants ───────────────────────────────────────────────────────────────

const PURPOSES = ["For Sale", "For Rent", "For Daily Booking", "For Auction", "For Investment and Partnership"];
const PURPOSE_COLORS = {
  "For Sale": "bg-blue-600",
  "For Daily Booking": "bg-purple-600",
  "For Rent": "bg-green-600",
  "For Auction": "bg-red-600",
  "For Investment and Partnership": "bg-yellow-600",
};
const FALLBACK_PROP_IMAGES = [
  "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=70",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=70",
];
const FALLBACK_PROJ_IMAGES = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
  "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=400&q=70",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&q=70",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=70",
];
const MOCK_PROPS = Array.from({ length: 6 }, (_, i) => ({
  id: `mp-${i}`,
  title: ["Luxury Apartment", "Modern Villa", "Studio in Downtown", "Townhouse", "Office Space", "Penthouse"][i],
  purpose: PURPOSES[i % PURPOSES.length],
  price_min: [2500000, 12000000, 450000, 3200000, 1800000, 8500000][i],
  currency: "EGP",
  beds: [3, 5, 1, 4, 0, 3][i],
  baths: [2, 4, 1, 3, 2, 3][i],
  area_size: [180, 450, 60, 250, 200, 320][i],
  address: ["New Cairo", "Sheikh Zayed", "Downtown Cairo", "5th Settlement", "Smart Village", "Heliopolis"][i],
  is_featured: i % 2 === 0,
}));
const MOCK_PROJECTS = [
  { id: "m1", title: "Marassi North Coast", developer: "Emaar Misr", built_area: 120, total_area: 6200, total_units: 5000 },
  { id: "m2", title: "The Crown New Cairo", developer: "Palm Hills", built_area: 85, total_area: 3100, total_units: 1200 },
  { id: "m3", title: "Zaha Park", developer: "Ora Developers", built_area: 95, total_area: 4500, total_units: 2800 },
  { id: "m4", title: "Capital Gardens", developer: "Madinet Masr", built_area: 110, total_area: 5000, total_units: 3500 },
  { id: "m5", title: "Sarai New Cairo", developer: "Madinet Masr", built_area: 130, total_area: 7000, total_units: 6000 },
];
const MOCK_AGENTS = [
  { id: "a1", full_name: "Ahmed Hassan", properties: 34, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=70" },
  { id: "a2", full_name: "Sara Mohamed", properties: 21, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=70" },
  { id: "a3", full_name: "Omar Khalil", properties: 58, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=70" },
  { id: "a4", full_name: "Nour Adel", properties: 15, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=70" },
  { id: "a5", full_name: "Karim Samir", properties: 42, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=70" },
];
const MOCK_AGENCIES = [
  { id: "ag1", name: "Coldwell Banker", properties: 142, agents: 28, address: "New Cairo", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=70" },
  { id: "ag2", name: "RE/MAX Egypt", properties: 98, agents: 19, address: "Sheikh Zayed", logo: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&q=70" },
  { id: "ag3", name: "JLL Egypt", properties: 215, agents: 45, address: "Downtown Cairo", logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&q=70" },
  { id: "ag4", name: "Nawy Real Estate", properties: 183, agents: 37, address: "5th Settlement", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&q=70" },
];
const MOCK_DEVS = [
  { id: "d1", name: "Emaar Misr", projects: 12, logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&q=70" },
  { id: "d2", name: "Palm Hills", projects: 9, logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=70" },
  { id: "d3", name: "Ora Developers", projects: 7, logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=70" },
  { id: "d4", name: "Madinet Masr", projects: 15, logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&q=70" },
];

const QUICK_LINKS = [
  { label: "🏠 Buy", path: "/m/find/property?purpose=sale" },
  { label: "🔑 Rent", path: "/m/find/property?purpose=rent" },
  { label: "🏗 Projects", path: "/m/find/project" },
  { label: "👤 Agents", path: "/m/find/agent" },
  { label: "🏢 Agencies", path: "/m/find/agent" },
  { label: "📋 Requests", path: "/m/find/buy-request" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, viewAllPath, navigate }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-black text-gray-900 text-base">{title}</h2>
      {viewAllPath && (
        <button onClick={() => navigate(viewAllPath)} className="text-[#FF6B00] text-sm font-semibold flex items-center gap-0.5">
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function PropertyCard({ property, index }) {
  const [saved, setSaved] = useState(false);
  const image = property.featured_image || FALLBACK_PROP_IMAGES[index % FALLBACK_PROP_IMAGES.length];
  const badgeColor = PURPOSE_COLORS[property.purpose] || "bg-gray-700";
  return (
    <Link to={`/property/${property.id}`} className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ width: "72vw", maxWidth: 260 }}>
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt={property.title} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 ${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}>
          {(property.purpose || "FOR SALE").toUpperCase()}
        </span>
        {property.is_featured && (
          <span className="absolute top-2 right-8 bg-[#FF6B00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">FEATURED</span>
        )}
        <button onClick={e => { e.preventDefault(); setSaved(!saved); }}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
          <Heart size={12} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3">
        <p className="font-black text-sm text-[#FF6B00] leading-tight">
          {property.price_min ? `${Number(property.price_min).toLocaleString()} ${property.currency || "USD"}` : "Price on Request"}
        </p>
        <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{property.title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{property.address}</p>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
          {property.beds > 0 && <span className="flex items-center gap-0.5"><BedDouble size={10} className="text-[#FF6B00]" />{property.beds}</span>}
          <span className="flex items-center gap-0.5"><Bath size={10} className="text-[#FF6B00]" />{property.baths}</span>
          <span className="flex items-center gap-0.5"><Maximize2 size={10} className="text-[#FF6B00]" />{property.area_size}m²</span>
        </div>
      </div>
    </Link>
  );
}

function ProjectCard({ project, index }) {
  const image = project.featured_image || FALLBACK_PROJ_IMAGES[index % FALLBACK_PROJ_IMAGES.length];
  return (
    <Link to={`/project-details/${project.id}`} className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ width: "72vw", maxWidth: 260 }}>
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt={project.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <p className="font-black text-sm text-gray-900 truncate">{project.title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{project.developer || project.developer_name || "Developer"}</p>
        <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-gray-100 text-center">
          <div><p className="text-[9px] text-gray-400">Build</p><p className="text-[10px] font-bold text-gray-700">{project.built_area ? `${project.built_area}m²` : "—"}</p></div>
          <div><p className="text-[9px] text-gray-400">Total</p><p className="text-[10px] font-bold text-gray-700">{project.total_area ? `${project.total_area}m²` : "—"}</p></div>
          <div><p className="text-[9px] text-gray-400">Units</p><p className="text-[10px] font-bold text-gray-700">{project.total_units?.toLocaleString() || "—"}</p></div>
        </div>
      </div>
    </Link>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2" style={{ width: 130 }}>
      <img src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.full_name)}&background=FF6B00&color=fff`}
        alt={agent.full_name} className="w-14 h-14 rounded-full object-cover border-2 border-orange-100" />
      <div className="text-center">
        <p className="text-xs font-bold text-gray-900 leading-tight">{agent.full_name}</p>
        <p className="text-[10px] text-[#FF6B00] font-semibold mt-0.5">{agent.properties} Props</p>
        <p className="text-[9px] text-gray-400">Real Estate Agent</p>
      </div>
      <Link to={`/agent-profile/${agent.id}`}
        className="w-full text-center bg-[#FF6B00] text-white text-[10px] font-bold py-1.5 rounded-lg">
        View Profile
      </Link>
    </div>
  );
}

function AgencyCard({ agency }) {
  return (
    <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ width: "72vw", maxWidth: 240 }}>
      <div className="h-24 overflow-hidden">
        <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <p className="text-xs font-bold text-gray-900 truncate">{agency.name}</p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={9} className="text-[#FF6B00]" />{agency.address}</p>
        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Users size={9} className="text-[#FF6B00]" />{agency.agents} Agents · {agency.properties} Props</p>
        <Link to={`/agency-profile/${agency.id}`}
          className="block w-full text-center bg-[#FF6B00] text-white text-[10px] font-bold py-1.5 rounded-lg mt-2">
          View Profile
        </Link>
      </div>
    </div>
  );
}

function DeveloperCard({ dev }) {
  return (
    <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ width: 130 }}>
      <div className="h-20 overflow-hidden relative">
        <img src={dev.logo} alt={dev.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-1.5 left-2 text-white font-black text-[10px] drop-shadow">{dev.name}</p>
      </div>
      <div className="p-2 text-center">
        <p className="text-[10px] text-[#FF6B00] font-bold">{dev.projects} Projects</p>
        <Link to={`/developer-profile/${dev.id}`}
          className="block w-full text-center bg-[#FF6B00] text-white text-[10px] font-bold py-1 rounded-lg mt-1">
          Profile
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MobileHomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("For Sale");
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    base44.entities.Property.filter({ is_featured: true, is_active: true }, "-created_date", 20)
      .then(data => setProperties(data.length > 0 ? data : MOCK_PROPS))
      .catch(() => setProperties(MOCK_PROPS));

    base44.entities.Project.filter({ is_featured: true, is_active: true }, "-created_date", 10)
      .then(data => setProjects(data.length > 0 ? data : MOCK_PROJECTS))
      .catch(() => setProjects(MOCK_PROJECTS));

    base44.entities.User.list()
      .then(data => {
        const filtered = data.filter(u => u.role === "agent" || u.role === "user");
        setAgents(filtered.length >= 3 ? filtered : MOCK_AGENTS);
      })
      .catch(() => setAgents(MOCK_AGENTS));
  }, []);

  const filteredProps = properties.length > 0
    ? properties.filter(p => !p.purpose || p.purpose === activeTab)
    : MOCK_PROPS.filter(p => p.purpose === activeTab);

  const displayProps = filteredProps.length > 0 ? filteredProps : MOCK_PROPS.slice(0, 4);

  return (
    <div className="min-h-full bg-gray-50 pb-28">

      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/da095c8f7_1255.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d1a]/85 via-[#1a1a2e]/75 to-[#1a1a2e]/60" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B00] via-[#FF6B00]/50 to-transparent" />

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex flex-col items-center justify-center gap-1"
        >
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
        </button>

        <div className="relative z-10 px-4 pt-5 pb-6">
          <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-pulse" />
            <span className="text-[#FF6B00] text-[10px] font-bold tracking-wide">KEMEDAR® PROPTECH PLATFORM</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-1">
            Find Your Next Property.<br />
            <span className="text-[#FF6B00]">Build Your Next Future.</span>
          </h1>
          <p className="text-gray-300 text-xs leading-relaxed mb-4">
            Buy, rent, invest, and discover trusted real estate opportunities.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-5">
            {[{ v: "2M+", l: "Properties" }, { v: "110+", l: "Filters" }, { v: "20+", l: "Free Tools" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-base font-black text-[#FF6B00]">{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search properties, projects..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              onKeyDown={e => e.key === "Enter" && navigate(`/m/find/property?q=${search}`)}
            />
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate("/m/find/property")}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF6B00] text-white font-bold text-xs py-2.5 rounded-xl">
              <ArrowRight size={14} /> Explore Properties
            </button>
            <button onClick={() => navigate("/m/add/property")}
              className="flex-1 flex items-center justify-center gap-1.5 border-2 border-white/50 text-white font-bold text-xs py-2.5 rounded-xl">
              <Plus size={14} /> List Property
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pt-5">

        {/* Quick Links */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {QUICK_LINKS.map(link => (
            <button key={link.path} onClick={() => navigate(link.path)}
              className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              {link.label}
            </button>
          ))}
        </div>

        {/* Featured Properties */}
        <div>
          <SectionHeader title="Featured Properties" viewAllPath="/m/find/property" navigate={navigate} />
          {/* Purpose tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
            {PURPOSES.map(p => (
              <button key={p} onClick={() => setActiveTab(p)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-colors"
                style={{ background: activeTab === p ? "#FF6B00" : "#f3f4f6", color: activeTab === p ? "#fff" : "#374151" }}>
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {displayProps.slice(0, 6).map((prop, i) => (
              <PropertyCard key={prop.id} property={prop} index={i} />
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div>
          <SectionHeader title="Featured Projects" viewAllPath="/m/find/project" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {projects.slice(0, 6).map((proj, i) => (
              <ProjectCard key={proj.id} project={proj} index={i} />
            ))}
          </div>
        </div>

        {/* Featured Agents */}
        <div>
          <SectionHeader title="Featured Agents" viewAllPath="/m/find/agent" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {agents.slice(0, 8).map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Featured Agencies */}
        <div>
          <SectionHeader title="Featured Agencies" viewAllPath="/m/find/agent" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {MOCK_AGENCIES.map(agency => (
              <AgencyCard key={agency.id} agency={agency} />
            ))}
          </div>
        </div>

        {/* Featured Developers */}
        <div>
          <SectionHeader title="Featured Developers" viewAllPath="/m/find/developer" navigate={navigate} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {MOCK_DEVS.map(dev => (
              <DeveloperCard key={dev.id} dev={dev} />
            ))}
          </div>
        </div>

        {/* AI Slider */}
        <div className="-mx-4">
          <KemedarAISlider />
        </div>

        {/* Franchise Banner */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 100%)" }}>
          <div className="p-5">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full px-3 py-1 mb-3">
              <span className="text-[#FF6B00] text-[10px] font-bold tracking-wide">KEMEDAR® FRANCHISE NETWORK</span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight mb-1">
              Find Our Franchise Owners<br />
              <span className="text-[#FF6B00]">Near You</span>
            </h3>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Connect with certified Kemedar franchise partners in your area for local real estate expertise.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={() => navigate("/m/find/franchise-owner")}
                className="flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                <Search size={14} /> Find Franchise Owners
              </button>
              <Link to="/user-benefits/franchise-owner-area"
                className="flex items-center justify-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] font-bold px-5 py-2.5 rounded-xl text-sm">
                Be a Franchise Owner <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}