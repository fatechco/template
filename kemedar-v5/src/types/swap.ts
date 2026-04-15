import type { SwapStatus, SwapMatchStatus } from "./common";

export interface SwapIntent {
  id: string;
  userId: string;
  offeredPropertyId: string;
  desiredCategories: string[];
  desiredCityIds: string[];
  desiredProvinceIds: string[];
  desiredDistrictIds: string[];
  desiredMinArea: number | null;
  desiredMaxArea: number | null;
  desiredMinBedrooms: number | null;
  acceptsCashGap: boolean;
  maxCashGapPayEGP: number | null;
  maxCashGapReceiveEGP: number | null;
  status: SwapStatus;
  totalMatches: number;
  publishedAt: string | null;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
  offeredProperty?: { id: string; title: string; priceAmount: number | null; featuredImage: string | null; category?: { name: string }; city?: { name: string } };
}

export interface SwapMatch {
  id: string;
  intentAId: string;
  intentBId: string;
  matchScore: number | null;
  matchReasons: string[] | null;
  cashGapAmount: number | null;
  cashGapDirection: string | null;
  status: SwapMatchStatus;
  aInterested: boolean;
  bInterested: boolean;
  negotiationId: string | null;
  createdAt: string;
  intentA?: SwapIntent;
  intentB?: SwapIntent;
}
