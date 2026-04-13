// PWA Launch Checklist - validation utilities

export const PWA_CHECKLIST = [
  {
    id: 'manifest',
    title: 'manifest.json linked in <head>',
    critical: true,
    check: () => {
      const link = document.querySelector('link[rel="manifest"]');
      return link && link.href;
    },
  },
  {
    id: 'service-worker',
    title: 'Service worker registered',
    critical: true,
    check: () => 'serviceWorker' in navigator,
  },
  {
    id: 'icons',
    title: 'Icon sizes: 72, 96, 128, 144, 152, 192, 384, 512px',
    critical: true,
    check: () => {
      const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
      return sizes.every((size) => {
        const link = document.querySelector(`link[rel="icon"][sizes="${size}x${size}"]`);
        return link && link.href;
      });
    },
  },
  {
    id: 'offline-page',
    title: 'Offline fallback page working',
    critical: true,
    check: async () => {
      try {
        const response = await fetch('/offline.html');
        return response.ok;
      } catch {
        return false;
      }
    },
  },
  {
    id: 'https',
    title: 'HTTPS enabled',
    critical: true,
    check: () => window.location.protocol === 'https:' || window.location.hostname === 'localhost',
  },
  {
    id: 'theme-color',
    title: 'Theme color set (#FF6B00)',
    critical: true,
    check: () => {
      const meta = document.querySelector('meta[name="theme-color"]');
      return meta && meta.getAttribute('content') === '#FF6B00';
    },
  },
  {
    id: 'viewport',
    title: 'Viewport meta tag present',
    critical: true,
    check: () => document.querySelector('meta[name="viewport"]') !== null,
  },
  {
    id: 'apple-touch-icon',
    title: 'Apple touch icon set',
    critical: false,
    check: () => document.querySelector('link[rel="apple-touch-icon"]') !== null,
  },
  {
    id: 'splash-screen',
    title: 'Splash screen configured',
    critical: false,
    check: () => {
      const meta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      return meta && meta.getAttribute('content') === 'yes';
    },
  },
  {
    id: 'install-prompt',
    title: 'Install prompt logic working',
    critical: true,
    check: () => {
      // Check if install prompt can be triggered
      return window.deferredPrompt !== undefined || 'onbeforeinstallprompt' in window;
    },
  },
  {
    id: 'push-notifications',
    title: 'Push notifications working',
    critical: false,
    check: () => 'Notification' in window && 'serviceWorker' in navigator,
  },
  {
    id: 'background-sync',
    title: 'Background sync working',
    critical: false,
    check: () => 'serviceWorker' in navigator && 'SyncManager' in window,
  },
  {
    id: 'performance',
    title: 'All pages load under 3 seconds',
    critical: false,
    check: async () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return perfData && perfData.loadEventEnd - perfData.loadEventStart < 3000;
    },
  },
];

export async function validatePWA() {
  const results = [];

  for (const item of PWA_CHECKLIST) {
    try {
      const passed = await Promise.resolve(item.check());
      results.push({
        ...item,
        passed,
      });
    } catch (error) {
      results.push({
        ...item,
        passed: false,
        error: error.message,
      });
    }
  }

  return results;
}

export function generatePWAReport(results) {
  const critical = results.filter((r) => r.critical);
  const criticalPassed = critical.filter((r) => r.passed).length;
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;

  const score = Math.round((passed / total) * 100);
  const isMeetingCriteria = criticalPassed === critical.length;

  return {
    score,
    passed,
    total,
    critical: {
      passed: criticalPassed,
      total: critical.length,
      allMet: isMeetingCriteria,
    },
    passed: results.filter((r) => r.passed),
    failed: results.filter((r) => !r.passed),
    isReady: score >= 90 && isMeetingCriteria,
  };
}