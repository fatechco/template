import { NextRequest } from "next/server";
import { aiService } from "@/server/services/ai.service";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const { query, preferences } = await request.json();
    const result = await aiService.processPropertySearch(query, preferences);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
