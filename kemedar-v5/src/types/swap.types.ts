export type SwapStatus = "draft" | "published" | "matching" | "matched" | "negotiating" | "agreed" | "escrow" | "completed" | "cancelled" | "expired";
export type SwapMatchStatus = "pending" | "viewed" | "interested" | "negotiating" | "agreed" | "rejected" | "expired";

export interface SwapIntent {
  id: string;
  userId: string;
  offeredPropertyId: string;
  offeredProperty?: import("./property.types").Property;
  desiredCategories: string[];
  desiredCityIds: string[];
  desiredProvinceIds: string[];
  desiredDistrictIds: string[];
  desiredMinArea: number | null;
  desiredMaxArea: number | null;
  desiredMinBedrooms: number | null;
  desiredMaxBedrooms: number | null;
  desiredMinBathrooms: number | null;
  acceptsCashGap: boolean;
  maxCashGapPayEGP: number | null;
  maxCashGapReceiveEGP: number | null;
  status: SwapStatus;
  totalMatches: number;
  publishedAt: string | null;
  expiresAt: string | null;
  notes: string | null;
  notesAr: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SwapMatch {
  id: string;
  intentAId: string;
  intentA?: SwapIntent;
  intentBId: string;
  intentB?: SwapIntent;
  matchScore: number | null;
  matchReasons: Record<string, any> | null;
  cashGapAmount: number | null;
  cashGapDirection: string | null;
  status: SwapMatchStatus;
  aInterested: boolean;
  bInterested: boolean;
  negotiationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SwapGapOffer {
  id: string;
  matchId: string;
  offeredById: string;
  amountEGP: number;
  direction: string;
  status: string;
  respondedAt: string | null;
}

export interface SwapNegotiationMessage {
  id: string;
  matchId: string;
  senderUserId: string;
  content: string;
  contentAr: string | null;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}
