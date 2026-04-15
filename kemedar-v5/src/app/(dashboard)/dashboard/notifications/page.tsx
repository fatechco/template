"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Bell, Check, Trash2, Info, AlertTriangle, MessageSquare } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "message" | "system";
  isRead: boolean;
  createdAt: string;
}

const typeIcons = { info: Info, warning: AlertTriangle, message: MessageSquare, system: Bell };
const typeColors = { info: "text-blue-600 bg-blue-50", warning: "text-amber-600 bg-amber-50", message: "text-green-600 bg-green-50", system: "text-slate-600 bg-slate-100" };

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications - replace with real API call
    const timer = setTimeout(() => {
      setNotifications([]);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications {unreadCount > 0 && <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded-full ml-2">{unreadCount}</span>}</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No new notifications</h3>
          <p className="text-sm mt-1">You&apos;ll see alerts for messages, offers, and updates here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = typeIcons[n.type];
            return (
              <div key={n.id} className={`bg-white border rounded-xl p-4 flex items-start gap-3 transition ${!n.isRead ? "border-blue-200 bg-blue-50/30" : ""}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[n.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)} className="p-1.5 hover:bg-slate-100 rounded" title="Mark as read">
                      <Check className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                  <button onClick={() => removeNotification(n.id)} className="p-1.5 hover:bg-slate-100 rounded" title="Remove">
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
