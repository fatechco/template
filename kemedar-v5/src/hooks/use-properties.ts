"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface PropertyFilters {
  categoryId?: string;
  purposeId?: string;
  cityId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isFeatured?: boolean;
  isAuction?: boolean;
  isFracOffering?: boolean;
}

export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => apiClient.list<any>("/api/v1/properties", filters),
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => apiClient.get<any>(`/api/v1/properties/${id}`),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => apiClient.post<any>("/api/v1/properties", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, any>) => apiClient.put<any>(`/api/v1/properties/${id}`, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property", vars.id] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<any>(`/api/v1/properties/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function usePropertyValuation(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post<any>(`/api/v1/properties/${propertyId}/valuation`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["property", propertyId] }),
  });
}
