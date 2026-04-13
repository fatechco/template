/**
 * Kemedar Subscription & Feature Gating Engine
 * Central utility for checking plan access and consuming usage
 */
import { base44 } from "@/api/base44Client";

// Plan feature definitions (mirrors DB but cached client-side)
const FREE_PLAN_FEATURES = {
  search_properties: true,
  save_properties: true,
  contact_owner: true,
  advisor_profile: true,
  advisor_report_basic: true,
  advisor_report_ai: false,
  match_swipe: true,
  match_undo: false,
  negotiate_basic: true,
  negotiate_ai_strategy: false,
  negotiate_ai_draft: false,
  negotiate_digital_offer: false,
  vision_view_score: true,
  vision_own_listing: false,
  twin_view_tours: true,
  twin_live_watch: true,
  twin_virtual_tour: false,
  twin_live_host: false,
  life_score_view: true,
  life_score_compare: true,
  life_score_write_review: true,
  coach_journey: true,
  coach_all_journeys: false,
  community_join: true,
  community_post: true,
  escrow_basic: true,
  live_watch: true,
  live_host: false,
  kemedar_score: true,
  score_certificate: false,
  predict_basic: false,
  ai_property_search: false,
  price_drop_alerts: false,
  rent2own_browse: true,
  rent2own_apply: true,
  flash_deals: false,
  group_buy_initiate: false,
  kemetro_boq_full: false,
};

const FREE_PLAN_LIMITS = {
  saved_properties: 20,
  contact_owner_monthly: 10,
  advisor_matches_per_report: 5,
  match_swipes_daily: 20,
  match_super_likes_daily: 1,
  life_score_compare_areas: 2,
  coach_ai_messages_daily: 5,
  notifications_per_day: 3,
  active_listings: 1,
  photos_per_listing: 10,
  job_bids_monthly: 10,
  active_jobs: 2,
  products_active: 10,
};

// Upgrade path suggestions
const UPGRADE_SUGGESTIONS = {
  advisor_report_ai: { plan: "BUYER_PRO", message: "Get AI-powered property analysis" },
  negotiate_ai_strategy: { plan: "BUYER_PRO", message: "Negotiate smarter with AI strategy" },
  negotiate_ai_draft: { plan: "BUYER_PRO", message: "Draft offers with AI assistance" },
  match_undo: { plan: "BUYER_PRO", message: "Undo swipes with Pro" },
  twin_virtual_tour: { plan: "SELLER_PRO", message: "Create immersive virtual tours" },
  twin_live_host: { plan: "SELLER_PRO", message: "Host live property tours" },
  vision_own_listing: { plan: "SELLER_PRO", message: "Get AI analysis on your photos" },
  live_host: { plan: "SELLER_PRO", message: "Host live events to your audience" },
  predict_basic: { plan: "BUYER_PRO", message: "See price predictions for any area" },
  ai_property_search: { plan: "BUYER_PRO", message: "Search properties in natural language" },
  flash_deals: { plan: "KEMETRO_PRO", message: "Create flash deals to boost sales" },
  group_buy_initiate: { plan: "KEMETRO_PRO", message: "Start group buy sessions" },
  score_certificate: { plan: "BUYER_PRO", message: "Get your Kemedar Score certificate" },
  coach_all_journeys: { plan: "BUYER_PRO", message: "Access all coach journey types" },
};

const LIMIT_UPGRADE_SUGGESTIONS = {
  match_swipes_daily: { plan: "BUYER_PRO", limitFree: 20, limitPro: 100 },
  coach_ai_messages_daily: { plan: "BUYER_PRO", limitFree: 5, limitPro: 30 },
  saved_properties: { plan: "BUYER_PRO", limitFree: 20, limitPro: 200 },
  contact_owner_monthly: { plan: "BUYER_PRO", limitFree: 10, limitPro: 50 },
  job_bids_monthly: { plan: "KEMEWORK_PRO", limitFree: 10, limitPro: 50 },
  products_active: { plan: "KEMETRO_PRO", limitFree: 10, limitPro: 200 },
};

