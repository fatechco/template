"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useCommunities(filters: { cityId?: string; type?: string } = {}) {
  return useQuery({ queryKey: ["communities", filters], queryFn: () => apiClient.list<any>("/api/v1/community", filters) });
}
export function useCommunityPosts(communityId: string, page = 1) {
  return useQuery({ queryKey: ["community-posts", communityId, page], queryFn: () => apiClient.list<any>(`/api/v1/community/${communityId}/posts`, { page }), enabled: !!communityId });
}
export function useCreatePost(communityId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Record<string, any>) => apiClient.post<any>(`/api/v1/community/${communityId}/posts`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["community-posts", communityId] }) });
}
export function useJoinCommunity() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: { communityId: string; unitNumber?: string }) => apiClient.post<any>(`/api/v1/community/${data.communityId}/join`, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["communities"] }) });
}
