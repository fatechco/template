"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useServiceOrders(filters: { status?: string; page?: number } = {}) {
  return useQuery({ queryKey: ["service-orders", filters], queryFn: () => apiClient.list<any>("/api/v1/kemework/tasks", filters) });
}
export function useSnapAndFix() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { imageUrl: string }) => apiClient.post<any>("/api/v1/kemework/snap", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["service-orders"] }) });
}
export function useConvertSnapToTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { snapSessionId: string; editedDescription?: string; userBudgetEGP?: number }) => apiClient.post<any>("/api/v1/kemework/tasks", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["service-orders"] }) });
}
export function useUpdateTaskStatus(taskId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { status: string }) => apiClient.put<any>(`/api/v1/kemework/tasks/${taskId}/status`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["service-orders"] }) });
}
