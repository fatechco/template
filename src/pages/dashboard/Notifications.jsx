import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCheck, Bell, MessageCircle, Home, Settings } from "lucide-react";

const ALL_NOTIFS = [
  { id: 1, type: "property", icon: "🏠", title: "New match for your buy request", desc: "3 new properties match your buy request BR-001 in New Cairo.", time: "2 min ago", read: false },
  { id: 2, type: "message", icon: "💬", title: "New message from Ahmed Hassan", desc: "Ahmed sent you a message about your apartment listing in Maadi.", time: "1 hour ago", read: false },
  { id: 3, type: "property", icon: "👁", title: "Someone viewed your listing", desc: "Your apartment in New Cairo received 12 new views today.", time: "3 hours ago", read: false },
  { id: 4, type: "system", icon: "⭐", title: "You received a new review", desc: "Omar Khaled left a 5-star review on your property listing.", time: "Yesterday", read: true },
  { id: 5, type: "property", icon: "✅", title: "Your listing was approved", desc: "Your villa in Sheikh Zayed has been approved and is now live.", time: "2 days ago", read: true },
  { id: 6, type: "system", icon: "💳", title: "Subscription renewal reminder", desc: "Your Silver plan renews in 7 days. Make sure your payment is up to date.", time: "3 days ago", read: true },
  { id: 7, type: "message", icon: "💬", title: "New message from Fatima Mohamed", desc: "Fatima is interested in scheduling a viewing for your property.", time: "1 week ago", read: true },
  { id: 8, type: "property", icon: "📋", title: "Buy request received 5 new matches", desc: "Your buy request BR-002 for a villa in Sheikh Zayed has 5 new matches.", time: "1 week ago", read: true },
];

const TYPE_ICONS = { property: Home, message: MessageCircle, system: Settings };
const TYPE_COLORS = { property: "bg-blue-50", message: "bg-green-50", system: "bg-purple-50" };

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(ALL_NOTIFS);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => setNotifs(n => n.map(item => ({ ...item, read: true })));
  const markRead = (id) => setNotifs(n => n.map(item => item.id === id ? { ...item, read: true } : item));

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "properties") return n.type === "property";
    if (filter === "messages") return n.type === "message";
    if (filter === "system") return n.type === "system";
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline">
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "properties", label: "Properties" },
          { id: "messages", label: "Messages" },
          { id: "system", label: "System" },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === f.id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No notifications here</p>
          </div>
        )}
        {filtered.map(n => (
          <button key={n.id} onClick={() => navigate(`/cp/user/notifications/${n.id}`)} className={`w-full flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50 text-left ${!n.read ? "bg-blue-50/30" : ""}`}>
            <div className={`w-10 h-10 rounded-full ${TYPE_COLORS[n.type]} flex items-center justify-center text-lg flex-shrink-0`}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold ${n.read ? "text-gray-700" : "text-gray-900"}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{n.time}</span>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <Check size={11} /> Mark as read
                  </button>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}