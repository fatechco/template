/**
 * Kemedar DNA™ - Universal signal tracking hook
 * Use this across the platform to track behavioral signals
 */
import { useCallback } from "react";
import { base44 } from "@/api/base44Client";

let sessionId = `sess_${Date.now()}`;
const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
const platform = window.location.pathname.startsWith('/m/') ? 'mobile' : 'web';

export function useDNA() {
  const trackSignal = useCallback(async (signalType, options = {}) => {
    const { entityType, entityId, metadata } = options;
    base44.functions.invoke('processSignal', {
      signalType,
      entityType: entityType || null,
      entityId: entityId || null,
      metadata: metadata || {},
      sessionId,
      deviceType,
      platform
    }).catch(() => {}); // Fire and forget - never block UX
  }, []);

  const trackPropertyView = useCallback((propertyId, metadata = {}) => {
    trackSignal('property_viewed', { entityType: 'Property', entityId: propertyId, metadata });
  }, [trackSignal]);

  const trackPropertySave = useCallback((propertyId, metadata = {}) => {
    trackSignal('property_saved', { entityType: 'Property', entityId: propertyId, metadata });
  }, [trackSignal]);

  const trackSearch = useCallback((filters = {}) => {
    trackSignal('property_search_performed', {
      metadata: {
        cityId: filters.city || filters.cityId,
        districtId: filters.district || filters.districtId,
        price: filters.price_max,
        propertyType: filters.category,
        filters: Object.keys(filters).filter(k => filters[k])
      }
    });
  }, [trackSignal]);

  const trackFeatureVisit = useCallback((featureName, module = 'kemedar') => {
    trackSignal('feature_visited', { metadata: { feature: featureName, module } });
  }, [trackSignal]);

  const trackMatchSwipe = useCallback((direction, propertyId, viewSeconds = 0) => {
    const type = direction === 'right' ? 'match_liked' : direction === 'super' ? 'match_super_liked' : 'match_passed';
    trackSignal(type, { entityType: 'Property', entityId: propertyId, metadata: { viewSeconds } });
  }, [trackSignal]);

  const trackSession = useCallback((type = 'start') => {
    if (type === 'start') {
      sessionId = `sess_${Date.now()}`;
      trackSignal('session_started', { metadata: { deviceType, platform } });
    } else {
      trackSignal('session_ended', { metadata: { sessionId } });
    }
  }, [trackSignal]);

  const trackNotification = useCallback((type, notifId) => {
    const signalType = type === 'click' ? 'notification_clicked' : 'notification_dismissed';
    trackSignal(signalType, { entityId: notifId });
  }, [trackSignal]);

  return {
    trackSignal,
    trackPropertyView,
    trackPropertySave,
    trackSearch,
    trackFeatureVisit,
    trackMatchSwipe,
    trackSession
  };
}

export default useDNA;