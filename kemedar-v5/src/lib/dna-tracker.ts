"use client";

import { apiClient } from "./api-client";

const DNA_QUEUE: Array<{ signalType: string; value: any; source?: string }> = [];
let flushTimer: NodeJS.Timeout | null = null;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(flushSignals, 5000);
}

async function flushSignals() {
  flushTimer = null;
  if (DNA_QUEUE.length === 0) return;
  const batch = DNA_QUEUE.splice(0, 50);
  try {
    await apiClient.post("/api/v1/users/dna/signals", { signals: batch });
  } catch {
    // Re-queue on failure
    DNA_QUEUE.unshift(...batch);
  }
}

export function trackSignal(signalType: string, value: any, source?: string) {
  DNA_QUEUE.push({ signalType, value, source });
  scheduleFlush();
}

export function trackPropertyView(propertyId: string) {
  trackSignal("property_view", { propertyId }, "browse");
}

export function trackPropertySave(propertyId: string) {
  trackSignal("property_save", { propertyId }, "action");
}

export function trackSearch(query: string, filters?: Record<string, any>) {
  trackSignal("search", { query, filters }, "search");
}

export function trackFeatureVisit(featureName: string) {
  trackSignal("feature_visit", { featureName }, "navigation");
}

export function trackMatchSwipe(propertyId: string, direction: string) {
  trackSignal("match_swipe", { propertyId, direction }, "matching");
}
