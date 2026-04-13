import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileTopBar from '@/components/mobile-v2/MobileTopBar';
import { Trash2, Check, ChevronLeft } from 'lucide-react';

const NOTIFICATIONS_DATA = [
  { id: 1, type: 'order', icon: '📦', title: 'Order Shipped', msg: 'Your order #KM12345 has been shipped', time: '2m ago', unread: true },
  { id: 2, type: 'message', icon: '💬', title: 'New Message', msg: 'Ahmed Hassan sent you a message', time: '15m ago', unread: true },
  { id: 3, type: 'property', icon: '🏠', title: 'Property Viewed', msg: 'Your listing got 5 new views today', time: '1h ago', unread: false },
  { id: 4, type: 'task', icon: '✅', title: 'Task Completed', msg: 'Muhammad finished the repair job', time: '3h ago', unread: false },
  { id: 5, type: 'system', icon: '⚙️', title: 'System Update', msg: 'New features available in the app', time: '5h ago', unread: false },
];

const FILTER_TABS = ['All', 'Properties', 'Messages', 'Orders', 'Tasks', 'System'];

const TYPE_COLORS = {
  order: 'text-blue-600',
  message: 'text-purple-600',
  property: 'text-orange-600',
  task: 'text-green-600',
  system: 'text-gray-600',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);

  const filtered = activeFilter === 'All'
    ? notifications
    : notifications.filter(n => n.type === activeFilter.toLowerCase());

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Notifications</h1>
        <button
          onClick={handleMarkAllRead}
          className="ml-auto text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === tab
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-2xl mb-2">🔔</p>
            <p className="text-gray-600 font-medium">No notifications</p>
          </div>
        ) : (
          filtered.map(notification => (
            <div
              key={notification.id}
              onClick={() => navigate(`/m/cp/user/notifications/${notification.id}`)}
              className={`relative px-4 py-4 flex gap-3 hover:bg-gray-50 transition-colors group cursor-pointer ${
                notification.unread ? 'bg-orange-50/50' : ''
              }`}
            >
              {/* Icon Circle */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                notification.unread
                  ? 'bg-orange-100'
                  : 'bg-gray-100'
              }`}>
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold text-gray-900 ${
                  notification.unread ? 'font-black' : ''
                }`}>
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                  {notification.msg}
                </p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>

              {/* Unread Dot */}
              {notification.unread && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
              )}

              {/* Actions (show on hover/swipe) */}
              <div className="absolute right-0 top-0 bottom-0 flex items-center gap-2 bg-white opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                <button
                  onClick={() => handleMarkRead(notification.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-1.5 hover:bg-red-100 rounded-lg text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}