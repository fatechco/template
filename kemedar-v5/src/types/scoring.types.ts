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
  category: "positive" | "negative";
  points: number;
  dimension: string | null;
  description: string | null;
  metaData: Record<string, any> | null;
  createdAt: string;
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
  calculatedAt: string | null;
}

export interface DNAInsight {
  id: string;
  userId: string;
  insightType: string;
  title: string | null;
  description: string | null;
  confidence: number | null;
  data: Record<string, any> | null;
}
