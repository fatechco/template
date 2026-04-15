"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLiveEvents(filters: { status?: string } = {}) {
  return useQuery({ queryKey: ["live-events", filters], queryFn: () => apiClient.list<any>("/api/v1/live-events", filters) });
}
export function useRegisterForEvent(eventId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => apiClient.post<any>(`/api/v1/live-events/${eventId}/register`), onSuccess: () => qc.invalidateQueries({ queryKey: ["live-events"] }) });
}
