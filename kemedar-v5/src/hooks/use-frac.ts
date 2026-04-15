"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useFracOfferings(filters: { status?: string; isFeatured?: boolean } = {}) {
  return useQuery({
    queryKey: ["frac-offerings", filters],
    queryFn: () => apiClient.list<any>("/api/v1/frac", filters),
  });
}

export function useSubmitFracOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/frac", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["frac-offerings"] }),
  });
}

export function usePurchaseTokens(fracPropertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { tokensAmount: number; paymentMethod: string }) => apiClient.post<any>(`/api/v1/frac/${fracPropertyId}/purchase`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["frac-offerings"] }),
  });
}
