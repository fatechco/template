import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";
import PostCard from "@/components/community/PostCard";
import CreatePostModal from "@/components/community/CreatePostModal";

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  if (h >= 18 && h < 23) return "evening";
  return "morning";
}

const TABS = [
  { id: "morning", icon: "🌅", label: "Morning" },
  { id: "day", icon: "☀️", label: "Day" },
  { id: "evening", icon: "🌙", label: "Evening" },
  { id: "weekly", icon: "📋", label: "Weekly" },
];

export default function CommunityDailyMobile() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(getTimeOfDay());
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { load(); }, [communityId]);

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
    setPosts(postsData.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
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

  if (loading) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-orange-500" />
    </div>
  );

  if (!community) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center text-gray-500">
      Community not found
    </div>
  );

  // Simple morning/day/evening/weekly content
  const todayPosts = posts.slice(0, 10);
  const morningPosts = todayPosts.filter(p => ["announcement", "alert"].includes(p.postType) || p.isPinned);
  const dayPosts = todayPosts.filter(p => ["question", "general", "recommendation"].includes(p.postType));
  const eveningPosts = todayPosts.filter(p => ["marketplace", "event", "recommendation"].includes(p.postType));

  const tabPosts = tab === "morning" ? morningPosts : tab === "day" ? dayPosts : tab === "evening" ? eveningPosts : todayPosts;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        <div className="px-4 py-2 flex items-center gap-3">
          <button onClick={() => navigate(`/m/kemedar/community/${communityId}`)}
            className="text-gray-400"><ArrowLeft size={20} /></button>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm truncate">{community.communityName}</p>
            <p className="text-[10px] text-gray-400">Daily · {new Date().toLocaleDateString("en-EG", { weekday: "long", month: "short", day: "numeric" })}</p>
          </div>
          <Link to={`/m/kemedar/community/${communityId}`} className="text-[10px] text-orange-500 font-bold">Full Feed →</Link>
        </div>

        {/* Time-of-day tabs */}
        <div className="px-4 pb-2 flex gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-bold transition-all"
              style={{ background: tab === t.id ? "#EA580C" : "#f3f4f6", color: tab === t.id ? "#fff" : "#6b7280" }}>
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 pt-3">
        {/* Alert banner */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-3 flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-red-700 text-xs">{alerts.length} Active Alert{alerts.length !== 1 ? "s" : ""}</p>
              <p className="text-[10px] text-red-500 truncate">{alerts[0]?.title}</p>
            </div>
          </div>
        )}

        {/* Quick actions */}
        {isMember && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
            {[
              { icon: "💬", label: "Ask", type: "question" },
              { icon: "⭐", label: "Recommend", type: "recommendation" },
              { icon: "🛍", label: "Sell", type: "marketplace" },
              { icon: "📊", label: "Poll", type: "poll" },
            ].map(a => (
              <button key={a.type} onClick={() => setShowCreate(true)}
                className="flex-shrink-0 flex items-center gap-1 bg-white border border-gray-200 text-gray-700 font-semibold text-[10px] px-2.5 py-1.5 rounded-full">
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab heading */}
        <div className="mb-3">
          {tab === "morning" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
              <p className="font-black text-amber-800 text-xs">🌅 Good Morning!</p>
              <p className="text-[10px] text-amber-700 mt-0.5">Here are today's announcements and alerts for your community.</p>
            </div>
          )}
          {tab === "day" && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
              <p className="font-black text-blue-800 text-xs">☀️ Daytime Activity</p>
              <p className="text-[10px] text-blue-700 mt-0.5">Questions, discussions, and recommendations from your neighbors.</p>
            </div>
          )}
          {tab === "evening" && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3">
              <p className="font-black text-purple-800 text-xs">🌙 Evening Digest</p>
              <p className="text-[10px] text-purple-700 mt-0.5">Marketplace items, events, and top recommendations.</p>
            </div>
          )}
          {tab === "weekly" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3">
              <p className="font-black text-orange-800 text-xs">📋 Weekly Summary</p>
              <p className="text-[10px] text-orange-700 mt-0.5">This week: {posts.length} posts · {alerts.length} alerts · {events.length} events · {items.length} marketplace items</p>
            </div>
          )}
        </div>

        {/* Events strip (evening/weekly) */}
        {(tab === "evening" || tab === "weekly") && events.length > 0 && (
          <div className="mb-3">
            <p className="font-black text-gray-900 text-xs mb-2">📅 Upcoming Events</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {events.slice(0, 4).map(e => (
                <div key={e.id} className="flex-shrink-0 bg-white rounded-xl border border-gray-100 p-2.5" style={{ width: 160 }}>
                  <p className="font-bold text-gray-900 text-[10px] line-clamp-2">{e.title}</p>
                  <p className="text-[9px] text-orange-500 mt-0.5">{new Date(e.startsAt).toLocaleDateString("en-EG", { month: "short", day: "numeric" })}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Marketplace strip (evening/weekly) */}
        {(tab === "evening" || tab === "weekly") && items.length > 0 && (
          <div className="mb-3">
            <p className="font-black text-gray-900 text-xs mb-2">🛍 For Sale / Free</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {items.slice(0, 4).map(item => (
                <div key={item.id} className="flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ width: 120 }}>
                  {item.photos?.[0] && <img src={item.photos[0]} alt="" className="w-full h-16 object-cover" />}
                  <div className="p-1.5">
                    <p className="font-bold text-gray-900 text-[9px] line-clamp-1">{item.title}</p>
                    <p className="text-[9px] font-black text-teal-600">{item.isFree ? "Free 🎁" : `${item.price} EGP`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        {tabPosts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">💬</p>
            <p className="font-bold text-sm">Nothing here yet</p>
            <p className="text-xs mt-0.5">Check other time slots or create a post!</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {tabPosts.map(post => (
              <PostCard key={post.id} post={post} currentUser={user} onUpdate={load} />
            ))}
          </div>
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
          onSuccess={load}
        />
      )}
    </div>
  );
}