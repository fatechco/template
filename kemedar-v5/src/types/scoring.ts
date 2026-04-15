import type { ScoreEventCategory } from "./common";

export interface KemedarScore {
  id: string;
  userId: string;
  overallScore: number;
  grade: string | null;
  percentile: number | null;
  trend: string | null;
  dimensions: Record<string, number> | null;
  lastCalculatedAt: string | null;
  version: number;
}

export interface ScoreEvent {
  id: string;
  userId: string;
  eventType: string;
  category: ScoreEventCategory;
  points: number;
  dimension: string | null;
  description: string | null;
  metaData: Record<string, any> | null;
  createdAt: string;
}

export interface ScoreBadge {
  id: string;
  userId: string;
  badgeType: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  iconUrl: string | null;
  earnedAt: string;
}

export interface NeighborhoodLifeScore {
  id: string;
  districtId: string | null;
  cityId: string | null;
  overallScore: number | null;
  walkability: number | null;
  noise: number | null;
  safety: number | null;
  education: number | null;
  healthcare: number | null;
  connectivity: number | null;
  greenSpace: number | null;
  convenience: number | null;
}
