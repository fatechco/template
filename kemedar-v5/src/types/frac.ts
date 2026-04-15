import type { FracOfferingType, FracOfferingStatus, YieldFrequency, FracTransactionType, FracTransactionStatus, PaymentMethod, NearNetworkType } from "./common";

export interface FracProperty {
  id: string;
  propertyId: string;
  submittedByUserId: string;
  approvedByAdminId: string | null;
  offeringTitle: string;
  offeringTitleAr: string | null;
  offeringDescription: string | null;
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
  nearNetworkType: NearNetworkType;
  status: FracOfferingStatus;
  rejectionReason: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;

  property?: { id: string; title: string; featuredImage: string | null; category?: { name: string }; city?: { name: string } };
  tokens?: FracToken[];
  transactions?: FracTransaction[];
}

export interface FracToken {
  id: string;
  fracPropertyId: string;
  propertyId: string;
  holderUserId: string;
  holderNearWalletAddress: string | null;
  tokensHeld: number;
  tokensHeldPercent: number | null;
  averagePurchasePriceEGP: number | null;
  totalInvestedEGP: number | null;
  nearTokenBalance: number | null;
  isActive: boolean;
  firstPurchasedAt: string | null;
  lastTransactionAt: string | null;
  fracProperty?: FracProperty;
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

export interface SubmitFracOfferingRequest {
  propertyId: string;
  offeringTitle: string;
  offeringTitleAr?: string;
  offeringDescription?: string;
  totalTokenSupply: number;
  tokenPriceEGP: number;
  tokensForSale: number;
  offeringType: string;
  expectedAnnualYieldPercent?: number;
  yieldFrequency?: string;
}

export interface PurchaseTokensRequest {
  tokensAmount: number;
  paymentMethod: string;
}
