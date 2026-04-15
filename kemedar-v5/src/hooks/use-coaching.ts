"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useCoachResponse() {
  return useMutation({ mutationFn: (data: { questionText: string; contextData?: Record<string, any> }) => apiClient.post<any>("/api/v1/coaching/response", data) });
}
export function useCoachNudge() {
  return useMutation({ mutationFn: (data: { journeyPhase?: string }) => apiClient.post<any>("/api/v1/coaching/nudge", data) });
}
