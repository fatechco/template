"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useSubscriptionPlans() {
  return useQuery({ queryKey: ["subscription-plans"], queryFn: () => apiClient.list<any>("/api/v1/subscriptions/plans") });
}
export function useMySubscription() {
  return useQuery({ queryKey: ["my-subscription"], queryFn: () => apiClient.get<any>("/api/v1/subscriptions/my-plan") });
}
