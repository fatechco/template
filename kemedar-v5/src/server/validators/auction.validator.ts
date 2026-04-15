import { z } from "zod";

export const createAuctionSchema = z.object({
  propertyId: z.string().min(1),
  startingPriceEGP: z.number().positive(),
  reservePriceEGP: z.number().positive().optional(),
  buyNowPriceEGP: z.number().positive().optional(),
  auctionStartAt: z.string().datetime(),
  auctionEndAt: z.string().datetime(),
  minBidIncrementEGP: z.number().positive().optional(),
});

export const placeBidSchema = z.object({
  bidAmountEGP: z.number().positive(),
  bidType: z.enum(["manual", "auto_max", "buy_now"]).default("manual"),
});
