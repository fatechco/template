import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, Plus, Users, Lock, Unlock, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const TYPE_CONFIG = {
  compound: { icon: "🏘", label: "Compound", color: "bg-orange-100 text-orange-700" },
  building: { icon: "🏢", label: "Building", color: "bg-blue-100 text-blue-700" },
  district: { icon: "🏙", label: "District", color: "bg-purple-100 text-purple-700" },
  city: { icon: "🌆", label: "City", color: "bg-teal-100 text-teal-700" },
  interest_group: { icon: "🎯", label: "Group", color: "bg-pink-100 text-pink-700" },
};

function CommunityCard({ community, isMember }) {
  const tc = TYPE_CONFIG[community.communityType] || TYPE_CONFIG.compound;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-20 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
        {community.coverPhotoUrl && <img src={community.coverPhotoUrl} alt="" className="w-full h-full object-cover opacity-80" />}
        {community.verifiedCommunity && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">✅ FO Verified</div>
        )}
      </div>
      <div className="px-3 -mt-4 relative">
        <div className="w-9 h-9 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-lg">
          {community.avatarUrl ? <img src={community.avatarUrl} className="w-full h-full rounded-full object-cover" /> : tc.icon}
        </div>
      </div>
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h3 className="font-black text-gray-900 text-xs leading-tight">{community.communityName}</h3>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${tc.color}`}>{tc.label}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
          <span className="flex items-center gap-0.5"><Users size={10} /> {community.totalMembers || 0}</span>
          <span>{community.privacyLevel === "private" ? <><Lock size={9} /> Private</> : <><Unlock size={9} /> Open</>}</span>
        </div>
        {community.description && <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{community.description}</p>}
        {isMember ? (
          <Link to={`/m/kemedar/community/${community.id}`} className="block text-center bg-orange-500 text-white font-bold py-1.5 rounded-xl text-[10px]">
            View →
          </Link>
        ) : (
          <div className="flex gap-1.5">
            <Link to={`/m/kemedar/community/${community.id}`} className="flex-1 text-center border border-gray-200 text-gray-600 font-bold py-1.5 rounded-xl text-[10px]">
              Preview
            </Link>
            <Link to={`/m/kemedar/community/${community.id}/join`} className="flex-1 text-center bg-orange-500 text-white font-bold py-1.5 rounded-xl text-[10px]">
              + Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityDiscoveryMobile() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.CommunityMember.filter({ userId: u.id }).then(setMyMemberships);
    }).catch(() => {});
    base44.entities.Community.list("-totalMembers", 50).then(c => { setCommunities(c); setLoading(false); });
  }, []);

  const joinedIds = new Set(myMemberships.filter(m => m.role !== "pending" && m.role !== "banned").map(m => m.communityId));
  const filtered = communities.filter(c => {
    const matchSearch = !search || c.communityName?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.communityType === filterType;
    return matchSearch && matchType && c.status === "active";
  });
  const myCommunities = filtered.filter(c => joinedIds.has(c.id));
  const discover = filtered.filter(c => !joinedIds.has(c.id));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "linear-gradient(135deg, #EA580C, #F59E0B)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/home"); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🏘 Community™</p>
        <button onClick={() => navigate("/m/kemedar/community/create")}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <Plus size={18} color="white" />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Hero */}
        <div className="px-5 pt-6 pb-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #EA580C 0%, #F59E0B 100%)" }}>
          <h1 className="text-2xl font-black mb-1">Kemedar Community™</h1>
          <p className="text-orange-100 text-sm mb-4">Connect with your neighbors. Stay informed. Thrive together.</p>
          <Link to="/m/kemedar/community/how-it-works"
            className="inline-block bg-white/20 border border-white/30 text-white font-bold text-xs px-4 py-2 rounded-full mb-4">
            🧠 How Community drives every module →
          </Link>
          {/* Search */}
          <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search compound, building, area..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400" />
          </div>
        </div>

        {/* Filter */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[["all", "All"], ["compound", "🏘 Compound"], ["building", "🏢 Building"], ["district", "🏙 District"], ["city", "🌆 City"]].map(([val, label]) => (
              <button key={val} onClick={() => setFilterType(val)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{ background: filterType === val ? "#EA580C" : "#f3f4f6", color: filterType === val ? "#fff" : "#374151" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-orange-400" /></div>
          ) : (
            <>
              {myCommunities.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-black text-gray-900 text-sm mb-3">My Communities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {myCommunities.map(c => <CommunityCard key={c.id} community={c} isMember />)}
                  </div>
                </div>
              )}

              <h2 className="font-black text-gray-900 text-sm mb-3">Discover Communities</h2>
              {discover.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-2">🏘</p>
                  <p className="font-bold text-sm">No communities found</p>
                  <p className="text-xs mt-1">Be the first to create one!</p>
                  <button onClick={() => navigate("/m/kemedar/community/create")}
                    className="mt-3 bg-orange-500 text-white font-bold px-5 py-2 rounded-xl text-xs">
                    + Create Community
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {discover.map(c => <CommunityCard key={c.id} community={c} isMember={false} />)}
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}