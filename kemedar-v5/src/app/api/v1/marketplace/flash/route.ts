import { NextRequest } from "next/server";
import { marketplaceService } from "@/server/services/marketplace.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    const userId = session?.userId || "anonymous";
    const result = await marketplaceService.matchFlashDeals(userId);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
