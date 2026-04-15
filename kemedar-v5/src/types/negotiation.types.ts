export type NegotiationStatus = "active" | "counter_offered" | "agreed" | "rejected" | "expired" | "cancelled";
export type NegotiationOfferStatus = "pending" | "accepted" | "rejected" | "countered" | "expired" | "withdrawn";

export interface NegotiationSession {
  id: string;
  propertyId: string | null;
  buyerUserId: string;
  sellerUserId: string;
  swapMatchId: string | null;
  status: NegotiationStatus;
  currentOfferPrice: number | null;
  currency: string;
  roundsCount: number;
  maxRounds: number | null;
  buyerStrategy: Record<string, any> | null;
  sellerStrategy: Record<string, any> | null;
  startedAt: string;
  lastActivityAt: string | null;
  agreedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  offers?: NegotiationOffer[];
  messages?: NegotiationMessage[];
  analytics?: NegotiationAnalytics;
}

export interface NegotiationOffer {
  id: string;
  sessionId: string;
  offeredByUserId: string;
  offerPrice: number;
  currency: string;
  conditions: Record<string, any> | null;
  message: string | null;
  messageAr: string | null;
  status: NegotiationOfferStatus;
  respondedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface NegotiationMessage {
  id: string;
  sessionId: string;
  senderUserId: string;
  content: string;
  contentAr: string | null;
  messageType: string;
  isRead: boolean;
  isAiGenerated: boolean;
  createdAt: string;
}

export interface NegotiationAnalytics {
  id: string;
  sessionId: string;
  totalRounds: number;
  priceDropPercent: number | null;
  avgResponseTime: number | null;
  buyerLeverage: Record<string, any> | null;
  sellerLeverage: Record<string, any> | null;
  aiRecommendation: Record<string, any> | null;
  outcome: string | null;
}
