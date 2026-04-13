import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Settings, Users, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";
import PostCard from "@/components/community/PostCard";
import CreatePostModal from "@/components/community/CreatePostModal";

const NAV_ITEMS = [
  { id: "feed", icon: "📢", label: "Feed" },
  { id: "announcements", icon: "📣", label: "Announce" },
  { id: "alerts", icon: "⚡", label: "Alerts" },
  { id: "marketplace", icon: "🛍", label: "Market" },
  { id: "events", icon: "📅", label: "Events" },
  { id: "recommendations", icon: "⭐", label: "Recs" },
];

const FILTER_MAP = {
  feed: null, announcements: "announcement", alerts: "alert",
  marketplace: "marketplace", events: "event", recommendations: "recommendation",
};

export default function CommunityHomeMobile() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [membership, setMembership] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState("feed");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { loadData(); }, [communityId]);

  const loadData = async () => {
    setLoading(true);
    const u = await base44.auth.me().catch(() => null);
    setUser(u);
    const [comm, postsData, alertsData, eventsData, itemsData] = await Promise.all([
      base44.entities.Community.filter({ id: communityId }),
      base44.entities.CommunityPost.filter({ communityId, status: "published" }),
      base44.entities.CommunityAlert.filter({ communityId }),
      base44.entities.CommunityEvent.filter({ communityId }),
      base44.entities.MarketplaceItem.filter({ communityId, status: "active" }),
    ]);
    setCommunity(comm[0]);
    setPosts(postsData.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.created_date) - new Date(a.created_date);
    }));
    setAlerts(alertsData.filter(a => !a.isResolved));
    setEvents(eventsData.filter(e => e.status === "upcoming").sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)));
    setItems(itemsData.slice(0, 6));
    if (u) {
      const mem = await base44.entities.CommunityMember.filter({ communityId, userId: u.id });
      setMembership(mem[0] || null);
    }
    setLoading(false);
  };

  const isMember = membership && !["pending", "banned"].includes(membership.role);
  const isAdmin = membership && ["admin", "owner", "moderator", "franchise_owner"].includes(membership.role);
  const activeAlerts = alerts;

  const filteredPosts = posts.filter(p => {
    const typeFilter = FILTER_MAP[section];
    return typeFilter ? p.postType === typeFilter : true;
  });

  if (loading) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-orange-500" />
    </div>
  );

  if (!community) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center text-gray-500">
      <div className="text-center">
        <p className="text-4xl mb-2">🏘</p>
        <p className="font-bold">Community not found</p>
        <button onClick={() => navigate("/m/kemedar/community")} className="mt-3 text-orange-500 font-bold text-sm">← Back</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Cover + Header */}
      <div style={{ flexShrink: 0 }}>
        <div className="h-28 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden"
          style={{ paddingTop: "env(safe-area-inset-top, 0)" }}>
          {community.coverPhotoUrl && <img src={community.coverPhotoUrl} alt="" className="w-full h-full object-cover opacity-80" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-0 left-0 right-0 px-4 flex items-center justify-between" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
            <button onClick={() => navigate("/m/kemedar/community")}
              className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <ArrowLeft size={18} color="white" />
            </button>
            <div className="flex items-center gap-2">
              <Link to={`/m/kemedar/community/${communityId}/daily`}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "rgba(0,0,0,0.3)" }}>
                🌅 Daily
              </Link>
              {isAdmin && (
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <Settings size={14} color="white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Community info */}
        <div className="bg-white px-4 pb-3 pt-0 border-b border-gray-100 -mt-1">
          <div className="flex items-end gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 border-4 border-white shadow flex items-center justify-center text-2xl -mt-6 flex-shrink-0">
              {community.avatarUrl ? <img src={community.avatarUrl} className="w-full h-full rounded-xl object-cover" /> : "🏘"}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-black text-gray-900 text-sm">{community.communityName}</h1>
                {community.verifiedCommunity && <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-full">✅ FO</span>}
              </div>
              <p className="text-[10px] text-gray-400 flex items-center gap-2">
                <span><Users size={10} className="inline mr-0.5" />{community.totalMembers} members</span>
                {activeAlerts.length > 0 && <span className="text-red-600 font-bold">⚡ {activeAlerts.length} alerts</span>}
              </p>
            </div>
            {!isMember ? (
              <Link to={`/m/kemedar/community/${communityId}/join`}
                className="bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] flex-shrink-0">
                + Join
              </Link>
            ) : (
              <button onClick={() => setShowCreate(true)}
                className="bg-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] flex-shrink-0 flex items-center gap-1">
                <Plus size={12} /> Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 flex-shrink-0">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-colors"
              style={{ background: section === item.id ? "#EA580C" : "#f3f4f6", color: section === item.id ? "#fff" : "#6b7280" }}>
              {item.icon} {item.label}
              {item.id === "alerts" && activeAlerts.length > 0 && (
                <span className="bg-red-500 text-white text-[8px] font-black px-1 py-0 rounded-full">{activeAlerts.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 pt-3">
        {/* Alert banner */}
        {activeAlerts.length > 0 && section !== "alerts" && (
          <button onClick={() => setSection("alerts")}
            className="w-full bg-red-50 border border-red-200 rounded-2xl p-3 mb-3 flex items-center gap-2 text-left">
            <span className="text-xl">🚨</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-red-700 text-xs">{activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}</p>
              <p className="text-[10px] text-red-500 truncate">{activeAlerts[0]?.title}</p>
            </div>
          </button>
        )}

        {/* Create post bar */}
        {isMember && section === "feed" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-3 mb-3 flex items-center gap-2"
            onClick={() => setShowCreate(true)}>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-xs flex-shrink-0">
              {user?.full_name?.charAt(0)}
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-xs text-gray-400">
              Share with your community...
            </div>
          </div>
        )}

        {/* Alerts section */}
        {section === "alerts" && (
          activeAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p className="font-bold text-sm">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeAlerts.map(a => (
                <div key={a.id} className="bg-red-50 border border-red-200 rounded-2xl p-3">
                  <p className="font-black text-red-700 text-xs">{a.alertType?.replace(/_/g, " ")}</p>
                  <p className="text-[10px] text-red-600 mt-0.5">{a.title}</p>
                  {a.affectedArea && <p className="text-[10px] text-red-500 mt-0.5">📍 {a.affectedArea}</p>}
                </div>
              ))}
            </div>
          )
        )}

        {/* Events section */}
        {section === "events" && (
          events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📅</p>
              <p className="font-bold text-sm">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map(e => (
                <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-3">
                  <p className="font-black text-gray-900 text-xs">{e.title}</p>
                  <p className="text-[10px] text-orange-500 mt-0.5">{new Date(e.startsAt).toLocaleDateString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              ))}
            </div>
          )
        )}

        {/* Marketplace section */}
        {section === "marketplace" && (
          items.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🛍</p>
              <p className="font-bold text-sm">No items for sale</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {item.photos?.[0] && <img src={item.photos[0]} alt="" className="w-full h-24 object-cover" />}
                  <div className="p-2">
                    <p className="font-bold text-gray-900 text-[10px] line-clamp-2">{item.title}</p>
                    <p className="text-[10px] font-black text-teal-600 mt-0.5">{item.isFree ? "Free 🎁" : `${item.price} EGP`}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Posts feed (for feed, announcements, recommendations) */}
        {!["alerts", "events", "marketplace"].includes(section) && (
          filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="font-bold text-sm">No posts yet</p>
              {isMember && <button onClick={() => setShowCreate(true)} className="mt-2 text-orange-500 font-bold text-xs">Be the first to post!</button>}
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} currentUser={user} onUpdate={loadData} />
              ))}
            </div>
          )
        )}

        <div className="h-20" />
      </div>

      <MobileBottomNav />

      {showCreate && (
        <CreatePostModal
          communityId={communityId}
          currentUser={user}
          isAdmin={isAdmin}
          onClose={() => setShowCreate(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}