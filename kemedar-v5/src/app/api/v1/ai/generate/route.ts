import { NextRequest } from "next/server";
import { aiService } from "@/server/services/ai.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const { entityType, data, language } = await request.json();
    const result = await aiService.generateContent(entityType, data, language);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
