export type EscrowDealStatus =
  | "draft" | "awaiting_deposit" | "deposit_received" | "in_progress"
  | "awaiting_completion" | "completed" | "disputed" | "cancelled"
  | "refunded" | "expired";

export type PaymentStructure = "full_cash" | "cash_installment" | "mortgage" | "developer_plan" | "mixed";

export interface EscrowDeal {
  id: string;
  dealNumber: string;
  buyerId: string;
  buyer?: Pick<import("./user.types").User, "id" | "name" | "email">;
  sellerId: string;
  seller?: Pick<import("./user.types").User, "id" | "name" | "email">;
  agentId: string | null;
  franchiseOwnerId: string | null;
  lawyerId: string | null;
  propertyId: string;
  property?: Pick<import("./property.types").Property, "id" | "title" | "titleAr" | "featuredImage">;
  negotiationSessionId: string | null;
  matchId: string | null;
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
  platformFeePercent: number | null;
  agentFeeAmount: number | null;
  franchiseOwnerFeeAmount: number | null;
  isDisputed: boolean;
  buyerConfirmedCompletion: boolean;
  sellerConfirmedCompletion: boolean;
  buyerRating: number | null;
  sellerRating: number | null;
  buyerReview: string | null;
  sellerReview: string | null;
  createdAt: string;
  updatedAt: string;
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
  conditions: Record<string, any> | null;
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
  paymentReference: string | null;
  status: string;
  processedAt: string | null;
  notes: string | null;
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
  resolvedByAdminId: string | null;
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
