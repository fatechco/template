import { Bell, X } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, type: "order", title: "New Order Received", message: "Ahmed Hassan ordered your service", time: "2m ago", icon: "📦" },
  { id: 2, type: "message", title: "New Message", message: "Fatima sent you a message", time: "1h ago", icon: "💬" },
  { id: 3, type: "payment", title: "Payment Received", message: "$500 payment confirmed", time: "3h ago", icon: "💰" },
  { id: 4, type: "review", title: "New Review", message: "Mohamed left you a 5-star review", time: "1d ago", icon: "⭐" },
];

export default function ProNotificationsPage() {
  const unreadCount = NOTIFICATIONS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">🔔 Notifications</h1>
        <button className="text-xs font-bold text-amber-600 hover:text-amber-700">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map(notif => (
          <div key={notif.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="text-2xl flex-shrink-0">{notif.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">{notif.title}</p>
              <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}