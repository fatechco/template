"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLocations() {
  return useQuery({ queryKey: ["locations"], queryFn: () => apiClient.get<any>("/api/v1/locations"), staleTime: 10 * 60 * 1000 });
}
