"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useNegotiations(filters: { status?: string } = {}) {
  return useQuery({ queryKey: ["negotiations", filters], queryFn: () => apiClient.list<any>("/api/v1/negotiations", filters) });
}
export function useNegotiationMessages(sessionId: string) {
  return useQuery({ queryKey: ["negotiation-messages", sessionId], queryFn: () => apiClient.get<any>(`/api/v1/negotiations/${sessionId}/messages`), enabled: !!sessionId, refetchInterval: 5000 });
}
export function useOpenNegotiation() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/negotiations", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["negotiations"] }) });
}
export function useSubmitOffer(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { offerPrice: number; conditions?: any; message?: string }) => apiClient.post<any>(`/api/v1/negotiations/${sessionId}/offer`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["negotiations"] }) });
}
export function useSendNegotiationMessage(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { content: string }) => apiClient.post<any>(`/api/v1/negotiations/${sessionId}/messages`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["negotiation-messages", sessionId] }) });
}
