import { useState } from 'react';
import { getNotificationManager } from '@/lib/notification-manager';

const PREFERENCE_OPTIONS = [
  {
    key: 'propertyMatches',
    emoji: '🏠',
    label: 'Property matches',
  },
  {
    key: 'newMessages',
    emoji: '💬',
    label: 'New messages',
  },
  {
    key: 'priceDrops',
    emoji: '📉',
    label: 'Price drops',
  },
  {
    key: 'orderUpdates',
    emoji: '📦',
    label: 'Order updates',
  },
  {
    key: 'taskUpdates',
    emoji: '🔧',
    label: 'Task updates',
  },
  {
    key: 'subscriptionAlerts',
    emoji: '⚠️',
    label: 'Subscription alerts',
  },
  {
    key: 'announcements',
    emoji: '📢',
    label: 'Announcements',
  },
  {
    key: 'recommendations',
    emoji: '🎯',
    label: 'Personalized recommendations',
  },
];

export default function NotificationPreferences() {
  const manager = getNotificationManager();
  const [prefs, setPrefs] = useState(manager.getPreferences());
  const [testSending, setTestSending] = useState(false);

  const handleToggle = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    manager.savePreferences(newPrefs);
  };

  const handleTestNotification = async () => {
    if (!manager.hasPermission()) {
      alert('Please enable notifications first');
      return;
    }
    
    setTestSending(true);
    await manager.sendTestNotification();
    setTimeout(() => setTestSending(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h3 className="text-base font-black text-[#1F2937] mb-1">Notification Types</h3>
        <p className="text-xs text-[#6B7280]">Control what notifications you receive</p>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        {PREFERENCE_OPTIONS.map((option, index) => (
          <div key={option.key}>
            <label className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-[#F9FAFB]">
              <span className="text-lg flex-shrink-0">{option.emoji}</span>
              <span className="flex-1 text-sm font-medium text-[#1F2937]">
                {option.label}
              </span>
              <input
                type="checkbox"
                checked={prefs[option.key]}
                onChange={() => handleToggle(option.key)}
                className="w-5 h-5 rounded accent-[#FF6B00] cursor-pointer"
              />
            </label>
            {index < PREFERENCE_OPTIONS.length - 1 && (
              <div className="h-px bg-[#E5E7EB] mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Test Notification Button */}
      {manager.hasPermission() && (
        <button
          onClick={handleTestNotification}
          disabled={testSending}
          className="w-full border-2 border-[#FF6B00] text-[#FF6B00] font-bold py-3 rounded-2xl text-sm active:bg-orange-50 transition-colors disabled:opacity-50"
        >
          {testSending ? 'Sending test notification...' : '🔔 Send Test Notification'}
        </button>
      )}

      {/* Permission Status */}
      {!manager.hasPermission() && (
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-4">
          <p className="text-xs text-[#92400E] leading-relaxed">
            <strong>Notifications disabled.</strong> Enable them in your browser settings or tap the notification permission prompt when it appears.
          </p>
        </div>
      )}
    </div>
  );
}