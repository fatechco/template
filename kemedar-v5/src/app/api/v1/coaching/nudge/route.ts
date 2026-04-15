import { NextRequest } from "next/server";
import { coachingService } from "@/server/services/coaching.service";
import { extractAuth } from "@/server/middleware/auth.middleware";
import { successResponse, errorResponse } from "@/server/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const session = await extractAuth(request);
    if (!session) return errorResponse("Unauthorized", 401);
    const body = await request.json();
    const nudge = await coachingService.generateNudge(session.userId, body);
    return successResponse(nudge, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
