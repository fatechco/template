export type AuctionStatus =
  | "draft" | "pending_approval" | "approved" | "deposit_requested"
  | "deposit_paid" | "registration_open" | "live" | "ended_winner"
  | "ended_no_bids" | "ended_reserve_not_met" | "cancelled"
  | "payment_received" | "legal_in_progress" | "completed" | "failed";

export type AuctionBidType = "manual" | "auto_max" | "buy_now";

export type AuctionEventType =
  | "auction_created" | "auction_approved" | "seller_deposit_paid"
  | "registration_opened" | "bidder_registered" | "bid_placed"
  | "bid_outbid" | "autobid_triggered" | "time_extended"
  | "reserve_met" | "buy_now_triggered" | "auction_ended"
  | "winner_notified" | "payment_received" | "deposit_refunded"
  | "deposit_forfeited" | "legal_started" | "completed"
  | "cancelled" | "fraud_flagged";

export type DepositStatus = "pending" | "held" | "refunded" | "forfeited";
export type RegistrationStatus = "pending_payment" | "active" | "suspended" | "winner" | "refund_pending" | "refunded" | "forfeited";

export interface PropertyAuction {
  id: string;
  propertyId: string;
  property?: import("./property.types").Property;
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
  bids?: AuctionBid[];
  events?: AuctionEvent[];
  registrations?: AuctionRegistration[];
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderUserId: string;
  bidder?: Pick<import("./user.types").User, "id" | "name">;
  bidAmountEGP: number;
  bidType: AuctionBidType;
  isWinning: boolean;
  isAutoBid: boolean;
  autoMaxAmountEGP: number | null;
  ipAddress: string | null;
  deviceInfo: string | null;
  bidSequenceNumber: number;
  wasExtended: boolean;
  extensionMinutesAdded: number | null;
  bidPlacedAt: string;
  createdAt: string;
}

export interface AuctionEvent {
  id: string;
  auctionId: string;
  eventType: AuctionEventType;
  actorUserId: string | null;
  actorType: "seller" | "bidder" | "admin" | "system";
  description: string;
  metaData: Record<string, any> | null;
  recordedAt: string;
}

export interface AuctionRegistration {
  id: string;
  auctionId: string;
  bidderUserId: string;
  bidder?: Pick<import("./user.types").User, "id" | "name" | "email">;
  kycVerified: boolean;
  proofOfFundsUploaded: boolean;
  proofOfFundsUrl: string | null;
  proofOfFundsApprovedByAdmin: boolean;
  depositAmountEGP: number;
  depositPaid: boolean;
  depositPaidAt: string | null;
  depositTransactionId: string | null;
  depositStatus: DepositStatus;
  depositRefundedAt: string | null;
  hasAutoBid: boolean;
  autoBidMaxEGP: number | null;
  autoBidIncrement: number | null;
  registrationStatus: RegistrationStatus;
  isWinner: boolean;
  totalBidsPlaced: number;
  highestBidPlaced: number;
  lastBidAt: string | null;
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
  maxAuctionDurationDays: number;
  minAuctionDurationDays: number;
  featuredAuctionFeeEGP: number;
}

export interface AuctionWatchlist {
  id: string;
  auctionId: string;
  userId: string;
  notifyOnBid: boolean;
  notifyOnEnd: boolean;
}
