import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Users, Bell, ShoppingBag, BarChart2, Calendar, Star, Settings, ChevronRight, Plus } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";
import PostCard from "@/components/community/PostCard";
import CreatePostModal from "@/components/community/CreatePostModal";

const NAV_ITEMS = [
  { id: "feed", icon: "📢", label: "Feed" },
  { id: "announcements", icon: "📣", label: "Announcements" },
  { id: "alerts", icon: "⚡", label: "Alerts" },
  { id: "marketplace", icon: "🛍", label: "Marketplace" },
  { id: "polls", icon: "📊", label: "Polls" },
  { id: "events", icon: "📅", label: "Events" },
  { id: "recommendations", icon: "⭐", label: "Recommendations" },
];

const FILTER_MAP = {
  feed: null,
  announcements: "announcement",
  alerts: "alert",
  marketplace: "marketplace",
  polls: "poll",
  events: "event",
  recommendations: "recommendation",
};

export default function CommunityHome() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [membership, setMembership] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("feed");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postFilter, setPostFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, [communityId]);

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
    setPosts(postsData.sort((a,b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.created_date) - new Date(a.created_date);
    }));
    setAlerts(alertsData);
    setEvents(eventsData.filter(e => e.status === "upcoming").sort((a,b) => new Date(a.startsAt) - new Date(b.startsAt)));
    setItems(itemsData.slice(0, 3));

    if (u) {
      const mem = await base44.entities.CommunityMember.filter({ communityId, userId: u.id });
      setMembership(mem[0] || null);
    }
    setLoading(false);
  };

  const activeAlerts = alerts.filter(a => !a.isResolved);
  const isAdmin = membership && ["admin", "owner", "moderator", "franchise_owner"].includes(membership.role);
  const isMember = membership && !["pending", "banned"].includes(membership.role);

  const filteredPosts = posts.filter(p => {
    const typeFilter = FILTER_MAP[activeSection];
    if (!typeFilter) {
      if (postFilter !== "all") return p.postType === postFilter;
      return true;
    }
    return p.postType === typeFilter;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!community) return <div className="p-8 text-center text-gray-500">Community not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />

      {/* Cover */}
      <div className="h-36 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
        {community.coverPhotoUrl && <img src={community.coverPhotoUrl} className="w-full h-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Community info row */}
        <div className="bg-white rounded-b-2xl shadow-sm px-6 pb-4 pt-0 mb-4 flex items-end gap-4 -mt-1">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 border-4 border-white shadow flex items-center justify-center text-3xl -mt-8 flex-shrink-0">
            {community.avatarUrl ? <img src={community.avatarUrl} className="w-full h-full rounded-xl object-cover" /> : "🏘"}
          </div>
          <div className="flex-1 pt-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-gray-900 text-xl">{community.communityName}</h1>
              {community.verifiedCommunity && <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">✅ FO Verified</span>}
              <span className="text-xs bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full capitalize">{community.communityType}</span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-3">
              <span><Users size={12} className="inline mr-1" />{community.totalMembers} members</span>
              <span>{community.postsThisWeek || 0} posts this week</span>
              {activeAlerts.length > 0 && <span className="text-red-600 font-bold">⚡ {activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isMember && (
              <Link to={`/kemedar/community/${communityId}/join`} className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
                + Join Community
              </Link>
            )}
            {isMember && (
              <button onClick={() => setShowCreatePost(true)} className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Plus size={16} /> Create Post
              </button>
            )}
            <Link to={`/kemedar/community/${communityId}/daily`} className="border border-orange-200 text-orange-600 font-bold px-3 py-2 rounded-xl text-sm hover:bg-orange-50 flex items-center gap-1.5">
              🌅 Daily
            </Link>
            {isAdmin && (
              <Link to={`/kemedar/community/${communityId}/manage`} className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-xl text-sm hover:bg-gray-50">
                <Settings size={16} />
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left sidebar */}
          <div className="w-60 flex-shrink-0 space-y-3 sticky top-4 self-start hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm p-3">
              <nav className="space-y-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === item.id ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.id === "alerts" && activeAlerts.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{activeAlerts.length}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <p className="font-black text-gray-900 text-sm mb-3">📊 Community Stats</p>
              {[
                ["Active members", community.activeMembers || community.totalMembers || 0],
                ["Posts this month", community.totalPosts || 0],
                ["Marketplace items", community.totalMarketplaceItems || 0],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-black text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Active alerts banner */}
            {activeAlerts.length > 0 && activeSection !== "alerts" && (
              <button onClick={() => setActiveSection("alerts")} className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-3 flex items-center gap-3 hover:bg-red-100 transition-colors text-left">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <p className="font-black text-red-700 text-sm">{activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}</p>
                  <p className="text-xs text-red-600">{activeAlerts[0]?.title}</p>
                </div>
                <ChevronRight size={16} className="text-red-400" />
              </button>
            )}

            {/* Create post bar */}
            {isMember && (
              <div className="bg-white rounded-2xl shadow-sm p-4 mb-3 flex items-center gap-3 cursor-pointer hover:border-orange-300 border border-gray-100 transition-colors" onClick={() => setShowCreatePost(true)}>
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-black text-orange-600 text-sm flex-shrink-0">
                  {user?.full_name?.charAt(0)}
                </div>
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-400">
                  Share with your community...
                </div>
              </div>
            )}

            {/* Feed filters (main feed only) */}
            {activeSection === "feed" && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {[["all","All"], ["announcement","📣 Announcements"], ["alert","⚡ Alerts"], ["marketplace","🛍 Market"], ["recommendation","⭐ Recs"], ["question","❓ Questions"]].map(([val, label]) => (
                  <button key={val} onClick={() => setPostFilter(val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${postFilter === val ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
                <p className="text-4xl mb-2">💬</p>
                <p className="font-bold">No posts yet</p>
                {isMember && <button onClick={() => setShowCreatePost(true)} className="mt-3 text-orange-500 font-bold text-sm hover:underline">Be the first to post!</button>}
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} currentUser={user} onUpdate={loadData} />
              ))
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-60 flex-shrink-0 space-y-3 sticky top-4 self-start hidden xl:block">
            {activeAlerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="font-black text-red-700 text-sm mb-3">⚡ Active Alerts</p>
                {activeAlerts.slice(0, 3).map(a => (
                  <div key={a.id} className="mb-2 pb-2 border-b border-red-100 last:border-0">
                    <p className="text-xs font-bold text-red-800">{a.alertType?.replace(/_/g, " ")}</p>
                    <p className="text-[10px] text-red-500">{a.affectedArea}</p>
                  </div>
                ))}
              </div>
            )}

            {events.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <p className="font-black text-gray-900 text-sm mb-3">📅 Upcoming Events</p>
                {events.slice(0, 2).map(e => (
                  <div key={e.id} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                    <p className="text-xs font-bold text-gray-900">{e.title}</p>
                    <p className="text-[10px] text-orange-500">{new Date(e.startsAt).toLocaleDateString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <p className="font-black text-gray-900 text-sm mb-3">🛍 For Sale/Free</p>
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 last:border-0">
                    {item.photos?.[0] && <img src={item.photos[0]} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-teal-600 font-bold">{item.isFree ? "Free 🎁" : `${item.price} EGP`}</p>
                    </div>
                  </div>
                ))}
                <Link to={`/kemedar/community/${communityId}/marketplace`} className="text-xs text-orange-500 font-bold hover:underline">View all →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          communityId={communityId}
          currentUser={user}
          isAdmin={isAdmin}
          onClose={() => setShowCreatePost(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}