let _cachedSubscription = null;
let _cacheExpiry = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get current user's active subscription
 */
export async function getCurrentSubscription() {
  const now = Date.now();
  if (_cachedSubscription && now < _cacheExpiry) {
    return _cachedSubscription;
  }

  try {
    const user = await base44.auth.me();
    if (!user) return null;

    const subs = await base44.entities.UserSubscription.filter({
      userId: user.id,
      status: "active",
    }, "-startedAt", 1);

    if (subs.length === 0) {
      // Also check trialing
      const trialSubs = await base44.entities.UserSubscription.filter({
        userId: user.id,
        status: "trialing",
      }, "-startedAt", 1);
      _cachedSubscription = trialSubs[0] || null;
    } else {
      _cachedSubscription = subs[0];
    }

    _cacheExpiry = now + CACHE_TTL;
    return _cachedSubscription;
  } catch {
    return null;
  }
}

/**
 * Get current user's plan data
 */
export async function getCurrentPlan() {
  const sub = await getCurrentSubscription();
  if (!sub) return null;

  try {
    const plans = await base44.entities.SubscriptionPlan.filter({
      planCode: sub.planCode,
    }, "sortOrder", 1);
    return plans[0] || null;
  } catch {
    return null;
  }
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(featureKey) {
  try {
    const plan = await getCurrentPlan();

    if (!plan) {
      // Default to free plan limits
      const hasAccess = FREE_PLAN_FEATURES[featureKey] !== false;
      const limit = FREE_PLAN_LIMITS[featureKey];
      const suggestion = UPGRADE_SUGGESTIONS[featureKey] || LIMIT_UPGRADE_SUGGESTIONS[featureKey];

      return {
        hasAccess,
        limit: limit ?? null,
        currentUsage: 0,
        remainingUsage: limit ?? null,
        requiresUpgrade: !hasAccess,
        suggestedPlan: !hasAccess ? (suggestion?.plan || "BUYER_PRO") : null,
        upgradeMessage: !hasAccess ? (suggestion?.message || "Upgrade to unlock this feature") : null,
      };
    }

    const features = plan.features || {};
    const limits = plan.limits || {};

    const hasAccess = features[featureKey] !== false && features[featureKey] !== undefined
      ? true
      : (FREE_PLAN_FEATURES[featureKey] === true);

    const limit = limits[featureKey] ?? FREE_PLAN_LIMITS[featureKey] ?? null;
    const suggestion = UPGRADE_SUGGESTIONS[featureKey];

    return {
      hasAccess,
      limit: limit === -1 ? null : limit, // -1 = unlimited
      isUnlimited: limit === -1,
      currentUsage: 0,
      remainingUsage: limit === -1 ? null : limit,
      requiresUpgrade: !hasAccess,
      suggestedPlan: !hasAccess ? (suggestion?.plan || "BUYER_PRO") : null,
      upgradeMessage: !hasAccess ? (suggestion?.message || "Upgrade to unlock this feature") : null,
    };
  } catch {
    return {
      hasAccess: true, // Fail open
      limit: null,
      requiresUpgrade: false,
      suggestedPlan: null,
      upgradeMessage: null,
    };
  }
}

/**
 * Check current usage against limits
 */
export async function checkUsageLimit(featureKey, periodType = "daily") {
  try {
    const user = await base44.auth.me();
    if (!user) return { withinLimit: true, usage: 0, limit: null };

    const plan = await getCurrentPlan();
    const limits = plan?.limits || {};
    const limit = limits[featureKey] ?? FREE_PLAN_LIMITS[featureKey] ?? null;

    if (limit === -1 || limit === null) {
      return { withinLimit: true, usage: 0, limit: null, isUnlimited: true };
    }

    const now = new Date();
    const period = periodType === "daily"
      ? now.toISOString().slice(0, 10)
      : now.toISOString().slice(0, 7);

    const sub = await getCurrentSubscription();
    const events = await base44.entities.UsageEvent.filter({
      userId: user.id,
      featureKey,
      usagePeriod: period,
    }, "created_date", 100);

    const usage = events.reduce((sum, e) => sum + (e.usageValue || 1), 0);
    const suggestion = LIMIT_UPGRADE_SUGGESTIONS[featureKey];

    return {
      withinLimit: usage < limit,
      usage,
      limit,
      remaining: Math.max(0, limit - usage),
      requiresUpgrade: usage >= limit,
      suggestedPlan: usage >= limit ? (suggestion?.plan || "BUYER_PRO") : null,
      upgradeMessage: usage >= limit
        ? `You've used ${usage}/${limit} ${featureKey.replace(/_/g, ' ')} today. Upgrade for more.`
        : null,
    };
  } catch {
    return { withinLimit: true, usage: 0, limit: null };
  }
}

/**
 * Consume usage event
 */
export async function consumeUsage(featureKey, periodType = "daily", relatedEntityType = null, relatedEntityId = null) {
  try {
    const user = await base44.auth.me();
    if (!user) return { success: false };

    const sub = await getCurrentSubscription();
    const now = new Date();
    const period = periodType === "daily"
      ? now.toISOString().slice(0, 10)
      : now.toISOString().slice(0, 7);

    await base44.entities.UsageEvent.create({
      userId: user.id,
      subscriptionId: sub?.id || "free",
      planCode: sub?.planCode || "FREE",
      featureKey,
      usageValue: 1,
      usagePeriod: period,
      relatedEntityType,
      relatedEntityId,
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Check and consume usage in one call
 * Returns access result — use this before any limited feature
 */
export async function checkAndConsumeUsage(featureKey, periodType = "daily") {
  const [accessResult, usageResult] = await Promise.all([
    checkFeatureAccess(featureKey),
    checkUsageLimit(featureKey, periodType),
  ]);

  if (!accessResult.hasAccess) {
    return {
      allowed: false,
      reason: "no_access",
      requiresUpgrade: true,
      suggestedPlan: accessResult.suggestedPlan,
      upgradeMessage: accessResult.upgradeMessage,
    };
  }

  if (!usageResult.withinLimit) {
    return {
      allowed: false,
      reason: "limit_reached",
      usage: usageResult.usage,
      limit: usageResult.limit,
      requiresUpgrade: true,
      suggestedPlan: usageResult.suggestedPlan,
      upgradeMessage: usageResult.upgradeMessage,
    };
  }

  // Consume the usage
  await consumeUsage(featureKey, periodType);

  return {
    allowed: true,
    remaining: usageResult.remaining ? usageResult.remaining - 1 : null,
    isUnlimited: usageResult.isUnlimited,
  };
}

/**
 * Get plan name from plan code
 */
export function getPlanDisplayName(planCode) {
  const names = {
    BUYER_FREE: "Explorer", BUYER_PRO: "Seeker Pro", BUYER_PREMIUM: "Owner Premium",
    SELLER_FREE: "Basic Lister", SELLER_PRO: "Seller Pro", SELLER_PREMIUM: "Top Seller",
    AGENT_STARTER: "Agent Starter", AGENT_PRO: "Agent Pro",
    KEMEWORK_FREE: "Basic Pro", KEMEWORK_PRO: "Verified Pro", KEMEWORK_PREMIUM: "Master Pro",
    KEMETRO_FREE: "Basic Seller", KEMETRO_PRO: "Verified Seller", KEMETRO_PREMIUM: "Power Seller",
    FO_STANDARD: "Franchise Owner", FO_PREMIUM: "Senior Franchise Owner",
    DEVELOPER_PRO: "Developer Pro", DEVELOPER_ENTERPRISE: "Developer Enterprise",
  };
  return names[planCode] || planCode;
}

/**
 * Get plan tier color
 */
export function getPlanTierColor(tier) {
  const colors = {
    free: "gray", starter: "blue", pro: "orange", premium: "amber", enterprise: "purple",
  };
  return colors[tier] || "gray";
}

/**
 * Clear subscription cache (call after plan change)
 */
export function clearSubscriptionCache() {
  _cachedSubscription = null;
  _cacheExpiry = 0;
}