// Notification Manager - handles push notifications and preferences

const NOTIFICATION_PREFS_KEY = 'kemedar-notification-prefs';
const NOTIFICATIONS_KEY = 'kemedar-notifications';
const PERMISSION_REQUEST_KEY = 'kemedar-permission-request-';

const DEFAULT_PREFS = {
  propertyMatches: true,
  newMessages: true,
  priceDrops: true,
  orderUpdates: true,
  taskUpdates: true,
  subscriptionAlerts: true,
  announcements: true,
  recommendations: true,
};

export class NotificationManager {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'Notification' in window;
    this.subscriptionPromise = null;
    this.notifications = this.loadNotifications();
  }

  async requestPermission() {
    if (!this.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.subscribeToPushNotifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async subscribeToPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.getPublicKey(),
      });
      
      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  getPublicKey() {
    // This would be your actual VAPID public key from your server
    return 'BKaKjhj...'; // Placeholder
  }

  shouldShowPermissionRequest(trigger) {
    const lastRequest = localStorage.getItem(PERMISSION_REQUEST_KEY + trigger);
    if (!lastRequest) return true;
    
    // Don't ask again if they dismissed it in the last 7 days
    const daysSince = (Date.now() - parseInt(lastRequest)) / (1000 * 60 * 60 * 24);
    return daysSince > 7;
  }

  dismissPermissionRequest(trigger) {
    localStorage.setItem(PERMISSION_REQUEST_KEY + trigger, Date.now().toString());
  }

  hasPermission() {
    return this.isSupported && Notification.permission === 'granted';
  }

  getPreferences() {
    const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PREFS;
  }

  savePreferences(prefs) {
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  }

  updatePreference(key, value) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    this.savePreferences(prefs);
  }

  loadNotifications() {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  saveNotifications() {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
  }

  addNotification(data) {
    const notification = {
      id: `${Date.now()}-${Math.random()}`,
      ...data,
      timestamp: Date.now(),
      read: false,
    };
    this.notifications.unshift(notification);
    this.saveNotifications();
    return notification;
  }

  getNotifications(filter = 'all') {
    let filtered = this.notifications;

    if (filter === 'unread') {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter !== 'all') {
      filtered = filtered.filter((n) => n.category === filter);
    }

    return filtered;
  }

  markAsRead(id) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveNotifications();
  }

  deleteNotification(id) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
  }

  deleteAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  // Send test notification
  async sendTestNotification() {
    if (!this.hasPermission()) return false;

    const registration = await navigator.serviceWorker.ready;
    const notification = {
      title: '✅ Notifications Working!',
      body: 'You will now receive Kemedar alerts on your device.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'test-notification',
      requireInteraction: false,
    };

    await registration.showNotification(notification.title, notification);
    this.addNotification({
      id: `test-${Date.now()}`,
      type: 'test',
      title: notification.title,
      body: notification.body,
      icon: '✅',
      category: 'system',
    });

    return true;
  }
}

// Singleton instance
let instance = null;

export function getNotificationManager() {
  if (!instance) {
    instance = new NotificationManager();
  }
  return instance;
}

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  propertyMatch: (category, city, price) => ({
    type: 'propertyMatch',
    category: 'properties',
    icon: '🏠',
    title: 'New Property Match!',
    body: `A ${category} in ${city} matches your search — ${price}`,
    data: { action: 'view-property' },
  }),

  newMessage: (senderName, preview) => ({
    type: 'newMessage',
    category: 'messages',
    icon: '💬',
    title: `${senderName} sent you a message`,
    body: preview.substring(0, 60),
    data: { action: 'reply' },
  }),

  priceDrop: (oldPrice, newPrice) => ({
    type: 'priceDrop',
    category: 'properties',
    icon: '📉',
    title: 'Price Drop Alert!',
    body: `A property you saved dropped from ${oldPrice} to ${newPrice}`,
    data: { action: 'view-property' },
  }),

  orderUpdate: (orderNumber, status) => ({
    type: 'orderUpdate',
    category: 'orders',
    icon: '📦',
    title: `Order #${orderNumber} Update`,
    body: `Your order status: ${status}`,
    data: { action: 'track-order' },
  }),

  taskUpdate: (handymanName, taskTitle) => ({
    type: 'taskUpdate',
    category: 'tasks',
    icon: '🔧',
    title: 'Task Update',
    body: `${handymanName} updated: ${taskTitle}`,
    data: { action: 'view-task' },
  }),

  subscriptionExpiry: (plan, daysLeft) => ({
    type: 'subscriptionExpiry',
    category: 'system',
    icon: '⚠️',
    title: 'Subscription Expiring Soon',
    body: `Your ${plan} expires in ${daysLeft} days. Renew to keep your listings active.`,
    data: { action: 'renew' },
  }),

  buyRequestMatch: (category, city) => ({
    type: 'buyRequestMatch',
    category: 'properties',
    icon: '👀',
    title: 'Someone wants to buy!',
    body: `A buyer is looking for a ${category} in ${city} — matches your listing`,
    data: { action: 'view-request' },
  }),

  verificationComplete: (itemType) => ({
    type: 'verificationComplete',
    category: 'system',
    icon: '✅',
    title: 'Verification Complete!',
    body: `Your ${itemType} has been verified by Kemedar`,
    data: { action: 'view-listing' },
  }),

  announcement: (title, body) => ({
    type: 'announcement',
    category: 'system',
    icon: '🔔',
    title,
    body,
    data: { action: 'view-details' },
  }),
};