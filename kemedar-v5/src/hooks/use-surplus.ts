"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useSurplusItems(filters: { category?: string; cityId?: string; page?: number } = {}) {
  return useQuery({ queryKey: ["surplus-items", filters], queryFn: () => apiClient.list<any>("/api/v1/surplus", filters) });
}
export function usePublishSurplusItem() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/surplus", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["surplus-items"] }) });
}
export function useReserveSurplusItem(itemId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient.post<any>(`/api/v1/surplus/${itemId}/reserve`), onSuccess: () => qc.invalidateQueries({ queryKey: ["surplus-items"] }) });
}
