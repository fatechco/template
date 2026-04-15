import type { NegotiationStatus, NegotiationOfferStatus } from "./common";

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
  startedAt: string;
  lastActivityAt: string | null;
  agreedAt: string | null;
  expiresAt: string | null;
  offers?: NegotiationOffer[];
  messages?: NegotiationMessage[];
  analytics?: NegotiationAnalytics | null;
}

export interface NegotiationOffer {
  id: string;
  sessionId: string;
  offeredByUserId: string;
  offerPrice: number;
  currency: string;
  conditions: Record<string, any> | null;
  message: string | null;
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
  outcome: string | null;
}
