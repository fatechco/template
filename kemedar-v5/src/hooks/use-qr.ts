"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useMyQRCodes() {
  return useQuery({ queryKey: ["my-qr-codes"], queryFn: () => apiClient.get<any[]>("/api/v1/qr") });
}
export function useGenerateQR() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { codeType: string; targetId?: string; targetUrl?: string; frameText?: string }) => apiClient.post<any>("/api/v1/qr", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["my-qr-codes"] }) });
}
export function useQRAnalytics(qrId: string) {
  return useQuery({ queryKey: ["qr-analytics", qrId], queryFn: () => apiClient.get<any>(`/api/v1/qr/${qrId}/analytics`), enabled: !!qrId });
}
