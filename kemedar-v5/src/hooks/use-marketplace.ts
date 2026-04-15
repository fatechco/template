"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useMarketplaceProducts(filters: { query?: string; category?: string; minPrice?: number; maxPrice?: number; page?: number } = {}) {
  return useQuery({ queryKey: ["marketplace-products", filters], queryFn: () => apiClient.list<any>("/api/v1/marketplace/products", filters) });
}
export function useFlashDeals() {
  return useQuery({ queryKey: ["flash-deals"], queryFn: () => apiClient.list<any>("/api/v1/marketplace/flash") });
}
export function usePlaceFlashOrder(dealId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { quantity?: number }) => apiClient.post<any>(`/api/v1/marketplace/flash/${dealId}/order`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["flash-deals"] }) });
}
