"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useConciergeJourneys() {
  return useQuery({ queryKey: ["concierge-journeys"], queryFn: () => apiClient.list<any>("/api/v1/concierge/journey") });
}
export function useCompleteTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient.post<any>(`/api/v1/concierge/tasks/${taskId}/complete`), onSuccess: () => qc.invalidateQueries({ queryKey: ["concierge-journeys"] }) });
}
