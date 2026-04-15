"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useAuctions(filters: { status?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ["auctions", filters],
    queryFn: () => apiClient.list<any>("/api/v1/auctions", filters),
  });
}

export function useCreateAuction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/auctions", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auctions"] }),
  });
}

export function usePlaceBid(auctionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { bidAmountEGP: number; bidType?: string }) => apiClient.post<any>(`/api/v1/auctions/${auctionId}/bid`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["auctions"] }),
  });
}

export function useRegisterBidder(auctionId: string) {
  return useMutation({
    mutationFn: () => apiClient.post<any>(`/api/v1/auctions/${auctionId}/register`),
  });
}
