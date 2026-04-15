// ── Pagination ──
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

// ── Pagination Params ──
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Enums (mirrors Prisma) ──
export type UserRole =
  | "super_user" | "admin" | "user" | "agent" | "agency" | "developer"
  | "franchise_owner" | "franchise_owner_area" | "franchise_owner_country"
  | "product_seller" | "kemetro_seller" | "product_buyer" | "shipper"
  | "kemework_professional" | "kemework_company" | "kemework_customer" | "customer_kemework";

export type PropertyImportStatus = "imported" | "moved_to_pending" | "activated" | "rejected" | "duplicate";
export type OwnerContactStatus = "not_contacted" | "contacted" | "no_answer" | "interested" | "not_interested" | "activated";

export type EscrowDealStatus = "draft" | "awaiting_deposit" | "deposit_received" | "in_progress" | "awaiting_completion" | "completed" | "disputed" | "cancelled" | "refunded" | "expired";
export type PaymentStructure = "full_cash" | "cash_installment" | "mortgage" | "developer_plan" | "mixed";

export type AuctionStatus = "draft" | "pending_approval" | "approved" | "deposit_requested" | "deposit_paid" | "registration_open" | "live" | "ended_winner" | "ended_no_bids" | "ended_reserve_not_met" | "cancelled" | "payment_received" | "legal_in_progress" | "completed" | "failed";
export type AuctionBidType = "manual" | "auto_max" | "buy_now";
export type AuctionEventType = "auction_created" | "auction_approved" | "seller_deposit_paid" | "registration_opened" | "bidder_registered" | "bid_placed" | "bid_outbid" | "autobid_triggered" | "time_extended" | "reserve_met" | "buy_now_triggered" | "auction_ended" | "winner_notified" | "payment_received" | "deposit_refunded" | "deposit_forfeited" | "legal_started" | "completed" | "cancelled" | "fraud_flagged";
export type DepositStatus = "pending" | "held" | "refunded" | "forfeited";
export type RegistrationStatus = "pending_payment" | "active" | "suspended" | "winner" | "refund_pending" | "refunded" | "forfeited";

export type FracOfferingType = "fractional_sale" | "fractional_investment" | "hybrid";
export type FracOfferingStatus = "draft" | "under_review" | "valuation_set" | "approved" | "tokenizing" | "live" | "sold_out" | "closed" | "rejected" | "suspended";
export type YieldFrequency = "monthly" | "quarterly" | "annual";
export type FracTransactionType = "purchase" | "transfer" | "yield_paid" | "refund";
export type FracTransactionStatus = "pending" | "confirmed" | "failed" | "refunded";
export type PaymentMethod = "card" | "bank_transfer" | "wallet" | "kemecoins";
export type NearNetworkType = "mainnet" | "testnet";

export type SwapStatus = "draft" | "published" | "matching" | "matched" | "negotiating" | "agreed" | "escrow" | "completed" | "cancelled" | "expired";
export type SwapMatchStatus = "pending" | "viewed" | "interested" | "negotiating" | "agreed" | "rejected" | "expired";

export type NegotiationStatus = "active" | "counter_offered" | "agreed" | "rejected" | "expired" | "cancelled";
export type NegotiationOfferStatus = "pending" | "accepted" | "rejected" | "countered" | "expired" | "withdrawn";

export type CommunityType = "compound" | "building" | "district" | "interest_group" | "professional";
export type CommunityMemberRole = "member" | "moderator" | "admin" | "super_admin";
export type CommunityPostType = "announcement" | "help_request" | "question" | "general" | "complaint" | "alert" | "poll" | "marketplace" | "recommendation" | "event";
export type ModerationStatus = "pending" | "approved" | "flagged" | "removed";

export type LiveEventType = "webinar" | "open_house" | "property_tour" | "q_and_a" | "market_update" | "panel";
export type LiveEventStatus = "draft" | "scheduled" | "live" | "ended" | "cancelled";

export type ServiceOrderStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled" | "disputed";
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "expired" | "trial";
export type ConciergeTaskStatus = "pending" | "in_progress" | "completed" | "skipped" | "cancelled";
export type FinishProjectStatus = "draft" | "planning" | "in_progress" | "inspection" | "snagging" | "completed" | "on_hold" | "cancelled";
export type BOQItemCalcRule = "per_sqm" | "per_linear_meter" | "fixed_qty" | "ratio_to_parent" | "per_unit";
export type QRCodeType = "property" | "project" | "profile" | "store" | "event" | "custom";
export type ScoreEventCategory = "positive" | "negative";

export type CRMLeadStatus = "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost" | "dormant";
export type CRMOpportunityStage = "lead" | "qualified" | "proposal" | "negotiation" | "contract" | "closed_won" | "closed_lost";
