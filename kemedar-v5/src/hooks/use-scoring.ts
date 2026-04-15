"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useMyScore() {
  return useQuery({ queryKey: ["my-score"], queryFn: () => apiClient.get<any>("/api/v1/scoring/my-score") });
}
export function useMyDNA() {
  return useQuery({ queryKey: ["my-dna"], queryFn: () => apiClient.get<any>("/api/v1/users/dna") });
}
