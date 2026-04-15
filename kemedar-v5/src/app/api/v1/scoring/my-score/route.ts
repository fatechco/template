import { NextRequest } from "next/server";
import { scoringService } from "@/server/services/scoring.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const score = await scoringService.getMyScore(session.userId);
    return successResponse(score);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
