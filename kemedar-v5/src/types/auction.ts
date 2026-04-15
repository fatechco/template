import type { AuctionStatus, AuctionBidType, AuctionEventType, DepositStatus, RegistrationStatus } from "./common";
import type { PropertyListItem } from "./property";

export interface PropertyAuction {
  id: string;
  propertyId: string;
  sellerUserId: string;
  auctionCode: string;
  startingPriceEGP: number;
  reservePriceEGP: number | null;
  buyNowPriceEGP: number | null;
  currentHighestBidEGP: number | null;
  currentHighestBidderId: string | null;
  totalBidsCount: number;
  uniqueBiddersCount: number;
  minBidIncrementEGP: number;
  sellerDepositAmountEGP: number | null;
  sellerDepositPaid: boolean;
  buyerDepositPercent: number;
  auctionStartAt: string | null;
  auctionEndAt: string | null;
  extensionMinutes: number;
  maxExtensions: number;
  extensionsUsed: number;
  status: AuctionStatus;
  platformCommissionPercent: number;
  winnerId: string | null;
  winnerPaymentDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  property?: PropertyListItem;
  bids?: AuctionBid[];
  registrations?: AuctionRegistration[];
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderUserId: string;
  bidAmountEGP: number;
  bidType: AuctionBidType;
  isWinning: boolean;
  isAutoBid: boolean;
  autoMaxAmountEGP: number | null;
  bidSequenceNumber: number;
  wasExtended: boolean;
  extensionMinutesAdded: number | null;
  bidPlacedAt: string;
  bidder?: { id: string; name: string | null };
}

export interface AuctionEvent {
  id: string;
  auctionId: string;
  eventType: AuctionEventType;
  actorUserId: string | null;
  actorType: string;
  description: string;
  metaData: Record<string, any> | null;
  recordedAt: string;
}

export interface AuctionRegistration {
  id: string;
  auctionId: string;
  bidderUserId: string;
  kycVerified: boolean;
  proofOfFundsUploaded: boolean;
  depositAmountEGP: number;
  depositPaid: boolean;
  depositStatus: DepositStatus;
  hasAutoBid: boolean;
  autoBidMaxEGP: number | null;
  registrationStatus: RegistrationStatus;
  isWinner: boolean;
  totalBidsPlaced: number;
  highestBidPlaced: number;
  registeredAt: string;
}

export interface AuctionSettings {
  id: string;
  isActive: boolean;
  sellerDepositPercent: number;
  sellerDepositMinEGP: number;
  buyerDepositPercent: number;
  buyerDepositMinEGP: number;
  winnerPaymentDeadlineHours: number;
  defaultMinBidIncrementEGP: number;
  defaultExtensionMinutes: number;
  defaultMaxExtensions: number;
  platformCommissionPercent: number;
  requireVerifyProLevel: number;
  requireBuyerKYC: boolean;
}

export interface CreateAuctionRequest {
  propertyId: string;
  startingPriceEGP: number;
  reservePriceEGP?: number;
  buyNowPriceEGP?: number;
  auctionStartAt: string;
  auctionEndAt: string;
  minBidIncrementEGP?: number;
}

export interface PlaceBidRequest {
  bidAmountEGP: number;
  bidType?: AuctionBidType;
}
