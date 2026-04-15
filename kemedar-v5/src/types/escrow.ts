import type { EscrowDealStatus, PaymentStructure } from "./common";

export interface EscrowDeal {
  id: string;
  dealNumber: string;
  buyerId: string;
  sellerId: string;
  agentId: string | null;
  franchiseOwnerId: string | null;
  lawyerId: string | null;
  propertyId: string;
  negotiationSessionId: string | null;
  agreedPrice: number;
  currency: string;
  agreedPricePerSqm: number | null;
  paymentStructure: PaymentStructure;
  earnestMoneyAmount: number | null;
  earnestMoneyPercent: number | null;
  totalEscrowAmount: number | null;
  paymentSchedule: Record<string, any>[] | null;
  conditions: Record<string, any>[] | null;
  status: EscrowDealStatus;
  currentMilestone: string | null;
  completionPercent: number;
  depositDeadline: string | null;
  completionDeadline: string | null;
  dealStartedAt: string | null;
  dealCompletedAt: string | null;
  totalDeposited: number;
  totalReleased: number;
  totalRefunded: number;
  platformFeeAmount: number | null;
  isDisputed: boolean;
  buyerConfirmedCompletion: boolean;
  sellerConfirmedCompletion: boolean;
  buyerRating: number | null;
  sellerRating: number | null;
  createdAt: string;
  updatedAt: string;

  buyer?: { id: string; name: string | null; email: string };
  seller?: { id: string; name: string | null; email: string };
  property?: { id: string; title: string; titleAr: string | null; featuredImage: string | null };
  milestones?: EscrowMilestone[];
  transactions?: EscrowTransaction[];
  disputes?: EscrowDispute[];
  documents?: EscrowDocument[];
}

export interface EscrowMilestone {
  id: string;
  dealId: string;
  milestoneOrder: number;
  title: string;
  titleAr: string | null;
  description: string | null;
  amountDue: number | null;
  amountPercent: number | null;
  status: string;
  dueDate: string | null;
  completedAt: string | null;
  completedByUserId: string | null;
  evidenceUrls: string[];
  notes: string | null;
}

export interface EscrowTransaction {
  id: string;
  dealId: string;
  transactionType: string;
  amount: number;
  currency: string;
  fromUserId: string | null;
  toUserId: string | null;
  paymentMethod: string | null;
  status: string;
  processedAt: string | null;
  createdAt: string;
}

export interface EscrowDispute {
  id: string;
  dealId: string;
  raisedByUserId: string;
  reason: string;
  description: string | null;
  evidenceUrls: string[];
  status: string;
  resolution: string | null;
  aiRecommendation: Record<string, any> | null;
  resolvedAt: string | null;
}

export interface EscrowDocument {
  id: string;
  dealId: string;
  documentType: string;
  title: string;
  fileUrl: string;
  uploadedById: string;
  isVerified: boolean;
}

export interface CreateEscrowDealRequest {
  buyerId: string;
  sellerId: string;
  propertyId: string;
  agreedPrice: number;
  paymentStructure?: string;
  earnestMoneyPercent?: number;
}
