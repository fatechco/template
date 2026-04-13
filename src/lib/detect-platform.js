// Detect platform for analytics

export function detectPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();

  // iOS
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }

  // Android
  if (/android/.test(userAgent)) {
    return 'android';
  }

  // Windows
  if (/win/.test(userAgent)) {
    return 'windows';
  }

  // macOS
  if (/mac/.test(userAgent)) {
    return 'macos';
  }

  // Linux
  if (/linux/.test(userAgent)) {
    return 'linux';
  }

  return 'unknown';
}

export function isStandalone() {
  return (
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

export function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/tablet|ipad|playbook|silk/.test(userAgent)) {
    return 'tablet';
  }
  
  if (/mobile|phone|iphone|android/.test(userAgent)) {
    return 'mobile';
  }

  return 'desktop';
}