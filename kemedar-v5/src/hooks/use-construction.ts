"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useFinishProjects(filters: { status?: string } = {}) {
  return useQuery({ queryKey: ["finish-projects", filters], queryFn: () => apiClient.list<any>("/api/v1/construction/projects", filters) });
}
export function useGenerateBOQ() {
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/construction/boq", data) });
}
