"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useSwapIntents(filters: { status?: string; page?: number } = {}) {
  return useQuery({ queryKey: ["swap-intents", filters], queryFn: () => apiClient.list<any>("/api/v1/swap", filters) });
}
export function useSwapMatches(intentId: string) {
  return useQuery({ queryKey: ["swap-matches", intentId], queryFn: () => apiClient.get<any>(`/api/v1/swap/${intentId}/matches`), enabled: !!intentId });
}
export function usePublishSwapIntent() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/swap", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["swap-intents"] }) });
}
export function useExpressInterest(matchId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient.post<any>(`/api/v1/swap/${matchId}/interest`), onSuccess: () => qc.invalidateQueries({ queryKey: ["swap-matches"] }) });
}
