import { z } from "zod";

export const submitOfferingSchema = z.object({
  propertyId: z.string().min(1),
  offeringTitle: z.string().min(3),
  offeringTitleAr: z.string().optional(),
  offeringDescription: z.string().optional(),
  totalTokenSupply: z.number().int().positive(),
  tokenPriceEGP: z.number().positive(),
  tokensForSale: z.number().int().positive(),
  offeringType: z.enum(["fractional_sale", "fractional_investment", "hybrid"]),
  expectedAnnualYieldPercent: z.number().optional(),
  yieldFrequency: z.enum(["monthly", "quarterly", "annual"]).optional(),
});

export const purchaseTokensSchema = z.object({
  tokensAmount: z.number().int().positive(),
  paymentMethod: z.enum(["card", "bank_transfer", "wallet", "kemecoins"]),
});
