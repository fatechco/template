import { apiClient } from "./api-client";

interface SubscriptionPlan {
  code: string;
  name: string;
  tier: number;
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

const PLAN_TYPES = [
  "BUYER_FREE", "BUYER_PRO", "BUYER_PREMIUM",
  "SELLER_FREE", "SELLER_PRO", "SELLER_PREMIUM",
  "AGENT_STARTER", "AGENT_PRO",
  "KEMEWORK_FREE", "KEMEWORK_PRO", "KEMEWORK_PREMIUM",
  "KEMETRO_FREE", "KEMETRO_PRO", "KEMETRO_PREMIUM",
  "DEVELOPER_PRO", "DEVELOPER_ENTERPRISE",
  "FO_STANDARD", "FO_PREMIUM",
] as const;

let cachedPlan: { data: SubscriptionPlan | null; expiresAt: number } | null = null;

export async function getCurrentPlan(): Promise<SubscriptionPlan | null> {
  if (cachedPlan && Date.now() < cachedPlan.expiresAt) return cachedPlan.data;
  try {
    const plan = await apiClient.get<SubscriptionPlan>("/api/v1/subscriptions/my-plan");
    cachedPlan = { data: plan, expiresAt: Date.now() + 60000 };
    return plan;
  } catch {
    return null;
  }
}

export async function checkFeatureAccess(featureKey: string): Promise<boolean> {
  const plan = await getCurrentPlan();
  if (!plan) return true; // Free tier allows basic features
  return plan.features[featureKey] ?? true;
}

export async function checkUsageLimit(featureKey: string): Promise<{ allowed: boolean; remaining: number }> {
  const plan = await getCurrentPlan();
  if (!plan) return { allowed: true, remaining: 999 };
  const limit = plan.limits[featureKey];
  if (!limit) return { allowed: true, remaining: 999 };
  // TODO: Check actual usage from API
  return { allowed: true, remaining: limit };
}

export function clearSubscriptionCache() {
  cachedPlan = null;
}

export function getPlanDisplayName(planCode: string): string {
  const names: Record<string, string> = {
    BUYER_FREE: "Buyer Free", BUYER_PRO: "Buyer Pro", BUYER_PREMIUM: "Buyer Premium",
    SELLER_FREE: "Seller Free", SELLER_PRO: "Seller Pro", SELLER_PREMIUM: "Seller Premium",
    AGENT_STARTER: "Agent Starter", AGENT_PRO: "Agent Pro",
    KEMEWORK_FREE: "Kemework Free", KEMEWORK_PRO: "Kemework Pro", KEMEWORK_PREMIUM: "Kemework Premium",
    KEMETRO_FREE: "Kemetro Free", KEMETRO_PRO: "Kemetro Pro", KEMETRO_PREMIUM: "Kemetro Premium",
    DEVELOPER_PRO: "Developer Pro", DEVELOPER_ENTERPRISE: "Developer Enterprise",
    FO_STANDARD: "Franchise Standard", FO_PREMIUM: "Franchise Premium",
  };
  return names[planCode] || planCode;
}
