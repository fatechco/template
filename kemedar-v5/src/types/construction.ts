import type { FinishProjectStatus } from "./common";

export interface FinishProject {
  id: string;
  userId: string;
  propertyId: string | null;
  title: string;
  totalAreaSqm: number | null;
  budgetMinEGP: number | null;
  budgetMaxEGP: number | null;
  actualSpentEGP: number | null;
  status: FinishProjectStatus;
  completionPercent: number;
  startDate: string | null;
  expectedEndDate: string | null;
  qualityScore: number | null;
  snaggingCount: number;
  createdAt: string;
}

export interface FinishPhase {
  id: string;
  projectId: string;
  phaseName: string;
  phaseOrder: number;
  status: string;
  budgetEGP: number | null;
  actualCostEGP: number | null;
  completionPercent: number;
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
}
