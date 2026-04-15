export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired" | "trial";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan?: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  priceMonthlyEGP: number | null;
  priceYearlyEGP: number | null;
  priceMonthlyUSD: number | null;
  priceYearlyUSD: number | null;
  features: Record<string, any> | null;
  limits: Record<string, any> | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  items: Record<string, any> | null;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string;
}
