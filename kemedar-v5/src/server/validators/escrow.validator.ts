import { z } from "zod";

export const createEscrowDealSchema = z.object({
  buyerId: z.string().min(1),
  sellerId: z.string().min(1),
  propertyId: z.string().min(1),
  agreedPrice: z.number().positive(),
  paymentStructure: z.enum(["full_cash", "cash_installment", "mortgage", "developer_plan", "mixed"]).default("full_cash"),
  earnestMoneyPercent: z.number().min(1).max(50).optional(),
});
