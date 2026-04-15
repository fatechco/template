export type FracOfferingStatus =
  | "draft" | "under_review" | "valuation_set" | "approved"
  | "tokenizing" | "live" | "sold_out" | "closed" | "rejected" | "suspended";

export type FracOfferingType = "fractional_sale" | "fractional_investment" | "hybrid";
export type YieldFrequency = "monthly" | "quarterly" | "annual";
export type FracTransactionType = "purchase" | "transfer" | "yield_paid" | "refund";
export type FracTransactionStatus = "pending" | "confirmed" | "failed" | "refunded";
export type PaymentMethod = "card" | "bank_transfer" | "wallet" | "kemecoins";

export interface FracProperty {
  id: string;
  propertyId: string;
  property?: import("./property.types").Property;
  submittedByUserId: string;
  approvedByAdminId: string | null;
  offeringTitle: string;
  offeringTitleAr: string | null;
  offeringDescription: string | null;
  offeringDescriptionAr: string | null;
  offeringSlug: string | null;
  propertyValuationEGP: number | null;
  propertyValuationUSD: number | null;
  totalTokenSupply: number;
  tokenPriceEGP: number;
  tokenPriceUSD: number | null;
  tokenSymbol: string | null;
  tokenName: string | null;
  tokensForSale: number;
  tokensRetainedBySeller: number | null;
  tokensSold: number;
  tokensAvailable: number | null;
  minTokensPerBuyer: number;
  maxTokensPerBuyer: number | null;
  offeringType: FracOfferingType;
  expectedAnnualYieldPercent: number | null;
  yieldFrequency: YieldFrequency | null;
  offeringStartDate: string | null;
  offeringEndDate: string | null;
  nearContractAddress: string | null;
  nearTokenContractDeployed: boolean;
  nearNetworkType: "mainnet" | "testnet";
  nearTransactionHash: string | null;
  nearExplorerUrl: string | null;
  status: FracOfferingStatus;
  rejectionReason: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tokens?: FracToken[];
  transactions?: FracTransaction[];
}

export interface FracToken {
  id: string;
  fracPropertyId: string;
  propertyId: string;
  holderUserId: string;
  holder?: Pick<import("./user.types").User, "id" | "name">;
  tokensHeld: number;
  tokensHeldPercent: number | null;
  averagePurchasePriceEGP: number | null;
  totalInvestedEGP: number | null;
  nearTokenBalance: number | null;
  nearLastSyncedAt: string | null;
  nearTransactionHashes: string[];
  isActive: boolean;
  firstPurchasedAt: string | null;
  lastTransactionAt: string | null;
}

export interface FracTransaction {
  id: string;
  fracPropertyId: string;
  transactionType: FracTransactionType;
  fromUserId: string | null;
  toUserId: string;
  tokensAmount: number;
  pricePerTokenEGP: number | null;
  totalAmountEGP: number;
  platformFeeEGP: number | null;
  nearTransactionHash: string | null;
  nearConfirmed: boolean;
  paymentMethod: PaymentMethod | null;
  status: FracTransactionStatus;
  notes: string | null;
  createdAt: string;
}

export interface FracYieldDistribution {
  id: string;
  fracPropertyId: string;
  periodStart: string;
  periodEnd: string;
  totalYieldEGP: number;
  perTokenYieldEGP: number;
  totalTokensEligible: number;
  holdersCount: number;
  status: string;
  distributedAt: string | null;
}

export interface FracKYC {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string | null;
  documentUrl: string | null;
  selfieUrl: string | null;
  status: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}
