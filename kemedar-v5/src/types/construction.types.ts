export type FinishProjectStatus = "draft" | "planning" | "in_progress" | "inspection" | "snagging" | "completed" | "on_hold" | "cancelled";

export interface BuildProject {
  id: string;
  userId: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  projectType: string | null;
  floorPlanUrl: string | null;
  floorPlanAnalysis: Record<string, any> | null;
  totalAreaSqm: number | null;
  rooms: Record<string, any> | null;
  estimatedCostEGP: number | null;
  costBreakdown: Record<string, any> | null;
  boqGenerated: boolean;
  boqItems: Record<string, any> | null;
  laborEstimate: number | null;
  materialEstimate: number | null;
  status: string;
  createdAt: string;
}

export interface FinishProject {
  id: string;
  userId: string;
  propertyId: string | null;
  title: string;
  status: FinishProjectStatus;
  totalAreaSqm: number | null;
  budgetMinEGP: number | null;
  budgetMaxEGP: number | null;
  actualSpentEGP: number | null;
  completionPercent: number;
  startDate: string | null;
  expectedEndDate: string | null;
  actualEndDate: string | null;
  qualityScore: number | null;
  snaggingCount: number;
  createdAt: string;
  updatedAt: string;
  phases?: FinishPhase[];
  snaggingItems?: FinishSnaggingItem[];
}

export interface FinishPhase {
  id: string;
  projectId: string;
  phaseName: string;
  phaseNameAr: string | null;
  phaseOrder: number;
  status: string;
  budgetEGP: number | null;
  actualCostEGP: number | null;
  completionPercent: number;
  startDate: string | null;
  endDate: string | null;
}

export interface FinishBOQ {
  id: string;
  projectId: string;
  title: string | null;
  totalCostEGP: number | null;
  laborCostEGP: number | null;
  materialCostEGP: number | null;
  items: Record<string, any> | null;
  sections: Record<string, any> | null;
  generatedByAI: boolean;
  version: number;
  status: string;
}

export interface FinishSnaggingItem {
  id: string;
  projectId: string;
  phaseId: string | null;
  title: string;
  description: string | null;
  severity: string;
  photoUrls: string[];
  location: string | null;
  status: string;
  assignedToId: string | null;
  resolvedAt: string | null;
}

export interface BOQItem {
  id: string;
  name: string;
  nameAr: string | null;
  category: string | null;
  unit: string | null;
  pricePerUnitEGP: number | null;
  calcRule: string;
  coverageSqm: number | null;
  wasteMargin: number | null;
  isOptional: boolean;
  kemetroKeywords: string[];
  sortOrder: number;
}
