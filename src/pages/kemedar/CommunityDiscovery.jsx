import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, Users, Lock, Unlock, CheckCircle, Plus, MapPin } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all overflow-hidden group">
      {/* Cover */}
      <div className="h-24 relative bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
        {community.coverPhotoUrl && (
          <img src={community.coverPhotoUrl} alt="" className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {community.verifiedCommunity && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle size={10} /> FO Verified
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="px-4 -mt-5 relative">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow flex items-center justify-center text-xl">
          {community.avatarUrl ? <img src={community.avatarUrl} className="w-full h-full rounded-full object-cover" /> : tc.icon}
        </div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-gray-900 text-sm leading-tight">{community.communityName}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${tc.color}`}>{tc.label}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <span className="flex items-center gap-1"><Users size={11} /> {community.totalMembers || 0}</span>
          <span>{community.postsThisWeek || 0} posts/week</span>
          <span className="flex items-center gap-1">
            {community.privacyLevel === 'private' ? <><Lock size={10} /> Private</> : <><Unlock size={10} /> Open</>}
          </span>
        </div>

        {community.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{community.description}</p>
        )}

        {isMember ? (
          <Link to={`/kemedar/community/${community.id}`} className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs transition-colors">
            View Community →
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to={`/kemedar/community/${community.id}`} className="flex-1 text-center border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-xs hover:bg-gray-50 transition-colors">
              👁 Preview
            </Link>
            <Link to={`/kemedar/community/${community.id}/join`} className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-xs transition-colors">
              + Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityDiscovery() {
  const [communities, setCommunities] = useState([]);
  const [myMemberships, setMyMemberships] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
    Promise.all([
      base44.entities.Community.list("-totalMembers", 50),
    ]).then(([c]) => {
      setCommunities(c);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    base44.entities.CommunityMember.filter({ userId: user.id }).then(m => setMyMemberships(m));
  }, [user]);

  const joinedIds = new Set(myMemberships.filter(m => m.role !== 'pending' && m.role !== 'banned').map(m => m.communityId));
  const myCommunityIds = new Set(myMemberships.map(m => m.communityId));

  const filtered = communities.filter(c => {
    const matchSearch = !search || c.communityName.toLowerCase().includes(search.toLowerCase()) || c.compoundName?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || c.communityType === filterType;
    return matchSearch && matchType && c.status === 'active';
  });

  const myCommunities = communities.filter(c => joinedIds.has(c.id));
  const discover = filtered.filter(c => !joinedIds.has(c.id));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">🏘 Kemedar Community™</h1>
          <p className="text-gray-500 text-lg mb-4">Connect with your neighbors. Stay informed. Thrive together.</p>
          <Link to="/kemedar/community/how-it-works" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm px-5 py-2 rounded-full shadow hover:opacity-90 transition-opacity mb-6">
            🧠 See how Community™ drives Kemework, Kemetro, Match & more →
          </Link>
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <MapPin size={14} className="text-orange-500" />
              <span>Find your neighborhood community below</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search compound, building, or area..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
              />
            </div>
            <Link to="/kemedar/community/create" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Plus size={16} /> Create Community
            </Link>
          </div>
        </div>

        {/* My Communities */}
        {myCommunities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-4">My Communities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myCommunities.map(c => <CommunityCard key={c.id} community={c} isMember={true} />)}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[["all","All"], ["compound","🏘 Compound"], ["building","🏢 Building"], ["district","🏙 District"], ["city","🌆 City"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilterType(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${filterType === val ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Discover */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-4">Discover Communities</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-52 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : discover.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-3">🏘</p>
              <p className="font-bold text-lg">No communities found</p>
              <p className="text-sm mt-1">Be the first to create one for your compound!</p>
              <Link to="/kemedar/community/create" className="mt-4 inline-block bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-colors">
                Create Community
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {discover.map(c => <CommunityCard key={c.id} community={c} isMember={false} />)}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}