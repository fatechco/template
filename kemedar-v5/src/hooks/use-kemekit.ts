"use client";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useCalculateKemeKitBOQ() {
  return useMutation({ mutationFn: (data: { templateId?: string; dimensions: Record<string, any> }) => apiClient.post<any>("/api/v1/kemekit/calculate", data) });
}
