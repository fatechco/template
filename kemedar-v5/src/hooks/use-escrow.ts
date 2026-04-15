"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useEscrowDeals(filters: { buyerId?: string; sellerId?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["escrow-deals", filters],
    queryFn: () => apiClient.list<any>("/api/v1/escrow", filters),
  });
}

export function useCreateEscrowDeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/escrow", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrow-deals"] }),
  });
}

export function useProgressMilestone(dealId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<any>(`/api/v1/escrow/${dealId}/progress`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrow-deals"] }),
  });
}
