// PWA Update Manager - handles service worker updates

const UPDATE_ANALYTICS_KEY = 'pwa-update-analytics';

export class UpdateManager {
  constructor() {
    this.updateAvailable = false;
    this.newServiceWorker = null;
    this.isUpdating = false;
  }

  async registerUpdateListener() {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;

      // Check for updates periodically
      setInterval(() => {
        registration.update().catch((error) => {
          console.error('Update check failed:', error);
        });
      }, 60000); // Check every minute

      // Listen for new service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker is ready to take over
            this.updateAvailable = true;
            this.newServiceWorker = newWorker;
            
            // Dispatch custom event to trigger UI update
            window.dispatchEvent(new CustomEvent('pwa-update-available'));
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }

  async activateUpdate() {
    if (!this.newServiceWorker) return false;

    this.isUpdating = true;

    return new Promise((resolve) => {
      this.newServiceWorker.addEventListener('controllerchange', () => {
        // New service worker is now in control
        window.location.reload();
        resolve(true);
      });

      // Tell the new service worker to skip waiting
      this.newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    });
  }

  trackInstall(platform = 'unknown') {
    const analytics = this.getAnalytics();
    
    analytics.totalInstalls += 1;
    analytics.platforms[platform] = (analytics.platforms[platform] || 0) + 1;
    analytics.lastInstallDate = new Date().toISOString();
    analytics.installDates.push(new Date().toISOString().split('T')[0]);

    this.saveAnalytics(analytics);
  }

  trackInstallPromptShown() {
    const analytics = this.getAnalytics();
    analytics.promptShownCount += 1;
    this.saveAnalytics(analytics);
  }

  trackInstallPromptResponse(accepted) {
    const analytics = this.getAnalytics();
    if (accepted) {
      analytics.promptAcceptedCount += 1;
    } else {
      analytics.promptDeclinedCount += 1;
    }
    this.saveAnalytics(analytics);
  }

  getAnalytics() {
    const stored = localStorage.getItem(UPDATE_ANALYTICS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      totalInstalls: 0,
      platforms: {},
      lastInstallDate: null,
      installDates: [],
      promptShownCount: 0,
      promptAcceptedCount: 0,
      promptDeclinedCount: 0,
    };
  }

  saveAnalytics(analytics) {
    localStorage.setItem(UPDATE_ANALYTICS_KEY, JSON.stringify(analytics));
  }

  getInstallsThisMonth() {
    const analytics = this.getAnalytics();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return analytics.installDates.filter((date) => {
      return new Date(date) >= monthStart;
    }).length;
  }

  getDailyInstalls(days = 30) {
    const analytics = this.getAnalytics();
    const dailyData = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = analytics.installDates.filter((d) => d === dateStr).length;
    }

    return dailyData;
  }

  getPlatformBreakdown() {
    const analytics = this.getAnalytics();
    const total = analytics.totalInstalls || 1;

    return Object.entries(analytics.platforms).map(([platform, count]) => ({
      platform,
      installs: count,
      percentage: ((count / total) * 100).toFixed(1),
    }));
  }

  getAcceptanceRate() {
    const analytics = this.getAnalytics();
    const total = analytics.promptAcceptedCount + analytics.promptDeclinedCount || 1;
    const acceptanceRate = ((analytics.promptAcceptedCount / total) * 100).toFixed(1);

    return {
      shown: analytics.promptShownCount,
      accepted: analytics.promptAcceptedCount,
      declined: analytics.promptDeclinedCount,
      acceptanceRate,
    };
  }
}

// Singleton instance
let instance = null;

export function getUpdateManager() {
  if (!instance) {
    instance = new UpdateManager();
    instance.registerUpdateListener();
  }
  return instance;
}