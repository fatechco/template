import PostCard from "@/components/community/PostCard";

export default function CommunityEveningFeed({ posts, items, events, community, user, onUpdate }) {
  const marketplaceItems = items.slice(0, 6);
  const todayEvents = events.filter(e => {
    const d = new Date(e.startsAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() || (d - now) / 86400000 <= 3;
  }).slice(0, 3);
  const announcements = posts.filter(p => p.postType === "announcement" || p.isPinned).slice(0, 2);
  const recent = posts.filter(p => {
    const age = (new Date() - new Date(p.created_date)) / 3600000;
    return age <= 6;
  }).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Evening greeting */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
        <p className="text-2xl font-black mb-0.5">🌙 Good Evening!</p>
        <p className="text-indigo-200 text-sm">
          {marketplaceItems.length > 0
            ? `${marketplaceItems.length} items available in your compound marketplace`
            : "Catch up on today's community news"}
        </p>
      </div>

      {/* Compound Marketplace */}
      {marketplaceItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-black text-gray-900 text-sm">🛍 Compound Marketplace</p>
            <span className="text-xs text-orange-500 font-bold">{marketplaceItems.length} listings</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {marketplaceItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {item.photos?.[0]
                  ? <img src={item.photos[0]} alt="" className="w-full h-28 object-cover" />
                  : <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                      {item.category === "furniture" ? "🛋️" : item.category === "electronics" ? "📺" : item.category === "books" ? "📚" : "📦"}
                    </div>
                }
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 truncate">{item.title}</p>
                  <p className={`text-xs font-bold mt-0.5 ${item.isFree ? "text-green-600" : "text-teal-600"}`}>
                    {item.isFree ? "🎁 Free" : `${item.price?.toLocaleString()} EGP${item.isNegotiable ? " (neg.)" : ""}`}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-gray-400">Unit {item.sellerUnit}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.condition === "new" ? "bg-green-100 text-green-700" :
                      item.condition === "like_new" ? "bg-teal-100 text-teal-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{item.condition?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekend / upcoming events */}
      {todayEvents.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">📅 Don't Miss These Events</p>
          <div className="space-y-2">
            {todayEvents.map(e => {
              const isToday = new Date(e.startsAt).toDateString() === new Date().toDateString();
              return (
                <div key={e.id} className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl flex-shrink-0 p-2 rounded-xl ${isToday ? "bg-purple-100" : "bg-gray-100"}`}>
                      {e.eventType === "social" ? "🎉" : e.eventType === "meeting" ? "🏛️" : e.eventType === "sports" ? "⚽" : e.eventType === "market" ? "🛒" : "📅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-gray-900 text-sm">{e.title}</p>
                        {isToday && <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">TODAY</span>}
                      </div>
                      <p className="text-xs text-gray-500">{e.location} · {new Date(e.startsAt).toLocaleString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                      {e.attendeeCount > 0 && <p className="text-xs text-purple-600 mt-0.5">👥 {e.attendeeCount} attending</p>}
                    </div>
                    <button className="flex-shrink-0 text-xs bg-purple-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-purple-600 transition-colors">
                      RSVP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Evening announcements */}
      {announcements.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">📣 Compound Announcements</p>
          {announcements.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {/* Catch up: today's posts */}
      {recent.length > 0 && (
        <div>
          <p className="font-black text-gray-900 text-sm mb-2">💬 Today in Your Community</p>
          {recent.map(p => <PostCard key={p.id} post={p} currentUser={user} onUpdate={onUpdate} />)}
        </div>
      )}

      {marketplaceItems.length === 0 && todayEvents.length === 0 && recent.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🌙</p>
          <p className="font-bold">Quiet evening</p>
          <p className="text-sm mt-1">Post something for your neighbors to see tomorrow morning</p>
        </div>
      )}
    </div>
  );
}