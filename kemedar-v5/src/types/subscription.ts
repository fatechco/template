import type { SubscriptionStatus } from "./common";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  trialEndsAt: string | null;
  cancelledAt: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  plan?: SubscriptionPlan;
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
  features: Record<string, boolean> | null;
  limits: Record<string, number> | null;
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
  items: Record<string, any>[] | null;
  paidAt: string | null;
  dueDate: string | null;
  createdAt: string;
}
