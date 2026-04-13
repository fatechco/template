import PostCard from "@/components/community/PostCard";

export default function CommunityMorningFeed({ posts, alerts, items, community, user, onUpdate }) {
  const now = new Date();
  const isWeekend = now.getDay() === 5 || now.getDay() === 6; // Fri-Sat (Egypt weekend)
  const overnight = posts.filter(p => {
    const age = (now - new Date(p.created_date)) / 3600000;
    return age <= 10;
  });
  const announcements = posts.filter(p => p.postType === "announcement" || p.isPinned).slice(0, 3);
  const newItems = items.filter(i => {
    const age = (now - new Date(i.created_date)) / 3600000;
    return age <= 24;
  }).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Morning greeting */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
        <p className="text-2xl font-black mb-0.5">🌅 Good Morning{isWeekend ? " — Happy Weekend!" : "!"}</p>
        <p className="text-orange-100 text-sm">
          {alerts.length > 0
            ? `⚠️ ${alerts.length} active alert${alerts.length !== 1 ? "s" : ""} in your compound`
            : overnight.length > 0
            ? `${overnight.length} new posts while you slept`
            : "Your compound is quiet — have a great day!"}
        </p>
        {community?.totalMembers && (
          <p className="text-orange-200 text-xs mt-2">👥 {community.totalMembers} neighbors · {community.postsThisWeek || 0} posts this week</p>
        )}
      </div>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">🚨 Active Alerts</p>
          <div className="space-y-2">
            {alerts.slice(0, 3).map(a => (
              <div key={a.id} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                  {a.alertType === "water_cut" ? "💧" : a.alertType === "power_outage" ? "⚡" : a.alertType === "maintenance" ? "🔧" : "⚠️"}
                </span>
                <div className="flex-1">
                  <p className="font-black text-red-800 text-sm">{a.title}</p>
                  <p className="text-xs text-red-600 mt-0.5">{a.affectedArea || a.alertType?.replace(/_/g, " ")}</p>
                  {a.estimatedResolution && (
                    <p className="text-xs text-gray-500 mt-1">Est. resolution: {new Date(a.estimatedResolution).toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" })}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">🔴 ONGOING</span>
                    {a.confirmations > 0 && <span className="text-[10px] text-gray-500">{a.confirmations} confirmed</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pinned / Announcements */}
      {announcements.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">📣 Community Announcements</p>
          {announcements.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* Overnight posts */}
      {overnight.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">🌙 While You Were Away</p>
          {overnight.slice(0, 3).map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* New marketplace */}
      {newItems.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">🛍 New Listings This Morning</p>
          <div className="grid grid-cols-2 gap-3">
            {newItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {item.photos?.[0]
                  ? <img src={item.photos[0]} alt="" className="w-full h-28 object-cover" />
                  : <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-3xl">🛍</div>
                }
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs font-bold text-teal-600 mt-0.5">{item.isFree ? "Free 🎁" : `${item.price?.toLocaleString()} EGP`}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Unit {item.sellerUnit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {overnight.length === 0 && announcements.length === 0 && alerts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">😴</p>
          <p className="font-bold">All quiet overnight</p>
          <p className="text-sm">Check back during the day for updates from neighbors</p>
        </div>
      )}
    </div>
  );
}