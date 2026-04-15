"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useAdvanceVerification(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { newLevel: number }) => apiClient.post<any>(`/api/v1/verification/${propertyId}/advance`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["property", propertyId] }) });
}
export function usePropertyCertificate(propertyId: string) {
  return useQuery({ queryKey: ["certificate", propertyId], queryFn: () => apiClient.get<any>(`/api/v1/verification/${propertyId}/certificate`), enabled: !!propertyId });
}
