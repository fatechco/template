import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Bell, ShoppingBag, Calendar, Star, MessageCircle, ChevronRight, Zap, TrendingUp, Users, Package } from "lucide-react";
import PostCard from "@/components/community/PostCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import CommunityMorningFeed from "@/components/community/daily/CommunityMorningFeed";
import CommunityDayFeed from "@/components/community/daily/CommunityDayFeed";
import CommunityEveningFeed from "@/components/community/daily/CommunityEveningFeed";
import CommunityWeeklyDigest from "@/components/community/daily/CommunityWeeklyDigest";

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  if (h >= 18 && h < 23) return "evening";
  return "morning"; // late night → show morning for next day
}

const TABS = [
  { id: "morning", icon: "🌅", label: "Morning" },
  { id: "day", icon: "☀️", label: "Day" },
  { id: "evening", icon: "🌙", label: "Evening" },
  { id: "weekly", icon: "📋", label: "Weekly" },
];

export default function CommunityDaily() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(getTimeOfDay());
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [createPostType, setCreatePostType] = useState("general");

  useEffect(() => {
    load();
  }, [communityId]);

  const load = async () => {
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

    setCommunity(comm[0] || null);
    setPosts(postsData.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.created_date) - new Date(a.created_date);
    }));
    setAlerts(alertsData.filter(a => !a.isResolved));
    setEvents(eventsData.filter(e => e.status === "upcoming").sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)));
    setItems(itemsData);

    if (u) {
      const mem = await base44.entities.CommunityMember.filter({ communityId, userId: u.id });
      setMembership(mem[0] || null);
    }
    setLoading(false);
  };

  const isMember = membership && !["pending", "banned"].includes(membership.role);
  const isAdmin = membership && ["admin", "owner", "moderator", "franchise_owner"].includes(membership.role);

  const openCreate = (type = "general") => {
    setCreatePostType(type);
    setShowCreatePost(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!community) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Community not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/kemedar/community/${communityId}`} className="text-gray-400 text-xl">←</Link>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm truncate">{community.communityName}</p>
            <p className="text-xs text-gray-400">Daily life · {new Date().toLocaleDateString("en-EG", { weekday: "long", month: "short", day: "numeric" })}</p>
          </div>
          <Link to={`/kemedar/community/${communityId}`} className="text-xs text-orange-500 font-bold">Full Feed →</Link>
        </div>

        {/* Time-of-day tabs */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active alerts banner */}
      {alerts.length > 0 && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">🚨</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-red-700 text-sm">{alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}</p>
              <p className="text-xs text-red-500 truncate">{alerts[0]?.title || alerts[0]?.alertType?.replace(/_/g, " ")}</p>
            </div>
            <Link to={`/kemedar/community/${communityId}`} className="text-xs text-red-600 font-black whitespace-nowrap">View →</Link>
          </div>
        </div>
      )}

      {/* Quick Action Bar */}
      {isMember && (
        <div className="max-w-lg mx-auto px-4 pt-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { icon: "💬", label: "Ask neighbors", type: "question" },
              { icon: "⭐", label: "Recommend", type: "recommendation" },
              { icon: "🛍", label: "Sell item", type: "marketplace" },
              { icon: "📢", label: "Alert", type: "alert" },
              { icon: "📊", label: "Poll", type: "poll" },
              { icon: "📅", label: "Event", type: "event" },
            ].map(a => (
              <button
                key={a.type}
                onClick={() => openCreate(a.type)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 font-semibold text-xs px-3 py-2 rounded-full hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        {activeTab === "morning" && (
          <CommunityMorningFeed
            posts={posts}
            alerts={alerts}
            items={items}
            community={community}
            user={user}
            onUpdate={load}
          />
        )}
        {activeTab === "day" && (
          <CommunityDayFeed
            posts={posts}
            events={events}
            user={user}
            isMember={isMember}
            onOpenCreate={openCreate}
            onUpdate={load}
          />
        )}
        {activeTab === "evening" && (
          <CommunityEveningFeed
            posts={posts}
            items={items}
            events={events}
            community={community}
            user={user}
            onUpdate={load}
          />
        )}
        {activeTab === "weekly" && (
          <CommunityWeeklyDigest
            community={community}
            posts={posts}
            items={items}
            events={events}
          />
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          communityId={communityId}
          currentUser={user}
          isAdmin={isAdmin}
          defaultType={createPostType}
          onClose={() => setShowCreatePost(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}