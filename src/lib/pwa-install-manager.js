// PWA Install Manager - handles install prompts and state tracking

import { getUpdateManager } from './update-manager';
import { detectPlatform } from './detect-platform';

const INSTALL_STATE_KEY = 'kemedar-install-state';
const BANNER_DISMISS_KEY = 'kemedar-banner-dismissed-at';
const ONBOARDING_COMPLETE_KEY = 'kemedar-onboarding-complete';
const VISIT_COUNT_KEY = 'kemedar-visit-count';
const VISIT_START_KEY = 'kemedar-visit-start';

export class PWAInstallManager {
  constructor() {
    this.installPrompt = null;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.isStandalone = window.navigator.standalone === true;
    this.isInstalled = false;
    
    this.initializeState();
  }

  initializeState() {
    // Check if app is already installed
    this.isInstalled = this.isStandalone || this.isInstalledFromShortcut();
    
    // Track visits
    this.trackVisit();
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
    });
    
    // Listen for install success
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.setInstallState('installed');
    });
  }

  trackVisit() {
    const visitCount = this.getVisitCount();
    const newCount = visitCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, newCount.toString());
    
    // Track time spent
    localStorage.setItem(VISIT_START_KEY, Date.now().toString());
  }

  getVisitCount() {
    return parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
  }

  getTimeSpentSeconds() {
    const startTime = parseInt(localStorage.getItem(VISIT_START_KEY) || Date.now().toString(), 10);
    return Math.floor((Date.now() - startTime) / 1000);
  }

  shouldShowBanner() {
    // Don't show if already installed
    if (this.isInstalled) return false;
    
    // Check if banner was dismissed recently (within 7 days)
    const dismissedAt = localStorage.getItem(BANNER_DISMISS_KEY);
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 7) return false;
    }
    
    // Check if user has visited 2+ times and spent 30+ seconds
    return this.getVisitCount() >= 2 && this.getTimeSpentSeconds() >= 30;
  }

  shouldShowIOSInstructions() {
    if (!this.isIOS || this.isInstalled) return false;
    const shown = localStorage.getItem('kemedar-ios-instructions-shown');
    return !shown;
  }

  shouldShowOnboarding() {
    return !localStorage.getItem(ONBOARDING_COMPLETE_KEY) && !this.isStandalone;
  }

  dismissBanner() {
    localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
  }

  dismissIOSInstructions() {
    localStorage.setItem('kemedar-ios-instructions-shown', 'true');
  }

  completeOnboarding() {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  }

  setInstallState(state) {
    localStorage.setItem(INSTALL_STATE_KEY, state);
  }

  async triggerInstall() {
    if (!this.installPrompt) return false;
    
    const updateManager = getUpdateManager();
    updateManager.trackInstallPromptShown();
    
    try {
      this.installPrompt.prompt();
      const { outcome } = await this.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        updateManager.trackInstallPromptResponse(true);
        updateManager.trackInstall(detectPlatform());
        this.isInstalled = true;
        this.setInstallState('installed');
        return true;
      } else {
        updateManager.trackInstallPromptResponse(false);
        this.dismissBanner();
        return false;
      }
    } catch (error) {
      console.error('Install prompt error:', error);
      return false;
    }
  }

  isInstalledFromShortcut() {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  openIOSInstructions() {
    this.dismissIOSInstructions();
  }
}

// Singleton instance
let instance = null;

export function getPWAInstallManager() {
  if (!instance) {
    instance = new PWAInstallManager();
  }
  return instance;
}