"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useCRMContacts(filters: { search?: string; leadStatus?: string; page?: number } = {}) {
  return useQuery({ queryKey: ["crm-contacts", filters], queryFn: () => apiClient.list<any>("/api/v1/crm/contacts", filters) });
}
export function useCRMContact(id: string) {
  return useQuery({ queryKey: ["crm-contact", id], queryFn: () => apiClient.get<any>(`/api/v1/crm/contacts/${id}`), enabled: !!id });
}
export function useCreateCRMContact() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/crm/contacts", data), onSuccess: () => qc.invalidateQueries({ queryKey: ["crm-contacts"] }) });
}
export function useCRMOpportunities(filters: { contactId?: string; stage?: string } = {}) {
  return useQuery({ queryKey: ["crm-opportunities", filters], queryFn: () => apiClient.list<any>("/api/v1/crm/opportunities", filters) });
}
