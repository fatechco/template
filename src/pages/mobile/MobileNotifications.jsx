import { useState } from 'react';
import { ChevronLeft, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotificationManager } from '@/lib/notification-manager';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'properties', label: 'Properties' },
  { id: 'messages', label: 'Messages' },
  { id: 'orders', label: 'Orders' },
  { id: 'system', label: 'System' },
];

export default function MobileNotifications() {
  const navigate = useNavigate();
  const manager = getNotificationManager();
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(manager.getNotifications(activeFilter));
  const [swipeId, setSwipeId] = useState(null);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setNotifications(manager.getNotifications(filter));
  };

  const handleMarkAsRead = (id) => {
    manager.markAsRead(id);
    setNotifications(manager.getNotifications(activeFilter));
  };

  const handleDelete = (id) => {
    manager.deleteNotification(id);
    setNotifications(manager.getNotifications(activeFilter));
    setSwipeId(null);
  };

  const handleMarkAllAsRead = () => {
    manager.markAllAsRead();
    setNotifications(manager.getNotifications(activeFilter));
  };

  const unreadCount = manager.getUnreadCount();

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#1F2937]">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-black text-[#1F2937] text-lg">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-bold text-[#FF6B00] active:opacity-70"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-[#E5E7EB] overflow-x-auto no-scrollbar">
        <div className="flex gap-1 px-4 py-3">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <div className="text-4xl mb-4">🔔</div>
          <p className="text-lg font-black text-[#1F2937] mb-2">No notifications yet</p>
          <p className="text-sm text-[#6B7280] text-center leading-relaxed">
            We'll notify you about new properties, messages and updates
          </p>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] transition-all ${
                swipeId === notification.id ? 'translate-x-0' : ''
              }`}
              onTouchStart={() => setSwipeId(null)}
            >
              <div className="flex items-center gap-3 p-4">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">{notification.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold text-[#1F2937] truncate ${
                      !notification.read ? 'font-black' : ''
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF] mt-1.5">
                    {formatTimeAgo(notification.timestamp)}
                  </p>
                </div>

                {/* Unread Indicator / Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1 active:opacity-70"
                    >
                      <Circle size={8} className="text-[#FF6B00] fill-[#FF6B00]" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1.5 text-[#9CA3AF] active:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}